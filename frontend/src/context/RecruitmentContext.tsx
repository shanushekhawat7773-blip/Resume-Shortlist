import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  JobRole,
  Candidate,
  ScoringWeights,
  AnalysisResult,
  ApplicationStage,
} from '../types';
import { INITIAL_JOB_ROLES, INITIAL_CANDIDATES } from '../data/mockData';
import { evaluateCandidateMatch, DEFAULT_SCORING_WEIGHTS } from '../services/scoringEngine';
import { auditLogger } from '../services/auditLogger';

export type AppTab =
  | 'landing'
  | 'overview'
  | 'analyzer'
  | 'jobs'
  | 'shortlist'
  | 'skills'
  | 'experience'
  | 'comparison'
  | 'whatif'
  | 'search'
  | 'evaluation'
  | 'coaching'
  | 'analytics'
  | 'reports'
  | 'audit'
  | 'settings';

interface RecruitmentContextType {
  // Navigation & View
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Jobs
  jobs: JobRole[];
  selectedJobId: string;
  selectedJob: JobRole | null;
  setSelectedJobId: (id: string) => void;
  createJob: (job: Omit<JobRole, 'id' | 'createdAt'>) => string;
  updateJob: (job: JobRole) => void;
  deleteJob: (id: string) => void;

  // Candidates
  candidates: Candidate[];
  selectedCandidateId: string;
  selectedCandidate: Candidate | null;
  setSelectedCandidateId: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'uploadDate'>) => string;
  updateCandidateStage: (candidateId: string, stage: ApplicationStage) => void;
  deleteCandidate: (candidateId: string) => void;
  deleteCandidateData: (candidateId: string) => void; // Privacy feature

  // Scoring Weights & Configuration
  scoringWeights: ScoringWeights;
  setScoringWeights: (weights: ScoringWeights) => void;
  resetScoringWeights: () => void;

  // Analyses
  currentAnalysis: AnalysisResult | null;
  getAnalysisFor: (candidateId: string, jobId: string) => AnalysisResult | null;

  // Candidate Comparison
  compareCandidateIds: string[];
  toggleCompareCandidate: (candidateId: string) => void;
  setCompareCandidateIds: (ids: string[]) => void;

  // Processing States
  isAnalyzing: boolean;
  analyzingStep: string;
  triggerUploadAnalysis: (newCandidate: Omit<Candidate, 'id' | 'uploadDate'>, targetJobId: string) => Promise<string>;

  // Global Modals
  isBatchUploadOpen: boolean;
  setIsBatchUploadOpen: (open: boolean) => void;
  isExplainerOpen: boolean;
  setIsExplainerOpen: (open: boolean) => void;

  // Notifications
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'alert'; time: string }>;
  dismissNotification: (id: string) => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | null>(null);

const STORAGE_KEY_JOBS = 'rs_jobs_v1';
const STORAGE_KEY_CANDIDATES = 'rs_candidates_v1';
const STORAGE_KEY_WEIGHTS = 'rs_weights_v1';

export const RecruitmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Load from localStorage or mockData
  const [jobs, setJobs] = useState<JobRole[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_JOB_ROLES;
  });

  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    return INITIAL_JOB_ROLES[0]?.id || 'job-1';
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CANDIDATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_CANDIDATES;
  });

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(() => {
    return INITIAL_CANDIDATES[0]?.id || 'cand-1';
  });

  const [scoringWeights, setScoringWeightsState] = useState<ScoringWeights>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_SCORING_WEIGHTS;
  });

  const [compareCandidateIds, setCompareCandidateIds] = useState<string[]>(['cand-1', 'cand-3', 'cand-6']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'info' | 'success' | 'alert'; time: string }>>([
    { id: '1', message: 'Aarav Mehta scored 89% match for Senior Data Analyst', type: 'success', time: '10m ago' },
    { id: '2', message: 'AI/ML Engineer role created: Nexus Cognitive Systems', type: 'info', time: '1h ago' },
    { id: '3', message: 'Privacy audit: 0 protected attributes stored or evaluated', type: 'info', time: '2h ago' },
  ]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
    } catch (e) {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
    } catch (e) {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(scoringWeights));
    } catch (e) {}
  }, [scoringWeights]);

  const selectedJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  const selectedCandidate = useMemo(() => {
    return candidates.find(c => c.id === selectedCandidateId) || candidates[0] || null;
  }, [candidates, selectedCandidateId]);

  const setScoringWeights = (weights: ScoringWeights) => {
    setScoringWeightsState(weights);
    auditLogger.log({
      action: 'WEIGHT_UPDATE',
      details: `Evaluation weights updated: Required Skills ${weights.requiredSkills}%, Exp ${weights.experienceRelevance}%, Resp ${weights.responsibilities}%, Edu ${weights.education}%, Pref ${weights.preferredSkills}%, Proj ${weights.projects}%.`,
      user: 'Vikram S. (Principal Recruiter)',
    });
  };

  const resetScoringWeights = () => {
    setScoringWeightsState(DEFAULT_SCORING_WEIGHTS);
    auditLogger.log({
      action: 'WEIGHT_UPDATE',
      details: 'Evaluation weights reset to organization standard baseline.',
      user: 'Vikram S. (Principal Recruiter)',
    });
  };

  // Evaluation cache & helper
  const getAnalysisFor = (candidateId: string, jobId: string): AnalysisResult | null => {
    const cand = candidates.find(c => c.id === candidateId);
    const j = jobs.find(job => job.id === jobId);
    if (!cand || !j) return null;
    return evaluateCandidateMatch(cand, j, scoringWeights);
  };

  const currentAnalysis = useMemo(() => {
    if (!selectedCandidate || !selectedJob) return null;
    return evaluateCandidateMatch(selectedCandidate, selectedJob, scoringWeights);
  }, [selectedCandidate, selectedJob, scoringWeights]);

  // Job Operations
  const createJob = (jobData: Omit<JobRole, 'id' | 'createdAt'>): string => {
    const newId = `job-${Date.now()}`;
    const newJob: JobRole = {
      ...jobData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
    setSelectedJobId(newId);
    setNotifications(prev => [
      { id: String(Date.now()), message: `Created new job profile: ${newJob.title}`, type: 'success', time: 'Just now' },
      ...prev
    ]);
    return newId;
  };

  const updateJob = (updated: JobRole) => {
    setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selectedJobId === id) {
      const remaining = jobs.filter(j => j.id !== id);
      if (remaining.length > 0) setSelectedJobId(remaining[0].id);
    }
  };

  // Candidate Operations
  const addCandidate = (candData: Omit<Candidate, 'id' | 'uploadDate'>): string => {
    const newId = `cand-${Date.now()}`;
    const newCand: Candidate = {
      ...candData,
      id: newId,
      uploadDate: new Date().toISOString(),
    };
    setCandidates(prev => [newCand, ...prev]);
    setSelectedCandidateId(newId);

    auditLogger.log({
      action: 'UPLOAD',
      candidateName: newCand.name,
      jobTitle: jobs.find(j => j.id === newCand.appliedJobId)?.title,
      details: `Resume uploaded (${newCand.fileName || 'document'}) and structured profile extracted.`,
      user: 'Vikram S. (Principal Recruiter)',
    });

    return newId;
  };

  const updateCandidateStage = (candidateId: string, stage: ApplicationStage) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, stage } : c))
    );
    const cand = candidates.find(c => c.id === candidateId);
    if (cand) {
      auditLogger.log({
        action: 'STAGE_CHANGE',
        candidateName: cand.name,
        details: `Candidate moved to stage: ${stage.toUpperCase().replace('_', ' ')}.`,
        user: 'Vikram S. (Principal Recruiter)',
      });

      setNotifications(prev => [
        {
          id: String(Date.now()),
          message: `${cand.name} moved to stage: ${stage.toUpperCase().replace('_', ' ')}`,
          type: 'info',
          time: 'Just now'
        },
        ...prev
      ]);
    }
  };

  const deleteCandidate = (candidateId: string) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    if (selectedCandidateId === candidateId) {
      const remaining = candidates.filter(c => c.id !== candidateId);
      if (remaining.length > 0) setSelectedCandidateId(remaining[0].id);
    }
  };

  // Privacy function: explicitly deletes raw resume text and PII
  const deleteCandidateData = (candidateId: string) => {
    const cand = candidates.find(c => c.id === candidateId);
    deleteCandidate(candidateId);
    auditLogger.log({
      action: 'PRIVACY_PURGE',
      candidateName: cand?.name || candidateId,
      details: 'Candidate raw resume text and stored PII permanently purged per data privacy request.',
      user: 'Vikram S. (Principal Recruiter)',
    });

    setNotifications(prev => [
      {
        id: String(Date.now()),
        message: `Candidate data & uploaded resume permanently purged per privacy compliance`,
        type: 'alert',
        time: 'Just now'
      },
      ...prev
    ]);
  };

  const toggleCompareCandidate = (id: string) => {
    setCompareCandidateIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id]; // keep max 4 for comparison grid
      }
      return [...prev, id];
    });
  };

  // Simulated multi-stage asynchronous intelligence analysis pipeline
  const triggerUploadAnalysis = async (
    newCandData: Omit<Candidate, 'id' | 'uploadDate'>,
    targetJobId: string
  ): Promise<string> => {
    setIsAnalyzing(true);

    setAnalyzingStep('Parsing document structure & extracting plain text...');
    await new Promise(r => setTimeout(r, 400));

    setAnalyzingStep('Detecting section boundaries (Experience, Education, Skills)...');
    await new Promise(r => setTimeout(r, 400));

    setAnalyzingStep('Extracting candidate entities & normalising skills taxonomy...');
    await new Promise(r => setTimeout(r, 400));

    setAnalyzingStep('Computing semantic similarity & responsibility evidence mapping...');
    await new Promise(r => setTimeout(r, 500));

    setAnalyzingStep('Generating explainable match breakdown & ATS factors...');
    await new Promise(r => setTimeout(r, 300));

    const newId = addCandidate({
      ...newCandData,
      appliedJobId: targetJobId,
      stage: 'new',
    });

    setIsAnalyzing(false);
    setAnalyzingStep('');

    const targetJob = jobs.find(j => j.id === targetJobId);
    setNotifications(prev => [
      {
        id: String(Date.now()),
        message: `Resume for ${newCandData.name} successfully analyzed against ${targetJob?.title || 'job role'}`,
        type: 'success',
        time: 'Just now'
      },
      ...prev
    ]);

    return newId;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <RecruitmentContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        jobs,
        selectedJobId,
        selectedJob,
        setSelectedJobId,
        createJob,
        updateJob,
        deleteJob,
        candidates,
        selectedCandidateId,
        selectedCandidate,
        setSelectedCandidateId,
        addCandidate,
        updateCandidateStage,
        deleteCandidate,
        deleteCandidateData,
        scoringWeights,
        setScoringWeights,
        resetScoringWeights,
        currentAnalysis,
        getAnalysisFor,
        compareCandidateIds,
        toggleCompareCandidate,
        setCompareCandidateIds,
        isAnalyzing,
        analyzingStep,
        triggerUploadAnalysis,
        isBatchUploadOpen,
        setIsBatchUploadOpen,
        isExplainerOpen,
        setIsExplainerOpen,
        notifications,
        dismissNotification,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error('useRecruitment must be used within a RecruitmentProvider');
  }
  return context;
};
