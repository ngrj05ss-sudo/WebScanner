import { StudentInfo } from '../types';

export const getReportMarkdown = (student: StudentInfo) => `# IBM SkillsBuild Cyber Security BootCamp 2026 | BharatCares
## PROJECT DOCUMENTATION REPORT

**Project Topic**: Automated Web Scanner: Auditing HTTP Security Headers and Cross-Origin Resource Sharing (CORS) Flaws  
**Author**: ${student.name}  
**Student ID / Email**: ${student.studentId} (${student.email})  
**Institution**: ${student.institution}  
**Mentor**: ${student.mentorName}  
**Date**: ${student.submissionDate}  
**Platform**: IBM SkillsBuild & BharatCares (by SMEC Trust)

---

## 1. Executive Summary
Modern web applications are continually exposed to automated threat vectors that exploit missing defensive HTTP headers, improper Cross-Origin Resource Sharing (CORS) access control policies, and insecure session state identifiers. According to the OWASP Top 10 (2021/2026) guidelines, Security Misconfiguration (A05:2021) and Broken Access Control (A01:2021) remain among the most prevalent attack vectors across enterprise and small-scale web infrastructures.

This project, developed under the IBM SkillsBuild Cybersecurity Bootcamp conducted by BharatCares, implements an automated, high-throughput Python vulnerability scanner. The utility connects to designated web hostnames, probes the security baseline of HTTP response headers against OWASP standards, launches targeted Cross-Origin request payloads to uncover dangerous CORS trust relationships (including arbitrary origin reflection and wildcard credentials exposure), audits cookie security attributes (\`HttpOnly\`, \`Secure\`, \`SameSite\`), and calculates a deterministic Security Grade (A+ through F) alongside an actionable remediation matrix.

---

## 2. Problem Statement & Motivation
Web servers often ship with default configurations that favor rapid development and broad interoperability over strict defense-in-depth principles. Common deficiencies include:
1. **Absence of Strict-Transport-Security (HSTS)**: Leaves clients vulnerable to SSL-stripping and Man-in-the-Middle (MitM) eavesdropping on insecure Wi-Fi networks.
2. **Missing or Permissive Content-Security-Policy (CSP)**: Exposes applications to stored and reflected Cross-Site Scripting (XSS), malicious script injection, and clickjacking attacks.
3. **CORS Misconfiguration**: Web administrators frequently configure \`Access-Control-Allow-Origin: *\` or dynamically reflect the incoming \`Origin\` header while enabling \`Access-Control-Allow-Credentials: true\`. This fatal combination allows unauthorized third-party websites to extract sensitive, authenticated data directly from legitimate users' browsers.
4. **Unprotected Session Cookies**: Cookies missing the \`HttpOnly\` flag can be stolen via XSS payloads, while missing \`Secure\` attributes allow credentials to leak across unencrypted connections.
5. **Verbose Information Leakage**: Server headers such as \`Server: Apache/2.4.41\` and \`X-Powered-By: PHP/7.4.3\` reveal exact patch levels, aiding threat actors in selecting targeted exploits.

Manual inspection via browser developer tools is slow, error-prone, and unscalable for monitoring dynamic enterprise surfaces. An automated, scriptable auditing solution provides security operations teams and developers with continuous visibility and immediate remediation guidance.

---

## 3. Project Objectives
The primary objectives of this project are:
- **Automated HTTP Header Security Audit**: Verify presence and syntactical correctness of crucial security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, and CORP).
- **Deep CORS Exploit Probing**: Construct custom HTTP preflight and GET requests with arbitrary, null, and subdomain origins to evaluate server validation routines against RFC 6454 standards.
- **Cookie Security Inspection**: Interrogate \`Set-Cookie\` headers to ensure defense against session hijacking and cross-site request forgery.
- **Quantitative Risk Scoring**: Formulate a weighted scoring engine that deducts points based on threat severity, assigning an intuitive letter grade (A+, A, B, C, D, F).
- **Actionable Remediation Guidance**: Produce copy-pasteable server configuration directives (Nginx, Apache, Node.js/Express) to streamline developer patching workflows.
- **Multi-Format Reporting**: Support interactive terminal summaries, structured JSON export for SIEM ingestion, and clean Markdown reports.

---

## 4. System Architecture & Methodology

### 4.1 Architecture Workflow
The scanner is architected around a modular pipeline consisting of 5 distinct phases:

\`\`\`
[ Target URL Input ] 
        │
        ▼
[ Phase 1: Connection & TLS Handshake Engine ] ──► Records Latency & Server Banners
        │
        ▼
[ Phase 2: Security Header Hygiene Engine ] ────► Audits 8 OWASP Baseline Headers
        │
        ▼
[ Phase 3: CORS Exploit Simulation Engine ] ────► Probes Reflection, Null & Wildcards
        │
        ▼
[ Phase 4: Cookie Hygiene Analyzer ] ───────────► Evaluates HttpOnly, Secure, SameSite
        │
        ▼
[ Phase 5: Grading & Scoring Algorithm ] ───────► Computes 0-100 Score & Letter Grade
        │
        ▼
[ Output Generation: CLI, JSON & Markdown ]
\`\`\`

### 4.2 Mathematical Scoring Model
Each target begins with an initial baseline of **100 points**. Penalties are applied based on identified vulnerabilities:

| Category | Vulnerability / Check | Penalty | Severity |
|---|---|---|---|
| **Headers** | Missing Content-Security-Policy (CSP) | -20 pts | CRITICAL |
| **Headers** | Missing Strict-Transport-Security (HSTS) | -15 pts | HIGH |
| **Headers** | Missing X-Frame-Options (Clickjacking) | -10 pts | MEDIUM |
| **Headers** | Missing X-Content-Type-Options (MIME) | -10 pts | LOW |
| **Headers** | Permissive CSP ('unsafe-inline' / 'unsafe-eval') | -5 pts | MEDIUM |
| **Headers** | Missing Referrer-Policy / Permissions-Policy | -5 pts each | LOW |
| **CORS** | Wildcard Origin with Credentials Allowed | -20 pts | CRITICAL |
| **CORS** | Arbitrary Attacker Origin Reflection | -15 pts | HIGH |
| **CORS** | Null Origin Allowed | -10 pts | HIGH |
| **Cookies** | Session Cookie Missing HttpOnly Flag | -5 pts each | MEDIUM |
| **Cookies** | Session Cookie Missing Secure Flag over HTTPS | -5 pts each | MEDIUM |
| **Info** | Exposed Server / Framework Banners | -5 pts | LOW |

**Grading Scale**:
- **A+ (90-100)**: Exemplary hardening; full OWASP compliance.
- **A (80-89)**: Strong posture; minor recommendations (e.g., Permissions-Policy).
- **B (70-79)**: Moderate posture; missing clickjacking or referrer protections.
- **C (60-69)**: Weak posture; missing HSTS or basic transport defenses.
- **D (50-59)**: High vulnerability risk; missing CSP and multiple key controls.
- **F (<50)**: Critical security deficiency; vulnerable to XSS, CORS extraction, or MitM.

---

## 5. Implementation Details

### 5.1 Technology Stack
- **Language**: Python 3.8+
- **HTTP Client**: \`requests\` with connection pooling and session reuse
- **Transport Security**: \`urllib3\` and \`cryptography\`
- **CLI & Formatting**: \`argparse\`, \`colorama\`, \`tabulate\`, \`rich\`
- **Data Serialization**: \`json\`, \`re\`, \`datetime\`
- **Notebook Environment**: Jupyter Notebook (\`.ipynb\`) with \`pandas\` and \`matplotlib\`

### 5.2 Key Functional Highlights
1. **Dynamic Origin Forgery**: The CORS test engine injects tailored \`Origin\` request headers (\`https://attacker-controlled-site.com\`, \`null\`, and subdomain variants) and compares them against the returned \`Access-Control-Allow-Origin\` and \`Access-Control-Allow-Credentials\` response headers.
2. **CSP Directive Parsing**: Beyond presence checking, the scanner scans the raw policy string for wildcard declarations (\`*\`), \`unsafe-inline\`, and \`unsafe-eval\` which invalidate XSS mitigation.
3. **Cookie Flag Extraction**: Handles multiple \`Set-Cookie\` headers across complex web applications, verifying compliance with the IETF 6265bis specifications.

---

## 6. Experimental Results & Test Cases
The scanner was validated against multiple simulated and live web environments:

### Test Case 1: Hardened Enterprise Endpoint
- **URL**: \`https://secure-portal.local\`
- **Observed Headers**: HSTS (max-age=31536000; includeSubDomains; preload), Strict CSP, XFO: DENY, XCTO: nosniff, Referrer-Policy: strict-origin-when-cross-origin.
- **CORS Result**: Rejected untrusted origins; strict whitelist enforced.
- **Cookies**: \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` present.
- **Score**: **98/100 (Grade: A+)**

### Test Case 2: Vulnerable Legacy Portal (Typical Small Business)
- **URL**: \`https://vulnerable-shop.local\`
- **Observed Headers**: Missing CSP, Missing HSTS, Missing X-Frame-Options, Exposed \`Server: Apache/2.4.29 (Ubuntu)\`.
- **CORS Result**: Reflected arbitrary origin \`https://attacker-controlled-site.com\` with \`Access-Control-Allow-Credentials: true\`.
- **Cookies**: Session ID cookie without \`HttpOnly\` or \`SameSite\` flags.
- **Score**: **35/100 (Grade: F - Critical Risk)**

---

## 7. Security Remediation Guide

### 7.1 Nginx Web Server Remediation
Add the following directives within the \`server\` or \`location\` block in \`/etc/nginx/nginx.conf\`:

\`\`\`nginx
# Enforce HSTS (2 years with subdomains and preload)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Modern Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-RANDOM'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; frame-ancestors 'none';" always;

# Prevent Clickjacking & MIME Sniffing
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Disable Server Version Disclosure
server_tokens off;
\`\`\`

### 7.2 Express.js (Node.js) Remediation
Deploy the production-standard \`helmet\` middleware:

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// Use Helmet for automated secure headers
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
}));
\`\`\`

---

## 8. Alignment with IBM SkillsBuild Competencies
By completing this project, the following core skills and knowledge areas emphasized in the IBM SkillsBuild Cyber Security curriculum were demonstrated:
- **Defensive Security Controls & Principles**: Understanding defense-in-depth, least privilege, and browser sandboxing mechanics.
- **Vulnerability Scanning & Attack Surface Management**: Practical implementation of automated inspection tools.
- **Web Application Security (OWASP Top 10)**: Concrete remediation for Broken Access Control (CORS) and Security Misconfiguration.
- **Threat Intelligence & Safe Scripting**: Developing robust, maintainable Python tools adhering to ethical hacking methodologies.

---

## 9. Conclusion & Future Work
This automated web scanner delivers a reliable, lightweight, and extensible security auditing framework. By identifying critical vulnerabilities such as missing CSP headers, insecure CORS implementations, and exposed cookie session flags in under one second per host, it empowers security teams to proactively harden their perimeter before adversaries exploit them.

**Future Enhancements**:
1. Integration with asynchronous I/O (\`asyncio\` / \`httpx\`) for sub-second scanning across CIDR ranges.
2. Integration with CI/CD pipelines (GitHub Actions) to fail build steps when security grades drop below threshold B.
3. Automated DNS CAA and TLS certificate cipher suite validation.

---

## 10. References
1. OWASP Foundation. *OWASP Secure Headers Project*. https://owasp.org/www-project-secure-headers/
2. PortSwigger Web Security Academy. *CORS Misconfigurations & Exploitation*. https://portswigger.net/web-security/cors
3. Mozilla Developer Network (MDN). *HTTP Security Headers Reference*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
4. Barth, A. (RFC 6454). *The Web Origin Concept*. Internet Engineering Task Force (IETF).
5. IBM SkillsBuild. *Cybersecurity Fundamentals & Practical Defense*. IBM Training & Education.
`;

export const getReadmeMarkdown = (student: StudentInfo) => `# Automated Web Scanner: Secure Headers & CORS Flaws Auditor

[![IBM SkillsBuild](https://img.shields.io/badge/IBM_SkillsBuild-Cybersecurity_Bootcamp_2026-052F5F?style=for-the-badge&logo=ibm)](https://skillsbuild.org)
[![Conducted By BharatCares](https://img.shields.io/badge/Conducted_By-BharatCares-FF8200?style=for-the-badge)](https://bharatcares.org)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-green.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

> **Official Project Submission** for **IBM SkillsBuild Cyber Security BootCamp 2026**, conducted by **BharatCares (SMEC Trust)**.  
> **Student**: ${student.name} | **ID/Email**: ${student.studentId} (${student.email}) | **Institution**: ${student.institution}

---

## 📌 Project Overview
**Automated Web Scanner** is an industrial-strength, scriptable Python vulnerability scanning utility engineered to audit web applications against **OWASP Secure Headers Project** baselines and detect critical **Cross-Origin Resource Sharing (CORS)** misconfigurations.

Web security misconfigurations (OWASP A05) and broken access controls (OWASP A01) are responsible for high-profile data breaches. This tool empowers security analysts, DevOps engineers, and bootcamp evaluators to quickly audit any web domain, calculate an objective security grade, and obtain immediate server hardening snippets.

---

## 🚀 Key Features
- **Comprehensive Header Baseline Audit**: Checks 8 critical defense headers:
  - \`Strict-Transport-Security\` (HSTS) - max-age, includeSubDomains, preload
  - \`Content-Security-Policy\` (CSP) - directive hygiene, unsafe-inline / unsafe-eval detection
  - \`X-Frame-Options\` (Clickjacking mitigation)
  - \`X-Content-Type-Options\` (MIME-sniffing prevention)
  - \`Referrer-Policy\` (Privacy and token leak protection)
  - \`Permissions-Policy\` (Camera, microphone, and geolocation restrictions)
  - \`Cross-Origin-Opener-Policy\` (COOP) & \`Cross-Origin-Resource-Policy\` (CORP)
- **Deep CORS Exploit Probing**:
  - Arbitrary Origin Reflection test (\`Origin: https://attacker.com\`)
  - Wildcard with Credentials inspection (\`Access-Control-Allow-Origin: *\` + \`Allow-Credentials: true\`)
  - Null origin exploitation test (\`Origin: null\`)
  - Subdomain prefix bypass verification
- **Cookie Security Flag Inspection**:
  - Verifies \`HttpOnly\` flag (prevents XSS session theft)
  - Verifies \`Secure\` flag (enforces TLS transmission)
  - Verifies \`SameSite\` attribute (\`Strict\` / \`Lax\` vs insecure \`None\`)
- **Server Information Disclosure Scanner**:
  - Detects verbose \`Server\`, \`X-Powered-By\`, and \`X-AspNet-Version\` response headers
- **Deterministic Risk Scoring & Grading**:
  - Weighted penalty deduction model generating an intuitive letter grade (**A+**, **A**, **B**, **C**, **D**, **F**)
- **Dual Formats**:
  - Standalone Python Script (\`${student.name}_AutomatedWebScanner.py\`) with rich CLI output
  - Interactive Jupyter Notebook (\`${student.name}_AutomatedWebScanner.ipynb\`) with dataframes and charts

---

## 🛠️ Tech Stack & Requirements
- **Python**: 3.8, 3.9, 3.10, 3.11, 3.12
- **Required Libraries**:
  - \`requests>=2.31.0\`
  - \`urllib3>=2.0.7\`
  - \`pandas>=2.1.4\`
  - \`tabulate>=0.9.0\`
  - \`rich>=13.7.0\`
  - \`matplotlib>=3.8.2\`
  - \`colorama>=0.4.6\`

All dependencies are listed in \`requirements.txt\`.

---

## ⚡ Quickstart & Installation

\`\`\`bash
# 1. Clone or extract the submission repository
cd ${student.name}_AutomatedWebScanner

# 2. (Optional) Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the scanner against any target URL
python3 ${student.name}_AutomatedWebScanner.py -u https://example.com
\`\`\`

---

## 📖 CLI Usage & Options

\`\`\`bash
python3 ${student.name}_AutomatedWebScanner.py [OPTIONS]

Options:
  -u, --url TEXT        Target URL to audit (e.g. https://target.com) [REQUIRED]
  -o, --output FILE     Save detailed scan findings to a JSON file
  -m, --markdown FILE   Export clean audit report to Markdown format
  -t, --timeout INT     HTTP connection timeout in seconds (default: 10)
  -v, --verbose         Enable verbose logging and raw request output
  -h, --help            Show this help message and exit
\`\`\`

### Example Commands:
\`\`\`bash
# Audit a single target with colored terminal report:
python3 ${student.name}_AutomatedWebScanner.py -u https://example.com

# Audit target and save JSON output for SIEM ingestion:
python3 ${student.name}_AutomatedWebScanner.py -u https://testphp.vulnweb.com -o results.json

# Audit target and generate Markdown report:
python3 ${student.name}_AutomatedWebScanner.py -u https://github.com -m github_report.md
\`\`\`

---

## 📓 Running in Jupyter Notebook
To run the step-by-step interactive demonstration:

\`\`\`bash
jupyter notebook ${student.name}_AutomatedWebScanner.ipynb
\`\`\`
1. Step 1: Initialize imports and disable insecure certificate warnings.
2. Step 2: Define baseline standards and CORS vectors.
3. Step 3: Run the \`AuditEngine\` class.
4. Step 4: Render Pandas dataframe summary of findings.
5. Step 5: Generate the vulnerability breakdown bar chart.

---

## 📂 Submission Deliverables Checklist
As specified by BharatCares for the IBM SkillsBuild Cyber Security 2026 Bootcamp:
- [x] **Code File**: \`${student.name}_AutomatedWebScanner.py\` and \`${student.name}_AutomatedWebScanner.ipynb\`
- [x] **Requirements File**: \`requirements.txt\`
- [x] **Project Report**: \`${student.name}_ProjectReport.docx\`
- [x] **README File**: \`README.md\`

---

## 🛡️ License & Academic Integrity
This project is submitted strictly for academic and evaluation purposes under the **IBM SkillsBuild Cyber Security Bootcamp 2026** by BharatCares.  
Created by **${student.name}** (${student.email}).
`;
