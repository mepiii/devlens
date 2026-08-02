import React from 'react';
import {
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { ScanResult, PageType } from '../types';

interface DependenciesViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const DependenciesView: React.FC<DependenciesViewProps> = ({
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
            <PackageCheck className="w-5 h-5 text-indigo-400" />
            <span>Dependency Health &amp; Maintenance Risk Predictor</span>
          </h2>
          <p className="text-xs text-slate-400">
            Evaluate package licenses, version drift, vulnerabilities, and maintenance activity
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Update Vulnerable Packages</span>
        </button>
      </div>

      {/* Package Health Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100">Project Dependency Graph &amp; Risk Metrics</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Package Name</th>
                <th className="p-3">Installed</th>
                <th className="p-3">Latest</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Vulnerabilities</th>
                <th className="p-3">License</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scanResult.dependencies.map((dep, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                    <span>{dep.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({dep.weeklyDownloads}/wk)</span>
                  </td>
                  <td className="p-3 text-slate-300">{dep.currentVersion}</td>
                  <td className="p-3 text-indigo-300">{dep.latestVersion}</td>
                  <td className="p-3 font-bold text-emerald-400">{dep.healthScore}%</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        dep.riskLevel === 'low'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : dep.riskLevel === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {dep.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-red-400">
                    {dep.vulnerabilities > 0 ? `${dep.vulnerabilities} High CVEs` : '0'}
                  </td>
                  <td className="p-3 text-slate-400">{dep.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
