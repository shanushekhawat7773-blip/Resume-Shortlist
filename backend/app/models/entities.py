import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(64), default="Recruiter") # Admin, Recruiter, HiringManager
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

class JobModel(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str] = mapped_column(String(255), index=True)
    department: Mapped[str] = mapped_column(String(255), default="Engineering")
    location: Mapped[str] = mapped_column(String(255), default="Bangalore, India")
    employment_type: Mapped[str] = mapped_column(String(64), default="Full-time")
    seniority: Mapped[str] = mapped_column(String(64), default="Mid") # Entry, Mid, Senior, Lead, Principal
    experience_required: Mapped[int] = mapped_column(Integer, default=3)
    description: Mapped[str] = mapped_column(Text)
    required_skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    preferred_skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    education: Mapped[str] = mapped_column(String(255), default="Bachelor's degree")
    certifications: Mapped[List[str]] = mapped_column(JSON, default=list)
    responsibilities: Mapped[List[str]] = mapped_column(JSON, default=list)
    domain: Mapped[str] = mapped_column(String(255), default="Enterprise Technology")
    keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    jd_quality_score: Mapped[int] = mapped_column(Integer, default=90)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    requirements = relationship("RequirementModel", back_populates="job", cascade="all, delete-orphan")
    analyses = relationship("AnalysisModel", back_populates="job", cascade="all, delete-orphan")

class RequirementModel(Base):
    __tablename__ = "job_requirements"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    job_id: Mapped[str] = mapped_column(String(64), ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(64)) # Skill, Experience, Education, Responsibility
    importance: Mapped[str] = mapped_column(String(32), default="Required") # Required, Preferred, Bonus
    weight: Mapped[int] = mapped_column(Integer, default=20)
    description: Mapped[str] = mapped_column(Text, default="")
    semantic_tokens: Mapped[List[str]] = mapped_column(JSON, default=list)

    job = relationship("JobModel", back_populates="requirements")

class CandidateModel(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(64), default="Not detected")
    location: Mapped[str] = mapped_column(String(255), default="Not detected")
    linkedin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    github: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    summary: Mapped[str] = mapped_column(Text, default="")
    experience_years: Mapped[float] = mapped_column(Float, default=0.0)
    education: Mapped[List[dict]] = mapped_column(JSON, default=list)
    work_history: Mapped[List[dict]] = mapped_column(JSON, default=list)
    projects: Mapped[List[dict]] = mapped_column(JSON, default=list)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list)
    stage: Mapped[str] = mapped_column(String(64), default="new", index=True) # new, reviewed, shortlisted, interview, final_review, rejected
    applied_job_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True, index=True)
    resume_file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    document_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    raw_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    upload_date: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    analyses = relationship("AnalysisModel", back_populates="candidate", cascade="all, delete-orphan")
    resumes = relationship("ResumeModel", back_populates="candidate", cascade="all, delete-orphan")

class ResumeModel(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    candidate_id: Mapped[str] = mapped_column(String(64), ForeignKey("candidates.id", ondelete="CASCADE"), index=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_size: Mapped[int] = mapped_column(Integer, default=0)
    document_hash: Mapped[str] = mapped_column(String(64), index=True)
    raw_text: Mapped[str] = mapped_column(Text)
    section_confidence: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    candidate = relationship("CandidateModel", back_populates="resumes")

class AnalysisModel(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    candidate_id: Mapped[str] = mapped_column(String(64), ForeignKey("candidates.id", ondelete="CASCADE"), index=True)
    job_id: Mapped[str] = mapped_column(String(64), ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    overall_score: Mapped[int] = mapped_column(Integer, index=True)
    match_classification: Mapped[str] = mapped_column(String(64)) # Strong, Moderate, Verification, Low
    dimension_scores: Mapped[dict] = mapped_column(JSON) # requiredSkills, experienceRelevance, responsibilities, etc.
    requirement_matrix: Mapped[List[dict]] = mapped_column(JSON, default=list)
    evaluated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    model_version: Mapped[str] = mapped_column(String(64), default="v2.4-HybridSemantic")

    candidate = relationship("CandidateModel", back_populates="analyses")
    job = relationship("JobModel", back_populates="analyses")

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    timestamp: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, index=True)
    action: Mapped[str] = mapped_column(String(64), index=True) # UPLOAD, ANALYSIS, STAGE_CHANGE, WEIGHT_UPDATE, PRIVACY_PURGE, DELETE
    candidate_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    candidate_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    job_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    details: Mapped[str] = mapped_column(Text)
    user: Mapped[str] = mapped_column(String(255), default="System")

class ScoringConfigModel(Base):
    __tablename__ = "scoring_configurations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), default="Standard Enterprise Baseline")
    required_skills: Mapped[int] = mapped_column(Integer, default=30)
    experience_relevance: Mapped[int] = mapped_column(Integer, default=20)
    responsibilities: Mapped[int] = mapped_column(Integer, default=20)
    education: Mapped[int] = mapped_column(Integer, default=10)
    preferred_skills: Mapped[int] = mapped_column(Integer, default=10)
    projects: Mapped[int] = mapped_column(Integer, default=10)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
