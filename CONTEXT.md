# Hellspawn

Hellspawn is a simulation environment for warehouse operations where robot emulation is a first-class part of the simulated world.

## Language

**Warehouse Operation**:
A real-world warehouse workflow being simulated, such as storage, picking, routing, replenishment, or fulfillment.
_Avoid_: Generic scenario, demo

**Robot**:
An emulated warehouse actor that moves, senses, receives commands, and changes warehouse state during a simulation.
_Avoid_: Bot, agent when referring to warehouse hardware

**Project**:
The container: members plus the **Worlds**, **Configs**, **Scenarios**, and **Scenario Runs** that belong together. Like a repo.
_Avoid_: Workspace, simulation

**World**:
The place: waypoint graph, **Path Segments**, stations, shelves, robot fleet and starting positions. Versioned; a **World Snapshot** is a frozen version. 3D assets attach here but only the renderer reads them.
_Avoid_: Scene, map file

**Config**:
The knobs: robot speeds, **Traffic Policy** choice, mock service latencies, **Warp Factor**, engine limits. Versioned separately from the **World** so one warehouse carries many tunings.
_Avoid_: Settings blob mixed into the world

**Scenario**:
The script: one **World** version + one **Config** version + an input schedule (order arrivals, faults, shift patterns) + an end condition.
_Avoid_: Test, session

**Scenario Run**:
One execution of a **Scenario** — the receipt: **Run Fingerprint**, run mode, logs, **Playback Recording**, checkpoints, metrics. Produced, never edited.
_Avoid_: Test, session

**Simulation Session**:
A loaded simulation runtime that can execute one or more **Scenario Runs** against a world and its connected services.
_Avoid_: Scenario when referring to the active runtime

**Scenario Batch**:
A group of **Scenario Runs** executed under one user request or experiment plan.
_Avoid_: Simulation when referring only to grouped runs

**Executor**:
The single user holding the command seat of a **Simulation Session**: sends **User Commands**, starts/stops scenarios, hands the seat over. Takeover needs their approval while present; a seat declared empty by the **Presence Timeout** is taken instantly. Every command and seat change is logged with the account that did it.
_Avoid_: Driver, admin

**Viewer**:
A user joined to a **Simulation Session** with live views and subscriptions but no command rights. May take the executor seat when it is empty.
_Avoid_: Observer

**Presence Timeout**:
The configured heartbeat silence after which the **Executor** is considered gone and the seat empty. Short (seconds) — a network blip never vacates the seat.
_Avoid_: Grace Period (that decides worker shutdown; this decides presence)

**Grace Period**:
The configured time a session may run with an empty executor seat (as declared by the **Presence Timeout**) before the worker checkpoints, marks the run interrupted, and stops. Disabled by **Daemon Mode**.
_Avoid_: Hard kill timeout

**Daemon Mode**:
A session setting, enabled by the **Executor**, that lets the worker keep running with no executor joined. Only project developers may take a daemon worker's seat and stop it.
_Avoid_: Orphaned worker

**Independent Serial Batch**:
A **Scenario Batch** where each **Scenario Run** starts from the same reset baseline.
_Avoid_: Chained run

**Chained Serial Batch**:
A **Scenario Batch** where each **Scenario Run** starts from the previous run's final state.
_Avoid_: Independent run

**Parallel Batch**:
A **Scenario Batch** where multiple **Scenario Runs** execute concurrently in isolated run contexts.
_Avoid_: Serial run

**Path Reservation**:
A claim by a **Robot** on a directed **Path Segment** for a bounded simulation-time interval.
_Avoid_: Lock when referring to warehouse movement

**Path Segment**:
A directed traversable connection between two waypoints in a warehouse layout.
_Avoid_: Grid cell, free-space coordinate

**Waypoint Arrival**:
The event that occurs when a **Robot** reaches a planned waypoint at a specific simulation time.
_Avoid_: Position update, movement frame

**Reservation Retry**:
The event scheduled when a **Robot** cannot claim its next **Path Segment** under the active traffic policy.
_Avoid_: Blocking wait, silent delay

**Traffic Policy**:
The rule set used to decide whether a **Robot** may reserve a **Path Segment** for a requested time interval.
_Avoid_: Scheduler when referring only to movement conflict rules

**Entity**:
A world object with identity that can hold simulation data.
_Avoid_: Object when the distinction from component data matters

**Component**:
Plain simulation data attached to an **Entity**.
_Avoid_: Behavior, service

**System**:
Developer-authored model logic that reacts to simulation events, reads and writes **Components**, and emits new simulation events. Always a plain synchronous function — no await, no network, no wall clock, no runtime random. There is only one kind of System; "external system" names a remote service, not a kind of System.
_Avoid_: Tick loop when referring to simulation truth; External system when referring to model code

**Local Scheduled Event**:
A recurring or delayed event scheduled for a specific **Entity** or **System**, rather than a global simulation tick.
_Avoid_: Global tick

**External Controller**:
A service outside the simulation worker that can issue commands into a **Scenario Run** with modeled communication delay.
_Avoid_: Robot controller when referring to an out-of-worker service

**Pure Simulation Mode**:
A run mode where the event queue drives the clock and every external service is replaced by a sync-internal mock **System**. Runs as fast as the CPU allows, deterministic, produces real warehouse KPIs.
_Avoid_: Live mode

**Live Simulation Mode**:
A run mode where the wall clock drives the sim clock at 1x and real external services participate. Their events are stamped with the current sim time on arrival and logged.
_Avoid_: Replay mode, Warp mode

**Live Warp Mode**:
**Live Simulation Mode** plus a config transform that shrinks internal durations (robot speed etc.) by a **Warp Factor**. Wall clock still drives. Speedup is capped by external think time; results are for logic verification, never performance KPIs.
_Avoid_: Faster clock (the clock is not faster; internal actions are shorter)

**Warp Factor**:
The config multiplier applied to internal durations in **Live Warp Mode**.
_Avoid_: Simulation speed (that is a playback/run concern)

**Movement Update Event**:
A derived telemetry event carrying a robot's interpolated position at a configured cadence, for consumers that need streams (external controllers in live modes, live views). Not model truth — truth is start-move and **Waypoint Arrival**.
_Avoid_: Waypoint Arrival, true position

**Recorded Controller Mode**:
A **Pure Simulation Mode** variant where mock services replay a previously captured **External Interaction Log**.
_Avoid_: Live mode

**Live Controller Mode**:
Older name for **Live Simulation Mode** / **Live Warp Mode** participation by an **External Controller**.
_Avoid_: Use the run-mode names instead

**Simulation Time**:
The deterministic clock used to order and execute events inside a **Scenario Run**.
_Avoid_: Wall-clock time when discussing model behavior

**Replay Log**:
The compact replay truth for a **Scenario Run**: initial version references, user inputs, recorded external inputs, random seeds, and configuration choices.
_Avoid_: Event Log (older duplicate name), Diagnostic trace, Video recording

**Diagnostic Event Trace**:
The rich inspection record of internal emitted events, system transitions, reservations, metrics samples, and service calls.
_Avoid_: Replay log when referring to derived/internal behavior

**Filtered Live Stream**:
The subscribed subset of run updates sent to clients during execution for selected views, entities, metrics, and trace channels.
_Avoid_: Full trace stream

**View Subscription**:
A live subscription for updates relevant to a spatial view, camera interest set, or monitored area.
_Avoid_: Whole-world stream

**Entity Subscription**:
A live subscription for updates about selected entities such as robots, stations, orders, or path segments.
_Avoid_: View subscription when the filter is identity-based

**Metric Subscription**:
A live subscription for selected time-series counters, gauges, and derived measures.
_Avoid_: Trace subscription when the data is numeric over time

**Trace Channel Subscription**:
A live subscription for selected internal or external diagnostic event categories.
_Avoid_: Metric subscription when the data is causal/event detail

**Run Update**:
A worker-produced update tagged with routing metadata for live subscriptions and trace persistence. The worker sends these over one stream to the gateway; the gateway owns browser connections.
_Avoid_: Raw socket message

**Conflation**:
Keeping only the newest value per entity when a live-view client is slower than the stream, instead of queueing every stale update. Done per client at the gateway, never in the worker.
_Avoid_: Message loss (dropping stale telemetry is correct behavior)

**Event Queue**:
The simulation worker's internal ordered queue that determines model execution for a **Scenario Run**.
_Avoid_: Broker queue

**User Command**:
A user-originated request to influence a **Scenario Run** after gateway validation.
_Avoid_: Simulation event before the worker timestamps it

**Event Ordering Key**:
The deterministic ordering tuple for simulation events: simulation time, microstep, priority phase, then sequence number.
_Avoid_: Insertion order alone

**Microstep**:
A deterministic counter used to order instantaneous event cascades at the same physical simulation time.
_Avoid_: Time delta, frame

**Same-Time Emission Rule**:
The rule that an emitted event at the current simulation time is scheduled into a later unprocessed phase if possible, otherwise into the next microstep.
_Avoid_: Rewriting an already processed phase

**Microstep Limit**:
A configurable maximum number of microsteps allowed at one simulation time before the run fails diagnostically.
_Avoid_: Silent time advance

**Priority Phase**:
A named event-ordering category used to resolve simultaneous simulation events before sequence number is applied; the engine defines canonical phases and model packages may define subphases.
_Avoid_: Priority when the phase semantics matter

**Pre-Phase Snapshot**:
The consistent ECS world view that all systems in the same priority phase read while producing staged change sets.
_Avoid_: Mid-phase reads

**Simulation Boundary**:
A point after the worker fully processes one event-ordering unit and before it begins the next.
_Avoid_: Mid-handler command injection

**Phase Batch**:
All events sharing the same simulation time, microstep, and priority phase, processed against one **Pre-Phase Snapshot**.
_Avoid_: Per-event phase commit

**Change Set**:
A staged collection of component writes, emitted events, and trace records produced by a **System** before engine commit.
_Avoid_: Direct world mutation

**Reducer**:
An explicit merge rule for combining multiple writes to the same component field during one commit boundary.
_Avoid_: Last-writer-wins

**Access Schema**:
The component read/write declaration a **System** provides when it is registered.
_Avoid_: Runtime-only introspection

**World Snapshot**:
The initial persisted world state and configuration version used to start or replay a **Scenario Run**.
_Avoid_: Save file when the versioned replay boundary matters

**Scenario Boundary Checkpoint**:
A persisted simulation state captured between **Scenario Runs** in a **Scenario Batch**.
_Avoid_: Hidden external state snapshot

**Periodic Checkpoint**:
The same checkpoint content captured on a configurable cadence inside a **Scenario Run**, for crash recovery (essential in **Live Simulation Mode**) and fast replay seek.
_Avoid_: Scenario Boundary Checkpoint (that is between runs; this is inside one)

**External Interaction Cursor**:
The recorded position in an external interaction log used to resume or replay integration behavior from a checkpoint.
_Avoid_: External system state

**Deterministic RNG**:
The engine-provided random source used by internal systems so random behavior can be replayed within a version boundary.
_Avoid_: Runtime random APIs

**External Nondeterminism**:
Behavior from external systems that Hellspawn cannot control and must capture, replay, or model as input.
_Avoid_: Engine RNG

**External Adapter**:
A boundary component that connects a **Scenario Run** to an external system and records replay-capable interactions.
_Avoid_: System when referring to out-of-worker integration

**Gateway-Managed Adapter**:
An **External Adapter** hosted near the gateway for shared, auth-heavy, or remote integrations.
_Avoid_: Worker-side adapter when the integration is not run-specific

**Worker-Side Adapter**:
An **External Adapter** hosted beside a simulation worker for run-specific or low-latency integrations.
_Avoid_: In-handler network call

**External Interaction Log**:
The replay-capable record of external requests, responses, timestamps, correlation IDs, and modeled latency.
_Avoid_: Hidden external state

**Latency Model**:
The rule that decides how long a mock service's answer takes in sim time. Applies to **Pure Simulation Mode**; the live modes stamp real arrival times instead.
_Avoid_: Raw wall-clock delay when discussing simulation scheduling

**Fixed Latency Model**:
A **Latency Model** that applies a configured constant simulation-time delay. First supported mode; measured delays bottled from live-run logs come later.
_Avoid_: Measured wall-clock latency

**Modeled Latency Event**:
An event scheduled by the worker in **Pure Simulation Mode** to represent a mock service's answer becoming available after a **Latency Model** delay.
_Avoid_: Immediate external response

**Replay Version Boundary**:
The engine version, model version, and configuration version within which a **Scenario Run** replay is expected to be deterministic.
_Avoid_: Forever-compatible replay

**Run Fingerprint**:
The version stamp stored in every run's log header — engine version, model package versions, config hash, seed. Replay refuses on fingerprint mismatch; re-running old inputs on new code is a comparison run, not a replay. Secrets are referenced by name in a **Config** and stored elsewhere, so values never enter the hash.
_Avoid_: Best-effort replay

**World Hash**:
A rolling hash the engine keeps over every committed change. Two runs match exactly when their world hashes match; a divergence bisects to the exact event where two histories split.
_Avoid_: Config hash (that is part of the **Run Fingerprint**)

**Golden Log**:
A stored **Replay Log** promoted to a CI regression test: replayed against current code, a **World Hash** mismatch flags an unintended model change.
_Avoid_: Any replay log (golden = promoted to a test)

**Video Recording**:
An optional user-requested visual capture of a **Scenario Run** that is never replay truth.
_Avoid_: Replay source

**Playback Recording**:
A saved stream of state changes from a **Scenario Run**, played like a movie for fast scrubbing in the browser. Not replay truth — it can be deleted and rebuilt any time by re-running the saved inputs.
_Avoid_: Replay source, Video Recording (that is pixels; this is state changes)

**Playback**:
Watching a finished run by streaming its **Playback Recording**. No simulation executes. The default way users view finished runs.
_Avoid_: Replay (that re-runs the engine)

**Replay**:
Re-running the engine from a run's saved inputs to regenerate state exactly. A tool for rebuilding movies, deep debugging with extra instrumentation, CI verification, and comparison runs — not the everyday viewing path.
_Avoid_: Playback (that only reads the movie)

## Relationships

- A **Scenario Run** executes one **Warehouse Operation**
- A **Simulation Session** can execute one or more **Scenario Runs**
- A **Scenario Batch** can be an **Independent Serial Batch**, **Chained Serial Batch**, or **Parallel Batch**
- A **Warehouse Operation** involves zero or more **Robots**
- A **Robot** participates in one or more **Scenario Runs**
- A **Robot** makes **Path Reservations** before moving through reserved **Path Segments**
- A **Waypoint Arrival** completes one step of a **Robot** movement plan
- A failed **Path Reservation** schedules a **Reservation Retry** with **Traffic Policy** metadata
- A **System** reacts to simulation events and updates **Components** on **Entities**
- A **System** may emit future events for the same **Scenario Run**
- A **System** may use **Local Scheduled Events** for periodic behavior without creating a global fixed-tick simulation
- A **System** produces a **Change Set** that the engine commits at a deterministic boundary
- A **System** declares an **Access Schema** when registered
- Internal **Systems** use **Deterministic RNG** for random behavior
- Multiple writes to the same component field require an explicit **Reducer**
- Systems in the same **Priority Phase** read the same **Pre-Phase Snapshot**
- A **Phase Batch** is the normal execution unit for same-time, same-microstep, same-phase events
- The **Same-Time Emission Rule** prevents newly emitted events from being inserted into already processed phases
- A **Microstep Limit** protects a **Scenario Run** from infinite same-time event loops
- An **External Controller** influences a **Scenario Run** by injecting timestamped events into **Simulation Time**
- An **External Adapter** records an **External Interaction Log** for replay-capable integrations
- External networking runs through **Gateway-Managed Adapters** or **Worker-Side Adapters**, not inside deterministic system handlers
- In **Pure Simulation Mode**, mock answers enter the **Event Queue** as **Modeled Latency Events**; in the live modes, external events are stamped with sim time on arrival
- The first supported **Latency Model** for mock services is the **Fixed Latency Model**
- A **Scenario Run** executes in **Pure Simulation Mode**, **Live Simulation Mode**, or **Live Warp Mode**
- **Pure Simulation Mode** runs as fast as the CPU allows because every service is an internal mock
- **Live Simulation Mode** and **Live Warp Mode** are wall-clock driven; their speed is capped by real external services
- A **Project** contains **Worlds**, **Configs**, **Scenarios**, and their **Scenario Runs**
- A **Scenario** references one **World** version and one **Config** version
- A **Simulation Session** has at most one **Executor** and any number of **Viewers**
- The **Presence Timeout** declares the executor seat empty; then the **Grace Period** runs unless **Daemon Mode** is on
- Any **Viewer** may take an empty executor seat; in **Daemon Mode**, only project developers may
- A **Scenario Run** produces a **Playback Recording**; **Playback** streams it without executing any simulation
- A replay uses a **World Snapshot** plus a **Replay Log** as its source of truth
- A replay is deterministic within its **Replay Version Boundary**
- A **Diagnostic Event Trace** records internal causality for inspection and debugging
- A **Filtered Live Stream** sends only subscribed live updates to clients while the full **Diagnostic Event Trace** is persisted
- A **Filtered Live Stream** is composed from **View Subscriptions**, **Entity Subscriptions**, **Metric Subscriptions**, and **Trace Channel Subscriptions**
- A simulation worker produces **Run Updates** over one stream; the gateway handles routing and fanout
- The **Event Queue** lives inside the simulation worker, not the gateway
- A **User Command** is validated by the gateway, then timestamped and enqueued by the simulation worker
- A **User Command** is admitted at the next deterministic **Simulation Boundary**
- A **Video Recording** may be attached to a **Scenario Run**, but does not define simulation truth
- Events in a **Scenario Run** are ordered by the **Event Ordering Key**
- **Chained Serial Batch** is the default when connected external systems cannot be reliably reset
- A **Chained Serial Batch** persists **Scenario Boundary Checkpoints** between runs
- A **Scenario Boundary Checkpoint** contains ECS component state, event queue, deterministic RNG state, run metadata, and **External Interaction Cursors**
- **External Nondeterminism** is captured through external interaction logs or modeled inputs, not controlled by **Deterministic RNG**
- Replay truth = saved inputs (user commands, recorded external responses, seeds) re-run by the engine; a **Playback Recording** is a derived movie for scrubbing, never truth
- Exact replay serves external responses from the **External Interaction Log**; what-if runs need a mocked external service or a fresh live session

## Example Dialogue

> **Dev:** "When a **Scenario Run** starts, should robots be optional?"
> **Domain expert:** "For Hellspawn's primary use case, **Robots** are normal participants in **Warehouse Operations**, not a separate simulation mode."
>
> **Dev:** "Do we update every robot position every render frame?"
> **Domain expert:** "No — robot movement is modeled by **Path Reservations** and **Waypoint Arrivals**; rendering can interpolate between true simulation events."
>
> **Dev:** "What happens if a robot cannot reserve the next segment?"
> **Domain expert:** "It schedules a **Reservation Retry** that records the relevant **Traffic Policy** metadata."
>
> **Dev:** "Are models written as object methods or ECS systems?"
> **Domain expert:** "Hellspawn model logic is written as event-activated **Systems** that operate on **Entities** and **Components**."
>
> **Dev:** "How do robot controllers run at 10-16 ms intervals without a global tick?"
> **Domain expert:** "They schedule **Local Scheduled Events** only for robots or systems that need that cadence."
>
> **Dev:** "If a real controller is connected, does wall-clock time drive the simulation?"
> **Domain expert:** "Yes — that is **Live Simulation Mode**: the wall clock drives the sim clock 1:1 and external events are stamped on arrival. Model code still reads only **Simulation Time**, so the run stays replayable."
>
> **Dev:** "Can we run at full speed while a live external controller is connected?"
> **Domain expert:** "No — full speed is **Pure Simulation Mode**, where services are mocks. With live services, **Live Warp Mode** shrinks internal durations, but real think time still caps it."
>
> **Dev:** "Is replay based on saved frames?"
> **Domain expert:** "No — replay uses the **World Snapshot** and **Replay Log**; **Video Recording** is optional and never truth."
>
> **Dev:** "Does a user watching a finished run re-execute the simulation?"
> **Domain expert:** "No — that is **Playback** of the **Playback Recording**. **Replay** re-runs the engine and is a tool for debugging, CI, and rebuilding movies."
>
> **Dev:** "Do internal events define replay truth?"
> **Domain expert:** "No — the **Replay Log** defines replay; the **Diagnostic Event Trace** explains causality."
>
> **Dev:** "Should every diagnostic event be pushed live to the browser?"
> **Domain expert:** "No — clients receive a **Filtered Live Stream**, while the full **Diagnostic Event Trace** is persisted for query."
>
> **Dev:** "How does a client choose what to receive live?"
> **Domain expert:** "It creates view, entity, metric, and trace-channel subscriptions."
>
> **Dev:** "Does the simulation worker manage every browser subscription?"
> **Domain expert:** "No — the worker emits tagged **Run Updates** over one stream, and the gateway handles routing, fanout, and per-client **Conflation**."
>
> **Dev:** "Is the delivery path part of simulation truth?"
> **Domain expert:** "No — the worker's **Event Queue** owns model execution; delivery can lag or drop stale updates without changing results, logs, or replay."
>
> **Dev:** "Who turns a user command into a simulation event?"
> **Domain expert:** "The gateway validates it, then the worker timestamps and enqueues it."
>
> **Dev:** "Can a command modify state while a system is halfway through handling an event?"
> **Domain expert:** "No — commands are admitted at a **Simulation Boundary** and ordered with simulation time, **Microstep**, priority phase, and sequence."
>
> **Dev:** "Do systems mutate ECS state directly?"
> **Domain expert:** "No — systems produce **Change Sets**, and the engine commits them deterministically."
>
> **Dev:** "How are concurrent writes to the same component handled?"
> **Domain expert:** "They require an explicit **Reducer**; otherwise the engine treats the overlap as a conflict."
>
> **Dev:** "Does the engine know what components a system might touch?"
> **Domain expert:** "Yes — systems declare an **Access Schema** at registration, and actual writes are still validated through **Change Sets**."
>
> **Dev:** "Can one system read another system's write in the same phase?"
> **Domain expert:** "No — systems in one **Priority Phase** read the same **Pre-Phase Snapshot**; dependent logic belongs in a later phase or subphase."
>
> **Dev:** "Does the engine process same-phase events one at a time?"
> **Domain expert:** "No — it processes a **Phase Batch** against one snapshot, then commits the merged change set."
>
> **Dev:** "Where does a same-time event emitted by a system go?"
> **Domain expert:** "It follows the **Same-Time Emission Rule**: later unprocessed phase if possible, otherwise next microstep."
>
> **Dev:** "What if systems keep emitting same-time events forever?"
> **Domain expert:** "The run fails diagnostically when it exceeds the configured **Microstep Limit**."
>
> **Dev:** "Will a run replay identically after model code changes?"
> **Domain expert:** "Only within the same **Replay Version Boundary**; changed model logic creates a comparison run or requires the old version."
>
> **Dev:** "What if two systems emit events at the same simulation time?"
> **Domain expert:** "They are ordered by **Event Ordering Key**: timestamp, **Priority Phase**, then deterministic sequence number."
>
> **Dev:** "Who defines priority phases?"
> **Domain expert:** "The engine defines canonical phases, and model packages define subphases inside those semantics."
>
> **Dev:** "When running several scenarios, do we reset state between them?"
> **Domain expert:** "Hellspawn supports independent serial, chained serial, and parallel batches; chained serial is the default when external systems keep their own state."
>
> **Dev:** "Can we inspect or replay from a boundary inside a chained batch?"
> **Domain expert:** "Yes — Hellspawn persists **Scenario Boundary Checkpoints** between scenario runs."
>
> **Dev:** "What goes into a checkpoint?"
> **Domain expert:** "Component state, event queue, RNG state, run metadata, and **External Interaction Cursors**; not UI state or hidden external state."
>
> **Dev:** "Can internal systems call normal random APIs?"
> **Domain expert:** "No — they use **Deterministic RNG**; external randomness is treated as **External Nondeterminism** and captured or modeled."
>
> **Dev:** "How do live external systems become replayable?"
> **Domain expert:** "Replay-capable **External Adapters** record request/response **External Interaction Logs** with timing and correlation IDs."
>
> **Dev:** "Can a system handler block on a real external API call?"
> **Domain expert:** "No — external networking belongs in **Gateway-Managed Adapters** or **Worker-Side Adapters** outside the deterministic core."
>
> **Dev:** "Does wall-clock response time decide simulation time?"
> **Domain expert:** "In **Pure Simulation Mode**, no — mock answers arrive after their **Latency Model** delay. In the live modes, yes — real arrival is stamped and recorded, which is what makes those runs replayable and the mocks calibratable."
>
> **Dev:** "Which latency mode exists first?"
> **Domain expert:** "A **Fixed Latency Model** for mock services; measured delays bottled from live-run logs come later."

## Flagged Ambiguities

- "robot emulation" is part of the default warehouse simulation scope, not an optional external category.
- "movement" means reservation-based waypoint progression over **Path Segments** in simulation time, not per-frame physics.
- "tick" should mean a **Local Scheduled Event** unless a global simulation tick is explicitly being discussed.
- "external controller" means an out-of-worker service that issues commands into a run; it is never the simulation clock owner, even in wall-clock-driven live modes.
- "speed-run" is not a mode name: full speed = **Pure Simulation Mode** (mocked services); **Live Warp Mode** only shrinks internal durations and stays capped by external think time.
- "replay" and "playback" are different things: **Playback** streams the saved movie for viewing; **Replay** re-runs the engine as an engineering tool.
- "serial batch" must specify whether it is **Independent Serial Batch** or **Chained Serial Batch** because the replay and external-state assumptions differ.
