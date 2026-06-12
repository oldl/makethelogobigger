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

## 2. Add keys in `game.js`

Find:

```js
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
```

Paste your Supabase project URL and anon public key.

## 3. Behavior

- If Supabase keys are empty, scores are stored locally in the browser.
- If Supabase keys are set, scores are submitted to `inbox_scores`.
- Players identify with a pseudo stored in `localStorage`.
- This is friendly internal scoring, not anti-cheat secure.
