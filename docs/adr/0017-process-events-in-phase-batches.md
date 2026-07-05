# Events sharing time, microstep, and phase run as one batch

All events with the same sim time, microstep, and phase are processed together: systems read the shared pre-phase snapshot, stage their changes, and the engine commits the merged change set once at the boundary. Sequence numbers still order things deterministically within the batch, but the batch — not the single event — is the unit of execution and commit.
