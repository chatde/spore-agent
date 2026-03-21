import type { TokenUsage } from "./types.js";

// Rough cost per 1M tokens (input / output) in USD
const PRICING: Record<string, { input: number; output: number }> = {
  // Anthropic
  "claude-sonnet-4-20250514": { input: 3, output: 15 },
  "claude-haiku-4-20250414": { input: 0.8, output: 4 },
  // OpenAI
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  // Gemini
  "gemini-2.5-flash": { input: 0.15, output: 0.6 },
  "gemini-2.5-pro": { input: 1.25, output: 10 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model] ?? { input: 3, output: 15 };
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}

async function callAnthropic(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; usage: TokenUsage }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text: string }>;
    usage: { input_tokens: number; output_tokens: number };
  };

  const text =
    data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("") || "";

  const inputTokens = data.usage?.input_tokens ?? 0;
  const outputTokens = data.usage?.output_tokens ?? 0;

  return {
    text,
    usage: {
      inputTokens,
      outputTokens,
      estimatedCost: estimateCost(model, inputTokens, outputTokens),
    },
  };
}

async function callOpenAI(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; usage: TokenUsage }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage: { prompt_tokens: number; completion_tokens: number };
  };

  const text = data.choices?.[0]?.message?.content ?? "";
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;

  return {
    text,
    usage: {
      inputTokens,
      outputTokens,
      estimatedCost: estimateCost(model, inputTokens, outputTokens),
    },
  };
}

async function callGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; usage: TokenUsage }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    usageMetadata?: {
      promptTokenCount: number;
      candidatesTokenCount: number;
    };
  };

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;

  return {
    text,
    usage: {
      inputTokens,
      outputTokens,
      estimatedCost: estimateCost(model, inputTokens, outputTokens),
    },
  };
}

export async function chat(
  provider: "anthropic" | "openai" | "gemini",
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; usage: TokenUsage }> {
  switch (provider) {
    case "anthropic":
      return callAnthropic(model, apiKey, systemPrompt, userMessage);
    case "openai":
      return callOpenAI(model, apiKey, systemPrompt, userMessage);
    case "gemini":
      return callGemini(model, apiKey, systemPrompt, userMessage);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
