import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileSearch,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { ScoringWeights } from '../../types';
import { evaluateCandidateMatch, DEFAULT_SCORING_WEIGHTS } from '../../services/scoringEngine';

export const WhatIfSimulatorView: React.FC = () => {
  const { candidates, selectedJob, scoringWeights, setSelectedCandidateId, setActiveTab } = useRecruitment();

  const [simWeights, setSimWeights] = useState<ScoringWeights>({ ...scoringWeights });

  if (!selectedJob) {
    return <div className="p-8 text-center text-slate-400">Please select an active job role.</div>;
  }

  const handleSliderChange = (key: keyof ScoringWeights, val: number) => {
    setSimWeights(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleReset = () => {
    setSimWeights({ ...DEFAULT_SCORING_WEIGHTS });
  };

  const relevantCandidates = candidates.filter(c => c.appliedJobId === selectedJob.id || !c.appliedJobId);

  // Compute baseline scores vs simulated scores
  const comparisonList = relevantCandidates.map(c => {
    const baseEval = evaluateCandidateMatch(c, selectedJob, scoringWeights);
    const simEval = evaluateCandidateMatch(c, selectedJob, simWeights);
    const delta = simEval.overallScore - baseEval.overallScore;

    return {
      candidate: c,
      baseScore: baseEval.overallScore,
      simScore: simEval.overallScore,
      delta,
      baseEval,
      simEval,
    };
  });

  // Sort descending by simulated score
  comparisonList.sort((a, b) => b.simScore - a.simScore);

  const totalSimWeight = Object.values(simWeights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5 text-brand-400" />
            Recruiter What-If Weight Simulator
          </div>
          <h2 className="text-xl font-black text-white">
            What-If Sensitivity Analysis: {selectedJob.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust requirement weight distributions and observe real-time candidate ranking shifts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
            totalSimWeight === 100
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-amber-950 text-amber-400 border-amber-800'
          }`}>
            Total Weight: {totalSimWeight}%
          </span>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Simulated Weight Distribution
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          {[
            { key: 'requiredSkills', label: 'Required Skills' },
            { key: 'experienceRelevance', label: 'Experience' },
            { key: 'responsibilities', label: 'Responsibilities' },
            { key: 'education', label: 'Education' },
            { key: 'preferredSkills', label: 'Preferred Skills' },
            { key: 'projects', label: 'Projects Proof' },
          ].map(item => (
            <div key={item.key} className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300 text-[11px] truncate">{item.label}</span>
                <span className="text-brand-400 font-mono">{(simWeights as any)[item.key]}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={(simWeights as any)[item.key]}
                onChange={e => handleSliderChange(item.key as any, Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recalculated Ranking Table with Delta Indicators */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Re-Ranked Candidates ({comparisonList.length})
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by simulated score descending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Candidate</th>
                <th className="py-2.5 px-4 text-center">Baseline Match</th>
                <th className="py-2.5 px-4 text-center">Simulated Match</th>
                <th className="py-2.5 px-4 text-center">Impact Delta</th>
                <th className="py-2.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {comparisonList.map((item, idx) => (
                <tr key={item.candidate.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                  
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block text-sm">{item.candidate.name}</span>
                    <span className="text-slate-400 text-[11px] block">
                      {item.candidate.experienceYears} yrs experience &bull; {item.candidate.education[0]?.institution || 'Institution'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-300">
                    {item.baseScore}%
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`text-base font-extrabold ${
                      item.simScore >= 80 ? 'text-emerald-400' : item.simScore >= 65 ? 'text-brand-400' : 'text-amber-400'
                    }`}>
                      {item.simScore}%
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {item.delta > 0 ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold font-mono">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        +{item.delta}%
                      </span>
                    ) : item.delta < 0 ? (
                      <span className="inline-flex items-center text-rose-400 font-bold font-mono">
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                        {item.delta}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-500 font-mono">
                        <Minus className="w-3.5 h-3.5 mr-0.5" />
                        0%
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCandidateId(item.candidate.id);
                        setActiveTab('analyzer');
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Candidate"
                    >
                      <FileSearch className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
