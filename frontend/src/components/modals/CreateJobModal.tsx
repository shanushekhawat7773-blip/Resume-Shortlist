import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Cpu,
  Layers,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { parseJobDescription } from '../../services/jobParser';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const { createJob, setActiveTab } = useRecruitment();

  const [rawJobDescription, setRawJobDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('Engineering & Technology');
  const [location, setLocation] = useState('Bangalore, India (Hybrid)');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Remote'>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState(3);
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['SQL', 'Python', 'Power BI']);
  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Tableau', 'Snowflake']);
  const [education, setEducation] = useState("Bachelor's or Master's in Computer Science, Data, or Engineering");
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Analyze operational metrics and generate high-impact business reports',
    'Build and maintain scalable data dashboards and queries',
    'Collaborate with cross-functional stakeholders on project deliverables'
  ]);
  const [domain, setDomain] = useState('Enterprise Technology');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newPrefSkillInput, setNewPrefSkillInput] = useState('');
  const [newRespInput, setNewRespInput] = useState('');

  if (!isOpen) return null;

  // Auto-extraction handler
  const handleAutoExtract = () => {
    if (!rawJobDescription.trim()) return;
    setIsExtracting(true);

    setTimeout(() => {
      const result = parseJobDescription(rawJobDescription);
      const parsed = result.job;
      setTitle(parsed.title);
      setExperienceRequired(parsed.experienceRequired);
      if (parsed.requiredSkills.length > 0) setRequiredSkills(parsed.requiredSkills);
      if (parsed.preferredSkills.length > 0) setPreferredSkills(parsed.preferredSkills);
      if (parsed.responsibilities.length > 0) setResponsibilities(parsed.responsibilities);
      if (parsed.education) setEducation(parsed.education);
      if (parsed.domain) setDomain(parsed.domain);
      setDescription(parsed.description || rawJobDescription.slice(0, 400) + '...');

      setIsExtracting(false);
      setExtractionDone(true);
    }, 600);
  };

  const handleAddRequiredSkill = () => {
    if (newSkillInput.trim() && !requiredSkills.includes(newSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleAddPreferredSkill = () => {
    if (newPrefSkillInput.trim() && !preferredSkills.includes(newPrefSkillInput.trim())) {
      setPreferredSkills([...preferredSkills, newPrefSkillInput.trim()]);
      setNewPrefSkillInput('');
    }
  };

  const handleRemovePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter(s => s !== skill));
  };

  const handleAddResp = () => {
    if (newRespInput.trim()) {
      setResponsibilities([...responsibilities, newRespInput.trim()]);
      setNewRespInput('');
    }
  };

  const handleRemoveResp = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    createJob({
      title,
      company,
      department,
      location,
      employmentType,
      seniority: 'Senior',
      experienceRequired: Number(experienceRequired),
      description: description || rawJobDescription || `Role for ${title} at ${company}`,
      requiredSkills,
      preferredSkills,
      education,
      certifications: ['Relevant domain certifications preferred'],
      responsibilities,
      domain,
      keywords: [...requiredSkills, ...preferredSkills, domain],
      structuredRequirements: requiredSkills.map((req, idx) => ({
        id: `req-${idx}`,
        name: req,
        category: 'Skill',
        importance: 'Required',
        weight: 20,
        description: `Demonstrated proficiency in ${req}`,
        semanticTokens: [req.toLowerCase()],
      })),
    });

    onClose();
    setActiveTab('jobs');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-3xl shadow-elevation overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-400" />
              Create Job Role & Requirements
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste raw job descriptions for automated intelligence extraction or configure manually.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Quick Paste & Auto-Extract Box */}
          <div className="bg-slate-850 border border-slate-750 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-brand-400" />
                AI Job Intelligence Auto-Extractor
              </span>
              {extractionDone && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Intelligence extracted into editable cards below
                </span>
              )}
            </div>
            <textarea
              rows={3}
              placeholder="Paste complete Job Description here to automatically extract technical skills, experience tenure, and responsibility matrices..."
              value={rawJobDescription}
              onChange={e => setRawJobDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:ring-1 focus:ring-brand-500 focus:outline-none placeholder-slate-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAutoExtract}
                disabled={isExtracting || !rawJobDescription.trim()}
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExtracting ? 'Analyzing Job Description...' : 'Extract Job Intelligence'}</span>
              </button>
            </div>
          </div>

          <form id="createJobForm" onSubmit={handleSaveJob} className="space-y-4">
            
            {/* Primary Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Data Analyst"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FinTrack Intelligence"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Department, Location, Type, Experience */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Employment
                </label>
                <select
                  value={employmentType}
                  onChange={e => setEmploymentType(e.target.value as any)}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Min Experience (Yrs)
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={experienceRequired}
                  onChange={e => setExperienceRequired(Number(e.target.value))}
                  className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Required Skills Editable Tag Box */}
            <div className="bg-slate-850 border border-slate-750 rounded-xl p-3.5 space-y-2">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Required Skills (Strict Match Dimension)
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-950 border border-brand-800 text-brand-300 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredSkill(skill)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Python, SQL, Statistics)..."
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequiredSkill(); } }}
                  className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddRequiredSkill}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs rounded-lg font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Preferred Skills Tag Box */}
            <div className="bg-slate-850 border border-slate-750 rounded-xl p-3.5 space-y-2">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Preferred / Nice-to-Have Skills
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {preferredSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemovePreferredSkill(skill)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add preferred skill (e.g. Tableau, Snowflake)..."
                  value={newPrefSkillInput}
                  onChange={e => setNewPrefSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPreferredSkill(); } }}
                  className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddPreferredSkill}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs rounded-lg font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-slate-850 border border-slate-750 rounded-xl p-3.5 space-y-2">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Key Responsibilities (Evidence Mapping Matrix)
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-300 leading-snug">{resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(idx)}
                      className="text-slate-500 hover:text-rose-400 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add key responsibility for evidence matching..."
                  value={newRespInput}
                  onChange={e => setNewRespInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddResp(); } }}
                  className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs rounded-lg font-medium"
                >
                  Add Duty
                </button>
              </div>
            </div>

            {/* Education Requirement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Education Requirement
              </label>
              <input
                type="text"
                value={education}
                onChange={e => setEducation(e.target.value)}
                className="w-full bg-slate-850 border border-slate-750 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

          </form>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createJobForm"
            disabled={!title.trim() || !company.trim()}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish Job Role & Enable Screening</span>
          </button>
        </div>

      </div>
    </div>
  );
};
