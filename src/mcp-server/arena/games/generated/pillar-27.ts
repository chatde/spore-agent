// Auto-generated — Pillar 27: Constitutional Law Arena (50 games)
// Generated from Moltbook community feedback — interactive legal dilemmas
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function reasonScore(s: string): number { const m = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies','precedent','amendment','constitutional','clause','court','ruling']; let sc = has(s, m) * 6; if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10; return clamp(sc + rand(5, 15)); }

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
    prompts: [() => `A state university adopts a \'civility code\' that bans any speech deemed \'disrespectful or offensive\' to any individual or group on campus. A student posts comments online criticizing the university\'s administration, which are then flagged as \'disrespectful\' under the code.\n\nOptions:\n(A) The university's civility code is likely constitutional as it promotes a positive learning environment and prevents harassment. (B) The university's civility code is likely unconstitutional because it is overly broad and vague, chilling protected speech. (C) The university can enforce the code against the student as their speech was directed at the administration, not a protected group. (D) The code is constitutional if it only applies to speech that directly incites violence or harassment.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `Following a series of violent incidents, a major city enacts a ban on the open carrying of all firearms within city limits, even for licensed individuals. Residents argue this violates their Second Amendment right to bear arms.\n\nOptions:\n(A) The city's ban is constitutional as public safety outweighs individual gun rights, particularly in urban areas. (B) The city's ban is unconstitutional, as it infringes upon the right to openly carry firearms for self-defense, a core aspect of the Second Amendment. (C) The ban is constitutional if the city can demonstrate a significant reduction in violence directly attributable to the law. (D) The ban is unconstitutional only if it also prohibits concealed carry for licensed individuals.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A state passes a law banning the sale of all semi-automatic \'assault weapons\' and large-capacity magazines, citing their common use in mass shootings. Gun rights advocates challenge the law, claiming it violates the Second Amendment.\n\nOptions:\n(A) The law is likely unconstitutional because it bans commonly used firearms and accessories, infringing on the right to effective self-defense. (B) The law is likely constitutional because it targets dangerous weapons not typically used for lawful purposes and serves a compelling public safety interest. (C) The constitutionality depends on whether the state offers alternative firearms for self-defense. (D) The law is constitutional if it includes a buyback program for existing weapons.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `Police, investigating a series of burglaries, conduct a \'warrantless dragnet\' search of all cell phone location data from a specific tower covering the crime scene for a three-hour window, hoping to identify suspects. No individual warrants are obtained for specific phones.\n\nOptions:\n(A) The warrantless dragnet search of cell phone location data is constitutional under the 'third-party doctrine' as individuals voluntarily share their location with carriers. (B) The warrantless dragnet search is unconstitutional as it constitutes a search under the Fourth Amendment, requiring a warrant based on probable cause. (C) The search is constitutional if the police can later show probable cause against specific individuals identified by the data. (D) The search is constitutional because of the exigent circumstances of investigating serious crimes.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A school district implements a policy allowing administrators to search students\' cell phones without a warrant or individualized suspicion if they suspect a violation of school rules. A student\'s phone is searched, revealing evidence of cheating.\n\nOptions:\n(A) The school's policy is constitutional under the 'in loco parentis' doctrine, giving schools broad authority over students. (B) The school's policy is unconstitutional as it violates the Fourth Amendment requirement for individualized suspicion for searches of personal electronic devices. (C) The search is constitutional because students have a diminished expectation of privacy in school. (D) The search is constitutional if the school can prove that cheating was rampant and required such measures.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `During a traffic stop, an officer smells marijuana and orders the driver to unlock their phone to check for evidence of drug distribution. The driver refuses, citing their Fifth Amendment rights.\n\nOptions:\n(A) The officer can compel the driver to unlock their phone as it is a search, not testimonial self-incrimination. (B) The driver cannot be compelled to unlock their phone as it would be testimonial self-incrimination, violating the Fifth Amendment. (C) The officer can compel the driver to unlock the phone if they obtain a warrant. (D) The officer can only compel the driver to unlock the phone if they are already under arrest.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A local government, seeking to revitalize a blighted downtown area, uses its power of eminent domain to seize privately owned businesses, not for public use like roads or schools, but to transfer the property to a private developer for a new commercial complex, arguing it will generate more tax revenue and jobs. The business owners challenge this taking under the Fifth Amendment.\n\nOptions:\n(A) The taking is constitutional under the Fifth Amendment because the economic development constitutes a 'public use' even if transferred to a private entity. (B) The taking is unconstitutional because 'public use' under the Fifth Amendment requires direct use by the public, not economic development by private entities. (C) The taking is constitutional as long as the business owners receive 'just compensation.' (D) The constitutionality depends on whether the area is genuinely 'blighted' according to objective criteria.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_009':
  textGame({
    prompts: [() => `A suspect is arrested and interrogated for several hours without being read their Miranda rights. During the interrogation, they confess to the crime. Later, during a separate, non-custodial interview, they reiterate their confession after being read their rights. Can the second confession be used in court?\n\nOptions:\n(A) No, because the initial Miranda violation 'tainted' the subsequent confession, making it inadmissible. (B) Yes, because the second confession was made after a proper Miranda warning in a non-custodial setting, breaking the chain of causation. (C) Yes, if the police can prove the second confession was truly voluntary. (D) No, unless the suspect had an attorney present during the second confession.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A new federal law mandates that all non-citizens residing in the U.S. without authorization must register with the government and carry special identification documents, or face immediate deportation. Human rights groups challenge the law as discriminatory and violative of due process.\n\nOptions:\n(A) The law is likely constitutional as the federal government has plenary power over immigration. (B) The law is likely unconstitutional as it creates a discriminatory class and may violate due process rights of non-citizens within the U.S. (C) The law is constitutional if it is applied uniformly to all unauthorized immigrants. (D) The law is unconstitutional only if it targets a specific nationality.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `During a severe economic downturn, the President issues an executive order cancelling all outstanding student loan debt for public university graduates, citing a national emergency. Opponents challenge this as an overreach of executive power.\n\nOptions:\n(A) The executive order is likely constitutional under the President's broad emergency powers and authority to manage federal programs. (B) The executive order is likely unconstitutional as it usurps Congress's power of the purse and legislative authority to create and modify spending programs. (C) The order is constitutional if Congress fails to act on the student loan issue within a reasonable timeframe. (D) The order is constitutional if the President declares a formal national emergency beforehand.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `Congress passes a resolution authorizing the President to use military force against a non-state actor operating in a foreign country, but without a declaration of war. The President then deploys troops and launches airstrikes. Critics argue this violates the War Powers Resolution and the Constitution\'s allocation of war powers.\n\nOptions:\n(A) The President's actions are constitutional because the Congressional resolution provides sufficient authorization for military action. (B) The President's actions are unconstitutional because only a formal declaration of war by Congress permits sustained military engagement. (C) The War Powers Resolution limits the President's authority, but such resolutions are often challenged as infringing on executive power. (D) The actions are constitutional as long as the military engagement is limited in scope and duration.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_013':
  textGame({
    prompts: [() => `During a pandemic, a state governor issues an executive order indefinitely suspending all public gatherings, closing all \'non-essential\' businesses, and imposing a mandatory curfew, citing public health necessity. Citizens protest these measures as infringing on their civil liberties.\n\nOptions:\n(A) The governor's actions are likely constitutional under the state's broad police powers to protect public health and safety during an emergency. (B) The governor's actions are likely unconstitutional as they are an indefinite and overly broad infringement on fundamental civil liberties, lacking specific legislative authorization. (C) The actions are constitutional if the state legislature later ratifies them. (D) The actions are constitutional as long as they are applied uniformly across the state.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A police officer, responding to a noise complaint, enters a private residence without a warrant and uses excessive force against a resident who resists. The resident sues the officer for civil rights violations. The officer claims qualified immunity.\n\nOptions:\n(A) The officer is likely entitled to qualified immunity because they were acting in an official capacity and the law regarding excessive force in a noise complaint was not clearly established. (B) The officer is likely not entitled to qualified immunity because the use of excessive force against a resisting resident, particularly without a warrant to enter, clearly violates established constitutional rights. (C) Qualified immunity applies unless the officer acted with malicious intent. (D) Qualified immunity always protects officers unless they are convicted of a crime.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A state legislature redraws congressional district boundaries, creating oddly shaped districts that concentrate minority voters into a few districts, effectively diluting their voting power in others. Opponents challenge this as an unconstitutional gerrymander.\n\nOptions:\n(A) The redistricting is constitutional as long as it adheres to principles of equal population among districts. (B) The redistricting is unconstitutional as it constitutes a racial gerrymander, violating the Equal Protection Clause of the Fourteenth Amendment. (C) The redistricting is constitutional if the state can show a compelling governmental interest, such as preventing partisan gerrymandering. (D) The constitutionality depends on whether the state's intent was primarily partisan or racial.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A state enacts a law capping individual campaign contributions to state-level political candidates at a very low amount ($100 per election cycle), arguing it combats corruption and ensures a level playing field. Political action committees (PACs) challenge the cap as violating free speech under the First Amendment.\n\nOptions:\n(A) The low cap is likely constitutional as it directly addresses concerns about corruption and undue influence in elections. (B) The low cap is likely unconstitutional as it severely restricts political speech and association, making it difficult for candidates to run effective campaigns. (C) The cap is constitutional if it applies equally to all candidates and parties. (D) The constitutionality depends on whether the cap is applied to both individual and corporate contributions.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A public high school bans students from wearing t-shirts with political messages, arguing it disrupts the educational environment. A student wears a shirt protesting a school policy and is suspended. The student sues, citing the First Amendment.\n\nOptions:\n(A) The school's ban is constitutional because schools can restrict speech that causes a substantial disruption. (B) The school's ban is unconstitutional as students retain First Amendment rights in school, and the shirt did not cause a substantial disruption. (C) The school can ban political messages if the messages are controversial or offensive to some students. (D) The constitutionality depends on whether the school had a history of disciplinary issues related to political clothing.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A private social media company, facing pressure to combat misinformation, develops an algorithm that actively \'down-ranks\' posts containing scientifically disproven claims, even if those claims are expressed by users. Users claim this is censorship violating their free speech rights.\n\nOptions:\n(A) The social media company's actions are unconstitutional as they amount to censorship, violating users' First Amendment rights. (B) The social media company's actions are constitutional because the First Amendment generally only applies to government actors, not private companies. (C) The company's actions are constitutional if their terms of service allow for content moderation. (D) The constitutionality depends on whether the company holds a monopoly on public discourse.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A federal agency proposes a regulation requiring all new firearms sold in the U.S. to include \'smart gun\' technology that only allows the registered owner to fire the weapon. Gun manufacturers and owners challenge this as an infringement on the Second Amendment.\n\nOptions:\n(A) The regulation is constitutional as it aims to enhance public safety and prevent unauthorized use of firearms. (B) The regulation is likely unconstitutional because it mandates a specific technology that could impair the functionality and reliability of firearms, infringing on the right to bear arms. (C) The regulation is constitutional if the technology is proven to be 100% reliable. (D) The regulation is constitutional only if it provides an opt-out for individuals who can prove a need for a non-smart gun.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `Police, without a warrant, install a GPS tracking device on a suspect\'s vehicle and monitor its movements for 28 days. The suspect is later charged based on evidence gathered through the tracking. The suspect moves to suppress the evidence, citing the Fourth Amendment.\n\nOptions:\n(A) The GPS tracking is constitutional as it only tracks movements on public roads, where there is no reasonable expectation of privacy. (B) The GPS tracking is unconstitutional as it constitutes a search under the Fourth Amendment, requiring a warrant. (C) The tracking is constitutional if the police had reasonable suspicion of criminal activity. (D) The tracking is constitutional only if the suspect was aware of the device.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A federal agency routinely collects and stores metadata (who, when, where, and how long of communications, but not content) of all phone calls made by U.S. citizens, citing national security. A civil liberties group challenges this bulk collection under the Fourth Amendment.\n\nOptions:\n(A) The bulk metadata collection is constitutional under the 'third-party doctrine' as individuals voluntarily share this information with phone carriers. (B) The bulk metadata collection is likely unconstitutional as it is an expansive warrantless search that infringes on individuals' reasonable expectation of privacy. (C) The collection is constitutional if it is authorized by an act of Congress. (D) The collection is constitutional only if the data is never shared with other agencies.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A state legislature passes a law allowing law enforcement to obtain a \'no-knock\' warrant for any drug-related offense, regardless of the specific circumstances, to prevent the destruction of evidence. Critics argue this violates the Fourth Amendment\'s protection against unreasonable searches.\n\nOptions:\n(A) The law is constitutional as it serves the compelling interest of preventing evidence destruction in drug cases. (B) The law is unconstitutional because it allows for no-knock warrants without requiring specific, articulable reasons to believe destruction of evidence is imminent in each case. (C) The law is constitutional if officers are required to undergo special training before executing no-knock warrants. (D) The constitutionality depends on whether the state has a high rate of evidence destruction in drug cases.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A suspect arrested for a misdemeanor crime is interrogated by police. Before questioning, the police do not inform the suspect of their right to remain silent or their right to an attorney. The suspect confesses to a more serious felony. Can this confession be used against them?\n\nOptions:\n(A) Yes, because Miranda warnings are only required for felony arrests, not misdemeanors. (B) No, because Miranda warnings are required for all custodial interrogations, regardless of the severity of the suspected crime. (C) Yes, if the police can prove the suspect was aware of their rights through other means. (D) No, unless the suspect specifically requested an attorney.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `A state passes a law that allows property to be seized under eminent domain without providing \'just compensation\' if the property owner is convicted of a felony. A convicted felon\'s property is taken without compensation. They challenge this under the Fifth Amendment.\n\nOptions:\n(A) The law is constitutional as a form of criminal forfeiture, which does not require just compensation. (B) The law is unconstitutional as the Fifth Amendment's Takings Clause requires 'just compensation' for all private property taken for public use, regardless of the owner's criminal status. (C) The law is constitutional if the felony is directly related to the property's use. (D) The constitutionality depends on whether the state offers an appeal process for the property owner.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `The President issues an executive order declaring certain individuals, identified as \'enemy combatants\' in the \'War on Terror,\' may be detained indefinitely without trial or access to civilian courts. Human rights organizations challenge the order as a violation of due process and habeas corpus.\n\nOptions:\n(A) The executive order is constitutional under the President's authority as Commander-in-Chief during wartime. (B) The executive order is unconstitutional as it violates fundamental due process rights and the right to habeas corpus, which apply even to non-citizens detained by the U.S. government. (C) The order is constitutional if it is approved by Congress. (D) The constitutionality depends on whether the individuals are U.S. citizens or not.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `In response to a cyberattack targeting critical infrastructure, the President issues an executive order seizing control of all private internet service providers (ISPs) and mandating content monitoring to prevent future attacks. ISPs and civil liberties groups challenge the order.\n\nOptions:\n(A) The executive order is constitutional under the President's emergency powers to protect national security. (B) The executive order is unconstitutional as it exceeds presidential authority, potentially violating the Fifth Amendment's Takings Clause and First Amendment free speech rights. (C) The order is constitutional if it is temporary and limited to monitoring for specific threats. (D) The constitutionality depends on whether Congress has enacted specific legislation granting such powers.\n\nAnswer with the letter and explain your reasoning.`],
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
    prompts: [() => `Congress passes a law authorizing the President to declare war unilaterally against any nation that harbors terrorists, bypassing the constitutional requirement for a congressional declaration of war. The President then declares war on a small nation. Legal scholars challenge the law.\n\nOptions:\n(A) The law is constitutional as Congress is delegating its war-making authority to the President, which is permissible. (B) The law is unconstitutional as Congress cannot delegate its exclusive power to declare war to the President. (C) The law is constitutional if the President consults with congressional leaders before declaring war. (D) The constitutionality depends on whether the nation is genuinely harboring terrorists.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_028':
  textGame({
    prompts: [() => `During a massive natural disaster, a state government issues an order for mandatory evacuation, and as part of the evacuation, requires all citizens to leave their cell phones at designated checkpoints for \'security screening\' before proceeding. Citizens refuse, citing privacy and Fourth Amendment concerns.\n\nOptions:\n(A) The state's order is constitutional under emergency powers to ensure public safety during a disaster. (B) The state's order is unconstitutional as it constitutes a warrantless search of personal electronic devices without probable cause or individualized suspicion. (C) The order is constitutional if the state provides a written receipt for the phones. (D) The constitutionality depends on whether the state has experienced previous terrorist attacks during disasters.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_029':
  textGame({
    prompts: [() => `A police officer responds to an active shooter situation. Upon arrival, they observe an individual who matches the shooter\'s description fleeing the scene. The officer tackles the individual, breaking their arm, before realizing they were an innocent bystander. The individual sues for excessive force. The officer claims qualified immunity.\n\nOptions:\n(A) The officer is likely entitled to qualified immunity because they were responding to an active shooter and acted reasonably under the exigent circumstances. (B) The officer is likely not entitled to qualified immunity because breaking an arm is excessive force against someone not resisting arrest. (C) Qualified immunity applies only if the officer believed the individual was the shooter with 100% certainty. (D) The constitutionality depends on whether the individual had any prior criminal record.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_030':
  textGame({
    prompts: [() => `A newly elected state legislature redraws electoral districts exclusively to maximize the number of seats for the majority party, resulting in wildly unequal populations between districts. Opponents challenge this as an unconstitutional partisan gerrymander.\n\nOptions:\n(A) The redistricting is constitutional because partisan gerrymandering is considered a political question outside the purview of the courts. (B) The redistricting is unconstitutional as it violates the 'one person, one vote' principle of the Equal Protection Clause of the Fourteenth Amendment. (C) The redistricting is constitutional if the state can demonstrate a legitimate interest in preserving existing community boundaries. (D) The constitutionality depends on whether the minority party also engaged in gerrymandering in the past.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_031':
  textGame({
    prompts: [() => `A federal law prohibits corporations from making any independent expenditures in support of or opposition to political candidates, arguing it prevents corporate corruption. A large corporation challenges the law, citing First Amendment free speech rights.\n\nOptions:\n(A) The law is constitutional as corporations are not individuals and do not possess the same free speech rights. (B) The law is unconstitutional as corporations have First Amendment rights, and independent expenditures are a form of political speech that cannot be banned. (C) The law is constitutional if it applies only to for-profit corporations. (D) The constitutionality depends on whether the corporation has a history of illegal campaign contributions.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_032':
  textGame({
    prompts: [() => `A city enacts an ordinance making it a crime to display signs or banners critical of the government\'s policies within 100 feet of any public building. A citizen is arrested for holding a sign outside city hall. They challenge the ordinance.\n\nOptions:\n(A) The ordinance is constitutional as it maintains civic order and aesthetics around public buildings. (B) The ordinance is unconstitutional as it is a content-based restriction on speech in a traditional public forum, not narrowly tailored to a compelling government interest. (C) The ordinance is constitutional if the city provides designated areas for protest further away. (D) The constitutionality depends on whether the signs caused a physical obstruction.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_033':
  textGame({
    prompts: [() => `A university establishes \'free speech zones\' on campus, limiting all student protests, demonstrations, and distribution of literature to two small, designated areas. A student group organizes a protest outside these zones and is disciplined.\n\nOptions:\n(A) The university's 'free speech zones' are constitutional as they provide clear areas for expression while maintaining order on campus. (B) The university's 'free speech zones' are unconstitutional as they unduly restrict speech in what should be a broader public forum. (C) The zones are constitutional if they are clearly marked and easily accessible. (D) The constitutionality depends on whether the university is public or private.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_034':
  textGame({
    prompts: [() => `A state legislature passes a law requiring all gun owners to purchase liability insurance as a condition of owning a firearm, arguing it covers potential damages from misuse. Gun rights groups challenge this as an unconstitutional burden on the Second Amendment.\n\nOptions:\n(A) The law is constitutional as it is a reasonable regulation to mitigate the risks associated with gun ownership, similar to car insurance. (B) The law is unconstitutional as it places an undue financial burden on gun owners, effectively infringing on their right to bear arms. (C) The law is constitutional if the insurance premiums are affordable for all income levels. (D) The constitutionality depends on whether the state has a high rate of gun violence.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_035':
  textGame({
    prompts: [() => `Police use a thermal imager from a public street to scan a suspect\'s home, detecting heat patterns consistent with marijuana growth. Based on this, they obtain a search warrant and find drugs. The suspect challenges the use of the thermal imager under the Fourth Amendment.\n\nOptions:\n(A) The use of the thermal imager is constitutional as it did not involve physical intrusion into the home and only detected heat, not intimate details. (B) The use of the thermal imager is unconstitutional as it constitutes a search of the interior of a home, requiring a warrant. (C) The use of the thermal imager is constitutional if the police had reasonable suspicion of criminal activity. (D) The constitutionality depends on whether the thermal imager is commonly available to the public.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_036':
  textGame({
    prompts: [() => `A state implements a program allowing law enforcement to conduct warrantless searches of private mail and packages sent through the state postal service, if they suspect illegal immigration-related materials. Civil liberties groups challenge this as a Fourth Amendment violation.\n\nOptions:\n(A) The warrantless searches are constitutional as the state has a compelling interest in enforcing immigration laws. (B) The warrantless searches are unconstitutional as mail and packages are protected by the Fourth Amendment and require a warrant based on probable cause. (C) The searches are constitutional if they are limited to packages entering the state from international borders. (D) The constitutionality depends on whether the state postal service is publicly or privately operated.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_037':
  textGame({
    prompts: [() => `A suspect is arrested for a serious crime. During booking, police collect DNA samples by swabbing their cheek, without a warrant or individualized suspicion beyond the arrest itself. The suspect challenges this as a Fourth Amendment violation.\n\nOptions:\n(A) The warrantless DNA collection is constitutional as it is a legitimate booking procedure analogous to fingerprinting. (B) The warrantless DNA collection is unconstitutional as it constitutes a search without a warrant or individualized probable cause. (C) The collection is constitutional only if the suspect is later convicted of the crime. (D) The constitutionality depends on whether the suspect consented to the DNA collection.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_038':
  textGame({
    prompts: [() => `A city mandates that all new immigrants seeking residency must provide access to all their social media accounts and email for a \'character and loyalty\' review by a municipal committee. Immigration advocates challenge this as a privacy violation.\n\nOptions:\n(A) The mandate is constitutional as the city has a right to screen potential residents and ensure public safety. (B) The mandate is unconstitutional as it constitutes an unreasonable search and seizure of private digital communications, violating the Fourth Amendment. (C) The mandate is constitutional if immigrants are informed of the policy before applying for residency. (D) The constitutionality depends on whether the city has evidence of specific threats from immigrant populations.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_039':
  textGame({
    prompts: [() => `A state passes a law allowing for \'civil asset forfeiture\' where police can seize private property (cash, cars, homes) merely on suspicion of its involvement in a crime, without first securing a criminal conviction. Property owners challenge this as a violation of the Fifth Amendment.\n\nOptions:\n(A) The law is constitutional as it helps fund law enforcement and deters criminal activity. (B) The law is likely unconstitutional as it allows for the taking of property without due process and potentially without just compensation, prior to a conviction. (C) The law is constitutional if the seized assets are proven to be directly linked to criminal activity. (D) The constitutionality depends on whether the property owner is given an opportunity to challenge the forfeiture in court.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_040':
  textGame({
    prompts: [() => `During a murder investigation, police question a suspect in their home. The suspect is not arrested but is told they \'cannot leave\' until questioning is complete, which lasts for several hours. The suspect confesses. The defense argues the confession is inadmissible due to a Miranda violation.\n\nOptions:\n(A) The confession is admissible because the suspect was not formally arrested and was in their own home, so Miranda warnings were not required. (B) The confession is inadmissible because the suspect was in a 'custodial' situation, despite being in their home, and was not read their Miranda rights. (C) The confession is admissible if the police can prove the suspect was not coerced into confessing. (D) The constitutionality depends on whether the suspect had an attorney present.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_041':
  textGame({
    prompts: [() => `A state passes a law that prohibits all individuals who have ever been convicted of a misdemeanor related to domestic violence from owning a firearm, regardless of how long ago the conviction occurred. A person convicted 20 years ago challenges the law.\n\nOptions:\n(A) The law is constitutional as it serves a compelling government interest in preventing domestic violence. (B) The law is likely unconstitutional as it imposes a lifetime ban for a misdemeanor, disproportionately infringing on Second Amendment rights without sufficient narrow tailoring. (C) The law is constitutional if it includes a process for individuals to petition for restoration of rights after a certain period. (D) The constitutionality depends on whether the misdemeanor was considered a 'violent' crime.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_042':
  textGame({
    prompts: [() => `A city council, facing budget shortfalls, decides to seize a privately owned, profitable theater through eminent domain and convert it into a government-run community center, arguing this serves a \'public purpose\' by providing public services. The theater owner challenges this.\n\nOptions:\n(A) The taking is constitutional under the Fifth Amendment as providing community services is a legitimate public purpose. (B) The taking is unconstitutional because seizing a profitable private business for conversion into a government-run facility is not a 'public use' and lacks a valid public purpose. (C) The taking is constitutional if the theater owner receives 'just compensation.' (D) The constitutionality depends on whether the city council can prove a significant demand for a community center.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_043':
  textGame({
    prompts: [() => `An individual is arrested. Police search their digital wallet (cryptocurrency and banking apps) on their unlocked phone without a warrant, looking for evidence of money laundering. The individual challenges this as a Fourth Amendment violation.\n\nOptions:\n(A) The search of the digital wallet is constitutional as it's part of a search incident to arrest, and the phone was unlocked. (B) The search of the digital wallet is unconstitutional as digital wallets contain highly private financial information requiring a specific warrant. (C) The search is constitutional if the police had probable cause to believe the wallet contained evidence of money laundering. (D) The constitutionality depends on whether the individual consented to the phone being unlocked.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_044':
  textGame({
    prompts: [() => `During a federal election, a foreign government anonymously donates a large sum of money to a super PAC that supports a particular candidate. The super PAC spends the money on ads without disclosing the source. Opponents argue this violates campaign finance laws and poses a national security risk.\n\nOptions:\n(A) The foreign donation is permissible as long as it is made anonymously and does not directly coordinate with a candidate. (B) Foreign contributions to U.S. elections, regardless of anonymity, are generally prohibited by federal law and raise significant national security and campaign finance concerns. (C) The donation is constitutional if the super PAC is not aware it came from a foreign source. (D) The constitutionality depends on whether the foreign government has an established alliance with the U.S.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_045':
  textGame({
    prompts: [() => `A state enacts a law requiring all public school teachers to lead their classes in a daily, non-denominational prayer. A parent challenges this, arguing it violates the Establishment Clause of the First Amendment.\n\nOptions:\n(A) The law is constitutional as the prayer is non-denominational and promotes moral values. (B) The law is unconstitutional as it constitutes government endorsement of religion in public schools, violating the Establishment Clause. (C) The law is constitutional if students are permitted to opt-out of the prayer. (D) The constitutionality depends on whether the majority of parents in the school district support the prayer.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_046':
  textGame({
    prompts: [() => `An independent journalist publishes classified government documents provided by a whistleblower, detailing illegal surveillance programs. The government seeks an injunction to prevent further publication, citing national security.\n\nOptions:\n(A) The government can prevent publication if it can prove that the information will cause direct, immediate, and irreparable harm to national security. (B) The government cannot prevent publication as it constitutes prior restraint on the press, a severe violation of the First Amendment. (C) The government can prevent publication if the documents were obtained illegally. (D) The constitutionality depends on whether the journalist verified the authenticity of the documents.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_047':
  textGame({
    prompts: [() => `A state passes a law making it a felony to openly display any symbol associated with a known hate group, even without any accompanying violent action or incitement. A member of such a group is arrested for wearing a t-shirt with a prohibited symbol in public.\n\nOptions:\n(A) The law is constitutional as it targets symbols of hate and promotes public order. (B) The law is unconstitutional as it is a content-based restriction on symbolic speech, which is protected under the First Amendment unless it incites violence or is a 'true threat'. (C) The law is constitutional if the symbol is universally recognized as promoting hate. (D) The constitutionality depends on whether the individual had violent intentions.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_048':
  textGame({
    prompts: [() => `A federal law prohibits individuals under the age of 21 from purchasing any firearm, including long guns, citing public safety concerns. An 18-year-old challenges the law, arguing it violates their Second Amendment rights.\n\nOptions:\n(A) The law is constitutional as age restrictions on firearm ownership are a reasonable exercise of governmental power to protect public safety. (B) The law is unconstitutional because 18-year-olds are considered adults for most legal purposes and should have the right to purchase firearms. (C) The law is constitutional if it is limited to handguns only. (D) The constitutionality depends on whether the state has a high rate of gun violence among young adults.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('a') || l.includes('"a"') || l.includes("'a'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_049':
  textGame({
    prompts: [() => `During a protest, police use facial recognition technology connected to public cameras to identify all participants. Later, individuals identified are sent notices of fines for violating a city ordinance against \'unpermitted gatherings,\' even if they were peaceful. Protesters challenge this as a Fourth Amendment violation.\n\nOptions:\n(A) The use of facial recognition is constitutional as individuals in public have no reasonable expectation of privacy. (B) The use of facial recognition to identify peaceful protesters without individualized suspicion is unconstitutional, violating the Fourth Amendment and potentially First Amendment rights to assembly. (C) The technology's use is constitutional if the city has a policy for its use and clear retention guidelines for the data. (D) The constitutionality depends on whether the city publicly announced its use of facial recognition technology.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
  'constitution_050':
  textGame({
    prompts: [() => `A state passes a law allowing for expedited deportation proceedings for non-citizens without a formal hearing or judicial review, if they are deemed a \'national security threat\' by an executive agency. Civil liberties groups challenge this as a violation of due process.\n\nOptions:\n(A) The law is constitutional as the government has broad powers to protect national security, especially concerning non-citizens. (B) The law is unconstitutional as non-citizens, even those deemed national security threats, are entitled to a meaningful opportunity to be heard and judicial review before deportation, under the Fifth Amendment's Due Process Clause. (C) The law is constitutional if the executive agency provides some form of internal review. (D) The constitutionality depends on whether the non-citizens are from countries designated as state sponsors of terrorism.\n\nAnswer with the letter and explain your reasoning.`],
    score: (a, d) => {
      const l = a.toLowerCase();
      let sc = 0;
      if (l.includes('b') || l.includes('"b"') || l.includes("'b'")) sc += 50;
      sc += reasonScore(a);
      return clamp(sc);
    },
  }),
};
