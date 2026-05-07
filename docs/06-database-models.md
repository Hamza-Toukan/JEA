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

- customerPhone
- memberId
- status
- mode
- lastMessageAt
- customerPhone + status

Purpose:

Support efficient queries for:

- finding open conversations by phone
- listing recent conversations
- filtering by status/mode

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

Purpose of unique provider/providerMessageId:

Avoid duplicate saved messages if a webhook is retried by the provider.

---

## Notes

These models support the first foundation requirement:

- full conversation logging
- context preparation
- future admin inbox
- future ticketing
- future human handoff
- future audit/reporting