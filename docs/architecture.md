# Architecture

High-level structure of **starter-nextjs-cursor-template**. Adjust as features are added.

## Runtime model

- **Framework:** [Next.js](https://nextjs.org) App Router (`app/`).
- **UI:** React Server Components by default; Client Components only where interactivity or browser APIs require `"use client"`.
- **Styling:** Tailwind CSS v4 with PostCSS (`app/globals.css`).

## Repository layout

| Path | Role |
| ---- | ---- |
| `app/` | Routes, layouts, and route-specific UI |
| `app/layout.tsx` | Root layout, fonts, metadata |
| `app/page.tsx` | Home route |
| `public/` | Static assets |
| `next.config.ts` | Next.js configuration |

## Data & external services

- **OpenWeatherMap** — `/api/weather` route proxies requests with `OWM_API_KEY`; responses normalize to °C internally.
- **Display:** Temperatures default to **Fahrenheit (°F)** in the UI; switching to Celsius is client-side only (see `docs/prd.md`).

## Deployment

- Typical target: [Vercel](https://vercel.com) or any Node-compatible host that supports the Next.js version in `package.json`.

## Cross-cutting concerns

- **TypeScript:** Strict typing for app and config code.
- **Linting:** ESLint with `eslint-config-next`.

## Scaling Approach

- Start with simple component structure
- Introduce `/features` folder when product complexity grows
- Keep UI, logic, and data concerns separated

---

*Keep this file aligned with real routes, env vars, and integrations.*
