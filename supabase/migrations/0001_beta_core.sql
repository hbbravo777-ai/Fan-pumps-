-- FanPump beta database foundation (Supabase/PostgreSQL)
-- This migration creates data structures only. It does not configure auth providers,
-- storage buckets, billing, Solana verification, or media playback authorization.
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 32),
  display_name text not null default '',
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  creator_name text not null,
  description text not null default '' check (char_length(description) <= 2000),
  is_listed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'draft' check (status in ('draft','scheduled','live','ended','removed')),
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  playback_asset_id text,
  preview_seconds integer not null default 60 check (preview_seconds between 0 and 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists streams_discovery_idx on public.streams(status, scheduled_at desc);
create index if not exists streams_creator_idx on public.streams(creator_id, created_at desc);

create table if not exists public.wallet_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  address text not null check (char_length(address) between 32 and 64),
  chain text not null default 'solana' check (chain = 'solana'),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, address),
  unique(address, chain)
);

create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  stream_id uuid not null references public.streams(id) on delete restrict,
  signature text not null unique,
  cluster text not null check (cluster in ('devnet','mainnet-beta')),
  mint_address text not null,
  recipient_address text not null,
  amount_base_units numeric(40,0) not null check (amount_base_units > 0),
  finalized_slot bigint,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
-- Rows must be written only by a trusted server-side verifier using the service role.

create table if not exists public.stream_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stream_id uuid not null references public.streams(id) on delete cascade,
  payment_receipt_id uuid not null unique references public.payment_receipts(id) on delete restrict,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (expires_at > starts_at)
);
create index if not exists entitlements_viewer_stream_idx on public.stream_entitlements(user_id, stream_id, expires_at desc);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, creator_id),
  check (follower_id <> creator_id)
);

create table if not exists public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  target_type text not null check (target_type in ('profile','stream')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 1000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists creator_profiles_set_updated_at on public.creator_profiles;
create trigger creator_profiles_set_updated_at before update on public.creator_profiles
for each row execute function public.set_updated_at();
drop trigger if exists streams_set_updated_at on public.streams;
create trigger streams_set_updated_at before update on public.streams
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.streams enable row level security;
alter table public.wallet_addresses enable row level security;
alter table public.payment_receipts enable row level security;
alter table public.stream_entitlements enable row level security;
alter table public.follows enable row level security;
alter table public.moderation_reports enable row level security;

create policy "Profiles are publicly readable" on public.profiles
for select using (true);
create policy "Users create their own profile" on public.profiles
for insert with check (auth.uid() = id);
create policy "Users update their own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Listed creator profiles are public" on public.creator_profiles
for select using (is_listed or auth.uid() = user_id);
create policy "Creators manage their own creator profile" on public.creator_profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Published streams are discoverable" on public.streams
for select using (status in ('scheduled','live','ended') or auth.uid() = creator_id);
create policy "Creators manage their own streams" on public.streams
for all using (auth.uid() = creator_id) with check (auth.uid() = creator_id);

create policy "Wallet addresses visible only to owner" on public.wallet_addresses
for select using (auth.uid() = user_id);
create policy "Users manage their own wallet addresses" on public.wallet_addresses
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read their own payment receipts" on public.payment_receipts
for select using (auth.uid() = user_id);
-- Intentionally no client INSERT/UPDATE/DELETE policy for payment_receipts.

create policy "Users read their own entitlements" on public.stream_entitlements
for select using (auth.uid() = user_id);
-- Intentionally no client write policy; only trusted verifier may issue entitlements.

create policy "Follow graph is publicly readable" on public.follows
for select using (true);
create policy "Users manage their own follows" on public.follows
for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

create policy "Users create reports" on public.moderation_reports
for insert with check (auth.uid() = reporter_id);
create policy "Users read their own reports" on public.moderation_reports
for select using (auth.uid() = reporter_id);
-- Moderation status changes must be performed by authorized server/admin tooling.
