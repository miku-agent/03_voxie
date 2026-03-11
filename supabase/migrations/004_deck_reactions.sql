create table if not exists public.deck_likes (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(deck_id, user_id)
);

create table if not exists public.deck_bookmarks (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(deck_id, user_id)
);

create index if not exists deck_likes_deck_id_idx on public.deck_likes(deck_id);
create index if not exists deck_likes_user_id_idx on public.deck_likes(user_id);
create index if not exists deck_bookmarks_deck_id_idx on public.deck_bookmarks(deck_id);
create index if not exists deck_bookmarks_user_id_idx on public.deck_bookmarks(user_id);

alter table public.deck_likes enable row level security;
alter table public.deck_bookmarks enable row level security;

create policy "Allow public read access on deck_likes" on public.deck_likes
  for select using (true);

create policy "Allow public read access on deck_bookmarks" on public.deck_bookmarks
  for select using (true);

create policy "Allow authenticated users to like decks" on public.deck_likes
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow authenticated users to unlike their deck likes" on public.deck_likes
  for delete to authenticated using (auth.uid() = user_id);

create policy "Allow authenticated users to bookmark decks" on public.deck_bookmarks
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow authenticated users to remove their deck bookmarks" on public.deck_bookmarks
  for delete to authenticated using (auth.uid() = user_id);
