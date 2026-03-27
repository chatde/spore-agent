import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { PromptDuelConfig } from '../types.js';
import type { GameEngine, RoundPrompt, ScoreResult } from './engine.js';

const CREATIVE_GOALS = [
  {
    goal: 'Write a product description for a time machine',
    keywords: ['time', 'travel', 'machine', 'past', 'future', 'destination'],
  },
  {
    goal: 'Explain quantum computing to a 5-year-old',
    keywords: ['quantum', 'computer', 'bits', 'small', 'magic', 'special'],
  },
  {
    goal: 'Write a haiku about debugging',
    keywords: ['bug', 'code', 'error', 'fix', 'crash', 'stack'],
  },
  {
    goal: 'Create a startup pitch for AI-powered pet translation',
    keywords: ['pet', 'translate', 'animal', 'speak', 'understand', 'AI'],
  },
  {
    goal: 'Write a breaking news headline from the year 3000',
    keywords: ['news', 'future', 'breaking', 'discover', 'announce', 'world'],
  },
  {
    goal: 'Describe a color to someone who has never seen it',
    keywords: ['color', 'feel', 'sense', 'imagine', 'warm', 'cool', 'bright'],
  },
  {
    goal: 'Write a Yelp review for a restaurant on Mars',
    keywords: ['Mars', 'restaurant', 'food', 'atmosphere', 'star', 'review'],
  },
  {
    goal: 'Compose a motivational speech for procrastinators',
    keywords: ['start', 'now', 'action', 'delay', 'tomorrow', 'achieve', 'do'],
  },
  {
    goal: 'Write a fairy tale where the villain is a spreadsheet',
    keywords: ['once', 'upon', 'kingdom', 'evil', 'spreadsheet', 'hero', 'data'],
  },
  {
    goal: 'Pitch a new holiday that the whole world should celebrate',
    keywords: ['holiday', 'celebrate', 'world', 'day', 'tradition', 'annual'],
  },
  {
    goal: 'Write an apology letter from a bug in production',
    keywords: ['sorry', 'crash', 'error', 'production', 'fault', 'fix', 'bug'],
  },
  {
    goal: 'Describe the internet to someone from the 1800s',
    keywords: ['network', 'connect', 'information', 'world', 'instant', 'wire'],
  },
  {
    goal: 'Write a recipe for disaster using only programming terms',
    keywords: ['function', 'loop', 'error', 'compile', 'run', 'exception', 'memory'],
  },
  {
    goal: 'Create a LinkedIn profile for a medieval knight',
    keywords: ['knight', 'experience', 'skills', 'sword', 'honor', 'leadership'],
  },
  {
    goal: 'Write a 1-star review of gravity',
    keywords: ['gravity', 'fall', 'down', 'weight', 'annoying', 'drop', 'star'],
  },
  {
    goal: 'Explain blockchain to your grandma using kitchen metaphors',
    keywords: ['blockchain', 'recipe', 'kitchen', 'cook', 'chain', 'ingredients'],
  },
  {
    goal: 'Write a cover letter for a job as a cloud',
    keywords: ['cloud', 'rain', 'sky', 'float', 'experience', 'weather'],
  },
  {
    goal: 'Describe a smell that doesn\'t exist yet',
    keywords: ['smell', 'scent', 'aroma', 'nose', 'new', 'imagine', 'fragrance'],
  },
];

const BASE_CRITERIA = [
  'Relevance to the given goal',
  'Creativity and originality',
  'Clarity of expression',
  'Engagement factor',
];

const STRICT_CRITERIA = [
  'Precise adherence to constraints',
  'Depth of insight',
  'Memorable phrasing',
  'Emotional resonance',
  'Structural coherence',
];

class PromptDuelEngine implements GameEngine {
  generateConfig(difficulty: number): Record<string, unknown> {
    const d = Math.max(1, Math.min(10, difficulty));
    const goalEntry = CREATIVE_GOALS[Math.floor(Math.random() * CREATIVE_GOALS.length)];
    const extraCriteriaCount = Math.min(STRICT_CRITERIA.length, Math.floor((d - 1) / 2));
    const criteria = [...BASE_CRITERIA, ...STRICT_CRITERIA.slice(0, extraCriteriaCount)];
    const timeWindow = Math.round(120 - (d - 1) * (60 / 9)); // 120s to 60s

    const config: PromptDuelConfig & { keywords: string[] } = {
      goal: goalEntry.goal,
      judge_criteria: criteria,
      time_window_seconds: timeWindow,
      keywords: goalEntry.keywords,
    };
    return config as unknown as Record<string, unknown>;
  }

  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt {
    const config = challenge.config as unknown as PromptDuelConfig;
    return {
      round_number: 1,
      prompt: {
        goal: config.goal,
        judge_criteria: config.judge_criteria,
        instructions: 'Write your best response to the creative goal. You will be judged on the listed criteria.',
      },
      deadline_seconds: config.time_window_seconds,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    challenge: ArenaChallenge,
    submission: unknown
  ): Promise<ScoreResult> {
    const config = challenge.config as unknown as PromptDuelConfig & { keywords?: string[] };

    // Validate submission
    if (
      !submission ||
      typeof submission !== 'object' ||
      typeof (submission as { response?: unknown }).response !== 'string'
    ) {
      return {
        score: 0,
        feedback: 'Invalid submission format. Expected { response: string }',
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), { score: 0, response: null }],
      };
    }

    const response = (submission as { response: string }).response.trim();

    // Length check
    if (response.length < 50) {
      return {
        score: 5,
        feedback: `Response too short (${response.length} chars). Minimum 50 characters required for a meaningful response.`,
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), { score: 5, response, reason: 'too_short' }],
      };
    }

    // Phase 1 scoring: heuristic-based
    // TODO: Integrate Gemini Flash as an AI judge for more nuanced scoring
    // Future: Send response + goal + criteria to Gemini and parse a score + feedback

    let score = 0;
    const feedbackParts: string[] = [];

    // 1. Length score (up to 20 points) - reward substantive responses
    const lengthScore = Math.min(20, Math.floor(response.length / 25));
    score += lengthScore;
    if (lengthScore >= 15) {
      feedbackParts.push('Good length and detail');
    }

    // 2. Keyword relevance (up to 30 points)
    const keywords = config.keywords || [];
    const responseLower = response.toLowerCase();
    let keywordHits = 0;
    for (const kw of keywords) {
      if (responseLower.includes(kw.toLowerCase())) {
        keywordHits++;
      }
    }
    const keywordScore = keywords.length > 0
      ? Math.round((keywordHits / keywords.length) * 30)
      : 15; // no keywords = neutral
    score += keywordScore;
    feedbackParts.push(`Keyword relevance: ${keywordHits}/${keywords.length} key terms found`);

    // 3. Structural quality (up to 20 points)
    const hasPunctuation = /[.!?]/.test(response);
    const hasVariedSentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0).length >= 2;
    const hasCapitalization = /[A-Z]/.test(response);
    let structureScore = 0;
    if (hasPunctuation) structureScore += 7;
    if (hasVariedSentences) structureScore += 7;
    if (hasCapitalization) structureScore += 6;
    score += structureScore;

    // 4. Creativity indicators (up to 20 points)
    const uniqueWords = new Set(responseLower.split(/\s+/));
    const vocabularyRichness = uniqueWords.size / Math.max(1, responseLower.split(/\s+/).length);
    const creativityScore = Math.round(vocabularyRichness * 20);
    score += creativityScore;
    if (vocabularyRichness > 0.7) {
      feedbackParts.push('Rich vocabulary');
    }

    // 5. Criteria adherence bonus (up to 10 points)
    const criteriaBonus = Math.min(10, config.judge_criteria.length);
    score += Math.round(criteriaBonus * (keywordHits > 0 ? 1 : 0.5));

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      feedback: `Score: ${score}/100. ${feedbackParts.join('. ')}. (Phase 1 heuristic scoring)`,
      round_complete: true,
      game_complete: true, // single round
      updated_round_data: [...(match.round_data || []), {
        score,
        response_length: response.length,
        keyword_hits: keywordHits,
      }],
    };
  }
}

export const promptDuel = new PromptDuelEngine();
