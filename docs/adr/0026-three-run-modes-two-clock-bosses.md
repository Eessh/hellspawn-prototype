# Three run modes, two clock bosses

A run needs an answer to one question: what drives the sim clock? We support exactly two answers, giving three run modes. (Refines ADR-0004 and ADR-0022.)

1. **Pure Simulation Mode** — the event queue drives the clock. It jumps from event to event as fast as the CPU allows. No live external services: every external service is replaced by a sync-internal mock System. Mock response delays come from config, ideally bottled from measured live-run logs. Deterministic, fair A/B comparisons, real warehouse KPIs.
2. **Live Simulation Mode** — the wall clock drives the sim clock, locked 1:1. Real external services participate; their events are stamped with the current sim time on arrival and written to the log. Nothing waits and nothing is modeled — measured reality is captured for free. Used as the acceptance bench for real WMS/fleet-controller software and to calibrate Pure-mode mocks.
3. **Live Warp Mode** — Live mode plus a config transform: internal durations (robot speed, conveyor speed, ...) shrunk by a warp factor. NOT a third clock discipline; the wall clock still drives. Two warning labels: (a) speedup is capped by external services' real think time (internal time -> 0, external time stays), and (b) results are never performance KPIs — robots teleport, so time-aware or telemetry-hungry external software sees distorted physics. Warp is for fast logic/integration verification of real external software and for fast-forwarding to interesting states.

All three modes emit the same log format, so any run can be replayed later at any speed. The earlier idea of pausing a fast sim mid-run to wait for a live HTTP answer is retired: fast execution and live services are separated by mode instead.
