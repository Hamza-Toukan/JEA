# Frontend Foundation Architecture

## Style system (`src/styles/`)

| File | Role |
|------|------|
| `index.css` | Single entry: Tailwind + ordered imports |
| `tokens.css` | `:root` design tokens only |
| `themes/default-theme.css` | Tailwind `@theme` bridge + legacy `jea-*` aliases |
| `globals.css` | Minimal reset, `html`/`body`/`#root` defaults |
| `typography.css` | Headings, links, selection |
| `rtl.css` | `direction: rtl`, logical utilities |
| `scrollbar.css` | Thin scrollbars |
| `utilities.css` | Gradients, focus ring, shell padding, `ui-*` / `jea-*` helpers |
| `animations.css` | Smooth scroll + `prefers-reduced-motion` |

## Design tokens (`src/styles/tokens.css`)

Semantic CSS variables on `:root` (consumed by theme + utilities).

| Token family | Examples |
|--------------|----------|
| Brand | `--color-primary`, `--color-accent` |
| Surfaces | `--color-background`, `--color-surface` |
| Text | `--color-text`, `--color-text-secondary` |
| Status | `--color-success`, `--color-error`, … |
| Layout | `--shell-sidebar-width`, `--layout-page-x` |
| Elevation | `--shadow-sm`, `--shadow-md` |
| Motion | `--duration-fast`, `--ease-default` |
| Z-index | `--z-topbar`, `--z-modal`, `--z-drawer` |

Legacy `jea-*` Tailwind classes remain as aliases.

## Component variants (`src/lib/component-variants.js`)

All primitives read class maps from one file — no duplicated Tailwind strings.

## Application shell

```
AppShell
├── SidebarDesktop (lg+)
├── SidebarMobile (drawer < lg)
├── Topbar
└── main.ui-shell-main → <Outlet />
```

## Routing

- `routes/routes.config.js` — route registry + auth flags
- `routes/ProtectedRoute.jsx` — guard (`AUTH_GUARD_ENABLED` in `routes/index.jsx`)
- `routes/index.jsx` — layout + child routes

## Providers (`app/providers.jsx`)

- `QueryClientProvider` — React Query defaults (`lib/query-client.js`)
- `ThemeSync` — `data-theme`, `lang`, `dir` on `<html>`
- `AuthBootstrap` — session validation when API enabled
- `Toaster` — global toast stack
- React Query Devtools — development only

## API layer (`src/services/`)

```
services/
├── api/          client, request, interceptors, endpoints, errors, error-handler
├── auth/
├── conversations/
├── analytics/
├── workflows/
└── knowledge-base/
```

- All HTTP via `request()` with timeout, auth injection, 401 handling
- `setupApiLayer()` wires token getter + unauthorized handler at boot

## React Query

- Keys: `lib/query-keys.js`
- Feature hooks: `features/*/hooks/` (e.g. inbox, analytics)
- Server data in query cache; Zustand for UI-only state

## Auth

- `useAuthStore` — token, user, roles, hydration, refresh token (reserved)
- `ProtectedRoute` / `RoleRoute`
- `ROLES`: admin, supervisor, agent
- Guard flag: `VITE_AUTH_GUARD=true`

## Feedback & errors

- `AsyncState`, `ErrorState`, `ErrorBoundary`, `Toaster`
- `normalizeApiError`, `handleApiError` for consistent UX

## State (Zustand)

- `useUiStore` — sidebar, mobile nav, theme
- `useAuthStore` — session (persisted), RBAC helpers
- `useConversationsStore` — inbox UI (selection, filters, draft)
- `useNotificationsStore` — notification center + toasts

## Inbox (future realtime)

- `features/inbox/lib/normalize.js` — API → UI shape
- `useInboxConversations` / `useConversationMessages` — polling-ready queries
- Swap `refetchInterval` for Socket.io/SSE without page changes

See `STANDARDS.md` for day-to-day conventions.
