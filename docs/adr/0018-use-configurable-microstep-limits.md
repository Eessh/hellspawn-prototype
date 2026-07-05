# Use configurable microstep limits

Hellspawn enforces a configurable microstep limit per simulation time. If systems keep emitting same-time events until the limit is exceeded, the scenario run fails with diagnostic trace context instead of hanging or silently advancing time. This protects the discrete-event engine from infinite instantaneous loops while preserving causality.
