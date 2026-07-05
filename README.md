# Hellspawn

Hellspawn is a discrete-event simulation environment for warehouse operations where robot emulation is a first-class part of the simulated world.

## What users do

1. Developers log in and author, inside **Projects**: **Worlds** (the place: waypoint graph, stations, shelves, robots), **Configs** (the knobs: speeds, policies, latencies), and **Scenarios** (the script: world + config + input schedule + end condition).
2. Users open a project, see its running simulations, and either join one — as **Viewer** (watch) or by taking the **Executor** seat (command) — or start a new simulation as its executor.
3. A run executes in one of three modes:
   - **Pure Simulation Mode** — every external service is a mocked internal system; runs as fast as the CPU allows; deterministic; produces real warehouse KPIs.
   - **Live Simulation Mode** — real external services (WMS, fleet controllers) participate; wall clock drives the sim clock 1:1; everything is recorded.
   - **Live Warp Mode** — live mode with internal durations shrunk by a warp factor; for fast logic verification of real external software, never for performance numbers.
4. Scenarios run as batches: independent serial (same baseline each time), chained serial (each run continues from the last), or parallel (isolated workers).
5. Finished runs are watched via **Playback** — scrubbing a saved movie of state changes. No simulation re-executes for viewing.
6. **Replay** — deterministically re-running a run from its saved inputs — is an engineering tool: rebuild deleted movies, root-cause debugging with extra tracing, CI verification, and comparison runs (old inputs, new algorithm).
7. Users build dashboards from run metrics inside the app. Optional video capture exists but is never a source of truth.

## How it works

### The core

The sim clock jumps from event to event; nothing ticks. Warehouse life is modeled as meaningful moments — task assigned, path segment reserved, waypoint reached, answer arrived — scheduled as timestamped events. Idle time costs nothing.

World objects are entities carrying plain-data components. All behavior lives in **Systems**: plain synchronous functions that wake on events, stage changes, and emit new events. No await, no network, no wall clock, no `Math.random` inside the core — determinism is enforced by runtime guards, a rolling world hash, and CI that runs everything twice and replays golden logs.

Same-moment events are ordered by sim time, then microstep, then phase, then sequence number. Systems in one phase read the same frozen snapshot and stage change sets the engine commits at the phase boundary; two writes to the same field need a declared merge rule or the run fails loudly. A microstep cap turns infinite same-time loops into diagnostic failures.

### The outside world

External services are reached only through adapters outside the core. Requests go out as events; answers come back as events with sim-time stamps — from config-modeled delay in Pure mode, from the wall clock in Live modes. Every request and response is recorded with correlation IDs, so live behavior can be bottled into mocks and replays never touch a real service.

### Truth and recovery

Replay truth is the run's saved inputs (user commands, recorded external answers, seeds) plus its starting world snapshot — kilobytes, not gigabytes. Every run stores a fingerprint (engine version, model versions, config hash, seed); replay refuses on mismatch rather than lying. Secrets are referenced by name in a Config and stored elsewhere, so credentials never enter versions, fingerprints, or logs (ADR-0036). Checkpoints are written between scenario runs and periodically inside them, so a crashed live run resumes with an honest gap and replay can seek instead of starting from zero.

### People and delivery

A session has one executor seat and unlimited viewers, with a presence list and per-user custom views. A heartbeat timeout declares the seat empty — a network blip never vacates it — and only then does a grace timer run (checkpoint + graceful stop on expiry), unless daemon mode keeps the worker running unattended; only project developers may stop a daemon worker. Seat changes and every command are audit-logged with the issuing account. The worker sends one stream of tagged updates to the gateway; the gateway owns all browser WebSockets — auth, subscriptions, per-client conflation, reconnect resync. No message broker sits in the live-view path.

## Tech stack

1. Frontend: TypeScript, React, TanStack Router, TanStack Query, TanStack Table, TanStack Form, TanStack Virtual, TanStack Pacer, TanStack Hotkeys, BabylonJS, WebSockets.
2. Gateway: TypeScript, Bun/Fastify. Owns all browser WebSockets: auth, subscriptions, per-client conflation, snapshot+delta resync (ADR-0027). No message broker in the live-view path.
3. Simulation Worker: TypeScript first; replay logs double as golden tests for any future C++ port of profiled hot paths (ADR-0023).
4. Database: Postgres for control-plane data (projects, users, scenarios, run metadata); ClickHouse for diagnostic traces and sim metrics; files on disk (object storage later) for snapshots, checkpoints, replay logs, and playback recordings (ADR-0028).
5. Observability: ClickStack (OpenTelemetry + ClickHouse + HyperDX) for logs, metrics, traces, ops dashboards, and alerts. User-facing dashboards are a frontend product feature, not an ops tool.

## Repo layout

```text
apps/hellspawn              frontend
services/gateway            auth, projects, sessions, fanout
services/simulation-worker  engine, systems, adapters
packages/*                  shared modules (packages/protocol first)
```

The `backend/` and `frontend/` folders are discarded prototype code (ADR-0034).

## What we simulate

1. Warehouse operations with robot emulation.
2. Algorithms operating inside warehouse/robot workflows.
3. Real hardware robot behavior, emulated internally or driven by external controllers.

Not: computational fluid dynamics, physics-heavy motion. Robot movement is reservation-based waypoint progression; rendering interpolates between simulation states.

## Scale targets

1. ~10,000 3D entities, ~100–200 active per moment.
2. ~5 external systems.
3. Frontend smooth at 60 FPS; rendering interpolates, the model never ticks per frame.

## Project docs

- Domain language: [CONTEXT.md](./CONTEXT.md)
- Architecture decisions: [docs/adr](./docs/adr)
