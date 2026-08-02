import React, { useState } from 'react';
import {
  Boxes,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
} from 'lucide-react';
import { ScanResult, ComponentMetric, PageType } from '../types';

interface ComponentsViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const ComponentsView: React.FC<ComponentsViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  const [filter, setFilter] = useState<'all' | 'duplicates' | 'oversized' | 'unused'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComp, setSelectedComp] = useState<ComponentMetric | null>(null);

  const filteredComponents = scanResult.components.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.path.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'duplicates') return !!c.duplicateOf;
    if (filter === 'oversized') return c.isOversized;
    if (filter === 'unused') return c.isUnused;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-400" />
            <span>Component Intelligence & CodeBERT Vector Search</span>
          </h2>
          <p className="text-xs text-slate-400">
            Detect duplicate UI component patterns, oversized files, and unused code blocks automatically
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Component Refactoring</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Total Components</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
            {scanResult.metrics.totalComponents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Analyzed in project graph</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-amber-950/10">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Components</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {scanResult.metrics.duplicateComponentsCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">&gt;90% CodeBERT similarity</div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 p-4 rounded-xl bg-red-950/10">
          <div className="text-xs text-red-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Oversized Components</span>
          </div>
          <div className="text-2xl font-bold text-red-300 font-mono mt-1">
            {scanResult.metrics.oversizedComponentsCount}
          </div>
          <div className="text-[11px] text-red-400/80 mt-1">&gt;300 LOC &amp; high props</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Dead / Unused Components</span>
          </div>
          <div className="text-2xl font-bold text-slate-300 font-mono mt-1">
            {scanResult.metrics.unusedComponentsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0 external imports</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'duplicates', 'oversized', 'unused'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Components' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search component name or path..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Component Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComponents.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedComp(c)}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>{c.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-mono">
                    {c.category}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                  {c.path}
                </p>
              </div>

              {c.duplicateSimilarity && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  {c.duplicateSimilarity}% Duplicate
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div>
                <div className="text-[10px] text-slate-500">LOC</div>
                <div className="font-bold text-slate-200 font-mono">{c.linesOfCode}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Complexity</div>
                <div className="font-bold text-amber-400 font-mono">{c.cyclomaticComplexity}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Reusability</div>
                <div className="font-bold text-emerald-400 font-mono">{c.reusabilityScore}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Props</div>
                <div className="font-bold text-indigo-400 font-mono">{c.propsCount}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {c.isOversized && (
                  <span className="text-red-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Oversized
                  </span>
                )}
                {c.isUnused && (
                  <span className="text-slate-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    Dead Code
                  </span>
                )}
                {c.reRenderHotspot && (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Re-render Hotspot
                  </span>
                )}
              </div>

              <span className="text-indigo-400 font-medium hover:underline flex items-center gap-1">
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Component Detail Drawer Modal */}
      {selectedComp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedComp.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedComp.path}</p>
              </div>
              <button
                onClick={() => setSelectedComp(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">ML Vector Intelligence Analysis</div>
                {selectedComp.duplicateOf && (
                  <div className="text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-500/30">
                    <strong>CodeBERT Match:</strong> Shares {selectedComp.duplicateSimilarity}% AST token overlap with <em>{selectedComp.duplicateOf}</em>.
                  </div>
                )}
                <div className="text-slate-300">
                  Cyclomatic Complexity score of <strong>{selectedComp.cyclomaticComplexity}</strong> indicates nested conditional branches requiring component extraction.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedComp(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedComp(null);
                    onNavigate('code-quality');
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View Code Refactoring Suggestion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
