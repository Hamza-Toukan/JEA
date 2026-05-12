# ADR 0005: Use Pino for Application Logging

## Status

Accepted

## Date

2026-05-06

## Context

The project requires clear operational visibility during development and later in production.

The system will handle WhatsApp messages, conversations, tickets, admin actions, integrations, and future AI decisions. These areas need structured logs for debugging and monitoring.

The project also requires audit trails, but audit logs are different from application logs.

## Decision

Use Pino for application logging.

Application logs will be used for:

- request tracing
- startup logs
- database connection logs
- incoming provider messages
- unexpected errors (including full server-side context; never return stack traces to clients)
- operational debugging

Audit logs will be implemented later as a separate database-backed module.

## Reason

Pino provides structured JSON logging with low overhead and works well for Node.js APIs.

In development, `pino-pretty` is used to make logs readable.

In production, logs should remain structured JSON.

## Alternatives Considered

### console.log

Rejected because it is not structured enough for a growing production system.

### Winston

Considered because it is flexible and supports multiple transports.

Rejected for now because Pino is simpler, faster, and better suited for structured API logs in this project.

### Pino

Accepted because it provides structured, low-overhead logging and can be extended later.

## Consequences

- All application logs should go through the shared logger.
- Direct `console.log` should be avoided in application code.
- Each request receives a request ID for traceability.
- Audit logs will be implemented separately later.
