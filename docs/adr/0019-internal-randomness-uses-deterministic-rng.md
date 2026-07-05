# Internal randomness uses deterministic RNG

Hellspawn internal systems use an engine-provided deterministic RNG instead of language/runtime random APIs. RNG state is part of checkpoints and replay version boundaries, enabling deterministic replay and scenario comparison. Randomness produced by external systems is external nondeterminism; Hellspawn captures it through interaction logs or models it as input rather than pretending the engine controls it.
