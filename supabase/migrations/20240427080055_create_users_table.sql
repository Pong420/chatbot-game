create table
  public.users (
    id bigint generated by default as identity,
    "userId" text not null,
    nickname text not null,
    title text null default ''::text,
    game text null,
    updated_at timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now(),
    constraint users_pkey primary key (id),
    constraint users_userId_key unique ("userId")
  ) tablespace pg_default;

-- Enable MODDATETIME extension
create extension if not exists moddatetime schema extensions;

-- This will set the `updated_at` column on every update
create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);

alter table "users" enable row level security;

