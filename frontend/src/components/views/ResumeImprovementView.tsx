import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileText,
  Lightbulb,
  Target,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

export const ResumeImprovementView: React.FC = () => {
  const { selectedCandidate, selectedJob, currentAnalysis } = useRecruitment();

  if (!selectedCandidate || !selectedJob || !currentAnalysis) {
    return <div className="p-8 text-center text-slate-400">Please select a candidate in the dashboard.</div>;
  }

  const { skillsAnalysis, resumeQuality, explanation, atsAnalysis } = currentAnalysis;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-brand-400" />
          Candidate Resume Coaching & Improvement Engine
        </div>
        <h2 className="text-xl font-black text-white">
          Evidence Enhancement Feedback: {selectedCandidate.name}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Actionable recommendations tailored against <strong className="text-slate-200">{selectedJob.title}</strong> at {selectedJob.company}. Note: Never fabricate experience; only highlight authentic, verifiable accomplishments.
        </p>
      </div>

      {/* 3 Core Feedback Panels */}
      <div className="space-y-4">
        
        {/* Panel 1: Documented Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths in Submitted Resume</span>
          </div>

          <div className="space-y-2 text-xs">
            {skillsAnalysis.matchedSkills.map(m => (
              <div key={m.skill} className="p-3 rounded-xl bg-slate-850 border border-emerald-900/30 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Strong evidence for {m.skill}</span>
                  <p className="text-slate-300 text-[11px] font-mono leading-snug">{m.resumeExcerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Underrepresented or Context-Limited Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Underrepresented Skills (Listed Without Full Evidence Context)</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {skillsAnalysis.partialMatches.map(p => (
              <div key={p.requiredSkill} className="p-3 rounded-xl bg-slate-850 border border-amber-900/30 space-y-1">
                <span className="font-bold text-white block">{p.requiredSkill} &bull; Conceptual Alignment</span>
                <p className="text-slate-300 text-[11px] leading-snug">{p.note}</p>
                <p className="text-amber-300 text-[11px] font-medium pt-1">
                  &rarr; Recommendation: If you have used {p.requiredSkill} commercially, add a specific bullet point with metric outcomes.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Missing Required Skills ("Not detected in the submitted resume.") */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Missing Requirements (Not Detected in Submitted Resume)</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {skillsAnalysis.missingSkills.map(m => (
              <div key={m.skill} className="p-3 rounded-xl bg-slate-850 border border-rose-900/30 space-y-1">
                <span className="font-bold text-white block">{m.skill}</span>
                <p className="text-slate-400 text-[11px] font-mono">"{m.note}"</p>
                <p className="text-slate-300 text-[11px] leading-snug">
                  If you possess genuine competency in {m.skill}, ensure standard naming appears explicitly in your Skills or Experience bullet points.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Metric Quantification & Impact Coaching */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Impact Quantification Coaching
            </h3>
            <span className="text-xs font-mono font-bold text-brand-400">
              {resumeQuality.quantifiedBulletsCount} / {resumeQuality.totalBulletsCount} Bullets Quantified
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Hiring managers look for verifiable business outcomes rather than generic task listings. Consider framing your accomplishments using the formula:
            <br />
            <strong className="text-slate-200">"Accomplished [X], as measured by [Y], by doing [Z]"</strong>
          </p>

          <div className="space-y-2 text-xs">
            {resumeQuality.actionableSuggestions.map((sug, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-slate-300 flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
