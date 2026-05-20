# JEA Digital Assistant

WhatsApp-based digital assistant platform for the Jordan Engineers Association.

## Goal

Build a service platform that supports:

- WhatsApp conversations
- Admin inbox
- Ticketing and case management
- Knowledge base
- Member verification
- Human handoff
- Service flows
- Reports and audit logs
- Future AI/NLP/RAG support

## Repository layout

```text
backend/     # Node.js API (Express + MongoDB)
frontend/    # React admin dashboard (RTL, Tailwind)
docs/        # Architecture notes and ADRs
```

Other top-level folders (`frontend/`, `infra/`, etc.) may be added as the program grows.

## Prerequisites

- Node.js 20+ (LTS recommended)
- MongoDB reachable at the URI you configure

## Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set at least:

| Variable | Notes |
|----------|--------|
| `MONGO_URI` | Mongo connection string |
| `JWT_SECRET` | At least 32 characters (required for auth) |
| `ENABLE_MOCK_WHATSAPP` | `true` or `false` (default `false`) |
| `MOCK_WHATSAPP_SECRET` | Required when mock is enabled outside `NODE_ENV=development` |

Optional seed variables for the first admin user: `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` (see `backend/scripts/seed-admin.js`).

Install and run:

```bash
cd backend
npm install
npm run dev
```

The API listens on `PORT` (default `5000`).

## Frontend admin dashboard

```bash
cd frontend
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with RTL layout and JEA-branded design system. See `frontend/README.md`.

## Mock WhatsApp (development)

1. Set `ENABLE_MOCK_WHATSAPP=true` in `.env`.
2. For local development (`NODE_ENV=development`), you may omit `MOCK_WHATSAPP_SECRET`; if you set it, send header `x-mock-whatsapp-secret` with the same value on each request.
3. For `test` or `production`, mock is only usable when `MOCK_WHATSAPP_SECRET` is set and the same value is sent in `x-mock-whatsapp-secret`. Otherwise requests return `503 MOCK_MISCONFIGURED` or `401`.

Example:

```bash
curl -X POST http://localhost:5000/api/dev/mock-whatsapp/incoming \
  -H "Content-Type: application/json" \
  -H "x-mock-whatsapp-secret: your-secret" \
  -d '{"from":"962790000000","text":"مرحبا","messageId":"test-msg-1"}'
```

Re-sending the same `messageId` simulates a provider retry: the API returns the same logical bot reply without inserting a duplicate outbound message.

## Health check

```http
GET /api/health
```

## Documentation

- `docs/00-project-overview.md` — product context
- `docs/02-architecture.md` — modular monolith overview
- `docs/05-api-design.md` — HTTP API summary
- `docs/06-database-models.md` — schemas, indexes, idempotency
- `docs/adr/` — architecture decision records

## Database migrations (manual)

If you already have **more than one open** conversation for the same `customerPhone`, remove or close duplicates before relying on the partial unique index on open conversations (see `docs/06-database-models.md`).
