-- ============================================================
-- Shopwise — Supabase SQL Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- Users table (custom auth, NOT supabase.auth.users)
create table if not exists public.users (
  id            uuid primary key,
  email         text unique not null,
  name          text not null,
  role          text not null check (role in ('buyer', 'seller')),
  password_hash text not null,
  created_at    timestamptz default now()
);

-- Products
create table if not exists public.products (
  id          uuid primary key,
  seller_id   uuid not null references public.users(id) on delete cascade,
  name        text not null,
  description text not null,
  price       numeric(10, 2) not null check (price > 0),
  stock       integer not null default 0 check (stock >= 0),
  image_url   text,
  category    text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id         uuid primary key,
  buyer_id   uuid not null references public.users(id) on delete cascade,
  seller_id  uuid not null references public.users(id) on delete cascade,
  items      jsonb not null default '[]',
  total      numeric(10, 2) not null,
  status     text not null default 'pending' check (status in ('pending', 'shipped', 'delivered')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table if not exists public.reviews (
  id          uuid primary key,
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  buyer_id    uuid not null references public.users(id) on delete cascade,
  buyer_name  text not null,
  rating      integer not null check (rating between 1 and 5),
  comment     text not null,
  created_at  timestamptz default now(),
  unique (order_id, product_id)
);

-- Indexes
create index if not exists idx_products_seller_id on public.products(seller_id);
create index if not exists idx_products_category  on public.products(category);
create index if not exists idx_orders_buyer_id    on public.orders(buyer_id);
create index if not exists idx_orders_seller_id   on public.orders(seller_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);

-- Disable RLS (app uses service role key for all DB access)
alter table public.users     disable row level security;
alter table public.products  disable row level security;
alter table public.orders    disable row level security;
alter table public.reviews   disable row level security;
