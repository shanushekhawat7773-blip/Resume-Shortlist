import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Shield,
  Target,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { SKILL_ONTOLOGY } from '../../services/skillOntology';

export const SkillAnalysisView: React.FC = () => {
  const { selectedCandidate, selectedJob, currentAnalysis, candidates, setSelectedCandidateId } = useRecruitment();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchSkill, setSearchSkill] = useState('');

  if (!selectedCandidate || !selectedJob || !currentAnalysis) {
    return <div className="p-8 text-center text-slate-400">Please select a candidate in the dashboard.</div>;
  }

  const { matchedSkills, partialMatches, missingSkills } = currentAnalysis.skillsAnalysis;

  const categories = ['all', 'Programming', 'Data & DB', 'Analytics & BI', 'Machine Learning', 'Cloud & DevOps', 'Web & Tools', 'Soft Skills'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            Structured Skill Intelligence
          </div>
          <h2 className="text-xl font-black text-white">
            Skill Gap & Competency Analysis: {selectedCandidate.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating against <strong className="text-slate-200">{selectedJob.title}</strong> at {selectedJob.company}.
          </p>
        </div>

        {/* Quick Candidate Switcher */}
        <div className="flex items-center gap-2 text-xs bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750">
          <span className="text-slate-400">Candidate:</span>
          <select
            value={selectedCandidate.id}
            onChange={e => setSelectedCandidateId(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {candidates.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Matched Skills</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400">{matchedSkills.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Clearly verified in resume</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Partial Matches</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400">{partialMatches.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Related skills requiring audit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Missing Skills</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400">{missingSkills.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">"Not detected in submitted resume"</span>
        </div>
      </div>

      {/* Main Grid: Matched Skills Excerpts + Partial Match Audit Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Verified Matched Skills with Excerpt Evidence */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Skill Excerpts ({matchedSkills.length})
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {matchedSkills.map(m => (
              <div key={m.skill} className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{m.skill}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                    {m.category}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                  {m.resumeExcerpt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partial Matches & Missing Skills with Recruiter Verification */}
        <div className="space-y-6">
          
          {/* Partial Match Verification Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Partial Match Verification Points
            </h3>
            <p className="text-xs text-slate-400">
              Candidate demonstrates related conceptual experience. Recruiters should verify direct tool depth.
            </p>

            <div className="space-y-2.5">
              {partialMatches.length > 0 ? (
                partialMatches.map(p => (
                  <div key={p.requiredSkill} className="p-3 rounded-xl bg-slate-850 border border-amber-900/40 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{p.requiredSkill} (Required)</span>
                      <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        Has: {p.candidateRelatedSkill}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{p.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-3">No partial matches flagged.</p>
              )}
            </div>
          </div>

          {/* Missing Skills Warning Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Undetected Mandatory Requirements
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Strict Wording Policy</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with enterprise fair screening principles, we do not claim the candidate absolutely lacks these skills.
            </p>

            <div className="space-y-2">
              {missingSkills.length > 0 ? (
                missingSkills.map(m => (
                  <div key={m.skill} className="p-3 rounded-xl bg-slate-850 border border-rose-900/40 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{m.skill}</span>
                      <span className="block text-[10px] text-rose-300 font-mono mt-0.5">"{m.note}"</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Interview Question
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800 text-xs text-emerald-400 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No missing required skills. 100% role skill coverage detected.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
