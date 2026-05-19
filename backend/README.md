# Mini Shop — Backend API

## Tech Stack
- **Node.js + Fastify** — fast, low-overhead HTTP server
- **TypeScript** — type safety everywhere
- **Supabase** — PostgreSQL database + Auth
- **Zod** — request validation

## Prerequisites
- Node.js 18+
- A Supabase project with migrations applied

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Run the dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | service_role key (bypasses RLS) |
| `JWT_SECRET` | From Supabase Settings > API > JWT Secret |

## Seed Test Accounts

```bash
npx ts-node src/scripts/seed.ts
```

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | Admin123! |
| Customer | customer@test.com | Customer123! |

## API Routes

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /auth/register | - | Register new user |
| POST | /auth/login | - | Login, returns JWT |
| POST | /auth/forgot-password | - | Send reset email |
| GET | /auth/me | ✅ | Get current profile |

### Products
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /products | - | List products (search, category, page, limit) |
| GET | /products/categories | - | List categories |
| GET | /products/:id | - | Product detail |
| POST | /products | 🔐 Admin | Create product |
| PATCH | /products/:id | 🔐 Admin | Update product |
| DELETE | /products/:id | 🔐 Admin | Soft delete |

### Orders
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /orders | ✅ | Place order |
| GET | /orders/my | ✅ | My orders |
| GET | /orders | 🔐 Admin | All orders |
| PATCH | /orders/:id/status | 🔐 Admin | Update status |

## Error Format
All errors follow:
```json
{ "statusCode": 400, "error": "Bad Request", "message": "..." }
```
