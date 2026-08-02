import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Clock,
  DollarSign,
  FileCode,
  Layers,
  Copy,
} from 'lucide-react';
import { ScanResult, RefactoringSuggestion, PageType } from '../types';

interface CodeQualityViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const CodeQualityView: React.FC<CodeQualityViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  const [selectedRefactor, setSelectedRefactor] = useState<RefactoringSuggestion>(
    scanResult.refactorings[0]
  );
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Code Quality & Refactoring Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated code debt estimation, cyclomatic complexity metrics, and ML-recommended refactoring diffs
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Gemini for Refactoring Code</span>
        </button>
      </div>

      {/* Tech Debt Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Maintainability Score</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {scanResult.scores.maintainability}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High code readability index</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-amber-950/10">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Technical Debt Hours</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {scanResult.metrics.technicalDebtHours} hrs
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Refactoring estimate</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-amber-950/10">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Refactoring Cost</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            ${scanResult.metrics.debtCostUSD}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Based on $90/hr dev rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Avg Cyclomatic Complexity</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1">12.4</div>
          <div className="text-[11px] text-slate-400 mt-1">Max branch depth: 24</div>
        </div>
      </div>

      {/* Refactoring Suggestions Grid & Code Diff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Suggestions Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>ML Recommended Refactorings</span>
          </h3>

          <div className="space-y-2">
            {scanResult.refactorings.map((ref) => {
              const isSelected = ref.id === selectedRefactor.id;
              return (
                <div
                  key={ref.id}
                  onClick={() => setSelectedRefactor(ref)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{ref.componentName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                        ref.severity === 'high'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ref.severity}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium line-clamp-1">{ref.title}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                    SHAP Impact: +{ref.shapImpact} maintainability
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code Diff Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedRefactor.title}</span>
                <span className="text-xs text-slate-400 font-normal">({selectedRefactor.componentName})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedRefactor.explanation}</p>
            </div>

            <button
              onClick={() => copyToClipboard(selectedRefactor.afterCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Refactored Code'}</span>
            </button>
          </div>

          {/* Before Code Block */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>Before (High Complexity / Re-render Risk)</span>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-red-900/30 text-[11px] font-mono text-red-300/90 overflow-x-auto leading-relaxed">
              {selectedRefactor.beforeCode}
            </pre>
          </div>

          {/* After Code Block */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>After (Refactored Clean Code)</span>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-emerald-900/30 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {selectedRefactor.afterCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
