# Hellspawn

Hellspawn is a simulation environment for warehouse operations where robot emulation is a first-class part of the simulated world.

## Language

**Warehouse Operation**:
A real-world warehouse workflow being simulated, such as storage, picking, routing, replenishment, or fulfillment.
_Avoid_: Generic scenario, demo

**Robot**:
An emulated warehouse actor that moves, senses, receives commands, and changes warehouse state during a simulation.
_Avoid_: Bot, agent when referring to warehouse hardware

**Scenario Run**:
One execution of a configured warehouse operation under a specific set of initial conditions and inputs.
_Avoid_: Test, session

**Simulation Session**:
A loaded simulation runtime that can execute one or more **Scenario Runs** against a world and its connected services.
_Avoid_: Scenario when referring to the active runtime

**Scenario Batch**:
A group of **Scenario Runs** executed under one user request or experiment plan.
_Avoid_: Simulation when referring only to grouped runs

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
Developer-authored model logic that reacts to simulation events, reads and writes **Components**, and emits new simulation events.
_Avoid_: Tick loop when referring to authoritative simulation behavior

**Local Scheduled Event**:
A recurring or delayed event scheduled for a specific **Entity** or **System**, rather than a global simulation tick.
_Avoid_: Global tick

**External Controller**:
A service outside the simulation worker that can issue commands into a **Scenario Run** with modeled communication delay.
_Avoid_: Robot controller when referring to an out-of-worker service

**Recorded Controller Mode**:
A run mode that replays previously captured external-controller inputs as deterministic simulation events.
_Avoid_: Live mode

**Live Controller Mode**:
A run mode where an **External Controller** participates during execution and can constrain simulation pacing.
_Avoid_: Replay mode

**Simulation Time**:
The deterministic clock used to order and execute events inside a **Scenario Run**.
_Avoid_: Wall-clock time when discussing model behavior

**Event Log**:
The ordered record of simulation inputs and emitted events used as the authoritative replay source for a **Scenario Run**.
_Avoid_: Video recording, trace when referring to replay truth

**Authoritative Replay Log**:
The compact replay source containing initial version references, user inputs, external inputs, random seeds, and configuration choices.
_Avoid_: Diagnostic trace

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
A worker-produced update tagged with routing metadata for live subscriptions and trace persistence.
_Avoid_: Raw socket message

**Authoritative Event Queue**:
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
The rule used to translate an external interaction into simulation-time delay.
_Avoid_: Raw wall-clock delay when discussing simulation scheduling

**Fixed Latency Model**:
A **Latency Model** that applies a configured constant simulation-time delay to an external interaction.
_Avoid_: Measured wall-clock latency

**Modeled Latency Event**:
An event scheduled by the worker to represent an external result becoming available after a **Latency Model** delay.
_Avoid_: Immediate external response

**Replay Version Boundary**:
The engine version, model version, and configuration version within which a **Scenario Run** replay is expected to be deterministic.
_Avoid_: Forever-compatible replay

**Video Recording**:
An optional user-requested visual capture of a **Scenario Run** that is not authoritative for replay.
_Avoid_: Replay source

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
- External results enter the **Authoritative Event Queue** through **Modeled Latency Events**
- The first supported **Latency Model** is **Fixed Latency Model**
- **Recorded Controller Mode** allows speed-run from captured controller I/O
- **Live Controller Mode** may pace or pause a **Scenario Run** at external-controller interaction points
- A replay uses a **World Snapshot** plus an **Authoritative Replay Log** as its authoritative source
- A replay is deterministic within its **Replay Version Boundary**
- A **Diagnostic Event Trace** records internal causality for inspection and debugging
- A **Filtered Live Stream** sends only subscribed live updates to clients while the full **Diagnostic Event Trace** is persisted
- A **Filtered Live Stream** is composed from **View Subscriptions**, **Entity Subscriptions**, **Metric Subscriptions**, and **Trace Channel Subscriptions**
- A simulation worker produces **Run Updates**; the gateway and broker handle routing and fanout
- The **Authoritative Event Queue** lives inside the simulation worker, not the broker
- A **User Command** is validated by the gateway, then timestamped and enqueued by the simulation worker
- A **User Command** is admitted at the next deterministic **Simulation Boundary**
- A **Video Recording** may be attached to a **Scenario Run**, but does not define simulation truth
- Events in a **Scenario Run** are ordered by the **Event Ordering Key**
- **Chained Serial Batch** is the default when connected external systems cannot be reliably reset
- A **Chained Serial Batch** persists **Scenario Boundary Checkpoints** between runs
- A **Scenario Boundary Checkpoint** contains ECS component state, event queue, deterministic RNG state, run metadata, and **External Interaction Cursors**
- **External Nondeterminism** is captured through external interaction logs or modeled inputs, not controlled by **Deterministic RNG**

## Example Dialogue

> **Dev:** "When a **Scenario Run** starts, should robots be optional?"
> **Domain expert:** "For Hellspawn's primary use case, **Robots** are normal participants in **Warehouse Operations**, not a separate simulation mode."
>
> **Dev:** "Do we update every robot position every render frame?"
> **Domain expert:** "No — robot movement is modeled by **Path Reservations** and **Waypoint Arrivals**; rendering can interpolate between authoritative simulation events."
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
> **Domain expert:** "No — the controller injects delayed commands into **Simulation Time**, so speed-run and replay remain deterministic."
>
> **Dev:** "Can we speed-run while a live external controller is connected?"
> **Domain expert:** "Only in **Recorded Controller Mode**; **Live Controller Mode** can be constrained by real controller responses."
>
> **Dev:** "Is replay based on saved frames?"
> **Domain expert:** "No — replay uses the **World Snapshot** and **Event Log**; **Video Recording** is optional and non-authoritative."
>
> **Dev:** "Do internal events define replay truth?"
> **Domain expert:** "No — the **Authoritative Replay Log** defines replay; the **Diagnostic Event Trace** explains causality."
>
> **Dev:** "Should every diagnostic event be pushed live to the browser?"
> **Domain expert:** "No — clients receive a **Filtered Live Stream**, while the full **Diagnostic Event Trace** is persisted for query."
>
> **Dev:** "How does a client choose what to receive live?"
> **Domain expert:** "It creates view, entity, metric, and trace-channel subscriptions."
>
> **Dev:** "Does the simulation worker manage every browser subscription?"
> **Domain expert:** "No — the worker emits tagged **Run Updates**, while the gateway and broker handle routing and fanout."
>
> **Dev:** "Is the broker part of simulation truth?"
> **Domain expert:** "No — the worker's **Authoritative Event Queue** owns model execution; the broker handles live delivery."
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
> **Domain expert:** "No — the worker uses a **Latency Model** and schedules a **Modeled Latency Event**."
>
> **Dev:** "Which latency mode exists first?"
> **Domain expert:** "A **Fixed Latency Model**; sampled and replayed latency can be added later."

## Flagged Ambiguities

- "robot emulation" is part of the default warehouse simulation scope, not an optional external category.
- "movement" means reservation-based waypoint progression over **Path Segments** in simulation time, not per-frame physics.
- "tick" should mean a **Local Scheduled Event** unless a global simulation tick is explicitly being discussed.
- "external controller" means an out-of-worker service that issues commands with modeled delay, not the simulation clock owner.
- "speed-run" is unrestricted for deterministic recorded input, but constrained when live external services are participating.
- "serial batch" must specify whether it is **Independent Serial Batch** or **Chained Serial Batch** because the replay and external-state assumptions differ.
