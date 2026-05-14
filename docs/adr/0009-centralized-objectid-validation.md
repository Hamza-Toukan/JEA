# ADR 0009: Centralized ObjectId Syntax Validation

## Status

Accepted

## Date

2026-05-13

## Context

Across conversation controllers and services, the project repeatedly called `mongoose.Types.ObjectId.isValid(...)` to validate route parameters and body fields.

This led to:

- Duplicated logic and inconsistent phrasing of validation intent.
- Higher maintenance cost when tightening or documenting validation rules.

**Important:** syntax validation is not the same as verifying that a document exists in MongoDB; existence checks remain in services or controllers with appropriate HTTP codes.

## Decision

Introduce a small shared helper `backend/src/core/utils/validate-object-id.js` exporting `validateObjectId(id)`, implemented as a thin wrapper around `mongoose.Types.ObjectId.isValid(id)`.

Controllers and services import this helper instead of repeating Mongoose calls.

## Consequences

- **Single place** to adjust or document ObjectId syntax rules for HTTP-facing validation.
- **No change** to database semantics: callers must still use queries or `httpError` patterns for “not found” versus “bad id format.”
- **Known Mongoose caveat:** `isValid` can return true for some 24-character hex strings that are not canonical ObjectIds; tightening that behavior would be a deliberate future change in one module.

## Related

- `docs/05-api-design.md` for API validation error envelope.
