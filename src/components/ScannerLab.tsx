import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Globe,
  Terminal,
  Check,
  Copy,
  Server,
  Lock,
  Layers,
  Code
} from 'lucide-react';
import { PRESET_TARGETS } from '../data/mockScans';
import { ScanResult, SecurityHeaderCheck, CorsCheck, CookieCheck } from '../types';

export const ScannerLab: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('vulnerable-portal');
  const [targetInput, setTargetInput] = useState<string>('https://vulnerable-fintech-portal.test');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'headers' | 'cors' | 'cookies' | 'remediation'>('headers');
  const [scanResult, setScanResult] = useState<ScanResult>(PRESET_TARGETS['vulnerable-portal']);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const scanSteps = [
    'Establishing TLS 1.3 encrypted handshake...',
    'Requesting HTTP response headers from target...',
    'Auditing OWASP security baseline headers (HSTS, CSP, XFO)...',
    'Injecting CORS test payloads (Reflection, Null origin, Wildcards)...',
    'Inspecting Set-Cookie attributes (HttpOnly, Secure, SameSite)...',
    'Computing deterministic security score & grade...',
  ];

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    const preset = PRESET_TARGETS[key];
    if (preset) {
      setTargetInput(preset.targetUrl);
      setScanResult(preset);
    }
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(stepInterval);
          setIsScanning(false);
          // Set result based on selection or dynamic
          const res = PRESET_TARGETS[selectedPreset] || PRESET_TARGETS['vulnerable-portal'];
          setScanResult({
            ...res,
            targetUrl: targetInput,
            scanTime: 'Just now',
          });
          return prev;
        }
        return prev + 1;
      });
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'B':
      case 'C':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      default:
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <span>Interactive Web Security Scanner Lab</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstration of Topic 2: Auditing web applications for secure headers and CORS vulnerabilities
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleSelectPreset('vulnerable-portal')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              selectedPreset === 'vulnerable-portal'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vulnerable Target
          </button>
          <button
            onClick={() => handleSelectPreset('ecommerce-api')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              selectedPreset === 'ecommerce-api'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CORS Wildcard API
          </button>
          <button
            onClick={() => handleSelectPreset('hardened-gateway')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              selectedPreset === 'hardened-gateway'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hardened Gateway
          </button>
        </div>
      </div>

      {/* Target Input & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning || !targetInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 shrink-0"
          >
            {isScanning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Target...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute Audit Probe</span>
              </>
            )}
          </button>
        </div>

        {/* Live Scan Step Progress */}
        {isScanning && (
          <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sky-400">SCAN IN PROGRESS...</span>
              <span>Step {scanStep + 1} of {scanSteps.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
            <div className="text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>{scanSteps[scanStep]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Audit Findings Overview Dashboard */}
      {!isScanning && scanResult && (
        <div className="space-y-6">
          {/* Metrics Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Grade card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Security Grade</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {scanResult.score}/100
                </span>
                <span className="text-[11px] text-slate-500">
                  {scanResult.score >= 80 ? 'Well Hardened' : 'High Attack Exposure'}
                </span>
              </div>
              <div
                className={`text-3xl font-extrabold font-mono px-3.5 py-1.5 rounded-lg border ${getGradeColor(
                  scanResult.grade
                )}`}
              >
                {scanResult.grade}
              </div>
            </div>

            {/* Checks count */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">Headers Compliant</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {scanResult.passedChecks} / {scanResult.totalChecks}
              </div>
              <div className="flex items-center gap-2 text-[11px] mt-1 text-slate-400">
                <span className="text-emerald-400">{scanResult.passedChecks} pass</span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-400">{scanResult.failedChecks} fail</span>
              </div>
            </div>

            {/* CORS Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">CORS Exploit Vectors</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {scanResult.cors.filter((c) => c.status === 'VULNERABLE').length > 0 ? (
                  <span className="text-rose-400">Vulnerable</span>
                ) : (
                  <span className="text-emerald-400">Enforced</span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {scanResult.cors.filter((c) => c.status === 'VULNERABLE').length} critical exposures
              </div>
            </div>

            {/* Server Fingerprint */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">Server Fingerprint</span>
              <div className="text-sm font-semibold text-slate-200 mt-1 truncate">
                {scanResult.serverInfo.serverHeader || 'Hidden Banner'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                TLS: {scanResult.serverInfo.tlsVersion.split(' ')[0]} ({scanResult.serverInfo.responseTimeMs}ms)
              </div>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="border-b border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('headers')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSubTab === 'headers'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Security Headers ({scanResult.headers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('cors')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSubTab === 'cors'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              CORS Vulnerabilities ({scanResult.cors.length})
            </button>
            <button
              onClick={() => setActiveSubTab('cookies')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSubTab === 'cookies'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Cookie Hygiene ({scanResult.cookies.length})
            </button>
            <button
              onClick={() => setActiveSubTab('remediation')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSubTab === 'remediation'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Server Remediation Code
            </button>
          </div>

          {/* Tab 1: Headers Audit */}
          {activeSubTab === 'headers' && (
            <div className="space-y-3">
              {scanResult.headers.map((h, idx) => {
                const isFail = h.status === 'FAIL';
                const isWarn = h.status === 'WARN';
                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {isFail ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : isWarn ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="font-mono text-sm font-semibold text-white">{h.header}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isFail
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                              : isWarn
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                          }`}
                        >
                          {h.status}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400">
                        Severity: <span className="text-slate-200 font-semibold">{h.severity}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{h.description}</p>

                    {h.currentValue && (
                      <div className="text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800/80 text-slate-300">
                        <span className="text-slate-500">Observed Value: </span>
                        {h.currentValue}
                      </div>
                    )}

                    <div className="text-xs font-mono bg-slate-950/60 p-2 rounded border border-slate-800/50 text-slate-400 flex items-center justify-between">
                      <div>
                        <span className="text-sky-400 font-sans font-medium">Recommended: </span>
                        <span className="text-slate-300">{h.recommendedValue}</span>
                      </div>
                    </div>

                    {isFail && (
                      <div className="text-xs text-rose-300/90 pt-1">
                        <strong>Security Impact:</strong> {h.impact}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: CORS Audit */}
          {activeSubTab === 'cors' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                Cross-Origin Resource Sharing (CORS) probes evaluate if the remote server allows arbitrary external origins to execute cross-domain fetch requests and read sensitive authenticated responses.
              </div>

              {scanResult.cors.map((c, idx) => {
                const isVuln = c.status === 'VULNERABLE';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isVuln
                        ? 'bg-rose-950/20 border-rose-800/40'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isVuln ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <h4 className="text-sm font-semibold text-white">{c.scenario}</h4>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                          isVuln
                            ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                            : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                        }`}
                      >
                        {c.status} ({c.severity})
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{c.details}</p>

                    <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
                      <div className="text-slate-500">Probe Request Origin:</div>
                      <div className="text-sky-300">{c.testOrigin}</div>
                      <div className="text-slate-500 mt-1">Server Response:</div>
                      <div className={isVuln ? 'text-rose-300' : 'text-emerald-300'}>{c.evidence}</div>
                    </div>

                    <div className="text-xs text-slate-300">
                      <strong className="text-sky-400">Remediation:</strong> {c.remediation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Cookies Audit */}
          {activeSubTab === 'cookies' && (
            <div className="space-y-4">
              {scanResult.cookies.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                  No initial cookies returned on target root domain.
                </div>
              ) : (
                scanResult.cookies.map((ck, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-sky-400" />
                        <span className="font-mono text-sm font-semibold text-white">{ck.cookieName}</span>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          ck.status === 'AT_RISK'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {ck.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className={`p-2 rounded border ${ck.httpOnly ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/30 border-rose-800/40 text-rose-300'}`}>
                        HttpOnly: {ck.httpOnly ? 'YES' : 'MISSING'}
                      </div>
                      <div className={`p-2 rounded border ${ck.secure ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/30 border-rose-800/40 text-rose-300'}`}>
                        Secure: {ck.secure ? 'YES' : 'MISSING'}
                      </div>
                      <div className={`p-2 rounded border ${ck.sameSite !== 'Missing' && ck.sameSite !== 'None' ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/30 border-amber-800/40 text-amber-300'}`}>
                        SameSite: {ck.sameSite}
                      </div>
                    </div>

                    {ck.issues.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs text-rose-400 font-medium">Vulnerabilities Detected:</span>
                        <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                          {ck.issues.map((iss, i) => (
                            <li key={i}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Server Remediation Code */}
          {activeSubTab === 'remediation' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span>Nginx Web Server Remediation (/etc/nginx/nginx.conf)</span>
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `# Hardened Security Headers\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nserver_tokens off;`,
                        'nginx'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copiedSnippet === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'nginx' ? 'Copied' : 'Copy Nginx'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
{`# 1. Enforce HSTS (2 Years + Preload)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# 2. Modern Content Security Policy (Mitigate XSS)
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;

# 3. Prevent Clickjacking & MIME-Sniffing
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 4. Suppress Server Version Disclosure
server_tokens off;`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Node.js / Express Middleware Remediation (Helmet.js)</span>
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `const helmet = require('helmet');\napp.use(helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["'self'"],\n      scriptSrc: ["'self'"],\n      objectSrc: ["'none'"],\n    },\n  },\n  hsts: {\n    maxAge: 31536000,\n    includeSubDomains: true,\n    preload: true,\n  },\n}));`,
                        'express'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copiedSnippet === 'express' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'express' ? 'Copied' : 'Copy Express'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`const express = require('express');
const helmet = require('helmet');
const app = express();

// Automatically attaches OWASP defensive headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));`}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
