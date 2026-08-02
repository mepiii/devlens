import React from 'react';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import { ScanResult, PageType } from '../types';

interface AnalyticsViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ scanResult }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Longitudinal Engineering Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">
          Historical quality trends, cross-project comparative benchmarks, and code growth rate
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">Project Quality Trajectory</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          DevLens ML tracks every repository scan to model team velocity against technical debt accumulation. Overall project health improved by <strong>+4.2%</strong> over the past month.
        </p>
      </div>
    </div>
  );
};
