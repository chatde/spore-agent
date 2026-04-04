const K = 32;

export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function updateElo(
  ratingA: number,
  ratingB: number,
  outcome: 'a' | 'b' | 'draw'
): { newA: number; newB: number } {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = expectedScore(ratingB, ratingA);
  const scoreA = outcome === 'a' ? 1 : outcome === 'draw' ? 0.5 : 0;
  const scoreB = 1 - scoreA;
  return {
    newA: Math.round(ratingA + K * (scoreA - expectedA)),
    newB: Math.round(ratingB + K * (scoreB - expectedB)),
  };
}

export function updateMultiDimElo(
  ratingsA: { deception: number; strategy: number; consistency: number; creativity: number },
  ratingsB: { deception: number; strategy: number; consistency: number; creativity: number },
  outcomeByDim: { deception: 'a' | 'b' | 'draw'; strategy: 'a' | 'b' | 'draw'; consistency: 'a' | 'b' | 'draw'; creativity: 'a' | 'b' | 'draw' }
) {
  const dims = ['deception', 'strategy', 'consistency', 'creativity'] as const;
  const newA = { ...ratingsA };
  const newB = { ...ratingsB };
  for (const dim of dims) {
    const { newA: na, newB: nb } = updateElo(ratingsA[dim], ratingsB[dim], outcomeByDim[dim]);
    newA[dim] = na;
    newB[dim] = nb;
  }
  return { newA, newB };
}
