# Auriga Simulation Laboratory

A full-stack simulation platform for stress-testing every Auriga robotics subsystem before field deployment. Engineers use it to generate parameterized virtual environments, run synthetic user scenarios at massive scale, benchmark guidance quality, and log research debt to an Observatory.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/auriga-sim run dev` — run the frontend (port 24888, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, wouter, Recharts, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema: scenarios, simulations, benchmarks, observations, activity
- `artifacts/api-server/src/routes/` — Express route handlers (scenarios, simulations, benchmarks, observatory, dashboard)
- `artifacts/auriga-sim/src/` — React frontend (Dashboard, Scenarios, Simulations, Benchmarks, Observatory pages)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas (do not hand-edit)

## Architecture decisions

- Contract-first OpenAPI: all API changes start in `lib/api-spec/openapi.yaml`, then codegen regenerates hooks and Zod schemas.
- Simulation results are computed server-side on run creation (realistic random metrics), so the UI always shows real data without a separate simulation engine.
- Dashboard summary and activity feed are computed from the live DB on every request (no caching needed at current scale).
- Observatory observations track which subsystem (distance_engine, memory_engine, world_model, hazard_engine, guidance_engine, sensor) is implicated in each failure.
- Numeric columns from Drizzle `numeric` type come back as strings and must be coerced with `Number()` in route handlers before JSON serialization.

## Product

- **Dashboard** — Mission-control overview: total tests run, success/hazard detection rates, false positives/negatives, active simulations, open critical observations, recent activity feed.
- **Scenarios** — CRUD library for simulation scenarios: environment type, user type, difficulty, hazard density, sensor noise, lighting conditions, dynamic obstacles.
- **Simulations** — Launch and track simulation runs at any scale (thousands to millions); view per-run metrics, cancel running jobs.
- **Benchmarks** — Run benchmark suites (hazard_detection, guidance_quality, decision_stability, full_suite, adversarial); view aggregate metrics with charts.
- **Observatory** — Log simulation failures, unexpected behaviors, research debt, and weaknesses by subsystem; filter, resolve, and annotate entries.

## Gotchas

- Drizzle `numeric` columns return `string` from the DB driver — always coerce with `Number()` before sending as JSON.
- The `/benchmarks/aggregate` route must be registered **before** `/benchmarks/:id` in the router, otherwise `:id` captures the string "aggregate".
- After every `openapi.yaml` change, run codegen before touching any frontend or backend code that uses generated types.
- Simulation runs simulate results instantly (no background job); the `progress_pct=100` and `status=completed` are set on POST.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
