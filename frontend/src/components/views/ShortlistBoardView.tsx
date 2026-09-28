import React, { useState } from 'react';
import {
  KanbanSquare,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  FileSearch,
  Filter,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { ApplicationStage, Candidate } from '../../types';

export const ShortlistBoardView: React.FC = () => {
  const {
    candidates,
    selectedJob,
    jobs,
    setSelectedJobId,
    selectedJobId,
    updateCandidateStage,
    setSelectedCandidateId,
    setActiveTab,
    getAnalysisFor,
  } = useRecruitment();

  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

  const stages: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'border-slate-700 bg-slate-800/40 text-slate-300' },
    { id: 'reviewed', label: 'Reviewed', color: 'border-blue-900 bg-blue-950/30 text-blue-300' },
    { id: 'shortlisted', label: 'Shortlisted', color: 'border-brand-800 bg-brand-950/40 text-brand-300' },
    { id: 'interview', label: 'Interview', color: 'border-emerald-800 bg-emerald-950/40 text-emerald-300' },
    { id: 'final_review', label: 'Final Review', color: 'border-purple-800 bg-purple-950/40 text-purple-300' },
  ];

  // Candidates for selected role
  const relevantCandidates = candidates.filter(
    c => (!c.appliedJobId || c.appliedJobId === selectedJobId)
  );

  const handleInspect = (candId: string) => {
    setSelectedCandidateId(candId);
    setActiveTab('analyzer');
  };

  const handleMoveStage = (candId: string, currentStage: ApplicationStage, direction: 'next' | 'prev') => {
    const stageOrder: ApplicationStage[] = ['new', 'reviewed', 'shortlisted', 'interview', 'final_review'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (direction === 'next' && currentIndex < stageOrder.length - 1) {
      updateCandidateStage(candId, stageOrder[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      updateCandidateStage(candId, stageOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <KanbanSquare className="w-5 h-5 text-brand-400" />
            Recruitment Pipeline & Shortlist Board
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage advancement for <strong className="text-slate-200">{selectedJob?.title}</strong> ({relevantCandidates.length} total active candidates)
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Min Score:</span>
            <select
              value={minScoreFilter}
              onChange={e => setMinScoreFilter(Number(e.target.value))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900">All Candidates</option>
              <option value={70} className="bg-slate-900">&ge; 70% Match</option>
              <option value={80} className="bg-slate-900">&ge; 80% (Strong Match)</option>
              <option value={85} className="bg-slate-900">&ge; 85% High Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {stages.map(stage => {
          const stageCandidates = relevantCandidates.filter(c => {
            const matchesStage = c.stage === stage.id;
            if (!matchesStage) return false;
            if (minScoreFilter > 0 && selectedJob) {
              const analysis = getAnalysisFor(c.id, selectedJob.id);
              if ((analysis?.overallScore || 0) < minScoreFilter) return false;
            }
            return true;
          });

          return (
            <div
              key={stage.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col max-h-[82vh] overflow-hidden"
            >
              {/* Column Header */}
              <div className={`p-3 px-4 border-b flex items-center justify-between ${stage.color}`}>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-slate-900/60 border border-current">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {stageCandidates.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs italic">
                    No candidates in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  stageCandidates.map(candidate => {
                    const analysis = selectedJob ? getAnalysisFor(candidate.id, selectedJob.id) : null;
                    const score = analysis?.overallScore || 70;
                    const topSkills = analysis?.skillsAnalysis.matchedSkills.slice(0, 3) || [];
                    const missingCount = analysis?.skillsAnalysis.missingSkills.length || 0;

                    return (
                      <div
                        key={candidate.id}
                        onClick={() => handleInspect(candidate.id)}
                        className="bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-brand-500/50 rounded-xl p-3.5 space-y-2.5 cursor-pointer transition-all shadow-subtle group"
                      >
                        {/* Candidate Name & Match Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-white text-xs block group-hover:text-brand-400 transition-colors">
                              {candidate.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                              {candidate.workHistory[0]?.title || 'Analyst'}
                            </span>
                          </div>

                          <div className={`px-2 py-0.5 rounded font-black text-xs ${
                            score >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            score >= 65 ? 'bg-brand-950 text-brand-300 border border-brand-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {score}%
                          </div>
                        </div>

                        {/* Experience Tenure */}
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Tenure: <strong className="text-slate-200">{candidate.experienceYears} yrs</strong></span>
                          <span>{candidate.education[0]?.degree ? candidate.education[0].degree.split(' ')[0] : 'Degree'}</span>
                        </div>

                        {/* Top Matching Skills */}
                        <div className="flex flex-wrap gap-1">
                          {topSkills.map(m => (
                            <span
                              key={m.skill}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-750 text-slate-300 text-[10px] font-medium"
                            >
                              {m.skill}
                            </span>
                          ))}
                        </div>

                        {/* Missing Requirements Flag */}
                        {missingCount > 0 && (
                          <div className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{missingCount} required skill(s) not detected</span>
                          </div>
                        )}

                        {/* Quick Advance / Revert Buttons */}
                        <div className="pt-2 border-t border-slate-750/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInspect(candidate.id);
                            }}
                            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                          >
                            <FileSearch className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {stage.id !== 'new' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStage(candidate.id, stage.id, 'prev');
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                                title="Move back"
                              >
                                &larr;
                              </button>
                            )}
                            {stage.id !== 'final_review' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStage(candidate.id, stage.id, 'next');
                                }}
                                className="px-2 py-0.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold text-[10px]"
                                title="Advance to next stage"
                              >
                                Next &rarr;
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
