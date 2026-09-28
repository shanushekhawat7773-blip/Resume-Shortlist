import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  FileSearch,
  ArrowRight,
  Layers,
  Award,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { searchCandidates, SearchInterpretation } from '../../services/searchEngine';

export const CandidateSearchView: React.FC = () => {
  const { candidates, setSelectedCandidateId, setActiveTab } = useRecruitment();

  const [query, setQuery] = useState('Show candidates with strong SQL experience and at least one analytics project');
  const [activeResults, setActiveResults] = useState(() => searchCandidates(candidates, 'Show candidates with strong SQL experience and at least one analytics project'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveResults(searchCandidates(candidates, query));
  };

  const handleQuickPrompt = (prompt: string) => {
    setQuery(prompt);
    setActiveResults(searchCandidates(candidates, prompt));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5 text-brand-400" />
            Natural-Language Recruiter Search
          </div>
          <h2 className="text-xl font-black text-white">
            Semantic Talent Search Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query your talent pool using conversational natural language or structured skill constraints.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Find senior engineers with PyTorch, NLP, and container deployment experience..."
              className="w-full bg-slate-850 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-500 font-sans"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            Search Candidates
          </button>
        </form>

        {/* Quick Example Prompts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Try queries:</span>
          {[
            'Strong SQL with Power BI and 4+ years experience',
            'AI/ML candidates with PyTorch and NLP projects',
            'Full stack engineers with React and TypeScript',
            'Senior Business Analyst with stakeholder management and MBA',
          ].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handleQuickPrompt(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 text-[11px] transition-colors"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Search Interpretation Box (Section #19) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Search Interpretation
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Structured Filter Transpiler</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Identified Skills</span>
            <span className="font-bold text-white mt-0.5 block truncate">
              {activeResults.interpretation.extractedSkills.join(', ') || 'None specified'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Min Experience</span>
            <span className="font-bold text-white mt-0.5 block">
              {activeResults.interpretation.minExperienceYears ? `${activeResults.interpretation.minExperienceYears}+ Years` : 'Any'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Project Domain</span>
            <span className="font-bold text-white mt-0.5 block capitalize">
              {activeResults.interpretation.projectFocus || 'Any'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Degree / Institution</span>
            <span className="font-bold text-white mt-0.5 block">
              {activeResults.interpretation.educationDegree || 'Any'}
            </span>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Matching Candidates ({activeResults.results.length})
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by semantic relevance
          </span>
        </div>

        <div className="space-y-3">
          {activeResults.results.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-8 text-center">No matching candidates found for this query.</p>
          ) : (
            activeResults.results.map(({ candidate, matchScore, matchingEvidence }) => (
              <div
                key={candidate.id}
                className="p-4 rounded-xl bg-slate-850 border border-slate-750 hover:border-brand-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{candidate.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800 font-semibold font-mono">
                      {matchScore}% Relevancy
                    </span>
                    <span className="text-xs text-slate-400">
                      {candidate.experienceYears} yrs experience &bull; {candidate.education[0]?.degree}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 leading-snug">
                    {candidate.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchingEvidence.map((ev, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-[10px] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCandidateId(candidate.id);
                    setActiveTab('analyzer');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>Inspect Profile</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
