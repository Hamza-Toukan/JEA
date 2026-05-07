# WhatsApp Provider Strategy

## Current Situation

The final production WhatsApp provider is not confirmed yet.

The original technical offer mentions Unifonic as the communication partner, but the current internal direction is not finalized.

Therefore, the code must not be tightly coupled to any specific provider.

## Decision

Use WhatsApp Provider Abstraction.

During development, use a Mock WhatsApp Provider.

Later, integrate the selected production provider.

Possible future providers:

- Meta WhatsApp Cloud API
- Twilio
- Unifonic
- 360dialog
- Any approved BSP

## Why Mock Provider First?

The Mock Provider allows development to continue without waiting for:

- official WhatsApp number
- Meta Business setup
- BSP onboarding
- webhook verification
- template approval
- production provider decision

## Current Mock Endpoint

POST /api/dev/mock-whatsapp/incoming

Example request:

```json
{
  "from": "962790000000",
  "text": "مرحبا بدي أعرف عن التأمين"
}