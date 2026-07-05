# Process events in phase batches

Hellspawn processes all events with the same simulation time, microstep, and priority phase as one phase batch. Systems read the same pre-phase snapshot for that batch, produce staged change sets, and the engine commits the merged result at the phase boundary. Sequence numbers remain available for deterministic ordering within the batch, but the batch is the primary execution unit.
