# RESUME SHORTLIST — Responsible AI & Algorithmic Fairness Charter

## 1. Principles & Commitments
Resume Shortlist is engineered from the ground up to prevent algorithmic bias, comply with global fair hiring standards (including EEOC guidelines and NYC Local Law 144), and protect candidate dignity.

---

## 2. Protected Characteristics Immunity

### 2.1 Zero-Extraction Policy
The scoring engine is strictly blind to:
- **Gender & Pronouns**: No gender tokens are parsed or weighted.
- **Age & Graduation Year**: Graduation dates are excluded from baseline scoring to prevent age discrimination.
- **Race, Ethnicity, and Caste**: Complete absence of demographic inferences.
- **Religion & Political Affiliation**: Ignored completely.
- **Disability Status & Medical History**: Zero data retention or processing.
- **Candidate Imagery**: Profile pictures or embedded headshots are stripped prior to NLP ingestion.

---

## 3. Strict Fair-Hiring Wording Policy

### 3.1 Non-Exclusionary Phrasing Guarantee
The system **never** claims:
> *"The candidate does not have this skill."*
> *"The candidate lacks proficiency."*

Instead, all missing signals are classified under the evidence-bound assertion:
> **"Not detected in the submitted resume."**

This recognizes that resumes are summary representations of professional experience and directs recruiters to ask clarifying interview questions rather than making automated rejection decisions.

---

## 4. Explainability & Human-in-the-Loop Safeguards

1. **Every Score Has a Receipt**: Every percentage match includes an itemized breakdown across all 6 dimensions, displaying exact line references and source sentences.
2. **No Automated Disqualification**: The system provides structured recommendations (`Strong Match`, `Moderate Match`, `Requires Verification`), but final stage progression is solely under human recruiter control.
3. **Auditability**: All weighting adjustments, recruiter stage movements, and candidate evaluations are logged with user identity and timestamp in an immutable audit trail.
