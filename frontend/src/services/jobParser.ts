import { JobRole, StructuredRequirement } from '../types';
import { SKILL_GRAPH, resolveSkill } from './skillOntology';

export interface ParsedJobResult {
  job: Omit<JobRole, 'id' | 'createdAt'>;
  jdQualityScore: number;
  suggestions: string[];
}

export function parseJobDescriptionText(rawText: string): ParsedJobResult {
  const cleanText = rawText
    .replace(/\0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Detect Job Title (first 2-3 lines)
  let title = 'Senior Specialist';
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    if (line.length > 5 && line.length < 60 && !line.toLowerCase().includes('about') && !line.toLowerCase().includes('description')) {
      title = line.replace(/^(job title|position|role):\s*/i, '');
      break;
    }
  }

  // 2. Detect Seniority
  let seniority: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal' = 'Mid';
  const titleLower = title.toLowerCase();
  if (titleLower.includes('principal') || titleLower.includes('staff') || titleLower.includes('director')) {
    seniority = 'Principal';
  } else if (titleLower.includes('lead') || titleLower.includes('manager')) {
    seniority = 'Lead';
  } else if (titleLower.includes('senior') || titleLower.includes('sr.')) {
    seniority = 'Senior';
  } else if (titleLower.includes('junior') || titleLower.includes('associate') || titleLower.includes('intern')) {
    seniority = 'Entry';
  }

  // 3. Detect Experience Requirement
  let experienceRequired = 3;
  const expMatch = cleanText.match(/(\d+)\+?\s*(?:to\s*(\d+))?\s*(?:years|yrs)\b/i);
  if (expMatch) {
    experienceRequired = parseInt(expMatch[1], 10);
  }

  // 4. Extract Structured Skills via Ontology Graph
  const detectedSkills = new Map<string, { name: string; slug: string; importance: 'Required' | 'Preferred' }>();

  // Check section separation: required vs preferred
  const reqSectionMatch = cleanText.match(/(?:requirements|required qualifications|must have|what you need)([\s\S]*?)(?:preferred|bonus|nice to have|responsibilities|$)/i);
  const reqSectionText = reqSectionMatch ? reqSectionMatch[1].toLowerCase() : cleanText.toLowerCase();

  const prefSectionMatch = cleanText.match(/(?:preferred|bonus|nice to have|good to have)([\s\S]*?)(?:benefits|about us|how to apply|$)/i);
  const prefSectionText = prefSectionMatch ? prefSectionMatch[1].toLowerCase() : '';

  for (const [slug, node] of Object.entries(SKILL_GRAPH)) {
    const pattern = new RegExp(`\\b${escapeRegExp(node.name)}\\b`, 'i');
    const hasAlias = node.aliases.some(a => new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i').test(cleanText));
    
    if (pattern.test(cleanText) || hasAlias) {
      const inPref = prefSectionText && (pattern.test(prefSectionText) || node.aliases.some(a => prefSectionText.includes(a.toLowerCase())));
      detectedSkills.set(slug, {
        name: node.name,
        slug,
        importance: inPref ? 'Preferred' : 'Required',
      });
    }
  }

  const requiredSkillsList: string[] = [];
  const preferredSkillsList: string[] = [];
  const structuredRequirements: StructuredRequirement[] = [];

  let reqIndex = 1;
  for (const [slug, item] of detectedSkills.entries()) {
    if (item.importance === 'Required') {
      requiredSkillsList.push(item.name);
      structuredRequirements.push({
        id: `req-${reqIndex++}`,
        name: item.name,
        category: 'Skill',
        importance: 'Required',
        weight: 20,
        description: `Demonstrated technical capability and applied production experience in ${item.name}.`,
        canonicalSkillSlug: slug,
        semanticTokens: [item.name.toLowerCase(), slug],
      });
    } else {
      preferredSkillsList.push(item.name);
      structuredRequirements.push({
        id: `req-${reqIndex++}`,
        name: item.name,
        category: 'Skill',
        importance: 'Preferred',
        weight: 10,
        description: `Preferred domain familiarity with ${item.name}.`,
        canonicalSkillSlug: slug,
        semanticTokens: [item.name.toLowerCase(), slug],
      });
    }
  }

  // 5. Responsibilities
  const responsibilities: string[] = [];
  const respMatch = cleanText.match(/(?:responsibilities|duties|what you will do|key responsibilities)([\s\S]*?)(?:requirements|qualifications|skills|who you are|preferred|$)/i);
  if (respMatch) {
    const bullets = respMatch[1]
      .split('\n')
      .map(l => l.trim().replace(/^[-*•–—\d.]+\s*/, ''))
      .filter(l => l.length > 20 && l.length < 250);
    responsibilities.push(...bullets.slice(0, 6));
  }

  if (responsibilities.length === 0) {
    responsibilities.push(
      'Architect, develop, and deliver high-performance data and software solutions',
      'Collaborate across cross-functional engineering, product, and leadership teams',
      'Optimize query throughput, model latency, and production reliability'
    );
  }

  // Add responsibilities to structured requirements
  for (const resp of responsibilities) {
    structuredRequirements.push({
      id: `req-${reqIndex++}`,
      name: resp.slice(0, 45) + '...',
      category: 'Responsibility',
      importance: 'Required',
      weight: 15,
      description: resp,
      semanticTokens: resp.toLowerCase().split(/\s+/).filter(w => w.length > 3),
    });
  }

  // Add experience tenure requirement
  structuredRequirements.push({
    id: `req-${reqIndex++}`,
    name: `${experienceRequired}+ Years Commercial Tenure`,
    category: 'Experience',
    importance: 'Required',
    weight: 25,
    minYears: experienceRequired,
    description: `Minimum of ${experienceRequired} years of verified commercial industry experience.`,
    semanticTokens: ['experience', 'years', 'commercial', 'industry'],
  });

  // 6. Education Requirement
  let education = "Bachelor's degree in Computer Science, Engineering, Mathematics, or equivalent practical experience";
  const eduMatch = cleanText.match(/(?:bachelor'?s|master'?s|ph\.?d|degree|b\.tech|bs|ms)\s+(?:in|of)\s+([a-zA-Z\s&,/-]{5,40})/i);
  if (eduMatch) education = eduMatch[0].trim();

  // 7. Domain Detection
  const domainKeywords = ['FinTech', 'Enterprise AI', 'Enterprise SaaS', 'HealthTech', 'E-commerce', 'Cloud Infrastructure'];
  let domain = 'Enterprise Technology';
  for (const d of domainKeywords) {
    if (new RegExp(`\\b${escapeRegExp(d)}\\b`, 'i').test(cleanText)) {
      domain = d;
      break;
    }
  }

  // 8. Job Description Improvement Analyzer (Section #21)
  const suggestions: string[] = [];
  let jdQualityScore = 88;

  // Check for vague buzzwords
  const vagueTerms = ['rockstar', 'ninja', 'guru', 'fast-paced environment', 'wear many hats', 'self-starter'];
  const foundVague = vagueTerms.filter(t => cleanText.toLowerCase().includes(t));
  if (foundVague.length > 0) {
    suggestions.push(`Avoid vague buzzwords [${foundVague.join(', ')}]; define concrete technical outcomes and deliverables.`);
    jdQualityScore -= 8;
  }

  // Check for missing responsibilities or skills
  if (requiredSkillsList.length < 3) {
    suggestions.push('Specify at least 3-4 concrete mandatory core skills to improve matching accuracy.');
    jdQualityScore -= 10;
  }

  if (responsibilities.length < 3) {
    suggestions.push('Add specific operational duties to provide clear responsibility match signals.');
    jdQualityScore -= 8;
  }

  // Check seniority vs experience consistency
  if (seniority === 'Senior' && experienceRequired < 3) {
    suggestions.push(`Title specifies Senior, but experience is set to ${experienceRequired} years. Typically Senior roles benchmark 4-5+ years.`);
    jdQualityScore -= 5;
  }

  if (suggestions.length === 0) {
    suggestions.push('Job description exhibits strong clarity, well-defined responsibilities, and clear technical competencies.');
  }

  return {
    job: {
      title,
      company: 'Enterprise Organization',
      department: 'Engineering & Technology',
      location: 'Bangalore, India (Hybrid)',
      employmentType: 'Full-time',
      seniority,
      experienceRequired,
      description: cleanText.slice(0, 450) + '...',
      structuredRequirements,
      requiredSkills: requiredSkillsList.length > 0 ? requiredSkillsList : ['Python', 'SQL', 'Data Analysis'],
      preferredSkills: preferredSkillsList,
      education,
      certifications: ['Relevant professional cloud / technical certifications preferred'],
      responsibilities,
      domain,
      keywords: [...requiredSkillsList, ...preferredSkillsList, domain, `${experienceRequired}+ Years Experience`],
      jdQualityScore,
      jdSuggestions: suggestions,
    },
    jdQualityScore,
    suggestions,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const parseJobDescription = parseJobDescriptionText;
export type ExtractedJobIntelligence = ParsedJobResult;
