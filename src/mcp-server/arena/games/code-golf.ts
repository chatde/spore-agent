import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { CodeGolfConfig } from '../types.js';
import type { GameEngine, RoundPrompt, ScoreResult } from './engine.js';

interface Problem {
  id: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  visible_tests: Array<{ input: string; expected_output: string }>;
  hidden_tests: Array<{ input: string; expected_output: string }>;
}

const PROBLEMS: Problem[] = [
  // EASY
  {
    id: 'reverse_string',
    statement: 'Write a function f(s) that takes a string and returns it reversed.',
    difficulty: 'easy',
    visible_tests: [
      { input: '"hello"', expected_output: '"olleh"' },
      { input: '"abc"', expected_output: '"cba"' },
    ],
    hidden_tests: [
      { input: '""', expected_output: '""' },
      { input: '"a"', expected_output: '"a"' },
      { input: '"racecar"', expected_output: '"racecar"' },
    ],
  },
  {
    id: 'fizzbuzz',
    statement: 'Write a function f(n) that returns "Fizz" if n is divisible by 3, "Buzz" if by 5, "FizzBuzz" if by both, or the number as a string otherwise.',
    difficulty: 'easy',
    visible_tests: [
      { input: '3', expected_output: '"Fizz"' },
      { input: '5', expected_output: '"Buzz"' },
      { input: '15', expected_output: '"FizzBuzz"' },
      { input: '7', expected_output: '"7"' },
    ],
    hidden_tests: [
      { input: '1', expected_output: '"1"' },
      { input: '30', expected_output: '"FizzBuzz"' },
      { input: '9', expected_output: '"Fizz"' },
      { input: '10', expected_output: '"Buzz"' },
    ],
  },
  {
    id: 'sum_array',
    statement: 'Write a function f(arr) that returns the sum of all numbers in the array.',
    difficulty: 'easy',
    visible_tests: [
      { input: '[1, 2, 3]', expected_output: '6' },
      { input: '[10, -5, 3]', expected_output: '8' },
    ],
    hidden_tests: [
      { input: '[]', expected_output: '0' },
      { input: '[42]', expected_output: '42' },
      { input: '[0, 0, 0]', expected_output: '0' },
    ],
  },
  {
    id: 'count_vowels',
    statement: 'Write a function f(s) that returns the number of vowels (a, e, i, o, u) in the string (case-insensitive).',
    difficulty: 'easy',
    visible_tests: [
      { input: '"hello"', expected_output: '2' },
      { input: '"aeiou"', expected_output: '5' },
    ],
    hidden_tests: [
      { input: '""', expected_output: '0' },
      { input: '"HELLO"', expected_output: '2' },
      { input: '"bcdfg"', expected_output: '0' },
    ],
  },
  {
    id: 'max_value',
    statement: 'Write a function f(arr) that returns the maximum value in an array of numbers.',
    difficulty: 'easy',
    visible_tests: [
      { input: '[1, 5, 3]', expected_output: '5' },
      { input: '[-1, -5, -3]', expected_output: '-1' },
    ],
    hidden_tests: [
      { input: '[42]', expected_output: '42' },
      { input: '[0, 0, 0]', expected_output: '0' },
      { input: '[100, 1, 50]', expected_output: '100' },
    ],
  },
  // MEDIUM
  {
    id: 'palindrome_check',
    statement: 'Write a function f(s) that returns true if the string is a palindrome (case-insensitive, ignoring non-alphanumeric chars), false otherwise.',
    difficulty: 'medium',
    visible_tests: [
      { input: '"racecar"', expected_output: 'true' },
      { input: '"hello"', expected_output: 'false' },
      { input: '"A man a plan a canal Panama"', expected_output: 'true' },
    ],
    hidden_tests: [
      { input: '""', expected_output: 'true' },
      { input: '"a"', expected_output: 'true' },
      { input: '"No lemon, no melon"', expected_output: 'true' },
      { input: '"not a palindrome"', expected_output: 'false' },
    ],
  },
  {
    id: 'flatten_array',
    statement: 'Write a function f(arr) that flattens a nested array to a single level. Example: [1,[2,[3]]] -> [1,2,3].',
    difficulty: 'medium',
    visible_tests: [
      { input: '[1, [2, [3]]]', expected_output: '[1,2,3]' },
      { input: '[[1, 2], [3, 4]]', expected_output: '[1,2,3,4]' },
    ],
    hidden_tests: [
      { input: '[]', expected_output: '[]' },
      { input: '[1, 2, 3]', expected_output: '[1,2,3]' },
      { input: '[[[[1]]]]', expected_output: '[1]' },
    ],
  },
  {
    id: 'roman_numerals',
    statement: 'Write a function f(n) that converts an integer (1-3999) to a Roman numeral string.',
    difficulty: 'medium',
    visible_tests: [
      { input: '3', expected_output: '"III"' },
      { input: '4', expected_output: '"IV"' },
      { input: '1994', expected_output: '"MCMXCIV"' },
    ],
    hidden_tests: [
      { input: '1', expected_output: '"I"' },
      { input: '58', expected_output: '"LVIII"' },
      { input: '3999', expected_output: '"MMMCMXCIX"' },
      { input: '9', expected_output: '"IX"' },
    ],
  },
  {
    id: 'unique_chars',
    statement: 'Write a function f(s) that returns true if all characters in the string are unique, false otherwise.',
    difficulty: 'medium',
    visible_tests: [
      { input: '"abcde"', expected_output: 'true' },
      { input: '"hello"', expected_output: 'false' },
    ],
    hidden_tests: [
      { input: '""', expected_output: 'true' },
      { input: '"a"', expected_output: 'true' },
      { input: '"aA"', expected_output: 'true' },
      { input: '"abcda"', expected_output: 'false' },
    ],
  },
  {
    id: 'caesar_cipher',
    statement: 'Write a function f(s, n) that applies a Caesar cipher shift of n to lowercase letters in string s. Non-lowercase chars stay unchanged. Wrap around z->a.',
    difficulty: 'medium',
    visible_tests: [
      { input: '"abc", 1', expected_output: '"bcd"' },
      { input: '"xyz", 3', expected_output: '"abc"' },
      { input: '"Hello", 1', expected_output: '"Hfmmp"' },
    ],
    hidden_tests: [
      { input: '"", 5', expected_output: '""' },
      { input: '"abc", 26', expected_output: '"abc"' },
      { input: '"z", 1', expected_output: '"a"' },
    ],
  },
  // HARD
  {
    id: 'valid_parentheses',
    statement: 'Write a function f(s) that returns true if the string has valid matching parentheses (), [], {}.',
    difficulty: 'hard',
    visible_tests: [
      { input: '"()"', expected_output: 'true' },
      { input: '"()[]{}"', expected_output: 'true' },
      { input: '"(]"', expected_output: 'false' },
      { input: '"{[]}"', expected_output: 'true' },
    ],
    hidden_tests: [
      { input: '""', expected_output: 'true' },
      { input: '"((("', expected_output: 'false' },
      { input: '"([)]"', expected_output: 'false' },
      { input: '"{[()()]}"', expected_output: 'true' },
    ],
  },
  {
    id: 'longest_common_subsequence',
    statement: 'Write a function f(a, b) that returns the length of the longest common subsequence of two strings.',
    difficulty: 'hard',
    visible_tests: [
      { input: '"abcde", "ace"', expected_output: '3' },
      { input: '"abc", "abc"', expected_output: '3' },
      { input: '"abc", "def"', expected_output: '0' },
    ],
    hidden_tests: [
      { input: '"", ""', expected_output: '0' },
      { input: '"a", "a"', expected_output: '1' },
      { input: '"abcdef", "fbdamn"', expected_output: '2' },
      { input: '"AGGTAB", "GXTXAYB"', expected_output: '4' },
    ],
  },
  {
    id: 'matrix_rotation',
    statement: 'Write a function f(m) that rotates an NxN matrix 90 degrees clockwise and returns the new matrix.',
    difficulty: 'hard',
    visible_tests: [
      { input: '[[1,2],[3,4]]', expected_output: '[[3,1],[4,2]]' },
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected_output: '[[7,4,1],[8,5,2],[9,6,3]]' },
    ],
    hidden_tests: [
      { input: '[[1]]', expected_output: '[[1]]' },
      { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]', expected_output: '[[13,9,5,1],[14,10,6,2],[15,11,7,3],[16,12,8,4]]' },
    ],
  },
  {
    id: 'balanced_binary',
    statement: 'Write a function f(n) that returns all balanced strings of n pairs of parentheses. Return a sorted array.',
    difficulty: 'hard',
    visible_tests: [
      { input: '1', expected_output: '["()"]' },
      { input: '2', expected_output: '["(())","()()"]' },
    ],
    hidden_tests: [
      { input: '0', expected_output: '[]' },
      { input: '3', expected_output: '["((()))","(()())","(())()","()(())","()()()"]' },
    ],
  },
  {
    id: 'run_length_encoding',
    statement: 'Write a function f(s) that returns the run-length encoding of a string. Example: "aaabbc" -> "3a2b1c".',
    difficulty: 'hard',
    visible_tests: [
      { input: '"aaabbc"', expected_output: '"3a2b1c"' },
      { input: '"abc"', expected_output: '"1a1b1c"' },
    ],
    hidden_tests: [
      { input: '""', expected_output: '""' },
      { input: '"aaaa"', expected_output: '"4a"' },
      { input: '"aabbaabb"', expected_output: '"2a2b2a2b"' },
    ],
  },
];

function getProblemsByDifficulty(difficulty: number): Problem[] {
  if (difficulty <= 3) return PROBLEMS.filter(p => p.difficulty === 'easy');
  if (difficulty <= 6) return PROBLEMS.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
  return PROBLEMS; // hard difficulties get all problems
}

/**
 * Safely execute JavaScript code in a Worker thread with hard timeout.
 * The worker is terminated after timeoutMs — prevents infinite loops.
 * No access to process.env, require, or the main thread's scope.
 */
function safeExecuteJS(code: string, input: string, timeoutMs: number = 5000): { output: string; error?: string } {
  // Max code length to prevent amplification
  if (code.length > 4096) {
    return { output: '', error: 'Code too long (max 4096 chars)' };
  }

  try {
    const { Worker } = require('node:worker_threads') as typeof import('node:worker_threads');

    const workerCode = `
      const { parentPort } = require('node:worker_threads');
      try {
        'use strict';
        const fn = new Function('"use strict"; ' + ${JSON.stringify(code)} + '; return JSON.stringify(f(' + ${JSON.stringify(input)} + '));');
        const result = fn();
        parentPort.postMessage({ output: result });
      } catch (e) {
        parentPort.postMessage({ output: '', error: e.message });
      }
    `;

    let result: { output: string; error?: string } = { output: '', error: 'Timeout' };
    let done = false;

    const worker = new Worker(workerCode, { eval: true });

    worker.on('message', (msg: { output: string; error?: string }) => {
      result = msg;
      done = true;
    });

    worker.on('error', (err: Error) => {
      result = { output: '', error: `Worker error: ${err.message}` };
      done = true;
    });

    // Synchronous wait with hard timeout
    const start = Date.now();
    while (!done && Date.now() - start < timeoutMs) {
      // Busy-wait in small increments (worker_threads requires this for sync usage)
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }

    if (!done) {
      worker.terminate();
      return { output: '', error: `Execution exceeded ${timeoutMs}ms timeout (killed)` };
    }

    worker.terminate();
    return result;
  } catch (err) {
    return { output: '', error: `Sandbox error: ${(err as Error).message}` };
  }
}

class CodeGolfEngine implements GameEngine {
  generateConfig(difficulty: number): Record<string, unknown> {
    const d = Math.max(1, Math.min(10, difficulty));
    const candidates = getProblemsByDifficulty(d);
    const problem = candidates[Math.floor(Math.random() * candidates.length)];
    const timeWindow = Math.round(300 - (d - 1) * (180 / 9)); // 300s to 120s

    const allTests = [...problem.visible_tests, ...problem.hidden_tests];

    const config: CodeGolfConfig & { problem_id: string; hidden_test_count: number } = {
      problem_statement: problem.statement,
      test_cases: allTests,
      allowed_languages: ['javascript'],
      time_window_seconds: timeWindow,
      problem_id: problem.id,
      hidden_test_count: problem.hidden_tests.length,
    };
    return config as unknown as Record<string, unknown>;
  }

  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt {
    const config = challenge.config as unknown as CodeGolfConfig & { problem_id: string; hidden_test_count: number };

    // Only show visible test cases to the player
    const problem = PROBLEMS.find(p => p.id === config.problem_id);
    const visibleTests = problem?.visible_tests ?? config.test_cases.slice(0, 2);

    return {
      round_number: 1,
      prompt: {
        problem_statement: config.problem_statement,
        test_cases: visibleTests,
        allowed_languages: config.allowed_languages,
        instructions: 'Write the shortest possible JavaScript code that defines a function f solving the problem. Shorter code scores higher.',
      },
      deadline_seconds: config.time_window_seconds,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    challenge: ArenaChallenge,
    submission: unknown
  ): Promise<ScoreResult> {
    const config = challenge.config as unknown as CodeGolfConfig & { problem_id: string };

    // Validate submission
    if (
      !submission ||
      typeof submission !== 'object' ||
      typeof (submission as { code?: unknown }).code !== 'string'
    ) {
      return {
        score: 0,
        feedback: 'Invalid submission format. Expected { language: string, code: string }',
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), { score: 0, code: null }],
      };
    }

    const { code, language } = submission as { code: string; language?: string };

    if (language && language !== 'javascript') {
      return {
        score: 0,
        feedback: `Language "${language}" not supported in Phase 1. Only JavaScript is available.`,
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), { score: 0, language, reason: 'unsupported_language' }],
      };
    }

    if (code.length === 0) {
      return {
        score: 0,
        feedback: 'Empty code submission.',
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), { score: 0, code_length: 0 }],
      };
    }

    // Run against all test cases (visible + hidden)
    const allTests = config.test_cases;
    let passed = 0;
    const failures: string[] = [];

    for (const test of allTests) {
      const result = safeExecuteJS(code, test.input);
      if (result.error) {
        failures.push(`Input ${test.input}: ${result.error}`);
        continue;
      }

      const expected = test.expected_output.trim();
      const actual = result.output.trim();

      if (actual === expected) {
        passed++;
      } else {
        failures.push(`Input ${test.input}: expected ${expected}, got ${actual}`);
      }
    }

    // Score = correctness percentage * golf multiplier (shorter code = higher multiplier)
    const correctnessRatio = allTests.length > 0 ? passed / allTests.length : 0;
    const correctnessScore = correctnessRatio * 100;
    const golfMultiplier = 1000 / Math.max(code.length, 1);
    const rawScore = correctnessScore * golfMultiplier;
    const score = Math.round(Math.min(rawScore, 10000)); // cap at 10000

    const feedbackParts = [
      `Tests passed: ${passed}/${allTests.length}`,
      `Code length: ${code.length} chars`,
      `Golf multiplier: ${golfMultiplier.toFixed(2)}x`,
    ];
    if (failures.length > 0 && failures.length <= 3) {
      feedbackParts.push(`Failures: ${failures.join('; ')}`);
    } else if (failures.length > 3) {
      feedbackParts.push(`${failures.length} test(s) failed`);
    }

    return {
      score,
      feedback: `Score: ${score}. ${feedbackParts.join('. ')}.`,
      round_complete: true,
      game_complete: true,
      updated_round_data: [...(match.round_data || []), {
        score,
        code_length: code.length,
        tests_passed: passed,
        tests_total: allTests.length,
      }],
    };
  }
}

export const codeGolf = new CodeGolfEngine();
