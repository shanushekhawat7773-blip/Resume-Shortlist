// Natural-Language Recruiter Search Engine
import { Candidate } from '../types';
import { resolveSkill, SKILL_GRAPH } from './skillOntology';

export interface SearchInterpretation {
  rawQuery: string;
  extractedSkills: string[];
  minExperienceYears?: number;
  projectFocus?: string;
  educationDegree?: string;
  location?: string;
  stageFilter?: string;
}

export interface CandidateSearchResult {
  candidate: Candidate;
  matchScore: number;
  matchingEvidence: string[];
}

export function parseNaturalLanguageQuery(query: string): SearchInterpretation {
  const clean = query.trim().toLowerCase();
  const extractedSkills: string[] = [];
  let minExperienceYears: number | undefined;
  let projectFocus: string | undefined;
  let educationDegree: string | undefined;
  let location: string | undefined;
  let stageFilter: string | undefined;

  // 1. Extract Skills
  for (const [slug, node] of Object.entries(SKILL_GRAPH)) {
    const pattern = new RegExp(`\\b${escapeRegExp(node.name)}\\b`, 'i');
    if (pattern.test(query) || node.aliases.some(a => new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i').test(query))) {
      extractedSkills.push(node.name);
    }
  }

  // 2. Extract Experience Years (e.g. "3+ years", "at least 4 years", "senior", "junior")
  const expMatch = clean.match(/(\d+)\+?\s*(?:to\s*(\d+))?\s*(?:years|yrs)\b/i);
  if (expMatch) {
    minExperienceYears = parseInt(expMatch[1], 10);
  } else if (clean.includes('senior') || clean.includes('lead')) {
    minExperienceYears = 4;
  } else if (clean.includes('junior') || clean.includes('entry') || clean.includes('intern')) {
    minExperienceYears = 1;
  }

  // 3. Project Focus
  const projTerms = ['analytics', 'fraud', 'rag', 'machine learning', 'dashboard', 'pipeline', 'collaboration', 'fintech'];
  for (const term of projTerms) {
    if (clean.includes(`${term} project`) || clean.includes(`project in ${term}`) || clean.includes(term)) {
      projectFocus = term;
      break;
    }
  }

  // 4. Education
  if (clean.includes('iit') || clean.includes('nit') || clean.includes('master') || clean.includes('b.tech') || clean.includes('mba')) {
    if (clean.includes('iit')) educationDegree = 'IIT';
    else if (clean.includes('nit')) educationDegree = 'NIT';
    else if (clean.includes('master')) educationDegree = 'Master\'s';
    else if (clean.includes('mba')) educationDegree = 'MBA';
  }

  // 5. Stage
  if (clean.includes('shortlisted')) stageFilter = 'shortlisted';
  else if (clean.includes('interview')) stageFilter = 'interview';

  return {
    rawQuery: query,
    extractedSkills,
    minExperienceYears,
    projectFocus,
    educationDegree,
    location,
    stageFilter,
  };
}

export function searchCandidates(
  candidates: Candidate[],
  query: string
): { interpretation: SearchInterpretation; results: CandidateSearchResult[] } {
  const interpretation = parseNaturalLanguageQuery(query);
  const results: CandidateSearchResult[] = [];

  for (const c of candidates) {
    let score = 50;
    const matchingEvidence: string[] = [];

    // Check Skills
    for (const skill of interpretation.extractedSkills) {
      if (c.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        score += 15;
        matchingEvidence.push(`Possesses ${skill} skill`);
      }
    }

    // Check Experience
    if (interpretation.minExperienceYears !== undefined) {
      if (c.experienceYears >= interpretation.minExperienceYears) {
        score += 15;
        matchingEvidence.push(`Experience tenure of ${c.experienceYears} yrs meets query criteria (${interpretation.minExperienceYears}+ yrs)`);
      } else {
        score -= 20;
      }
    }

    // Check Project
    if (interpretation.projectFocus) {
      const proj = c.projects.find(p =>
        p.title.toLowerCase().includes(interpretation.projectFocus!) ||
        p.description.toLowerCase().includes(interpretation.projectFocus!) ||
        p.technologies.some(t => t.toLowerCase().includes(interpretation.projectFocus!))
      );
      if (proj) {
        score += 20;
        matchingEvidence.push(`Relevant project: "${proj.title}"`);
      }
    }

    // Check Education
    if (interpretation.educationDegree) {
      const edu = c.education.find(e =>
        e.institution.toLowerCase().includes(interpretation.educationDegree!.toLowerCase()) ||
        e.degree.toLowerCase().includes(interpretation.educationDegree!.toLowerCase())
      );
      if (edu) {
        score += 10;
        matchingEvidence.push(`Education matches: ${edu.degree} from ${edu.institution}`);
      }
    }

    // General text match fallback if no specific terms were parsed
    if (interpretation.extractedSkills.length === 0 && !interpretation.minExperienceYears && !interpretation.projectFocus) {
      const rawLower = (c.rawText || `${c.name} ${c.summary} ${c.skills.join(' ')}`).toLowerCase();
      if (rawLower.includes(query.toLowerCase())) {
        score += 30;
        matchingEvidence.push(`Keyword match in candidate document`);
      }
    }

    if (matchingEvidence.length > 0 || !query.trim()) {
      results.push({
        candidate: c,
        matchScore: Math.min(99, score),
        matchingEvidence,
      });
    }
  }

  // Sort descending by match score
  results.sort((a, b) => b.matchScore - a.matchScore);

  return {
    interpretation,
    results,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
