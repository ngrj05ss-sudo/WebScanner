import React, { useState } from 'react';
import { X, Check, User, Mail, School, Calendar, Award } from 'lucide-react';
import { StudentInfo } from '../types';

interface StudentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentInfo;
  onSave: (info: StudentInfo) => void;
}

export const StudentConfigModal: React.FC<StudentConfigModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentInfo>({ ...student });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const cleanName = formData.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-base font-semibold text-white">Student Submission Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates your name and credentials across all generated deliverables
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              Full Name (Used in File Naming)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="e.g. Nagaraj S"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="ngrj05ss@gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                Student ID / Roll No.
              </label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="e.g. IBM-SB-2026-CS842"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-sky-400" />
              College / Institution
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="e.g. Faculty of Engineering and Technology"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Submission Date
              </label>
              <input
                type="text"
                value={formData.submissionDate}
                onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="October 2026"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                Bootcamp Mentor
              </label>
              <input
                type="text"
                value={formData.mentorName}
                onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="Vanita Tripathi (BharatCares)"
              />
            </div>
          </div>

          {/* Generated file naming preview */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 block font-medium">Deliverables generated with:</span>
            <div className="font-mono text-sky-300 truncate">1. {cleanName}_AutomatedWebScanner.py</div>
            <div className="font-mono text-sky-300 truncate">2. requirements.txt</div>
            <div className="font-mono text-sky-300 truncate">3. {cleanName}_ProjectReport.docx</div>
            <div className="font-mono text-sky-300 truncate">4. README.md</div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
