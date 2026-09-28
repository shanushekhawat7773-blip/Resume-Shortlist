import {
  Candidate,
  EducationEntry,
  WorkExperienceEntry,
  ProjectEntry,
  StructuredSkill,
  AchievementEntry,
} from '../types';
import { resolveSkill, SKILL_GRAPH } from './skillOntology';
import { computeDocumentFingerprint } from './semanticEngine';

export interface ParsedResumeResult {
  candidate: Candidate;
  fingerprint: string;
  parsingMetadata: {
    sectionDetectionConfidence: Record<string, number>;
    hasQuantifiedImpacts: boolean;
    bulletCount: number;
    wordCount: number;
  };
}

export function parseResumeDocument(rawText: string, fileName: string = 'Uploaded_Resume.pdf'): ParsedResumeResult {
  // 1. Text Normalization: remove null bytes, normalize linebreaks and whitespace
  const normalizedText = rawText
    .replace(/\0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '    ')
    .trim();

  const lines = normalizedText.split('\n').map(l => l.trim()).filter(Boolean);
  const fingerprint = computeDocumentFingerprint(normalizedText);

  // 2. Extract Contact Info
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = normalizedText.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : 'Not detected';

  const phoneRegex = /(?:(?:\+|00)?(1|91)[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = normalizedText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : 'Not detected';

  const linkedinMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9-_]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : undefined;

  const githubMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-_]+)/i);
  const github = githubMatch ? githubMatch[0] : undefined;

  // Location heuristic
  let location = 'Not detected';
  const locRegex = /\b(Bangalore|Bengaluru|Hyderabad|Mumbai|Pune|Delhi|Gurugram|Noida|Chennai|San Francisco|New York|London|Remote)\b/i;
  const locMatch = normalizedText.match(locRegex);
  if (locMatch) location = `${locMatch[0]}, India`;

  // Candidate Name Heuristic: inspect top 6 lines
  let name = 'Not detected';
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('cv') &&
      !line.includes('http') &&
      line.length >= 3 &&
      line.length <= 40 &&
      /^[a-zA-Z\s.'-]+$/.test(line)
    ) {
      name = line;
      break;
    }
  }

  // 3. Section Boundary Segmentation
  const sectionKeywords: Record<string, string[]> = {
    experience: ['experience', 'work experience', 'employment history', 'work history', 'professional experience'],
    education: ['education', 'academic background', 'academic history', 'qualifications'],
    skills: ['skills', 'technical skills', 'core competencies', 'technologies', 'tools & technologies', 'skills & tools'],
    projects: ['projects', 'key projects', 'academic projects', 'personal projects', 'notable projects'],
    certifications: ['certifications', 'licenses', 'courses', 'certificates'],
    achievements: ['achievements', 'awards', 'honors', 'accomplishments', 'publications'],
    summary: ['summary', 'professional summary', 'executive summary', 'profile', 'about me'],
  };

  const detectedSections: Record<string, { startLine: number; confidence: number; text: string }> = {};

  for (const [secKey, words] of Object.entries(sectionKeywords)) {
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (words.some(w => lineLower === w || lineLower === `${w}:` || lineLower.startsWith(`${w} -`))) {
        detectedSections[secKey] = {
          startLine: i,
          confidence: 0.95,
          text: '',
        };
        break;
      }
    }
  }

  // Extract raw text for detected sections
  const sectionEntries = Object.entries(detectedSections).sort((a, b) => a[1].startLine - b[1].startLine);
  for (let idx = 0; idx < sectionEntries.length; idx++) {
    const current = sectionEntries[idx];
    const nextStart = idx < sectionEntries.length - 1 ? sectionEntries[idx + 1][1].startLine : lines.length;
    const secLines = lines.slice(current[1].startLine + 1, nextStart);
    current[1].text = secLines.join('\n');
  }

  // Summary Text
  let summary = detectedSections.summary?.text.slice(0, 300) || '';
  if (!summary && lines.length > 2) {
    summary = lines.slice(1, 4).join(' ').slice(0, 300);
  }
  if (!summary) summary = 'Professional candidate profile detected in submitted document.';

  // 4. Extract Structured Work Experience
  const workHistory: WorkExperienceEntry[] = [];
  const expText = detectedSections.experience?.text || '';
  
  if (expText.length > 30) {
    const blocks = expText.split(/\n{2,}|\n(?=[A-Z][a-zA-Z\s]{4,30}\s*(?:at|-|–|,)\s*)/).filter(b => b.trim().length > 25);
    for (const block of blocks.slice(0, 4)) {
      const bLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const titleLine = bLines[0] || 'Software / Data Specialist';
      const companyLine = bLines[1] && bLines[1].length < 40 ? bLines[1] : 'Enterprise Organization';
      
      const bullets = bLines.filter(l => /^[-*•–—\d.]+\s+/.test(l) || l.length > 40);
      const cleanBullets = bullets.map(b => b.replace(/^[-*•–—\d.]+\s*/, '').trim());

      // Extract technologies referenced in this work block
      const techUsed = new Set<string>();
      for (const [key, node] of Object.entries(SKILL_GRAPH)) {
        if (new RegExp(`\\b${escapeRegExp(node.name)}\\b`, 'i').test(block)) {
          techUsed.add(node.name);
        }
      }

      // Detect Quantified Impacts in bullets (%, $, x multipliers, scale)
      const quantPattern = /(\d+%|\$\d+|\b\d+[xX]\b|\b\d+\s*(?:million|billion|k|ms|seconds|users|clients|percent))/i;
      const impacts = cleanBullets.filter(b => quantPattern.test(b));

      workHistory.push({
        title: titleLine.replace(/^[-*•]\s*/, '').slice(0, 50),
        company: companyLine.replace(/^[-*•]\s*/, '').slice(0, 50),
        duration: '2+ years',
        years: 2.5,
        description: block.slice(0, 160) + '...',
        bulletPoints: cleanBullets.length > 0 ? cleanBullets : [block.slice(0, 120)],
        technologiesUsed: Array.from(techUsed),
        quantifiedImpacts: impacts,
        relevanceConfidence: 0.92,
        sourceText: block.slice(0, 300),
      });
    }
  }

  // 5. Extract Education Entries
  const education: EducationEntry[] = [];
  const degreeRegexes = [
    { degree: 'B.Tech / B.E.', regex: /\b(b\.?tech|b\.?e\.?|bachelor of technology|bachelor of engineering)\b/i },
    { degree: 'M.Tech / M.E.', regex: /\b(m\.?tech|m\.?e\.?|master of technology)\b/i },
    { degree: 'B.S. / B.Sc.', regex: /\b(b\.?s\.?|b\.?sc|bachelor of science)\b/i },
    { degree: 'M.S. / M.Sc.', regex: /\b(m\.?s\.?|m\.?sc|master of science)\b/i },
    { degree: 'MBA', regex: /\b(mba|master of business administration)\b/i },
    { degree: 'Ph.D.', regex: /\b(ph\.?d|doctorate)\b/i },
  ];

  for (const line of lines) {
    for (const deg of degreeRegexes) {
      if (deg.regex.test(line)) {
        let institution = 'University / Institute';
        if (/iit|indian institute of technology/i.test(line)) institution = 'Indian Institute of Technology (IIT)';
        else if (/nit|national institute of technology/i.test(line)) institution = 'National Institute of Technology (NIT)';
        else if (/bits/i.test(line)) institution = 'BITS Pilani';
        else {
          const instMatch = line.match(/(?:at|from|,)\s+([A-Za-z\s&]{4,35}(?:University|College|Institute|School))/i);
          if (instMatch) institution = instMatch[1].trim();
        }

        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        education.push({
          degree: deg.degree,
          institution,
          year: yearMatch ? yearMatch[0] : undefined,
          confidence: 0.95,
          sourceText: line,
        });
        break;
      }
    }
  }

  // 6. Extract Projects
  const projects: ProjectEntry[] = [];
  const projText = detectedSections.projects?.text || '';
  if (projText.length > 25) {
    const pBlocks = projText.split(/\n{2,}|\n(?=[A-Z0-9][a-zA-Z\s]{3,30}\s*(?:-|–|:)\s*)/).filter(b => b.trim().length > 20);
    for (const pb of pBlocks.slice(0, 3)) {
      const pLines = pb.split('\n').map(l => l.trim()).filter(Boolean);
      const title = pLines[0] || 'Technical Project';

      const techUsed = new Set<string>();
      for (const [key, node] of Object.entries(SKILL_GRAPH)) {
        if (new RegExp(`\\b${escapeRegExp(node.name)}\\b`, 'i').test(pb)) {
          techUsed.add(node.name);
        }
      }

      // Check for measurable impact statement
      const quantPattern = /(\d+%|\$\d+|\b\d+[xX]\b|\b\d+\s*(?:million|billion|k|ms|users))/i;
      const impactBullet = pLines.find(l => quantPattern.test(l));

      projects.push({
        title: title.replace(/^[-*•]\s*/, '').slice(0, 50),
        description: pb.slice(0, 200),
        technologies: Array.from(techUsed),
        outcome: impactBullet || 'Demonstrated practical applied software and data competency',
        measurableImpact: impactBullet,
        confidence: 0.90,
        sourceText: pb.slice(0, 300),
      });
    }
  }

  // 7. Extract Structured Skills with Evidence Source & Context
  const structuredSkillsMap = new Map<string, StructuredSkill>();
  const lowerText = normalizedText.toLowerCase();

  for (const [key, node] of Object.entries(SKILL_GRAPH)) {
    const canonical = node.name;
    const regex = new RegExp(`\\b${escapeRegExp(node.name)}\\b`, 'i');
    const hasAlias = node.aliases.some(a => new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i').test(normalizedText));
    const hasAbbr = node.abbreviations.some(a => new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i').test(normalizedText));

    if (regex.test(normalizedText) || hasAlias || hasAbbr) {
      // Determine context and evidence location
      let context: 'active_work' | 'project' | 'skills_list' = 'skills_list';
      let confidence = 0.72;
      let evidenceSnippet = `Listed in skills section`;
      let sourceSection = 'skills';

      // Check if mentioned in work experience bullets
      for (const w of workHistory) {
        if (w.technologiesUsed.includes(canonical) || w.description.toLowerCase().includes(canonical.toLowerCase())) {
          context = 'active_work';
          confidence = 0.96;
          evidenceSnippet = `Applied at ${w.company}: "${w.bulletPoints[0] || w.description.slice(0, 100)}"`;
          sourceSection = `Work Experience (${w.title} at ${w.company})`;
          break;
        }
      }

      // Check projects if not in work history
      if (context !== 'active_work') {
        for (const p of projects) {
          if (p.technologies.includes(canonical) || p.description.toLowerCase().includes(canonical.toLowerCase())) {
            context = 'project';
            confidence = 0.88;
            evidenceSnippet = `Demonstrated in Project "${p.title}": ${p.description.slice(0, 100)}`;
            sourceSection = `Projects (${p.title})`;
            break;
          }
        }
      }

      structuredSkillsMap.set(canonical, {
        name: canonical,
        canonicalName: canonical,
        category: node.category,
        context,
        confidence,
        evidenceSnippet,
        sourceSection,
      });
    }
  }

  const structuredSkills = Array.from(structuredSkillsMap.values());
  const canonicalSkills = structuredSkills.map(s => s.name);

  // 8. Estimate Tenure
  let experienceYears = 0;
  const yearMatches = Array.from(normalizedText.matchAll(/\b(20\d{2}|19\d{2})\s*(?:-|to|–)\s*(20\d{2}|present|current)\b/gi));
  if (yearMatches.length > 0) {
    let span = 0;
    for (const m of yearMatches) {
      const s = parseInt(m[1], 10);
      const e = (m[2].toLowerCase() === 'present' || m[2].toLowerCase() === 'current') ? 2026 : parseInt(m[2], 10);
      if (e >= s && (e - s) < 30) span += (e - s);
    }
    experienceYears = Math.min(25, Math.max(1, Math.round(span / Math.max(1, yearMatches.length))));
  }

  // 9. Extract Achievements
  const achievements: AchievementEntry[] = [];
  const achText = detectedSections.achievements?.text || '';
  if (achText.length > 15) {
    const achLines = achText.split('\n').map(l => l.trim().replace(/^[-*•]\s*/, '')).filter(l => l.length > 10);
    for (const line of achLines.slice(0, 3)) {
      achievements.push({
        title: line.slice(0, 40),
        description: line,
        confidence: 0.90,
        sourceText: line,
      });
    }
  }

  const candidate: Candidate = {
    id: `cand_${fingerprint.slice(4, 12)}`,
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    experienceYears: experienceYears || 3,
    education: education.length > 0 ? education : [{ degree: 'Degree not detected', institution: 'Not detected', confidence: 0.3, sourceText: '' }],
    workHistory,
    projects,
    structuredSkills,
    skills: canonicalSkills,
    certifications: detectedSections.certifications ? ['Certifications documented in resume'] : [],
    achievements,
    stage: 'new',
    appliedJobId: 'job-1',
    resumeFileName: fileName,
    documentHash: fingerprint,
    rawText: normalizedText,
    uploadDate: new Date().toISOString(),
  };

  return {
    candidate,
    fingerprint,
    parsingMetadata: {
      sectionDetectionConfidence: {
        experience: detectedSections.experience?.confidence || 0,
        education: detectedSections.education?.confidence || 0,
        skills: detectedSections.skills?.confidence || 0,
        projects: detectedSections.projects?.confidence || 0,
      },
      hasQuantifiedImpacts: workHistory.some(w => w.quantifiedImpacts.length > 0),
      bulletCount: workHistory.flatMap(w => w.bulletPoints).length,
      wordCount: normalizedText.split(/\s+/).length,
    },
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Canonical alias for document parsing
export const parseResumeText = parseResumeDocument;
