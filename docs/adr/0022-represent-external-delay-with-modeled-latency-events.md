# External delay enters sim time by rule, not by network weather

How long an external answer takes in sim time is decided by a configured rule, not by how the network behaved that day. In Pure Simulation Mode, mocked services answer after their configured delay — fixed constant first, measured distributions bottled from live-run logs later. In Live modes (ADR-0026), arrival stamps come from the wall clock and are recorded, which makes them replayable and turns them into the source for calibrating those mock delays.
