# Use a separate simulation worker process

Hellspawn keeps the simulation worker as a separate package and process from day one, even while it is implemented in TypeScript. The gateway owns authentication, project routing, and worker lifecycle, while the worker owns deterministic event execution, ECS state, systems, checkpoints, replay, and run-local adapters. This preserves the architectural boundary before performance or scaling work begins.
