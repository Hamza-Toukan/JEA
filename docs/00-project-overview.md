# JEA Digital Assistant — Project Overview

## Project Summary

JEA Digital Assistant is a WhatsApp-based digital assistant platform for the **Jordan Engineers Association (JEA)**.

The system is not intended to be only a simple chatbot. It is a service platform that will support:

- WhatsApp-based conversations
- Conversation history and context management
- Admin inbox for employees
- Human handoff from bot to employee
- Ticketing and case management (implemented as ticket fields and staff APIs on `Conversation`; see ADR 0010)
- Knowledge base answers
- Member verification
- Smart service flows
- Attachments handling
- Audit logs
- Reports and dashboards
- Future AI/NLP/RAG capabilities

## Source of Requirements

The initial scope is based on the technical offer for the AI-powered WhatsApp Digital Assistant project.

Key requirements from the offer include:

- A WhatsApp digital assistant available 24/7.
- Understanding free-text user messages.
- Supporting Arabic formal replies and Jordanian dialect understanding.
- Managing conversation context.
- Answering from an approved knowledge base.
- Smart handoff to a human employee when needed.
- Full conversation and request logging.
- Admin portal for managing conversations, requests, users, permissions, and reports.
- Ticketing/case management.
- Audit trails and analytics.

## Current Implementation Phase

**Foundation and real WhatsApp channel integration are in place for the MVP track.**

- **Primary integrated WhatsApp provider:** **Twilio** (inbound webhook, outbound replies via the Twilio SDK, environment-based configuration). The mock WhatsApp endpoint remains available for **local development and automated testing** without Twilio credentials.
- **Backend:** modular monolith (Express + MongoDB), validated configuration, structured logging (Pino), JWT-backed admin APIs, conversation and message persistence, conversation orchestration with rule-based Arabic replies, **human-mode guard** so the bot does not reply when staff are handling a thread, **inbox management** APIs (read + assign / mode / status), and **ticketing** (ticket number generation, ticket status and priority, internal staff notes, and status sync when a ticket or conversation is closed — ADR 0010).
- **Not yet in scope for this phase:** production knowledge base, member verification UI, full audit store, and advanced AI/RAG—see ADRs and `docs/02-architecture.md` for direction.

## Operational Notes (JEA)

- Twilio sandbox or production numbers require correct **environment variables** and a **public HTTPS webhook URL** (e.g. ngrok or deployed infrastructure) for Twilio to reach the API.
- Admin staff can set a conversation to **human** mode so inbound WhatsApp messages are still logged but **automated bot replies and Twilio outbound sends from the orchestrator are suppressed** for that conversation until mode returns to **bot**.

## First Technical Milestone (Achieved Path)

Inbound WhatsApp (mock or Twilio)

→ Find or create conversation

→ Persist inbound message (with provider idempotency where applicable)

→ Orchestrator evaluates **human vs bot** mode

→ If bot: generate reply, persist outbound, and for **Twilio** send the reply via the Twilio API

→ Return acknowledgement to the channel (JSON for mock, TwiML for Twilio)

## Architecture Decision Records (ADR)

Key decisions are recorded under `docs/adr/`, including monorepo layout, modular monolith, provider abstraction, mock provider, logging, JWT auth, **Twilio integration (0007)**, **human-mode orchestrator guard (0008)**, **centralized ObjectId validation (0009)**, and **ticketing on the conversation model (0010)**.

## Current Branch

Work is proceeding on branches such as **`feature/conversation-management`**; align local branch names with your Git workflow.

## Notes

The codebase keeps **provider-specific wiring** under `backend/src/modules/channels/whatsapp/` (mock and Twilio) while **conversation storage and orchestration** stay provider-agnostic at the domain level, in line with the technical offer’s expectation of a sustainable integration path for JEA.
