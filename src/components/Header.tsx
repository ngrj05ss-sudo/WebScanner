import React from 'react';
import { Download, ShieldCheck, UserCheck } from 'lucide-react';
import { StudentInfo } from '../types';

interface HeaderProps {
  student: StudentInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadZip: () => void;
  onOpenStudentConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  activeTab,
  setActiveTab,
  onDownloadZip,
  onOpenStudentConfig,
}) => {
  const navItems = [
    { id: 'overview', label: 'Submission Overview' },
    { id: 'scanner', label: 'Live Scanner Lab' },
    { id: 'code', label: 'Code File (.py / .ipynb)' },
    { id: 'requirements', label: 'Requirements (.txt)' },
    { id: 'report', label: 'Project Report (.docx)' },
    { id: 'readme', label: 'README (.md)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
              IBM SkillsBuild Cybersecurity
            </span>
          </div>

          {/* Zone 2: 4-6 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenStudentConfig}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
              title="Edit Candidate Information"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{student.name}</span>
            </button>

            <button
              onClick={onDownloadZip}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Submission (.ZIP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 gap-1 border-t border-slate-800/60 no-scrollbar bg-slate-950">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === item.id ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
