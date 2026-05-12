# ADR 0004: Start With Mock WhatsApp Provider

## Status

Accepted

## Date

2026-05-06

## Context

The system must eventually receive and send WhatsApp messages.

However, the production WhatsApp setup is not ready yet.

Development should not be blocked by:

- WhatsApp Business number setup
- Meta Business verification
- BSP onboarding
- Webhook verification
- Template approval
- Final provider decision

## Decision

Start development with a Mock WhatsApp Provider.

The mock provider is used for local development and controlled testing.

Current mock endpoint:

```http
POST /api/dev/mock-whatsapp/incoming
```

Security:

- Mock routes are disabled unless `ENABLE_MOCK_WHATSAPP=true`.
- Outside `NODE_ENV=development`, `MOCK_WHATSAPP_SECRET` is required and must be sent as header `x-mock-whatsapp-secret`.

## Consequences

- Engineers can exercise the full inbound → orchestrator → persistence flow without a real BSP.
- Production deployments must keep mock disabled unless explicitly required and properly secret-protected.
