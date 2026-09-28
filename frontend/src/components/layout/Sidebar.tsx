import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  KanbanSquare,
  Cpu,
  Clock,
  GitCompare,
  BarChart3,
  FileCheck2,
  Settings,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Sparkles,
  LineChart,
  History,
} from 'lucide-react';
import { useRecruitment, AppTab } from '../../context/RecruitmentContext';

interface SidebarItem {
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, candidates } = useRecruitment();

  const shortlistedCount = candidates.filter(c => c.stage === 'shortlisted' || c.stage === 'interview').length;

  const navItems: SidebarItem[] = [
    // Core Workflow
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Resume Analyzer', icon: FileSearch, badge: 'Intelligence' },
    { id: 'jobs', label: 'Job Roles', icon: Briefcase },
    { id: 'shortlist', label: 'Candidate Shortlist', icon: KanbanSquare, badge: shortlistedCount > 0 ? String(shortlistedCount) : undefined },

    // Intelligence & Evaluation
    { id: 'search', label: 'Semantic Search', icon: Search, badge: 'NLP' },
    { id: 'whatif', label: 'What-If Sensitivity', icon: SlidersHorizontal, badge: 'Simulator' },
    { id: 'skills', label: 'Skill Analysis', icon: Cpu },
    { id: 'experience', label: 'Experience Relevance', icon: Clock },
    { id: 'comparison', label: 'Candidate Compare', icon: GitCompare },
    { id: 'coaching', label: 'Resume Coaching', icon: Sparkles, badge: 'Feedback' },

    // Analytics & Governance
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'evaluation', label: 'Model Evaluation', icon: LineChart, badge: 'Ground Truth' },
    { id: 'reports', label: 'Executive Reports', icon: FileCheck2 },
    { id: 'audit', label: 'Audit Trail & Logs', icon: History, badge: 'Compliant' },
    { id: 'settings', label: 'Settings & Weights', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 no-print select-none">
      {/* Workspace Context Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Platform Navigation
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-brand-950/60 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compliance & Responsible AI Box */}
      <div className="p-3 mx-2 mb-3 rounded-lg bg-slate-850 border border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fairness & Privacy Active</span>
        </div>
        <p className="text-slate-400 leading-snug">
          Zero protected characteristics evaluated. Explainable scoring with verified resume evidence.
        </p>
      </div>
    </aside>
  );
};
