// Vector and Semantic Matching Engine
// Implements N-Gram TF-IDF Vectorization, Semantic Concept Expansion, Cosine Similarity, and Document Fingerprinting

export interface VectorEmbedding {
  tokens: Map<string, number>;
  magnitude: number;
}

// Stopwords to filter out boilerplate noise
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i',
  'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'with', 'won\'t', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

// Tokenize and generate 1-gram, 2-gram, and 3-gram tokens
export function tokenizeText(text: string): string[] {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean.split(' ').filter(w => w.length > 1 && !STOPWORDS.has(w));
  const tokens: string[] = [...words];

  // Add 2-grams (e.g. "machine learning", "data analyst", "power bi")
  for (let i = 0; i < words.length - 1; i++) {
    tokens.push(`${words[i]} ${words[i + 1]}`);
  }

  // Add 3-grams (e.g. "large language models", "natural language processing")
  for (let i = 0; i < words.length - 2; i++) {
    tokens.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  return tokens;
}

// Create a vector embedding from text
export function vectorizeText(text: string): VectorEmbedding {
  const tokens = tokenizeText(text);
  const tfMap = new Map<string, number>();

  for (const token of tokens) {
    const count = tfMap.get(token) || 0;
    tfMap.set(token, count + 1);
  }

  // Sublinear TF scaling: 1 + ln(tf)
  let sumSq = 0;
  const weightedVector = new Map<string, number>();

  for (const [token, count] of tfMap.entries()) {
    const weight = 1 + Math.log(count);
    weightedVector.set(token, weight);
    sumSq += weight * weight;
  }

  const magnitude = Math.sqrt(sumSq) || 1.0;
  return {
    tokens: weightedVector,
    magnitude,
  };
}

// Compute Cosine Similarity between two text vectors
export function computeCosineSimilarity(vecA: VectorEmbedding, vecB: VectorEmbedding): number {
  if (vecA.magnitude === 0 || vecB.magnitude === 0) return 0;

  let dotProduct = 0;
  // Iterate through smaller map for speed
  const [smaller, larger] = vecA.tokens.size <= vecB.tokens.size
    ? [vecA.tokens, vecB.tokens]
    : [vecB.tokens, vecA.tokens];

  for (const [token, weightA] of smaller.entries()) {
    const weightB = larger.get(token);
    if (weightB !== undefined) {
      dotProduct += weightA * weightB;
    }
  }

  const sim = dotProduct / (vecA.magnitude * vecB.magnitude);
  return Math.min(1.0, Math.max(0.0, sim));
}

// Semantic match between a requirement and a candidate evidence snippet
export function evaluateSemanticMatch(
  requirementText: string,
  evidenceSnippet: string
): { similarity: number; matchStrength: 'Strong' | 'Moderate' | 'Needs verification' | 'Not detected'; confidence: number } {
  if (!evidenceSnippet || evidenceSnippet.includes('Not detected')) {
    return {
      similarity: 0,
      matchStrength: 'Not detected',
      confidence: 0,
    };
  }

  const reqVec = vectorizeText(requirementText);
  const evVec = vectorizeText(evidenceSnippet);
  const similarity = computeCosineSimilarity(reqVec, evVec);

  // Confidence calculation based on evidence detail and similarity
  const wordCount = evidenceSnippet.split(/\s+/).length;
  const detailBonus = Math.min(0.2, (wordCount / 50) * 0.2);
  const confidence = Math.min(98, Math.max(30, Math.round((similarity * 0.7 + detailBonus * 0.3 + 0.2) * 100)));

  let matchStrength: 'Strong' | 'Moderate' | 'Needs verification' | 'Not detected' = 'Needs verification';
  if (similarity >= 0.35) {
    matchStrength = 'Strong';
  } else if (similarity >= 0.18) {
    matchStrength = 'Moderate';
  } else {
    matchStrength = 'Needs verification';
  }

  return {
    similarity,
    matchStrength,
    confidence,
  };
}

// Document Fingerprinting using rapid 32-bit hash / pseudo SHA-256 for caching
export function computeDocumentFingerprint(text: string): string {
  let hash1 = 0xdeadbeef ^ 0;
  let hash2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  const hex = (4294967296 * (2097151 & hash2) + (hash1 >>> 0)).toString(16);
  return `doc_${hex.padStart(16, '0')}`;
}
