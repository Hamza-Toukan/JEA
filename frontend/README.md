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
├── styles/           # tokens.css, globals.css
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

## Design system

- Tokens: `src/styles/tokens.css`
- Components: `import { Button, Card } from "@/components/ui"`
- Semantic feedback: `@/components/feedback`

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
