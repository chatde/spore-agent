import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { PatternSiegeConfig } from '../types.js';
import type { GameEngine, RoundPrompt, ScoreResult } from './engine.js';

type PatternType = 'even_numbers' | 'ascending_rows' | 'repeating_pattern' | 'prime_numbers' | 'fibonacci_like' | 'multiples_of_three';

interface PatternGrid {
  grid: number[][];
  pattern_description: string;
  anomaly_positions: [number, number][];
  pattern_type: PatternType;
}

interface RoundResult {
  round_number: number;
  correct_finds: number;
  false_positives: number;
  missed: number;
  score: number;
  anomaly_positions: [number, number][];
  submitted_positions: [number, number][];
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function generateEvenGrid(size: number): { grid: number[][]; description: string } {
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push((Math.floor(Math.random() * 50) + 1) * 2); // even numbers 2-100
    }
    grid.push(row);
  }
  return { grid, description: 'All numbers should be even' };
}

function generateAscendingRowsGrid(size: number): { grid: number[][]; description: string } {
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    let val = Math.floor(Math.random() * 10) + 1;
    for (let c = 0; c < size; c++) {
      row.push(val);
      val += Math.floor(Math.random() * 5) + 1;
    }
    grid.push(row);
  }
  return { grid, description: 'Each row should be strictly ascending left to right' };
}

function generateRepeatingGrid(size: number): { grid: number[][]; description: string } {
  const patternLen = Math.floor(Math.random() * 3) + 2; // 2-4 length pattern
  const pattern: number[] = [];
  for (let i = 0; i < patternLen; i++) {
    pattern.push(Math.floor(Math.random() * 9) + 1);
  }
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(pattern[(r * size + c) % patternLen]);
    }
    grid.push(row);
  }
  return { grid, description: `Numbers follow a repeating pattern: [${pattern.join(', ')}]` };
}

function generatePrimeGrid(size: number): { grid: number[][]; description: string } {
  const primes: number[] = [];
  for (let n = 2; primes.length < size * size + 20; n++) {
    if (isPrime(n)) primes.push(n);
  }
  const grid: number[][] = [];
  let idx = 0;
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(primes[idx++]);
    }
    grid.push(row);
  }
  return { grid, description: 'All numbers should be prime numbers' };
}

function generateFibonacciLikeGrid(size: number): { grid: number[][]; description: string } {
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    row.push(a, b);
    for (let c = 2; c < size; c++) {
      row.push(row[c - 1] + row[c - 2]);
    }
    grid.push(row);
  }
  return { grid, description: 'Each row follows Fibonacci-like rule: each number is the sum of the two before it' };
}

function generateMultiplesOfThreeGrid(size: number): { grid: number[][]; description: string } {
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push((Math.floor(Math.random() * 33) + 1) * 3); // 3-99 multiples of 3
    }
    grid.push(row);
  }
  return { grid, description: 'All numbers should be multiples of 3' };
}

function injectAnomalies(
  grid: number[][],
  patternType: PatternType,
  count: number,
  size: number
): [number, number][] {
  const positions: [number, number][] = [];
  const used = new Set<string>();

  while (positions.length < count) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    const key = `${r},${c}`;
    if (used.has(key)) continue;
    used.add(key);

    switch (patternType) {
      case 'even_numbers':
        grid[r][c] = Math.floor(Math.random() * 50) * 2 + 1; // odd number
        break;
      case 'ascending_rows': {
        // Make one cell break the ascending order
        const prev = c > 0 ? grid[r][c - 1] : 0;
        grid[r][c] = Math.max(0, prev - Math.floor(Math.random() * 10) - 1);
        break;
      }
      case 'repeating_pattern':
        grid[r][c] = grid[r][c] + Math.floor(Math.random() * 8) + 1; // break the pattern
        break;
      case 'prime_numbers': {
        // Insert a composite number
        let composite = 4;
        do { composite = Math.floor(Math.random() * 95) + 4; } while (isPrime(composite));
        grid[r][c] = composite;
        break;
      }
      case 'fibonacci_like': {
        // Break the sum rule
        const expected = c >= 2 ? grid[r][c - 1] + grid[r][c - 2] : grid[r][c];
        grid[r][c] = expected + Math.floor(Math.random() * 10) + 1;
        break;
      }
      case 'multiples_of_three': {
        let nonMult = Math.floor(Math.random() * 97) + 1;
        while (nonMult % 3 === 0) nonMult++;
        grid[r][c] = nonMult;
        break;
      }
    }
    positions.push([r, c]);
  }
  return positions;
}

function generatePatternGrid(size: number, anomalyCount: number): PatternGrid {
  const patternTypes: PatternType[] = [
    'even_numbers', 'ascending_rows', 'repeating_pattern',
    'prime_numbers', 'fibonacci_like', 'multiples_of_three'
  ];
  const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

  let result: { grid: number[][]; description: string };
  switch (patternType) {
    case 'even_numbers': result = generateEvenGrid(size); break;
    case 'ascending_rows': result = generateAscendingRowsGrid(size); break;
    case 'repeating_pattern': result = generateRepeatingGrid(size); break;
    case 'prime_numbers': result = generatePrimeGrid(size); break;
    case 'fibonacci_like': result = generateFibonacciLikeGrid(size); break;
    case 'multiples_of_three': result = generateMultiplesOfThreeGrid(size); break;
  }

  const anomalyPositions = injectAnomalies(result.grid, patternType, anomalyCount, size);

  return {
    grid: result.grid,
    pattern_description: result.description,
    anomaly_positions: anomalyPositions,
    pattern_type: patternType,
  };
}

class PatternSiegeEngine implements GameEngine {
  generateConfig(difficulty: number): Record<string, unknown> {
    const d = Math.max(1, Math.min(10, difficulty));
    const config: PatternSiegeConfig = {
      grid_size: Math.round(6 + (d - 1) * (14 / 9)),       // 6 to 20
      anomaly_count: Math.round(2 + (d - 1) * (6 / 9)),    // 2 to 8
      time_window_seconds: Math.round(60 - (d - 1) * (45 / 9)), // 60 to 15
      rounds: Math.round(3 + (d - 1) * (5 / 9)),           // 3 to 8
    };
    return config as unknown as Record<string, unknown>;
  }

  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt {
    const config = challenge.config as unknown as PatternSiegeConfig;
    const roundNumber = (match.round_data?.length ?? 0) + 1;

    const patternGrid = generatePatternGrid(config.grid_size, config.anomaly_count);

    // Store anomaly positions in a way we can retrieve during scoring
    // We attach it to the prompt as a hidden field (the scoring function will regenerate or we store in round_data)
    return {
      round_number: roundNumber,
      prompt: {
        grid: patternGrid.grid,
        pattern_description: patternGrid.pattern_description,
        grid_size: config.grid_size,
        anomaly_count: config.anomaly_count,
        _anomaly_positions: patternGrid.anomaly_positions, // used by scorer
      },
      deadline_seconds: config.time_window_seconds,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    challenge: ArenaChallenge,
    submission: unknown
  ): Promise<ScoreResult> {
    const config = challenge.config as unknown as PatternSiegeConfig;
    const roundNumber = (match.round_data?.length ?? 0) + 1;

    // Validate submission format
    if (
      !submission ||
      typeof submission !== 'object' ||
      !Array.isArray((submission as { coordinates?: unknown }).coordinates)
    ) {
      const roundResult: RoundResult = {
        round_number: roundNumber,
        correct_finds: 0,
        false_positives: 0,
        missed: config.anomaly_count,
        score: 0,
        anomaly_positions: [],
        submitted_positions: [],
      };
      return {
        score: 0,
        feedback: 'Invalid submission format. Expected { coordinates: [number, number][] }',
        round_complete: true,
        game_complete: roundNumber >= config.rounds,
        updated_round_data: [...(match.round_data || []), roundResult],
      };
    }

    const submitted = (submission as { coordinates: [number, number][] }).coordinates;

    // Get the anomaly positions from the last prompt stored in round context
    // In practice, the caller should pass the prompt data. We'll look for _anomaly_positions
    // on the match's most recent round prompt. For now, we need the prompt to be passed via
    // a convention — the caller stores it. We'll check match.round_data for a pending prompt.
    const lastRoundData = match.round_data?.[match.round_data.length - 1] as
      | { _anomaly_positions?: [number, number][] }
      | undefined;
    const anomalyPositions: [number, number][] = lastRoundData?._anomaly_positions ?? [];

    const anomalySet = new Set(anomalyPositions.map(([r, c]) => `${r},${c}`));
    const submittedSet = new Set(submitted.map(([r, c]) => `${r},${c}`));

    let correctFinds = 0;
    let falsePositives = 0;

    for (const coord of submitted) {
      const key = `${coord[0]},${coord[1]}`;
      if (anomalySet.has(key)) {
        correctFinds++;
      } else {
        falsePositives++;
      }
    }

    const missed = anomalyPositions.length - correctFinds;
    const baseScore = anomalyPositions.length > 0
      ? (correctFinds / anomalyPositions.length) * 100
      : 0;
    const penalty = falsePositives * 10;
    const score = Math.max(0, Math.round(baseScore - penalty));

    const roundResult: RoundResult = {
      round_number: roundNumber,
      correct_finds: correctFinds,
      false_positives: falsePositives,
      missed,
      score,
      anomaly_positions: anomalyPositions,
      submitted_positions: submitted,
    };

    const gameComplete = roundNumber >= config.rounds;

    return {
      score,
      feedback: `Round ${roundNumber}: Found ${correctFinds}/${anomalyPositions.length} anomalies. ${falsePositives} false positive(s). Score: ${score}/100.${gameComplete ? ' Game complete!' : ''}`,
      round_complete: true,
      game_complete: gameComplete,
      updated_round_data: [...(match.round_data || []), roundResult],
    };
  }
}

export const patternSiege = new PatternSiegeEngine();
