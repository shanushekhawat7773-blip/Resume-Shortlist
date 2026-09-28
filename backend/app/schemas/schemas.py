from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime

# ----------------- Job Schemas -----------------
class StructuredRequirementSchema(BaseModel):
    id: str
    name: str
    category: str = "Skill"
    importance: str = "Required"
    weight: int = 20
    description: str = ""
    semantic_tokens: List[str] = Field(default_factory=list)

class JobCreate(BaseModel):
    title: str
    company: str
    department: str = "Engineering & Technology"
    location: str = "Bangalore, India (Hybrid)"
    employment_type: str = "Full-time"
    seniority: str = "Senior"
    experience_required: int = 3
    description: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    education: str = "Bachelor's degree in Computer Science or related"
    certifications: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    domain: str = "Enterprise Technology"
    keywords: List[str] = Field(default_factory=list)

class JobResponse(JobCreate):
    id: str
    jd_quality_score: int = 90
    created_at: datetime.datetime
    structured_requirements: List[StructuredRequirementSchema] = Field(default_factory=list)

    class Config:
        from_attributes = True

# ----------------- Candidate Schemas -----------------
class EducationEntrySchema(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None
    gpa: Optional[str] = None
    field: Optional[str] = None
    confidence: float = 0.9

class WorkExperienceEntrySchema(BaseModel):
    title: str
    company: str
    duration: str
    years: float = 1.0
    description: str = ""
    bullet_points: List[str] = Field(default_factory=list)
    technologies_used: List[str] = Field(default_factory=list)
    quantified_impacts: List[str] = Field(default_factory=list)

class ProjectEntrySchema(BaseModel):
    title: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    measurable_impact: Optional[str] = None

class CandidateCreate(BaseModel):
    name: str
    email: str
    phone: str = "Not detected"
    location: str = "Not detected"
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: str = ""
    experience_years: float = 0.0
    skills: List[str] = Field(default_factory=list)
    education: List[EducationEntrySchema] = Field(default_factory=list)
    work_history: List[WorkExperienceEntrySchema] = Field(default_factory=list)
    projects: List[ProjectEntrySchema] = Field(default_factory=list)
    applied_job_id: Optional[str] = None
    stage: str = "new"
    resume_file_name: Optional[str] = None
    raw_text: Optional[str] = None

class CandidateResponse(CandidateCreate):
    id: str
    document_hash: Optional[str] = None
    upload_date: datetime.datetime

    class Config:
        from_attributes = True

class CandidateStageUpdate(BaseModel):
    stage: str # new, reviewed, shortlisted, interview, final_review, rejected

# ----------------- Analysis & Scoring Schemas -----------------
class ScoringWeightsSchema(BaseModel):
    required_skills: int = 30
    experience_relevance: int = 20
    responsibilities: int = 20
    education: int = 10
    preferred_skills: int = 10
    projects: int = 10

class DimensionScoresSchema(BaseModel):
    required_skills: int
    experience_relevance: int
    responsibilities: int
    education: int
    preferred_skills: int
    projects: int

class RequirementCoverageItemSchema(BaseModel):
    requirement_name: str
    category: str
    importance: str
    candidate_evidence: str
    evidence_location: Optional[str] = None
    match_strength: str # Strong, Moderate, Needs verification, Not detected
    confidence: float
    audit_notes: str

class AnalysisRequest(BaseModel):
    candidate_id: str
    job_id: str
    weights: Optional[ScoringWeightsSchema] = None

class AnalysisResponse(BaseModel):
    id: str
    candidate_id: str
    job_id: str
    overall_score: int
    match_classification: str
    dimension_scores: DimensionScoresSchema
    requirement_coverage_matrix: List[RequirementCoverageItemSchema]
    ats_score: int = 92
    evaluated_at: datetime.datetime
    model_version: str = "v2.4-HybridSemantic"

# ----------------- Search Schemas -----------------
class SearchQueryRequest(BaseModel):
    query: str
    target_job_id: Optional[str] = None

class SearchInterpretationSchema(BaseModel):
    skills_identified: List[str]
    min_experience_years: Optional[int] = None
    degree_required: Optional[str] = None
    project_keywords: List[str]

class SearchResultCandidate(BaseModel):
    candidate_id: str
    name: str
    experience_years: float
    relevance_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    evidence_snippet: str
    stage: str

class SearchQueryResponse(BaseModel):
    interpretation: SearchInterpretationSchema
    results: List[SearchResultCandidate]

# ----------------- Comparison Schemas -----------------
class CompareRequest(BaseModel):
    candidate_ids: List[str]
    job_id: str

class CompareCandidateMatrix(BaseModel):
    candidate_id: str
    name: str
    overall_score: int
    dimension_scores: DimensionScoresSchema
    matched_skills_count: int
    missing_skills_count: int
    experience_years: float
    key_evidence: str
    stage: str

class CompareResponse(BaseModel):
    job_title: str
    company: str
    candidates: List[CompareCandidateMatrix]
    recruiter_recommendations: List[str]

# ----------------- Audit Log Schemas -----------------
class AuditLogSchema(BaseModel):
    id: str
    timestamp: datetime.datetime
    action: str
    candidate_name: Optional[str] = None
    candidate_id: Optional[str] = None
    job_title: Optional[str] = None
    details: str
    user: str

    class Config:
        from_attributes = True
