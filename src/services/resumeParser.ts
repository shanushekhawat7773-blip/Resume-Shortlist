import { Candidate, EducationEntry, WorkExperienceEntry, ProjectEntry } from '../types';
import { SKILL_ONTOLOGY, normalizeSkill, resolveSkillInOntology } from './skillOntology';

export interface ParsedResumeOutput {
  candidate: Omit<Candidate, 'id' | 'appliedJobId' | 'stage' | 'uploadDate'>;
  extractedSections: {
    hasContact: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasProjects: boolean;
    hasCertifications: boolean;
  };
  metrics: {
    quantifiedBulletsCount: number;
    totalBulletsCount: number;
    wordCount: number;
    readabilityScore: number;
  };
}

export function parseResumeText(rawText: string, fileName?: string): ParsedResumeOutput {
  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = cleanText.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : 'Not detected';

  // 2. Extract Phone
  const phoneRegex = /(?:(?:\+|00)?(1|91)[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = cleanText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : 'Not detected';

  // 3. Extract Links
  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9-_]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : undefined;

  const githubMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-_]+)/i);
  const github = githubMatch ? githubMatch[0] : undefined;

  // 4. Candidate Name Heuristic
  // Often the first line that is 2-4 words, not an email, not "Resume" or "Curriculum Vitae"
  let candidateName = 'Not detected';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum vitae') &&
      !line.toLowerCase().includes('cv') &&
      !line.includes('http') &&
      line.length >= 3 &&
      line.length <= 40 &&
      /^[a-zA-Z\s.'-]+$/.test(line)
    ) {
      candidateName = line;
      break;
    }
  }

  // 5. Section Boundary Detection
  const sectionKeywords: Record<string, string[]> = {
    experience: ['experience', 'work experience', 'employment history', 'work history', 'professional experience'],
    education: ['education', 'academic background', 'academic history', 'qualifications'],
    skills: ['skills', 'technical skills', 'core competencies', 'technologies', 'skills & tools'],
    projects: ['projects', 'key projects', 'academic projects', 'personal projects'],
    certifications: ['certifications', 'licenses', 'courses', 'certificates'],
    summary: ['summary', 'professional summary', 'executive summary', 'profile', 'about me'],
  };

  const detectedSections = {
    hasContact: email !== 'Not detected' || phone !== 'Not detected',
    hasSummary: false,
    hasExperience: false,
    hasEducation: false,
    hasSkills: false,
    hasProjects: false,
    hasCertifications: false,
  };

  // Check section occurrences in text
  const lowerText = cleanText.toLowerCase();
  for (const [sec, words] of Object.entries(sectionKeywords)) {
    for (const w of words) {
      const regex = new RegExp(`(^|\\n)\\s*${w}\\s*($|\\n|:)`, 'i');
      if (regex.test(lowerText)) {
        if (sec === 'experience') detectedSections.hasExperience = true;
        if (sec === 'education') detectedSections.hasEducation = true;
        if (sec === 'skills') detectedSections.hasSkills = true;
        if (sec === 'projects') detectedSections.hasProjects = true;
        if (sec === 'certifications') detectedSections.hasCertifications = true;
        if (sec === 'summary') detectedSections.hasSummary = true;
        break;
      }
    }
  }

  // 6. Extract Skills via Ontology Dictionary
  const extractedSkillsSet = new Set<string>();
  for (const [key, def] of Object.entries(SKILL_ONTOLOGY)) {
    // Check if canonical name appears as a discrete word
    const canonicalPattern = new RegExp(`\\b${escapeRegExp(def.name)}\\b`, 'i');
    if (canonicalPattern.test(cleanText)) {
      extractedSkillsSet.add(def.name);
      continue;
    }
    // Check aliases
    for (const alias of def.aliases) {
      const aliasPattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'i');
      if (aliasPattern.test(cleanText)) {
        extractedSkillsSet.add(def.name);
        break;
      }
    }
  }
  const extractedSkills = Array.from(extractedSkillsSet);

  // 7. Extract Education Entries
  const educationEntries: EducationEntry[] = [];
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
        // Extract institution if present
        let institution = 'University / Institute';
        if (/iit|indian institute of technology/i.test(line)) institution = 'IIT';
        else if (/nit|national institute of technology/i.test(line)) institution = 'NIT';
        else if (/bits/i.test(line)) institution = 'BITS Pilani';
        else {
          const instMatch = line.match(/(?:at|from|,)\s+([A-Za-z\s&]{4,35}(?:University|College|Institute|School))/i);
          if (instMatch) institution = instMatch[1].trim();
        }

        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : undefined;

        educationEntries.push({
          degree: deg.degree,
          institution,
          year,
        });
        break;
      }
    }
  }

  // 8. Estimate Experience Years
  let experienceYears = 0;
  const yearMatches = Array.from(cleanText.matchAll(/\b(20\d{2}|19\d{2})\s*(?:-|to|–)\s*(20\d{2}|present|current)\b/gi));
  if (yearMatches.length > 0) {
    let totalSpan = 0;
    const currentYear = 2026;
    for (const m of yearMatches) {
      const start = parseInt(m[1], 10);
      const endStr = m[2].toLowerCase();
      const end = (endStr === 'present' || endStr === 'current') ? currentYear : parseInt(endStr, 10);
      if (end >= start && (end - start) < 30) {
        totalSpan += (end - start);
      }
    }
    experienceYears = Math.min(25, Math.max(1, Math.round(totalSpan / Math.max(1, yearMatches.length))));
  }

  // 9. Extract Bullet Points & Quantification Metrics
  const bulletLines = lines.filter(l => /^[-*•–—]\s+|^\d+\.\s+/.test(l) || l.length > 50);
  const totalBulletsCount = Math.max(1, bulletLines.length);
  
  // Quantification indicators: %, $, numbers followed by reduction/growth/scale (e.g. 40%, $1.2M, 50k requests, 3x)
  const quantPattern = /(\d+%|\$\d+|\b\d+[xX]\b|\b\d+\s*(?:million|billion|k|ms|seconds|users|clients|percent))/i;
  const quantifiedBullets = bulletLines.filter(b => quantPattern.test(b));
  const quantifiedBulletsCount = quantifiedBullets.length;

  // 10. Extract Work History & Projects Heuristic
  const workHistory: WorkExperienceEntry[] = [];
  const projectEntries: ProjectEntry[] = [];

  // Group text into experience blocks if detected
  const expMatch = cleanText.match(/(?:experience|employment history|work history)([\s\S]*?)(?:education|projects|skills|certifications|$)/i);
  if (expMatch && expMatch[1].length > 50) {
    const expText = expMatch[1];
    const expBlocks = expText.split(/\n{2,}/).filter(b => b.trim().length > 30);
    for (let i = 0; i < Math.min(expBlocks.length, 4); i++) {
      const block = expBlocks[i];
      const blockLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const titleLine = blockLines[0] || 'Software / Data Specialist';
      const company = blockLines[1] && blockLines[1].length < 40 ? blockLines[1] : 'Enterprise Technology Org';
      const bullets = blockLines.slice(1).filter(l => l.length > 15);
      
      workHistory.push({
        title: titleLine.replace(/^[-*•]\s*/, '').slice(0, 50),
        company,
        duration: '2+ years',
        description: block.slice(0, 150) + '...',
        bulletPoints: bullets.length > 0 ? bullets : [block.slice(0, 100)],
      });
    }
  }

  // Group project blocks if detected
  const projMatch = cleanText.match(/(?:projects|key projects|personal projects)([\s\S]*?)(?:experience|education|skills|certifications|$)/i);
  if (projMatch && projMatch[1].length > 40) {
    const projText = projMatch[1];
    const projBlocks = projText.split(/\n{2,}/).filter(b => b.trim().length > 25);
    for (let i = 0; i < Math.min(projBlocks.length, 3); i++) {
      const block = projBlocks[i];
      const pLines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const title = pLines[0] || `Project ${i + 1}`;
      projectEntries.push({
        title: title.replace(/^[-*•]\s*/, '').slice(0, 50),
        description: block.slice(0, 180),
        technologies: extractedSkills.slice(0, 4),
      });
    }
  }

  // Readability & Word count
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  // Readability estimate: ideal resume 300 - 800 words
  let readabilityScore = 85;
  if (wordCount < 150) readabilityScore = 55;
  else if (wordCount > 1000) readabilityScore = 70;

  return {
    candidate: {
      name: candidateName,
      email,
      phone,
      location: 'Not detected',
      linkedin,
      github,
      summary: detectedSections.hasSummary ? 'Detected in submitted resume' : 'Not detected in submitted resume',
      experienceYears: experienceYears || 2,
      education: educationEntries.length > 0 ? educationEntries : [{ degree: 'Degree not detected', institution: 'Not detected' }],
      workHistory: workHistory.length > 0 ? workHistory : [],
      projects: projectEntries.length > 0 ? projectEntries : [],
      skills: extractedSkills,
      certifications: detectedSections.hasCertifications ? ['Certifications noted in document'] : [],
      achievements: [],
      resumeFileName: fileName || 'Uploaded_Resume.pdf',
      rawText: cleanText,
    },
    extractedSections: detectedSections,
    metrics: {
      quantifiedBulletsCount,
      totalBulletsCount,
      wordCount,
      readabilityScore,
    },
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
