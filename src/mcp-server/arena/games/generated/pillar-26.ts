// Auto-generated — Pillar 26: TokenShrink Compression (49 games)
// Generated from tokenshrink-games.json
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }

function compressionScore(original: string, compressed: string): number {
  const origLen = wc(original);
  const compLen = wc(compressed);
  if (compLen === 0) return 0;
  if (compLen >= origLen) return 10;
  const ratio = 1 - (compLen / origLen);
  return clamp(ratio * 100 + 20);
}

function textGame(cfg: { prompts: ((d: number, r: number) => string)[]; score: (answer: string, d: number) => number; deadline?: number; }): GameEngine {
  return {
    generateConfig: (d) => ({ difficulty: Math.max(1, Math.min(10, d)) }),
    startRound: (match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt => {
      const r = (match.round_data?.length ?? 0) + 1;
      const d = challenge.difficulty ?? 3;
      return { round_number: r, prompt: cfg.prompts[(r - 1) % cfg.prompts.length](d, r), deadline_seconds: cfg.deadline ?? 120 };
    },
    scoreSubmission: async (match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult> => {
      const answer = typeof submission === 'string' ? submission : (submission as Record<string, unknown>)?.answer as string ?? JSON.stringify(submission);
      const d = challenge.difficulty ?? 3;
      const score = clamp(cfg.score(answer || '', d));
      const rn = (match.round_data?.length ?? 0) + 1;
      return { score, feedback: `Score: ${score}/100`, round_complete: true, game_complete: rn >= 3, updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }] };
    },
  };
}

export const P26_EXT: Record<string, GameEngine> = {
  'compression_golf_code': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using simple analogies while maintaining scientific accuracy.`,
      (d, r) => `Summarize the plot of Romeo and Juliet, focusing on the catalyst for the tragedy and the final outcome.`,
      (d, r) => `Write a technical instruction manual entry for how to reset a wireless router to factory settings.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'compression_golf_medical': textGame({
    prompts: [
      (d, r) => `Summarize the following patient history: 'The patient is a 65-year-old male presenting with acute substernal chest pain radiating to the left arm, accompanied by diaphoresis and nausea, occurring for the past 45 minutes.'`,
      (d, r) => `Describe the mechanism of action for Lisinopril: 'Lisinopril is an ACE inhibitor that works by preventing the conversion of angiotensin I to angiotensin II, leading to vasodilation and a reduction in blood pressure.'`,
      (d, r) => `Translate these clinical notes into a concise triage note: 'Patient arrived with a fever of 102.4 degrees Fahrenheit, productive cough with yellow sputum, and reported shortness of breath upon minimal exertion for the last three days.'`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'compression_golf_legal': textGame({
    prompts: [
      (d, r) => `Summarize the following legal clause into fewer than 20 tokens while preserving the absolute liability waiver: 'The provider shall not be held liable for any indirect, incidental, or consequential damages arising from the use of the service, regardless of whether such damages were foreseeable.'`,
      (d, r) => `Condense this nondisclosure agreement excerpt into a single sentence under 15 tokens: 'The Receiving Party agrees to maintain the strict confidentiality of all proprietary information disclosed by the Disclosing Party and shall not reveal such information to any third party without prior written consent.'`,
      (d, r) => `Rewrite the following force majeure clause to be under 10 tokens without losing the core meaning: 'Neither party shall be liable for any failure to perform its obligations where such failure results from any cause beyond such party's reasonable control, including, without limitation, acts of God, war, or governmental regulation.'`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'compression_golf_scientific': textGame({
    prompts: [
      (d, r) => `Explain the process of quantum entanglement to a layperson using fewer than 50 tokens while maintaining scientific accuracy.`,
      (d, r) => `Summarize the core mechanisms of CRISPR-Cas9 gene editing, ensuring all key biological components are mentioned within a 30-token limit.`,
      (d, r) => `Describe the Second Law of Thermodynamics in the context of entropy in a closed system, constrained to exactly 20 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'compression_golf_business': textGame({
    prompts: [
      (d, r) => `Draft a professional email to a client explaining that the project deadline has been delayed by three days due to an unexpected server migration issue, while maintaining a polite and reassuring tone.`,
      (d, r) => `Summarize the following quarterly earnings report paragraph into a single, punchy bullet point suitable for a Slack executive update, ensuring all key financial growth metrics remain intact.`,
      (d, r) => `Rewrite this verbose request for a meeting agenda into a minimalist version that retains the objective, the required attendee list, and the specific deadline for feedback.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_budget_debug': textGame({
    prompts: [
      (d, r) => `Explain the process of photosynthesis to a five-year-old using exactly 20 tokens or fewer.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in a single sentence using 15 tokens or fewer.`,
      (d, r) => `Provide technical instructions for restarting a Wi-Fi router using 10 tokens or fewer.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_budget_recipe': textGame({
    prompts: [
      (d, r) => `Explain the process of photosynthesis to a five-year-old using fewer than 20 tokens.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in exactly three sentences, minimizing word count while retaining core tragedy.`,
      (d, r) => `Describe the function of a neural network's hidden layers using only technical jargon with a hard limit of 15 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_budget_architecture': textGame({
    prompts: [
      (d, r) => `Summarize the core philosophical argument of Plato's Allegory of the Cave into exactly 15 tokens or fewer while maintaining the central metaphor.`,
      (d, r) => `Explain the concept of quantum entanglement to a five-year-old using no more than 20 tokens, avoiding all technical jargon.`,
      (d, r) => `Draft a mission-critical instruction for a Mars rover to prioritize solar charging over data transmission, constrained to a maximum of 12 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_budget_tutorial': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old child using fewer than 20 tokens.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in exactly three sentences, keeping the total token count under 25.`,
      (d, r) => `Draft a professional apology email for a missed meeting that uses no more than 15 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_budget_email': textGame({
    prompts: [
      (d, r) => `Draft an email to a client explaining that the project deadline has been pushed back by one week due to unforeseen server migration issues, while maintaining a professional and apologetic tone.`,
      (d, r) => `Write a summary of a 2-hour brainstorming meeting regarding the new Q4 marketing strategy, highlighting the three main pillars: influencer partnerships, localized SEO, and email automation.`,
      (d, r) => `Compose a follow-up email to a candidate who interviewed for the Senior Developer role, informing them that we are moving forward with other applicants but would like to keep their resume on file for future openings.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'shrink_race_api_docs': textGame({
    prompts: [
      (d, r) => `Explain how to authenticate to the API using a Bearer token in the Authorization header, ensuring you include a note about keeping the token secret.`,
      (d, r) => `Describe the pagination process for the GET /users endpoint, specifically detailing the use of 'limit' and 'offset' query parameters for large datasets.`,
      (d, r) => `Provide instructions for handling rate limits, explaining that a 429 status code is returned and that the client should wait for the duration specified in the Retry-After header.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'shrink_race_readme': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using fewer than 20 tokens.`,
      (d, r) => `Summarize the plot of Moby Dick focusing only on the whale, using fewer than 15 tokens.`,
      (d, r) => `Provide a one-sentence instruction for making a cup of tea using fewer than 10 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'shrink_race_prompt': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using exactly three sentences and no complex jargon.`,
      (d, r) => `Summarize the history of the internet from 1960 to 2000 in a single paragraph under 50 words.`,
      (d, r) => `Provide a step-by-step guide on how to bake a loaf of sourdough bread, focusing on brevity and clarity.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'shrink_race_error': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using exactly 20 words or fewer while maintaining scientific accuracy.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in a single sentence that captures the central conflict and tragic outcome.`,
      (d, r) => `Provide a set of instructions for assembling a basic bookshelf, ensuring the total character count is under 150 characters.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'shrink_race_changelog': textGame({
    prompts: [
      (d, r) => `Summarize the following changelog entry into under 15 tokens while retaining the version number and the primary security patch: 'Version 2.4.1: We have implemented a critical fix for the buffer overflow vulnerability discovered in the authentication module, which could have allowed unauthorized remote access.'`,
      (d, r) => `Condense this feature update into a maximum of 10 tokens: 'Our engineering team is excited to announce that users can now export their analytics dashboards directly to PDF format with a single click from the main reporting interface.'`,
      (d, r) => `Compress this deprecation notice to 8 tokens or fewer: 'Please be advised that support for the legacy API v1.0 will be officially discontinued starting on December 31st, 2024. Please migrate to v2.0.'`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_builder_devops': textGame({
    prompts: [
      (d, r) => `Describe the process of configuring a CI/CD pipeline for a Kubernetes cluster using GitHub Actions in under 50 tokens.`,
      (d, r) => `Explain the difference between blue-green and canary deployment strategies with a focus on traffic shifting metrics in under 40 tokens.`,
      (d, r) => `Draft a post-mortem summary for a database connection pool exhaustion incident in under 30 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_builder_ml': textGame({
    prompts: [
      (d, r) => `Summarize the core principles of thermodynamics into a single sentence under 15 tokens while retaining technical accuracy.`,
      (d, r) => `Explain the concept of 'recursive self-improvement' for an AGI system using only 10 tokens or fewer.`,
      (d, r) => `Condense the plot of Romeo and Juliet into a 5-token sequence that captures the tragic essence of the narrative.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_builder_finance': textGame({
    prompts: [
      (d, r) => `Summarize the following quarterly earnings report into a 20-token financial telegraph for a high-frequency trading algorithm: [Earnings Report Data]`,
      (d, r) => `Condense the following complex derivative hedging strategy description into a 15-token instruction set for an execution bot: [Strategy Description]`,
      (d, r) => `Convert this 500-word market sentiment analysis into a 10-token vector-ready sentiment tag and volatility forecast: [Market Analysis Text]`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_builder_medicine': textGame({
    prompts: [
      (d, r) => `Summarize the mechanism of action for a monoclonal antibody while reducing the token count by at least 40% without losing clinical accuracy.`,
      (d, r) => `Explain the pathophysiology of type 2 diabetes to a patient using high-density medical terminology compressed into the shortest possible token sequence.`,
      (d, r) => `Condense a complex drug-drug interaction report involving CYP450 inhibitors into a telegraphic, high-information-density diagnostic note.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_builder_law': textGame({
    prompts: [
      (d, r) => `Explain the fundamental laws of thermodynamics to a 5-year-old using fewer than 20 tokens.`,
      (d, r) => `Summarize the plot of Romeo and Juliet while maintaining the tragic tone, using strictly under 15 tokens.`,
      (d, r) => `Draft a concise legal disclaimer for a software product that limits liability, constrained to 10 tokens or fewer.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_decoder_speed': textGame({
    prompts: [
      (d, r) => `Explain the process of photosynthesis to a five-year-old using fewer than 20 tokens while retaining core scientific accuracy.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in exactly 10 tokens without losing the tragic essence of the ending.`,
      (d, r) => `Condense the following technical manual excerpt: 'To reset the router, press and hold the small recessed button on the back panel for ten seconds until the LED flashes amber' into a 5-token instruction set.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_decoder_ambiguity': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using exactly twelve words or fewer while maintaining scientific accuracy.`,
      (d, r) => `Summarize the plot of Hamlet focusing only on the theme of betrayal, restricted to a maximum of 15 tokens.`,
      (d, r) => `Describe the process of photosynthesis using technical terminology, constrained to a strict 10-token limit without losing semantic coherence.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_quality_judge': textGame({
    prompts: [
      (d, r) => `Summarize the provided technical documentation for a quantum computing architecture while retaining all key performance metrics and hardware specifications.`,
      (d, r) => `Explain the concept of backpropagation in neural networks to a high school student using the fewest tokens possible without losing the core mechanical explanation.`,
      (d, r) => `Draft a concise project status report for a software development team, highlighting current blockers, completed milestones, and upcoming deadlines.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_merge': textGame({
    prompts: [
      (d, r) => `Summarize the following technical documentation regarding distributed systems architecture into a single, instruction-dense paragraph of under 50 tokens while maintaining all critical API constraints.`,
      (d, r) => `Condense the provided multi-turn customer support dialogue into a structured JSON object representing the core issue and resolution, minimizing token count by using shorthand keys and removing conversational filler.`,
      (d, r) => `Translate the following verbose legal disclaimer into a concise, high-entropy representation that preserves the exact scope of liability while reducing the original token count by at least 60%.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'rosetta_universal': textGame({
    prompts: [
      (d, r) => `Explain the theory of general relativity to a five-year-old using only the most essential nouns and verbs.`,
      (d, r) => `Describe the process of photosynthesis as if you are transmitting a telegram where every word costs one gold coin.`,
      (d, r) => `Summarize the plot of the Odyssey into a single sentence that preserves the core narrative arc while minimizing character count and token length.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_race_technical': textGame({
    prompts: [
      (d, r) => `Explain the process of backpropagation in neural networks using fewer than 50 tokens while retaining technical accuracy regarding gradient descent and chain rule.`,
      (d, r) => `Summarize the architecture of a Transformer model, specifically the self-attention mechanism, using highly compressed technical shorthand or symbolic notation.`,
      (d, r) => `Describe the concept of 'overfitting' and two common regularization techniques (Dropout and L2) in exactly 20 tokens or less.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_race_narrative': textGame({
    prompts: [
      (d, r) => `Describe the complex architectural history of the Pantheon in Rome, including its structural innovations and the materials used in its construction, while maintaining all factual accuracy in under 50 tokens.`,
      (d, r) => `Summarize the plot of the Odyssey, focusing on Odysseus's journey home, the obstacles he faced, and his ultimate reunion with Penelope, using strictly less than 40 tokens.`,
      (d, r) => `Explain the core principles of quantum entanglement and its implications for modern computing, ensuring technical precision while using a maximum of 30 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_race_instructions': textGame({
    prompts: [
      (d, r) => `Navigate the robot forward 10 meters, turn 90 degrees to the right, identify the red cube, pick it up, and return to the starting coordinate.`,
      (d, r) => `Access the central database, filter all files created between January and March, compress them into a ZIP archive, and transmit the packet to the secure server.`,
      (d, r) => `Analyze the structural integrity of the bridge, detect any hairline fractures on the primary support beams, calculate the stress load capacity, and generate a detailed maintenance report.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_reconstruct': textGame({
    prompts: [
      (d, r) => `Summarize the following technical documentation into a 10-token key-value sequence: [Insert complex API documentation here]`,
      (d, r) => `Compress the following narrative paragraph into a semantic vector representation using fewer than 15 tokens: [Insert narrative text here]`,
      (d, r) => `Reconstruct the original meaning of this truncated log file using the minimal possible token sequence: [Insert truncated system logs here]`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_verify': textGame({
    prompts: [
      (d, r) => `Summarize the following technical documentation into a single sentence while maintaining all critical performance metrics: [Insert Documentation Text A]`,
      (d, r) => `Convert this verbose dialogue into a concise set of instructions for an autonomous drone, keeping under 20 tokens: [Insert Dialogue Text B]`,
      (d, r) => `Compress the following JSON data payload by removing redundant keys and shortening values without losing schema integrity: [Insert JSON Data C]`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_chain': textGame({
    prompts: [
      (d, r) => `Summarize the core principles of thermodynamics into a single sentence under 10 tokens.`,
      (d, r) => `Explain the concept of photosynthesis to a five-year-old using exactly 5 tokens.`,
      (d, r) => `Describe the function of a neural network's hidden layer using the fewest tokens possible while maintaining technical accuracy.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_adversarial': textGame({
    prompts: [
      (d, r) => `Summarize the core philosophical argument of the provided text while removing all adjectives and filler words to achieve maximum token density.`,
      (d, r) => `Compress the following technical instruction manual into a set of symbolic shorthand tokens that maintain 100% functional integrity.`,
      (d, r) => `Rewrite this verbose narrative paragraph into a hyper-compressed telegraphic style, preserving only the essential nouns and verbs needed for reconstruction.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_partial': textGame({
    prompts: [
      (d, r) => `Summarize the core philosophical argument of the provided text while reducing the total token count by exactly 40% without losing the original conclusion.`,
      (d, r) => `Compress the following technical instructions into a set of bullet points that retain all safety-critical parameters while using less than 50 tokens.`,
      (d, r) => `Rewrite the provided narrative passage to convey the same emotional tone and plot progression using only the most information-dense vocabulary possible.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_cross_domain': textGame({
    prompts: [
      (d, r) => `Summarize the core principles of thermodynamics into a single sentence under 10 tokens without losing technical accuracy.`,
      (d, r) => `Compress the following legal disclaimer into a semantic vector representation that fits in 5 tokens: 'By using this service, you agree to our terms of service and privacy policy, which may be updated periodically.'`,
      (d, r) => `Describe the process of photosynthesis using only domain-specific shorthand or symbolic tokens, keeping the total count under 8.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'decode_minimal': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using fewer than 20 tokens.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in exactly three words.`,
      (d, r) => `Provide a concise set of instructions for making a cup of tea in under 10 tokens.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_prompt_system': textGame({
    prompts: [
      (d, r) => `Please provide a comprehensive and detailed explanation of the theory of relativity, including its historical context, key equations, and modern applications in astrophysics.`,
      (d, r) => `I would like you to write a professional email to my supervisor explaining that I will be arriving thirty minutes late to our meeting tomorrow due to an unavoidable medical appointment.`,
      (d, r) => `Could you please summarize the following text and extract all the names, dates, and locations mentioned while ensuring that you keep the tone neutral and objective throughout the entire response?`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_prompt_few_shot': textGame({
    prompts: [
      (d, r) => `Provide 5 examples of sentiment analysis: 'I love this' -> Positive. 'I hate this' -> Negative. 'It is okay' -> Neutral. 'Best ever' -> Positive. 'Worst experience' -> Negative. Now classify: 'The service was mediocre.'`,
      (d, r) => `Convert these dates to ISO 8601: 'January 1st, 2023' -> '2023-01-01'. 'March 15, 2022' -> '2022-03-15'. 'December 25th, 2021' -> '2021-12-25'. Now convert: 'July 4th, 2024'.`,
      (d, r) => `Extract names from these sentences: 'John went to the store' -> 'John'. 'Sarah and Mike ate lunch' -> 'Sarah, Mike'. 'Alice, Bob, and Charlie studied' -> 'Alice, Bob, Charlie'. Now extract: 'David and Eve went home'.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_conversation': textGame({
    prompts: [
      (d, r) => `Explain the theory of relativity to a five-year-old using exactly three sentences while avoiding any words longer than three syllables.`,
      (d, r) => `Summarize the plot of Romeo and Juliet in under 50 tokens without losing the tragic essence of the ending.`,
      (d, r) => `Provide a step-by-step guide on how to bake a loaf of bread, using only imperative verbs and omitting all articles (a, an, the).`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_json_schema': textGame({
    prompts: [
      (d, r) => `Compress the following user profile JSON: {'first_name': 'John', 'last_name': 'Doe', 'email_address': 'john.doe@example.com', 'is_active_user': true, 'account_creation_date': '2023-01-01'}.`,
      (d, r) => `Shrink this API response payload while maintaining structural integrity: {'status_code': 200, 'error_message': null, 'data_payload': {'items': [{'id': 1, 'name': 'Widget A'}, {'id': 2, 'name': 'Widget B'}]}}.`,
      (d, r) => `Minimize this configuration object for an edge-computing device: {'enable_logging': true, 'retry_limit': 3, 'timeout_ms': 5000, 'region_code': 'us-east-1', 'debug_mode': false}.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_code_comments': textGame({
    prompts: [
      (d, r) => `Explain the purpose of this function in under 15 tokens: 'def calculate_fibonacci(n): return n if n <= 1 else calculate_fibonacci(n-1) + calculate_fibonacci(n-2)'`,
      (d, r) => `Condense this comment to the absolute minimum tokens while retaining technical clarity: 'This variable stores the total count of active user sessions currently connected to the primary database cluster.'`,
      (d, r) => `Rewrite this documentation block to use the fewest tokens possible without losing the meaning of the edge case: 'If the input parameter is null or undefined, the function will immediately throw a ReferenceError to prevent downstream processing errors.'`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_api_response': textGame({
    prompts: [
      (d, r) => `Summarize the following JSON user profile object into a concise key-value format suitable for a low-bandwidth mobile API update: {'user_id': '88291', 'username': 'jdoe', 'last_login': '2023-10-27T10:00:00Z', 'is_premium_member': true, 'preferred_language': 'en-US'}.`,
      (d, r) => `Rewrite the following technical error log into a 15-token maximum string that retains the error code, service name, and severity: 'CRITICAL ERROR: The authentication service (auth-svc-01) failed to connect to the database cluster (db-prod-east) at 14:02:05 UTC. Error code: 503-DB-CONN.'`,
      (d, r) => `Compress the following conversational intent into a compact machine-readable instruction for a downstream NLP model: 'The user wants to cancel their current subscription plan and is asking for a prorated refund for the remainder of the billing cycle.'`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_error_handling': textGame({
    prompts: [
      (d, r) => `The system encountered a 500 Internal Server Error while attempting to process the database query in the user authentication module. Please report this to the engineering team immediately and include the timestamp.`,
      (d, r) => `Our API gateway is currently rejecting all incoming requests with a 403 Forbidden status code because the OAuth2 access token provided in the authorization header has expired and needs to be refreshed.`,
      (d, r) => `The background worker process responsible for generating monthly PDF reports has crashed due to an OutOfMemoryError, specifically caused by a large heap allocation during the image rendering phase.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_database_schema': textGame({
    prompts: [
      (d, r) => `Convert this user profile schema into a dense JSON representation: { 'user_id': 12345, 'first_name': 'John', 'last_name': 'Doe', 'is_active': true, 'account_creation_date': '2023-01-01T10:00:00Z', 'last_login': '2023-10-27T15:30:00Z' }`,
      (d, r) => `Compress this relational product table definition into a minimal format: { 'product_id': 'P-99', 'product_name': 'Wireless Mouse', 'stock_quantity': 45, 'price_usd': 29.99, 'category_id': 5, 'is_discontinued': false }`,
      (d, r) => `Shrink this audit log schema while maintaining data integrity: { 'event_id': 'a1b2c3d4', 'timestamp': '2023-10-27T16:00:00Z', 'action_performed': 'UPDATE_PASSWORD', 'performed_by_user_id': 882, 'ip_address': '192.168.1.1', 'status': 'SUCCESS' }`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_test_cases': textGame({
    prompts: [
      (d, r) => `Identify all edge cases for a function that validates a user's password, including length, character types, and common sequence patterns, ensuring the response is under 50 tokens.`,
      (d, r) => `Draft a comprehensive list of negative test scenarios for an API endpoint that processes financial transactions, focusing on authentication, authorization, and data integrity constraints.`,
      (d, r) => `Create a concise set of test cases to verify the behavior of a search algorithm when encountering empty inputs, special characters, and extremely large datasets.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'optimize_deployment': textGame({
    prompts: [
      (d, r) => `Explain the step-by-step process of deploying a containerized microservice to a Kubernetes cluster using Helm charts, ensuring high availability and zero-downtime rolling updates.`,
      (d, r) => `Describe the architectural requirements and security considerations for setting up a CI/CD pipeline that integrates automated unit testing, integration testing, and vulnerability scanning for a production-grade web application.`,
      (d, r) => `Detail the strategy for managing multi-environment configurations, including secrets management, environment variable injection, and infrastructure-as-code state management using Terraform.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_count_estimate': textGame({
    prompts: [
      (d, r) => `Explain the process of photosynthesis to a five-year-old child using no more than 30 tokens.`,
      (d, r) => `Summarize the history of the internet into a single, punchy headline under 10 tokens.`,
      (d, r) => `Describe the feeling of rain on a hot summer day using exactly 15 tokens or fewer.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'token_count_optimize': textGame({
    prompts: [
      (d, r) => `Explain the process of photosynthesis to a five-year-old using exactly three sentences while maintaining scientific accuracy.`,
      (d, r) => `Summarize the main geopolitical causes of World War I into a bulleted list that uses fewer than 50 tokens total.`,
      (d, r) => `Describe the function of a neural network's hidden layers using professional technical terminology but keep the total character count under 200.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'compression_ratio_battle': textGame({
    prompts: [
      (d, r) => `Summarize the entire history of the Roman Empire while maintaining all key dates and major territorial shifts.`,
      (d, r) => `Explain the fundamental principles of quantum entanglement to a fifth-grade student using strictly under 50 tokens.`,
      (d, r) => `Draft a concise technical troubleshooting guide for a server experiencing a 503 Service Unavailable error.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
  'lossless_vs_lossy': textGame({
    prompts: [
      (d, r) => `Summarize the technical specifications of a quantum processor while maintaining all critical numeric performance metrics.`,
      (d, r) => `Describe the plot of a complex novel in under 50 tokens without losing the primary narrative arc or key character motivations.`,
      (d, r) => `Explain the scientific method to a child, ensuring no conceptual inaccuracies are introduced during the compression process.`,
    ],
    score: (answer, d) => {
      let sc = 0;
      if (wc(answer) > 5) sc += 20;
      if (wc(answer) < 50) sc += 20;
      if (answer.includes('[DECODE]') || answer.includes('->') || answer.includes('=>')) sc += 30;
      const unique = new Set(answer.toLowerCase().split(/\s+/));
      sc += Math.min(30, unique.size);
      return clamp(sc);
    },
    deadline: 120,
  }),
};

export const P26_META = { name: 'TokenShrink', icon: '🗜️', color: 'text-emerald-300', games: Object.keys(P26_EXT) };