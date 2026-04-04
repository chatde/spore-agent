/**
 * Duel MCP Tools — spore_challenge, spore_duel_move, spore_ratings, spore_duel_leaderboard
 *
 * Head-to-head duel system with multi-dimensional ELO ratings.
 * Stores state in duel_matches and agent_ratings Supabase tables.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { supabase } from "../supabase.js";
import type { DuelState } from "../arena/duel-engine.js";
import { bluffCoup } from "../arena/games/bluff-coup.js";
import { adversarialNegotiation } from "../arena/games/adversarial-negotiation.js";
import { updateElo, updateMultiDimElo } from "../arena/elo.js";
import type { DuelEngine } from "../arena/duel-engine.js";

// ─── Engine registry ──────────────────────────────────────────────────────────

const DUEL_ENGINES: Record<string, DuelEngine> = {
  BLUFF_COUP: bluffCoup,
  ADVERSARIAL_NEGOTIATION: adversarialNegotiation,
};

function getDuelEngine(gameType: string): DuelEngine {
  const engine = DUEL_ENGINES[gameType];
  if (!engine) throw new Error(`Unknown duel game type: ${gameType}`);
  return engine;
}

// ─── Default ratings ──────────────────────────────────────────────────────────

const DEFAULT_RATINGS = {
  deception_rating: 1200,
  strategy_rating: 1200,
  consistency_rating: 1200,
  creativity_rating: 1200,
  overall_rating: 1200,
  games_played: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Determine per-dimension outcome from dimension score deltas */
function dimOutcome(
  scoreA: number,
  scoreB: number
): "a" | "b" | "draw" {
  if (scoreA > scoreB) return "a";
  if (scoreB > scoreA) return "b";
  return "draw";
}

/** Update agent_ratings row after a completed duel */
async function applyEloUpdate(
  agentId: string,
  opponent: string,
  outcome: "a" | "b" | "draw",
  isAgentA: boolean,
  dimensionScoresA: { deception: number; strategy: number; consistency: number; creativity: number },
  dimensionScoresB: { deception: number; strategy: number; consistency: number; creativity: number }
): Promise<void> {
  if (!supabase) return;

  // Fetch current ratings for both agents
  const { data: rowA } = await supabase
    .from("agent_ratings")
    .select("*")
    .eq("agent_id", isAgentA ? agentId : opponent)
    .single();
  const { data: rowB } = await supabase
    .from("agent_ratings")
    .select("*")
    .eq("agent_id", isAgentA ? opponent : agentId)
    .single();

  const ratingsA = rowA ?? { ...DEFAULT_RATINGS, agent_id: isAgentA ? agentId : opponent };
  const ratingsB = rowB ?? { ...DEFAULT_RATINGS, agent_id: isAgentA ? opponent : agentId };

  // Multi-dim ELO update
  const { newA, newB } = updateMultiDimElo(
    {
      deception: ratingsA.deception_rating,
      strategy: ratingsA.strategy_rating,
      consistency: ratingsA.consistency_rating,
      creativity: ratingsA.creativity_rating,
    },
    {
      deception: ratingsB.deception_rating,
      strategy: ratingsB.strategy_rating,
      consistency: ratingsB.consistency_rating,
      creativity: ratingsB.creativity_rating,
    },
    {
      deception: dimOutcome(dimensionScoresA.deception, dimensionScoresB.deception),
      strategy: dimOutcome(dimensionScoresA.strategy, dimensionScoresB.strategy),
      consistency: dimOutcome(dimensionScoresA.consistency, dimensionScoresB.consistency),
      creativity: dimOutcome(dimensionScoresA.creativity, dimensionScoresB.creativity),
    }
  );

  // Overall ELO (single-number outcome)
  const { newA: overallA, newB: overallB } = updateElo(
    ratingsA.overall_rating,
    ratingsB.overall_rating,
    outcome
  );

  const aIsWinner = outcome === "a";
  const bIsWinner = outcome === "b";
  const isDraw = outcome === "draw";

  // Upsert A
  await supabase.from("agent_ratings").upsert({
    agent_id: ratingsA.agent_id,
    deception_rating: newA.deception,
    strategy_rating: newA.strategy,
    consistency_rating: newA.consistency,
    creativity_rating: newA.creativity,
    overall_rating: overallA,
    games_played: (ratingsA.games_played ?? 0) + 1,
    wins: (ratingsA.wins ?? 0) + (aIsWinner ? 1 : 0),
    losses: (ratingsA.losses ?? 0) + (bIsWinner ? 1 : 0),
    draws: (ratingsA.draws ?? 0) + (isDraw ? 1 : 0),
    updated_at: new Date().toISOString(),
  });

  // Upsert B
  await supabase.from("agent_ratings").upsert({
    agent_id: ratingsB.agent_id,
    deception_rating: newB.deception,
    strategy_rating: newB.strategy,
    consistency_rating: newB.consistency,
    creativity_rating: newB.creativity,
    overall_rating: overallB,
    games_played: (ratingsB.games_played ?? 0) + 1,
    wins: (ratingsB.wins ?? 0) + (bIsWinner ? 1 : 0),
    losses: (ratingsB.losses ?? 0) + (aIsWinner ? 1 : 0),
    draws: (ratingsB.draws ?? 0) + (isDraw ? 1 : 0),
    updated_at: new Date().toISOString(),
  });
}

// ─── Tool registration ────────────────────────────────────────────────────────

export function registerDuelTools(server: McpServer): void {
  // ── spore_challenge ────────────────────────────────────────────────────────
  server.registerTool(
    "spore_challenge",
    {
      title: "Challenge Agent to Duel",
      description:
        "Challenge another agent to a head-to-head duel (BLUFF_COUP or ADVERSARIAL_NEGOTIATION). " +
        "Creates a duel match and returns each player's private starting view.",
      inputSchema: {
        challenger: z.string().describe("Agent ID of the challenger"),
        opponent: z.string().describe("Agent ID of the opponent"),
        game_type: z
          .enum(["BLUFF_COUP", "ADVERSARIAL_NEGOTIATION"])
          .describe("Which duel game to play"),
      },
    },
    async ({ challenger, opponent, game_type }) => {
      if (!supabase) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Supabase not configured" }, null, 2) }],
        };
      }

      if (challenger === opponent) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Challenger and opponent must be different agents" }, null, 2) }],
        };
      }

      // Ensure both agents exist
      const [{ data: agentA }, { data: agentB }] = await Promise.all([
        supabase.from("agents").select("id, name").eq("id", challenger).single(),
        supabase.from("agents").select("id, name").eq("id", opponent).single(),
      ]);

      if (!agentA) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Challenger not found: ${challenger}` }, null, 2) }],
        };
      }
      if (!agentB) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Opponent not found: ${opponent}` }, null, 2) }],
        };
      }

      const engine = getDuelEngine(game_type);
      const duelState: DuelState = engine.initDuel(challenger, opponent);

      // Insert duel match — store full DuelState in `state` column
      const matchId = crypto.randomUUID();
      const { error: insertErr } = await supabase.from("duel_matches").insert({
        id: matchId,
        agent_a: challenger,
        agent_b: opponent,
        game_type,
        state: duelState as unknown as Record<string, unknown>,
        state_a: duelState.privateStateA,
        state_b: duelState.privateStateB,
        status: "active",
        created_at: new Date().toISOString(),
      });

      if (insertErr) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Failed to create duel: ${insertErr.message}` }, null, 2) }],
        };
      }

      // Ensure agent_ratings rows exist for both (upsert with ignore on conflict)
      await Promise.all([
        supabase.from("agent_ratings").upsert(
          { agent_id: challenger, ...DEFAULT_RATINGS, updated_at: new Date().toISOString() },
          { onConflict: "agent_id", ignoreDuplicates: true }
        ),
        supabase.from("agent_ratings").upsert(
          { agent_id: opponent, ...DEFAULT_RATINGS, updated_at: new Date().toISOString() },
          { onConflict: "agent_id", ignoreDuplicates: true }
        ),
      ]);

      const playerViewA = engine.getPlayerView(duelState, challenger);
      const playerViewB = engine.getPlayerView(duelState, opponent);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id: matchId,
                game_type,
                challenger: agentA.name,
                opponent: agentB.name,
                status: "active",
                player_view_a: playerViewA,
                player_view_b: playerViewB,
                message: `Duel created. ${agentA.name} vs ${agentB.name}. Use spore_duel_move to submit moves.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ── spore_duel_move ────────────────────────────────────────────────────────
  server.registerTool(
    "spore_duel_move",
    {
      title: "Submit Duel Move",
      description:
        "Submit a move in an active duel. Validates it is your turn, applies the move, " +
        "and scores + updates ELO ratings if the duel is complete.",
      inputSchema: {
        match_id: z.string().describe("The duel match ID"),
        agent_id: z.string().describe("Your agent ID"),
        move: z
          .record(z.string(), z.unknown())
          .describe("Your move object (format depends on game type — see player_view instructions)"),
      },
    },
    async ({ match_id, agent_id, move }) => {
      if (!supabase) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Supabase not configured" }, null, 2) }],
        };
      }

      // Fetch match
      const { data: row } = await supabase
        .from("duel_matches")
        .select("*")
        .eq("id", match_id)
        .single();

      if (!row) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Duel match not found" }, null, 2) }],
        };
      }
      if (row.status !== "active") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: `Duel is not active (status: ${row.status})`, status: row.status },
                null,
                2
              ),
            },
          ],
        };
      }

      if (agent_id !== row.agent_a && agent_id !== row.agent_b) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Agent is not a participant in this duel" }, null, 2) }],
        };
      }

      // Deserialize state
      const duelState = row.state as unknown as DuelState;
      const engine = getDuelEngine(row.game_type);

      // Validate turn — check sharedState.currentTurn
      const shared = duelState.sharedState as { currentTurn?: "a" | "b" };
      const isAgentA = agent_id === row.agent_a;
      const agentSlot: "a" | "b" = isAgentA ? "a" : "b";
      if (shared.currentTurn && shared.currentTurn !== agentSlot) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  error: "Not your turn",
                  your_slot: agentSlot,
                  current_turn: shared.currentTurn,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Apply move
      const newState = engine.applyMove(duelState, agent_id, move);
      const isComplete = engine.isDuelComplete(newState);

      let result: Awaited<ReturnType<DuelEngine["scoreDuel"]>> | undefined;

      if (isComplete) {
        // Score the duel
        result = await engine.scoreDuel(newState, null, null);

        const dimensionDeltas = result.dimensionDeltas as {
          a: { deception: number; strategy: number; consistency: number; creativity: number };
          b: { deception: number; strategy: number; consistency: number; creativity: number };
        };

        // Persist completed match
        await supabase.from("duel_matches").update({
          state: newState as unknown as Record<string, unknown>,
          state_a: newState.privateStateA,
          state_b: newState.privateStateB,
          winner: result.winner,
          score_a: result.scoreA,
          score_b: result.scoreB,
          dimension_deltas: dimensionDeltas,
          status: "complete",
          completed_at: new Date().toISOString(),
        }).eq("id", match_id);

        // Update ELO ratings
        await applyEloUpdate(
          row.agent_a,
          row.agent_b,
          result.winner,
          true,
          dimensionDeltas.a,
          dimensionDeltas.b
        );
      } else {
        // Persist in-progress state
        await supabase.from("duel_matches").update({
          state: newState as unknown as Record<string, unknown>,
          state_a: newState.privateStateA,
          state_b: newState.privateStateB,
        }).eq("id", match_id);
      }

      const yourView = engine.getPlayerView(newState, agent_id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                match_id,
                your_view: yourView,
                is_complete: isComplete,
                ...(result
                  ? {
                      result: {
                        winner: result.winner,
                        score_a: result.scoreA,
                        score_b: result.scoreB,
                        rationale: result.judgeRationale,
                      },
                    }
                  : {}),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ── spore_ratings ──────────────────────────────────────────────────────────
  server.registerTool(
    "spore_ratings",
    {
      title: "Get Agent Duel Ratings",
      description:
        "Get an agent's multi-dimensional ELO ratings across deception, strategy, consistency, " +
        "creativity, and overall, plus games played / wins / losses / draws.",
      inputSchema: {
        agent_id: z.string().describe("The agent ID to look up"),
      },
    },
    async ({ agent_id }) => {
      if (!supabase) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Supabase not configured" }, null, 2) }],
        };
      }

      const { data } = await supabase
        .from("agent_ratings")
        .select("*")
        .eq("agent_id", agent_id)
        .single();

      const ratings = data ?? { agent_id, ...DEFAULT_RATINGS };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                agent_id: ratings.agent_id,
                ratings: {
                  overall: ratings.overall_rating,
                  deception: ratings.deception_rating,
                  strategy: ratings.strategy_rating,
                  consistency: ratings.consistency_rating,
                  creativity: ratings.creativity_rating,
                },
                record: {
                  games_played: ratings.games_played,
                  wins: ratings.wins,
                  losses: ratings.losses,
                  draws: ratings.draws,
                  win_rate:
                    ratings.games_played > 0
                      ? Math.round((ratings.wins / ratings.games_played) * 100)
                      : null,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ── spore_duel_leaderboard ─────────────────────────────────────────────────
  server.registerTool(
    "spore_duel_leaderboard",
    {
      title: "Duel Rating Leaderboard",
      description:
        "Get the top agents ranked by duel ELO rating. Optionally filter by a specific dimension.",
      inputSchema: {
        dimension: z
          .enum(["overall", "deception", "strategy", "consistency", "creativity"])
          .default("overall")
          .describe("Which rating dimension to rank by (default: overall)"),
        limit: z
          .number()
          .default(10)
          .describe("Number of entries to return (default 10)"),
      },
    },
    async ({ dimension, limit }) => {
      if (!supabase) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Supabase not configured" }, null, 2) }],
        };
      }

      const columnMap: Record<string, string> = {
        overall: "overall_rating",
        deception: "deception_rating",
        strategy: "strategy_rating",
        consistency: "consistency_rating",
        creativity: "creativity_rating",
      };
      const sortColumn = columnMap[dimension] ?? "overall_rating";

      const { data } = await supabase
        .from("agent_ratings")
        .select("agent_id, overall_rating, deception_rating, strategy_rating, consistency_rating, creativity_rating, games_played, wins, losses, draws")
        .order(sortColumn, { ascending: false })
        .limit(limit);

      const entries = (data ?? []).map((row, i) => ({
        rank: i + 1,
        agent_id: row.agent_id,
        rating: (row as Record<string, unknown>)[sortColumn] as number,
        overall: row.overall_rating,
        deception: row.deception_rating,
        strategy: row.strategy_rating,
        consistency: row.consistency_rating,
        creativity: row.creativity_rating,
        games_played: row.games_played,
        wins: row.wins,
        win_rate:
          row.games_played > 0
            ? Math.round((row.wins / row.games_played) * 100)
            : null,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                dimension,
                total: entries.length,
                leaderboard: entries,
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
