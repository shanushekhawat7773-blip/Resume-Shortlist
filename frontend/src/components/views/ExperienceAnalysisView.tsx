import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Briefcase,
  Layers,
  FileText,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

export const ExperienceAnalysisView: React.FC = () => {
  const { selectedCandidate, selectedJob, currentAnalysis } = useRecruitment();

  if (!selectedCandidate || !selectedJob || !currentAnalysis) {
    return <div className="p-8 text-center text-slate-400">Please select a candidate in the dashboard.</div>;
  }

  const { experienceAnalysis, responsibilityMatrix } = currentAnalysis;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            Experience Relevance Engine
          </div>
          <h2 className="text-xl font-black text-white">
            Tenure & Empirical Experience Mapping: {selectedCandidate.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Matching commercial duties and achievements against requirements for <strong className="text-slate-200">{selectedJob.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-850 px-4 py-2 rounded-xl border border-slate-750 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience Relevance</span>
            <span className="text-2xl font-black text-emerald-400">{experienceAnalysis.score}%</span>
          </div>
        </div>
      </div>

      {/* Tenure Baseline Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
          <span className="text-slate-400 block text-[11px]">Candidate Experience</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{selectedCandidate.experienceYears} Years</span>
          <span className="text-slate-500 text-[10px]">Verified from work history dates</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
          <span className="text-slate-400 block text-[11px]">Required Baseline</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{selectedJob.experienceRequired}+ Years</span>
          <span className="text-slate-500 text-[10px]">Role baseline requirement</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
          <span className="text-slate-400 block text-[11px]">Tenure Status</span>
          <span className={`text-xl font-bold mt-0.5 block ${
            experienceAnalysis.yearsMet ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {experienceAnalysis.yearsMet ? 'Baseline Satisfied' : 'Under Baseline'}
          </span>
          <span className="text-slate-500 text-[10px]">
            {experienceAnalysis.yearsMet ? 'Meets commercial maturity criteria' : 'Tenure gap flagged for review'}
          </span>
        </div>
      </div>

      {/* Core Section #8: Resume Evidence -> Job Requirement Mapping */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            Direct Evidence Mappings (Resume Evidence &rarr; Job Requirement)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent, auditable proof points connecting real candidate achievements to role expectations.
          </p>
        </div>

        <div className="space-y-4">
          {experienceAnalysis.evidenceMappings.map((mapping, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-950 border border-brand-800 text-brand-300 flex items-center justify-center text-[10px] font-mono">
                    {idx + 1}
                  </span>
                  Job Requirement: <strong className="text-brand-300">{mapping.jobRequirement}</strong>
                </span>

                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  mapping.matchStrength === 'Strong'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : mapping.matchStrength === 'Moderate'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {mapping.matchStrength} Match
                </span>
              </div>

              {/* Exact snippet */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 block uppercase font-mono mb-1">
                  Empirical Resume Proof:
                </span>
                <p className="text-slate-200 font-sans leading-relaxed">
                  {mapping.resumeEvidence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
