import React, { useState } from 'react';
import { Copy, Check, Download, Layers, Terminal } from 'lucide-react';
import { REQUIREMENTS_TXT } from '../data/scannerCode';
import { downloadText } from '../utils/zipGenerator';

export const RequirementsViewerTab: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REQUIREMENTS_TXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadText(REQUIREMENTS_TXT, 'requirements.txt', 'text/plain');
  };

  const packagesInfo = [
    { name: 'requests', ver: '>=2.31.0', purpose: 'HTTP client for sending customized GET and OPTIONS preflight requests.' },
    { name: 'urllib3', ver: '>=2.0.7', purpose: 'Underlying HTTP transport library and SSL/TLS exception handling.' },
    { name: 'pandas', ver: '>=2.1.4', purpose: 'Data structure manipulation for tabular reporting in Jupyter Notebook.' },
    { name: 'tabulate', ver: '>=0.9.0', purpose: 'Renders ASCII/Unicode markdown tables in terminal console outputs.' },
    { name: 'rich', ver: '>=13.7.0', purpose: 'Provides rich text and beautiful formatting in terminal consoles.' },
    { name: 'matplotlib', ver: '>=3.8.2', purpose: 'Generates vulnerability distribution bar charts in Jupyter Notebook.' },
    { name: 'colorama', ver: '>=0.4.6', purpose: 'Cross-platform colored terminal text support (Windows, Linux, macOS).' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Requirements Deliverable</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-sky-400">requirements.txt</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly formatted dependency manifest required for reproducing the environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download requirements.txt</span>
          </button>
        </div>
      </div>

      {/* Terminal Command Quickstart Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>One-Line Environment Installation Command:</span>
        </div>
        <div className="p-3 bg-slate-900/80 rounded-lg font-mono text-xs text-sky-300 flex items-center justify-between">
          <code>pip install -r requirements.txt</code>
        </div>
      </div>

      {/* Raw File Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>File Contents: requirements.txt</span>
          <span>9 lines</span>
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
          <code>{REQUIREMENTS_TXT}</code>
        </pre>
      </div>

      {/* Dependency Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Dependency Roles & Justifications</h3>
        <div className="divide-y divide-slate-800">
          {packagesInfo.map((pkg, idx) => (
            <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sky-400">{pkg.name}</span>
                <span className="font-mono text-slate-500 text-[11px]">{pkg.ver}</span>
              </div>
              <p className="text-slate-300 sm:text-right max-w-lg">{pkg.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
