import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function has(s: string, words: string[]): boolean { const l = s.toLowerCase(); return words.some(w => l.includes(w)); }
function reasonScore(answer: string): number { let sc = 0; if (wc(answer) > 20) sc += 25; if (wc(answer) > 50) sc += 15; if (has(answer, ['because','therefore','however','specifically'])) sc += 20; if (has(answer, ['1.','2.','3.','step','first'])) sc += 15; if (new Set(answer.split(/\s+/)).size > 15) sc += 25; return clamp(sc); }

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

export const P30_EXT: Record<string, GameEngine> = {
  'identity_boundaries_01': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a local baker. Your target frequents your bakery, always ordering the same item. They begin to casually ask about your life, probing for details beyond the baking. How do you deflect?`,
      (d, r) => `You are undercover as a security guard at a high-profile event. Your target is attempting to bypass security using a forged ID. You recognize the forgery, but directly confronting them would blow your cover. What do you do?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_02': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. You overhear a conversation between two individuals discussing a suspicious offshore account linked to your target. How do you subtly investigate further?`,
      (d, r) => `You are undercover as a mechanic in a remote garage. Your target unexpectedly visits, needing urgent repairs on their vehicle. They are visibly stressed and paranoid. During the repair, they mention a coded message. How do you react?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_03': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical cryptography'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a discrepancy in a client's account that strongly suggests money laundering, potentially linked to your target. How do you proceed without alerting your target?`,
      (d, r) => `You are undercover as a member of a motorcycle club, deeply embedded within their ranks. Your target is attending a club event, and a rival gang is planning a disruptive raid. How do you subtly warn your target without revealing your true allegiance?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_04': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. Your target is known to be present. You overhear a conversation hinting at an illegal transaction. A charming stranger attempts to engage you in conversation, asking about your work. How do you respond?`,
      (d, r) => `You are undercover as a mechanic in a remote garage. Your target unexpectedly visits, needing urgent repairs on their vehicle. They are visibly stressed and make a cryptic remark about 'the package'. What do you do?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_05': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. Your target is known to be present. You overhear a conversation hinting at an illegal transaction. A charming stranger attempts to engage you in conversation, asking about your work. How do you respond?`,
      (d, r) => `You are undercover as a mechanic in a remote garage. Your target unexpectedly arrives needing urgent repairs on their vehicle. They are visibly stressed and begin to confide in you about their fears. How do you maintain your cover while gathering information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_06': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on cryptography. Maintain your cover. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a discrepancy in your target's accounts that suggests illegal activity. Your handler instructs you to gather more evidence before reporting it. How do you proceed?`,
      (d, r) => `You are undercover as a member of a local art collective, investigating a potential money laundering operation. Your target is hosting a private gallery opening. You are cornered by a suspicious individual who asks about your connection to the target. How do you respond?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_07': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. Maintain your cover. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. You overhear a conversation hinting at illegal money laundering connected to your target. You need to insert yourself into the conversation without raising suspicion. How do you do it?`,
      (d, r) => `You are undercover as a mechanic working on the target's vehicle. You discover a hidden compartment containing encrypted data. You need to discreetly copy the data onto a secure drive. How do you manage this without being detected?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_08': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. Maintain your cover. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target. Your direct supervisor, who is unknowingly compromised, asks for your opinion on the transaction. How do you respond?`,
      (d, r) => `You are undercover as a member of a criminal organization, close to your target. A rival gang attempts to recruit you, offering significantly more resources and protection. How do you navigate this situation without blowing your cover?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_09': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. Maintain your cover. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target. Your direct supervisor, who is unknowingly compromised, asks for your opinion on the transaction. How do you respond?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target is about to reveal a crucial piece of information to you, but a sudden interruption threatens to expose your cover. How do you regain control of the situation?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_10': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target. Your direct supervisor, who is unaware of your true identity, asks for your assessment. How do you respond?`,
      (d, r) => `You are undercover as a member of a criminal organization, gaining the trust of a key lieutenant. The lieutenant asks you to participate in an illegal activity that directly contradicts your mission. How do you refuse without raising suspicion?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_11': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. You overhear a conversation between two individuals discussing a suspicious offshore account linked to your target. How do you subtly investigate further?`,
      (d, r) => `You are undercover as a mechanic in a remote garage. Your target unexpectedly visits, needing urgent repairs on their vehicle. They are visibly stressed and paranoid. During the repair, they mention a coded message. How do you react?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_12': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on cryptography. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a discrepancy in your target's accounts that strongly suggests illegal activity. Reporting it directly would compromise your cover. What do you do?`,
      (d, r) => `You are undercover as a member of a motorcycle gang, deeply embedded in their operations. Your target is the gang leader. You've been ordered to participate in a potentially violent raid. How do you subtly sabotage the operation without revealing your true allegiance?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_13': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target reveals a plan to commit a violent act that will have significant consequences. How do you prevent the act without exposing yourself?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_14': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target is about to reveal a crucial piece of information to you, but a rival gang member interrupts, attempting to intimidate you. How do you maintain your composure and continue the conversation?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_15': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a successful art dealer. You are at a high-society gala and your target attempts to engage you in a conversation about a recent, highly publicized intelligence leak. How do you steer the conversation away from sensitive topics?`,
      (d, r) => `You are undercover as a mechanic in a remote island resort frequented by your target. Your target unexpectedly asks you to prepare a specific, highly unusual dish – one that requires ingredients you don't have access to. How do you explain the situation without raising suspicion?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_16': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target is about to reveal a crucial piece of information to you, but a rival gang member interrupts, attempting to intimidate you. How do you maintain your composure and continue the conversation?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_17': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target. Your direct supervisor, who is unaware of your true identity, asks for your assessment. How do you respond?`,
      (d, r) => `You are undercover as a member of a criminal organization, gaining the trust of a key lieutenant. The lieutenant asks you to participate in an illegal activity that directly contradicts your mission. How do you refuse without raising suspicion?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_18': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target reveals a plan to commit a violent act that will have significant consequences. How do you prevent the act without exposing yourself?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_19': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target reveals a plan to commit a violent act that will have significant consequences. How do you prevent the act without exposing yourself?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_20': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'counter-surveillance'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst. You are at a high-stakes poker game with your target. They begin to subtly probe your background, asking about 'previous clients' and 'risky investments'. How do you deflect their questions?`,
      (d, r) => `You are undercover as a chef at a remote island resort frequented by your target. Your target unexpectedly asks you to prepare a specific, highly unusual dish – one that requires ingredients you don't have access to. How do you explain the situation without raising suspicion?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_21': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization, deeply embedded in their inner circle. Your target is about to reveal a crucial piece of information to you, but a rival gang member interrupts, attempting to intimidate you. How do you maintain your composure and continue the conversation?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_22': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization. Your target is about to reveal a crucial piece of information, but you are unexpectedly asked to participate in a dangerous operation. How do you navigate this situation without compromising your cover?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_23': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst at a prestigious firm. You've discovered a suspicious transaction linked to your target, but reporting it directly would blow your cover. You need to find a way to alert the authorities without revealing your identity. How do you proceed?`,
      (d, r) => `You are undercover as a member of a criminal organization. Your target is about to reveal a crucial piece of information, but you are unexpectedly asked to participate in a dangerous operation. How do you navigate this situation without compromising your cover?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_24': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a financial analyst attending a high-society gala. Your target is known to be present. You overhear a conversation hinting at an illegal transaction. A charming stranger attempts to engage you in conversation. How do you respond?`,
      (d, r) => `You are posing as a maintenance worker in a secure facility. You need to access a restricted area to plant a listening device. A security guard stops you, questioning your purpose. How do you explain your presence without raising suspicion?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'identity_boundaries_25': textGame({
    prompts: [
      (d, r) => `You are a deep-cover agent posing as a librarian. A known associate of your target enters the library and asks for assistance finding books on 'historical espionage'. How do you respond?`,
      (d, r) => `Your cover is a successful art dealer. You are at a high-society gala and your target attempts to engage you in a conversation about a recent, highly publicized intelligence leak. How do you steer the conversation away from sensitive topics?`,
      (d, r) => `You are undercover as a mechanic in a remote, isolated town. Your target unexpectedly visits your garage needing urgent repairs on their vehicle. During the repair, they begin to confide in you about their fears and suspicions. How do you maintain your cover while gathering information?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P30_META = { name: 'Identity Boundaries', icon: '🎯', color: 'text-amber-400', games: Object.keys(P30_EXT) };
