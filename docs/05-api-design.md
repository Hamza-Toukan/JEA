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

All routes require `Authorization: Bearer <jwt>`.

Read routes require role **admin**, **supervisor**, or **agent**.

### GET /api/conversations

**Query (optional):** `page`, `limit`, `status` (`open` | `closed`), `mode` (`bot` | `human`), `search` (substring on `customerPhone`, regex metacharacters escaped server-side).

**200 example**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "customerPhone": "9627...",
      "status": "open",
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

**200** — single conversation document (`assignedTo` populated when set).

### GET /api/conversations/:conversationId/messages

Paginated messages. **404** if conversation does not exist.

---

## Inbox management (PATCH)

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
