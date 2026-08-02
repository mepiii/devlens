import React, { useState } from 'react';
import { Settings, Sliders, Check, RotateCw, BrainCircuit, ShieldCheck, Key } from 'lucide-react';
import { PageType } from '../types';

interface SettingsViewProps {
  onNavigate: (p: PageType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [oversizedLocLimit, setOversizedLocLimit] = useState(300);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Platform &amp; Offline Machine Learning Configuration</span>
        </h2>
        <p className="text-xs text-slate-400">
          Tune confidence score thresholds, decision tree depths, and static analysis limits
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm max-w-2xl">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Model Inference Parameters</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-200 mb-1">
              <span>Minimum Prediction Confidence Cutoff</span>
              <span className="font-mono text-indigo-400 font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Predictions below this threshold will be hidden or flagged as low confidence.
            </p>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-200 mb-1">
              <span>Oversized Component LOC Threshold</span>
              <span className="font-mono text-amber-400 font-bold">{oversizedLocLimit} LOC</span>
            </div>
            <input
              type="range"
              min="150"
              max="800"
              step="50"
              value={oversizedLocLimit}
              onChange={(e) => setOversizedLocLimit(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Gemini Secrets Info Banner */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Gemini AI Intelligence Integration</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Gemini API key is automatically injected from AI Studio Secrets into <code>process.env.GEMINI_API_KEY</code> for deep code generation &amp; refactoring.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Settings className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved' : 'Save ML Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
