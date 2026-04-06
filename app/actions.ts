'use server'

interface EmbeddingResponse {
  embeddings?: number[][]
  error?: string
}

interface SimilarityResult {
  score?: number
  error?: string
}

// Cosine similarity calculation
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) return 0
  
  return dotProduct / denominator
}

// Convert similarity (-1 to 1) to score (1 to 5000, lower is better like Contexto)
function similarityToScore(similarity: number): number {
  // Normalize from [-1, 1] to [0, 1]
  const normalized = (similarity + 1) / 2
  
  // Apply exponential curve to spread out scores more dramatically
  // This makes semantically different words have very different scores
  const curved = Math.pow(normalized, 2.5)
  
  // Invert: higher similarity = lower score (rank 1 is best)
  // Score 1 = perfect match, Score 5000 = completely unrelated
  const invertedScore = Math.round((1 - curved) * 4999) + 1
  
  return invertedScore
}

export async function checkSimilarity(
  guessWord: string,
  targetWord: string
): Promise<SimilarityResult> {
  // Check for exact match first (score 1 = perfect match)
  if (guessWord === targetWord) {
    return { score: 1 }
  }
  
  const apiToken = process.env.HUGGINGFACE_API_TOKEN
  
  if (!apiToken) {
    return { error: 'مفتاح API غير مُعد على الخادم' }
  }

  try {
    // Use the new Hugging Face Inference Providers router API (2026+)
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/pipeline/feature-extraction',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [guessWord, targetWord],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] HF API error:', response.status, errorText)
      
      if (response.status === 401) {
        return { error: 'مفتاح API غير صالح' }
      }
      if (response.status === 503) {
        return { error: 'النموذج قيد التحميل، يرجى المحاولة مرة أخرى' }
      }
      if (response.status === 404 || response.status === 410) {
        return { error: 'النموذج غير متاح حالياً' }
      }
      
      return { error: `خطأ في الاتصال: ${response.status}` }
    }

    const data = await response.json() as number[][]
    console.log('[v0] HF API response type:', typeof data, Array.isArray(data) ? 'array' : 'not array')
    
    if (!Array.isArray(data) || data.length < 2) {
      console.error('[v0] Unexpected response format:', JSON.stringify(data).slice(0, 200))
      return { error: 'استجابة غير متوقعة من الخادم' }
    }

    const similarity = cosineSimilarity(data[0], data[1])
    const score = similarityToScore(similarity)

    return { score }
  } catch (error) {
    console.error('Similarity check error:', error)
    return { error: 'حدث خطأ أثناء التحقق من التشابه' }
  }
}
