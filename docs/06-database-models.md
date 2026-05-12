# Database Models

Database: MongoDB  
ODM: Mongoose

## Conversation Model

File:

backend/src/modules/conversations/conversation.model.js

Purpose:

Represents a full chat conversation with one WhatsApp user/customer.

### Fields

#### customerPhone

The WhatsApp phone number of the user.

Used as the current main identifier before member verification is implemented.

#### memberId

The internal member ID after successful member verification.

Currently nullable because member verification is not implemented yet.

#### status

Allowed values:

- open
- closed

Used to know whether the conversation is active or closed.

#### mode

Allowed values:

- bot
- human

Meaning:

bot:
The bot can reply automatically.

human:
The conversation has been handed off to an employee and the bot should stop automatic replies later.

This supports the Smart Human Handoff requirement.

#### lastMessageText

Stores the latest message text.

Used later for Admin Inbox preview.

#### lastMessageAt

Stores the time of the latest conversation activity.

Used later to sort conversations by most recent.

#### assignedTo

Future reference to the employee/user assigned to the conversation.

#### tags

List of labels for filtering and classification.

Examples later:

- insurance
- membership
- complaint
- urgent

#### metadata

Flexible object for extra data.

Examples later:

- source provider
- language
- raw provider data
- debug metadata

### Indexes

- Unique partial index on `customerPhone` where `status` is `open` — at most one open conversation per phone (concurrency-safe with try/create + duplicate-key recovery in the service layer).
- Compound index on `customerPhone` + `status` for lookups and filters.
- `lastMessageAt` descending for inbox ordering.

Purpose:

Support efficient queries for:

- finding or creating the single open conversation by phone
- listing recent conversations
- filtering by status/mode

Existing deployments: if duplicate open conversations already exist for the same phone, fix or merge them before the partial unique index can be created successfully.

---

## Message Model

File:

backend/src/modules/conversations/message.model.js

Purpose:

Represents one message inside a conversation.

### Fields

#### conversationId

Reference to Conversation.

Each message must belong to a conversation.

#### direction

Allowed values:

- inbound
- outbound

Meaning:

inbound:
Message received from customer.

outbound:
Message sent by bot, agent, or system.

#### senderType

Allowed values:

- customer
- bot
- agent
- system

Meaning:

customer:
End user / engineer.

bot:
Automated assistant.

agent:
Human employee.

system:
Internal system event.

#### text

Message text content.

For non-text messages, this may be empty and metadata can store extra data.

#### provider

Allowed values:

- mock
- meta
- twilio

Current provider:

mock

#### providerMessageId

The message ID from the WhatsApp provider.

Important for idempotency and avoiding duplicate messages.

#### correlationInboundMessageId

Optional ObjectId of the inbound message when this document is a bot outbound reply.

Enforces at most one bot reply per inbound message (partial unique index). New writes populate this field; older documents may only have `metadata.inboundMessageId`.

#### messageType

Allowed values:

- text
- image
- file
- interactive
- system

Current MVP uses text only.

#### metadata

Flexible object for raw payloads and future AI/provider data.

### Indexes

- conversationId + createdAt
- provider + providerMessageId unique sparse
- correlationInboundMessageId unique partial (bot replies tied to one inbound message)

Purpose of unique provider/providerMessageId:

Avoid duplicate saved messages if a webhook is retried by the provider.

---

## Idempotency (inbound webhooks)

1. **Inbound message row**: `Message` has a sparse unique compound index on `provider` + `providerMessageId`. Retries with the same provider message id do not insert a second inbound document; the service detects the duplicate insert (error code 11000) and loads the existing message.

2. **Outbound bot reply**: Bot outbounds set `correlationInboundMessageId` (and `metadata.inboundMessageId`). If an inbound message is a duplicate retry, the orchestrator looks up an existing outbound bot message for that inbound id and returns it instead of generating a second reply. Concurrent retries that race past that lookup are deduplicated again at insert time via the partial unique index on `correlationInboundMessageId`.

3. **Rare partial failure**: If the first request failed after saving the inbound message but before saving the outbound bot reply, a retry with the same provider message id is treated as a duplicate inbound; the orchestrator finds no prior bot reply and creates one.

---

- full conversation logging
- context preparation
- future admin inbox
- future ticketing
- future human handoff
- future audit/reporting