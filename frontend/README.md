# JEA Digital Assistant — Admin Dashboard

Enterprise RTL admin UI for the Jordan Engineers Association operations platform.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router
- IBM Plex Sans Arabic
- Lucide icons

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API requests to `/api/*` proxy to `http://localhost:5000`.

## Pages

| Route | Page |
|-------|------|
| `/dashboard` | Operations overview |
| `/inbox` | WhatsApp inbox & member profile |
| `/knowledge-base` | Knowledge base management |
| `/workflows` | AI workflow builder |
| `/analytics` | Reports & metrics |
| `/settings` | Platform configuration |

## Design system

Tokens live in `src/index.css` (`@theme`). Reusable UI in `src/components/ui/`.

Brand palette: navy `#062B5B`, cyan accents, light gray surfaces — aligned with [jea.org.jo](https://www.jea.org.jo/Default/Ar).
