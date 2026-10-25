import JSZip from 'jszip';
import { StudentInfo } from '../types';
import { getPythonCode, getJupyterNotebookJson, REQUIREMENTS_TXT } from '../data/scannerCode';
import { getReportMarkdown, getReadmeMarkdown } from '../data/reportData';
import { generateProjectReportDocx } from './docxGenerator';

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

export async function generateAndDownloadZip(student: StudentInfo) {
  const zip = new JSZip();
  const cleanName = student.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';

  // 1. Python script
  const pyCode = getPythonCode(student.name);
  zip.file(`${cleanName}_AutomatedWebScanner.py`, pyCode);

  // 2. Jupyter Notebook
  const ipynbJson = getJupyterNotebookJson(student.name);
  zip.file(`${cleanName}_AutomatedWebScanner.ipynb`, ipynbJson);

  // 3. requirements.txt
  zip.file('requirements.txt', REQUIREMENTS_TXT);

  // 4. Project Report .docx
  const docxBlob = await generateProjectReportDocx(student);
  const docxArrayBuffer = await docxBlob.arrayBuffer();
  zip.file(`${cleanName}_ProjectReport.docx`, docxArrayBuffer);

  // 5. README.md
  const readmeMd = getReadmeMarkdown(student);
  zip.file('README.md', readmeMd);

  // Generate zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `IBM_SkillsBuild_Submission_${cleanName}.zip`);
}
