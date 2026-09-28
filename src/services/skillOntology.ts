export interface SkillNode {
  name: string;
  slug: string;
  category: 'Programming' | 'Data & DB' | 'Analytics & BI' | 'Machine Learning' | 'Cloud & DevOps' | 'Web & Tools' | 'Soft Skills';
  aliases: string[];
  abbreviations: string[];
  parentSkillSlug?: string;
  childSkillSlugs: string[];
  relatedSkillSlugs: string[];
  description: string;
}

export const SKILL_GRAPH: Record<string, SkillNode> = {
  // Parent Domains
  'data-science': {
    name: 'Data Science',
    slug: 'data-science',
    category: 'Analytics & BI',
    aliases: ['data scientist', 'applied data science'],
    abbreviations: ['ds'],
    childSkillSlugs: ['machine-learning', 'statistics', 'python', 'sql', 'data-visualization', 'pandas', 'numpy'],
    relatedSkillSlugs: ['big-data', 'data-engineering'],
    description: 'Interdisciplinary domain utilizing scientific methods and algorithms to extract knowledge from data.',
  },
  'machine-learning': {
    name: 'Machine Learning',
    slug: 'machine-learning',
    category: 'Machine Learning',
    aliases: ['machine learning algorithms', 'statistical learning', 'applied ml', 'ml modeling'],
    abbreviations: ['ml'],
    parentSkillSlug: 'data-science',
    childSkillSlugs: ['deep-learning', 'nlp', 'computer-vision', 'predictive-modeling', 'scikit-learn', 'pytorch', 'tensorflow'],
    relatedSkillSlugs: ['statistics', 'mlops', 'data-science'],
    description: 'Designing algorithms that improve automatically through data exposure.',
  },
  'deep-learning': {
    name: 'Deep Learning',
    slug: 'deep-learning',
    category: 'Machine Learning',
    aliases: ['neural networks', 'deep neural nets'],
    abbreviations: ['dl'],
    parentSkillSlug: 'machine-learning',
    childSkillSlugs: ['transformers', 'llms', 'pytorch', 'tensorflow'],
    relatedSkillSlugs: ['nlp', 'computer-vision'],
    description: 'Machine learning based on artificial neural networks with representation learning.',
  },
  'nlp': {
    name: 'Natural Language Processing',
    slug: 'nlp',
    category: 'Machine Learning',
    aliases: ['text analytics', 'computational linguistics', 'natural language understanding'],
    abbreviations: ['nlp', 'nlu'],
    parentSkillSlug: 'machine-learning',
    childSkillSlugs: ['transformers', 'llms', 'spacy', 'bert'],
    relatedSkillSlugs: ['deep-learning', 'python'],
    description: 'Techniques enabling computational understanding and generation of human language.',
  },
  'transformers': {
    name: 'Transformers',
    slug: 'transformers',
    category: 'Machine Learning',
    aliases: ['huggingface', 'hugging face', 'bert', 'roberta', 'attention mechanism'],
    abbreviations: [],
    parentSkillSlug: 'deep-learning',
    childSkillSlugs: ['llms'],
    relatedSkillSlugs: ['pytorch', 'nlp'],
    description: 'Neural network architecture utilizing self-attention mechanisms.',
  },
  'llms': {
    name: 'Large Language Models',
    slug: 'llms',
    category: 'Machine Learning',
    aliases: ['genai', 'generative ai', 'prompt engineering', 'rag', 'retrieval augmented generation'],
    abbreviations: ['llm', 'llms'],
    parentSkillSlug: 'transformers',
    childSkillSlugs: [],
    relatedSkillSlugs: ['nlp', 'langchain', 'vector-databases'],
    description: 'Foundation language models capable of generalized natural language understanding.',
  },
  'mlops': {
    name: 'MLOps',
    slug: 'mlops',
    category: 'Cloud & DevOps',
    aliases: ['machine learning operations', 'ml pipelines', 'model deployment', 'mlflow'],
    abbreviations: [],
    parentSkillSlug: 'machine-learning',
    childSkillSlugs: [],
    relatedSkillSlugs: ['docker', 'kubernetes', 'ci-cd', 'aws'],
    description: 'Practices for deploying and maintaining machine learning models in production reliably.',
  },
  'python': {
    name: 'Python',
    slug: 'python',
    category: 'Programming',
    aliases: ['python3', 'py', 'python 3.x'],
    abbreviations: ['py'],
    parentSkillSlug: 'data-science',
    childSkillSlugs: ['pandas', 'numpy', 'scipy', 'django', 'fastapi'],
    relatedSkillSlugs: ['sql', 'machine-learning'],
    description: 'High-level multi-paradigm programming language for data science and web backend.',
  },
  'sql': {
    name: 'SQL',
    slug: 'sql',
    category: 'Data & DB',
    aliases: ['structured query language', 'ansi sql', 't-sql', 'pl/sql', 'database querying'],
    abbreviations: ['sql'],
    parentSkillSlug: 'data-science',
    childSkillSlugs: ['postgresql', 'mysql', 'snowflake', 'bigquery'],
    relatedSkillSlugs: ['data-modeling', 'etl', 'data-warehousing'],
    description: 'Domain-specific language used for relational database querying and schema manipulation.',
  },
  'postgresql': {
    name: 'PostgreSQL',
    slug: 'postgresql',
    category: 'Data & DB',
    aliases: ['postgres', 'psql', 'postgres db'],
    abbreviations: ['pg', 'psql'],
    parentSkillSlug: 'sql',
    childSkillSlugs: [],
    relatedSkillSlugs: ['mysql', 'relational-databases'],
    description: 'Enterprise open-source object-relational database management system.',
  },
  'snowflake': {
    name: 'Snowflake',
    slug: 'snowflake',
    category: 'Data & DB',
    aliases: ['snowflake data cloud', 'snowflake dw'],
    abbreviations: [],
    parentSkillSlug: 'sql',
    childSkillSlugs: [],
    relatedSkillSlugs: ['bigquery', 'data-warehousing', 'etl'],
    description: 'Cloud computing-based data cloud and warehousing company.',
  },
  'bigquery': {
    name: 'Google BigQuery',
    slug: 'bigquery',
    category: 'Data & DB',
    aliases: ['bigquery', 'google bq'],
    abbreviations: ['bq'],
    parentSkillSlug: 'sql',
    childSkillSlugs: [],
    relatedSkillSlugs: ['snowflake', 'gcp'],
    description: 'Serverless enterprise data warehouse designed for analytics agility.',
  },
  'power-bi': {
    name: 'Power BI',
    slug: 'power-bi',
    category: 'Analytics & BI',
    aliases: ['powerbi', 'ms power bi', 'microsoft power bi', 'power bi desktop'],
    abbreviations: ['pbi'],
    parentSkillSlug: 'data-visualization',
    childSkillSlugs: ['dax'],
    relatedSkillSlugs: ['tableau', 'excel', 'data-modeling'],
    description: 'Business analytics and data visualization platform by Microsoft.',
  },
  'tableau': {
    name: 'Tableau',
    slug: 'tableau',
    category: 'Analytics & BI',
    aliases: ['tableau desktop', 'tableau server', 'tableau prep'],
    abbreviations: [],
    parentSkillSlug: 'data-visualization',
    childSkillSlugs: [],
    relatedSkillSlugs: ['power-bi', 'data-visualization', 'excel'],
    description: 'Interactive data visualization software focused on business intelligence.',
  },
  'data-visualization': {
    name: 'Data Visualization',
    slug: 'data-visualization',
    category: 'Analytics & BI',
    aliases: ['dashboarding', 'visual analytics', 'reporting dashboards'],
    abbreviations: [],
    parentSkillSlug: 'data-science',
    childSkillSlugs: ['power-bi', 'tableau'],
    relatedSkillSlugs: ['excel', 'matplotlib'],
    description: 'Graphic representation of information and data to facilitate visual discovery.',
  },
  'excel': {
    name: 'Microsoft Excel',
    slug: 'excel',
    category: 'Analytics & BI',
    aliases: ['excel', 'ms excel', 'spreadsheets'],
    abbreviations: [],
    parentSkillSlug: 'data-science',
    childSkillSlugs: ['advanced-excel', 'vba'],
    relatedSkillSlugs: ['power-bi', 'financial-modeling'],
    description: 'Spreadsheet platform featuring calculation, graphing tools, and pivot tables.',
  },
  'advanced-excel': {
    name: 'Advanced Excel',
    slug: 'advanced-excel',
    category: 'Analytics & BI',
    aliases: ['vlookup', 'xlookup', 'index match', 'pivot tables', 'macros', 'nested formulas'],
    abbreviations: [],
    parentSkillSlug: 'excel',
    childSkillSlugs: [],
    relatedSkillSlugs: ['financial-modeling', 'business-analysis'],
    description: 'Complex spreadsheet modeling utilizing advanced dynamic lookups and pivot summaries.',
  },
  'statistics': {
    name: 'Statistics',
    slug: 'statistics',
    category: 'Analytics & BI',
    aliases: ['statistical analysis', 'hypothesis testing', 'inferential statistics', 'a/b testing', 'bayesian statistics'],
    abbreviations: [],
    parentSkillSlug: 'data-science',
    childSkillSlugs: [],
    relatedSkillSlugs: ['machine-learning', 'data-science', 'python'],
    description: 'Mathematical science dealing with data collection, analysis, interpretation, and presentation.',
  },
  'predictive-modeling': {
    name: 'Predictive Modeling',
    slug: 'predictive-modeling',
    category: 'Machine Learning',
    aliases: ['predictive analytics', 'forecasting', 'time series forecasting', 'regression modeling'],
    abbreviations: [],
    parentSkillSlug: 'machine-learning',
    childSkillSlugs: [],
    relatedSkillSlugs: ['statistics', 'scikit-learn'],
    description: 'Using statistics and machine learning to forecast outcomes based on historical patterns.',
  },
  'docker': {
    name: 'Docker',
    slug: 'docker',
    category: 'Cloud & DevOps',
    aliases: ['containerization', 'containers', 'docker-compose', 'dockerfile'],
    abbreviations: [],
    parentSkillSlug: 'devops',
    childSkillSlugs: ['kubernetes'],
    relatedSkillSlugs: ['ci-cd', 'aws', 'linux'],
    description: 'Platform utilizing OS-level virtualization to deliver software in standardized containers.',
  },
  'kubernetes': {
    name: 'Kubernetes',
    slug: 'kubernetes',
    category: 'Cloud & DevOps',
    aliases: ['k8s', 'container orchestration'],
    abbreviations: ['k8s'],
    parentSkillSlug: 'docker',
    childSkillSlugs: [],
    relatedSkillSlugs: ['docker', 'aws', 'gcp'],
    description: 'Automated container orchestration system for deployment, scaling, and management.',
  },
  'aws': {
    name: 'Amazon Web Services',
    slug: 'aws',
    category: 'Cloud & DevOps',
    aliases: ['aws cloud', 'amazon cloud', 'ec2', 's3', 'lambda', 'glue'],
    abbreviations: ['aws'],
    parentSkillSlug: 'cloud-computing',
    childSkillSlugs: [],
    relatedSkillSlugs: ['azure', 'gcp', 'docker'],
    description: 'Comprehensive enterprise on-demand cloud computing platform and APIs.',
  },
  'react': {
    name: 'React',
    slug: 'react',
    category: 'Web & Tools',
    aliases: ['reactjs', 'react.js', 'react 18', 'react 19'],
    abbreviations: [],
    parentSkillSlug: 'frontend',
    childSkillSlugs: ['nextjs'],
    relatedSkillSlugs: ['typescript', 'javascript', 'tailwind-css'],
    description: 'Declarative component-based JavaScript library for user interface development.',
  },
  'typescript': {
    name: 'TypeScript',
    slug: 'typescript',
    category: 'Programming',
    aliases: ['ts', 'typescript 5'],
    abbreviations: ['ts'],
    parentSkillSlug: 'programming',
    childSkillSlugs: [],
    relatedSkillSlugs: ['javascript', 'react', 'nodejs'],
    description: 'Strongly typed programming language that builds on JavaScript.',
  },
  'nodejs': {
    name: 'Node.js',
    slug: 'nodejs',
    category: 'Web & Tools',
    aliases: ['nodejs', 'node', 'express.js', 'backend node'],
    abbreviations: [],
    parentSkillSlug: 'backend',
    childSkillSlugs: [],
    relatedSkillSlugs: ['typescript', 'javascript', 'rest-apis'],
    description: 'Asynchronous event-driven JavaScript runtime environment for scalable network apps.',
  },
  'rest-apis': {
    name: 'REST APIs',
    slug: 'rest-apis',
    category: 'Web & Tools',
    aliases: ['restful apis', 'api design', 'rest endpoints', 'web services'],
    abbreviations: ['api', 'apis'],
    parentSkillSlug: 'backend',
    childSkillSlugs: [],
    relatedSkillSlugs: ['fastapi', 'nodejs', 'microservices'],
    description: 'Architectural style for distributed hypermedia systems communicating via HTTP.',
  },
  'business-analysis': {
    name: 'Business Analysis',
    slug: 'business-analysis',
    category: 'Soft Skills',
    aliases: ['requirements gathering', 'gap analysis', 'brd', 'functional specifications', 'business systems analysis'],
    abbreviations: ['ba'],
    childSkillSlugs: ['stakeholder-management', 'agile'],
    relatedSkillSlugs: ['excel', 'sql', 'power-bi'],
    description: 'Identifying business needs and determining solutions to enterprise problems.',
  },
  'stakeholder-management': {
    name: 'Stakeholder Management',
    slug: 'stakeholder-management',
    category: 'Soft Skills',
    aliases: ['stakeholder communication', 'cross-functional collaboration', 'client management', 'executive reporting'],
    abbreviations: [],
    parentSkillSlug: 'business-analysis',
    childSkillSlugs: [],
    relatedSkillSlugs: ['agile', 'communication'],
    description: 'Coordinating, informing, and influencing individuals invested in project deliverables.',
  },
  'financial-modeling': {
    name: 'Financial Modeling',
    slug: 'financial-modeling',
    category: 'Analytics & BI',
    aliases: ['dcf', 'discounted cash flow', 'valuation', 'budgeting models', 'financial forecasting'],
    abbreviations: [],
    childSkillSlugs: [],
    relatedSkillSlugs: ['excel', 'advanced-excel', 'statistics'],
    description: 'Constructing abstract representations of real-world financial asset performances.',
  },
};

// Normalization function
export function normalizeSkillText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[._\-\/\\,;:]+/g, ' ')
    .replace(/\s+/g, ' ');
}

// Find canonical SkillNode by name, alias, slug, or abbreviation
export function resolveSkill(query: string): SkillNode | null {
  const normalized = normalizeSkillText(query);
  if (!normalized) return null;

  // Direct slug match
  const slugKey = normalized.replace(/\s+/g, '-');
  if (SKILL_GRAPH[slugKey]) return SKILL_GRAPH[slugKey];

  for (const key of Object.keys(SKILL_GRAPH)) {
    const node = SKILL_GRAPH[key];
    if (normalizeSkillText(node.name) === normalized) return node;
    if (node.abbreviations.some(a => normalizeSkillText(a) === normalized)) return node;
    if (node.aliases.some(a => normalizeSkillText(a) === normalized)) return node;
  }

  // Token boundary match
  for (const key of Object.keys(SKILL_GRAPH)) {
    const node = SKILL_GRAPH[key];
    const nodeNormalized = normalizeSkillText(node.name);
    if (normalized.includes(nodeNormalized) && nodeNormalized.length > 3) {
      return node;
    }
  }

  return null;
}

// Get related skill slugs for partial matching and expansion
export function getRelatedSkills(skillSlug: string): string[] {
  const node = SKILL_GRAPH[skillSlug];
  if (!node) return [];
  const related = new Set<string>(node.relatedSkillSlugs);
  if (node.parentSkillSlug) related.add(node.parentSkillSlug);
  for (const child of node.childSkillSlugs) related.add(child);
  return Array.from(related);
}

// Canonical Ontology Graph alias
export const SKILL_ONTOLOGY = SKILL_GRAPH;
