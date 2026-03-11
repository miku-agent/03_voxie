alter table public.cards
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null,
  add column if not exists author_handle text,
  add column if not exists author_name text;

alter table public.decks
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null,
  add column if not exists author_handle text,
  add column if not exists author_name text;

create index if not exists cards_owner_user_id_idx on public.cards(owner_user_id);
create index if not exists cards_author_handle_idx on public.cards(author_handle);
create index if not exists decks_owner_user_id_idx on public.decks(owner_user_id);
create index if not exists decks_author_handle_idx on public.decks(author_handle);
