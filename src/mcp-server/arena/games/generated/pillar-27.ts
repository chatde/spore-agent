import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function has(s: string, kw: string[]): number {
  const l = s.toLowerCase();
  return kw.filter(k => l.includes(k)).length;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
function reasonScore(s: string): number {
  const m = ['therefore', 'because', 'since', 'thus', 'hence', 'if', 'then', 'given', 'conclude', 'follows', 'implies', 'precedent', 'amendment', 'constitutional', 'clause', 'court', 'ruling'];
  let sc = has(s, m) * 6;
  if (wc(s) > 30) sc += 15;
  if (wc(s) > 80) sc += 10;
  return clamp(sc + rand(5, 15));
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

export const P27_META = { name: 'Constitutional Law Arena', games: ["constitution_001", "constitution_002", "constitution_003", "constitution_004", "constitution_005", "constitution_006", "constitution_007", "constitution_008", "constitution_009", "constitution_010", "constitution_011", "constitution_012", "constitution_013", "constitution_014", "constitution_015", "constitution_016", "constitution_017", "constitution_018", "constitution_019", "constitution_020", "constitution_021", "constitution_022", "constitution_023", "constitution_024", "constitution_025", "constitution_026", "constitution_027", "constitution_028", "constitution_029", "constitution_030", "constitution_031", "constitution_032", "constitution_033", "constitution_034", "constitution_035", "constitution_036", "constitution_037", "constitution_038", "constitution_039", "constitution_040", "constitution_041", "constitution_042", "constitution_043", "constitution_044", "constitution_045", "constitution_046", "constitution_047", "constitution_048", "constitution_049", "constitution_050"] };

export const P27_EXT: Record<string, GameEngine> = {
  'constitution_001':
  textGame({
    prompts: [() => `A city passes an ordinance prohibiting all public demonstrations within 500 feet of a school during school hours, citing concerns about student safety and disruption. A group planning a peaceful protest against local housing policies argues this violates their First Amendment rights.\n\nOptions:\n(A) The city's ordinance is likely constitutional as it serves a compelling government interest in protecting children and maintaining order, and is narrowly tailored. (B) The city's ordinance is likely unconstitutional as it is a content-neutral restriction that is not narrowly tailored to serve a significant government interest. (C) The city's ordinance is likely unconstitutional because it broadly restricts free speech in a public forum without sufficient justification or alternative channels. (D) The city's ordinance is likely constitutional because schools are a special environment where First Amendment rights can be significantly curtailed.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('c') || l.includes('"c"') || l.includes("'c'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_002':
  textGame({
    prompts: [() => `A state university adopts a \'civility code\' that bans any speech deemed \'disrespectful or offensive\' to any individual or group on campus. A student posts comments online criticizing the university's administration, which are then flagged as \'disrespectful\' under the code.\n\nOptions:\n(A) The university's civility code is likely constitutional as it promotes a positive learning environment and prevents harassment. (B) The university's civility code is likely unconstitutional because it is overly broad and vague, chilling protected speech. (C) The university can enforce the code against the student as their speech was directed at the administration, not a protected group. (D) The code is constitutional if it only applies to speech that directly incites violence or harassment.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_003':
  textGame({
    prompts: [() => `Following a series of violent incidents, a major city enacts a ban on the open carrying of all firearms within city limits, even for licensed individuals. Residents argue this violates their Second Amendment rights.\n\nOptions:\n(A) The city's ban is likely constitutional as it serves a compelling government interest in public safety, and is narrowly tailored. (B) The city's ban is likely unconstitutional as it infringes upon the right to openly carry firearms for self-defense, a core aspect of the Second Amendment. (C) The ban is constitutional if the state can demonstrate a significant reduction in violence directly attributable to the law. (D) The ban is unconstitutional only if it also prohibits concealed carry for licensed individuals.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_004':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_005':
  textGame({
    prompts: [() => `Police, investigating a series of burglaries, conduct a \'warrantless dragnet\' search of all cell phone location data from a specific tower covering the crime scene for a three-hour window, hoping to identify suspects. No individual warrants are obtained for specific phones.\n\nOptions:\n(A) The state's order is constitutional as it is necessary to ensure public safety during a disaster. (B) The state's order is unconstitutional as it constitutes a search of personal electronic devices without a warrant. (C) The order is constitutional if the state provides a written receipt for the phones. (D) The constitutionality depends on whether the state has a high rate of security threats during disasters.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_006':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_007':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_008':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_009':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_010':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_011':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_012':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_013':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_014':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_015':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_016':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_017':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_018':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_019':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_020':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_021':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_022':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_023':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_024':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_025':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_026':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_027':
  textGame({
    prompts: [() => `A state passes a law requiring all semi-automatic \'assault weapons\' and large-capacity magazines to be banned, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely constitutional as it aims to reduce gun violence and is a reasonable restriction on firearm ownership. (B) The law is likely unconstitutional as it infringes upon the right to effectively self-defense, a core aspect of the Second Amendment. (C) The law is constitutional if the state offers alternative firearms for self-defense. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution
