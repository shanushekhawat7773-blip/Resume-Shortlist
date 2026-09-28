# RESUME SHORTLIST — REST / Service API Specification

## 1. Overview
The **Resume Shortlist** platform is architected with a decoupled modular service layer that maps directly to RESTful and microservice design patterns.

---

## 2. Endpoints & Interface Contracts

### 2.1 Resume Parsing Service
`POST /api/v1/resumes/parse`

#### Request Body (Multipart / Form-Data)
```json
{
  "file": "<Binary PDF, DOCX, or TXT file>",
  "fileName": "Aarav_Mehta_Resume.pdf",
  "extractMetrics": true
}
```

#### Response (`200 OK`)
```json
{
  "fingerprint": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "candidate": {
    "name": "Aarav Mehta",
    "email": "aarav.mehta@example.com",
    "phone": "+91 98765 43210",
    "location": "Bangalore, India",
    "experienceYears": 6,
    "structuredSkills": [
      {
        "name": "SQL",
        "canonicalName": "SQL",
        "category": "Data & DB",
        "context": "active_work",
        "confidence": 0.95,
        "evidenceSnippet": "Designed optimized SQL queries reducing latency by 45%"
      }
    ],
    "workHistory": [...],
    "education": [...],
    "projects": [...]
  },
  "parsingMetadata": {
    "sectionDetectionConfidence": {
      "experience": 0.95,
      "education": 0.90,
      "skills": 0.95,
      "projects": 0.88
    },
    "hasQuantifiedImpacts": true,
    "bulletCount": 18,
    "wordCount": 540
  }
}
```

---

### 2.2 Job Description Intelligence Service
`POST /api/v1/jobs/extract`

#### Request Body
```json
{
  "rawText": "Nexus Cognitive Systems is hiring a Senior Data Analyst. Must have 5+ years experience with SQL, Python, and Tableau..."
}
```

#### Response (`200 OK`)
```json
{
  "job": {
    "title": "Senior Data Analyst",
    "company": "Nexus Cognitive Systems",
    "seniority": "Senior",
    "experienceRequired": 5,
    "requiredSkills": ["SQL", "Python", "Tableau", "Data Warehousing"],
    "preferredSkills": ["Snowflake", "dbt", "Airflow"],
    "structuredRequirements": [
      {
        "id": "req-1",
        "name": "SQL",
        "category": "Skill",
        "importance": "Required",
        "weight": 30,
        "description": "Demonstrated expertise in complex querying and database schema design",
        "semanticTokens": ["sql", "query", "rdbms"]
      }
    ],
    "jdQualityScore": 92,
    "jdSuggestions": []
  }
}
```

---

### 2.3 Candidate Match & Scoring Service
`POST /api/v1/evaluations/match`

#### Request Body
```json
{
  "candidateId": "cand-1",
  "jobId": "job-1",
  "weights": {
    "requiredSkills": 30,
    "experienceRelevance": 20,
    "responsibilities": 20,
    "education": 10,
    "preferredSkills": 10,
    "projects": 10
  }
}
```

#### Response (`200 OK`)
```json
{
  "overallScore": 89,
  "matchClassification": "Strong",
  "dimensionScores": {
    "requiredSkills": 95,
    "experienceRelevance": 92,
    "responsibilities": 88,
    "education": 90,
    "preferredSkills": 75,
    "projects": 85
  },
  "requirementCoverageMatrix": [
    {
      "requirementName": "SQL",
      "category": "Skill",
      "importance": "Required",
      "candidateEvidence": "Extensively used in Lead Analyst role at FinPulse Systems",
      "evidenceLocation": "Work Experience: FinPulse Systems",
      "matchStrength": "Strong",
      "confidence": 0.95,
      "auditNotes": "Verified in 4 project bullet points with quantified latency metrics."
    }
  ],
  "atsAnalysis": {
    "formattingHealth": "Healthy",
    "quantifiableMetricCount": 7,
    "atsScore": 94
  },
  "scoringModelVersion": "v2.4-HybridSemantic"
}
```

---

### 2.4 Batch Document Ingestion Service
`POST /api/v1/resumes/batch`

#### Request Body
- Multiple file payloads (max 50 files per batch)
- `jobId`: Target evaluation job

#### Response (`202 Accepted`)
```json
{
  "batchId": "batch_981726",
  "totalFiles": 12,
  "status": "processing",
  "streamUri": "/api/v1/resumes/batch/batch_981726/progress"
}
```

---

### 2.5 Audit Log & PII Purge Service
`DELETE /api/v1/candidates/{id}/purge`

#### Response (`200 OK`)
```json
{
  "status": "purged",
  "candidateId": "cand-1",
  "auditRecordId": "aud_9021",
  "purgedAt": "2026-09-28T16:15:00.000Z",
  "message": "Raw resume document and identifiable records permanently purged per privacy compliance."
}
```
