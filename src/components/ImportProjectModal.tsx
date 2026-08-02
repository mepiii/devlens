import React, { useState, useRef } from 'react';
import {
  FolderGit2,
  FolderPlus,
  Github,
  UploadCloud,
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Zap,
  Boxes,
} from 'lucide-react';
import { Project, ScanResult } from '../types';
import { fetchGitHubRepository, importLocalFiles } from '../lib/projectImporter';

interface ImportProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (project: Project, scanResult: ScanResult) => void;
  isInitialSetup?: boolean;
}

export const ImportProjectModal: React.FC<ImportProjectModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  isInitialSetup = false,
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'local'>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const popularRepos = [
    { label: 'Zustand State Manager', url: 'https://github.com/pmndrs/zustand', stars: '42k' },
    { label: 'Tailwind CSS', url: 'https://github.com/tailwindlabs/tailwindcss', stars: '80k' },
    { label: 'Shadcn UI', url: 'https://github.com/shadcn-ui/ui', stars: '65k' },
    { label: 'Lucide Icons', url: 'https://github.com/lucide-icons/lucide', stars: '14k' },
  ];

  const handleGitHubSubmit = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || githubUrl;
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStage('Connecting to GitHub API...');

    try {
      setLoadingStage('Downloading repository file tree & source code AST...');
      const { project, scanResult } = await fetchGitHubRepository(targetUrl);
      setLoadingStage('Executing Local ML Analysis & SHAP feature calculation...');
      
      onImportSuccess(project, scanResult);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch GitHub repository. Please check URL or rate limits.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStage('Reading local file system AST...');

    try {
      const { project, scanResult } = await importLocalFiles(files);
      setLoadingStage('Running client-side Random Forest & token similarity models...');
      onImportSuccess(project, scanResult);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse local files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStage('Processing dropped folder and files...');

    try {
      const { project, scanResult } = await importLocalFiles(files);
      onImportSuccess(project, scanResult);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process dropped files.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121214] border border-[#222224] rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-[#E0E0E0] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222224] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                {isInitialSetup ? 'Welcome to DevLens ML' : 'Import Project Repository'}
              </h2>
              <p className="text-xs text-[#888] font-mono">
                {isInitialSetup
                  ? 'Connect a GitHub repository or local code folder to start ML analysis'
                  : 'Analyze real GitHub repos or local source code files without mock data'}
              </p>
            </div>
          </div>
          {!isInitialSetup && (
            <button
              onClick={onClose}
              className="text-[#888] hover:text-white text-sm font-mono p-1 rounded hover:bg-[#1A1A1E]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#0A0A0B] border border-[#222224] p-1 rounded font-mono text-xs">
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-2 rounded flex items-center justify-center gap-2 font-semibold transition-all ${
              activeTab === 'github' ? 'bg-indigo-600 text-white' : 'text-[#888] hover:text-white'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 rounded flex items-center justify-center gap-2 font-semibold transition-all ${
              activeTab === 'local' ? 'bg-indigo-600 text-white' : 'text-[#888] hover:text-white'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Local Directory / Files</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 bg-[#0E0E10] border border-[#222224] rounded-lg text-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">{loadingStage}</div>
            <p className="text-[11px] text-[#666]">
              Parsing source code AST, building token matrices, running Decision Trees &amp; SHAP attribution models.
            </p>
          </div>
        ) : activeTab === 'github' ? (
          <form onSubmit={(e) => handleGitHubSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#BBB] mb-1.5 font-semibold">
                GitHub Repository URL or owner/repo
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-[#666] absolute left-3 top-3" />
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/facebook/react or pmndrs/zustand"
                  className="w-full bg-[#0A0A0B] border border-[#222224] rounded pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Quick Presets:</div>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {popularRepos.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => {
                      setGithubUrl(preset.url);
                      handleGitHubSubmit(undefined, preset.url);
                    }}
                    className="p-2.5 bg-[#0E0E10] hover:bg-[#1A1A1E] border border-[#222224] hover:border-indigo-600 rounded text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-indigo-400">{preset.label}</div>
                      <div className="text-[10px] text-[#666]">{preset.url.replace('https://github.com/', '')}</div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold bg-[#121214] px-1.5 py-0.5 rounded border border-[#222224]">
                      ★ {preset.stars}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {!isInitialSetup && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-[#1A1A1E] text-[#888] hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!githubUrl.trim()}
                className="px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30"
              >
                <span>Import &amp; Analyze Repo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#333] hover:border-indigo-500 bg-[#0E0E10] rounded-lg p-8 text-center space-y-3 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto" />
              <div>
                <div className="text-xs font-semibold text-white font-mono">Drag &amp; Drop Local Project Folder Here</div>
                <div className="text-[11px] text-[#666] font-mono mt-1">Supports React, Next.js, Vue, TypeScript, JSX, CSS</div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 font-mono">
                {/* Folder Select Input */}
                <input
                  type="file"
                  // @ts-ignore
                  webkitdirectory=""
                  directory=""
                  multiple
                  ref={folderInputRef}
                  onChange={handleLocalFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Select Local Folder...</span>
                </button>

                {/* Multiple Files Select Input */}
                <input
                  type="file"
                  multiple
                  accept=".ts,.tsx,.js,.jsx,.vue,.json,.css"
                  ref={fileInputRef}
                  onChange={handleLocalFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#1A1A1E] hover:bg-[#222228] text-white border border-[#333] rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Select Individual Files...</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[#666] font-mono leading-relaxed">
              * Local code stays inside your browser environment. Source files are parsed locally via TypeScript AST tokenizers to calculate cyclomatic complexity, reusability scores, and WCAG accessibility issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
