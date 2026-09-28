import React from 'react';
import {
  X,
  Sliders,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import { AnalysisResult } from '../../types';

interface CalculationExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
}

export const CalculationExplainerModal: React.FC<CalculationExplainerModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  if (!isOpen) return null;

  const { calculationBreakdown, dimensionScores } = analysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl shadow-elevation overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-400" />
              Scoring Methodology & Mathematical Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Model Version: <strong className="text-brand-300 font-mono">{calculationBreakdown.scoringModelVersion}</strong> &bull; 100% reproducible and auditable
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Formula Card */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
            <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block font-mono">
              Composite Formula
            </span>
            <p className="text-sm font-mono text-white bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              {calculationBreakdown.formula}
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every score is computed deterministically from measurable resume signals. There are zero unexplainable black-box or randomized weights.
            </p>
          </div>

          {/* Dimension Contribution Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Exact Component Contributions to Overall Match ({calculationBreakdown.overallScore} / 100)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800">
                <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Dimension</th>
                    <th className="py-2.5 px-3 text-center">Raw Dimension Score</th>
                    <th className="py-2.5 px-3 text-center">Configured Weight</th>
                    <th className="py-2.5 px-3 text-right">Points Contributed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {calculationBreakdown.dimensionBreakdown.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-850/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{row.dimension}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-300">{row.rawScore}%</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{row.weightPercent}%</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-400">+{row.contribution} pts</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-850 font-bold">
                    <td className="py-2.5 px-3 text-white uppercase">Overall Result</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">&mdash;</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">100%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-mono text-sm">
                      {calculationBreakdown.overallScore} / 100
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Dimension Methodologies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dimension Derivation Rules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-850 border border-slate-750 space-y-1">
                <span className="font-bold text-white block">Required Skills</span>
                <p className="text-slate-400 text-[11px]">
                  Exact matches score 100%. Partial matches via ontology relationships score 55%. Missing skills contribute 0%.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-850 border border-slate-750 space-y-1">
                <span className="font-bold text-white block">Experience Relevance</span>
                <p className="text-slate-400 text-[11px]">
                  Calculated from verified commercial tenure ratio (40% weight) + semantic cosine similarity of work history bullets (60% weight).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-850 border border-slate-750 space-y-1">
                <span className="font-bold text-white block">Responsibilities Match</span>
                <p className="text-slate-400 text-[11px]">
                  Evaluates each job duty against resume accomplishments. Strong matches score 95%, Moderate score 70%, undetected score 35%.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-850 border border-slate-750 space-y-1">
                <span className="font-bold text-white block">Education Match</span>
                <p className="text-slate-400 text-[11px]">
                  Degree level classification: Doctorate (100%), Master's/MBA (95%), Bachelor's/B.Tech (90%), Foundational (80%).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero protected personal characteristics evaluated</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
