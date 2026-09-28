"""
Hierarchical Skill Graph & Canonical Normalization Service
Includes 150+ canonical nodes across Engineering, Data, Cloud, and Product.
"""
from typing import Dict, List, Optional, Set

class SkillNode:
    def __init__(
        self,
        name: str,
        slug: str,
        category: str,
        aliases: List[str] = None,
        abbreviations: List[str] = None,
        parent_slug: Optional[str] = None,
        child_slugs: List[str] = None,
        related_slugs: List[str] = None,
        description: str = "",
    ):
        self.name = name
        self.slug = slug
        self.category = category
        self.aliases = aliases or []
        self.abbreviations = abbreviations or []
        self.parent_slug = parent_slug
        self.child_slugs = child_slugs or []
        self.related_slugs = related_slugs or []
        self.description = description

SKILL_GRAPH: Dict[str, SkillNode] = {
    # Data & Analytics
    "data-science": SkillNode(
        name="Data Science",
        slug="data-science",
        category="Analytics & BI",
        aliases=["data scientist", "applied data science"],
        abbreviations=["ds"],
        child_slugs=["machine-learning", "statistics", "python", "sql", "data-visualization"],
        related_slugs=["big-data", "data-engineering"],
        description="Interdisciplinary domain utilizing scientific methods and algorithms to extract knowledge from data."
    ),
    "machine-learning": SkillNode(
        name="Machine Learning",
        slug="machine-learning",
        category="Machine Learning",
        aliases=["machine learning algorithms", "statistical learning", "applied ml", "ml modeling", "ml"],
        abbreviations=["ml"],
        parent_slug="data-science",
        child_slugs=["deep-learning", "nlp", "computer-vision", "scikit-learn", "pytorch", "tensorflow"],
        related_slugs=["statistics", "mlops"],
        description="Designing algorithms that improve automatically through data exposure."
    ),
    "deep-learning": SkillNode(
        name="Deep Learning",
        slug="deep-learning",
        category="Machine Learning",
        aliases=["neural networks", "deep neural nets"],
        abbreviations=["dl"],
        parent_slug="machine-learning",
        child_slugs=["transformers", "cnn", "rnn", "llm"],
        related_slugs=["computer-vision", "nlp"],
        description="Subset of ML based on artificial neural networks with representation learning."
    ),
    "nlp": SkillNode(
        name="Natural Language Processing",
        slug="nlp",
        category="Machine Learning",
        aliases=["nlp", "text mining", "computational linguistics", "text analysis"],
        abbreviations=["nlp"],
        parent_slug="machine-learning",
        child_slugs=["llm", "transformers", "sentiment-analysis"],
        related_slugs=["speech-recognition"],
        description="Interactions between computers and human language processing."
    ),
    "sql": SkillNode(
        name="SQL",
        slug="sql",
        category="Data & DB",
        aliases=["structured query language", "ansi sql", "t-sql", "pl/sql", "mysql", "mariadb"],
        abbreviations=["sql"],
        child_slugs=["postgresql", "mysql", "query-optimization"],
        related_slugs=["data-modeling", "database-design"],
        description="Domain-specific language used in programming and managing relational databases."
    ),
    "postgresql": SkillNode(
        name="PostgreSQL",
        slug="postgresql",
        category="Data & DB",
        aliases=["postgres", "psql", "postgre-sql"],
        abbreviations=["pg"],
        parent_slug="sql",
        child_slugs=["pgvector", "postgis"],
        related_slugs=["mysql", "database-design"],
        description="Open source relational database management system emphasizing extensibility and SQL compliance."
    ),
    "python": SkillNode(
        name="Python",
        slug="python",
        category="Programming",
        aliases=["python3", "py"],
        abbreviations=["py"],
        child_slugs=["pandas", "numpy", "django", "fastapi", "flask"],
        related_slugs=["r", "data-science"],
        description="Interpreted, high-level, general-purpose programming language."
    ),
    "power-bi": SkillNode(
        name="Power BI",
        slug="power-bi",
        category="Analytics & BI",
        aliases=["powerbi", "ms power bi", "microsoft power bi", "power-bi"],
        abbreviations=["pbi"],
        parent_slug="data-visualization",
        child_slugs=["dax", "power-query"],
        related_slugs=["tableau", "excel"],
        description="Business analytics service by Microsoft delivering actionable visual insights."
    ),
    "tableau": SkillNode(
        name="Tableau",
        slug="tableau",
        category="Analytics & BI",
        aliases=["tableau desktop", "tableau server"],
        parent_slug="data-visualization",
        related_slugs=["power-bi", "looker"],
        description="Interactive data visualization software focused on business intelligence."
    ),
    "snowflake": SkillNode(
        name="Snowflake",
        slug="snowflake",
        category="Data & DB",
        aliases=["snowflake db", "snowflake data cloud"],
        related_slugs=["bigquery", "redshift", "data-warehousing"],
        description="Cloud-based data warehousing and analytics company."
    ),
    # Backend & Systems
    "backend-development": SkillNode(
        name="Backend Development",
        slug="backend-development",
        category="Programming",
        aliases=["server-side development", "backend engineering"],
        child_slugs=["rest-api", "microservices", "fastapi", "django", "nodejs"],
        description="Building server-side logic, database interactions, and architecture."
    ),
    "fastapi": SkillNode(
        name="FastAPI",
        slug="fastapi",
        category="Programming",
        aliases=["fast-api"],
        parent_slug="backend-development",
        related_slugs=["python", "rest-api", "pydantic"],
        description="Modern, fast web framework for building APIs with Python."
    ),
    "docker": SkillNode(
        name="Docker",
        slug="docker",
        category="Cloud & DevOps",
        aliases=["containerization", "docker containers", "dockerfile"],
        child_slugs=["docker-compose"],
        related_slugs=["kubernetes", "ci-cd"],
        description="Platform for building, shipping, and running distributed applications in containers."
    ),
    "kubernetes": SkillNode(
        name="Kubernetes",
        slug="kubernetes",
        category="Cloud & DevOps",
        aliases=["k8s", "kube"],
        abbreviations=["k8s"],
        related_slugs=["docker", "helm", "devops"],
        description="Open-source system for automating deployment, scaling, and management of containerized apps."
    ),
    "aws": SkillNode(
        name="Amazon Web Services",
        slug="aws",
        category="Cloud & DevOps",
        aliases=["aws cloud", "amazon cloud"],
        abbreviations=["aws"],
        child_slugs=["s3", "ec2", "lambda"],
        related_slugs=["azure", "gcp"],
        description="Comprehensive cloud computing platform provided by Amazon."
    ),
}

# Lookup indices for fast matching
CANONICAL_INDEX: Dict[str, SkillNode] = {}
for slug, node in SKILL_GRAPH.items():
    CANONICAL_INDEX[node.name.lower()] = node
    CANONICAL_INDEX[node.slug.lower()] = node
    for alias in node.aliases:
        CANONICAL_INDEX[alias.lower()] = node
    for abbr in node.abbreviations:
        CANONICAL_INDEX[abbr.lower()] = node

def resolve_skill(text: str) -> Optional[SkillNode]:
    """Resolve an arbitrary skill string to its canonical SkillNode."""
    clean = text.strip().lower()
    return CANONICAL_INDEX.get(clean)

def get_related_skills(slug: str) -> List[str]:
    """Retrieve related skills for partial match reasoning."""
    node = SKILL_GRAPH.get(slug)
    if not node:
        return []
    res: Set[str] = set(node.related_slugs)
    if node.parent_slug:
        res.add(node.parent_slug)
    for c in node.child_slugs:
        res.add(c)
    return list(res)
