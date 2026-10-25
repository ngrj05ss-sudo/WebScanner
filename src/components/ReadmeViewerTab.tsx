import React, { useState } from 'react';
import { Copy, Check, Download, BookOpen } from 'lucide-react';
import { StudentInfo } from '../types';
import { getReadmeMarkdown } from '../data/reportData';
import { downloadText } from '../utils/zipGenerator';

interface ReadmeViewerTabProps {
  student: StudentInfo;
}

export const ReadmeViewerTab: React.FC<ReadmeViewerTabProps> = ({ student }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  const readmeContent = getReadmeMarkdown(student);

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadText(readmeContent, 'README.md', 'text/markdown');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">README Deliverable</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-sky-400">README.md</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard documentation repository file containing setup commands, CLI flags, and architectural overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Formatted Preview
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'raw'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Markdown
            </button>
          </div>

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
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'raw' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>README.md (Raw Markdown)</span>
            <span>{readmeContent.split('\n').length} lines</span>
          </div>
          <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[600px]">
            <code>{readmeContent}</code>
          </pre>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed max-w-4xl mx-auto shadow-lg">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Automated Web Scanner: Secure Headers & CORS Flaws Auditor
            </h1>
            <p className="text-xs text-sky-400 mt-1 font-mono">
              IBM SkillsBuild Cyber Security BootCamp 2026 | BharatCares
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <strong>Candidate:</strong> {student.name} ({student.email}) |{' '}
            <strong>Institution:</strong> {student.institution}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Project Overview</h3>
            <p className="text-xs text-slate-300">
              An industrial-strength vulnerability auditing tool written in Python 3 to inspect web servers for missing defensive HTTP headers, evaluate Cross-Origin Resource Sharing (CORS) security configurations, examine cookie hardening attributes, and generate structured reports.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Key Features</h3>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
              <li>Comprehensive 8-header OWASP baseline audit (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, etc.).</li>
              <li>Targeted CORS exploit probing (Origin reflection, Null origin, Wildcard credentials).</li>
              <li>Cookie security flag validation (HttpOnly, Secure, SameSite).</li>
              <li>Deterministic scoring engine with A+ to F grading.</li>
              <li>Export to interactive terminal output, JSON, and Markdown.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Quickstart & Installation</h3>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-sky-300 overflow-x-auto">
{`# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the scanner against target URL
python3 ${student.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_AutomatedWebScanner.py -u https://example.com

# 3. Export JSON report
python3 ${student.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_AutomatedWebScanner.py -u https://example.com -o results.json`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Deliverables Checklist</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400">
                ✓ Code File: {student.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_AutomatedWebScanner.py
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400">
                ✓ Requirements: requirements.txt
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400">
                ✓ Report: {student.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_ProjectReport.docx
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400">
                ✓ README: README.md
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
