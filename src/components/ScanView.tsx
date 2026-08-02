import React, { useState } from 'react';
import {
  Scan,
  CheckCircle2,
  Play,
  RotateCw,
  Layers,
  BarChart3,
  ArrowRight,
  Code2,
  FileCode,
  Upload,
} from 'lucide-react';
import { Project, ScanResult, PageType } from '../types';
import { analyzeSourceCode, CodeFile, SAMPLE_CODE_REPOSITORIES } from '../lib/mlEngine';

interface ScanViewProps {
  activeProject: Project;
  scanResult: ScanResult;
  onNavigate: (p: PageType) => void;
  onUpdateScanResult?: (newResult: ScanResult) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  activeProject,
  scanResult,
  onNavigate,
  onUpdateScanResult,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'custom_code'>('pipeline');

  const [customCode, setCustomCode] = useState<string>(`import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export function CustomProductCard({ title, price, image, rating, reviews }) {
  const [qty, setQty] = useState(1);

  // Hotspot unmemoized calculation
  const calculateTotal = () => price * qty;

  return (
    <div className="p-4 bg-[#121214] border border-[#222224] rounded-lg">
      <img src={image} className="h-40 w-full object-cover rounded" />
      <h3 className="text-sm font-bold text-white mt-2">{title}</h3>
      <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
        <Star className="w-3.5 h-3.5 fill-amber-400" />
        <span>{rating}</span>
        <span className="text-[#666]">({reviews})</span>
      </div>
      <div className="flex items-center justify-between mt-3 font-mono">
        <span className="text-base font-bold text-white">\${calculateTotal()}</span>
        <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">
          Add ({qty})
        </button>
      </div>
    </div>
  );
}`);

  const [customFilePath, setCustomFilePath] = useState('src/components/CustomProductCard.tsx');

  const steps = [
    { title: 'Source Code Parser', desc: 'Parsing source directory, component AST & dependency tree' },
    { title: 'Feature Extractor', desc: 'Computing cyclomatic complexity, coupling index & design tokens' },
    { title: 'Vector Dataset Generator', desc: 'Building normalized vector feature matrices for client-side inference' },
    { title: 'Local ML Inference Engine', desc: 'Executing Random Forest, XGBoost & CodeBERT Jaccard token search' },
    { title: 'SHAP Prediction Matrix', desc: 'Computing Shapley values & maintainability predictions' },
  ];

  const startScan = (customFiles?: CodeFile[]) => {
    setIsScanning(true);
    setCurrentStep(0);
    setLogs(['[00:00.1] Initializing Pure TS Client-Side ML Engine (No Python Required)...']);

    const filesToAnalyze: CodeFile[] = customFiles || SAMPLE_CODE_REPOSITORIES[activeProject.id] || [
      { path: customFilePath, content: customCode },
      {
        path: 'src/components/search/ProductTile.tsx',
        content: customCode.replace('CustomProductCard', 'ProductTile'),
      },
    ];

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          setIsScanning(false);

          // Run real local ML analysis engine
          const analysis = analyzeSourceCode(filesToAnalyze);
          const updatedScanResult: ScanResult = {
            projectId: activeProject.id,
            projectName: activeProject.name,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            scores: analysis.scores,
            metrics: {
              totalLOC: analysis.totalLOC,
              totalFiles: analysis.totalFiles,
              totalComponents: analysis.totalComponents,
              duplicateComponentsCount: analysis.duplicateComponentsCount,
              oversizedComponentsCount: analysis.oversizedComponentsCount,
              unusedComponentsCount: analysis.unusedComponentsCount,
              technicalDebtHours: analysis.metrics.technicalDebtHours,
              debtCostUSD: analysis.metrics.debtCostUSD,
              bundleEstimatedSizeMB: analysis.metrics.bundleEstimatedSizeMB,
              wcagScore: analysis.metrics.wcagScore,
            },
            components: analysis.components,
            refactorings: analysis.refactorings,
            featureImportances: analysis.featureImportances,
            modelPredictions: analysis.modelPredictions,
            colors: analysis.colors,
            typography: analysis.typography,
            dependencies: scanResult.dependencies,
            gitActivity: scanResult.gitActivity,
          };

          if (onUpdateScanResult) {
            onUpdateScanResult(updatedScanResult);
          }

          setLogs((l) => [
            ...l,
            `[00:04.8] Local ML scan complete! Quality score: ${analysis.scores.overallQuality}/100`,
            `[00:05.0] Evaluated ${analysis.totalLOC} LOC across ${analysis.components.length} components.`,
            `[00:05.2] Calculated debt cost: $${analysis.metrics.debtCostUSD}. Generated ${analysis.refactorings.length} refactorings.`,
          ]);
          return steps.length;
        }

        const logMessages = [
          `[00:01.2] Parsed source AST. Analyzed code structure across files.`,
          `[00:02.1] Extracted cyclomatic complexity vectors & hook usage.`,
          `[00:03.0] Generated normalized vector feature matrix.`,
          `[00:03.9] Local Random Forest & XGBoost decision tree inferences executed.`,
          `[00:04.5] Calculated SHAP feature attribution weights & debt cost matrix.`,
        ];

        setLogs((l) => [...l, logMessages[next - 1] || 'Processing...']);
        return next;
      });
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12 bg-[#0A0A0B] text-[#E0E0E0]">
      {/* Top Scanner Banner */}
      <div className="bg-[#121214] border border-[#222224] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Local Machine Learning Code Scanner
            </h2>
          </div>
          <p className="text-xs text-[#888] font-mono">
            Target: <strong className="text-white">{activeProject.name}</strong> ({activeProject.framework}) • Client-Side JS/TS Engine (No Python Needed)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0E0E10] border border-[#222224] p-1 rounded font-mono text-xs">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'pipeline' ? 'bg-indigo-600 text-white font-semibold' : 'text-[#888] hover:text-white'
              }`}
            >
              Pipeline View
            </button>
            <button
              onClick={() => setActiveTab('custom_code')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'custom_code' ? 'bg-indigo-600 text-white font-semibold' : 'text-[#888] hover:text-white'
              }`}
            >
              Custom Code Editor
            </button>
          </div>

          <button
            onClick={() => startScan()}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all font-mono"
          >
            {isScanning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isScanning ? 'Running Local ML...' : 'Run Local ML Scan'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'custom_code' ? (
        <div className="bg-[#121214] border border-[#222224] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222224] pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-white">
                Live Source Code &amp; Component Scanner
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#888]">
              <span>File Path:</span>
              <input
                type="text"
                value={customFilePath}
                onChange={(e) => setCustomFilePath(e.target.value)}
                className="bg-[#0A0A0B] border border-[#222224] text-white px-2 py-1 rounded text-xs w-64 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <p className="text-xs text-[#BBB]">
            Paste or edit any React, TypeScript, or Vue source code below. The local ML engine will parse AST tokens, calculate cyclomatic complexity, detect duplicate vectors, extract color tokens, and compute SHAP feature importances directly in your browser.
          </p>

          <div className="relative font-mono">
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              rows={14}
              className="w-full bg-[#0E0E10] border border-[#222224] rounded p-4 text-xs font-mono text-[#E0E0E0] focus:outline-none focus:border-indigo-600 leading-relaxed scrollbar-thin resize-y"
              placeholder="// Paste React or TypeScript code here..."
            />
          </div>

          <div className="flex justify-between items-center pt-2 font-mono">
            <div className="text-xs text-[#666]">
              LOC: <strong className="text-white">{customCode.split('\n').length}</strong> | Characters: <strong className="text-white">{customCode.length}</strong>
            </div>

            <button
              onClick={() => startScan([{ path: customFilePath, content: customCode }])}
              disabled={isScanning}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Scan Custom Code Snippet</span>
            </button>
          </div>
        </div>
      ) : (
        /* Pipeline Steps Flow */
        <div className="bg-[#121214] border border-[#222224] rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#888] flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>DevLens Pipeline Execution Stages</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {steps.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx && isScanning;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded border transition-all ${
                    isDone
                      ? 'bg-[#0E0E10] border-emerald-500/50 text-white'
                      : isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 animate-pulse'
                      : 'bg-[#0E0E10]/50 border-[#222224] text-[#555]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A1E] font-bold text-white">
                      Stage {idx + 1}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#222224]"></span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white">{step.title}</div>
                  <div className="text-[10px] mt-1 text-[#888] leading-tight font-mono">{step.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#888] font-mono">
              <span>Pipeline Progress</span>
              <span>{Math.min(100, Math.round((currentStep / steps.length) * 100))}%</span>
            </div>
            <div className="w-full h-2 rounded bg-[#0E0E10] overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentStep / steps.length) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Realtime Terminal Execution Logs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#0E0E10] border border-[#222224] rounded-xl p-5 font-mono text-xs text-[#E0E0E0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#222224] pb-2 text-[#888]">
            <span className="flex items-center gap-2 text-xs">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Offline Local ML Engine Logs</span>
            </span>
            <span className="text-[10px] text-emerald-400">Live Stream</span>
          </div>

          <div className="h-48 overflow-y-auto space-y-1 scrollbar-thin text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-[#555] italic py-8 text-center font-mono">
                Click "Run Local ML Scan" to execute machine learning feature extraction on {activeProject.name}.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-[#CCC]">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feature Vector Sample Preview */}
        <div className="bg-[#121214] border border-[#222224] rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#888] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Extracted Feature Matrix</span>
            </h3>
            <p className="text-xs text-[#666] mt-1">
              Top normalized parameters supplied to local Random Forest model.
            </p>

            <div className="space-y-2 mt-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#222224] text-[#BBB]">
                <span>Total Components</span>
                <span className="font-bold text-indigo-400">{scanResult.metrics.totalComponents}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#222224] text-[#BBB]">
                <span>Technical Debt</span>
                <span className="font-bold text-amber-400">{scanResult.metrics.technicalDebtHours} hrs (${scanResult.metrics.debtCostUSD})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#222224] text-[#BBB]">
                <span>Refactorings Ready</span>
                <span className="font-bold text-emerald-400">{scanResult.refactorings.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#222224] text-[#BBB]">
                <span>Design System Score</span>
                <span className="font-bold text-white">{scanResult.scores.designConsistency}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-2 px-3 rounded bg-[#1A1A1E] hover:bg-[#222228] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-4 border border-[#333]"
          >
            <span>View Full Analysis Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

