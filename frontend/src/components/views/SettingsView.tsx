import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Lock,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { ScoringWeights } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    scoringWeights,
    setScoringWeights,
    resetScoringWeights,
    candidates,
    deleteCandidateData,
  } = useRecruitment();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedDeleteCandidateId, setSelectedDeleteCandidateId] = useState(candidates[0]?.id || '');

  const totalWeight =
    scoringWeights.requiredSkills +
    scoringWeights.experienceRelevance +
    scoringWeights.responsibilities +
    scoringWeights.education +
    scoringWeights.preferredSkills +
    scoringWeights.projects;

  const handleWeightChange = (key: keyof ScoringWeights, val: number) => {
    setScoringWeights({
      ...scoringWeights,
      [key]: val,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeleteData = () => {
    if (!selectedDeleteCandidateId) return;
    deleteCandidateData(selectedDeleteCandidateId);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-brand-400" />
            Platform Settings & Scoring Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure algorithmic scoring dimensions, privacy controls, and ethical fairness parameters.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            Weights Updated & Applied Live
          </span>
        )}
      </div>

      {/* Configurable Scoring Weights (Section #6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-400" />
              Configurable Scoring Weights
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize how each measurable dimension contributes to the overall match score (0-100).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              totalWeight === 100
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}>
              Total Weight: {totalWeight}%
            </span>

            <button
              onClick={resetScoringWeights}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Required Skills Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Required Skills Dimension</span>
              <span className="text-brand-400 font-mono">{scoringWeights.requiredSkills}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={scoringWeights.requiredSkills}
              onChange={e => handleWeightChange('requiredSkills', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Strict match verification against required job skill list.
            </span>
          </div>

          {/* Experience Relevance Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Experience Relevance Dimension</span>
              <span className="text-brand-400 font-mono">{scoringWeights.experienceRelevance}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={scoringWeights.experienceRelevance}
              onChange={e => handleWeightChange('experienceRelevance', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Commercial tenure years ratio + empirical history relevance.
            </span>
          </div>

          {/* Job Responsibilities Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Job Responsibilities Match</span>
              <span className="text-brand-400 font-mono">{scoringWeights.responsibilities}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={scoringWeights.responsibilities}
              onChange={e => handleWeightChange('responsibilities', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Matrix alignment of resume bullet points to role duties.
            </span>
          </div>

          {/* Education Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Education Match Dimension</span>
              <span className="text-brand-400 font-mono">{scoringWeights.education}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={scoringWeights.education}
              onChange={e => handleWeightChange('education', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Degree level, institution tier, and academic rigor.
            </span>
          </div>

          {/* Preferred Skills Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Preferred Skills Dimension</span>
              <span className="text-brand-400 font-mono">{scoringWeights.preferredSkills}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={scoringWeights.preferredSkills}
              onChange={e => handleWeightChange('preferredSkills', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Nice-to-have capabilities and secondary tools.
            </span>
          </div>

          {/* Projects / Evidence Slider */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Projects / Evidence Proof</span>
              <span className="text-brand-400 font-mono">{scoringWeights.projects}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={scoringWeights.projects}
              onChange={e => handleWeightChange('projects', Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Practical portfolio projects and quantified project outcomes.
            </span>
          </div>

        </div>
      </div>

      {/* Privacy Notice & Candidate Data Deletion (Section #26) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Candidate Data Privacy & Right to Deletion
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            GDPR, CCPA, and enterprise privacy compliance controls.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 text-xs text-slate-300 space-y-2">
          <p>
            <strong>What is processed:</strong> Candidate text extracted from uploaded resumes (skills, work history, education).
          </p>
          <p>
            <strong>Why it is processed:</strong> Exclusively for screening assistance against designated job descriptions.
          </p>
          <p>
            <strong>Retention & Privacy:</strong> Raw documents are stored with strict access control and are never shared publicly or used to train third-party public AI models.
          </p>
        </div>

        {/* Delete Candidate Data Tool */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 space-y-3">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
            Purge Candidate Records (Permanent Deletion)
          </span>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <select
              value={selectedDeleteCandidateId}
              onChange={e => setSelectedDeleteCandidateId(e.target.value)}
              className="w-full sm:flex-1 bg-slate-900 border border-rose-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>

            <button
              onClick={handleDeleteData}
              disabled={!selectedDeleteCandidateId}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Candidate PII</span>
            </button>
          </div>
        </div>

      </div>

      {/* Fairness & Responsible Screening Notice (Section #27) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" />
          Fairness & Non-Discrimination Policy
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          Resume Shortlist is explicitly engineered to ensure candidate evaluations are unbiased, auditable, and job-relevant. The scoring pipeline does NOT process or evaluate protected personal characteristics including religion, caste, race, gender, disability, political affiliation, or age.
        </p>

        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-slate-400 italic">
          "Resume Shortlist provides screening assistance based on job-relevant information. It does not make hiring decisions. Recruiters should review candidates and apply appropriate organizational hiring policies."
        </div>
      </div>

    </div>
  );
};
