create table if not exists public.curator_follows (
  id uuid primary key default gen_random_uuid(),
  curator_handle text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(curator_handle, user_id)
);

create index if not exists curator_follows_curator_handle_idx on public.curator_follows(curator_handle);
create index if not exists curator_follows_user_id_idx on public.curator_follows(user_id);

alter table public.curator_follows enable row level security;

create policy "Allow public read access on curator_follows" on public.curator_follows
  for select using (true);

create policy "Allow authenticated users to follow curators" on public.curator_follows
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow authenticated users to unfollow curators" on public.curator_follows
  for delete to authenticated using (auth.uid() = user_id);
