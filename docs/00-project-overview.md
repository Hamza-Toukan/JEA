# JEA Digital Assistant — Project Overview

## Project Summary

JEA Digital Assistant is a WhatsApp-based digital assistant platform for the Jordan Engineers Association.

The system is not intended to be only a simple chatbot. It is a service platform that will support:

- WhatsApp-based conversations
- Conversation history and context management
- Admin inbox for employees
- Human handoff from bot to employee
- Ticketing and case management
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

Current phase: Foundation / MVP.

The current focus is not AI yet and not the real WhatsApp provider yet.

Current focus:

1. Backend foundation.
2. Environment validation.
3. MongoDB connection.
4. Health endpoint.
5. Conversation and message storage.
6. Mock WhatsApp incoming endpoint for development.

## First Technical Milestone

The first milestone is:

Mock WhatsApp message
→ Find or create conversation
→ Save inbound customer message
→ Generate temporary bot reply
→ Save outbound bot message
→ Return response to caller

## Current Branch

feature/conversations-foundation

## Notes

The real WhatsApp provider is not finalized yet. Therefore, the system starts with a Mock WhatsApp Provider for development and testing.