import React, { useState } from 'react';
import {
  FileText,
  Search,
  Bell,
  User,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Briefcase,
  X,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';
import { useRecruitment, AppTab } from '../../context/RecruitmentContext';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenCreateJob: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, onOpenCreateJob }) => {
  const {
    activeTab,
    setActiveTab,
    jobs,
    selectedJobId,
    setSelectedJobId,
    searchQuery,
    setSearchQuery,
    notifications,
    dismissNotification,
    setIsBatchUploadOpen,
  } = useRecruitment();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Global Talent Acquisition');

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 group-hover:bg-brand-500 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  RESUME SHORTLIST
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300">
                    Enterprise
                  </span>
                </span>
                <span className="block text-[11px] text-slate-400 font-medium tracking-wide">
                  Recruitment Intelligence Platform
                </span>
              </div>
            </button>

            {/* Workspace Selector */}
            <div className="hidden lg:block relative ml-4 pl-4 border-l border-slate-800">
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-750"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentWorkspace}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showWorkspaceMenu && (
                <div className="absolute left-4 mt-2 w-64 rounded-lg bg-slate-850 border border-slate-700 shadow-elevation py-1 z-50">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Workspace
                  </div>
                  {[
                    'Global Talent Acquisition',
                    'Engineering & Tech Hiring',
                    'Executive Search Pipeline',
                    'Campus Recruitment 2026',
                  ].map(ws => (
                    <button
                      key={ws}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                        currentWorkspace === ws
                          ? 'bg-brand-900/50 text-brand-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {ws}
                      {currentWorkspace === ws && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Global Active Job Selector & Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-lg mx-2">
            {/* Quick Job Switcher */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-brand-400 mr-2 shrink-0" />
                <span className="text-slate-400 mr-1.5 shrink-0">Active Role:</span>
                <select
                  value={selectedJobId}
                  onChange={e => setSelectedJobId(e.target.value)}
                  className="bg-transparent text-white font-medium text-xs focus:outline-none w-full cursor-pointer truncate"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-brand-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Right: Actions, Notifications, User */}
          <div className="flex items-center gap-2.5">
            {/* Landing page toggle */}
            {activeTab !== 'landing' ? (
              <button
                onClick={() => setActiveTab('landing')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
                title="View product landing page"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                Landing Page
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('overview')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
              >
                Open Dashboard
              </button>
            )}

            {/* Batch Upload CTA */}
            <button
              onClick={() => setIsBatchUploadOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-slate-600"
              title="Process multi-candidate batch pipeline"
            >
              <UploadCloud className="w-3.5 h-3.5 text-brand-400" />
              <span>Batch Pipeline</span>
            </button>

            {/* Upload Resume CTA */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-brand-400"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Analyze Resume</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-elevation p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-semibold text-white">System Activity & Alerts</span>
                    <span className="text-[10px] text-slate-400">{notifications.length} recent</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No unread notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className="flex items-start justify-between gap-2 p-2 rounded-md bg-slate-850 border border-slate-800 text-xs"
                        >
                          <div>
                            <p className="text-slate-200 font-medium leading-tight">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-750 border border-slate-650 flex items-center justify-center text-xs font-bold text-slate-200">
                VS
              </div>
              <div className="hidden xl:block text-left">
                <span className="block text-xs font-medium text-slate-200 leading-none">Vikram S.</span>
                <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">Principal Recruiter</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
