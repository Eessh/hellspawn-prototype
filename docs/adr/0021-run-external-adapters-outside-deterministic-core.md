# Run external adapters outside deterministic core

Hellspawn runs external adapters outside deterministic system handlers. Gateway-managed adapters serve shared, auth-heavy, or remote integrations, while worker-side adapters serve run-specific or low-latency integrations. The deterministic simulation core receives timestamped external events from adapters rather than blocking on network I/O inside model execution.
