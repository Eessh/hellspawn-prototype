# No network inside the core — adapters live outside

System handlers never block on real I/O (enforced by ADR-0025). Adapters run outside the deterministic core and hand results in as timestamped events: gateway-managed adapters serve shared, auth-heavy, or remote integrations; worker-side adapters serve run-specific or latency-sensitive ones. The core consumes events; adapters deal with the messy real world.
