import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sliders,
  Shield,
  FileCode,
  ExternalLink,
  BookOpen,
  UserCheck,
  Check,
  X,
  Target,
  BarChart2,
  Trash2,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { ApplicationStage } from '../../types';

export const ResumeAnalyzerView: React.FC = () => {
  const {
    candidates,
    selectedCandidateId,
    setSelectedCandidateId,
    jobs,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    selectedCandidate,
    currentAnalysis,
    scoringWeights,
    updateCandidateStage,
    deleteCandidateData,
    setActiveTab,
    setIsExplainerOpen,
  } = useRecruitment();

  const [activeAnalysisSubtab, setActiveAnalysisSubtab] = useState<
    'score' | 'skills' | 'experience' | 'responsibilities' | 'ats' | 'profile'
  >('score');

  if (!selectedCandidate || !selectedJob || !currentAnalysis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Candidate or Job Selected</h3>
        <p className="text-xs max-w-sm mx-auto mb-4">
          Select or upload a candidate resume to inspect structured recruitment intelligence against a job profile.
        </p>
        <button
          onClick={() => setActiveTab('overview')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const { overallScore, dimensionScores, skillsAnalysis, experienceAnalysis, responsibilityMatrix, explanation, atsAnalysis, resumeQuality } = currentAnalysis;

  const handleStageChange = (newStage: ApplicationStage) => {
    updateCandidateStage(selectedCandidate.id, newStage);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card: Candidate & Active Role Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          
          {/* Candidate Profile Summary */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center font-extrabold text-xl shadow-md ring-1 ring-white/10 shrink-0">
              {selectedCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white">{selectedCandidate.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-950 border border-brand-800 text-brand-300">
                  {selectedCandidate.workHistory[0]?.title || 'Professional'}
                </span>
                <span className="text-xs text-slate-400">
                  &bull; {selectedCandidate.experienceYears} Years Experience
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                <span>{selectedCandidate.email}</span>
                <span>{selectedCandidate.phone}</span>
                <span>{selectedCandidate.location}</span>
                {selectedCandidate.linkedin && (
                  <span className="text-brand-400 hover:underline cursor-pointer">LinkedIn</span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Match Badge & Score */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-850 border border-slate-750 p-3 px-5 rounded-xl flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Overall Role Match
                </span>
                <span className="text-xs text-slate-500 block">Explainable composite</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black ${
                  overallScore >= 80 ? 'text-emerald-400' : overallScore >= 65 ? 'text-brand-400' : 'text-amber-400'
                }`}>
                  {overallScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>

            {/* Stage Selector Dropdown */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Pipeline Stage:
              </span>
              <select
                value={selectedCandidate.stage}
                onChange={e => handleStageChange(e.target.value as ApplicationStage)}
                className="bg-slate-850 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="final_review">Final Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

        </div>

        {/* Candidate & Job Switchers Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Screening Candidate:</span>
            <select
              value={selectedCandidateId}
              onChange={e => setSelectedCandidateId(e.target.value)}
              className="bg-slate-850 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-brand-500"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.experienceYears} yrs)
                </option>
              ))}
            </select>

            <span className="text-slate-500">against role:</span>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="bg-slate-850 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-brand-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} &bull; {j.company}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Generate Executive Report</span>
            </button>
            <button
              onClick={() => deleteCandidateData(selectedCandidate.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800 transition-colors"
              title="Delete candidate data per privacy request"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge PII</span>
            </button>
          </div>
        </div>

      </div>

      {/* Subtab Navigation (Section #6 to #15) */}
      <div className="flex border-b border-slate-800 text-xs font-semibold gap-2 overflow-x-auto">
        {[
          { id: 'score', label: 'Score Breakdown & Weights', icon: Sliders },
          { id: 'skills', label: `Skill Matching (${skillsAnalysis.matchedSkills.length} Matched)`, icon: Target },
          { id: 'experience', label: 'Experience Relevance', icon: Clock },
          { id: 'responsibilities', label: 'Job Responsibility Matrix', icon: Layers },
          { id: 'ats', label: 'Resume Quality & ATS Factors', icon: BarChart2 },
          { id: 'profile', label: 'Candidate Snapshot & Matrix', icon: UserCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAnalysisSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAnalysisSubtab(tab.id as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-brand-500 text-brand-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCORE BREAKDOWN & EXPLAINABLE WEIGHTS (Section #6) */}
      {activeAnalysisSubtab === 'score' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 cols): 6 Measurable Dimension Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Measurable Evaluation Dimensions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculated from verifiable resume signals. Each dimension contributes according to configured organizational weights.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsExplainerOpen(true)}
                    className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 bg-brand-950/40 px-2.5 py-1 rounded border border-brand-850 hover:bg-brand-900/50 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Formula</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configure Weights</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Required Skills',
                    score: dimensionScores.requiredSkills,
                    weight: scoringWeights.requiredSkills,
                    desc: `${skillsAnalysis.matchedSkills.length} of ${selectedJob.requiredSkills.length} required skills verified`,
                  },
                  {
                    name: 'Experience Relevance',
                    score: dimensionScores.experienceRelevance,
                    weight: scoringWeights.experienceRelevance,
                    desc: `${selectedCandidate.experienceYears} yrs commercial tenure vs ${selectedJob.experienceRequired} yrs baseline`,
                  },
                  {
                    name: 'Job Responsibilities Match',
                    score: dimensionScores.responsibilities,
                    weight: scoringWeights.responsibilities,
                    desc: `${responsibilityMatrix.filter(r => r.matchStrength === 'Strong').length} duties with strong empirical evidence`,
                  },
                  {
                    name: 'Education Match',
                    score: dimensionScores.education,
                    weight: scoringWeights.education,
                    desc: `${selectedCandidate.education[0]?.degree || 'Degree detected'} &bull; ${selectedCandidate.education[0]?.institution || ''}`,
                  },
                  {
                    name: 'Preferred Skills',
                    score: dimensionScores.preferredSkills,
                    weight: scoringWeights.preferredSkills,
                    desc: `${selectedJob.preferredSkills.length} nice-to-have capabilities evaluated`,
                  },
                  {
                    name: 'Projects / Evidence Proof',
                    score: dimensionScores.projects,
                    weight: scoringWeights.projects,
                    desc: `${selectedCandidate.projects.length} practical projects portfolio verified`,
                  },
                ].map(dim => (
                  <div key={dim.name} className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white mr-2">{dim.name}</span>
                        <span className="text-slate-400 text-[11px]">{dim.desc}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">Weight: {dim.weight}%</span>
                        <span className="font-bold text-white text-sm">{dim.score}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          dim.score >= 80 ? 'bg-emerald-500' : dim.score >= 65 ? 'bg-brand-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Explanation Panel (Section #13) */}
          <div className="space-y-4">
            
            {/* Why this candidate matches */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Why This Candidate Matches</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {explanation.whyMatches.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/50">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification Needed (Section #13) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Recruiter Verification Points</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {explanation.verificationNeeded.length > 0 ? (
                  explanation.verificationNeeded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-900/50">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic text-xs">No significant verification risks detected.</li>
                )}
              </ul>
            </div>

            {/* Ethical Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                Screening assistance only. Scores are explainable and derived strictly from submitted job requirements and resume evidence.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SKILL MATCHING (Section #7) */}
      {activeAnalysisSubtab === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Matched Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Skills ({skillsAnalysis.matchedSkills.length})
                </h4>
                <span className="text-[10px] text-slate-500">Clearly found in resume</span>
              </div>
              
              <div className="space-y-2.5">
                {skillsAnalysis.matchedSkills.map(m => (
                  <div key={m.skill} className="p-2.5 rounded-xl bg-slate-850 border border-emerald-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{m.skill}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic leading-snug">
                      {m.resumeExcerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Partial Match Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Partial Match ({skillsAnalysis.partialMatches.length})
                </h4>
                <span className="text-[10px] text-slate-500">Requires verification</span>
              </div>

              <div className="space-y-2.5">
                {skillsAnalysis.partialMatches.length > 0 ? (
                  skillsAnalysis.partialMatches.map(p => (
                    <div key={p.requiredSkill} className="p-2.5 rounded-xl bg-slate-850 border border-amber-900/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{p.requiredSkill}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          Related: {p.candidateRelatedSkill}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {p.note}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No partial matches flagged. All evaluated skills are either verified or missing.
                  </p>
                )}
              </div>
            </div>

            {/* Column 3: Missing Skills (Section #7: "Not detected in the submitted resume.") */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Skills ({skillsAnalysis.missingSkills.length})
                </h4>
                <span className="text-[10px] text-slate-500">Required but undetected</span>
              </div>

              <div className="space-y-2.5">
                {skillsAnalysis.missingSkills.length > 0 ? (
                  skillsAnalysis.missingSkills.map(m => (
                    <div key={m.skill} className="p-2.5 rounded-xl bg-slate-850 border border-rose-900/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{m.skill}</span>
                        <span className="text-[10px] text-rose-400 font-medium">Gap flagged</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic font-mono leading-snug">
                        "{m.note}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-emerald-400 font-semibold py-4 text-center">
                    All required skills were successfully detected in the submitted resume!
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: EXPERIENCE RELEVANCE ENGINE (Section #8) */}
      {activeAnalysisSubtab === 'experience' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Experience Relevance & Evidence Mapping
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct empirical comparison: <strong className="text-brand-400">Resume Evidence &rarr; Job Requirement</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs">
                  <span className="text-slate-400 mr-2">Candidate Tenure:</span>
                  <strong className="text-white">{experienceAnalysis.candidateYears} yrs</strong>
                  <span className="text-slate-500 ml-1">({selectedJob.experienceRequired} yrs required)</span>
                </div>
                <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs">
                  <span className="text-slate-400 mr-2">Relevance Score:</span>
                  <strong className="text-emerald-400 font-bold">{experienceAnalysis.score}%</strong>
                </div>
              </div>
            </div>

            {/* Evidence Mapping Cards */}
            <div className="space-y-3">
              {experienceAnalysis.evidenceMappings.map((map, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-400 shrink-0" />
                      Job Requirement: <span className="text-brand-300 font-semibold">{map.jobRequirement}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      map.matchStrength === 'Strong'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : map.matchStrength === 'Moderate'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {map.matchStrength} Match ({map.relevanceScore}%)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono mb-1">
                      Submitted Resume Evidence:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {map.resumeEvidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: JOB RESPONSIBILITY MATCH MATRIX (Section #9) */}
      {activeAnalysisSubtab === 'responsibilities' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Job Responsibility Evidence Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Systematic evaluation of role duties against explicit candidate work accomplishments.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 w-1/3">Job Responsibility</th>
                  <th className="py-2.5 px-4 w-5/12">Resume Evidence Excerpt</th>
                  <th className="py-2.5 px-4 text-center">Match Strength</th>
                  <th className="py-2.5 px-4">Recruiter Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {responsibilityMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white leading-snug">
                      {item.responsibility}
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px] leading-relaxed">
                      {item.resumeEvidence}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                        item.matchStrength === 'Strong'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : item.matchStrength === 'Moderate'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.matchStrength}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px] leading-snug">
                      {item.analysisNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ATS & RESUME QUALITY ANALYSIS (Section #14 & #15) */}
      {activeAnalysisSubtab === 'ats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ATS Compatibility Box (Section #15) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  ATS Compatibility
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Potential ATS compatibility factors (No keyword stuffing recommended).
                </p>
              </div>
              <div className="bg-slate-850 px-3 py-1 rounded-lg border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Keyword Coverage</span>
                <span className="text-lg font-black text-brand-400">{atsAnalysis.keywordCoverage}%</span>
              </div>
            </div>

            {/* Detected Keywords */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Detected Job-Relevant Keywords ({atsAnalysis.detectedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.detectedKeywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Missing / Underrepresented Role Keywords ({atsAnalysis.missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.missingKeywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Compatibility Factors */}
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-300 block text-[11px] uppercase tracking-wider">
                Formatting & Structural Factors:
              </span>
              {atsAnalysis.compatibilityFactors.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Quality Analysis (Section #14) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Resume Quality & Metric Quantification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Structure, readability, quantification, and impact clarity.
                </p>
              </div>
              <div className="bg-slate-850 px-3 py-1 rounded-lg border border-slate-750 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Quality Score</span>
                <span className="text-lg font-black text-emerald-400">{resumeQuality.qualityScore}/100</span>
              </div>
            </div>

            {/* Quantification Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-200">Quantified Impact Bullets</span>
                <span className="text-slate-400 font-mono">
                  {resumeQuality.quantifiedBulletsCount} of {resumeQuality.totalBulletsCount} bullets with metrics
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${resumeQuality.quantificationScore}%` }}
                />
              </div>
            </div>

            {/* Actionable Suggestions */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
                Actionable Feedback for Candidate / Recruiter:
              </span>
              <ul className="space-y-2 text-xs">
                {resumeQuality.actionableSuggestions.map((sug, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-850 border border-slate-750 text-slate-300 flex items-start gap-2 leading-snug">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* TAB 6: CANDIDATE SNAPSHOT & SKILLS MATRIX (Section #10) */}
      {activeAnalysisSubtab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-6">
            
            {/* Professional Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Executive Profile Summary
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-850 p-4 rounded-xl border border-slate-750">
                {selectedCandidate.summary}
              </p>
            </div>

            {/* Education & Work Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Education
                </h4>
                <div className="space-y-2">
                  {selectedCandidate.education.map((edu, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs">
                      <span className="font-bold text-white block">{edu.degree}</span>
                      <span className="text-slate-400 block mt-0.5">{edu.institution} {edu.year ? `(${edu.year})` : ''}</span>
                      {edu.gpa && <span className="text-[11px] text-brand-400 mt-1 block">GPA: {edu.gpa}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Commercial Experience
                </h4>
                <div className="space-y-2">
                  {selectedCandidate.workHistory.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{exp.title}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{exp.duration}</span>
                      </div>
                      <span className="text-brand-400 text-[11px] block">{exp.company}</span>
                      <ul className="mt-2 space-y-1 list-disc pl-4 text-slate-300 text-[11px]">
                        {exp.bulletPoints.slice(0, 2).map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Projects Portfolio */}
            {selectedCandidate.projects.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Demonstrated Projects & Outcomes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCandidate.projects.map((proj, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1.5">
                      <span className="font-bold text-white block">{proj.title}</span>
                      <p className="text-slate-300 text-[11px] leading-snug">{proj.description}</p>
                      {proj.outcome && (
                        <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Outcome: {proj.outcome}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
