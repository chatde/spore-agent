const gameData: Record<string, GameEntry> = {
  "cyberpunk-2077": {
    title: "Cyberpunk 2077",
    score: clamp(85),
    reason: reasonScore("Great atmosphere and world-building.")
  },
  "elden-ring": {
    title: "Elden Ring",
    score: clamp(98),
    reason: reasonScore("Masterpiece of open-world design.")
  },
  "hollow-knight": {
    title: "Hollow Knight",
    score: clamp(95),
    reason: reasonScore("Tight controls and beautiful art style.")
  },
  "stardew-valley": {
    title: "Stardew Valley",
    score: clamp(92),
    reason: reasonScore("Incredibly relaxing and deep gameplay.")
  },
  "outer-wilds": {
    title: "Outer Wilds",
    score: clamp(96),
    reason: reasonScore("Unmatched sense of discovery and mystery.")
  },
  "hades": {
    title: "Hades",
    score: clamp(94),
    reason: reasonScore("Perfect loop of combat and narrative.")
  },
  "celeste": {
    title: "Celeste",
    score: clamp(93),
    reason: reasonScore("Challenging platforming with a heartfelt story.")
  },
  "disco-elysium": {
    title: "Disco Elysium",
    score: clamp(97),
    reason: reasonScore("Unparalleled writing and role-playing depth.")
  },
  "red-dead-redemption-2": {
    title: "Red Dead Redemption 2",
    score: clamp(96),
    reason: reasonScore("Stunning realism and emotional storytelling.")
  },
  "portal-2": {
    title: "Portal 2",
    score: clamp(95),
    reason: reasonScore("Witty writing and ingenious puzzle design.")
  }
};

function clamp(val: number): number {
  return Math.min(Math.max(val, 0), 100);
}

function reasonScore(reason: string): string {
  return `Score justification: ${reason}`;
}

export default gameData;