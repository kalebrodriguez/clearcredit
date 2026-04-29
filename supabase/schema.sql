-- ClearCredit — Supabase schema
-- Run in the Supabase SQL editor after creating your project

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  program_id text,
  hcc_courses jsonb default '[]'::jsonb,
  usf_courses jsonb default '[]'::jsonb,
  ap_scores   jsonb default '[]'::jsonb,
  updated_at  timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
