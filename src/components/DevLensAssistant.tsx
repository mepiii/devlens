import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { ScanResult } from '../types';

interface DevLensAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isOfflineFallback?: boolean;
}

export const DevLensAssistant: React.FC<DevLensAssistantProps> = ({
  isOpen,
  onClose,
  scanResult,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello! I am your **DevLens ML Engineering Assistant**. I can help you interpret model predictions, generate refactoring snippets for oversized components, or optimize your bundle size. How can I assist with **${scanResult.projectName}** today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          context: {
            projectName: scanResult.projectName,
            scores: scanResult.scores,
            metrics: scanResult.metrics,
            topIssue: scanResult.components.find((c) => c.isOversized),
          },
          type: promptToSend.toLowerCase().includes('refactor') ? 'refactor' : 'explain_ml',
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Unable to analyze request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineFallback: data.isOfflineFallback,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Error contacting AI intelligence service. Check your network or API Key settings.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Refactor ProductGridCard into smaller atomic components',
    'Why did Random Forest rate Maintainability at 81.4?',
    'How do I fix color palette contrast outliers?',
    'Explain how to eliminate re-render hotspots in CartDrawerModal',
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-[#0E0E10] border-l border-[#222224] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 text-[#E0E0E0]">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#222224] flex items-center justify-between bg-[#121214]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-white">DevLens AI Assistant</h2>
            <p className="text-[10px] text-[#888] font-mono">Gemini &amp; Offline Feature Vectors</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1E] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-b border-[#222224] bg-[#0A0A0B] overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[10px] text-[#666] font-mono flex-shrink-0">Prompts:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[10px] px-2 py-1 rounded bg-[#121214] hover:bg-[#1A1A1E] text-[#BBB] whitespace-nowrap border border-[#222224] font-mono transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0B]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-[#121214] border border-[#222224] flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-[#121214] border border-[#222224] text-[#E0E0E0] whitespace-pre-wrap'
              }`}
            >
              <div>{m.text}</div>
              {m.isOfflineFallback && (
                <div className="mt-2 pt-2 border-t border-[#222224] text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Local Rule Fallback Mode</span>
                </div>
              )}
              <div
                className={`text-[9px] mt-1.5 text-right font-mono ${
                  m.sender === 'user' ? 'text-indigo-200' : 'text-[#666]'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-[#1A1A1E] border border-[#333] flex items-center justify-center text-[#BBB] flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-indigo-400 bg-[#121214] p-3 rounded border border-[#222224] font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Analyzing code structure &amp; inferring feature importances...</span>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-[#222224] bg-[#0E0E10]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about ML predictions or refactoring..."
            className="flex-1 bg-[#0A0A0B] border border-[#222224] rounded px-3 py-2 text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-indigo-600 font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
