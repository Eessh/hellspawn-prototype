# Randomness comes from the engine's seeded RNG only

Internal systems draw randomness exclusively from the engine-provided seeded RNG — never `Math.random` or other runtime APIs (enforced at runtime by ADR-0030). RNG state travels in checkpoints and the run fingerprint, so replays and comparisons reproduce the same "random" behavior exactly. Randomness from external systems is a different animal: it gets captured in interaction logs or modeled as input, never pretended to be under engine control.
