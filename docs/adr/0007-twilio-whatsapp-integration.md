# ADR 0007: Twilio WhatsApp Integration

## Status

Accepted

## Date

2026-05-13

## Context

The Jordan Engineers Association digital assistant must operate on **WhatsApp** with a **reliable, production-grade** BSP path, not only a development mock.

The project needed:

- A stable vendor SDK and documented APIs for inbound webhooks and outbound sends.
- Clear separation between **channel adapters** and **core** conversation/orchestration logic.
- Configuration that supports local development (tunneling) and staged/production deployment.

The mock provider remains valuable for CI and developer workflows but is insufficient as the sole integration for real member traffic.

## Decision

Select **Twilio** as the **primary integrated WhatsApp provider** for real message flow.

Implementation:

- Dedicated module under `backend/src/modules/channels/whatsapp/twilio/` (controller, routes, service).
- **Inbound:** `POST /api/whatsapp/twilio/webhook` accepts Twilio’s `application/x-www-form-urlencoded` payload, normalizes fields, and delegates to `processIncomingMessage` with `provider: "twilio"`.
- **Outbound:** after a bot reply is persisted, the orchestrator invokes `sendTwilioMessage` when `provider === "twilio"`, using `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_NUMBER` from validated environment configuration.
- **Human mode:** the existing orchestrator guard prevents bot persistence and Twilio outbound when `conversation.mode === "human"` (see ADR 0008).

## Consequences

- **Dependency:** the `twilio` npm package is required for outbound sends and must be kept updated for security patches.
- **Operations:** Twilio requires correct webhook URLs (typically **HTTPS**); **ngrok** or similar is used during local development so Twilio can reach the API.
- **Configuration:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_NUMBER` must be managed as secrets; missing values fail outbound sends (inbound persistence may still succeed depending on failure point).
- **Vendor coupling:** Twilio-specific request signing, error codes, and template policies remain in the Twilio module; core models stay channel-agnostic where possible.

## Related

- ADR 0003: WhatsApp provider abstraction (folder layout and intent).
- ADR 0004: Mock provider for development.
- `docs/07-whatsapp-provider-strategy.md` for webhook field mapping and flow.
