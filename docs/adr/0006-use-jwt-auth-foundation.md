# ADR 0006: Use JWT Auth Foundation

## Status

Accepted

## Date

2026-05-06

## Context

The system includes an administrative portal for employees, supervisors, and administrators.

Administrative APIs expose sensitive operational data such as conversations, messages, member-related context, and later tickets and attachments.

The technical requirements include access control, user roles, login tracking, and API protection.

## Decision

Use JWT-based authentication for the backend MVP.

The system will start with a simple role-based model:

- admin
- supervisor
- agent

Protected APIs will require a valid bearer token.

## Reason

JWT authentication is simple, stateless, and suitable for the MVP stage.

It allows the frontend admin portal to authenticate users and call protected APIs.

## Current Scope

Implemented now:

- User model
- Password hashing with bcrypt
- Login endpoint
- JWT token generation
- Auth middleware
- Role middleware
- Protected conversations APIs
- Seed admin script

## Out of Scope For Now

The following are postponed:

- Refresh tokens
- Two-factor authentication
- Password reset
- Full permission matrix
- SSO
- Session/device management

## Consequences

- Admin APIs are no longer publicly accessible.
- Initial users can be created using a seed script.
- More advanced RBAC/permissions can be added later without rewriting the whole auth layer.