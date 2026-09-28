# RESUME SHORTLIST — Scoring Methodology & Mathematical Specification

## 1. Core Philosophy
The Resume Shortlist platform implements an **evidence-first, deterministic scoring paradigm**. Rather than asking an opaque neural model to guess a number from 1 to 100, our system calculates scores through verifiable component signals weighted according to organizational hiring criteria.

---

## 2. Mathematical Formulation

### 2.1 The Composite Score Equation

The overall match score $M \in [0, 100]$ is computed as:

$$M = \min\left(100, \max\left(0, \sum_{i=1}^{6} (S_i \times W_i) - P_{\text{exp}} - P_{\text{gap}}\right)\right)$$

Where:
- $S_i \in [0, 100]$: Dimension score for dimension $i$.
- $W_i \in [0.0, 1.0]$: Dimension normalized weight such that $\sum_{i=1}^{6} W_i = 1.0$.
- $P_{\text{exp}}$: Experience tenure deficiency penalty.
- $P_{\text{gap}}$: Missing core requirement penalty.

---

## 3. The 6 Measurable Dimensions

| Dimension | Default Weight ($W_i$) | Description & Signal Extraction |
| :--- | :---: | :--- |
| **Required Skills** ($S_1$) | 30% | Direct canonical matches against the role's mandatory requirements. Higher weight is accorded to skills backed by active work experience versus standalone listing. |
| **Experience Relevance** ($S_2$) | 20% | Tenure ratio compared against the target threshold. Scored as $\min\left(100, \frac{\text{Years}_{\text{cand}}}{\text{Years}_{\text{req}}} \times 100\right)$ with seniority title bonuses. |
| **Job Responsibilities** ($S_3$) | 20% | Semantic cosine similarity between job responsibility statements and the candidate's work history bullet points. |
| **Education Match** ($S_4$) | 10% | Alignment of degree level (Doctorate, Master's, Bachelor's, Diploma) and field of study against role requirements. |
| **Preferred Skills** ($S_5$) | 10% | Detection of non-mandatory, value-add tools, platforms, and methodologies. |
| **Projects / Evidence Proof** ($S_6$) | 10% | Presence of documented case studies, open-source repositories, quantified metrics (`%`, `$`), and end-to-end delivery evidence. |

---

## 4. Penalty Curves & Edge Case Handling

### 4.1 Experience Deficit
If a role requires $Y_{\text{req}}$ years and the candidate possesses $Y_{\text{cand}} < Y_{\text{req}}$:
$$P_{\text{exp}} = \min(15, (Y_{\text{req}} - Y_{\text{cand}}) \times 3)$$
Candidates are never scored 0 purely for tenure deficit if their skills and project evidence are exceptional.

### 4.2 Missing Core Skills
For each mandatory required skill undetected in the submitted resume:
$$P_{\text{gap}} = N_{\text{missing}} \times 2$$
Subject to a cap of 10 points.

---

## 5. Requirement Coverage Matrix Classification

Every requirement is mapped into one of four deterministic states:
1. **Strong**: Verified in active work history with demonstrable context and impact.
2. **Moderate**: Mentioned in skills inventory or coursework without quantified metrics.
3. **Needs verification**: Partial match via ontology graph sibling or parent skill.
4. **Not detected**: Labeled strictly as `"Not detected in the submitted resume."` (never assumed absent).
