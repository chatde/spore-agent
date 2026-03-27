import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { MemoryPalaceConfig } from '../types.js';
import type { GameEngine, RoundPrompt, ScoreResult } from './engine.js';

// 120+ factual key-value pairs for the memory bank
const MEMORY_PAIRS: Array<{ key: string; value: string }> = [
  // Geography — Capitals
  { key: 'capital_of_japan', value: 'Tokyo' },
  { key: 'capital_of_australia', value: 'Canberra' },
  { key: 'capital_of_brazil', value: 'Brasilia' },
  { key: 'capital_of_canada', value: 'Ottawa' },
  { key: 'capital_of_egypt', value: 'Cairo' },
  { key: 'capital_of_india', value: 'New Delhi' },
  { key: 'capital_of_turkey', value: 'Ankara' },
  { key: 'capital_of_south_korea', value: 'Seoul' },
  { key: 'capital_of_nigeria', value: 'Abuja' },
  { key: 'capital_of_switzerland', value: 'Bern' },
  { key: 'capital_of_myanmar', value: 'Naypyidaw' },
  { key: 'capital_of_sri_lanka', value: 'Sri Jayawardenepura Kotte' },
  { key: 'capital_of_morocco', value: 'Rabat' },
  { key: 'capital_of_pakistan', value: 'Islamabad' },
  { key: 'capital_of_vietnam', value: 'Hanoi' },

  // Science — Atomic Numbers
  { key: 'atomic_number_gold', value: '79' },
  { key: 'atomic_number_iron', value: '26' },
  { key: 'atomic_number_oxygen', value: '8' },
  { key: 'atomic_number_carbon', value: '6' },
  { key: 'atomic_number_silver', value: '47' },
  { key: 'atomic_number_helium', value: '2' },
  { key: 'atomic_number_neon', value: '10' },
  { key: 'atomic_number_uranium', value: '92' },
  { key: 'atomic_number_mercury', value: '80' },
  { key: 'atomic_number_tin', value: '50' },

  // Science — Chemical Symbols
  { key: 'chemical_symbol_sodium', value: 'Na' },
  { key: 'chemical_symbol_potassium', value: 'K' },
  { key: 'chemical_symbol_tungsten', value: 'W' },
  { key: 'chemical_symbol_lead', value: 'Pb' },
  { key: 'chemical_symbol_antimony', value: 'Sb' },

  // History — Years
  { key: 'year_moon_landing', value: '1969' },
  { key: 'year_titanic_sank', value: '1912' },
  { key: 'year_berlin_wall_fell', value: '1989' },
  { key: 'year_magna_carta', value: '1215' },
  { key: 'year_french_revolution', value: '1789' },
  { key: 'year_columbus_america', value: '1492' },
  { key: 'year_wwi_started', value: '1914' },
  { key: 'year_wwii_ended', value: '1945' },
  { key: 'year_internet_invented', value: '1969' },
  { key: 'year_penicillin_discovered', value: '1928' },
  { key: 'year_gutenberg_press', value: '1440' },
  { key: 'year_american_independence', value: '1776' },
  { key: 'year_russian_revolution', value: '1917' },
  { key: 'year_first_flight', value: '1903' },
  { key: 'year_dna_structure', value: '1953' },

  // Space
  { key: 'planets_in_solar_system', value: '8' },
  { key: 'largest_planet', value: 'Jupiter' },
  { key: 'closest_star', value: 'Proxima Centauri' },
  { key: 'speed_of_light_km_s', value: '299792' },
  { key: 'distance_earth_moon_km', value: '384400' },
  { key: 'hottest_planet', value: 'Venus' },
  { key: 'smallest_planet', value: 'Mercury' },
  { key: 'largest_moon_jupiter', value: 'Ganymede' },
  { key: 'rings_of_saturn_main_groups', value: '7' },
  { key: 'age_of_universe_billion_years', value: '13.8' },

  // Math Constants
  { key: 'pi_to_5_digits', value: '3.14159' },
  { key: 'eulers_number_to_4_digits', value: '2.7183' },
  { key: 'golden_ratio_to_4_digits', value: '1.6180' },
  { key: 'square_root_of_2', value: '1.4142' },
  { key: 'avogadro_number_exponent', value: '23' },

  // Biology
  { key: 'bones_in_human_body', value: '206' },
  { key: 'chromosomes_in_human_cell', value: '46' },
  { key: 'chambers_in_human_heart', value: '4' },
  { key: 'blood_types_main', value: '4' },
  { key: 'teeth_in_adult_human', value: '32' },
  { key: 'muscles_in_human_body', value: '600' },
  { key: 'percentage_water_human_body', value: '60' },
  { key: 'largest_organ_human_body', value: 'skin' },
  { key: 'smallest_bone_human_body', value: 'stapes' },
  { key: 'fastest_muscle_human_body', value: 'orbicularis oculi' },

  // Technology
  { key: 'inventor_of_telephone', value: 'Alexander Graham Bell' },
  { key: 'inventor_of_light_bulb', value: 'Thomas Edison' },
  { key: 'creator_of_linux', value: 'Linus Torvalds' },
  { key: 'creator_of_python', value: 'Guido van Rossum' },
  { key: 'creator_of_javascript', value: 'Brendan Eich' },
  { key: 'founder_of_apple', value: 'Steve Jobs' },
  { key: 'founder_of_amazon', value: 'Jeff Bezos' },
  { key: 'founder_of_tesla', value: 'Elon Musk' },
  { key: 'year_first_iphone', value: '2007' },
  { key: 'year_bitcoin_whitepaper', value: '2008' },

  // Geography — Rivers/Mountains
  { key: 'longest_river', value: 'Nile' },
  { key: 'tallest_mountain', value: 'Everest' },
  { key: 'deepest_ocean_trench', value: 'Mariana Trench' },
  { key: 'largest_desert', value: 'Sahara' },
  { key: 'largest_ocean', value: 'Pacific' },
  { key: 'largest_lake_by_area', value: 'Caspian Sea' },
  { key: 'longest_mountain_range', value: 'Andes' },
  { key: 'tallest_waterfall', value: 'Angel Falls' },

  // Languages
  { key: 'most_spoken_language', value: 'English' },
  { key: 'hello_in_japanese', value: 'Konnichiwa' },
  { key: 'hello_in_swahili', value: 'Jambo' },
  { key: 'hello_in_arabic', value: 'Marhaba' },
  { key: 'hello_in_mandarin', value: 'Ni Hao' },

  // Music
  { key: 'beethoven_birth_year', value: '1770' },
  { key: 'notes_in_octave', value: '12' },
  { key: 'strings_on_standard_guitar', value: '6' },
  { key: 'keys_on_piano', value: '88' },
  { key: 'beethoven_symphonies_count', value: '9' },

  // Literature
  { key: 'author_of_hamlet', value: 'Shakespeare' },
  { key: 'author_of_1984', value: 'George Orwell' },
  { key: 'author_of_don_quixote', value: 'Cervantes' },
  { key: 'author_of_war_and_peace', value: 'Tolstoy' },
  { key: 'author_of_odyssey', value: 'Homer' },

  // Sports
  { key: 'players_in_football_team', value: '11' },
  { key: 'rings_in_olympic_symbol', value: '5' },
  { key: 'length_marathon_miles', value: '26.2' },
  { key: 'holes_in_golf_round', value: '18' },
  { key: 'points_for_touchdown', value: '6' },

  // Misc Fun Facts
  { key: 'sides_of_a_dodecahedron', value: '12' },
  { key: 'boiling_point_water_fahrenheit', value: '212' },
  { key: 'freezing_point_water_celsius', value: '0' },
  { key: 'hours_in_a_week', value: '168' },
  { key: 'seconds_in_an_hour', value: '3600' },
  { key: 'days_in_leap_year', value: '366' },
  { key: 'cards_in_standard_deck', value: '52' },
  { key: 'squares_on_chess_board', value: '64' },
  { key: 'us_states_count', value: '50' },
  { key: 'countries_in_africa', value: '54' },
  { key: 'colors_in_rainbow', value: '7' },
  { key: 'great_wonders_ancient_world', value: '7' },
  { key: 'degrees_in_triangle', value: '180' },
  { key: 'feet_in_mile', value: '5280' },
  { key: 'ounces_in_pound', value: '16' },
];

interface StoredRoundData {
  round_number: number;
  pairs_shown: Array<{ key: string; value: string }>;
  questions_asked?: string[];
  answers_correct?: boolean;
  all_pairs_so_far: Array<{ key: string; value: string }>;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickUniquePairs(count: number, exclude: Set<string>): Array<{ key: string; value: string }> {
  const available = MEMORY_PAIRS.filter(p => !exclude.has(p.key));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

class MemoryPalaceEngine implements GameEngine {
  generateConfig(difficulty: number): Record<string, unknown> {
    const d = Math.max(1, Math.min(10, difficulty));
    const config: MemoryPalaceConfig = {
      initial_pairs: Math.round(3 + (d - 1) * (5 / 9)),       // 3 to 8
      pairs_per_round: Math.round(3 + (d - 1) * (3 / 9)),     // 3 to 6
      max_rounds: Math.round(10 + (d - 1) * (20 / 9)),        // 10 to 30
      time_per_round_seconds: Math.round(60 - (d - 1) * (40 / 9)), // 60 to 20
    };
    return config as unknown as Record<string, unknown>;
  }

  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt {
    const config = challenge.config as unknown as MemoryPalaceConfig;
    const roundNumber = (match.round_data?.length ?? 0) + 1;

    // Gather all pairs shown so far
    const previousRounds = (match.round_data || []) as StoredRoundData[];
    const allPairsSoFar: Array<{ key: string; value: string }> = [];
    const usedKeys = new Set<string>();

    for (const rd of previousRounds) {
      if (rd.all_pairs_so_far) {
        for (const p of rd.all_pairs_so_far) {
          if (!usedKeys.has(p.key)) {
            allPairsSoFar.push(p);
            usedKeys.add(p.key);
          }
        }
      }
    }

    const pairsToShow = roundNumber === 1
      ? config.initial_pairs
      : config.pairs_per_round;

    const newPairs = pickUniquePairs(pairsToShow, usedKeys);
    const updatedAllPairs = [...allPairsSoFar, ...newPairs];

    // For round 2+, also ask questions about previous pairs
    let questions: string[] = [];
    if (roundNumber > 1 && allPairsSoFar.length > 0) {
      const shuffledPrevious = shuffleArray(allPairsSoFar);
      const questionCount = Math.min(
        Math.max(2, Math.floor(roundNumber / 2) + 1),
        shuffledPrevious.length
      );
      questions = shuffledPrevious.slice(0, questionCount).map(p => p.key);
    }

    // Store round data for scoring
    const roundData: StoredRoundData = {
      round_number: roundNumber,
      pairs_shown: newPairs,
      questions_asked: questions,
      all_pairs_so_far: updatedAllPairs,
    };

    const prompt: Record<string, unknown> = {
      memorize: newPairs,
      total_pairs_memorized: updatedAllPairs.length,
    };

    if (questions.length > 0) {
      prompt.questions = questions.map(k => `What is the value for "${k}"?`);
      prompt.question_keys = questions;
      prompt.instructions = 'Memorize the new pairs, then answer the questions about previously shown pairs. Submit answers as { answers: { "key": "value", ... } }';
    } else {
      prompt.instructions = 'Memorize these pairs. In the next round, you will be asked to recall them. Submit an empty answers object to proceed: { answers: {} }';
    }

    // We need to return round_data with the stored info for scoring
    prompt._round_data = roundData;

    return {
      round_number: roundNumber,
      prompt,
      deadline_seconds: config.time_per_round_seconds,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    challenge: ArenaChallenge,
    submission: unknown
  ): Promise<ScoreResult> {
    const config = challenge.config as unknown as MemoryPalaceConfig;
    const roundNumber = (match.round_data?.length ?? 0) + 1;

    // Validate submission
    if (
      !submission ||
      typeof submission !== 'object' ||
      typeof (submission as { answers?: unknown }).answers !== 'object'
    ) {
      return {
        score: roundNumber - 1,
        feedback: 'Invalid submission format. Expected { answers: Record<string, string> }. Game over.',
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), {
          round_number: roundNumber,
          answers_correct: false,
          reason: 'invalid_format',
        }],
      };
    }

    const answers = (submission as { answers: Record<string, string> }).answers || {};

    // Get current round stored data
    const previousRounds = (match.round_data || []) as StoredRoundData[];
    const lastRound = previousRounds[previousRounds.length - 1] as StoredRoundData | undefined;

    // Gather all pairs for lookup
    const pairMap = new Map<string, string>();
    if (lastRound?.all_pairs_so_far) {
      for (const p of lastRound.all_pairs_so_far) {
        pairMap.set(p.key.toLowerCase(), p.value.toLowerCase());
      }
    }

    const questionsAsked = lastRound?.questions_asked || [];

    // Round 1: no questions, just memorize — auto-pass
    if (questionsAsked.length === 0) {
      const roundData: StoredRoundData = {
        round_number: roundNumber,
        pairs_shown: lastRound?.pairs_shown || [],
        answers_correct: true,
        all_pairs_so_far: lastRound?.all_pairs_so_far || [],
      };

      const gameComplete = roundNumber >= config.max_rounds;
      return {
        score: roundNumber,
        feedback: `Round ${roundNumber}: Pairs memorized. ${gameComplete ? 'Max rounds reached!' : 'Get ready for recall questions next round.'}`,
        round_complete: true,
        game_complete: gameComplete,
        updated_round_data: [...(match.round_data || []), roundData],
      };
    }

    // Check answers (case-insensitive)
    let allCorrect = true;
    const wrongAnswers: string[] = [];

    for (const questionKey of questionsAsked) {
      const expected = pairMap.get(questionKey.toLowerCase());
      const given = (answers[questionKey] || '').trim().toLowerCase();

      if (!expected || given !== expected) {
        allCorrect = false;
        wrongAnswers.push(`"${questionKey}": expected "${expected || '?'}", got "${given || '(no answer)'}"`);
      }
    }

    if (!allCorrect) {
      // Game over — any wrong answer ends the game
      return {
        score: roundNumber - 1, // score = round reached (not counting this failed round)
        feedback: `Round ${roundNumber}: Incorrect answers! ${wrongAnswers.join('; ')}. Game over. You reached round ${roundNumber - 1}.`,
        round_complete: true,
        game_complete: true,
        updated_round_data: [...(match.round_data || []), {
          round_number: roundNumber,
          answers_correct: false,
          wrong_answers: wrongAnswers,
          all_pairs_so_far: lastRound?.all_pairs_so_far || [],
        }],
      };
    }

    // All correct — continue
    const gameComplete = roundNumber >= config.max_rounds;
    const roundData: StoredRoundData = {
      round_number: roundNumber,
      pairs_shown: lastRound?.pairs_shown || [],
      questions_asked: questionsAsked,
      answers_correct: true,
      all_pairs_so_far: lastRound?.all_pairs_so_far || [],
    };

    return {
      score: roundNumber,
      feedback: `Round ${roundNumber}: All ${questionsAsked.length} answers correct! ${gameComplete ? 'Maximum rounds reached — perfect memory!' : `Total pairs memorized: ${pairMap.size}. Next round incoming.`}`,
      round_complete: true,
      game_complete: gameComplete,
      updated_round_data: [...(match.round_data || []), roundData],
    };
  }
}

export const memoryPalace = new MemoryPalaceEngine();
