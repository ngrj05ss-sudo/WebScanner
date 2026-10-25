import React, { useState } from 'react';
import { Header } from './components/Header';
import { SubmissionChecklist } from './components/SubmissionChecklist';
import { ScannerLab } from './components/ScannerLab';
import { CodeViewerTab } from './components/CodeViewerTab';
import { RequirementsViewerTab } from './components/RequirementsViewerTab';
import { ReportViewerTab } from './components/ReportViewerTab';
import { ReadmeViewerTab } from './components/ReadmeViewerTab';
import { StudentConfigModal } from './components/StudentConfigModal';
import { StudentInfo } from './types';
import { generateAndDownloadZip } from './utils/zipGenerator';

export default function App() {
  const [student, setStudent] = useState<StudentInfo>({
    name: 'Nagaraj S',
    email: 'ngrj05ss@gmail.com',
    studentId: 'IBM-SB-2026-CS842',
    institution: 'Department of Computer Science & Engineering',
    submissionDate: 'October 24, 2026',
    mentorName: 'Vanita Tripathi (BharatCares)',
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [zipLoading, setZipLoading] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setZipLoading(true);
      await generateAndDownloadZip(student);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar compliant with Top Bar Contract */}
      <Header
        student={student}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        onOpenStudentConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <SubmissionChecklist
            student={student}
            onNavigateTab={setActiveTab}
            onOpenStudentConfig={() => setIsConfigModalOpen(true)}
          />
        )}

        {activeTab === 'scanner' && <ScannerLab />}

        {activeTab === 'code' && <CodeViewerTab student={student} />}

        {activeTab === 'requirements' && <RequirementsViewerTab />}

        {activeTab === 'report' && <ReportViewerTab student={student} />}

        {activeTab === 'readme' && <ReadmeViewerTab student={student} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>IBM SkillsBuild Cybersecurity Bootcamp 2026</span>
            <span aria-hidden="true">·</span>
            <span>Conducted by BharatCares (SMEC Trust)</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Prepared for candidate: <strong className="text-slate-400">{student.name}</strong></span>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              Update Details
            </button>
          </div>
        </div>
      </footer>

      {/* Candidate Customization Modal */}
      <StudentConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        student={student}
        onSave={(updated) => setStudent(updated)}
      />
    </div>
  );
}
