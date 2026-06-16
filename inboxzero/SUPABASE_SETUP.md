# Inbox Invaders shared scores

## 1. Create the Supabase table

Run this SQL in Supabase SQL Editor:

```sql
create table public.inbox_scores (
  id uuid primary key default gen_random_uuid(),
  player_id text not null,
  player_name text not null,
  score integer not null,
  level integer not null,
  created_at timestamptz not null default now()
);

alter table public.inbox_scores enable row level security;

create policy "Anyone can read scores"
on public.inbox_scores
for select
to anon
using (true);

create policy "Anyone can submit scores"
on public.inbox_scores
for insert
to anon
with check (
  score >= 0
  and level >= 0
  and length(player_name) between 1 and 18
);
```

## 2. Configure server-side keys in Netlify

Add these environment variables in Netlify:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_ANON_KEY` also works, but `SUPABASE_SERVICE_ROLE_KEY` is better for a server-side proxy.

## 3. Behavior

- When the game is served over `http` or `https`, it uses the same-origin route `/api/inbox-scores`.
- This route runs on Netlify and talks to Supabase server-side, which avoids most browser, extension, firewall, or OS blocks.
- If the proxy is unavailable, the game falls back to local browser scores automatically.
- You can force local-only mode with `?scores=local`.
- Players identify with a pseudo stored in `localStorage`.
- This is friendly internal scoring, not anti-cheat secure.
