# A cap on same-time cascades, failing loudly

Systems emitting same-time events at each other can loop forever without the clock ever advancing. A configurable microstep limit per sim time caps this: exceed it and the run fails with full trace context instead of hanging or silently jumping time. Infinite instantaneous loops become diagnosable model bugs.
