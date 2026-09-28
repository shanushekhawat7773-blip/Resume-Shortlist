export type ApplicationStage = 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'final_review' | 'rejected';

export interface EducationEntry {
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
  field?: string;
}

export interface WorkExperienceEntry {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
  bulletPoints: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string[];
  outcome?: string;
  link?: string;
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
  skills: string[];
  certifications: string[];
  achievements: string[];
  stage: ApplicationStage;
  appliedJobId: string;
  resumeFileName?: string;
  rawText?: string;
  uploadDate: string;
  notes?: string[];
  isDemo?: boolean;
}

export interface JobRole {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  experienceRequired: number; // in years
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  certifications: string[];
  responsibilities: string[];
  domain: string;
  keywords: string[];
  createdAt: string;
}

export interface ScoringWeights {
  requiredSkills: number;       // default 30%
  experienceRelevance: number;  // default 20%
  responsibilities: number;     // default 20%
  education: number;            // default 10%
  preferredSkills: number;      // default 10%
  projects: number;             // default 10%
}

export interface MatchedSkill {
  skill: string;
  confidence: number;
  category: 'Programming' | 'Data & DB' | 'Analytics & BI' | 'Machine Learning' | 'Cloud & DevOps' | 'Web & Tools' | 'Soft Skills';
  resumeExcerpt: string;
}

export interface PartialMatchSkill {
  requiredSkill: string;
  candidateRelatedSkill: string;
  note: string;
  requiresVerification: boolean;
}

export interface MissingSkill {
  skill: string;
  note: string; // "Not detected in the submitted resume."
  category?: string;
}

export interface EvidenceMapping {
  jobRequirement: string;
  resumeEvidence: string;
  matchStrength: 'Strong' | 'Moderate' | 'Needs verification';
  relevanceScore: number;
}

export interface ResponsibilityMatch {
  responsibility: string;
  resumeEvidence: string;
  matchStrength: 'Strong' | 'Moderate' | 'Needs verification';
  analysisNotes: string;
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
}

export interface DimensionScores {
  requiredSkills: number;
  experienceRelevance: number;
  responsibilities: number;
  education: number;
  preferredSkills: number;
  projects: number;
}

export interface AnalysisResult {
  candidateId: string;
  jobId: string;
  overallScore: number;
  dimensionScores: DimensionScores;
  skillsAnalysis: {
    matchedSkills: MatchedSkill[];
    partialMatches: PartialMatchSkill[];
    missingSkills: MissingSkill[];
  };
  experienceAnalysis: {
    score: number;
    candidateYears: number;
    requiredYears: number;
    yearsMet: boolean;
    evidenceMappings: EvidenceMapping[];
  };
  responsibilityMatrix: ResponsibilityMatch[];
  explanation: ExplanationLayer;
  atsAnalysis: ATSAnalysis;
  resumeQuality: ResumeQuality;
  evaluatedAt: string;
}
