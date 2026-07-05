# A checkpoint is saved between the runs of a batch

Between scenario runs in a batch, the worker saves a checkpoint: component state, event queue, RNG state, run metadata, and external interaction cursors. It deliberately excludes derived UI state, rendered frames, dashboard caches, and hidden state inside external services — what an external system won't expose is not pretended to be captured. Extended by ADR-0031: the same checkpoints are also written periodically inside a run, for crash recovery and replay seek.
