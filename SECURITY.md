# RESUME SHORTLIST — Security & Data Privacy Policy

## 1. Security Architecture

### 1.1 In-Memory Document Isolation
Candidate resumes processed via the web application or API are parsed in memory buffers. Temporary text extraction streams are flushed upon completion of entity mapping.

### 1.2 Cryptographic Fingerprinting
Each document generates a deterministic SHA-256 hash:
- Enables idempotent re-analysis without duplicate parsing overhead.
- Detects resume tampering or unauthorized modifications between recruitment rounds.

---

## 2. Privacy Compliance & Candidate Rights

### 2.1 GDPR & Data Protection Standard Alignment
- **Right to Erasure (PII Purge)**: Recruiters or candidates can trigger permanent data deletion (`deleteCandidateData`). This immediately purges the candidate's profile, contact details, work history, and raw resume text.
- **Data Minimization**: Only contact information essential for recruitment communication (name, email, phone, location) is retained.
- **Audit Logging**: All deletions are permanently recorded in the immutable audit trail as a `PRIVACY_PURGE` event.

---

## 3. Tamper-Evident Audit Trail

The platform includes an internal audit logger that registers:
- `UPLOAD`: Document ingestion with timestamp and user ID.
- `ANALYSIS`: Model execution with version stamp (`v2.4-HybridSemantic`).
- `STAGE_CHANGE`: Progression through screening, review, interview, or rejection.
- `WEIGHT_UPDATE`: Any adjustment to scoring dimension coefficients.
- `PRIVACY_PURGE`: On-demand candidate removal.

Recruiters and compliance officers can download the complete audit trail as a signed JSON file at any time via the **Audit Trail & Logs** view.
