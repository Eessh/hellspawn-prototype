# Persist scenario boundary checkpoints

Hellspawn persists scenario boundary checkpoints between runs in a scenario batch, especially for chained serial batches. A checkpoint contains ECS component state, event queue, deterministic RNG state, run metadata, and external interaction cursors; it excludes derived UI state, rendered frames, dashboard caches, and hidden external-system state. For live external integrations, hidden state inside external systems is not treated as captured unless the integration explicitly exposes it.
