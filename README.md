# Hellspawn

Hellspawn is a discrete-event simulation environment for warehouse operations where robot emulation is a first-class part of the simulated world.

## Feature Spec

1. Developer users log in, create worlds, assets, configs, and save them through the Gateway as Projects.
2. Normal users log in and select a Project.
3. The Gateway starts or attaches to a Simulation Worker for the selected simulation session.
4. The Simulation Worker loads the world snapshot and configuration, then executes scenario runs.
5. Users can create scenarios using specific entities and run them as independent serial, chained serial, or parallel batches.
6. Users can speed-run deterministic simulations, replay scenario runs, inspect traces, monitor multiple live views, and build dashboards from metrics.
7. Users may opt into video recording, but simulation replay is based on event logs and snapshots, not video.

## Architecture Decisions So Far

### Simulation Core

Hellspawn uses a discrete-event core. Simulation time, not wall-clock time, owns model execution. Events are ordered by simulation time, microstep, priority phase, and deterministic sequence number.

Models use an ECS shape:

- Entities represent world objects such as robots, stations, orders, shelves, and path segments.
- Components are data-only state.
- Systems are developer-authored logic activated by events.
- Systems produce staged change sets; the engine commits them deterministically.

Systems in one priority phase read the same pre-phase snapshot. Events sharing the same simulation time, microstep, and priority phase are processed as a phase batch. Same-time emitted events go to a later unprocessed phase when possible, otherwise to the next microstep. A configurable microstep limit protects runs from infinite same-time loops.

### Gateway, Worker, And Broker

The Gateway handles authentication, project routing, user command validation, and worker lifecycle. It does not own simulation time or mutate simulation state.

The Simulation Worker is a separate TypeScript package/process from day one. It owns:

- ECS world state
- authoritative event queue
- deterministic RNG
- system execution
- checkpoints
- replay
- run-local adapters

The Event Broker is not authoritative for simulation. It handles live stream fanout, reconnect, and client delivery. Broker failures may affect live monitoring, but not simulation correctness or replay truth.

### Commands And External Systems

User commands enter through the Gateway. The worker admits accepted commands at the next deterministic simulation boundary, timestamps them, and enqueues them.

External systems are connected through adapters outside the deterministic core. Gateway-managed adapters handle shared or auth-heavy integrations. Worker-side adapters handle run-specific or low-latency integrations. External results enter simulation through modeled latency events. The first supported latency mode is fixed latency.

Internal systems must use the engine-provided deterministic RNG. External nondeterminism is captured through interaction logs or modeled as input.

### Replay, Traces, And Batches

Replay uses a world snapshot/config version plus an authoritative replay log containing user inputs, external inputs, random seeds, and configuration choices. Replay is deterministic within the same engine, model, and configuration versions.

Internal emitted events, system transitions, reservations, metrics samples, and service calls are stored in a diagnostic event trace. The browser receives filtered live streams through view, entity, metric, and trace-channel subscriptions while the full trace is persisted server-side.

Scenario batches support:

- Independent serial runs from the same baseline
- Chained serial runs where each scenario starts from the previous final state
- Parallel runs in isolated run contexts or workers

Chained serial is the default when live external systems maintain state Hellspawn cannot reset. Scenario boundary checkpoints persist ECS component state, event queue, deterministic RNG state, run metadata, and external interaction cursors.

## Tech Stack

1. Frontend: TypeScript, React, TanStack Router, TanStack Query, TanStack Table, TanStack Form, TanStack Virtual, TanStack Pacer, TanStack Hotkeys, BabylonJS/ThreeJS, WebSockets.
2. Gateway: TypeScript, Bun/Fastify.
3. Simulation Worker: TypeScript first; C++ can be introduced later behind stable boundaries for profiled hot paths.
4. Event Broker: RabbitMQ with Web STOMP, or a custom WebSocket server, for live stream fanout and backpressure.
5. Database: TimescaleDB.
6. Cache: Redis.
7. Observability: ClickStack, Grafana, Prometheus.

## Things We Simulate

1. Warehouse operations with robot emulation.
2. Algorithms operating inside warehouse/robot workflows.
3. Real hardware robot behavior where hardware logic is emulated internally or controlled through external adapters.

## Things We Do Not Simulate

1. Computational Fluid Dynamics.
2. Physics-heavy motion as a first-class requirement.

## Scale Targets

1. Approximately 10,000 3D entities.
2. Approximately 5 external systems, potentially with 2-3 second modeled update delays.
3. Frontend should remain smooth at 60 FPS.
4. Robot movement is modeled through path segment reservations and waypoint events; rendering interpolates motion between authoritative simulation states.

## Project Docs

- Domain language: [CONTEXT.md](./CONTEXT.md)
- Architecture decisions: [docs/adr](./docs/adr)
