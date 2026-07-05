# Use event-activated ECS systems as model units

Hellspawn models world objects as entities with data-only components, while developer-authored systems contain the executable model logic. Systems are activated by simulation events, update component state, and emit new timestamped events; this keeps the ECS model ergonomic without turning the simulation into a fixed-tick loop. The discrete-event kernel remains responsible for simulation time, ordering, determinism, replay, and trace boundaries.
