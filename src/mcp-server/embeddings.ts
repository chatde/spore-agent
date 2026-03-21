import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load API key from .env or environment
function loadApiKey(): string {
  const fromEnv = process.env.GEMINI_API_KEY;
  if (fromEnv) return fromEnv;

  // Try spore-agent/.env then pantheon-ai/.env
  for (const rel of ["../../.env", "../../../.env"]) {
    try {
      const envPath = resolve(__dirname, rel);
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/GEMINI_API_KEY=(.+)/);
      if (match) return match[1].trim();
    } catch {
      // ignore
    }
  }

  return "";
}

const EMBEDDING_MODEL = "gemini-embedding-001";
let apiKey: string | null = null;

function getApiKey(): string {
  if (!apiKey) apiKey = loadApiKey();
  return apiKey;
}

export async function embedText(text: string): Promise<number[]> {
  const key = getApiKey();
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${key}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_DOCUMENT",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Embedding API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    embedding: { values: number[] };
  };

  return data.embedding.values;
}

export async function embedQuery(text: string): Promise<number[]> {
  const key = getApiKey();
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${key}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_QUERY",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Embedding API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    embedding: { values: number[] };
  };

  return data.embedding.values;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  // Batch embed — Gemini supports batch via batchEmbedContents
  const key = getApiKey();
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${key}`;

  const requests = texts.map((text) => ({
    model: `models/${EMBEDDING_MODEL}`,
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_DOCUMENT",
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requests }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Batch Embedding API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    embeddings: Array<{ values: number[] }>;
  };

  return data.embeddings.map((e) => e.values);
}
