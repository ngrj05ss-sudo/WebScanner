import React, { useState } from 'react';
import { Download, FileText, Loader2, Check, Copy } from 'lucide-react';
import { StudentInfo } from '../types';
import { generateProjectReportDocx } from '../utils/docxGenerator';
import { getReportMarkdown } from '../data/reportData';

interface ReportViewerTabProps {
  student: StudentInfo;
}

export const ReportViewerTab: React.FC<ReportViewerTabProps> = ({ student }) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  const cleanName = student.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';
  const reportFileName = `${cleanName}_ProjectReport.docx`;
  const reportMarkdown = getReportMarkdown(student);

  const handleDownloadDocx = async () => {
    try {
      setDownloading(true);
      const blob = await generateProjectReportDocx(student);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Project Report Deliverable</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-sky-400">{reportFileName}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full academic documentation report structured according to BharatCares evaluation rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating .docx...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .docx (Microsoft Word)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Styled Academic Document Preview Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto space-y-8 shadow-xl">
        {/* Cover Header */}
        <div className="text-center space-y-3 pb-8 border-b border-slate-800">
          <div className="text-xs font-bold tracking-wider text-sky-400 uppercase">
            CS Bootcamp | IBM SkillsBuild Cyber Security 2026
          </div>
          <div className="text-xs font-semibold text-amber-500 tracking-wide uppercase">
            Conducted by BharatCares (SMEC Trust)
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
            AUTOMATED WEB SCANNER: AUDITING HTTP SECURITY HEADERS & CORS FLAWS
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Capstone Technical Project Report Submitted for Full Evaluation
          </p>

          {/* Submission Info Box */}
          <div className="mt-6 max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Candidate Name:</span>
              <strong className="text-white font-mono">{student.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Candidate ID / Email:</span>
              <span className="text-slate-200 font-mono">{student.studentId} ({student.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Institution:</span>
              <span className="text-slate-200">{student.institution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bootcamp Mentor:</span>
              <span className="text-slate-200">{student.mentorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date of Submission:</span>
              <span className="text-slate-200">{student.submissionDate}</span>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            1. Executive Summary
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern web applications are continuously subjected to automated reconnaissance and attack probes seeking misconfigured HTTP defenses. According to the OWASP Top 10 benchmark, Security Misconfiguration (A05) and Broken Access Control (A01) are persistently among the top vectors responsible for enterprise compromises.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Under the IBM SkillsBuild Cybersecurity Bootcamp conducted by BharatCares, this project introduces an automated Python-based auditing framework. The tool verifies web response headers against OWASP baselines, probes Cross-Origin Resource Sharing (CORS) configurations for dangerous trust flaws, analyzes cookie security flags, and generates deterministic security scores (A+ to F) alongside practical remediation recipes.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            2. Problem Statement & Threat Vector Analysis
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Default web server configurations favor backward compatibility over defensive rigor. The primary attack surfaces addressed by this project include:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">Lack of HSTS (RFC 6797):</strong> Enables Man-in-the-Middle (MitM) attackers on insecure local networks to downgrade HTTPS sessions to plaintext HTTP through SSL-stripping.
            </li>
            <li>
              <strong className="text-white">Absent or Permissive CSP:</strong> Without restrictive Content-Security-Policy rules, attackers can execute stored or reflected Cross-Site Scripting (XSS) scripts and exfiltrate credentials.
            </li>
            <li>
              <strong className="text-white">CORS Misconfigurations:</strong> Reflecting arbitrary origins or permitting wildcard credentials (<code className="text-sky-300">Access-Control-Allow-Credentials: true</code>) allows attacker websites to read authenticated private user data.
            </li>
            <li>
              <strong className="text-white">Insecure Cookie Flags:</strong> Absence of <code className="text-sky-300">HttpOnly</code> leaves session IDs readable via JavaScript, while missing <code className="text-sky-300">Secure</code> flags exposes them to cleartext interception.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            3. Project Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1">Automated Header Auditing</strong>
              Inspect 8 critical defensive headers including HSTS, CSP, X-Frame-Options, and Referrer-Policy.
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1">Deep CORS Simulation</strong>
              Send simulated attacker origin and null origin payloads to discover reflection weaknesses.
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1">Deterministic Scoring</strong>
              Apply OWASP weighted penalty deductions to compute scores (0-100) and letter grades.
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1">Remediation Generation</strong>
              Supply copy-pasteable Nginx, Apache, and Express.js directives for instant developer deployment.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            4. Security Baseline & Scoring Engine
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800">
              <thead className="bg-slate-950 text-slate-400 font-mono">
                <tr>
                  <th className="p-2 border-b border-slate-800">Header / Vector</th>
                  <th className="p-2 border-b border-slate-800">Threat Mitigated</th>
                  <th className="p-2 border-b border-slate-800">Severity</th>
                  <th className="p-2 border-b border-slate-800">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                <tr>
                  <td className="p-2 text-sky-300">Content-Security-Policy</td>
                  <td className="p-2 font-sans">Cross-Site Scripting (XSS), Data Injection</td>
                  <td className="p-2 text-rose-400">CRITICAL</td>
                  <td className="p-2">20 pts</td>
                </tr>
                <tr>
                  <td className="p-2 text-sky-300">Strict-Transport-Security</td>
                  <td className="p-2 font-sans">SSL Stripping & Plaintext Interception</td>
                  <td className="p-2 text-amber-400">HIGH</td>
                  <td className="p-2">15 pts</td>
                </tr>
                <tr>
                  <td className="p-2 text-sky-300">CORS Reflection + Creds</td>
                  <td className="p-2 font-sans">Unauthorized Cross-Domain Data Extraction</td>
                  <td className="p-2 text-rose-400">CRITICAL</td>
                  <td className="p-2">20 pts</td>
                </tr>
                <tr>
                  <td className="p-2 text-sky-300">X-Frame-Options</td>
                  <td className="p-2 font-sans">Clickjacking & UI Redressing</td>
                  <td className="p-2 text-slate-300">MEDIUM</td>
                  <td className="p-2">10 pts</td>
                </tr>
                <tr>
                  <td className="p-2 text-sky-300">X-Content-Type-Options</td>
                  <td className="p-2 font-sans">MIME-Sniffing Executables</td>
                  <td className="p-2 text-slate-400">LOW</td>
                  <td className="p-2">10 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            5. Alignment with IBM SkillsBuild Learning Outcomes
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Completing this project demonstrated mastery of core cybersecurity domains highlighted in the IBM SkillsBuild curriculum:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Network & Web Protocols</span>
              RFC 6454 (Origin concept), RFC 6797 (HSTS), and HTTP preflight inspection.
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Defensive Engineering</span>
              Translating audit findings into hardened server configurations for Nginx and Express.
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Security Automation</span>
              Writing Python CLI tooling capable of automated batch audits.
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base font-bold text-sky-400 uppercase tracking-wide">
            6. Conclusion & Submission Sign-Off
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Automated Web Scanner fulfills all requirements for the IBM SkillsBuild Cyber Security BootCamp 2026 capstone project conducted by BharatCares. All four deliverables—Code File (.py and .ipynb), Requirements (.txt), Project Report (.docx), and README (.md)—have been compiled and verified for formal submission.
          </p>
          <div className="pt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Author: <strong>{student.name}</strong></span>
            <span>Platform: <strong>IBM SkillsBuild & BharatCares</strong></span>
          </div>
        </section>
      </div>
    </div>
  );
};
