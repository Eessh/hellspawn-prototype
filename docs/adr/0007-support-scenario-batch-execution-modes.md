# Three batch shapes: independent serial, chained serial, parallel

A scenario batch runs one of three ways. Independent serial: every run starts from the same reset baseline — requires externals that can be reset or mocked. Chained serial: each run continues from the previous run's final state — the default when live external services hold state Hellspawn cannot clear. Parallel: runs execute concurrently in fully isolated workers, so nothing (queues, world state, RNG, traces, external sessions) can leak between them — which in practice means mocked or per-run external sessions.
