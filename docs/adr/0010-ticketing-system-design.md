# ADR 0010: Ticketing System Design (Conversation as Ticket)

## Status

Accepted

## Date

2026-05-12

## Context

The JEA technical proposal (Section 5) calls for a **ticketing and follow-up management** capability alongside WhatsApp conversations. The codebase already persisted **conversations** and **messages** with inbox APIs (assign, mode, status).

Two broad options existed:

1. **Separate `Ticket` collection** linked to `Conversation` — clearer separation but more joins, duplicate lifecycle fields, and migration complexity for the current MVP.
2. **Extend `Conversation`** with ticket identifiers, workflow state, priority, and staff-only notes — one aggregate for “thread + case,” aligned with how staff already think about an inbox row.

The product must also keep **internal notes** out of any **member-facing** channel (WhatsApp replies, mock webhook acknowledgements) and out of **list payloads** where they add noise and risk accidental exposure in future UIs.

## Decision

Model **tickets as fields on `Conversation`**:

- **`ticketNumber`**: human-readable id `JEA-YYYYMMDD-XXXX`, unique (sparse index so legacy documents without a number remain valid), assigned on **first save** of a new conversation via a pre-save hook and an atomic **`TicketCounter`** document per UTC day for the numeric suffix.
- **`ticketStatus`**: workflow enum `new | open | pending | resolved | closed` (default `new`), distinct from **`status`** (`open | closed`), which continues to represent whether the phone thread is active for the partial unique index on “one open conversation per customer phone.”
- **`priority`**: `low | medium | high` (default `medium`).
- **`internalNotes`**: append-only subdocuments `{ note, author, createdAt }`; authors reference `User`.

**APIs**

- `POST /api/conversations/:conversationId/notes` — staff-only (admin, supervisor, agent); Zod-validated body; pushes a note; never triggers outbound WhatsApp.
- `PATCH /api/conversations/:conversationId/ticket-status` — updates `ticketStatus` and optional `priority`; when `ticketStatus` is `closed`, **`status` is set to `closed`** so the partial unique index and business rule stay aligned.
- **`PATCH .../status`** — when `status` is set to `closed`, **`ticketStatus` is set to `closed`** so closing the thread from either path stays consistent.

**Data exposure**

- `GET /api/conversations` uses a projection that **omits `internalNotes`**.
- `GET /api/conversations/:id` returns full staff detail including notes with populated `author` (minimal user fields).
- Orchestrator and channel controllers continue to use only ids and message text; they do **not** read or forward `internalNotes`.

## Consequences

- **Pros:** Single source of truth for “conversation + ticket,” simple queries for inbox, atomic daily sequence without embedding counters on the conversation document.
- **Cons:** The `Conversation` document grows with note volume; if notes become very large, a future split to a `TicketNote` collection would be a natural evolution without changing external ticket numbers.
- **Legacy data:** conversations created before this ADR may have `ticketNumber: null` until touched by a deliberate backfill; new creates always receive a number.

## Related

- `docs/00-project-overview.md` — feature list.
- `docs/05-api-design.md` — request/response conventions (`requestId`, Zod errors).
