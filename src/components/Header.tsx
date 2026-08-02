import React from 'react';
import {
  Search,
  RotateCw,
  Sparkles,
  GitBranch,
  FolderGit2,
  ChevronDown,
} from 'lucide-react';
import { Project, PageType } from '../types';

interface HeaderProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  onTriggerQuickScan: () => void;
  onOpenAssistant: () => void;
  onOpenImportModal: () => void;
  currentPage: PageType;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onTriggerQuickScan,
  onOpenAssistant,
  onOpenImportModal,
  currentPage,
}) => {
  return (
    <header className="h-16 bg-[#0E0E10] border-b border-[#222224] px-6 flex items-center justify-between z-10 flex-shrink-0">
      {/* Title & Page Context */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold tracking-tight uppercase text-white flex items-center gap-2">
            <span>DevLens ML</span>
            <span className="text-[#666] font-mono text-[11px] font-normal">v1.2.0-stable</span>
          </h1>
          <p className="text-[10px] text-[#888] font-mono tracking-wider uppercase mt-0.5">
            {activeProject
              ? `ANALYZING: /projects/${activeProject.name.toLowerCase().replace(/\s+/g, '-')} (${activeProject.branch})`
              : 'NO REPOSITORY LOADED - IMPORT GITHUB REPO OR LOCAL FILES'}
          </p>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-4">
        {/* Model & Confidence Bar */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px] font-mono">
          <span className="text-[#666]">MODEL:</span>
          <span className="text-indigo-400 font-semibold">XGBoost-Frontend-Core</span>
          <span className="text-[#333]">|</span>
          <span className="text-[#666]">CONFIDENCE:</span>
          <span className="text-emerald-400 font-semibold">94.2%</span>
        </div>

        {/* Project Dropdown Selector */}
        {activeProject && (
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121214] border border-[#222224] text-[#E0E0E0] text-xs font-medium cursor-pointer hover:bg-[#1A1A1E] transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="max-w-[130px] truncate font-semibold">{activeProject.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A1E] text-[#888] font-mono border border-[#333]">
                {activeProject.framework}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
            </div>

            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#121214] border border-[#222224] rounded-lg shadow-2xl py-1 z-50 hidden group-hover:block border-t-2 border-t-indigo-600">
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#666] uppercase tracking-wider flex justify-between items-center">
                <span>Select Project</span>
                <button
                  onClick={onOpenImportModal}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  + Add New
                </button>
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1A1A1E] transition-colors ${
                    p.id === activeProject.id ? 'bg-indigo-950/40 text-indigo-300 font-semibold' : 'text-[#BBB]'
                  }`}
                >
                  <div>
                    <div className="font-medium text-[#E0E0E0]">{p.name}</div>
                    <div className="text-[10px] text-[#666] flex items-center gap-1.5 mt-0.5 font-mono">
                      <GitBranch className="w-2.5 h-2.5 text-[#555]" />
                      <span>{p.branch}</span>
                      <span>•</span>
                      <span>{p.componentCount} comps</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A0A0B] font-mono text-indigo-400 border border-[#222224]">
                    {p.framework}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Import Repo Button */}
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold transition-colors shadow-sm"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Import Repo</span>
        </button>

        {/* Quick Re-scan Button */}
        {activeProject && (
          <button
            onClick={onTriggerQuickScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1A1A1E] hover:bg-[#222228] text-white border border-[#333] text-xs font-semibold transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rescan</span>
          </button>
        )}

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1A1A1E] hover:bg-[#222228] text-indigo-400 border border-indigo-900/40 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Assistant</span>
        </button>
      </div>
    </header>
  );
};
