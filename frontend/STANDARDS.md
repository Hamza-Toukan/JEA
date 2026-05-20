# Frontend Standards

Enterprise conventions for the JEA admin platform. Visual design is unchanged; these rules govern **how** code is organized and integrated.

## Folder boundaries

| Layer | Owns | Must not |
|-------|------|----------|
| `features/*` | Pages, feature hooks, feature-local lib/data | Import other features directly |
| `components/*` | Reusable UI, layout, feedback | Call APIs or hold server cache |
| `services/*` | HTTP, endpoints, error normalization | Import React or Zustand |
| `store/*` | Global UI + session state | Store server lists (use React Query) |
| `hooks/*` | Cross-feature hooks | Feature-specific business rules |
| `lib/*` | Query client, keys, cn, variants | Feature domain logic |

## Imports

- Use `@/` alias for `src/` paths.
- Import from barrel `index.js` when present (`@/components/ui`, `@/services`).
- Pages import: layout → UI → hooks → store/constants — never `services` directly in pages (use feature hooks).

## Naming

- Components: `PascalCase.jsx`
- Hooks: `use-kebab-case.js`
- Services: `domain.service.js` inside `services/domain/`
- Stores: `domain.store.js` → `useDomainStore`
- Query keys: `queryKeys.domain.action(params)` in `lib/query-keys.js`

## Data fetching

1. **API** — domain service → `request()` only.
2. **Cache** — React Query in feature hooks (`features/*/hooks/`).
3. **UI state** — Zustand (filters, selection, drafts).
4. **Async UI** — `AsyncState` / `LoadingState` / `EmptyState` / `ErrorState`.

```jsx
// Preferred page pattern (when API enabled)
const { data, isLoading, isError, error, refetch } = useInboxConversations();
useQueryErrorToast(isError ? error : null);

return (
  <AsyncState isLoading={isLoading} isError={isError} error={error} onRetry={refetch} isEmpty={!data?.items?.length}>
    {/* render */}
  </AsyncState>
);
```

## Auth & roles

- Session: `useAuthStore` (persisted).
- Guards: `ProtectedRoute` (auth), `RoleRoute` (RBAC).
- Roles: `ROLES` + `hasAnyRole` from `@/constants/roles`.
- Enable guard: `VITE_AUTH_GUARD=true` in `.env`.

## Errors & toasts

- Throw/handle `ApiError` from services.
- User messages: `getErrorMessage()` / `handleApiError()`.
- Toasts: `useToast()` or `useNotificationsStore.getState().addToast()`.
- 401: handled globally in `setupApiLayer()`.

## Environment flags

| Variable | Effect |
|----------|--------|
| `VITE_API_ENABLED=true` | Live API + React Query fetches |
| `VITE_AUTH_GUARD=true` | Enforce `ProtectedRoute` |
| `VITE_API_TIMEOUT_MS` | Request timeout (default 30000) |
| `VITE_INBOX_POLL_MS` | Inbox poll interval (default 30000) |

## File size

- Prefer &lt; 200 lines per file; split hooks/services when growing.
- No API calls inside components — only in services or hooks.

## Feature ownership

Each feature exports only its public API from `features/<name>/index.js` (pages + hooks). Internal `data/mock.js` stays until backend replaces it.
