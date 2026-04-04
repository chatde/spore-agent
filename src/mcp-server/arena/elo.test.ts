import assert from 'node:assert/strict';
import { expectedScore, updateElo, updateMultiDimElo } from './elo.js';

// Test: equal ratings + win → winner gains ~16, loser loses ~16
{
  const { newA, newB } = updateElo(1000, 1000, 'a');
  assert.equal(newA, 1016, 'winner should gain 16 from equal ratings');
  assert.equal(newB, 984, 'loser should lose 16 from equal ratings');
}

// Test: equal ratings + draw → no change
{
  const { newA, newB } = updateElo(1000, 1000, 'draw');
  assert.equal(newA, 1000, 'draw at equal ratings: A unchanged');
  assert.equal(newB, 1000, 'draw at equal ratings: B unchanged');
}

// Test: high vs low rating + upset win (low beats high) → high delta
{
  const highRating = 1500;
  const lowRating = 1000;
  const { newA, newB } = updateElo(lowRating, highRating, 'a');
  // Low-rated A wins upset — gains much more than 16
  assert.ok(newA - lowRating > 16, `upset winner should gain > 16, got ${newA - lowRating}`);
  assert.ok(highRating - newB > 16, `upset loser should lose > 16, got ${highRating - newB}`);
}

// Test: high vs low rating + expected win (high beats low) → small change
{
  const highRating = 1500;
  const lowRating = 1000;
  const { newA, newB } = updateElo(highRating, lowRating, 'a');
  // Expected winner gains very little
  assert.ok(highRating - newA < 5, `expected winner should gain < 5, got ${newA - highRating}`);
  assert.ok(newB - lowRating < 5, `expected loser should lose < 5, got ${lowRating - newB}`);
}

// Test: draw between unequal ratings → adjustments toward equal
{
  const { newA, newB } = updateElo(1200, 1000, 'draw');
  // Higher-rated A loses points, lower-rated B gains points
  assert.ok(newA < 1200, 'higher-rated player loses ELO on draw');
  assert.ok(newB > 1000, 'lower-rated player gains ELO on draw');
}

// Test: expectedScore is between 0 and 1
{
  const e = expectedScore(1200, 1000);
  assert.ok(e > 0.5 && e < 1, 'higher-rated player has expected score > 0.5');
}

// Test: updateMultiDimElo with mixed outcomes
{
  const ratingsA = { deception: 1000, strategy: 1200, consistency: 900, creativity: 1100 };
  const ratingsB = { deception: 1000, strategy: 1000, consistency: 1000, creativity: 1000 };
  const outcomeByDim = {
    deception: 'a' as const,    // A wins deception
    strategy: 'b' as const,     // B upsets A in strategy
    consistency: 'draw' as const,
    creativity: 'a' as const,   // A wins creativity
  };

  const { newA, newB } = updateMultiDimElo(ratingsA, ratingsB, outcomeByDim);

  // deception: equal ratings, A wins → A gains ~16
  assert.equal(newA.deception, 1016);
  assert.equal(newB.deception, 984);

  // strategy: A(1200) vs B(1000), B upsets → B gains a lot
  assert.ok(newB.strategy > 1016, 'B upset win in strategy gains > 16');
  assert.ok(newA.strategy < 1200, 'A loses strategy');

  // consistency: A(900) vs B(1000), draw → A gains (lower-rated), B loses
  assert.ok(newA.consistency > 900, 'lower-rated A gains on draw');
  assert.ok(newB.consistency < 1000, 'higher-rated B loses on draw');

  // creativity: A(1100) vs B(1000), A wins (expected) → small gain
  assert.ok(newA.creativity >= 1100, 'A gains or holds creativity on expected win');
}

console.log('All ELO tests passed.');
