import React from 'react';
import {
  GitBranch,
  GitCommit,
  User,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ScanResult, PageType } from '../types';

interface GitViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
}

export const GitView: React.FC<GitViewProps> = ({ scanResult, onNavigate }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          <span>Repository Mining &amp; Git Evolution</span>
        </h2>
        <p className="text-xs text-slate-400">
          Track code churn, commit frequency, and maintainability deltas across repository history
        </p>
      </div>

      {/* Code Churn vs Maintainability Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Maintainability Index Trend Over Recent Weeks</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scanResult.gitActivity}>
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="maintainabilityIndex" stroke="#10b981" fill="#059669" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
