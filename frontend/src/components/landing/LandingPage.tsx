import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  BarChart3,
  Award,
  Lock,
  Search,
  Check,
  HelpCircle,
  FileCheck,
  Briefcase,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

interface LandingPageProps {
  onOpenUpload: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenUpload }) => {
  const { setActiveTab, setSelectedCandidateId, setSelectedJobId } = useRecruitment();

  const handleLaunchDemo = () => {
    setSelectedJobId('job-1');
    setSelectedCandidateId('cand-1');
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Banner: Responsible AI Commitment */}
      <div className="bg-brand-950 border-b border-brand-900/60 py-2 px-4 text-center text-xs text-brand-200">
        <span className="font-semibold text-brand-300 mr-2">Enterprise Recruitment Standard:</span>
        Zero protected characteristics scored. 100% explainable evidence-based matching.
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-slate-900 to-slate-900 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Enterprise Recruitment Intelligence Platform
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Turn Resumes Into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
              Hiring Intelligence.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Analyze resumes against real job requirements, uncover skill gaps, evaluate experience relevance, and accelerate candidate screening with explainable recruitment analytics.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-elevation transition-all focus:ring-2 focus:ring-brand-400"
            >
              <span>Analyze a Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium text-sm px-6 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              <span>View Interactive Demo</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Explainable Scoring
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Evidence Mappings
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Strict Data Privacy
            </span>
          </div>

          {/* Interactive Live Product Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-xl bg-slate-850 border border-slate-700/80 shadow-2xl p-4 sm:p-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Aarav Mehta</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                    Strong Candidate Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Evaluated against: <strong className="text-slate-300">Senior Data Analyst</strong> at FinTrack Intelligence</p>
              </div>
              <div className="flex items-baseline gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-750">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Overall Match</span>
                <span className="text-2xl font-extrabold text-brand-400">89</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            {/* Score Dimensions Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 py-4 border-b border-slate-800 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Required Skills</span>
                <span className="text-base font-bold text-white">92%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 30%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Exp. Relevance</span>
                <span className="text-base font-bold text-white">88%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 20%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Responsibilities</span>
                <span className="text-base font-bold text-white">85%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 20%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Education</span>
                <span className="text-base font-bold text-white">95%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 10%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Preferred Skills</span>
                <span className="text-base font-bold text-white">80%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 10%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Project Proof</span>
                <span className="text-base font-bold text-white">90%</span>
                <span className="text-[10px] text-slate-500 block">Weight: 10%</span>
              </div>
            </div>

            {/* Evidence Sample Row */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block text-[11px] uppercase tracking-wider">
                  Verified Skills in Resume
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['SQL', 'Python', 'Power BI', 'Excel', 'Statistics'].map(s => (
                    <span key={s} className="px-2 py-1 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {s}
                    </span>
                  ))}
                  <span className="px-2 py-1 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-medium flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    Tableau (Partial Match)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-750">
                <span className="font-semibold text-slate-300 block text-[11px] uppercase tracking-wider">
                  Sample Evidence Mapping
                </span>
                <p className="text-slate-300 leading-snug">
                  <strong className="text-brand-400">Job:</strong> Requires SQL-based business reporting & dashboarding.
                </p>
                <p className="text-slate-300 leading-snug">
                  <strong className="text-emerald-400">Resume:</strong> Built 14 production Power BI dashboards with DAX; optimized SQL queries across Snowflake.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (Step-by-Step Workflow) */}
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Complete Recruitment Intelligence Workflow
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Move beyond generic keyword scores. Screen candidates with structured NLP, empirical evidence mappings, and recruiter audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Create Job',
                desc: 'Paste any job description. Structured NLP extracts technical skills, experience tenure, and responsibilities.',
              },
              {
                step: '02',
                title: 'Upload Resume',
                desc: 'Support for PDF, DOCX, and TXT. Multi-entity extraction parses work history, degrees, and impact metrics.',
              },
              {
                step: '03',
                title: 'Analyze Match',
                desc: 'Calculates measurable dimension scores across skills, experience, responsibilities, and education.',
              },
              {
                step: '04',
                title: 'Review Evidence',
                desc: 'Inspect exact resume bullet points mapped directly to each required job responsibility.',
              },
              {
                step: '05',
                title: 'Shortlist & Hire',
                desc: 'Manage recruitment pipeline on Kanban boards, export PDF executive reports, and compare candidates.',
              },
            ].map(s => (
              <div key={s.step} className="bg-slate-850 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <span className="text-2xl font-black text-brand-400 block mb-2 font-mono">{s.step}</span>
                <h4 className="text-sm font-bold text-white mb-1.5">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Features Grid */}
      <section className="py-16 bg-slate-925 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Enterprise Talent Teams
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              High information density, explainable calculations, and evidence-first design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-brand-900/60 border border-brand-700 text-brand-300 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Explainable Scoring Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scores are not black-box guesses. Configurable weights across Required Skills, Experience Relevance, Responsibilities, Education, and Projects.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Structured Skill Gap Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Categorizes skills into Matched, Partial (requires verification), and Missing ("Not detected in submitted resume"). Never makes false negative assumptions.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Resume Evidence Mapping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every claim links back to explicit resume sentences. Recruiters see verified proof for every required job responsibility.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">ATS Compatibility & Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assesses keyword coverage, section headers, readability, and metric quantification (%, $, scale). Offers constructive suggestions without recommending keyword stuffing.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800 text-blue-300 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Recruitment Pipeline Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deep visualizations for talent match curves, skill supply vs demand, experience tenure, and funnel throughput.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Fairness & Privacy by Design</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protected personal characteristics are excluded from analysis. Data deletion guarantees protect candidate confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fairness & Responsible Screening Notice Section */}
      <section className="py-12 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-3 border border-slate-700">
            <Shield className="w-4 h-4 text-brand-400" />
            Responsible Screening Framework
          </div>
          <h3 className="text-xl font-bold text-white">Empowering Recruiters, Not Replacing Them</h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Resume Shortlist provides structured screening assistance based exclusively on job-relevant information. It does not make automated hiring decisions. Recruiters should review candidates and apply appropriate organizational hiring policies.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-925 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white">Ready to screen smarter?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Start screening candidates against real job requirements with explainable intelligence.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-elevation transition-all"
            >
              <span>Go to Platform Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-300">RESUME SHORTLIST</strong> &copy; 2026. Built with enterprise recruitment intelligence.
          </div>
          <div className="flex gap-4">
            <span>SOC2 Type II Ready</span>
            <span>GDPR Compliant</span>
            <span>Equal Opportunity Screening</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
