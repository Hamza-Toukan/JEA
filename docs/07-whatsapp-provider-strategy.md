# WhatsApp Provider Strategy

## Purpose (Jordan Engineers Association)

This document describes how the JEA Digital Assistant **ingests and sends WhatsApp messages** while keeping **core domain code** (conversations, messages, orchestration) **independent of any single BSP’s wire format**.

The technical offer allows for multiple communication partners over time; the repository therefore isolates **channel adapters** under `backend/src/modules/channels/whatsapp/`.

## Architectural stance

1. **Abstraction at the boundary:** adapters translate provider payloads into normalized inputs for `processIncomingMessage` (`from`, `text`, `provider`, `providerMessageId`, `metadata`).
2. **Persistence is normalized:** `Message` stores `provider` and `providerMessageId` for idempotency and traceability across vendors.
3. **Mock for engineering velocity:** the mock HTTP endpoint supports local development without Twilio or Meta onboarding.

## Integrated providers

### Twilio (primary real provider)

Twilio is the **primary integrated WhatsApp provider** for production-style traffic: inbound webhooks and outbound replies via the official SDK.

#### Inbound webhook

| Item | Detail |
|------|--------|
| **URL** | `POST /api/whatsapp/twilio/webhook` |
| **Mount path** | Router mounted at `/api/whatsapp/twilio` in `app.js` |
| **Content-Type** | `application/x-www-form-urlencoded` (parsed by `express.urlencoded({ extended: true })`) |
| **Authentication** | None on the route (Twilio server-to-server callback); protect the URL in production (HTTPS, network rules, optional request validation as the program matures). |

#### Field mapping (Twilio → orchestrator)

| Twilio form field | Internal use |
|-------------------|--------------|
| `MessageSid` | `providerMessageId` (idempotency key for inbound messages) |
| `From` | Strip leading `whatsapp:` (case-insensitive) → `from` / `customerPhone` in the domain layer |
| `Body` | `text` (empty string if absent) |
| Entire body | `metadata.rawPayload` for troubleshooting and future enrichment |

The handler always responds with **TwiML** `<Response></Response>` and `Content-Type: text/xml` so Twilio receives a valid callback acknowledgement.

#### Outbound

After the orchestrator persists a **bot** outbound message (and only when `provider === "twilio"` and the conversation is **not** in human-only handling per ADR 0008), the Twilio service sends a WhatsApp message using:

- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` from validated environment variables.

Destination addresses are normalized with a `whatsapp:` prefix when missing, per Twilio’s WhatsApp channel addressing rules.

### Mock provider (development)

| Item | Detail |
|------|--------|
| **URL** | `POST /api/dev/mock-whatsapp/incoming` |
| **Purpose** | Local and automated tests without Twilio credentials |
| **Body** | JSON (`from`, `text`, optional `messageId`) |

Feature flags and optional secrets for the mock route are documented in environment examples and ADR 0004.

## Future providers

Additional BSPs (e.g. Meta Cloud API, Unifonic, 360dialog) can follow the same pattern: **adapter module** under `channels/whatsapp/<vendor>/`, map to `processIncomingMessage`, and optionally add an outbound sender that respects **human mode** and idempotency rules.

## References

- ADR 0003: WhatsApp provider abstraction  
- ADR 0004: Mock provider  
- ADR 0007: Twilio integration  
- ADR 0008: Human-mode orchestrator guard  
- `docs/05-api-design.md` for HTTP contracts  
