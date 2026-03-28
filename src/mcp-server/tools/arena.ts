import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import type { ArenaChallenge, ArenaMatch, GameType } from "../arena/types.js";
import type { GameEngine } from "../arena/games/engine.js";
import { patternSiege } from "../arena/games/pattern-siege.js";
import { promptDuel } from "../arena/games/prompt-duel.js";
import { codeGolf } from "../arena/games/code-golf.js";
import { memoryPalace } from "../arena/games/memory-palace.js";
import { ALL_GAMES } from "../arena/games/all-games.js";

const LEGACY_ENGINES: Record<string, GameEngine> = {
  pattern_siege: patternSiege,
  prompt_duel: promptDuel,
  code_golf: codeGolf,
  memory_palace: memoryPalace,
};

function getEngine(gameType: GameType | string): GameEngine {
  // Try legacy engines first (they have richer game-specific logic)
  if (gameType in LEGACY_ENGINES) return LEGACY_ENGINES[gameType];
  // Then try the 100-game catalog
  if (gameType in ALL_GAMES) return ALL_GAMES[gameType];
  throw new Error(`Unknown game type: ${gameType}`);
}

export function registerArenaTools(server: McpServer): void {
  // --- Browse open challenges ---
  server.registerTool(
    "spore_arena_browse",
    {
      title: "Browse Arena Challenges",
      description:
        "Browse open arena challenges. Optionally filter by game type.",
      inputSchema: {
        game_type: z
          .string()
          .optional()
          .describe(
            "Filter by game type: pattern_siege, prompt_duel, code_golf, memory_palace"
          ),
        limit: z
          .number()
          .default(20)
          .describe("Maximum number of challenges to return (default 20)"),
      },
    },
    async ({ game_type, limit }) => {
      const challenges = await store.getOpenChallenges(
        game_type as GameType | undefined
      );
      const result = challenges.slice(0, limit).map((c) => ({
        challenge_id: c.id,
        game_type: c.game_type,
        difficulty: c.difficulty,
        entry_fee_cog: c.entry_fee_cog,
        reward_pool_cog: c.reward_pool_cog,
        max_participants: c.max_participants,
        status: c.status,
        created_at: c.created_at,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { total: result.length, challenges: result },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Join a challenge ---
  server.registerTool(
    "spore_arena_join",
    {
      title: "Join Arena Challenge",
      description:
        "Join an open arena challenge. Deducts the entry fee and starts your match.",
      inputSchema: {
        agent_id: z.string().describe("Your agent ID"),
        challenge_id: z.string().describe("The challenge to join"),
      },
    },
    async ({ agent_id, challenge_id }) => {
      // Validate agent
      const agent = await store.getAgent(agent_id);
      if (!agent) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Agent not found" }, null, 2),
            },
          ],
        };
      }

      // Validate challenge
      const challenge = await store.getChallenge(challenge_id);
      if (!challenge) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Challenge not found" }, null, 2),
            },
          ],
        };
      }
      if (challenge.status !== "open") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: `Challenge is not open (status: ${challenge.status})` },
                null,
                2
              ),
            },
          ],
        };
      }

      // Check agent not already in challenge
      const existingMatches = await store.getChallengeMatches(challenge_id);
      if (existingMatches.some((m) => m.agent_id === agent_id)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: "Agent already joined this challenge" },
                null,
                2
              ),
            },
          ],
        };
      }

      // Check balance for entry fee
      if (challenge.entry_fee_cog > 0) {
        const balance = await store.getTokenBalance(agent_id);
        if (!balance || balance.balance < challenge.entry_fee_cog) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    error: "Insufficient COG balance for entry fee",
                    required: challenge.entry_fee_cog,
                    current_balance: balance?.balance ?? 0,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Debit entry fee
        await store.debitTokens(
          agent_id,
          challenge.entry_fee_cog,
          "arena_entry_fee",
          challenge_id
        );
      }

      // Create match
      const match: ArenaMatch = {
        id: crypto.randomUUID(),
        challenge_id,
        agent_id,
        status: "joined",
        score: 0,
        round_data: [],
        cog_earned: 0,
      };
      await store.createMatch(match);

      // Check if max participants reached
      const allMatches = await store.getChallengeMatches(challenge_id);
      if (allMatches.length >= challenge.max_participants) {
        await store.updateChallenge(challenge_id, { status: "active" });
      }

      // Start the first round
      const engine = getEngine(challenge.game_type);
      const roundPrompt = engine.startRound(match, challenge);

      // Update match to playing and store the round prompt data
      await store.updateMatch(match.id, {
        status: "playing",
        started_at: new Date().toISOString(),
        round_data: [roundPrompt.prompt],
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id: match.id,
                challenge_id,
                game_type: challenge.game_type,
                round: roundPrompt.round_number,
                prompt: roundPrompt.prompt,
                deadline_seconds: roundPrompt.deadline_seconds,
                message: `Joined challenge. Round ${roundPrompt.round_number} started.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Get current round ---
  server.registerTool(
    "spore_arena_get_round",
    {
      title: "Get Arena Round",
      description: "Get the current round prompt for an active match.",
      inputSchema: {
        match_id: z.string().describe("The match ID"),
      },
    },
    async ({ match_id }) => {
      const match = await store.getMatch(match_id);
      if (!match) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Match not found" }, null, 2),
            },
          ],
        };
      }

      const challenge = await store.getChallenge(match.challenge_id);
      if (!challenge) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Challenge not found" }, null, 2),
            },
          ],
        };
      }

      const engine = getEngine(challenge.game_type);
      const roundPrompt = engine.startRound(match, challenge);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id: match.id,
                game_type: challenge.game_type,
                status: match.status,
                round: roundPrompt.round_number,
                prompt: roundPrompt.prompt,
                deadline_seconds: roundPrompt.deadline_seconds,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Submit answer ---
  server.registerTool(
    "spore_arena_submit",
    {
      title: "Submit Arena Answer",
      description:
        "Submit your answer/solution for the current arena round.",
      inputSchema: {
        match_id: z.string().describe("The match ID"),
        submission: z
          .record(z.string(), z.unknown())
          .describe(
            "Your submission object (format depends on game type)"
          ),
      },
    },
    async ({ match_id, submission }) => {
      const match = await store.getMatch(match_id);
      if (!match) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Match not found" }, null, 2),
            },
          ],
        };
      }
      if (match.status !== "playing") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  error: `Match is not in playing state (status: ${match.status})`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      const challenge = await store.getChallenge(match.challenge_id);
      if (!challenge) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Challenge not found" }, null, 2),
            },
          ],
        };
      }

      const engine = getEngine(challenge.game_type);
      const scoreResult = await engine.scoreSubmission(
        match,
        challenge,
        submission
      );

      // Update match with score and round data
      const updates: Partial<ArenaMatch> = {
        score: scoreResult.score,
        round_data: scoreResult.updated_round_data,
        submission,
        submitted_at: new Date().toISOString(),
      };

      let cogEarned = 0;

      if (scoreResult.game_complete) {
        updates.status = "scored";
        updates.scored_at = new Date().toISOString();

        // Calculate COG reward
        const baseReward =
          challenge.reward_pool_cog / challenge.max_participants;
        cogEarned = Math.round(baseReward * (scoreResult.score / 100));

        if (cogEarned > 0) {
          const reason =
            scoreResult.score >= 70 ? "arena_win" : "arena_partial";
          await store.creditTokens(
            match.agent_id,
            cogEarned,
            reason,
            match.id
          );
        }

        updates.cog_earned = cogEarned;
      }

      await store.updateMatch(match.id, updates);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id: match.id,
                score: scoreResult.score,
                feedback: scoreResult.feedback,
                round_complete: scoreResult.round_complete,
                game_complete: scoreResult.game_complete,
                cog_earned: cogEarned,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Match status ---
  server.registerTool(
    "spore_arena_status",
    {
      title: "Arena Match Status",
      description: "Get the full status of an arena match.",
      inputSchema: {
        match_id: z.string().describe("The match ID"),
      },
    },
    async ({ match_id }) => {
      const match = await store.getMatch(match_id);
      if (!match) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Match not found" }, null, 2),
            },
          ],
        };
      }

      const challenge = await store.getChallenge(match.challenge_id);
      const agent = await store.getAgent(match.agent_id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id: match.id,
                challenge_id: match.challenge_id,
                game_type: challenge?.game_type ?? "unknown",
                agent_id: match.agent_id,
                agent_name: agent?.name ?? "Unknown",
                status: match.status,
                score: match.score,
                cog_earned: match.cog_earned,
                rounds_completed: match.round_data?.length ?? 0,
                started_at: match.started_at ?? null,
                submitted_at: match.submitted_at ?? null,
                scored_at: match.scored_at ?? null,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Token balance ---
  server.registerTool(
    "spore_arena_balance",
    {
      title: "Arena Token Balance",
      description:
        "Check an agent's COG token balance and recent transactions.",
      inputSchema: {
        agent_id: z.string().describe("The agent ID"),
      },
    },
    async ({ agent_id }) => {
      const balance = await store.getTokenBalance(agent_id);
      const transactions = await store.getTokenTransactions(agent_id, 10);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                agent_id,
                balance: balance?.balance ?? 0,
                lifetime_earned: balance?.lifetime_earned ?? 0,
                recent_transactions: transactions.map((t) => ({
                  id: t.id,
                  amount: t.amount,
                  reason: t.reason,
                  reference_id: t.reference_id ?? null,
                  created_at: t.created_at,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Leaderboard ---
  server.registerTool(
    "spore_arena_leaderboard",
    {
      title: "Arena Leaderboard",
      description: "View the top arena agents ranked by COG earnings.",
      inputSchema: {
        limit: z
          .number()
          .default(25)
          .describe("Number of entries to return (default 25)"),
      },
    },
    async ({ limit }) => {
      const leaderboard = await store.getArenaLeaderboard(limit);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                total: leaderboard.length,
                leaderboard: leaderboard.map((entry, index) => ({
                  rank: index + 1,
                  ...entry,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // --- Create challenge ---
  server.registerTool(
    "spore_arena_create_challenge",
    {
      title: "Create Arena Challenge",
      description:
        "Create a new arena challenge. The reward pool is escrowed from the creator's COG balance.",
      inputSchema: {
        agent_id: z.string().describe("Creator agent ID"),
        game_type: z
          .string()
          .describe(
            "Game type: pattern_siege, prompt_duel, code_golf, memory_palace"
          ),
        difficulty: z
          .number()
          .default(5)
          .describe("Difficulty level 1-10 (default 5)"),
        reward_pool_cog: z
          .number()
          .default(100)
          .describe("Total COG reward pool (default 100)"),
        max_participants: z
          .number()
          .default(4)
          .describe("Maximum number of participants (default 4)"),
      },
    },
    async ({
      agent_id,
      game_type,
      difficulty,
      reward_pool_cog,
      max_participants,
    }) => {
      // Validate agent
      const agent = await store.getAgent(agent_id);
      if (!agent) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "Agent not found" }, null, 2),
            },
          ],
        };
      }

      // Validate game type
      const validTypes: GameType[] = [
        "pattern_siege",
        "prompt_duel",
        "code_golf",
        "memory_palace",
      ];
      if (!validTypes.includes(game_type as GameType)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  error: `Invalid game type: ${game_type}. Valid: ${validTypes.join(", ")}`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Check balance for reward pool escrow
      if (reward_pool_cog > 0) {
        const balance = await store.getTokenBalance(agent_id);
        if (!balance || balance.balance < reward_pool_cog) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    error: "Insufficient COG balance for reward pool",
                    required: reward_pool_cog,
                    current_balance: balance?.balance ?? 0,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Debit reward pool as escrow
        await store.debitTokens(
          agent_id,
          reward_pool_cog,
          "arena_entry_fee",
          "escrow"
        );
      }

      // Generate game config
      const engine = getEngine(game_type as GameType);
      const config = engine.generateConfig(difficulty);

      // Calculate entry fee: 10% of reward pool / max_participants
      const entryFee = Math.round(
        (reward_pool_cog * 0.1) / max_participants
      );

      const challenge: ArenaChallenge = {
        id: crypto.randomUUID(),
        game_type: game_type as GameType,
        difficulty,
        config,
        status: "open",
        entry_fee_cog: entryFee,
        reward_pool_cog,
        max_participants,
        created_at: new Date().toISOString(),
      };

      await store.createChallenge(challenge);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                challenge_id: challenge.id,
                game_type: challenge.game_type,
                difficulty: challenge.difficulty,
                entry_fee_cog: challenge.entry_fee_cog,
                reward_pool_cog: challenge.reward_pool_cog,
                max_participants: challenge.max_participants,
                config,
                message: `Challenge created. Entry fee: ${entryFee} COG. Reward pool: ${reward_pool_cog} COG.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
