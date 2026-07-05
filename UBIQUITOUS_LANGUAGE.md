# Ubiquitous Language

> Condensed view of [CONTEXT.md](./CONTEXT.md), which remains the detailed source of truth. Regenerate this file when CONTEXT.md changes.

## Authoring nouns

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Project** | The container: members plus the Worlds, Configs, Scenarios, and Runs that belong together | Workspace, simulation |
| **World** | The place: waypoint graph, path segments, stations, shelves, robot fleet and starting positions; versioned | Scene, map file |
| **Config** | The knobs: robot speeds, traffic policy, mock latencies, warp factor; versioned separately from the World | Settings blob |
| **Scenario** | The script: one World version + one Config version + an input schedule + an end condition | Test, session |
| **Scenario Run** | The receipt of executing one Scenario: fingerprint, mode, logs, recording, checkpoints, metrics | Test, session |
| **Scenario Batch** | A group of Scenario Runs under one experiment plan: independent serial, chained serial, or parallel | Simulation |
| **Simulation Session** | A loaded runtime that executes Scenario Runs and hosts joined users | Scenario |

## Run modes and clocks

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Pure Simulation Mode** | The event queue drives the clock; every external service is a sync-internal mock; max speed, deterministic, real KPIs | Speed-run, live mode |
| **Live Simulation Mode** | The wall clock drives the sim clock 1:1; real external services participate; events stamped on arrival | Replay mode, realtime mode |
| **Live Warp Mode** | Live mode plus internal durations shrunk by the Warp Factor; for logic verification, never performance KPIs | Faster clock |
| **Warp Factor** | The config multiplier applied to internal durations in Live Warp Mode | Simulation speed |
| **Simulation Time** | The clock that orders and executes events inside a run; the only clock model code may read | Wall-clock time |

## Truth, replay, and recovery

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Replay Log** | The compact replay truth: version references, user inputs, recorded external inputs, seeds, config choices | Event Log, diagnostic trace |
| **Replay** | Re-running the engine from saved inputs; an engineering tool for debugging, CI, movie rebuilds, comparisons | Playback |
| **Playback** | Watching a finished run by streaming its Playback Recording; no simulation executes | Replay |
| **Playback Recording** | A saved stream of state changes scrubbed like a movie; deletable and rebuildable, never truth | Replay source |
| **Video Recording** | Optional pixel capture of a run; never truth | Replay source |
| **Diagnostic Event Trace** | The rich inspection record of internal events, transitions, reservations, samples; explains "why", never replay truth | Replay log |
| **Run Fingerprint** | The version stamp in every run's log header (engine, model versions, config hash, seed); replay refuses on mismatch | Best-effort replay |
| **World Hash** | A rolling hash over every committed change; divergence bisects to the exact splitting event | Config hash |
| **Golden Log** | A stored Replay Log promoted to a CI regression test | — |
| **World Snapshot** | The frozen starting world state and config version a run begins from | Save file |
| **Periodic Checkpoint** | Checkpoint content captured on a cadence inside a run, for crash recovery and replay seek | — |
| **Scenario Boundary Checkpoint** | The same content captured between runs of a batch | Hidden external state |

## People and sessions

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Executor** | The single user holding a session's command seat; all commands and seat changes logged to their account | Driver, admin |
| **Viewer** | A joined user with live views and no command rights; may take an empty seat | Observer |
| **Presence Timeout** | The heartbeat silence after which the executor counts as gone and the seat empty | Grace Period |
| **Grace Period** | The time a session may run seatless before checkpoint + graceful stop | Hard kill timeout |
| **Daemon Mode** | Session setting to run unattended; only project developers may stop it | Orphaned worker |
| **User Command** | A user request to influence a run, validated by the gateway, stamped and enqueued by the worker | Simulation event |

## The outside world

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **External Controller** | An out-of-worker service that issues commands into a run; never the clock owner | Robot controller |
| **External Adapter** | The boundary component that talks to an external system and records every interaction | System |
| **External Interaction Log** | The recorded requests, responses, timestamps, and correlation IDs of an adapter's conversations | Hidden external state |
| **Latency Model** | The rule deciding how long a mock service's answer takes in sim time (Pure mode only) | Wall-clock delay |
| **Modeled Latency Event** | The Pure-mode event representing a mock answer arriving after its Latency Model delay | Immediate response |
| **External Nondeterminism** | Behavior Hellspawn cannot control and must capture or model, never pretend to own | Engine RNG |

## Engine core

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Entity** | A world object with identity that holds simulation data | Object |
| **Component** | Plain data attached to an Entity | Behavior, service |
| **System** | A plain synchronous function that wakes on events, stages changes, emits events; the only kind there is | External system, tick loop |
| **Event Queue** | The worker-internal ordered queue that decides model execution | Broker queue |
| **Event Ordering Key** | The tuple ordering events: sim time, microstep, priority phase, sequence number | Insertion order |
| **Change Set** | The staged writes, events, and trace records a System produces for the engine to commit | Direct mutation |
| **Reducer** | The declared merge rule required when two writers hit one field in one commit | Last-writer-wins |
| **Pre-Phase Snapshot** | The frozen world view all same-phase systems read | Mid-phase reads |
| **Microstep Limit** | The cap that turns infinite same-time cascades into loud diagnostic failures | Silent time advance |
| **Deterministic RNG** | The engine's seeded random source, part of checkpoints and the fingerprint | `Math.random` |

## Live delivery

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Run Update** | A worker-produced, routing-tagged update sent over one stream to the gateway | Raw socket message |
| **Filtered Live Stream** | The subscribed subset of updates a client receives (view, entity, metric, trace-channel subscriptions) | Full trace stream |
| **Conflation** | Keeping only the newest value per entity for a slow client, at the gateway | Message loss |
| **Movement Update Event** | Derived position telemetry at a configured cadence; truth stays with waypoint events | Waypoint Arrival |

## Relationships

- A **Project** contains **Worlds**, **Configs**, **Scenarios**, and their **Scenario Runs**
- A **Scenario** references one **World** version and one **Config** version; a **Scenario Run** executes it in exactly one run mode
- A **Simulation Session** has at most one **Executor** and any number of **Viewers**; the **Presence Timeout** empties the seat, then the **Grace Period** runs unless **Daemon Mode** is on
- A **Scenario Run** produces a **Playback Recording** (for **Playback**) and a **Replay Log** (for **Replay**); only the second is truth
- In **Pure Simulation Mode** mock answers arrive as **Modeled Latency Events**; in the live modes external events are stamped with **Simulation Time** on arrival
- A **System** produces a **Change Set**; two writes to one field require a **Reducer** or the run fails loudly
- Secrets are referenced by name in a **Config** and stored elsewhere — never in versions, fingerprints, or logs

## Example dialogue

> **Dev:** "A user wants to watch yesterday's run. Do I spin up a worker and **Replay** it?"
> **Domain expert:** "No — that's **Playback**: stream the **Playback Recording**. **Replay** re-runs the engine, and you only need it to rebuild a deleted movie, debug with extra trace channels, or run CI checks."
>
> **Dev:** "The customer wants the overnight test against the real fleet controller to run 50× faster."
> **Domain expert:** "It can't — that's **Live Warp Mode**: we can shrink robot travel with the **Warp Factor**, but the controller's real think time still caps the run. Full speed needs **Pure Simulation Mode** with a mocked controller, calibrated from the **External Interaction Logs** of past live runs."
>
> **Dev:** "The executor's laptop just lost Wi-Fi mid-run. Did a viewer steal the seat?"
> **Domain expert:** "Not immediately — the seat stays occupied until the **Presence Timeout** passes. Only then is it empty, takeable, and the **Grace Period** starts ticking. Every seat change lands in the audit log either way."
>
> **Dev:** "Why did my replay of last month's run get refused?"
> **Domain expert:** "Its **Run Fingerprint** doesn't match current code. Re-running old inputs on new code is a comparison run, not a **Replay** — the engine refuses to call a maybe-diverging run a replay."

## Flagged ambiguities

- "speed-run" is not a mode name: full speed = **Pure Simulation Mode**; **Live Warp Mode** only shrinks internal durations. Say the mode name.
- "replay" was used for viewing finished runs — that is **Playback**. **Replay** always means re-executing the engine.
- "external system" was used for a kind of System — there is only one kind of **System** (synchronous, internal); the remote service is reached via an **External Adapter**.
- "Event Log" is a retired duplicate of **Replay Log** — never use it.
- "tick" means a **Local Scheduled Event** unless a global fixed tick is explicitly meant (there is none in the engine).
- "authoritative" (Codex-era jargon) is banned — say "truth" or name the owning artifact.
