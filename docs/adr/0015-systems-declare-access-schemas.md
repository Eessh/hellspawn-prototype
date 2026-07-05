# Systems declare access schemas

Hellspawn systems declare their component read/write access schema when registered. The schema documents model behavior, enables early validation, and leaves room for future scheduling optimizations, while staged change sets remain the runtime authority for actual writes. This balances ECS flexibility with deterministic simulation and debuggable commits.
