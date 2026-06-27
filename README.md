# Rift

A closed-network office space exchange for VC-backed companies. Portfolio companies share unused office space with each other — no randos, no WeWork liability.

## Tech stack

- **React 18 + TypeScript** — UI and app logic
- **Vite** — dev server and build tool
- **React Router v6** — client-side routing
- **Tailwind CSS** — styling and design tokens
- **Framer Motion** — animations/transitions
- **lucide-react** — icons
- **Browser `localStorage`** — all persistence; no backend, no database, no external APIs

## Local setup

```bash
npm install
npm run dev
```

Then open the printed local URL (e.g. `http://localhost:5173`) in your browser.

## Other scripts

```bash
npm run build    # type-check and build for production
npm run preview  # preview the production build locally
```

## Notes

- Frontend-only — all data is stored in the browser's `localStorage`, no backend or external APIs.
- Sign up as either a **host** (lists space) or a **guest** (books space) — each role sees a different nav and dashboard.
- Admin dashboard (manual host/guest matching): go to `/admin`, password `rift2035`.
- To reset all demo data, open DevTools → Console and run `localStorage.clear()`.
