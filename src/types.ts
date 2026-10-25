export type ProjectTopicId = 'automated-web-scanner' | 'ml-intrusion-detector';

export interface StudentInfo {
  name: string;
  email: string;
  studentId: string;
  institution: string;
  submissionDate: string;
  mentorName: string;
}

export interface SecurityHeaderCheck {
  header: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  currentValue?: string;
  recommendedValue: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  description: string;
  impact: string;
  remediation: string;
}

export interface CorsCheck {
  scenario: string;
  testOrigin: string;
  status: 'VULNERABLE' | 'SECURE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  evidence: string;
  remediation: string;
}

export interface CookieCheck {
  cookieName: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None' | 'Missing';
  status: 'SECURE' | 'AT_RISK';
  issues: string[];
}

export interface ScanResult {
  targetUrl: string;
  scanTime: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  headers: SecurityHeaderCheck[];
  cors: CorsCheck[];
  cookies: CookieCheck[];
  serverInfo: {
    serverHeader?: string;
    poweredBy?: string;
    tlsVersion: string;
    ipAddress: string;
    responseTimeMs: number;
  };
}

export interface ProjectTopic {
  id: ProjectTopicId;
  title: string;
  shortName: string;
  category: string;
  description: string;
  technologies: string[];
  suggestedNumber: number;
  codeFileName: string;
  ipynbFileName: string;
  reportFileName: string;
}
