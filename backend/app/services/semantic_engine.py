"""
Semantic Vectorization & Cosine Similarity Engine
Implements custom n-gram tokenization, sublinear TF-IDF, and vector cosine similarity.
"""
import math
import re
from typing import List, Dict, Set

STOP_WORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "did", "do",
    "does", "doing", "don't", "down", "during", "each", "few", "for", "from", "further",
    "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "isn't", "it", "its",
    "itself", "let's", "me", "more", "most", "my", "myself", "no", "nor", "not",
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
    "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such",
    "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
    "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who",
    "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
}

def tokenize(text: str, n_grams: int = 2) -> List[str]:
    """Tokenize string into unigrams and bigrams, stripping punctuation and stopwords."""
    clean = re.sub(r"[^\w\s-]", " ", text.lower())
    words = [w for w in clean.split() if len(w) > 1 and w not in STOP_WORDS]
    
    tokens = list(words)
    if n_grams >= 2:
        for i in range(len(words) - 1):
            tokens.append(f"{words[i]}_{words[i+1]}")
    return tokens

def compute_tf(tokens: List[str]) -> Dict[str, float]:
    """Calculate sublinear Term Frequency: tf(t) = 1 + ln(count)."""
    counts: Dict[str, int] = {}
    for t in tokens:
        counts[t] = counts.get(t, 0) + 1
    
    tf: Dict[str, float] = {}
    for t, count in counts.items():
        tf[t] = 1.0 + math.log(count)
    return tf

def cosine_similarity(text1: str, text2: str) -> float:
    """Compute cosine similarity between two text snippets."""
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)

    if not tokens1 or not tokens2:
        return 0.0

    tf1 = compute_tf(tokens1)
    tf2 = compute_tf(tokens2)

    all_keys = set(tf1.keys()).union(set(tf2.keys()))

    dot_product = 0.0
    norm1 = 0.0
    norm2 = 0.0

    for k in all_keys:
        v1 = tf1.get(k, 0.0)
        v2 = tf2.get(k, 0.0)
        dot_product += v1 * v2
        norm1 += v1 * v1
        norm2 += v2 * v2

    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0

    return dot_product / (math.sqrt(norm1) * math.sqrt(norm2))

def evaluate_semantic_match(requirement: str, evidence: str) -> Dict[str, any]:
    """
    Evaluate similarity between a requirement and candidate evidence.
    Returns similarity score (0.0 - 1.0) and match strength classification.
    """
    sim = cosine_similarity(requirement, evidence)

    if sim >= 0.45:
        strength = "Strong"
    elif sim >= 0.25:
        strength = "Moderate"
    elif sim >= 0.12:
        strength = "Needs verification"
    else:
        strength = "Not detected"

    return {
        "similarity": round(sim, 3),
        "strength": strength,
        "confidence": round(min(1.0, sim * 1.5), 2),
    }
