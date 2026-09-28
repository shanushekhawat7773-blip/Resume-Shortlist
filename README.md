# RESUME SHORTLIST
### Enterprise AI-Powered Recruitment Intelligence & Resume Screening Platform

> **Engineered for Talent Teams, Recruiters, and Hiring Managers**  
> Move beyond arbitrary black-box AI scores. Evaluate candidates against verified job requirements using **structured NLP parsing, explainable multi-dimensional scoring, empirical evidence mappings, and recruitment analytics**.

---

## 🚀 Key Highlights & Philosophy

1. **Explainable Scoring Engine**: The overall score (0–100) is mathematically calculated from six measurable dimensions:
   - **Required Skills** (Default: 30%)
   - **Experience Relevance** (Default: 20%)
   - **Job Responsibilities Match** (Default: 20%)
   - **Education Level** (Default: 10%)
   - **Preferred Skills** (Default: 10%)
   - **Projects / Portfolio Proof** (Default: 10%)
   *Weights are fully configurable live in Settings.*

2. **Auditable Evidence Mapping (Resume Evidence &rarr; Job Requirement)**:
   - For every duty in the Job Description, the system surfaces the exact sentence or project from the candidate's resume that demonstrates practical competency.
   - Categorizes matches as **Strong**, **Moderate**, or **Needs Verification**.

3. **Responsible Screening & Non-Definitive Wording**:
   - The platform strictly adheres to fair hiring standards. When a required skill is absent, it is explicitly flagged as:  
     **`"Not detected in the submitted resume."`**  
     rather than falsely claiming the candidate definitively lacks the skill.
   - **Zero Protected Attributes**: Age, gender, race, caste, religion, and political affiliation are completely excluded from scoring.

4. **Multi-Format Document Ingestion**:
   - Support for **PDF**, **DOCX**, and **TXT** files via drag-and-drop or raw text pasting.
   - Extracts contact information, education degrees, commercial tenure years, skills taxonomy, and **quantified impact metrics** (%, $, latency reduction, scale).

5. **Recruitment Pipeline Kanban & Analytics**:
   - Visual candidate movement across stages: `New` &rarr; `Reviewed` &rarr; `Shortlisted` &rarr; `Interview` &rarr; `Final Review`.
   - Recharts visualizer for candidate match distribution curves, skill demand vs. supply, tenure spread, and screening funnels.

6. **Executive 10-Section Printable Report**:
   - One-click print-ready / PDF dossier containing:
     1. Candidate Overview
     2. Job Overview
     3. Overall Match & Dimension Breakdown
     4. Skill Analysis (Verified vs. Partial)
     5. Experience & Tenure Analysis
     6. Responsibility Match Matrix
     7. Missing Requirements
     8. Resume Evidence Highlights
     9. Resume Quality & Potential ATS Factors
     10. Recruiter Verification Audit Points

---

## 📂 Architecture Overview

```
resume-shortlist/
├── src/
│   ├── components/
│   │   ├── landing/              # Editorial SaaS Landing Page
│   │   │   └── LandingPage.tsx
│   │   ├── layout/               # Top Navbar & Enterprise Sidebar
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── modals/               # Upload & Job Creation Modals
│   │   │   ├── CreateJobModal.tsx
│   │   │   └── ResumeUploadModal.tsx
│   │   └── views/                # 10 Core Application Workspaces
│   │       ├── OverviewView.tsx
│   │       ├── ResumeAnalyzerView.tsx
│   │       ├── JobRolesView.tsx
│   │       ├── ShortlistBoardView.tsx
│   │       ├── SkillAnalysisView.tsx
│   │       ├── ExperienceAnalysisView.tsx
│   │       ├── CandidateComparisonView.tsx
│   │       ├── AnalyticsDashboardView.tsx
│   │       ├── ReportsView.tsx
│   │       └── SettingsView.tsx
│   ├── context/                  # React Recruitment Context & Store
│   │   └── RecruitmentContext.tsx
│   ├── data/                     # Realistic Demo Candidates & Job Roles
│   │   └── mockData.ts
│   ├── services/                 # Structured NLP & Scoring Engines
│   │   ├── jobParser.ts          # Automatic JD Intelligence Extractor
│   │   ├── nlpEngine.ts          # Semantic token matching & entities
│   │   ├── resumeParser.ts       # Structured resume parser & quantification
│   │   ├── scoringEngine.ts      # Multi-dimensional mathematical scoring
│   │   └── skillOntology.ts      # 500+ Skill taxonomy & relationship map
│   ├── types/                    # Strict TypeScript Interfaces
│   │   └── index.ts
│   ├── App.tsx                   # Main Router & Viewport Shell
│   ├── index.css                 # Tailwind Directives & Print Stylesheets
│   └── main.tsx
├── tests/
│   └── test_screening_engine.js  # Node.js Unit Verification Test Suite
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to explore the application.

### 3. Run Automated Unit Tests
```bash
node tests/test_screening_engine.js
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 🛡️ Enterprise Compliance & Legal Notice

> **Screening Assistance Only**: Resume Shortlist provides structured screening assistance based on job-relevant information. It does not make automated hiring decisions. Recruiters should review candidates and apply appropriate organizational hiring policies.
