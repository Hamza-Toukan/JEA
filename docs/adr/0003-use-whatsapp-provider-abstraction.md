# ADR 0003: Use WhatsApp Provider Abstraction

## Status

Accepted

## Date

2026-05-06

## Context

The production WhatsApp provider is not finalized yet.

The original technical offer mentioned Unifonic, but the current implementation should not depend on any single provider from day one.

Possible future providers include:

- Meta WhatsApp Cloud API
- Twilio
- Unifonic
- 360dialog
- Any approved WhatsApp BSP

Each provider has different webhook payloads, authentication methods, message IDs, media handling, templates, and delivery status formats.

## Decision

Use a WhatsApp Provider Abstraction.

The core system should not directly depend on Meta, Twilio, Unifonic, or any specific provider.

Provider-specific code should stay inside:

```text
backend/src/modules/channels/whatsapp/
```

Core conversation and orchestration logic should work against normalized inbound/outbound events (phone, text, provider ids, metadata), not raw BSP payloads.

## Consequences

- Adding a production provider means a new adapter under `channels/whatsapp/` plus configuration, not a rewrite of conversation storage.
- The mock provider remains the default development entry point (see ADR 0004).
