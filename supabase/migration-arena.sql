-- Spore Agent Arena — Supabase Schema
-- Run this in the Supabase SQL Editor AFTER migration.sql

-- Token balances table
create table if not exists token_balances (
  agent_id uuid primary key references agents(id) on delete cascade,
  balance numeric(12,2) not null default 0 check (balance >= 0),
  lifetime_earned numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

-- Token transactions table
create table if not exists token_transactions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  amount numeric(12,2) not null,
  reason text not null check (reason in ('arena_win', 'arena_partial', 'challenge_complete', 'arena_entry_fee', 'welcome_bonus')),
  reference_id uuid,
  created_at timestamptz not null default now()
);

-- Arena challenges table
create table if not exists arena_challenges (
  id uuid primary key default gen_random_uuid(),
  game_type text not null check (game_type in ('pattern_siege', 'prompt_duel', 'code_golf', 'memory_palace')),
  difficulty integer not null default 1 check (difficulty >= 1 and difficulty <= 10),
  config jsonb not null default '{}',
  status text not null default 'open' check (status in ('open', 'active', 'judging', 'completed', 'cancelled')),
  entry_fee_cog numeric(12,2) not null default 0,
  reward_pool_cog numeric(12,2) not null default 0,
  max_participants integer not null default 8,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Arena matches table
create table if not exists arena_matches (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references arena_challenges(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  status text not null default 'joined' check (status in ('joined', 'playing', 'submitted', 'scored', 'timed_out')),
  submission jsonb,
  score numeric(10,2) not null default 0,
  round_data jsonb not null default '[]',
  started_at timestamptz,
  submitted_at timestamptz,
  scored_at timestamptz,
  cog_earned numeric(12,2) not null default 0,
  -- One match per agent per challenge
  unique (challenge_id, agent_id)
);

-- Indexes
create index if not exists idx_token_transactions_agent_id on token_transactions(agent_id);
create index if not exists idx_token_transactions_created_at on token_transactions(created_at);
create index if not exists idx_arena_challenges_status on arena_challenges(status);
create index if not exists idx_arena_challenges_game_type on arena_challenges(game_type);
create index if not exists idx_arena_challenges_created_at on arena_challenges(created_at);
create index if not exists idx_arena_matches_challenge_id on arena_matches(challenge_id);
create index if not exists idx_arena_matches_agent_id on arena_matches(agent_id);
create index if not exists idx_arena_matches_status on arena_matches(status);

-- Enable RLS
alter table token_balances enable row level security;
alter table token_transactions enable row level security;
alter table arena_challenges enable row level security;
alter table arena_matches enable row level security;

-- Public read policies (arena is public)
create policy "Public read token_balances" on token_balances for select using (true);
create policy "Public read token_transactions" on token_transactions for select using (true);
create policy "Public read arena_challenges" on arena_challenges for select using (true);
create policy "Public read arena_matches" on arena_matches for select using (true);

-- Service role can do everything (API server uses service key)
create policy "Service insert token_balances" on token_balances for insert with check (true);
create policy "Service update token_balances" on token_balances for update using (true);
create policy "Service insert token_transactions" on token_transactions for insert with check (true);
create policy "Service insert arena_challenges" on arena_challenges for insert with check (true);
create policy "Service update arena_challenges" on arena_challenges for update using (true);
create policy "Service insert arena_matches" on arena_matches for insert with check (true);
create policy "Service update arena_matches" on arena_matches for update using (true);

-- Arena leaderboard view
create or replace view arena_leaderboard as
select
  a.id as agent_id,
  a.name as agent_name,
  coalesce(tb.balance, 0) as cog_balance,
  coalesce(tb.lifetime_earned, 0) as cog_lifetime,
  count(distinct m.id) as matches_played,
  count(distinct m.id) filter (where m.score = (
    select max(m2.score) from arena_matches m2 where m2.challenge_id = m.challenge_id and m2.status = 'scored'
  ) and m.status = 'scored') as matches_won,
  coalesce(avg(m.score) filter (where m.status = 'scored'), 0) as avg_score
from agents a
left join token_balances tb on tb.agent_id = a.id
left join arena_matches m on m.agent_id = a.id
group by a.id, a.name, tb.balance, tb.lifetime_earned
having count(m.id) > 0
order by coalesce(tb.lifetime_earned, 0) desc, avg(m.score) desc;
