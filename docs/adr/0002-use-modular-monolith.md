# ADR 0002: Use Modular Monolith

## Status

Accepted

## Date

2026-05-06

## Context

The system is expected to include several functional areas:

- WhatsApp channel handling
- Conversations and messages
- Admin inbox
- Ticketing and case management
- Knowledge base
- Member verification
- Service flows
- Human handoff
- Audit logs
- Reports
- Future AI/NLP/RAG capabilities

The project is still at an early stage and the scope may evolve after requirement gathering.

## Decision

Use a Modular Monolith backend architecture.

This means the backend is deployed as one application, but internally divided into clear modules.

Example structure:

```text
backend/src/
  core/
  modules/
    channels/
    conversations/
    tickets/
    knowledge/
    members/
    flows/
    audit/
    reports/
```

## Consequences

- Teams can grow features inside `modules/` without splitting deployments prematurely.
- Shared infrastructure stays in `core/` (config, database, middleware, logging).
- If a module later needs to be extracted, boundaries are already visible in the folder layout.
