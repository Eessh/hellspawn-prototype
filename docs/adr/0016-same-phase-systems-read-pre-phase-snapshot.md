# Systems in one phase all read the same frozen view

Every system executing in the same phase reads the identical pre-phase snapshot of the world and stages its changes against it; the engine commits the merged result at the phase boundary. One system can never observe another's output within the same phase — if B depends on A's result, that dependency must be expressed as a later phase, a subphase, or a future event. Execution order within a phase therefore cannot change results.
