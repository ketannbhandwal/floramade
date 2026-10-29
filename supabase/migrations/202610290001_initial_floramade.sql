create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_visible_idx on public.products ((coalesce((data->>'isVisible')::boolean, true)));
create index if not exists products_category_idx on public.products ((data->>'category'));

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists users_role_idx on public.users ((data->>'role'));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  status text not null default 'placed' check (status in ('placed','processing','shipped','delivered','cancelled')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending','contacted','resolved')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);

alter table public.products enable row level security;
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

-- The website accesses these tables only from trusted server routes using SUPABASE_SECRET_KEY.
-- No anon/authenticated policies are created; browser clients cannot read or write app records.
