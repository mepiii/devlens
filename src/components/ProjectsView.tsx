import React, { useState } from 'react';
import {
  FolderGit2,
  GitBranch,
  Plus,
  Upload,
  Search,
  Check,
  Zap,
  Globe,
  Code2,
  Boxes,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Project, PageType } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  onNavigate: (p: PageType) => void;
  onOpenImportModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNavigate,
  onOpenImportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.framework.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12 bg-[#0A0A0B] text-[#E0E0E0]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            Project Repository Intelligence
          </h2>
          <p className="text-xs text-[#888] font-mono">
            Import real GitHub repositories or local source code folders for client-side ML analysis
          </p>
        </div>

        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Import Project / GitHub Repository</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter projects by name, framework, or repository..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const isCurrent = p.id === activeProject.id;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-100">{p.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      {p.framework}
                    </span>
                    {p.isSample && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Benchmark Sample
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{p.repository}</span>
                    <span>•</span>
                    <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                    <span>{p.branch}</span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>

              {/* Metrics summary */}
              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Health Score</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{p.healthScore}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Lines of Code</div>
                  <div className="text-lg font-bold text-slate-200 font-mono">
                    {(p.totalLinesOfCode / 1000).toFixed(1)}k
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Components</div>
                  <div className="text-lg font-bold text-indigo-400 font-mono">{p.componentCount}</div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">Last Scan: {p.lastScanDate}</span>

                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => onSelectProject(p)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectProject(p);
                      onNavigate('scan');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Run ML Scan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
