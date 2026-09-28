import React, { useState } from 'react';
import { RecruitmentProvider, useRecruitment } from './context/RecruitmentContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/views/OverviewView';
import { ResumeAnalyzerView } from './components/views/ResumeAnalyzerView';
import { JobRolesView } from './components/views/JobRolesView';
import { ShortlistBoardView } from './components/views/ShortlistBoardView';
import { SkillAnalysisView } from './components/views/SkillAnalysisView';
import { ExperienceAnalysisView } from './components/views/ExperienceAnalysisView';
import { CandidateComparisonView } from './components/views/CandidateComparisonView';
import { AnalyticsDashboardView } from './components/views/AnalyticsDashboardView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { ResumeUploadModal } from './components/modals/ResumeUploadModal';
import { CreateJobModal } from './components/modals/CreateJobModal';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, isAnalyzing, analyzingStep } = useRecruitment();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);

  // If on landing page, display full-width landing experience
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <Navbar
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenCreateJob={() => setCreateJobModalOpen(true)}
        />
        <main className="flex-1">
          <LandingPage onOpenUpload={() => setUploadModalOpen(true)} />
        </main>
        
        {/* Modals */}
        <ResumeUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
        <CreateJobModal
          isOpen={createJobModalOpen}
          onClose={() => setCreateJobModalOpen(false)}
        />
      </div>
    );
  }

  // Dashboard layout with Sidebar & Main Content Area
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setUploadModalOpen(true)}
        onOpenCreateJob={() => setCreateJobModalOpen(true)}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Dynamic Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-925">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewView
                onOpenUpload={() => setUploadModalOpen(true)}
                onOpenCreateJob={() => setCreateJobModalOpen(true)}
              />
            )}
            {activeTab === 'analyzer' && <ResumeAnalyzerView />}
            {activeTab === 'jobs' && (
              <JobRolesView onOpenCreateJob={() => setCreateJobModalOpen(true)} />
            )}
            {activeTab === 'shortlist' && <ShortlistBoardView />}
            {activeTab === 'skills' && <SkillAnalysisView />}
            {activeTab === 'experience' && <ExperienceAnalysisView />}
            {activeTab === 'comparison' && <CandidateComparisonView />}
            {activeTab === 'analytics' && <AnalyticsDashboardView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Asynchronous Analysis Overlay if background pipeline is processing */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-950 border border-brand-800 text-brand-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white">
              Recruitment Intelligence Pipeline
            </h3>
            <p className="text-xs text-brand-300 font-mono">
              {analyzingStep || 'Analyzing resume structure & matching against role...'}
            </p>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
            </div>
            <span className="text-[11px] text-slate-500 block">
              Extracting entities &bull; Computing explainable evidence &bull; Scoring
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      <ResumeUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      <CreateJobModal
        isOpen={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RecruitmentProvider>
      <AppContent />
    </RecruitmentProvider>
  );
};

export default App;
