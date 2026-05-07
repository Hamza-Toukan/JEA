# Architecture

## Architecture Style

The project uses a Modular Monolith architecture.

This means the backend is one deployable application, but internally divided into clear modules.

## Why Modular Monolith?

This project is still in its early phase, and the scope is evolving. A modular monolith is simpler and safer than microservices at this stage.

Benefits:

- Easier development
- Easier debugging
- Easier deployment
- Clear module separation
- Avoids premature microservices complexity
- Allows future extraction if needed

## High-Level System Flow

User / Engineer
→ WhatsApp Channel later / Mock Provider now
→ WhatsApp Provider Layer
→ Conversation Orchestrator
→ Conversation Service
→ Database

Later modules will be added:

- Member Verification Service
- Intent Detection Service
- Knowledge Base Service
- Flow Engine
- Ticketing Service
- Human Handoff Service
- Audit Log Service
- Reports Service

## Current Backend Modules

### core

Shared infrastructure code.

Includes:

- environment config
- database connection
- global middleware
- error handling
- future logging/security utilities

### health

Provides health check endpoint.

Endpoint:

GET /api/health

### conversations

Responsible for storing and managing conversations and messages.

Current files:

- conversation.model.js
- message.model.js
- conversation.service.js

### channels/whatsapp/mock

Development-only mock WhatsApp entry point.

Current endpoint:

POST /api/dev/mock-whatsapp/incoming

### orchestration

Responsible for routing incoming messages and deciding what should happen next.

Current file:

- conversation-orchestrator.service.js

Currently it generates temporary rule-based replies.

Later it will connect to:

- Knowledge Base
- Intent Detection
- Flow Engine
- Ticketing
- Human Handoff
- AI/RAG

## Current Request Flow

POST /api/dev/mock-whatsapp/incoming
→ mock-whatsapp.routes.js
→ mock-whatsapp.controller.js
→ Zod validation
→ conversation-orchestrator.service.js
→ conversation.service.js
→ Conversation model
→ Message model
→ MongoDB
→ JSON response

## Important Design Rule

Controllers should stay thin.

Controllers should:

- validate request
- call service/orchestrator
- return response

Business logic should live in services and orchestrators.

## Logging Strategy

The backend uses Pino for structured application logging.

Current logging foundation includes:

- Shared logger under `core/logger/logger.js`
- Request ID middleware
- HTTP request logging through Morgan streamed into Pino
- Startup logs
- Database connection logs
- Error logs through global error middleware
- Mock WhatsApp incoming message logs

Each request receives an `X-Request-Id` response header.

Application logs are different from audit logs.

Application logs are used for technical troubleshooting and operations.

Audit logs are used for business/security traceability and will be implemented later as a database-backed module.

Examples of application logs:

- API started
- MongoDB connected
- Incoming mock WhatsApp message received
- Request failed

Examples of audit logs later:

- Employee changed ticket status
- Admin changed permissions
- Employee viewed an attachment
- Conversation handed off to human agent

## Admin Conversations API

The Admin Conversations API is the first backend read API for the future Admin Inbox.

It supports the requirement for a central administrative portal to view and manage incoming conversations.

Current endpoints:

```http
GET /api/conversations
GET /api/conversations/:conversationId
GET /api/conversations/:conversationId/messages