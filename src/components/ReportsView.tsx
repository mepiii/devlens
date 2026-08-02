import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ScanResult, PageType } from '../types';

interface ReportsViewProps {
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onOpenAssistant: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  const [downloadMsg, setDownloadMsg] = useState('');

  const triggerExport = (type: 'pdf' | 'csv' | 'json') => {
    setDownloadMsg(`Generated DevLens_ML_${scanResult.projectName.replace(/\s+/g, '_')}_Report.${type}`);
    setTimeout(() => setDownloadMsg(''), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Executive Reports &amp; Export Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            Export comprehensive PDF audit reports, CSV metric matrices, or raw JSON feature vectors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerExport('pdf')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive PDF</span>
          </button>
          <button
            onClick={() => triggerExport('csv')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV Data</span>
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Report Preview Document */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 shadow-xl max-w-4xl mx-auto text-slate-200">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">DevLens ML Engineering Audit Report</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Project: {scanResult.projectName}</p>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>Date: {scanResult.timestamp}</div>
            <div className="text-indigo-400 font-bold">Score: {scanResult.scores.overallQuality}/100</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2 text-xs leading-relaxed">
          <h3 className="text-sm font-semibold text-slate-100">1. Executive Summary</h3>
          <p className="text-slate-300">
            DevLens ML conducted an offline machine learning analysis on <strong>{scanResult.projectName}</strong>. The project achieved an overall Engineering Quality Score of <strong>{scanResult.scores.overallQuality}/100</strong>. Key strengths include strong design system token compliance ({scanResult.scores.designConsistency}%) and WCAG 2.1 accessibility ({scanResult.scores.accessibility}%).
          </p>
        </div>

        {/* Technical Debt Breakdown */}
        <div className="space-y-2 text-xs leading-relaxed">
          <h3 className="text-sm font-semibold text-slate-100">2. Technical Debt &amp; Refactoring Estimate</h3>
          <p className="text-slate-300">
            Random Forest feature vector classifiers estimated a technical debt workload of <strong>{scanResult.metrics.technicalDebtHours} developer hours</strong> (approx <strong>${scanResult.metrics.debtCostUSD} USD</strong>). Primary cost drivers are oversized component splitting and React.memo optimizations.
          </p>
        </div>
      </div>
    </div>
  );
};
