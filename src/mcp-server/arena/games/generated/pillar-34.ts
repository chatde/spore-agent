// Auto-generated — Pillar 34: Strategic Inaction (25 games)
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


export const P34_EXT: Record<string, GameEngine> = {
  'strategic_inaction_02': textGame({
    prompts: [
      (d, r) => `A volatile colleague is baiting you into an argument in a public meeting. Choose to remain silent.`,
      (d, r) => `You discover a minor error in a project that will likely correct itself without intervention. Choose to withhold comment.`,
      (d, r) => `A competitor is making a public mistake. Choose to offer no critique or correction.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_06': textGame({
    prompts: [
      (d, r) => `Assess a high-tension negotiation where the opponent is bluffing; choose the exact moment to cease communication to force their hand.`,
      (d, r) => `Analyze a corporate crisis where internal panic is peaking; draft a strategy for 'strategic silence' to prevent premature, damaging statements.`,
      (d, r) => `Evaluate a competitive gaming scenario where your opponent is baiting a reaction; describe how withholding your signature move secures the win.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_01': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* approaching a velvet rope, but doesn't appear to intend to cross it. They are just looking intent`,
      (d, r) => `{'round': 2, 'challenge': "You overhear a colleague spreading a minor, inaccurate rumor about another coworker. It's not malicious, just slightly off. Do you:", 'options': ['Immediately correct your c`,
      (d, r) => `{'round': 3, 'challenge': 'You are leading a project. A team member suggests a new feature that, while interesting, is outside the project scope and would likely delay the deadline. Do you:', 'options`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_03': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, occasionally glancing at the exit. They haven't touched anything. What `,
      (d, r) => `{'round': 2, 'challenge': 'You are a project manager. A team member is consistently delivering work that is *almost* on time, but contains minor errors. Correcting these errors takes you significant t`,
      (d, r) => `{'round': 3, 'challenge': "You are a diplomat negotiating a delicate treaty. The opposing negotiator makes a provocative statement, clearly intended to elicit a strong reaction. You believe it's a tac`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_04': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable sculpture, occasionally glancing at the emergency exit. They haven't touched `,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but showing little initiative. Morale i`,
      (d, r) => `{'round': 3, 'challenge': "You are a financial analyst. You've identified a potential market anomaly that *could* indicate an impending crash, but the data is ambiguous and historical patterns are inc`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_05': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* approaching a velvet rope, but doesn't seem malicious. They are just…curious.  What do you do? (D`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is *almost* on target, but requires minor revisions.  You know they are highly motivated and le`,
      (d, r) => `{'round': 3, 'challenge': "You are a diplomat negotiating a delicate treaty. The opposing negotiator makes a subtly insulting remark about your country's history. It's likely unintentional, but could `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_07': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *very* closely examining a priceless vase, but isn't touching it. Your instructions are to intervene if th`,
      (d, r) => `{'round': 2, 'challenge': "You are a financial advisor. A client is passionately advocating for investing heavily in a 'hot' new cryptocurrency based on a friend's tip.  You've researched it and belie`,
      (d, r) => `{'round': 3, 'challenge': 'You are the captain of a ship navigating through dense fog. Your first mate insists on increasing speed to reach the destination faster, despite reduced visibility. You know`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_08': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'You are a security guard monitoring a seemingly empty office building at 3 AM. A single door is slightly ajar. Your instructions are to investigate *any* unusual activity. W`,
      (d, r) => `{'round': 2, 'challenge': "You are the captain of a small fishing boat. Your radar detects a large, unidentified object rapidly approaching. It's moving too fast to be another boat, but too slow to be`,
      (d, r) => `{'round': 3, 'challenge': 'You are a lead negotiator in a hostage situation. The hostage taker has made several demands, but is also exhibiting signs of extreme emotional distress and erratic behavior`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_09': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *very* closely examining a priceless vase, but isn't touching it. Your instructions are to intervene if th`,
      (d, r) => `{'round': 2, 'challenge': "You are a financial advisor. A client is convinced a 'hot stock tip' from a friend will make them rich. The stock is highly speculative and likely a scam. They are about to `,
      (d, r) => `{'round': 3, 'challenge': 'You are the captain of a spaceship. Your sensors detect a distress signal from a derelict vessel. Approaching to investigate will divert you significantly from your primary `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_10': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it, but their gaze is fixe`,
      (d, r) => `{'round': 2, 'challenge': "You overhear two colleagues whispering intensely near the coffee machine. You can't make out the words, but their body language suggests a disagreement. Your boss is out of `,
      (d, r) => `{'round': 3, 'challenge': "You are leading a project team. A junior member proposes a solution that you know, based on past experience, will ultimately fail, but they are very enthusiastic and haven't`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_11': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it, but their gaze is fixe`,
      (d, r) => `{'round': 2, 'challenge': "You overhear a colleague spreading a rumor about another coworker. The rumor is potentially damaging, but not immediately actionable (e.g., it doesn't involve illegal activi`,
      (d, r) => `{'round': 3, 'challenge': 'You are a project manager. A team member is consistently delivering work that is *almost* on time, but always requires minor revisions. They are visibly stressed and working`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_12': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it. Do you intervene?", 'o`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but not exceeding expectations. They ar`,
      (d, r) => `{'round': 3, 'challenge': "You are a financial analyst. You've identified a potential market anomaly that *could* lead to a significant profit, but it's highly speculative and carries a substantial ri`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_13': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it. Do you intervene?", 'o`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but not exceeding expectations. They ar`,
      (d, r) => `{'round': 3, 'challenge': "You are a financial analyst. You've identified a potential market anomaly that *could* lead to a significant profit, but it's highly speculative and carries a substantial ri`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_14': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it, but their gaze is fixe`,
      (d, r) => `{'round': 2, 'challenge': 'You are a negotiator in a hostage situation. The hostage taker has made several demands, but is also exhibiting signs of extreme emotional distress and is rambling incoheren`,
      (d, r) => `{'round': 3, 'challenge': 'You are the captain of a ship navigating through dense fog. Your radar detects a large object directly ahead, but its identity is unclear. Your crew is urging you to immedia`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_15': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You overhear a coworker spreading a minor, inaccurate rumor about you. It's slightly annoying but doesn't impact your work or reputation. What do you do?", 'options': ['Conf`,
      (d, r) => `{'round': 2, 'challenge': "A project you're leading is slightly behind schedule, but the team is working hard and morale is high. A senior executive asks for a detailed explanation of the delay and su`,
      (d, r) => `{'round': 3, 'challenge': "You discover a minor error in a report that has already been distributed to a large group. The error doesn't significantly impact the overall conclusions, and correcting it `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_16': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it, but their gaze is fixe`,
      (d, r) => `{'round': 2, 'challenge': 'You are a project manager. A team member is consistently delivering work that is *almost* on time, but always requires minor revisions. They are visibly stressed and working`,
      (d, r) => `{'round': 3, 'challenge': "You are a diplomat negotiating a delicate treaty. The opposing negotiator makes a provocative statement designed to elicit a strong reaction. You believe it's a tactic to de`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_17': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it. Do you intervene?", 'o`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but not exceeding expectations. They ar`,
      (d, r) => `{'round': 3, 'challenge': "You are a diplomat negotiating a delicate treaty. The opposing negotiator makes a minor, seemingly insignificant concession that slightly benefits your side, but also subtly`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_18': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it. Do you intervene?", 'o`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but not exceeding expectations. They ar`,
      (d, r) => `{'round': 3, 'challenge': "You are a financial analyst. You've identified a potential market anomaly that *could* lead to a significant profit, but it's highly speculative and carries a substantial ri`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_19': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it, but their gaze is fixe`,
      (d, r) => `{'round': 2, 'challenge': "You are a negotiator in a hostage situation. The captor has made several demands, but is also exhibiting signs of extreme emotional distress and is rambling incoherently. Th`,
      (d, r) => `{'round': 3, 'challenge': 'You are the captain of a ship navigating through dense fog. Your radar detects a large object directly ahead, but its identity is unclear. Your crew is urging you to immedia`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_20': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* approaching a velvet rope, but doesn't seem malicious. They are just…curious.  What do you do? (D`,
      (d, r) => `{'round': 2, 'challenge': "You overhear a coworker complaining loudly about a project deadline to another coworker. The complaint is valid, but the complaining is disruptive to the office. Your boss i`,
      (d, r) => `{'round': 3, 'challenge': "You are a captain of a ship navigating through dense fog. Your radar detects a small, unidentified vessel directly ahead, but it's moving very slowly and appears to be drift`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_21': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* approaching a velvet rope, but doesn't seem malicious. They are just…curious.  What do you do? (D`,
      (d, r) => `{'round': 2, 'challenge': "You overhear a coworker spreading a minor, inaccurate rumor about another colleague. It's annoying, but not damaging to anyone's career or reputation.  You are close friends`,
      (d, r) => `{'round': 3, 'challenge': "You are a captain of a small fishing boat. A sudden, localized fog bank rolls in, reducing visibility to near zero. Your crew is anxious to continue fishing, as they are clo`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_22': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* approaching a velvet rope, but doesn't seem malicious. They are just…curious.  What do you do? (D`,
      (d, r) => `{'round': 2, 'challenge': "You overhear a coworker spreading a minor, inaccurate rumor about another colleague. It's annoying, but not damaging to anyone's career or reputation.  You are in a meeting `,
      (d, r) => `{'round': 3, 'challenge': "You are a captain of a ship navigating through dense fog. Your first mate insists on increasing speed to reach the destination faster, despite your gut feeling it's too risk`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_23': textGame({
    prompts: [
      (d, r) => `A minor disagreement arises with a colleague. Responding could escalate the situation, but ignoring it might be perceived as passive. What is the most strategically inactive course of action?`,
      (d, r) => `You identify a potential inefficiency in a process, but addressing it would require significant effort and might disrupt established workflows.  What is the most strategically inactive response?`,
      (d, r) => `A competitor launches a slightly inferior product with aggressive marketing. Reacting defensively could trigger a price war. What is the most strategically inactive approach?`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_24': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You overhear a coworker spreading a minor, inaccurate rumor about you. It's slightly annoying but doesn't impact your work or reputation. What do you do?", 'options': ['Conf`,
      (d, r) => `{'round': 2, 'challenge': 'A project is falling behind schedule, and a team member is suggesting a radical, untested solution that could potentially fix things quickly, but also carries a significant `,
      (d, r) => `{'round': 3, 'challenge': "You discover a minor error in a report that has already been sent to a client. The error doesn't affect the overall conclusions or recommendations, and correcting it now mig`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'strategic_inaction_25': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "You are a security guard monitoring a museum exhibit. A visitor is *slowly* circling a valuable vase, looking at it intently. They haven't touched it. Do you intervene?", 'o`,
      (d, r) => `{'round': 2, 'challenge': "You are a project manager. A team member is consistently delivering work that is 'good enough' but not exceptional, meeting deadlines but not exceeding expectations. They ar`,
      (d, r) => `{'round': 3, 'challenge': "You are a diplomat negotiating a delicate treaty. The opposing negotiator makes a minor, seemingly insignificant, verbal misstep that *could* be interpreted as an insult. It`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P34_META = { name: 'Strategic Inaction', icon: '🎯', color: 'text-amber-400', games: Object.keys(P34_EXT) };