# ADR 0001: Use Monorepo

## Status

Accepted

## Date

2026-05-06

## Context

The project includes multiple parts that will evolve together:

- Backend API
- Frontend Admin Portal
- Documentation
- Infrastructure configuration
- Utility scripts

The project is still in the foundation/MVP phase, and keeping all parts in one repository makes development and coordination easier.

## Decision

Use a monorepo structure:

```text
jea-digital-assistant/
  backend/
  frontend/
  docs/
  infra/
  scripts/