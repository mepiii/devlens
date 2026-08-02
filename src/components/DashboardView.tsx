import React from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Boxes,
  Code2,
  Palette,
  Zap,
  Eye,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ScanResult, PageType } from '../types';

interface DashboardViewProps {
  scanResult: ScanResult;
  onNavigate: (page: PageType) => void;
  onOpenAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scanResult,
  onNavigate,
  onOpenAssistant,
}) => {
  const radarData = [
    { subject: 'Health', score: scanResult.scores.health, benchmark: 80 },
    { subject: 'Maintainability', score: scanResult.scores.maintainability, benchmark: 75 },
    { subject: 'Design', score: scanResult.scores.designConsistency, benchmark: 85 },
    { subject: 'Accessibility', score: scanResult.scores.accessibility, benchmark: 80 },
    { subject: 'Performance', score: scanResult.scores.performance, benchmark: 85 },
  ];

  const categoryScoreData = [
    { category: 'Health', score: scanResult.scores.health, color: '#10b981' },
    { category: 'Performance', score: scanResult.scores.performance, color: '#6366f1' },
    { category: 'Design', score: scanResult.scores.designConsistency, color: '#8b5cf6' },
    { category: 'Accessibility', score: scanResult.scores.accessibility, color: '#06b6d4' },
    { category: 'Maintainability', score: scanResult.scores.maintainability, color: '#f59e0b' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12 bg-[#0A0A0B] text-[#E0E0E0]">
      {/* Top Hero Banner */}
      <div className="bg-[#121214] border border-[#222224] rounded-xl p-6 relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                LATEST SCAN PASSED
              </span>
              <span className="text-xs text-[#666] font-mono">{scanResult.timestamp}</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
              {scanResult.projectName}
            </h2>
            <p className="text-xs text-[#BBB] max-w-2xl leading-relaxed">
              ML Predictive Analysis complete. Evaluated <strong className="text-white font-mono">{scanResult.metrics.totalLOC.toLocaleString()}</strong> lines of code across <strong className="text-white font-mono">{scanResult.metrics.totalComponents}</strong> components with offline XGBoost &amp; Random Forest classifiers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0E0E10] border border-[#222224] p-4 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] font-mono uppercase text-[#666] tracking-wider">Project Health</div>
              <div className="text-4xl font-extrabold text-white mt-1 font-mono">
                {scanResult.scores.overallQuality}
                <span className="text-xs text-[#444] font-normal">/100</span>
              </div>
            </div>

            <div className="bg-[#0E0E10] border border-[#222224] p-4 rounded-xl text-center min-w-[130px]">
              <div className="text-[10px] font-mono uppercase text-[#666] tracking-wider">Tech Debt Cost</div>
              <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
                ${scanResult.metrics.debtCostUSD}
              </div>
              <div className="text-[10px] text-[#666] font-mono">{scanResult.metrics.technicalDebtHours} hrs workload</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('components')}
          className="bg-[#121214] border border-[#222224] hover:border-indigo-600 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#151518] group"
        >
          <div className="flex items-center justify-between text-[#666] mb-2 font-mono text-[10px] uppercase">
            <span>Components</span>
            <Boxes className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {scanResult.metrics.totalComponents}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>{scanResult.metrics.duplicateComponentsCount} duplicates</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('code-quality')}
          className="bg-[#121214] border border-[#222224] hover:border-indigo-600 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#151518] group"
        >
          <div className="flex items-center justify-between text-[#666] mb-2 font-mono text-[10px] uppercase">
            <span>Maintainability</span>
            <Code2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {scanResult.scores.maintainability}
            <span className="text-xs text-[#555]">/100</span>
          </div>
          <div className="text-[11px] text-[#888] mt-1 font-mono">
            Avg complexity: 12.4
          </div>
        </div>

        <div
          onClick={() => onNavigate('design')}
          className="bg-[#121214] border border-[#222224] hover:border-indigo-600 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#151518] group"
        >
          <div className="flex items-center justify-between text-[#666] mb-2 font-mono text-[10px] uppercase">
            <span>Design System</span>
            <Palette className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {scanResult.scores.designConsistency}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            91% token adherence
          </div>
        </div>

        <div
          onClick={() => onNavigate('performance')}
          className="bg-[#121214] border border-[#222224] hover:border-indigo-600 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#151518] group"
        >
          <div className="flex items-center justify-between text-[#666] mb-2 font-mono text-[10px] uppercase">
            <span>Bundle Size</span>
            <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {scanResult.metrics.bundleEstimatedSizeMB} MB
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">
            Savings: 180 KB
          </div>
        </div>
      </div>

      {/* Radar & Bar Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Quality Chart */}
        <div className="bg-[#121214] border border-[#222224] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888] font-bold">
                Quality Vector Analysis
              </h3>
              <p className="text-xs text-[#666]">Comparison against benchmark vectors</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 font-mono">
              RADAR
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#222224" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#555', fontSize: 9 }} />
                <Radar name="Current Scan" dataKey="score" stroke="#6366f1" fill="#4f46e5" fillOpacity={0.5} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#06b6d4" fill="#0891b2" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-[#888] border-t border-[#222224] pt-3 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600/60 inline-block border border-indigo-400"></span>
              <span>Project Score ({scanResult.scores.overallQuality})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-600/30 inline-block border border-cyan-400"></span>
              <span>Benchmark (80)</span>
            </div>
          </div>
        </div>

        {/* Quality Score Breakdown Bar Chart */}
        <div className="bg-[#121214] border border-[#222224] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888] font-bold">
                Dimension Score Breakdown
              </h3>
              <p className="text-xs text-[#666]">Scores across core software metrics</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 font-mono">
              VECTORS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScoreData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tick={{ fill: '#888', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0E0E10', borderColor: '#222224', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-[#222224] pt-3 flex items-center justify-between text-xs text-[#888]">
            <span>Lowest dimension: <strong className="text-white font-mono">Performance ({scanResult.scores.performance})</strong></span>
            <button
              onClick={() => onNavigate('performance')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-xs"
            >
              <span>Inspect Performance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Predictions & Top Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ML Model Inferences */}
        <div className="md:col-span-2 bg-[#121214] border border-[#222224] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222224] pb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888] font-bold">
                Machine Learning Model Inferences
              </h3>
            </div>
            <button
              onClick={() => onNavigate('ml-models')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
            >
              <span>SHAP Feature Vectors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {scanResult.modelPredictions.map((pred, i) => (
              <div
                key={i}
                className="p-3 rounded bg-[#0E0E10] border border-[#222224] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#E0E0E0] flex items-center gap-2">
                    <span>{pred.target}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A1E] text-[#888] font-mono border border-[#333]">
                      {pred.modelName}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888] mt-0.5 font-mono">
                    Prediction: <strong className="text-indigo-300">{pred.prediction}</strong>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-white">{pred.confidence}% confidence</div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase inline-block mt-1 ${
                      pred.status === 'passed'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {pred.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Refactoring Actions Panel */}
        <div className="bg-[#121214] border border-[#222224] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 border-b border-[#222224] pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#888] font-bold">
                DevLens AI Actions
              </h3>
            </div>
            <p className="text-xs text-[#BBB] leading-relaxed">
              Automated refactoring actions derived from offline feature vectors and CodeBERT AST similarity analysis.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigate('code-quality')}
                className="w-full text-left p-2.5 rounded bg-[#0E0E10] hover:bg-[#1A1A1E] border border-[#222224] text-xs font-medium text-[#E0E0E0] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>3 Refactoring Diffs Ready</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('components')}
                className="w-full text-left p-2.5 rounded bg-[#0E0E10] hover:bg-[#1A1A1E] border border-[#222224] text-xs font-medium text-[#E0E0E0] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-indigo-400" />
                  <span>Resolve Component Duplicates</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="w-full text-left p-2.5 rounded bg-[#0E0E10] hover:bg-[#1A1A1E] border border-[#222224] text-xs font-medium text-[#E0E0E0] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Export Executive Audit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#666] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <button
            onClick={onOpenAssistant}
            className="w-full py-2.5 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Gemini AI Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
