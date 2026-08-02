import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Scan,
  Boxes,
  Code2,
  Palette,
  Zap,
  Eye,
  PackageCheck,
  GitBranch,
  BrainCircuit,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Sparkles,
} from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onOpenAssistant: () => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onOpenAssistant }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, category: 'Overview' },
    { id: 'scan', label: 'Run ML Scan', icon: Scan, badge: 'Live', category: 'Intelligence' },
    { id: 'components', label: 'Components', icon: Boxes, category: 'Intelligence' },
    { id: 'code-quality', label: 'Code Quality', icon: Code2, category: 'Intelligence' },
    { id: 'design', label: 'Design System', icon: Palette, category: 'Intelligence' },
    { id: 'performance', label: 'Performance', icon: Zap, category: 'Intelligence' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, category: 'Intelligence' },
    { id: 'dependencies', label: 'Dependencies', icon: PackageCheck, category: 'Intelligence' },
    { id: 'git', label: 'Git Repository', icon: GitBranch, category: 'Intelligence' },
    { id: 'ml-models', label: 'ML Dashboard', icon: BrainCircuit, badge: 'Models', category: 'Analytics & Config' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'Analytics & Config' },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, category: 'Analytics & Config' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'Analytics & Config' },
  ];

  const categories = ['Overview', 'Intelligence', 'Analytics & Config'];

  let globalIndex = 1;

  return (
    <aside className="w-60 bg-[#0D0D0F] border-r border-[#222224] flex flex-col h-screen text-[#E0E0E0] flex-shrink-0 select-none">
      {/* App Branding Header */}
      <div className="h-16 px-5 border-b border-[#222224] flex items-center justify-between bg-[#0E0E10]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30 font-mono">
            D
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-sm tracking-tight uppercase">DevLens ML</span>
              <span className="text-[10px] text-[#666] font-mono">v1.2</span>
            </div>
            <p className="text-[10px] text-[#888] font-mono tracking-wider">OFFLINE INTELLIGENCE</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="px-3 mb-2 text-[10px] font-mono tracking-[0.2em] text-[#666] uppercase font-semibold">
              {cat}
            </div>
            <div className="space-y-1">
              {navItems
                .filter((item) => item.category === cat)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const itemNum = String(globalIndex++).padStart(2, '0');
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1A1A1E] text-white border border-[#333338] shadow-sm font-semibold'
                          : 'text-[#888] hover:text-white hover:bg-[#151518]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-[11px] ${isActive ? 'text-indigo-400 font-bold' : 'opacity-40'}`}>
                          {itemNum}
                        </span>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-[#666]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                            item.badge === 'Live'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* ML Suggestion Banner */}
      <div className="p-3 border-t border-[#222224] bg-[#0A0A0B]">
        <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ML Insight
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#BBB]">
            Detected 4 duplicate UI components in <span className="text-white font-mono">/atoms</span> directory.
          </p>
          <button
            onClick={onOpenAssistant}
            className="w-full mt-2 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ask Assistant</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
