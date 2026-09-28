import pytest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.skill_ontology import resolve_skill, get_related_skills, SKILL_GRAPH

def test_resolve_canonical_skill():
    node = resolve_skill("Python")
    assert node is not None
    assert node.name == "Python"
    assert node.slug == "python"

def test_resolve_aliases():
    node_postgres = resolve_skill("postgres")
    assert node_postgres is not None
    assert node_postgres.name == "PostgreSQL"

    node_ml = resolve_skill("ML")
    assert node_ml is not None
    assert node_ml.name == "Machine Learning"

    node_k8s = resolve_skill("k8s")
    assert node_k8s is not None
    assert node_k8s.name == "Kubernetes"

def test_skill_hierarchy_and_related():
    related = get_related_skills("machine-learning")
    assert len(related) > 0
    assert "data-science" in related or "deep-learning" in related
