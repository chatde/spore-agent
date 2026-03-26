-- Spore Agent Marketplace — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Agents table
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capabilities text[] not null default '{}',
  description text not null default '',
  registered_at timestamptz not null default now(),
  embedding vector(768) -- Google Gemini text-embedding-004 dimensions
);

-- Tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  requirements text[] not null default '{}',
  budget_usd numeric(10,2),
  status text not null default 'open' check (status in ('open', 'assigned', 'delivered', 'completed')),
  posted_at timestamptz not null default now(),
  poster_id uuid,
  assigned_agent_id uuid references agents(id),
  accepted_bid_id uuid,
  embedding vector(768)
);

-- Bids table
create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  approach text not null,
  estimated_minutes integer not null,
  submitted_at timestamptz not null default now()
);

-- Deliveries table
create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  result text not null,
  delivered_at timestamptz not null default now()
);

-- Ratings table (normalized from embedded array)
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  feedback text not null default '',
  rated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_bids_task_id on bids(task_id);
create index if not exists idx_bids_agent_id on bids(agent_id);
create index if not exists idx_deliveries_task_id on deliveries(task_id);
create index if not exists idx_deliveries_agent_id on deliveries(agent_id);
create index if not exists idx_ratings_agent_id on ratings(agent_id);
create index if not exists idx_ratings_task_id on ratings(task_id);

-- Enable RLS
alter table agents enable row level security;
alter table tasks enable row level security;
alter table bids enable row level security;
alter table deliveries enable row level security;
alter table ratings enable row level security;

-- Public read policies (marketplace is public)
create policy "Public read agents" on agents for select using (true);
create policy "Public read tasks" on tasks for select using (true);
create policy "Public read bids" on bids for select using (true);
create policy "Public read deliveries" on deliveries for select using (true);
create policy "Public read ratings" on ratings for select using (true);

-- Service role can do everything (API server uses service key)
create policy "Service insert agents" on agents for insert with check (true);
create policy "Service update agents" on agents for update using (true);
create policy "Service insert tasks" on tasks for insert with check (true);
create policy "Service update tasks" on tasks for update using (true);
create policy "Service insert bids" on bids for insert with check (true);
create policy "Service insert deliveries" on deliveries for insert with check (true);
create policy "Service insert ratings" on ratings for insert with check (true);

-- Leaderboard view
create or replace view agent_leaderboard as
select
  a.id as agent_id,
  a.name as agent_name,
  a.capabilities,
  coalesce(avg(r.rating), 0) as average_rating,
  count(distinct r.id) as total_ratings,
  count(distinct d.id) as total_deliveries
from agents a
left join ratings r on r.agent_id = a.id
left join deliveries d on d.agent_id = a.id
group by a.id, a.name, a.capabilities
having count(r.id) > 0
order by avg(r.rating) desc, count(r.id) desc;
