import { Langbase } from "langbase";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GitHub Models client — free tier, OpenAI-compatible endpoint
const githubEmbeddingClient = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN!,
});

// --- Helpers ---

/** Split FAQ text into meaningful chunks (by section/paragraph) */
function chunkFaq(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 30);
}

/** Cosine similarity between two vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Embed an array of strings using GitHub Models (text-embedding-3-small) */
async function embed(texts: string[]): Promise<number[][]> {
  const res = await githubEmbeddingClient.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// --- Embedding cache (lives for the lifetime of the server process) ---
let cachedChunks: string[] | null = null;
let cachedEmbeddings: number[][] | null = null;

/** Load FAQ, embed all chunks, and cache them. Returns cache. */
async function loadFaqEmbeddings(): Promise<{ chunks: string[]; embeddings: number[][] }> {
  if (cachedChunks && cachedEmbeddings) {
    return { chunks: cachedChunks, embeddings: cachedEmbeddings };
  }

  const faqPath = path.join(process.cwd(), "faq-knowledge-base.txt");
  const faqText = fs.readFileSync(faqPath, "utf-8");
  const chunks = chunkFaq(faqText);
  console.log(`[RAG] Embedding ${chunks.length} FAQ chunks via GitHub Models...`);
  const embeddings = await embed(chunks);

  cachedChunks = chunks;
  cachedEmbeddings = embeddings;
  console.log("[RAG] FAQ embeddings cached.");
  return { chunks, embeddings };
}

/** Retrieve the top-K most relevant FAQ chunks for a given query */
async function retrieveContext(query: string, topK = 4): Promise<string> {
  const { chunks, embeddings } = await loadFaqEmbeddings();
  const [queryEmbedding] = await embed([query]);

  const ranked = chunks
    .map((chunk, i) => ({ chunk, score: cosineSimilarity(queryEmbedding, embeddings[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  console.log("[RAG] Top chunk scores:", ranked.map((r) => r.score.toFixed(3)));
  return ranked.map((r) => r.chunk).join("\n\n");
}

// --- Route Handler ---

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const langbase = new Langbase({ apiKey: process.env.LANGBASE_API_KEY! });
    const pipeName = process.env.LANGBASE_PIPE_NAME || "ai-support-agent";

    // Extract the latest query from the messages to perform RAG lookup
    const latestMessage = messages[messages.length - 1].content;
    const contextText = await retrieveContext(latestMessage);

    const systemPrompt = `You are a friendly and professional AI support assistant for Uniserve, a university campus services platform.

RESPONSE FORMAT RULES:
- Use **bold** for key terms, service names, prices, and important info
- Use bullet points (-) for lists of features or options
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Keep replies concise — aim for 2-5 lines or a short list. Avoid walls of text
- End with a helpful follow-up offer when appropriate (e.g. "Would you like help with anything else?")
- Do NOT use headers (##). Speak naturally and conversationally
- Answer directly based on the conversational history provided.

KNOWLEDGE BASE (answer from this first):
${contextText || "No relevant context found."}`;

    // Pass the system prompt and the dynamic conversational history
    const mappedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const { completion } = await langbase.pipes.run({
      stream: false,
      name: pipeName,
      messages: mappedMessages,
    });

    return NextResponse.json({ reply: completion });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process the request" },
      { status: 500 }
    );
  }
}
