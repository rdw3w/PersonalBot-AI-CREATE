import { GoogleGenAI } from '@google/genai';

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No Gemini API key found for embeddings.");
    return new Array(768).fill(0); // Fallback dummy embedding
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    return response.embeddings?.[0]?.values || [];
  } catch (error: any) {
    if (!error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
      console.error("Error generating embedding:", error);
    }
    return new Array(768).fill(0);
  }
}

export function chunkText(text: string, chunkSize: number = 200, overlap: number = 50): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

export async function processKnowledgeBase(text: string): Promise<{ text: string; embedding: number[] }[]> {
  if (!text.trim()) return [];
  const chunks = chunkText(text);
  const processedChunks = [];
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const embedding = await generateEmbedding(chunk);
    processedChunks.push({ text: chunk, embedding });
  }
  return processedChunks;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function retrieveTopK(queryEmbedding: number[], chunks: { text: string; embedding: number[] }[], k: number = 3): string[] {
  if (!chunks || chunks.length === 0) return [];
  const scoredChunks = chunks.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, k).map(c => c.text);
}
