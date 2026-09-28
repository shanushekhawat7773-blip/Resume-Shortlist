import React from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Shield,
  Briefcase,
  Users,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

export const CandidateComparisonView: React.FC = () => {
  const {
    jobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    candidates,
    compareCandidateIds,
    toggleCompareCandidate,
    setSelectedCandidateId,
    setActiveTab,
    getAnalysisFor,
  } = useRecruitment();

  if (!selectedJob) {
    return <div className="p-8 text-center text-slate-400">Please select a job role.</div>;
  }

  // Get selected candidates for comparison
  const selectedCandidates = candidates.filter(c => compareCandidateIds.includes(c.id));

  const handleInspect = (candId: string) => {
    setSelectedCandidateId(candId);
    setActiveTab('analyzer');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <GitCompare className="w-3.5 h-3.5 text-brand-400" />
            Comparative Screening Assistance
          </div>
          <h2 className="text-xl font-black text-white">
            Job-Candidate Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating candidates side-by-side against requirements for <strong className="text-slate-200">{selectedJob.title}</strong> ({selectedJob.company}).
          </p>
        </div>

        {/* Job Selector */}
        <div className="flex items-center gap-2 text-xs bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750">
          <Briefcase className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-400">Target Role:</span>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id} className="bg-slate-900">
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Enterprise Banner (Prompt Section #16 & #27) */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800 text-xs text-amber-200 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-300 font-bold uppercase tracking-wider text-[11px]">
            Screening Assistance &bull; Recruiter Review Required
          </strong>
          <span className="text-slate-300 leading-relaxed block mt-0.5">
            This comparative matrix provides structured screening assistance based strictly on job-relevant resume evidence. It does not constitute an automatic hiring decision. Final candidate selection requires human recruiter review and contextual interviews.
          </span>
        </div>
      </div>

      {/* Candidate Selector Chips (Select up to 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Select Candidates to Compare (Max 4):
        </span>
        <div className="flex flex-wrap gap-2">
          {candidates.map(c => {
            const isChecked = compareCandidateIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCompareCandidate(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                  isChecked
                    ? 'bg-brand-600 border-brand-500 text-white font-semibold shadow-sm'
                    : 'bg-slate-850 border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{c.name} ({c.experienceYears} yrs)</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table (Prompt Section #16) */}
      {selectedCandidates.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl border border-slate-800">
          Please select at least 2 candidates above to view side-by-side comparison.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-48">Evaluation Dimension</th>
                  {selectedCandidates.map(c => (
                    <th key={c.id} className="py-3 px-4 min-w-[200px]">
                      <div className="font-bold text-white text-xs">{c.name}</div>
                      <div className="text-[10px] text-slate-400 normal-case font-normal">
                        {c.education[0]?.degree || 'Candidate'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                
                {/* Overall Match */}
                <tr className="bg-slate-850/40">
                  <td className="py-3 px-4 font-bold text-white uppercase text-[11px]">
                    Overall Match
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    const score = analysis?.overallScore || 70;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <span className={`text-lg font-black ${
                          score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-brand-400' : 'text-amber-400'
                        }`}>
                          {score}%
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">/ 100</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Experience Match */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Experience Relevance
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    const expScore = analysis?.experienceAnalysis.score || 70;
                    const tenureMet = (c.experienceYears || 0) >= selectedJob.experienceRequired;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          expScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          expScore >= 65 ? 'bg-brand-950 text-brand-300 border border-brand-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {expScore >= 80 ? 'Strong' : expScore >= 65 ? 'Moderate' : 'Developing'} ({expScore}%)
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {c.experienceYears} yrs ({tenureMet ? 'Meets baseline' : 'Under baseline'})
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Required Skills Match */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Required Skills
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    const matchedCount = analysis?.skillsAnalysis.matchedSkills.length || 0;
                    const reqCount = selectedJob.requiredSkills.length;
                    const skillsScore = analysis?.dimensionScores.requiredSkills || 70;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          skillsScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          skillsScore >= 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {skillsScore >= 80 ? 'Strong' : skillsScore >= 60 ? 'Moderate' : 'Gap Detected'} ({skillsScore}%)
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {matchedCount} of {reqCount} verified
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Education */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Education
                  </td>
                  {selectedCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4">
                      <span className="font-bold text-white block text-xs">Meets Requirement</span>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                        {c.education[0]?.degree} &bull; {c.education[0]?.institution}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Top Matched Skills */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Top Verified Skills
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {analysis?.skillsAnalysis.matchedSkills.slice(0, 4).map(m => (
                            <span key={m.skill} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {m.skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Missing Skills ("Not detected in submitted resume") */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Missing Skills Flagged
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    const missing = analysis?.skillsAnalysis.missingSkills || [];
                    return (
                      <td key={c.id} className="py-3 px-4">
                        {missing.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {missing.map(m => (
                              <span key={m.skill} className="px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-900 text-rose-300 text-[10px]">
                                {m.skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-medium text-[11px]">All detected</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* ATS Keyword Coverage */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    ATS Keyword Coverage
                  </td>
                  {selectedCandidates.map(c => {
                    const analysis = getAnalysisFor(c.id, selectedJob.id);
                    const cov = analysis?.atsAnalysis.keywordCoverage || 75;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <span className="font-mono font-bold text-white text-xs">{cov}%</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Action Row */}
                <tr className="bg-slate-850/20">
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    Deep-Dive Inspection
                  </td>
                  {selectedCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4">
                      <button
                        onClick={() => handleInspect(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>Inspect Evidence</span>
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
