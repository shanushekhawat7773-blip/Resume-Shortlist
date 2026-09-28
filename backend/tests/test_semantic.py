import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.semantic_engine import tokenize, cosine_similarity, evaluate_semantic_match

def test_tokenize_ngram():
    tokens = tokenize("Build predictive models using Python")
    assert "build" in tokens
    assert "predictive" in tokens
    assert "build_predictive" in tokens

def test_cosine_similarity():
    text1 = "Build predictive models for customer churn and revenue forecasting"
    text2 = "Developed customer churn prediction models using classification algorithms"
    text3 = "Prepared salads and maintained kitchen inventory"

    sim_high = cosine_similarity(text1, text2)
    sim_low = cosine_similarity(text1, text3)

    assert sim_high > 0.20
    assert sim_high > sim_low

def test_evaluate_semantic_match():
    match = evaluate_semantic_match("Experience with SQL database queries", "Engineered complex SQL database queries reducing latency")
    assert match["strength"] in ["Strong", "Moderate"]
    assert match["confidence"] > 0.4
