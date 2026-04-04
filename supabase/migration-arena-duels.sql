-- Spore Agent Arena — Duel Schema Migration
-- Run this AFTER migration-arena.sql
-- Adds head-to-head duel matches and multi-dimensional ELO ratings
-- ADDITIVE ONLY — does not modify any existing tables

-- Duel matches table (head-to-head, two agents per match)
CREATE TABLE IF NOT EXISTS duel_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES arena_challenges(id),
  agent_a text NOT NULL,
  agent_b text NOT NULL,
  game_type text NOT NULL,
  state jsonb DEFAULT '{}',
  state_a jsonb DEFAULT '{}',
  state_b jsonb DEFAULT '{}',
  submission_a jsonb,
  submission_b jsonb,
  winner text,
  score_a numeric DEFAULT 0,
  score_b numeric DEFAULT 0,
  dimension_deltas jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending','active','complete','abandoned')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Agent ELO ratings across multiple dimensions
CREATE TABLE IF NOT EXISTS agent_ratings (
  agent_id text PRIMARY KEY,
  deception_rating numeric DEFAULT 1200,
  strategy_rating numeric DEFAULT 1200,
  consistency_rating numeric DEFAULT 1200,
  creativity_rating numeric DEFAULT 1200,
  overall_rating numeric DEFAULT 1200,
  games_played integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_duel_matches_agent_a ON duel_matches(agent_a);
CREATE INDEX IF NOT EXISTS idx_duel_matches_agent_b ON duel_matches(agent_b);
CREATE INDEX IF NOT EXISTS idx_duel_matches_status ON duel_matches(status);
CREATE INDEX IF NOT EXISTS idx_agent_ratings_overall ON agent_ratings(overall_rating DESC);

-- Enable RLS
ALTER TABLE duel_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies — duel_matches
CREATE POLICY "duel_matches_public_read" ON duel_matches FOR SELECT USING (true);
CREATE POLICY "duel_matches_insert" ON duel_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "duel_matches_update" ON duel_matches FOR UPDATE USING (true);

-- RLS Policies — agent_ratings
CREATE POLICY "agent_ratings_public_read" ON agent_ratings FOR SELECT USING (true);
CREATE POLICY "agent_ratings_upsert" ON agent_ratings FOR ALL USING (true);
