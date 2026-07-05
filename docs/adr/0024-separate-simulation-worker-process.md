# The worker is its own process and package from day one

The simulation worker lives as a separate package and OS process even while everything is TypeScript. The gateway owns auth, projects, session lifecycle, and fanout; the worker owns the event queue, world state, systems, RNG, checkpoints, replay, and its run-local adapters. Keeping the boundary physical from the start stops gateway concerns from leaking into the engine and keeps a future engine rewrite (ADR-0023) a swap, not a surgery.
