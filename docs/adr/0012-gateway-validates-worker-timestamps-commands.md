# Gateway validates, worker timestamps commands

User commands enter Hellspawn through the gateway, which authenticates the user and validates project/session permissions. The simulation worker admits accepted commands at the next deterministic simulation boundary, converts them into events with simulation time, microstep, priority phase, and sequence, then enqueues them in its authoritative event queue. This keeps gateway logic out of simulation time while preventing mid-handler command injection.
