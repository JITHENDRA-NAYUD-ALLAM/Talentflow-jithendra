# TalentFlow – A Mini Hiring Platform (No Backend)

TalentFlow is a React-based, frontend-only hiring platform for HR teams to manage jobs, candidates, and job-specific assessments. It simulates a real backend using MSW while persisting all data locally via IndexedDB (Dexie). The UI is responsive and ships with a distinctive dark-first theme.

## Table of Contents

- [Core Flows](#core-flows)
- [Simulated API](#simulated-api)
- [Seed Data](#seed-data)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Architecture](#architecture)
- [Technical Decisions](#technical-decisions)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Deliverables](#deliverables)

## Core Flows

### 1) Jobs Board
- List with server-like pagination and filtering (title, status, tags).
- Create/Edit a job in a modal or dedicated route. Validation: title required, unique slug.
- Archive/Unarchive jobs.
- Reorder via drag-and-drop with optimistic UI and rollback on simulated failure.
- Deep-link to a job: `/jobs/:jobId`.

### 2) Candidates
- Virtualized list (1000+ seeded candidates) with client-side search (name/email) and server-like stage filter.
- Candidate profile route `/candidates/:id` showing a timeline of status changes.
- Move candidates between stages on a Kanban board (drag-and-drop).
- Attach notes with `@mentions` (rendered, suggestions from a local list only).

### 3) Assessments
- Assessment builder per job: add sections and questions:
  - single-choice, multi-choice, short text, long text, numeric (with range), file upload stub
- Live preview pane renders the assessment as a fillable form.
- Persist builder state and candidate responses locally (IndexedDB write-through).
- Form runtime with validation: required, numeric range, max length.
- Conditional questions (e.g., show Q3 only if Q1 === "Yes").

## Simulated API

All network calls are handled by MSW to mimic a REST API. Write endpoints inject artificial latency and errors; successful writes are persisted locally via Dexie.

Jobs
- `GET /jobs?search=&status=&page=&pageSize=&sort=`
- `POST /jobs` → `{ id, title, slug, status: "active"|"archived", tags: string[], order: number }`
- `PATCH /jobs/:id`
- `PATCH /jobs/:id/reorder` → `{ fromOrder, toOrder }` (5–10% simulated 500s to test rollback)

Candidates
- `GET /candidates?search=&stage=&page=`
- `POST /candidates` → `{ id, name, email, stage: "applied"|"screen"|"tech"|"offer"|"hired"|"rejected" }`
- `PATCH /candidates/:id` (stage transitions)
- `GET /candidates/:id/timeline`

Assessments
- `GET /assessments/:jobId`
- `PUT /assessments/:jobId`
- `POST /assessments/:jobId/submit` (store response locally)

## Seed Data

- 25 jobs (mixed active/archived)
- 1,000 candidates randomly assigned to jobs and stages
- ≥3 assessments with 10+ questions each
- Latency: 200–1200ms for all endpoints; error rate: 5–10% on writes
- Full write-through to IndexedDB (state is restored on refresh)

## Tech Stack

- React 19 + TypeScript, Vite 7
- React Router 7
- Tailwind CSS 4 (OKLCH colors, class-based dark mode)
- shadcn/ui components + Radix primitives, Lucide icons
- Recharts for analytics
- MSW for API simulation
- Dexie for IndexedDB persistence

## Project Structure

```
/ENTNT
├── public/
│   ├── logo.svg
│   └── mockServiceWorker.js
├── src/
│   ├── components/
│   │   ├── assessments/
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── msw.ts
│   │   └── seed-data.ts
│   ├── pages/
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

## Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run
1) Clone and install
```bash
git clone <your-repo-url>
cd ENTNT
npm install
```

2) Initialize MSW (generates the worker in `public/`)
```bash
npx msw init public/ --save
```

3) Start the dev server
```bash
npm run dev
# open http://localhost:5173
```

4) Build & preview
```bash
npm run build
npm run preview
```

### Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint

## Architecture

### Frontend
- React components organized by feature (`jobs`, `candidates`, `assessments`) plus shared `ui` primitives.
- React Router manages routes: `/`, `/jobs`, `/jobs/:jobId`, `/candidates`, `/candidates/:id`, `/assessments`, `/assessments/:jobId/...`.
- Tailwind CSS with OKLCH variables; dark theme enabled by default via root `html.dark`.
- shadcn/ui + Radix for accessible, composable building blocks.

### Data & Persistence
- MSW intercepts fetch calls to provide REST-like endpoints with latency/error simulation.
- Dexie (IndexedDB) stores jobs, candidates, assessments, timelines, and assessment responses. All writes are applied locally; reads hydrate from IndexedDB on app load.
- Optimistic UI: reorder, create, and update flows update the UI immediately; failures trigger rollback based on MSW-simulated 500s.

### Notable Implementation Details
- Jobs: slug uniqueness enforced client-side; drag-and-drop via `@hello-pangea/dnd` with rollback.
- Candidates: virtualized views for large lists; Kanban for stage transitions; timeline snapshots on every transition.
- Assessments: schema-driven builder and runtime; conditional visibility handled in the preview and submit flows.

## Technical Decisions

- Vite for fast HMR and minimal config.
- Tailwind v4 with OKLCH for consistent theming and a distinct dark-first look.
- shadcn/ui for accessible primitives without heavy theming lock-in.
- MSW to simulate network behavior deterministically in development.
- Dexie for robust IndexedDB ergonomics and versioned schema upgrades.
- Recharts for simple, theme-aware analytics visualizations.

## Known Issues

- If MSW is not initialized, network calls will fail. Run `npx msw init public/ --save` after `npm install`.
- When testing drag-and-drop reorders, simulated 500 errors (5–10%) will intentionally revert the optimistic change.

## Future Improvements

- Export/import local data snapshots to JSON.
- Advanced analytics (funnel conversion, stage duration distributions).
- Role-based views and audit logs (still local-only).
- Offline-first sync strategy abstraction to swap MSW with a real API later.

## Deliverables

- Deployed App: <your-deployment-url>
- GitHub Repository: https://github.com/JITHENDRA-NAYUD-ALLAM/Talentflow-jithendra

## License

MIT
