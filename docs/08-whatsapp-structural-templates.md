# WhatsApp Structural Templates (Generic Reusable Containers)

## Purpose

JEA business flows are **not finalized yet**. This project intentionally separates:

- **Message structure** (how many buttons, list rows, body slot)
- **Business meaning** (yes/no, insurance, membership, renew, etc.)

Structural templates are **reusable WhatsApp approved-template containers**. They are **not** tied to a single JEA service name.

## What we are NOT doing

- We are **not** creating one Twilio template per business screen (`insurance_menu`, `membership_renew`, …).
- We are **not** hardcoding `ContentSid` in state handlers or orchestrators.

## Structural template set

| Key | Structure | Options |
|-----|-----------|---------|
| `quick_reply_2` | Quick reply | 2 buttons |
| `quick_reply_3` | Quick reply | 3 buttons |
| `list_4` … `list_10` | List picker | 4–10 rows |
| `auth_otp` | Utility | OTP body + code |
| `generic_notification` | Utility | body + headline + detail |

Configure each via `TWILIO_TEMPLATE_*_SID` in environment (see `backend/.env.example`).

## Variable model (structural only)

Examples:

**`quick_reply_2`**

- `body`, `option1`, `option2`

**`quick_reply_3`**

- `body`, `option1`, `option2`, `option3`

**`list_6`**

- `body`, `buttonText`, `row1` … `row6`

The same `quick_reply_2` template can represent:

- Arabic or English labels (values in variables)
- Yes/No, Confirm/Cancel, Renew/Inquiry — **only variables change**

## Resolution flow

1. State handler returns `InteractiveResponse` (provider-agnostic).
2. `buildInteractiveMessage()` produces rendered `quick_reply` or `list`.
3. `resolveInteractiveTemplate({ type, optionCount })` → e.g. `list_6`.
4. `buildStructuralVariablesFromRendered()` fills generic variable names.
5. If registry `ContentSid` is configured → `approved_template` transport → Twilio `messages.create({ contentSid })`.
6. If not configured → **runtime interactive** fallback (dynamic Content API create).

## Runtime vs approved structural

| Path | When | Twilio mechanism |
|------|------|------------------|
| **Structural approved** | Matching `TWILIO_TEMPLATE_*_SID` set | Pre-approved `ContentSid` + variables |
| **Runtime interactive** | No SID for resolved key | Create Content per send (session) |

Both use the same handler output and rendering layer.

## Business templates (separate)

Optional named templates remain for **specific notifications**, e.g.:

- `ticket_created` — `ticketNumber`
- `verification_success` — `memberName`

Use sparingly. Prefer structural templates for menus and choices.

## Future

- Locales: `getTemplate(key, { locale: 'en' })`
- Meta / Unifonic: parallel registries + mappers
- Database-backed registry
- Template versioning per environment

## Code locations

- `interactive-template-resolver.service.js` — key from shape
- `structural-template-variables.util.js` — generic variable mapping
- `structural-template-delivery.service.js` — transport builder + fallback
- `template-registry.service.js` — definitions + `resolveTemplate`
