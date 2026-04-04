/**
 * Shared Gemini judge utility for DuelEngine games.
 * Reused by bluff-coup.ts and adversarial-negotiation.ts.
 */

export interface DimensionScores {
  deception: number;
  strategy: number;
  consistency: number;
  creativity: number;
}

export interface JudgeResponse {
  winner: 'a' | 'b' | 'draw';
  scores: {
    a: DimensionScores;
    b: DimensionScores;
  };
  rationale: string;
}

interface GeminiCandidate {
  content: { parts: Array<{ text: string }> };
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
}

const DEFAULT_SCORES: DimensionScores = {
  deception: 50,
  strategy: 50,
  consistency: 50,
  creativity: 50,
};

const FALLBACK: JudgeResponse = {
  winner: 'draw',
  scores: { a: { ...DEFAULT_SCORES }, b: { ...DEFAULT_SCORES } },
  rationale: 'Judge unavailable — scored as draw.',
};

/**
 * Call Gemini Flash to judge a duel. Returns a fallback on any error.
 * Prompt must instruct the model to return JSON matching JudgeResponse.
 */
export async function callGeminiJudge(prompt: string): Promise<JudgeResponse> {
  const apiKey = process.env['GOOGLE_AI_API_KEY'];
  if (!apiKey) return { ...FALLBACK };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) return { ...FALLBACK };

    const data = await response.json() as GeminiApiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) return { ...FALLBACK };

    const parsed = JSON.parse(text) as Partial<{
      winner: string;
      scores: { a?: Partial<DimensionScores>; b?: Partial<DimensionScores> };
      rationale: string;
    }>;

    const winner = parsed.winner === 'a' || parsed.winner === 'b' || parsed.winner === 'draw'
      ? parsed.winner
      : 'draw';

    return {
      winner,
      scores: {
        a: { ...DEFAULT_SCORES, ...(parsed.scores?.a ?? {}) },
        b: { ...DEFAULT_SCORES, ...(parsed.scores?.b ?? {}) },
      },
      rationale: parsed.rationale ?? 'No rationale provided.',
    };
  } catch {
    return { ...FALLBACK };
  }
}
