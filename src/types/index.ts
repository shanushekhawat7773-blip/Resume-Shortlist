// Advanced Production Recruitment Intelligence Types

export type ApplicationStage = 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'final_review' | 'rejected';

export type MatchStrength = 'Strong' | 'Moderate' | 'Needs verification' | 'Not detected';
export type RequirementImportance = 'Required' | 'Preferred' | 'Bonus';

export interface TraceableEntity<T> {
  value: T;
  sourceText: string;
  section: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements' | 'header';
  confidence: number; // 0.0 - 1.0
  evidenceLocation?: string; // e.g. "Work Experience (Lead Analyst at FinPulse Systems)"
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
  field?: string;
  confidence: number;
  sourceText: string;
}

export interface WorkExperienceEntry {
  title: string;
  company: string;
  duration: string;
  years: number;
  location?: string;
  description: string;
  bulletPoints: string[];
  technologiesUsed: string[];
  quantifiedImpacts: string[];
  relevanceConfidence: number;
  sourceText: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string[];
  objective?: string;
  methodology?: string;
  outcome?: string;
  measurableImpact?: string;
  confidence: number;
  sourceText: string;
}

export interface AchievementEntry {
  title: string;
  description: string;
  impactMetric?: string;
  confidence: number;
  sourceText: string;
}

export interface StructuredSkill {
  name: string;
  canonicalName: string;
  category: 'Programming' | 'Data & DB' | 'Analytics & BI' | 'Machine Learning' | 'Cloud & DevOps' | 'Web & Tools' | 'Soft Skills';
  context: 'active_work' | 'project' | 'skills_list' | 'coursework';
  confidence: number; // Higher if demonstrated in work/projects rather than just listed
  evidenceSnippet: string;
  sourceSection: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  experienceYears: number;
  education: EducationEntry[];
  workHistory: WorkExperienceEntry[];
  projects: ProjectEntry[];
  structuredSkills: StructuredSkill[];
  skills: string[]; // convenience canonical array
  certifications: string[];
  achievements: AchievementEntry[];
  stage: ApplicationStage;
  appliedJobId: string;
  resumeFileName?: string;
  fileName?: string;
  documentHash?: string; // SHA-256 for caching
  rawText?: string;
  uploadDate: string;
  notes?: string[];
  isDemo?: boolean;
}

export interface StructuredRequirement {
  id: string;
  name: string;
  category: 'Skill' | 'Experience' | 'Education' | 'Responsibility' | 'Tool' | 'Domain';
  importance: RequirementImportance;
  weight: number; // e.g. 10 to 30
  description: string;
  canonicalSkillSlug?: string;
  minYears?: number;
  semanticTokens: string[];
}

export interface JobRole {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  seniority: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  experienceRequired: number; // in years
  description: string;
  structuredRequirements: StructuredRequirement[];
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  certifications: string[];
  responsibilities: string[];
  domain: string;
  keywords: string[];
  createdAt: string;
  jdQualityScore?: number;
  jdSuggestions?: string[];
}

export interface ScoringWeights {
  requiredSkills: number;       // default 30%
  experienceRelevance: number;  // default 20%
  responsibilities: number;     // default 20%
  education: number;            // default 10%
  preferredSkills: number;      // default 10%
  projects: number;             // default 10%
}

export interface RequirementCoverageItem {
  requirementId: string;
  requirementName: string;
  category: string;
  importance: RequirementImportance;
  matchStrength: MatchStrength;
  confidence: number; // 0 - 100%
  semanticSimilarity: number; // 0.0 - 1.0
  evidenceText: string;
  evidenceSource: string;
  contextType: 'demonstrated_in_work' | 'demonstrated_in_project' | 'listed_in_skills' | 'not_detected';
  isMet: boolean;
}

export interface DimensionScores {
  requiredSkills: number;
  experienceRelevance: number;
  responsibilities: number;
  education: number;
  preferredSkills: number;
  projects: number;
}

export interface AnalysisCalculationBreakdown {
  formula: string;
  dimensionBreakdown: Array<{
    dimension: string;
    rawScore: number;
    weightPercent: number;
    contribution: number;
  }>;
  overallScore: number;
  scoringModelVersion: string;
}

export interface ATSAnalysis {
  keywordCoverage: number;
  detectedKeywords: string[];
  missingKeywords: string[];
  formattingScore: number;
  sectionScore: number;
  standardHeadingsDetected: string[];
  missingHeadings: string[];
  compatibilityFactors: string[];
}

export interface ResumeQuality {
  qualityScore: number;
  structureScore: number;
  readabilityScore: number;
  quantificationScore: number;
  quantifiedBulletsCount: number;
  totalBulletsCount: number;
  actionableSuggestions: string[];
}

export interface ExplanationLayer {
  whyMatches: string[];
  verificationNeeded: string[];
  riskFactors: string[];
  evidenceHighlights: string[];
}

export interface AnalysisResult {
  candidateId: string;
  jobId: string;
  overallScore: number;
  confidenceScore: number; // Overall evidence confidence (0-100)
  dimensionScores: DimensionScores;
  coverageMatrix: RequirementCoverageItem[];
  skillsAnalysis: {
    matchedSkills: Array<{
      skill: string;
      confidence: number;
      category: string;
      resumeExcerpt: string;
      context: string;
    }>;
    partialMatches: Array<{
      requiredSkill: string;
      candidateRelatedSkill: string;
      note: string;
      confidence: number;
      requiresVerification: boolean;
    }>;
    missingSkills: Array<{
      skill: string;
      note: string;
      category?: string;
    }>;
  };
  experienceAnalysis: {
    score: number;
    candidateYears: number;
    requiredYears: number;
    yearsMet: boolean;
    evidenceMappings: Array<{
      jobRequirement: string;
      resumeEvidence: string;
      matchStrength: MatchStrength;
      confidence: number;
      relevanceScore: number;
    }>;
  };
  responsibilityMatrix: Array<{
    responsibility: string;
    resumeEvidence: string;
    matchStrength: MatchStrength;
    confidence: number;
    analysisNotes: string;
  }>;
  explanation: ExplanationLayer;
  atsAnalysis: ATSAnalysis;
  resumeQuality: ResumeQuality;
  calculationBreakdown: AnalysisCalculationBreakdown;
  evaluatedAt: string;
  scoringModelVersion: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'UPLOAD' | 'ANALYSIS' | 'STAGE_CHANGE' | 'WEIGHT_UPDATE' | 'DELETE' | 'REPORT_EXPORT' | 'BATCH_PROCESS' | 'PRIVACY_PURGE';
  candidateName?: string;
  candidateId?: string;
  jobTitle?: string;
  details: string;
  user: string;
}

export interface BatchProcessingItem {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  candidateId?: string;
  candidateName?: string;
  score?: number;
  errorMessage?: string;
}

export interface ModelEvaluationMetrics {
  totalEvaluated: number;
  precision: number;
  recall: number;
  f1Score: number;
  precisionAtK: number; // P@3
  recallAtK: number;    // R@3
  meanAveragePrecision: number;
  ndcgScore: number;
  averageSemanticSimilarity: number;
  latencyMs: number;
  benchmarkDate: string;
  datasetName: string;
}
