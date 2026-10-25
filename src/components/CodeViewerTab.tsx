import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen } from 'lucide-react';
import { StudentInfo } from '../types';
import { getPythonCode, getJupyterNotebookJson } from '../data/scannerCode';
import { downloadText } from '../utils/zipGenerator';

interface CodeViewerTabProps {
  student: StudentInfo;
}

export const CodeViewerTab: React.FC<CodeViewerTabProps> = ({ student }) => {
  const [fileType, setFileType] = useState<'py' | 'ipynb'>('py');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanName = student.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';
  const pyCode = getPythonCode(student.name);
  const ipynbCode = getJupyterNotebookJson(student.name);

  const activeContent = fileType === 'py' ? pyCode : ipynbCode;
  const activeFileName =
    fileType === 'py'
      ? `${cleanName}_AutomatedWebScanner.py`
      : `${cleanName}_AutomatedWebScanner.ipynb`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (fileType === 'py') {
      downloadText(pyCode, activeFileName, 'text/x-python');
    } else {
      downloadText(ipynbCode, activeFileName, 'application/json');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Project Code Deliverable</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-sky-400">{activeFileName}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Both Python (.py) and Jupyter Notebook (.ipynb) formats are provided according to submission rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Toggle Buttons */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFileType('py')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                fileType === 'py'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Python (.py)</span>
            </button>
            <button
              onClick={() => setFileType('ipynb')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                fileType === 'ipynb'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Jupyter (.ipynb)</span>
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
            <span>Download {fileType === 'py' ? '.py' : '.ipynb'}</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs text-slate-400 font-mono">
          <span>{activeFileName}</span>
          <span>{activeContent.split('\n').length} lines</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed">
          <code>{activeContent}</code>
        </pre>
      </div>
    </div>
  );
};
