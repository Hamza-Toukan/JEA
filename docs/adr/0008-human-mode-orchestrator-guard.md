# ADR 0008: Human-Mode Orchestrator Guard

## Status

Accepted

## Date

2026-05-13

## Context

The JEA technical offer requires **human handoff**: staff must be able to take over a conversation so members receive accurate, policy-aligned answers without the automated assistant **competing** with live agents.

Without an explicit guard, any inbound webhook (mock or Twilio) would still run the rule-based orchestrator and enqueue **bot outbound** messages even when a conversation is under manual handling.

## Decision

Implement an **early-return guard** in `conversation-orchestrator.service.js` inside `processIncomingMessage`, **after** inbound persistence and **after** the duplicate-inbound idempotency short-circuit, **before** `buildDefaultBotReply` and `saveBotReply`:

- If `conversation.mode === "human"`, log at **info** level and return `{ conversation, inboundMessage, outboundMessage: null, replyText: "" }`.
- No bot reply is written to the database for that turn, and **Twilio outbound** is not invoked (it only runs after `saveBotReply` in the Twilio branch).

`assignedTo` and other inbox fields continue to be managed via admin APIs; **mode** is the authoritative switch for suppressing automated replies in the orchestrator path.

## Consequences

- **Clean separation of responsibilities:** inbound logging continues; automation stops until `mode` returns to `bot`.
- **Channel-agnostic behavior:** the same guard applies whether the inbound message arrived from the mock endpoint or Twilio.
- **Future work:** agent-composed replies will require a separate outbound path (e.g. “send as agent”) that does not rely on the bot orchestrator branch; this ADR does not define that API.

## Related

- ADR 0007: Twilio integration (outbound only after bot reply).
- Admin PATCH conversation mode API in `docs/05-api-design.md`.
