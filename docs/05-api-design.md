# API Design

## Base path

```text
/api
```

## Response conventions

### Success

Most endpoints return JSON with `success: true` and optional `requestId`.

### Errors

All error responses use this shape:

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "requestId": "uuid-or-correlation-id"
}
```

Validation errors may also include `details` (field errors from Zod).

Client responses never include stack traces. Server-side errors are logged with full context (including stack) via Pino.

---

## Health

### GET /api/health

Liveness / basic health. No authentication.

---

## Auth

### POST /api/auth/login

Authenticates an admin portal user. Rate-limited (429 with the same error envelope including `requestId`).

Request body:

```json
{
  "email": "admin@example.com",
  "password": "your-secure-password"
}
```

Success `200`:

```json
{
  "success": true,
  "data": {
    "token": "jwt...",
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "admin",
      "status": "active"
    }
  },
  "requestId": "..."
}
```

Use the token as:

```http
Authorization: Bearer <token>
```

---

## Conversations (admin read API)

All routes require a valid JWT and role in `admin` | `supervisor` | `agent`.

### GET /api/conversations

Query parameters (optional):

- `page`, `limit` — pagination (`limit` capped server-side)
- `status` — `open` | `closed`
- `mode` — `bot` | `human`
- `search` — substring match on `customerPhone` (regex-special characters escaped server-side)

### GET /api/conversations/:conversationId

Returns one conversation or `404` with `CONVERSATION_NOT_FOUND`.

### GET /api/conversations/:conversationId/messages

Paginated messages for a conversation. Returns `404` if the conversation does not exist.

---

## Mock WhatsApp (development / controlled testing)

### POST /api/dev/mock-whatsapp/incoming

Disabled unless `ENABLE_MOCK_WHATSAPP=true`.

Headers:

- `x-mock-whatsapp-secret` — required in non-development when mock is enabled; optional in development unless `MOCK_WHATSAPP_SECRET` is set (then required to match).

Body (JSON):

```json
{
  "from": "962790000000",
  "text": "optional message text",
  "messageId": "optional stable id for idempotency tests"
}
```

Success `200` includes `conversationId`, `inboundMessageId`, `outboundMessageId`, and `reply`.

**Idempotency:** the same `messageId` (provider message id) for the same provider must not create a second inbound row or a second bot reply; retries return the same stored outbound reply when one already exists.

---

## Error codes (non-exhaustive)

| Code | Typical HTTP |
|------|----------------|
| `VALIDATION_ERROR` | 400 |
| `UNAUTHORIZED` | 401 |
| `INVALID_TOKEN` | 401 |
| `FORBIDDEN` | 403 |
| `MOCK_DISABLED` | 403 |
| `CONVERSATION_NOT_FOUND` | 404 |
| `ROUTE_NOT_FOUND` | 404 |
| `TOO_MANY_LOGIN_ATTEMPTS` | 429 |
| `MOCK_MISCONFIGURED` | 503 |
| `INTERNAL_SERVER_ERROR` | 500 |
