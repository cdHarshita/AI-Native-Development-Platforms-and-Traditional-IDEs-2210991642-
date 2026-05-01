# Shopwise — Next.js 15 E-Commerce

A small but complete e-commerce platform with **Buyer** and **Seller** roles, built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), and custom JWT auth.

Built as **Workflow 3 (W3 — AI-Native)** benchmark project for the IEEE research paper:
_"AI-Native Development Platforms vs. Traditional IDEs: The Impact on Developers in the Era of Agentic AI"_

---

## Roles & Features

| Feature | Buyer | Seller |
|---------|-------|--------|
| Register / Login | ✅ | ✅ |
| Browse & search products | ✅ | — |
| Product detail page | ✅ | — |
| Add to cart / adjust qty | ✅ | — |
| Checkout (instant order) | ✅ | — |
| View order history | ✅ | — |
| Leave reviews (shipped orders) | ✅ | — |
| Sales dashboard | — | ✅ |
| Add / edit / delete products | — | ✅ |
| View incoming orders | — | ✅ |
| Mark orders as shipped | — | ✅ |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server + Client Components)
- **Auth**: Custom JWT via `jose` + `bcryptjs`, stored in `httpOnly` cookies
- **Database**: Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Styling**: Tailwind CSS
- **Cart**: localStorage (client-side)
- **Routing**: Directory-based App Router with route groups `(buyer)` / `(seller)`

---

## Project Structure

```
ecommerce/
├── app/
│   ├── (buyer)/
│   │   ├── products/[id]/page.tsx   # Product detail
│   │   ├── cart/page.tsx            # Cart + checkout
│   │   └── orders/page.tsx          # Order history + reviews
│   ├── (seller)/
│   │   ├── dashboard/page.tsx       # Sales dashboard
│   │   ├── products/
│   │   │   ├── page.tsx             # Product list
│   │   │   ├── new/page.tsx         # Create product
│   │   │   └── [id]/page.tsx        # Edit product
│   │   └── orders/page.tsx          # Incoming orders + ship
│   ├── api/
│   │   ├── auth/{register,login,logout,me}/route.ts
│   │   ├── products/route.ts
│   │   ├── products/[id]/route.ts
│   │   ├── orders/route.ts
│   │   ├── orders/[id]/ship/route.ts
│   │   ├── orders/[id]/review/route.ts
│   │   ├── reviews/route.ts
│   │   └── dashboard/route.ts
│   ├── auth/{login,register}/page.tsx
│   ├── layout.tsx
│   └── page.tsx                     # Shop home
├── components/
│   ├── ui/{Navbar,AuthProvider,OrderStatusBadge}.tsx
│   ├── buyer/ProductCard.tsx
│   └── seller/ProductForm.tsx
├── lib/
│   ├── supabase.ts
│   ├── jwt.ts
│   ├── auth.ts
│   └── cart.ts
├── middleware.ts                     # Route protection by role
├── types/index.ts
└── supabase/schema.sql              # Run this first in Supabase
```

---

## Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a new project, and run `supabase/schema.sql` in the SQL Editor.

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase URL, anon key, service role key, and a JWT secret:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=$(openssl rand -base64 32)
```

### 3. Install and run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register buyer or seller |
| POST | `/api/auth/login` | — | Login, sets JWT cookie |
| POST | `/api/auth/logout` | — | Clears cookie |
| GET | `/api/auth/me` | Any | Current user |
| GET | `/api/products` | — | List products (search, category, seller_id) |
| POST | `/api/products` | Seller | Create product |
| GET | `/api/products/:id` | — | Product detail |
| PATCH | `/api/products/:id` | Seller (owner) | Update product |
| DELETE | `/api/products/:id` | Seller (owner) | Delete product |
| GET | `/api/orders` | Any auth | List orders (scoped by role) |
| POST | `/api/orders` | Buyer | Place order from cart |
| PATCH | `/api/orders/:id/ship` | Seller (owner) | Mark order as shipped |
| POST | `/api/orders/:id/review` | Buyer (owner) | Leave review |
| GET | `/api/reviews?product_id=` | — | Reviews for a product |
| GET | `/api/dashboard` | Seller | Sales stats |

---

## Metrics (W3 — Research Paper)

| Metric | Value |
|--------|-------|
| T_setup (min) | _record_ |
| T_mvp (hrs) | _record_ |
| LOC / hr | _total LOC ÷ T_mvp_ |
| Debugging cycles | _count_ |
| Bug density (/100 LOC) | _code review_ |
| Verification overhead (%) | _review time ÷ total_ |
