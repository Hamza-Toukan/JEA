# API Design

## Base path

```text
/api
```

## Response conventions

### Success

JSON responses typically include `success: true`, optional `data`, optional `pagination`, and `requestId`.

### Errors

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "requestId": "uuid-or-correlation-id"
}
```

Validation failures may include `details` (Zod `fieldErrors`). Stack traces are never returned to clients; errors are logged server-side.

---

## Health

### GET /api/health

No authentication.

**200 example**

```json
{
  "success": true,
  "service": "JEA Digital Assistant API",
  "status": "healthy",
  "timestamp": "2026-05-12T12:00:00.000Z",
  "requestId": "..."
}
```

---

## Auth

### POST /api/auth/login

Rate limited (429 uses the same error envelope including `requestId`).

**Request**

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**200 example**

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin",
      "status": "active"
    }
  },
  "requestId": "..."
}
```

Use:

```http
Authorization: Bearer <jwt>
```

**400** `VALIDATION_ERROR` — invalid body.

**401** `INVALID_CREDENTIALS` — wrong email/password.

**403** `USER_INACTIVE` — account disabled.

---

## Conversations (inbox)

All routes require:

```http
Authorization: Bearer <jwt>
```

Read routes and ticketing/note routes below require role **admin**, **supervisor**, or **agent** (except **assign**, which is **admin** only).

### GET /api/conversations

**Query (optional):** `page`, `limit`, `status` (`open` | `closed`), `mode` (`bot` | `human`), `search` (substring on `customerPhone`, regex metacharacters escaped server-side).

List responses **omit** `internalNotes` (staff-only; use `GET /api/conversations/:conversationId` for detail including notes).

**200 example**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "customerPhone": "9627...",
      "status": "open",
      "ticketNumber": "JEA-20260512-0001",
      "ticketStatus": "open",
      "priority": "medium",
      "mode": "bot",
      "assignedTo": {
        "_id": "...",
        "name": "Agent",
        "email": "agent@example.com",
        "role": "agent",
        "status": "active"
      },
      "lastMessageText": "...",
      "lastMessageAt": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  },
  "requestId": "..."
}
```

### GET /api/conversations/:conversationId

**400** `VALIDATION_ERROR` — invalid ObjectId.

**404** `CONVERSATION_NOT_FOUND`.

**200** — single conversation document (`assignedTo` populated when set). Includes ticket fields (`ticketNumber`, `ticketStatus`, `priority`) and `internalNotes` (each note’s `author` populated with `name`, `email`, `role`). Notes are never sent to WhatsApp or used for bot replies.

### GET /api/conversations/:conversationId/messages

Paginated messages. **404** if conversation does not exist.

---

## Inbox management

### PATCH /api/conversations/:conversationId/assign

**Roles:** **admin** only.

Assigns the conversation to an internal user (`User` must exist and be `active`).

**Request**

```json
{
  "assignedTo": "64b0123456789abcdef01234"
}
```

`assignedTo` must be a valid MongoDB ObjectId string.

**200 example**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "customerPhone": "...",
    "assignedTo": {
      "_id": "64b0123456789abcdef01234",
      "name": "Agent",
      "email": "agent@example.com",
      "role": "agent",
      "status": "active"
    },
    "status": "open",
    "mode": "bot",
    "updatedAt": "..."
  },
  "requestId": "..."
}
```

**Errors**

| HTTP | code | When |
|------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid `conversationId` or body |
| 403 | `FORBIDDEN` | Non-admin user |
| 404 | `ASSIGNEE_NOT_FOUND` | User id does not exist |
| 400 | `ASSIGNEE_INACTIVE` | User exists but `status` is not `active` |
| 404 | `CONVERSATION_NOT_FOUND` | Conversation id not found |

---

### PATCH /api/conversations/:conversationId/mode

**Roles:** admin, supervisor, agent.

**Request**

```json
{
  "mode": "human"
}
```

Allowed: `human` | `bot`.

**200** — same envelope as assign (`data` is updated conversation).

**400** `VALIDATION_ERROR` — invalid id or body.

**404** `CONVERSATION_NOT_FOUND`.

---

### PATCH /api/conversations/:conversationId/status

**Roles:** admin, supervisor, agent.

**Request**

```json
{
  "status": "closed"
}
```

Allowed: `open` | `closed`.

**200** — updated conversation.

**400** `VALIDATION_ERROR` — invalid id or body.

**404** `CONVERSATION_NOT_FOUND`.

**409** `OPEN_CONVERSATION_CONFLICT` — reopening (`status: open`) would violate the partial unique index (another conversation for the same `customerPhone` is already `open`). Rare in normal flows.

Closing the conversation (`status: closed`) also sets **`ticketStatus`** to **`closed`**.

---

### POST /api/conversations/:conversationId/notes

**Roles:** admin, supervisor, agent.

Appends a **staff-only** internal note. Does not create a `Message`, does not trigger outbound WhatsApp, and is not used by the bot/orchestrator.

**Headers**

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Request**

```json
{
  "note": "Member called back; waiting for document scan."
}
```

- `note` — required string, trimmed, length **1–8000** characters.

**201 example**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "customerPhone": "...",
    "ticketNumber": "JEA-20260512-0001",
    "ticketStatus": "open",
    "priority": "medium",
    "internalNotes": [
      {
        "note": "Member called back; waiting for document scan.",
        "author": {
          "_id": "...",
          "name": "Agent",
          "email": "agent@example.com",
          "role": "agent"
        },
        "createdAt": "2026-05-12T14:30:00.000Z"
      }
    ],
    "status": "open",
    "mode": "bot",
    "updatedAt": "..."
  },
  "requestId": "..."
}
```

**Errors**

| HTTP | code | When |
|------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid `conversationId` or body (including empty or overlong `note`) |
| 401 | `UNAUTHORIZED` / `INVALID_TOKEN` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Authenticated user lacks admin, supervisor, or agent role |
| 404 | `CONVERSATION_NOT_FOUND` | Conversation id not found |

**400 validation example** (same envelope as other Zod failures)

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid internal note payload",
  "details": {
    "note": ["String must contain at least 1 character(s)"]
  },
  "requestId": "..."
}
```

---

### PATCH /api/conversations/:conversationId/ticket-status

**Roles:** admin, supervisor, agent.

Updates workflow **`ticketStatus`** and optionally **`priority`**. When **`ticketStatus`** is **`closed`**, **`status`** is set to **`closed`** as well (conversation thread closed, consistent with the partial unique index on one open row per phone).

**Headers**

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Request**

```json
{
  "ticketStatus": "resolved",
  "priority": "high"
}
```

- `ticketStatus` — required: `new` | `open` | `pending` | `resolved` | `closed`.
- `priority` — optional: `low` | `medium` | `high`.

**200 example**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "customerPhone": "...",
    "ticketNumber": "JEA-20260512-0001",
    "ticketStatus": "resolved",
    "priority": "high",
    "status": "open",
    "mode": "bot",
    "updatedAt": "..."
  },
  "requestId": "..."
}
```

**Errors**

| HTTP | code | When |
|------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid `conversationId` or body |
| 401 | `UNAUTHORIZED` / `INVALID_TOKEN` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Authenticated user lacks admin, supervisor, or agent role |
| 404 | `CONVERSATION_NOT_FOUND` | Conversation id not found |
| 409 | `OPEN_CONVERSATION_CONFLICT` | Rare: underlying update hit a unique-index conflict (e.g. edge cases around `status` / phone uniqueness) |

---

## Common error codes

| Code | HTTP |
|------|------|
| `VALIDATION_ERROR` | 400 |
| `UNAUTHORIZED` | 401 |
| `INVALID_TOKEN` | 401 |
| `FORBIDDEN` | 403 |
| `CONVERSATION_NOT_FOUND` | 404 |
| `ASSIGNEE_NOT_FOUND` | 404 |
| `ASSIGNEE_INACTIVE` | 400 |
| `OPEN_CONVERSATION_CONFLICT` | 409 |
| `TOO_MANY_LOGIN_ATTEMPTS` | 429 |
| `ROUTE_NOT_FOUND` | 404 |
| `INTERNAL_SERVER_ERROR` | 500 |

---

## Idempotency note (messages / webhooks)

Inbound WhatsApp deduplication and bot reply idempotency (when a channel module is present) rely on provider message ids and optional correlation fields on `Message`; see `docs/06-database-models.md` when those flows are enabled.
