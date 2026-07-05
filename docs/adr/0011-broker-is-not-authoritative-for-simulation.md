# Delivery is never truth

Simulation truth lives in the worker's event queue, full stop. The delivery path to browsers (gateway fanout; historically a broker was considered — removed by ADR-0027) may lag, drop stale updates, or fail entirely without changing simulation results, logs, or replay. A user command becomes real only when the worker stamps and enqueues it, not when any delivery layer carries it.
