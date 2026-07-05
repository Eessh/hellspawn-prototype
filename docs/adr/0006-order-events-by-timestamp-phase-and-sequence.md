# Same-moment events are ordered by time, microstep, phase, sequence

Events are ordered by sim time first, then microstep, then phase, then a deterministic sequence number. Microsteps order instant cause-effect cascades happening at one sim time; phases give simultaneous events explicit meaning instead of accidental order. An event emitted at the current sim time is scheduled into a later still-unprocessed phase when possible, otherwise into the next microstep — a finished phase is never reopened.
