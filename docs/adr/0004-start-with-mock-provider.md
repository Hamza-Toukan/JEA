
---

## 4. `docs/adr/0004-start-with-mock-provider.md`

```md
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

The mock provider is used only for local development/testing.

Current mock endpoint:

```http
POST /api/dev/mock-whatsapp/incoming