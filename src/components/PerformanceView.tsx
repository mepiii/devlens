import React from 'react';
import {
  Zap,
  Layers,
  AlertTriangle,
  Sparkles,
  Gauge,
  HardDrive,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ScanResult, PageType } from '../types';

interface PerformanceViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  const bundleData = [
    { name: 'Core Framework (React/DOM)', sizeMB: 0.38, color: '#6366f1' },
    { name: 'App Components', sizeMB: 0.45, color: '#3b82f6' },
    { name: 'UI & Motion Libraries', sizeMB: 0.32, color: '#8b5cf6' },
    { name: 'Utils & Unused Icons', sizeMB: 0.27, color: '#f59e0b' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Performance Intelligence &amp; Render Bottleneck Predictor</span>
          </h2>
          <p className="text-xs text-slate-400">
            Machine learning estimations for bundle growth, slow rendering components, and re-render hot spots
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Optimize Bundle Size</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Performance Score</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {scanResult.scores.performance}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">LightHouse est. score</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>Estimated Bundle Size</span>
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono mt-1">
            {scanResult.metrics.bundleEstimatedSizeMB} MB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Gzipped output</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl bg-amber-950/10">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Re-Render Hotspots</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {scanResult.components.filter((c) => c.reRenderHotspot).length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Missing React.memo</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Tree-Shaking Savings</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">180 KB</div>
          <div className="text-[11px] text-slate-400 mt-1">Replace legacy imports</div>
        </div>
      </div>

      {/* Bundle Size Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Production Bundle Chunk Composition</span>
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bundleData}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit=" MB" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="sizeMB" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Slow Re-Render Hotspots List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Predicted Re-Render Hotspots</span>
          </h3>

          <div className="space-y-2.5">
            {scanResult.components
              .filter((c) => c.reRenderHotspot)
              .map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.path}</div>
                  </div>

                  <button
                    onClick={() => onNavigate('code-quality')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <span>Apply Memoization</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
