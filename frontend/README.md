# JEA Digital Assistant — Admin Platform

Enterprise RTL admin frontend for Jordan Engineers Association AI operations.

## Architecture

```text
src/
├── app/              # Root app + providers
├── routes/           # Route definitions
├── layouts/          # Shell layouts (AdminLayout)
├── components/
│   ├── ui/           # Design system primitives
│   ├── layout/       # Sidebar, Topbar, PageContainer, SectionHeader
│   ├── forms/        # FormField, SearchInput
│   ├── tables/       # DataTable, Pagination
│   ├── feedback/     # Alert, EmptyState, Loading, Skeleton
│   └── charts/       # Chart placeholders
├── features/         # Feature modules (pages, data, future hooks)
├── services/         # API client + domain services
├── store/            # Zustand stores (auth, ui, conversations, notifications)
├── hooks/
├── lib/              # cn(), variants()
├── utils/
├── constants/        # routes, navigation, status
├── styles/           # tokens, theme, globals, typography, rtl, utilities, …
└── assets/
```

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base (empty = same origin + Vite proxy) |

## Design system (foundation layer)

| Layer | Path |
|-------|------|
| Styles | `src/styles/` — tokens, theme, layered CSS |
| API | `src/services/` — request layer + domain services |
| Queries | `@tanstack/react-query` + `src/lib/query-keys.js` |
| Auth | `src/store/auth.store.js` + `ProtectedRoute` / `RoleRoute` |
| Errors | `AsyncState`, `Toaster`, `handleApiError` |
| Variants | `src/lib/component-variants.js` |
| Shell | `src/layouts/AppShell.jsx` |

See `ARCHITECTURE.md` and `STANDARDS.md`.

### Environment (integration)

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_ENABLED` | `false` | Enable live API fetches |
| `VITE_AUTH_GUARD` | `false` | Enforce auth on routes |
| `VITE_API_BASE_URL` | `""` | API origin (Vite proxy `/api` in dev) |
| `VITE_API_TIMEOUT_MS` | `30000` | Request timeout |
| `VITE_INBOX_POLL_MS` | `30000` | Inbox polling interval |

```js
import { Button, Card } from "@/components/ui";
import { Alert, Skeleton } from "@/components/feedback";
import { PageContainer, SectionHeader } from "@/components/layout";
```

Brand aligned with [jea.org.jo](https://www.jea.org.jo/Default/Ar): navy, soft cyan, institutional surfaces.

## State

- `useAuthStore` — session (persisted)
- `useUiStore` — sidebar, theme prep
- `useConversationsStore` — inbox filters/selection
- `useNotificationsStore` — notification center prep

## API layer

```js
import { conversationsService } from "@/services";
import { useAuthStore } from "@/store";

const token = useAuthStore.getState().token;
await conversationsService.listConversations({ page: 1 }, token);
```
