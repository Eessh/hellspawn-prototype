# Support scenario batch execution modes

Hellspawn supports independent serial, chained serial, and parallel scenario batches. Chained serial is the default for live or stateful external integrations because external systems may maintain internal state that Hellspawn cannot safely clear; independent serial requires resettable or mocked external state. Parallel batches require isolated run contexts or workers so concurrent scenario runs cannot contaminate each other's event queues, ECS state, RNG state, traces, or external-service sessions.
