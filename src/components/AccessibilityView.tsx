import React from 'react';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Type,
  Maximize2,
} from 'lucide-react';
import { ScanResult, PageType } from '../types';

interface AccessibilityViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const AccessibilityView: React.FC<AccessibilityViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>Accessibility Intelligence &amp; WCAG 2.1 Audit</span>
          </h2>
          <p className="text-xs text-slate-400">
            Predictive evaluation of color contrast, semantic HTML structures, ARIA tags, and keyboard navigation
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Fix Accessibility Violations</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">WCAG 2.1 Score</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {scanResult.metrics.wcagScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">AA Standard Compliant</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-amber-950/10">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Contrast Failures</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">2</div>
          <div className="text-[11px] text-amber-400/80 mt-1">&lt;4.5:1 ratio on muted text</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Missing ARIA Labels</div>
          <div className="text-2xl font-bold text-slate-200 font-mono mt-1">1</div>
          <div className="text-[11px] text-slate-400 mt-1">IconButton missing aria-label</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Semantic HTML Structure</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">96%</div>
          <div className="text-[11px] text-slate-400 mt-1">Proper section &amp; main usage</div>
        </div>
      </div>

      {/* WCAG Violation Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Detected WCAG 2.1 Compliance Issues</span>
        </h3>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-500/30 flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <span>Color Contrast Violation (WCAG 1.4.3)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Medium
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Text color <code>#94a3b8</code> on background <code>#1e293b</code> yields a contrast ratio of <strong>3.8:1</strong> (minimum required: 4.5:1).
              </p>
              <div className="text-[11px] text-slate-500 font-mono">Found in ProductGridCard.tsx (Line 42)</div>
            </div>

            <button
              onClick={onOpenAssistant}
              className="text-xs px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Fix Color Ratio
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>Interactive Icon Missing Name (WCAG 4.1.2)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  Low
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Button containing only SVG icon in CartDrawerModal requires <code>aria-label</code> or <code>title</code> for screen readers.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">Found in CartDrawerModal.tsx (Line 88)</div>
            </div>

            <button
              onClick={onOpenAssistant}
              className="text-xs px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Add ARIA Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
