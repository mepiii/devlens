import React from 'react';
import {
  Palette,
  CheckCircle2,
  AlertCircle,
  Type,
  Layout,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ScanResult, PageType } from '../types';

interface DesignViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const DesignView: React.FC<DesignViewProps> = ({
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
            <Palette className="w-5 h-5 text-purple-400" />
            <span>Design System & Token Consistency Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated visual design audit for color palettes, typography scales, spacing grids, and border radii
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Consolidate Color Tokens</span>
        </button>
      </div>

      {/* Top Scores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Design Consistency Score</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
            {scanResult.scores.designConsistency}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">91% Tailwind token adherence</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Unique Colors Found</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
            {scanResult.colors.length}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            {scanResult.colors.filter((c) => c.isOutlier).length} outlier hex codes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Typography Scale Adherence</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">94%</div>
          <div className="text-[11px] text-slate-400 mt-1">2 non-compliant font sizes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Spacing Grid (4px / 8px)</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">98%</div>
          <div className="text-[11px] text-slate-400 mt-1">Consistent padding &amp; margin</div>
        </div>
      </div>

      {/* Color Palette Audit Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Extracted Color Palette &amp; Outlier Detection</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {scanResult.colors.filter((c) => c.isOutlier).length} Off-Palette Outliers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {scanResult.colors.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border space-y-2 transition-all ${
                c.isOutlier
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-sm'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div
                className="h-10 rounded-lg shadow-inner border border-white/10"
                style={{ backgroundColor: c.hex }}
              ></div>

              <div>
                <div className="text-xs font-mono font-bold text-slate-200">{c.hex}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{c.mappedToken}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">{c.usages} usages</div>
              </div>

              {c.isOutlier && (
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Outlier
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Typography Scale Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          <span>Typography Token &amp; Font Size Audit</span>
        </h3>

        <div className="space-y-2">
          {scanResult.typography.map((t, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-serif text-slate-200 text-sm font-bold">
                  Aa
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {t.fontSize} • {t.fontWeight} weight
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{t.fontFamily}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-mono">{t.usages} instances</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    t.isScaleCompliant
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {t.isScaleCompliant ? 'Scale Compliant' : 'Non-Standard Size'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
