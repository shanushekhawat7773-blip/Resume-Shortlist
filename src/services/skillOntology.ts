export interface SkillDefinition {
  name: string;
  category: 'Programming' | 'Data & DB' | 'Analytics & BI' | 'Machine Learning' | 'Cloud & DevOps' | 'Web & Tools' | 'Soft Skills';
  aliases: string[];
  relatedSkills: string[];
}

export const SKILL_ONTOLOGY: Record<string, SkillDefinition> = {
  // Programming
  'python': {
    name: 'Python',
    category: 'Programming',
    aliases: ['python3', 'py', 'python 3.x'],
    relatedSkills: ['Data Analysis', 'Pandas', 'NumPy', 'Django', 'FastAPI', 'Machine Learning'],
  },
  'javascript': {
    name: 'JavaScript',
    category: 'Programming',
    aliases: ['js', 'es6', 'es2020', 'vanilla js'],
    relatedSkills: ['TypeScript', 'React', 'Node.js', 'Frontend Development'],
  },
  'typescript': {
    name: 'TypeScript',
    category: 'Programming',
    aliases: ['ts'],
    relatedSkills: ['JavaScript', 'React', 'Node.js', 'Next.js'],
  },
  'sql': {
    name: 'SQL',
    category: 'Data & DB',
    aliases: ['structured query language', 'ansi sql', 't-sql', 'pl/sql'],
    relatedSkills: ['PostgreSQL', 'MySQL', 'Relational Databases', 'Database Querying', 'Data Modeling', 'Snowflake', 'BigQuery'],
  },
  'postgresql': {
    name: 'PostgreSQL',
    category: 'Data & DB',
    aliases: ['postgres', 'psql'],
    relatedSkills: ['SQL', 'Relational Databases', 'MySQL'],
  },
  'mysql': {
    name: 'MySQL',
    category: 'Data & DB',
    aliases: [],
    relatedSkills: ['SQL', 'Relational Databases'],
  },
  'mongodb': {
    name: 'MongoDB',
    category: 'Data & DB',
    aliases: ['mongo', 'nosql document db'],
    relatedSkills: ['NoSQL', 'Document Databases', 'Mongoose'],
  },
  'snowflake': {
    name: 'Snowflake',
    category: 'Data & DB',
    aliases: ['snowflake data cloud', 'snowflake dw'],
    relatedSkills: ['SQL', 'Data Warehousing', 'BigQuery', 'ETL'],
  },
  'bigquery': {
    name: 'BigQuery',
    category: 'Data & DB',
    aliases: ['google bigquery', 'bq'],
    relatedSkills: ['SQL', 'GCP', 'Data Warehousing'],
  },
  'power bi': {
    name: 'Power BI',
    category: 'Analytics & BI',
    aliases: ['powerbi', 'ms power bi', 'microsoft power bi', 'power bi desktop'],
    relatedSkills: ['DAX', 'Business Intelligence', 'Tableau', 'Dashboard Development', 'Excel', 'Data Visualization'],
  },
  'tableau': {
    name: 'Tableau',
    category: 'Analytics & BI',
    aliases: ['tableau desktop', 'tableau server'],
    relatedSkills: ['Power BI', 'Data Visualization', 'Business Intelligence', 'Dashboard Development', 'Data Analysis'],
  },
  'excel': {
    name: 'Excel',
    category: 'Analytics & BI',
    aliases: ['ms excel', 'microsoft excel', 'spreadsheets'],
    relatedSkills: ['Advanced Excel', 'VLOOKUP', 'Pivot Tables', 'Data Analysis', 'Financial Modeling', 'VBA'],
  },
  'advanced excel': {
    name: 'Advanced Excel',
    category: 'Analytics & BI',
    aliases: ['vlookup', 'xlookup', 'index match', 'pivot tables', 'macros'],
    relatedSkills: ['Excel', 'Data Analysis', 'Financial Modeling'],
  },
  'statistics': {
    name: 'Statistics',
    category: 'Analytics & BI',
    aliases: ['statistical analysis', 'hypothesis testing', 'inferential statistics', 'a/b testing'],
    relatedSkills: ['Data Analysis', 'Predictive Modeling', 'Machine Learning', 'R', 'Python'],
  },
  'data modeling': {
    name: 'Data Modeling',
    category: 'Analytics & BI',
    aliases: ['dimensional modeling', 'star schema', 'snowflake schema', 'er modeling'],
    relatedSkills: ['SQL', 'Data Warehousing', 'ETL', 'Power BI'],
  },
  'etl': {
    name: 'ETL',
    category: 'Analytics & BI',
    aliases: ['extract transform load', 'data pipeline', 'data pipelines', 'elt'],
    relatedSkills: ['Data Warehousing', 'SQL', 'Airflow', 'Python', 'Data Engineering'],
  },
  'pandas': {
    name: 'Pandas',
    category: 'Analytics & BI',
    aliases: [],
    relatedSkills: ['Python', 'NumPy', 'Data Analysis', 'Data Wrangling'],
  },
  'numpy': {
    name: 'NumPy',
    category: 'Analytics & BI',
    aliases: [],
    relatedSkills: ['Python', 'Pandas', 'Scientific Computing'],
  },
  'data analysis': {
    name: 'Data Analysis',
    category: 'Analytics & BI',
    aliases: ['data analytics', 'exploratory data analysis', 'eda'],
    relatedSkills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'Statistics'],
  },
  'machine learning': {
    name: 'Machine Learning',
    category: 'Machine Learning',
    aliases: ['ml', 'statistical learning', 'applied ml'],
    relatedSkills: ['Predictive Modeling', 'scikit-learn', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Statistics'],
  },
  'predictive modeling': {
    name: 'Predictive Modeling',
    category: 'Machine Learning',
    aliases: ['predictive analytics', 'forecasting', 'regression modeling'],
    relatedSkills: ['Machine Learning', 'Statistics', 'scikit-learn', 'Time Series'],
  },
  'pytorch': {
    name: 'PyTorch',
    category: 'Machine Learning',
    aliases: ['torch'],
    relatedSkills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'NLP', 'Computer Vision'],
  },
  'tensorflow': {
    name: 'TensorFlow',
    category: 'Machine Learning',
    aliases: ['tf', 'keras'],
    relatedSkills: ['PyTorch', 'Deep Learning', 'Machine Learning'],
  },
  'nlp': {
    name: 'NLP',
    category: 'Machine Learning',
    aliases: ['natural language processing', 'text analytics', 'linguistics computing'],
    relatedSkills: ['Transformers', 'LLMs', 'PyTorch', 'Hugging Face', 'spaCy', 'BERT'],
  },
  'transformers': {
    name: 'Transformers',
    category: 'Machine Learning',
    aliases: ['huggingface', 'hugging face', 'bert', 'gpt'],
    relatedSkills: ['NLP', 'LLMs', 'PyTorch', 'Deep Learning'],
  },
  'llms': {
    name: 'LLMs',
    category: 'Machine Learning',
    aliases: ['large language models', 'genai', 'generative ai', 'prompt engineering', 'rag'],
    relatedSkills: ['NLP', 'Transformers', 'LangChain', 'Vector DBs'],
  },
  'mlops': {
    name: 'MLOps',
    category: 'Machine Learning',
    aliases: ['ml pipelines', 'model deployment', 'mlflow', 'weights and biases'],
    relatedSkills: ['Docker', 'CI/CD', 'Machine Learning', 'AWS', 'Kubernetes'],
  },
  'scikit-learn': {
    name: 'scikit-learn',
    category: 'Machine Learning',
    aliases: ['sklearn'],
    relatedSkills: ['Machine Learning', 'Python', 'Predictive Modeling'],
  },
  'docker': {
    name: 'Docker',
    category: 'Cloud & DevOps',
    aliases: ['containerization', 'containers', 'docker-compose'],
    relatedSkills: ['Kubernetes', 'CI/CD', 'Cloud Infrastructure', 'Linux'],
  },
  'kubernetes': {
    name: 'Kubernetes',
    category: 'Cloud & DevOps',
    aliases: ['k8s'],
    relatedSkills: ['Docker', 'Cloud Infrastructure', 'DevOps'],
  },
  'aws': {
    name: 'AWS',
    category: 'Cloud & DevOps',
    aliases: ['amazon web services', 'ec2', 's3', 'lambda'],
    relatedSkills: ['Cloud Infrastructure', 'GCP', 'Azure', 'Docker', 'Serverless'],
  },
  'gcp': {
    name: 'GCP',
    category: 'Cloud & DevOps',
    aliases: ['google cloud platform', 'google cloud'],
    relatedSkills: ['AWS', 'BigQuery', 'Cloud Infrastructure'],
  },
  'azure': {
    name: 'Azure',
    category: 'Cloud & DevOps',
    aliases: ['microsoft azure'],
    relatedSkills: ['AWS', 'Cloud Infrastructure'],
  },
  'ci/cd': {
    name: 'CI/CD',
    category: 'Cloud & DevOps',
    aliases: ['continuous integration', 'github actions', 'jenkins', 'gitlab ci'],
    relatedSkills: ['Git', 'Docker', 'DevOps'],
  },
  'git': {
    name: 'Git',
    category: 'Cloud & DevOps',
    aliases: ['github', 'version control', 'gitlab'],
    relatedSkills: ['CI/CD', 'Software Engineering'],
  },
  'linux': {
    name: 'Linux',
    category: 'Cloud & DevOps',
    aliases: ['bash', 'shell scripting', 'ubuntu'],
    relatedSkills: ['Docker', 'DevOps', 'Cloud Infrastructure'],
  },
  'react': {
    name: 'React',
    category: 'Web & Tools',
    aliases: ['reactjs', 'react.js'],
    relatedSkills: ['TypeScript', 'JavaScript', 'Next.js', 'Frontend Development', 'HTML5', 'Tailwind CSS'],
  },
  'next.js': {
    name: 'Next.js',
    category: 'Web & Tools',
    aliases: ['nextjs'],
    relatedSkills: ['React', 'TypeScript', 'Node.js'],
  },
  'node.js': {
    name: 'Node.js',
    category: 'Web & Tools',
    aliases: ['nodejs', 'node'],
    relatedSkills: ['JavaScript', 'TypeScript', 'Express', 'REST APIs', 'Backend Development'],
  },
  'fastapi': {
    name: 'FastAPI',
    category: 'Web & Tools',
    aliases: ['fast api'],
    relatedSkills: ['Python', 'REST APIs', 'Flask', 'Django'],
  },
  'django': {
    name: 'Django',
    category: 'Web & Tools',
    aliases: ['django rest framework', 'drf'],
    relatedSkills: ['Python', 'REST APIs', 'PostgreSQL'],
  },
  'rest apis': {
    name: 'REST APIs',
    category: 'Web & Tools',
    aliases: ['restful apis', 'api design', 'web apis'],
    relatedSkills: ['Node.js', 'FastAPI', 'Backend Development'],
  },
  'tailwind css': {
    name: 'Tailwind CSS',
    category: 'Web & Tools',
    aliases: ['tailwind'],
    relatedSkills: ['CSS3', 'React', 'Frontend Development'],
  },
  'stakeholder management': {
    name: 'Stakeholder Management',
    category: 'Soft Skills',
    aliases: ['stakeholder communication', 'cross-functional collaboration', 'client management'],
    relatedSkills: ['Communication', 'Project Management', 'Business Analysis'],
  },
  'agile': {
    name: 'Agile',
    category: 'Soft Skills',
    aliases: ['scrum', 'kanban', 'sprint planning', 'agile methodology'],
    relatedSkills: ['Jira', 'Project Management', 'Product Management'],
  },
  'communication': {
    name: 'Communication',
    category: 'Soft Skills',
    aliases: ['verbal communication', 'presentation skills', 'technical writing', 'documentation'],
    relatedSkills: ['Stakeholder Management', 'Client Facing'],
  },
  'business analysis': {
    name: 'Business Analysis',
    category: 'Soft Skills',
    aliases: ['business analytics', 'requirements gathering', 'gap analysis', 'brd'],
    relatedSkills: ['Data Analysis', 'Stakeholder Management', 'Excel', 'Agile'],
  },
  'financial modeling': {
    name: 'Financial Modeling',
    category: 'Analytics & BI',
    aliases: ['dcf', 'valuation', 'financial analysis', 'budgeting'],
    relatedSkills: ['Excel', 'Advanced Excel', 'Business Analysis'],
  },
  'bloomberg terminal': {
    name: 'Bloomberg Terminal',
    category: 'Web & Tools',
    aliases: ['bloomberg'],
    relatedSkills: ['Financial Modeling', 'Financial Analysis'],
  },
};

// Quick helper to normalize skill name
export function normalizeSkill(raw: string): string {
  return raw.trim().toLowerCase().replace(/[-_.]/g, ' ').replace(/\s+/g, ' ');
}

// Find skill in ontology by alias or canonical name
export function resolveSkillInOntology(skillText: string): SkillDefinition | null {
  const normalized = normalizeSkill(skillText);
  if (SKILL_ONTOLOGY[normalized]) {
    return SKILL_ONTOLOGY[normalized];
  }
  for (const key of Object.keys(SKILL_ONTOLOGY)) {
    const item = SKILL_ONTOLOGY[key];
    if (normalizeSkill(item.name) === normalized) return item;
    if (item.aliases.some(a => normalizeSkill(a) === normalized)) {
      return item;
    }
  }
  return null;
}
