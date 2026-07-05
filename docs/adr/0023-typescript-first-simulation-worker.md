# Build the first simulation worker in TypeScript

Hellspawn will build the first simulation worker in TypeScript to iterate quickly on engine semantics, ECS contracts, replay, adapters, and frontend/gateway integration. C++ remains a future option for hot loops or the scheduler after profiling shows a concrete bottleneck behind a stable boundary. This choice optimizes for learning and correctness before performance specialization.
