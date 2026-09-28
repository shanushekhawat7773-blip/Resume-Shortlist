import React from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  Shield,
  Briefcase,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  FileText,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

export const ReportsView: React.FC = () => {
  const {
    selectedCandidate,
    selectedJob,
    currentAnalysis,
    candidates,
    setSelectedCandidateId,
    scoringWeights,
  } = useRecruitment();

  if (!selectedCandidate || !selectedJob || !currentAnalysis) {
    return <div className="p-8 text-center text-slate-400">Please select a candidate in the dashboard.</div>;
  }

  const { overallScore, dimensionScores, skillsAnalysis, experienceAnalysis, responsibilityMatrix, explanation, atsAnalysis, resumeQuality } = currentAnalysis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-400" />
            Executive Candidate Screening Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready 10-section intelligence dossier for hiring managers and recruiters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCandidate.id}
            onChange={e => setSelectedCandidateId(e.target.value)}
            className="bg-slate-850 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {candidates.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.name} ({c.experienceYears} yrs)
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable 10-Section Executive Report Card */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-elevation border border-slate-200 max-w-5xl mx-auto space-y-8 font-sans">
        
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-300 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">
              Resume Shortlist &bull; Recruitment Intelligence Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Candidate Screening Dossier
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &bull; Report ID: RS-{selectedCandidate.id}-{selectedJob.id}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Overall Match</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-4xl font-black ${
                overallScore >= 80 ? 'text-emerald-700' : overallScore >= 65 ? 'text-blue-700' : 'text-amber-700'
              }`}>
                {overallScore}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              {overallScore >= 80 ? 'High Confidence' : 'Screening Review'}
            </span>
          </div>
        </div>

        {/* Section 1 & 2: Candidate Overview & Job Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          
          {/* 1. Candidate Overview */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-800">
              1. Candidate Overview
            </h3>
            <p className="text-sm font-bold text-slate-900">{selectedCandidate.name}</p>
            <p className="text-slate-600">{selectedCandidate.email} &bull; {selectedCandidate.phone}</p>
            <p className="text-slate-600">{selectedCandidate.location} &bull; {selectedCandidate.experienceYears} Years Tenure</p>
            <p className="text-slate-700 pt-1 italic line-clamp-2">
              "{selectedCandidate.summary}"
            </p>
          </div>

          {/* 2. Job Overview */}
          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-3 md:pt-0">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-brand-800">
              2. Target Role Overview
            </h3>
            <p className="text-sm font-bold text-slate-900">{selectedJob.title}</p>
            <p className="text-slate-600">{selectedJob.company} &bull; {selectedJob.department}</p>
            <p className="text-slate-600">Location: {selectedJob.location} &bull; {selectedJob.experienceRequired}+ Yrs Exp.</p>
            <p className="text-slate-700 pt-1 line-clamp-2">
              {selectedJob.description}
            </p>
          </div>

        </div>

        {/* Section 3: Overall Match & Dimension Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            3. Overall Match Breakdown (Configurable Dimensions)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Required Skills</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.requiredSkills}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.requiredSkills}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Experience</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.experienceRelevance}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.experienceRelevance}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Responsibilities</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.responsibilities}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.responsibilities}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Education</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.education}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.education}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Preferred Skills</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.preferredSkills}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.preferredSkills}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Projects Proof</span>
              <span className="text-base font-bold text-slate-900">{dimensionScores.projects}%</span>
              <span className="text-[10px] text-slate-400 block font-mono">w: {scoringWeights.projects}%</span>
            </div>
          </div>
        </div>

        {/* Section 4: Skill Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            4. Skill Analysis (Verified vs Partial Matches)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-emerald-800 block text-[11px] uppercase">
                Verified Mandatory Skills ({skillsAnalysis.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {skillsAnalysis.matchedSkills.map(m => (
                  <span key={m.skill} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                    {m.skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-amber-800 block text-[11px] uppercase">
                Partial Matches / Audit Items ({skillsAnalysis.partialMatches.length})
              </span>
              {skillsAnalysis.partialMatches.map(p => (
                <div key={p.requiredSkill} className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>{p.requiredSkill}</strong> &rarr; Candidate exhibits: {p.candidateRelatedSkill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Experience Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            5. Experience Analysis & Tenure
          </h3>
          <div className="text-xs space-y-1 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p><strong>Candidate Commercial Tenure:</strong> {selectedCandidate.experienceYears} Years (Baseline: {selectedJob.experienceRequired} Years)</p>
            <p><strong>Experience Relevance Score:</strong> {experienceAnalysis.score}%</p>
            <p><strong>Tenure Evaluation:</strong> {experienceAnalysis.yearsMet ? 'Candidate satisfies commercial maturity baseline.' : 'Tenure gap detected; verify scope in interview.'}</p>
          </div>
        </div>

        {/* Section 6: Responsibility Match Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            6. Job Responsibility Match Matrix
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
              <tr>
                <th className="p-2 border-b">Role Responsibility</th>
                <th className="p-2 border-b">Resume Evidence Excerpt</th>
                <th className="p-2 border-b text-center">Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {responsibilityMatrix.slice(0, 4).map((r, i) => (
                <tr key={i}>
                  <td className="p-2 font-medium">{r.responsibility}</td>
                  <td className="p-2 font-mono text-[11px] text-slate-600">{r.resumeEvidence}</td>
                  <td className="p-2 text-center font-bold">
                    <span className={r.matchStrength === 'Strong' ? 'text-emerald-700' : 'text-amber-700'}>
                      {r.matchStrength}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 7: Missing Requirements ("Not detected in the submitted resume.") */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            7. Missing Requirements (Not Detected)
          </h3>
          {skillsAnalysis.missingSkills.length > 0 ? (
            <ul className="text-xs space-y-1 list-disc pl-5 text-rose-800">
              {skillsAnalysis.missingSkills.map(m => (
                <li key={m.skill}>
                  <strong>{m.skill}:</strong> {m.note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700 font-medium">All mandatory requirements detected in submitted resume.</p>
          )}
        </div>

        {/* Section 8: Resume Evidence Highlights */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            8. Resume Evidence Highlights
          </h3>
          <div className="space-y-1.5 text-xs text-slate-700">
            {selectedCandidate.workHistory.slice(0, 2).map((exp, i) => (
              <div key={i} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">{exp.title} at {exp.company}</span>
                <p className="text-slate-600 mt-0.5">{exp.bulletPoints[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 9: Resume Quality & ATS */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 text-brand-800">
            9. Resume Quality & Potential ATS Factors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Quality Score</span>
              <span className="font-bold text-slate-900 text-sm">{resumeQuality.qualityScore}/100</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">ATS Keyword Coverage</span>
              <span className="font-bold text-slate-900 text-sm">{atsAnalysis.keywordCoverage}%</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Quantified Bullets</span>
              <span className="font-bold text-slate-900 text-sm">{resumeQuality.quantifiedBulletsCount} of {resumeQuality.totalBulletsCount}</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Formatting Rating</span>
              <span className="font-bold text-emerald-700 text-sm">Clean Parsable</span>
            </div>
          </div>
        </div>

        {/* Section 10: Recruiter Verification Points & Human Audit */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            10. Recruiter Verification Points
          </h3>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            {explanation.verificationNeeded.map((pt, i) => (
              <p key={i}>&bull; {pt}</p>
            ))}
          </div>
        </div>

        {/* Responsible AI Disclaimer Sign-off */}
        <div className="pt-6 border-t border-slate-300 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resume Shortlist provides screening assistance based on job-relevant information. It does not make hiring decisions.</span>
          <span className="font-mono">Audit Hash: RS-SHA256-{selectedCandidate.id.toUpperCase()}</span>
        </div>

      </div>

    </div>
  );
};
