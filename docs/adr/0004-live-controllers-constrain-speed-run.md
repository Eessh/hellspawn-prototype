# Live controllers constrain speed-run

Hellspawn separates recorded controller mode from live controller mode. Recorded controller mode replays captured external-controller I/O as deterministic simulation events and can speed-run freely; live controller mode waits for real controller responses at interaction points and therefore may pace or pause the scenario run. This preserves deterministic replay without pretending real external services can respond faster than wall-clock execution permits.
