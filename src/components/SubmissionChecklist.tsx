import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FileCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Shield,
  Sparkles,
  Loader2
} from 'lucide-react';
import { StudentInfo } from '../types';
import { downloadText, generateAndDownloadZip } from '../utils/zipGenerator';
import { getPythonCode, getJupyterNotebookJson, REQUIREMENTS_TXT } from '../data/scannerCode';
import { getReadmeMarkdown } from '../data/reportData';
import { generateProjectReportDocx } from '../utils/docxGenerator';

interface SubmissionChecklistProps {
  student: StudentInfo;
  onNavigateTab: (tab: string) => void;
  onOpenStudentConfig: () => void;
}

export const SubmissionChecklist: React.FC<SubmissionChecklistProps> = ({
  student,
  onNavigateTab,
  onOpenStudentConfig,
}) => {
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const cleanName = student.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';

  const handleDownloadPy = () => {
    downloadText(getPythonCode(student.name), `${cleanName}_AutomatedWebScanner.py`, 'text/x-python');
  };

  const handleDownloadIpynb = () => {
    downloadText(getJupyterNotebookJson(student.name), `${cleanName}_AutomatedWebScanner.ipynb`, 'application/json');
  };

  const handleDownloadReq = () => {
    downloadText(REQUIREMENTS_TXT, 'requirements.txt', 'text/plain');
  };

  const handleDownloadDocx = async () => {
    try {
      setDownloadingDocx(true);
      const blob = await generateProjectReportDocx(student);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanName}_ProjectReport.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDownloadReadme = () => {
    downloadText(getReadmeMarkdown(student), 'README.md', 'text/markdown');
  };

  const handleDownloadAllZip = async () => {
    try {
      setDownloadingZip(true);
      await generateAndDownloadZip(student);
    } finally {
      setDownloadingZip(false);
    }
  };

  const items = [
    {
      id: 'code',
      title: 'Code File',
      format: '.py & .ipynb',
      filename: `${cleanName}_AutomatedWebScanner.py`,
      secondaryFilename: `${cleanName}_AutomatedWebScanner.ipynb`,
      description: 'Complete Python vulnerability scanner with CLI arguments, OWASP headers audit engine, and CORS reflection tester.',
      icon: FileCode,
      tab: 'code',
      onDownloadPrimary: handleDownloadPy,
      onDownloadSecondary: handleDownloadIpynb,
      primaryLabel: 'Download .py',
      secondaryLabel: 'Download .ipynb',
    },
    {
      id: 'requirements',
      title: 'Requirements File',
      format: '.txt',
      filename: 'requirements.txt',
      description: 'Standard Python dependencies (requests, urllib3, pandas, tabulate, rich, matplotlib) with version pins.',
      icon: Layers,
      tab: 'requirements',
      onDownloadPrimary: handleDownloadReq,
      primaryLabel: 'Download requirements.txt',
    },
    {
      id: 'report',
      title: 'Project Report',
      format: '.docx',
      filename: `${cleanName}_ProjectReport.docx`,
      description: 'Complete technical project documentation in authentic Microsoft Word format with IBM SkillsBuild / BharatCares header.',
      icon: FileText,
      tab: 'report',
      onDownloadPrimary: handleDownloadDocx,
      primaryLabel: downloadingDocx ? 'Generating Word Doc...' : 'Download .docx',
      isLoading: downloadingDocx,
    },
    {
      id: 'readme',
      title: 'README File',
      format: '.md',
      filename: 'README.md',
      description: 'Comprehensive project overview, attack surface explanation, setup commands, options reference, and dataset links.',
      icon: BookOpen,
      tab: 'readme',
      onDownloadPrimary: handleDownloadReadme,
      primaryLabel: 'Download README.md',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero card mapping to the submission brief */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-sky-400 font-medium">
            <span>IBM SkillsBuild Cybersecurity 2026</span>
            <span aria-hidden="true">·</span>
            <span>Conducted by BharatCares</span>
            <span aria-hidden="true">·</span>
            <span>Final Submission Ready</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Project Topic 2: Automated Web Scanner
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Programmed a high-performance Python script to audit websites for missing OWASP security headers, dangerous CORS access control flaws, and unprotected session cookies. All four required submission deliverables have been prepared according to BharatCares submission guidelines.
          </p>

          {/* Student metadata info strip */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
            <div>
              <span className="text-slate-500">Candidate:</span>{' '}
              <strong className="text-slate-200">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500">ID:</span>{' '}
              <span className="text-slate-200">{student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>{' '}
              <span className="text-slate-200">{student.email}</span>
            </div>
            <button
              onClick={onOpenStudentConfig}
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2 ml-auto"
            >
              Edit Details
            </button>
          </div>
        </div>

        {/* Master CTA Button */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleDownloadAllZip}
            disabled={downloadingZip}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-lg shadow-sky-900/30 transition-all disabled:opacity-50"
          >
            {downloadingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Submission ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download All 4 Submission Files (.ZIP)</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigateTab('scanner')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Launch Live Scanner Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Deliverables Checklist Grid (Matching the 4 bullets from Google Form screenshot) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Required Submission Files</h2>
            <p className="text-xs text-slate-400">
              Directly aligned with the Google Form requirements. All files are 100% complete and named correctly.
            </p>
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All 4 Deliverables Prepared</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/30">
                            {item.format}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 truncate max-w-xs mt-0.5">
                          {item.filename}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigateTab(item.tab)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>View File Content</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    {item.secondaryFilename && item.onDownloadSecondary && (
                      <button
                        onClick={item.onDownloadSecondary}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                      >
                        {item.secondaryLabel}
                      </button>
                    )}
                    <button
                      onClick={item.onDownloadPrimary}
                      disabled={item.isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors disabled:opacity-50"
                    >
                      {item.isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{item.primaryLabel}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary table of key scanning metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Topic 2 Security Coverage Matrix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-xs text-slate-400">Security Headers</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">8 Standards</div>
            <div className="text-[11px] text-slate-500 mt-1">HSTS, CSP, XFO, XCTO, etc.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-xs text-slate-400">CORS Attack Vectors</div>
            <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">3 Vectors</div>
            <div className="text-[11px] text-slate-500 mt-1">Reflection, Wildcard, Null</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-xs text-slate-400">Cookie Security</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">3 Flags</div>
            <div className="text-[11px] text-slate-500 mt-1">HttpOnly, Secure, SameSite</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
            <div className="text-xs text-slate-400">Scoring Engine</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">A+ to F</div>
            <div className="text-[11px] text-slate-500 mt-1">OWASP Weighted Scoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};
