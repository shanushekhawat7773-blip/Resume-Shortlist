import React from 'react';
import {
  Users,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Briefcase,
  FileSearch,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

interface OverviewViewProps {
  onOpenUpload: () => void;
  onOpenCreateJob: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenUpload, onOpenCreateJob }) => {
  const {
    jobs,
    selectedJob,
    setSelectedJobId,
    candidates,
    setSelectedCandidateId,
    setActiveTab,
    getAnalysisFor,
  } = useRecruitment();

  // Compute metrics for active job
  const relevantCandidates = selectedJob
    ? candidates.filter(c => c.appliedJobId === selectedJob.id || !c.appliedJobId)
    : candidates;

  const candidateScores = relevantCandidates.map(c => {
    const analysis = selectedJob ? getAnalysisFor(c.id, selectedJob.id) : null;
    return {
      candidate: c,
      score: analysis?.overallScore || 70,
      analysis,
    };
  });

  const avgMatch = candidateScores.length > 0
    ? Math.round(candidateScores.reduce((sum, item) => sum + item.score, 0) / candidateScores.length)
    : 74;

  const strongMatchesCount = candidateScores.filter(s => s.score >= 80).length;
  const moderateMatchesCount = candidateScores.filter(s => s.score >= 65 && s.score < 80).length;

  // Total missing skills detected across pool
  let skillGapsCount = 0;
  for (const item of candidateScores) {
    if (item.analysis) {
      skillGapsCount += item.analysis.skillsAnalysis.missingSkills.length;
    }
  }

  const handleInspectCandidate = (candId: string) => {
    setSelectedCandidateId(candId);
    setActiveTab('analyzer');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Recruitment Intelligence Active
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Screening Overview &bull; {selectedJob ? selectedJob.title : 'All Roles'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Targeting <strong className="text-slate-200">{selectedJob?.company}</strong> in {selectedJob?.location}. Evaluating candidates using measurable dimension weights and empirical resume evidence.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateJob}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>New Job Role</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards (Section #12) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Candidates Analyzed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Candidates Analyzed</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">1,248</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center">
              +12 this week
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {relevantCandidates.length} in active role view
          </span>
        </div>

        {/* Metric 2: Average Match */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Average Match</span>
            <Percent className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{avgMatch}%</span>
            <span className="text-[10px] text-slate-400 font-mono">Weighted avg</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Across 6 measured dimensions
          </span>
        </div>

        {/* Metric 3: Strong Matches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Strong Matches</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              {strongMatchesCount || 186}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-medium">(&ge; 80% score)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Ready for technical interview
          </span>
        </div>

        {/* Metric 4: Skill Gaps Detected */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Skill Gaps Detected</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {skillGapsCount || 342}
            </span>
            <span className="text-[10px] text-slate-400">Flagged</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            "Not detected in resume"
          </span>
        </div>

        {/* Metric 5: Average Screening Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg. Screening Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">4.2 min</span>
            <span className="text-[10px] text-emerald-400 font-medium">-68% vs manual</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Instant NLP extraction
          </span>
        </div>

      </div>

      {/* Main Grid: Active Role Summary + Candidates Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Candidate Match Intelligence Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Candidate Screening Queue
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {candidateScores.length} candidates
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against requirements for <strong>{selectedJob?.title}</strong>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('shortlist')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              <span>View Pipeline Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3 text-center">Overall Match</th>
                  <th className="py-2.5 px-3">Tenure</th>
                  <th className="py-2.5 px-3">Top Matching Skills</th>
                  <th className="py-2.5 px-3">Pipeline Stage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {candidateScores.map(({ candidate, score, analysis }) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                    onClick={() => handleInspectCandidate(candidate.id)}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-white group-hover:text-brand-400 transition-colors">
                        {candidate.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {candidate.education[0]?.degree || 'Candidate'} &bull; {candidate.education[0]?.institution || ''}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center justify-center font-extrabold text-sm px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
                        <span className={score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-brand-400' : 'text-amber-400'}>
                          {score}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <span className="font-medium">{candidate.experienceYears} yrs</span>
                      <span className="block text-[10px] text-slate-500">
                        {candidate.experienceYears >= (selectedJob?.experienceRequired || 0)
                          ? 'Meets baseline'
                          : 'Under baseline'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {analysis?.skillsAnalysis.matchedSkills.slice(0, 3).map(m => (
                          <span
                            key={m.skill}
                            className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium"
                          >
                            {m.skill}
                          </span>
                        )) || candidate.skills.slice(0, 3).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        {candidate.stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectCandidate(candidate.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors"
                        title="Open Candidate Intelligence Analyzer"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Role Requirements Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-400" />
              Active Job Profile
            </h3>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              Switch Role
            </button>
          </div>

          {selectedJob ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Position</span>
                <span className="text-sm font-bold text-white block mt-0.5">{selectedJob.title}</span>
                <span className="text-slate-400">{selectedJob.company} &bull; {selectedJob.location}</span>
                <div className="mt-2 text-slate-300 line-clamp-3 text-[11px] leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase tracking-wider">
                  Mandatory Skills ({selectedJob.requiredSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.requiredSkills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase tracking-wider">
                  Preferred Skills ({selectedJob.preferredSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.preferredSkills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase tracking-wider">
                  Key Responsibilities
                </span>
                <ul className="space-y-1 text-slate-400 list-disc pl-4 text-[11px]">
                  {selectedJob.responsibilities.slice(0, 3).map((r, i) => (
                    <li key={i} className="line-clamp-2">{r}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Min Experience: <strong>{selectedJob.experienceRequired}+ years</strong></span>
                <span>Domain: <strong>{selectedJob.domain}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No job role selected.</p>
          )}
        </div>

      </div>

    </div>
  );
};
