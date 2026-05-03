# Technical Specification

## Stack (current)

| Layer | Technology | Version (see `package.json`) |
| ----- | ---------- | ---------------------------- |
| Runtime | Node.js | LTS recommended for local dev |
| Framework | Next.js | 16.x |
| UI | React / React DOM | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Lint | ESLint + eslint-config-next | 9.x / aligned with Next |

## Local development

```bash
npm install
npm run dev
```

Other package managers: `pnpm dev`, `yarn dev`, `bun dev` as supported by your environment.

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server after build |
| `npm run lint` | ESLint |

## Environment

- Server-only: `OWM_API_KEY` in `.env.local` (see `docs/prd.md`). Do not commit secrets.
- _Additional `NEXT_PUBLIC_*` variables: none required yet._

## Temperature units

- **API & persisted JSON:** Celsius (`units=metric` from OpenWeatherMap; normalized types store °C).
- **UI default:** Fahrenheit (**°F**) on first load; users switch to Celsius via the unit toggle without refetching.

Do not commit `.env.local` (gitignored by default in Next.js templates).

## Conventions

- Prefer App Router file conventions; consult `node_modules/next/dist/docs/` when APIs change (see root `AGENTS.md`).
- Co-locate route-specific components under `app/` or extract shared UI under a dedicated folder as the codebase grows.

## Testing & quality

- _Add testing stack and commands (e.g. Vitest, Playwright) when introduced._

---

*Bump versions and sections when dependencies or deployment targets change.*
