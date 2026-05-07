# API Design

## Current API Version

Current base path:

```text
/api

## Auth

### POST /api/auth/login

Authenticates an admin portal user.

Request body:

```json
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}