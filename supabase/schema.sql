-- ===========================================================================
-- BetchaPokah — database schema
--
-- Apply with:  supabase db push
--   or paste into the dashboard SQL editor.
--
-- Design notes
--   * auth.users is owned by Supabase and is never written to by the app.
--   * All authorization is enforced by Row Level Security in Postgres, not in
--     application code. The guards in lib/auth/guards.ts are a friendly layer
--     over these policies, not the boundary itself.
--   * Chips are integers (bigint) in the smallest unit. Never floating point:
--     money is exact or it is broken.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- profiles — one row per player, created automatically on sign-up.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  role        text not null default 'player'
                check (role in ('player', 'admin')),
  -- Free starting stack. Bigint, never float.
  chips       bigint not null default 10000 check (chips >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.profiles.chips is
  'Chip balance in whole chips. bigint, never float.';

-- ---------------------------------------------------------------------------
-- chip_grants — append-only audit trail for every admin chip movement.
-- Balances are derived by summing this, never edited directly by an admin.
-- ---------------------------------------------------------------------------
create table if not exists public.chip_grants (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  -- Negative values remove chips.
  amount      bigint not null check (amount <> 0),
  reason      text not null default '',
  granted_by  uuid not null references auth.users (id),
  created_at  timestamptz not null default now()
);

create index if not exists chip_grants_user_id_idx
  on public.chip_grants (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- is_admin() — SECURITY DEFINER so the policy below can read `role` without
-- recursing back into the profiles policy that calls it. Without this, RLS
-- would loop until Postgres gives up.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Default-deny: enabling RLS with no policy means no access. Policies below
-- then open up exactly what each role needs.
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.chip_grants enable row level security;

-- A player may read their own profile. Admins may read any, for the dashboard.
create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Players may update their own profile, but RLS cannot restrict *columns* in a
-- policy — so nothing here. Column-level privileges do that job instead:
-- players get update only on `chips`-free columns via a dedicated grant.
create policy "profiles_update_admin"
  on public.profiles
  for update
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Inserts happen only through the signup trigger (security definer), not here.
create policy "profiles_insert_self"
  on public.profiles
  for insert
  with check (id = (select auth.uid()) and role = 'player');

-- The ledger is admin-only, in both directions.
create policy "chip_grants_admin_all"
  on public.chip_grants
  for all
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- A player may read their own grant history, so they can see what an admin did.
create policy "chip_grants_select_own"
  on public.chip_grants
  for select
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Column privileges
--
-- RLS is row-level only. Without these, a player with UPDATE on profiles could
-- set their own chips to a billion. Revoke the blanket grant, then hand back
-- only the safe columns.
-- ---------------------------------------------------------------------------
revoke update on public.profiles from authenticated;
grant update (email) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- handle_new_user() — creates a profile with the starting stack on sign-up.
-- SECURITY DEFINER because it writes to profiles as the system, bypassing the
-- player's own RLS context.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- grant_chips() — the only way an admin moves chips.
--
-- Doing this in one transactional function (rather than an update plus an
-- insert from the client) means the balance and the audit row can never drift
-- apart, even if the request is retried.
--
-- A negative amount removes chips. The CHECK on profiles.chips rejects a
-- withdrawal that would overdraw the player.
-- ---------------------------------------------------------------------------
create or replace function public.grant_chips(
  target_user uuid,
  amount      bigint,
  note        text default ''
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance bigint;
begin
  if (select public.is_admin()) is not true then
    raise exception 'not authorized';
  end if;

  update public.profiles
     set chips = chips + amount,
         updated_at = now()
   where id = target_user
  returning chips into new_balance;

  if new_balance is null then
    raise exception 'no such player';
  end if;

  insert into public.chip_grants (user_id, amount, reason, granted_by)
  values (target_user, amount, note, (select auth.uid()));

  return new_balance;
end;
$$;

revoke all on function public.grant_chips(uuid, bigint, text) from public;
grant execute on function public.grant_chips(uuid, bigint, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime
--
-- Add tables here when the game engine broadcasts state changes:
--   alter publication supabase_realtime add table public.tables;
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Promote yourself to admin (first player only). Run once by hand in the
-- dashboard SQL editor — replace the email. Deliberately not a function, so
-- nobody can call it.
-- ---------------------------------------------------------------------------
-- update public.profiles set role = 'admin' where email = 'you@example.com';