# Order events by time, microstep, phase, and sequence

Hellspawn orders simulation events by simulation time, microstep, priority phase, and deterministic sequence number. Microsteps order instantaneous cascades at the same physical simulation time, while phases give simultaneous events explicit semantics. When a system emits a same-time event, it is scheduled into a later unprocessed phase if possible, otherwise into the next microstep so already processed phases are never rewritten.
