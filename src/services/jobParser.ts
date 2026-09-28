import { SKILL_ONTOLOGY, normalizeSkill } from './skillOntology';

export interface ExtractedJobIntelligence {
  titleCandidate: string;
  department: string;
  experienceYears: number;
  coreSkills: string[];
  technicalSkills: string[];
  softSkills: string[];
  responsibilities: string[];
  educationRequirement: string;
  preferredQualifications: string[];
  domainRequirements: string[];
  keywords: string[];
}

export function parseJobDescription(rawText: string): ExtractedJobIntelligence {
  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Title detection heuristic (first 1-2 lines)
  let titleCandidate = 'Specialist Role';
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    if (
      line.length > 5 &&
      line.length < 60 &&
      !line.toLowerCase().includes('about') &&
      !line.toLowerCase().includes('responsibilities')
    ) {
      titleCandidate = line.replace(/^(job title|position|role):\s*/i, '');
      break;
    }
  }

  // 2. Experience years detection (e.g., "3+ years", "5 to 7 years", "at least 4 years")
  let experienceYears = 3;
  const expMatch = cleanText.match(/(\d+)\+?\s*(?:to\s*(\d+))?\s*(?:years|yrs)\b/i);
  if (expMatch) {
    experienceYears = parseInt(expMatch[1], 10);
  }

  // 3. Extract Skills via Ontology
  const detectedCoreSkills = new Set<string>();
  const detectedSoftSkills = new Set<string>();

  for (const [key, def] of Object.entries(SKILL_ONTOLOGY)) {
    const pattern = new RegExp(`\\b${escapeRegExp(def.name)}\\b`, 'i');
    const hasAlias = def.aliases.some(a => new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i').test(cleanText));
    if (pattern.test(cleanText) || hasAlias) {
      if (def.category === 'Soft Skills') {
        detectedSoftSkills.add(def.name);
      } else {
        detectedCoreSkills.add(def.name);
      }
    }
  }

  // 4. Extract Responsibilities (bullets under Responsibilities / Duties)
  const responsibilities: string[] = [];
  const respMatch = cleanText.match(/(?:responsibilities|duties|what you will do|key responsibilities)([\s\S]*?)(?:requirements|qualifications|skills|who you are|preferred|$)/i);
  if (respMatch) {
    const bullets = respMatch[1]
      .split('\n')
      .map(l => l.trim().replace(/^[-*•–—\d.]+\s*/, ''))
      .filter(l => l.length > 15 && l.length < 250);
    responsibilities.push(...bullets.slice(0, 8));
  }

  if (responsibilities.length === 0) {
    // Fallback: look for lines starting with typical action verbs
    const actionVerbRegex = /^(Build|Design|Analyze|Collaborate|Lead|Manage|Develop|Create|Implement|Oversee|Coordinate|Deliver|Optimize)\b/i;
    for (const line of lines) {
      const cleanLine = line.replace(/^[-*•–—\d.]+\s*/, '');
      if (actionVerbRegex.test(cleanLine) && cleanLine.length > 20 && cleanLine.length < 200) {
        responsibilities.push(cleanLine);
        if (responsibilities.length >= 6) break;
      }
    }
  }

  // 5. Extract Education Requirements
  let educationRequirement = "Bachelor's degree in Computer Science, Data, Engineering or equivalent practical experience";
  const eduMatch = cleanText.match(/(?:bachelor'?s|master'?s|ph\.?d|degree|b\.tech|bs|ms)\s+(?:in|of)\s+([a-zA-Z\s&,/-]{5,40})/i);
  if (eduMatch) {
    educationRequirement = eduMatch[0].trim();
  }

  // 6. Preferred Qualifications
  const preferredQualifications: string[] = [];
  const prefMatch = cleanText.match(/(?:preferred|bonus|nice to have|good to have)([\s\S]*?)(?:benefits|about us|how to apply|$)/i);
  if (prefMatch) {
    const bullets = prefMatch[1]
      .split('\n')
      .map(l => l.trim().replace(/^[-*•–—\d.]+\s*/, ''))
      .filter(l => l.length > 15 && l.length < 200);
    preferredQualifications.push(...bullets.slice(0, 4));
  }

  // 7. Domain Requirements
  const domainKeywords = ['FinTech', 'E-commerce', 'Healthcare', 'SaaS', 'B2B', 'Banking', 'Supply Chain', 'EdTech', 'Enterprise AI'];
  const domainRequirements: string[] = [];
  for (const d of domainKeywords) {
    if (new RegExp(`\\b${escapeRegExp(d)}\\b`, 'i').test(cleanText)) {
      domainRequirements.push(d);
    }
  }
  if (domainRequirements.length === 0) {
    domainRequirements.push('Enterprise SaaS');
  }

  // 8. Keywords
  const technicalList = Array.from(detectedCoreSkills);
  const keywords = Array.from(new Set([
    ...technicalList.slice(0, 8),
    ...Array.from(detectedSoftSkills),
    ...domainRequirements,
    `${experienceYears}+ Years Experience`
  ]));

  return {
    titleCandidate: titleCandidate || 'Senior Specialist',
    department: 'Engineering / Product',
    experienceYears,
    coreSkills: technicalList.slice(0, 10),
    technicalSkills: technicalList,
    softSkills: Array.from(detectedSoftSkills).slice(0, 5),
    responsibilities: responsibilities.length > 0 ? responsibilities : [
      'Design, build, and deploy production-grade software and data solutions',
      'Collaborate with product and cross-functional engineering teams',
      'Optimize performance, scalability, and code reliability'
    ],
    educationRequirement,
    preferredQualifications: preferredQualifications.length > 0 ? preferredQualifications : [
      'Previous experience in fast-paced product environments',
      'Demonstrated track record of delivering measurable project outcomes'
    ],
    domainRequirements,
    keywords,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
