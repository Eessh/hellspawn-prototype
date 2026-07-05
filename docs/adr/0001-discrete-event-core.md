# Use a discrete-event simulation core

Hellspawn uses a discrete-event simulation core as the source of truth for scenario execution. Warehouse operations are dominated by meaningful changes such as task assignment, path reservation, waypoint arrival, inventory changes, and external system responses; representing these as timestamped events gives better speed-run, replay, traceability, and deterministic ordering than a fixed-tick loop. Fixed-step behavior may still exist inside specific models or in the renderer, but it does not drive simulation time.
