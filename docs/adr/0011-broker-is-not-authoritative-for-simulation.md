# Broker is not authoritative for simulation

Hellspawn keeps the authoritative event queue inside the simulation worker. The broker carries live streams, fanout, reconnect, and client-facing delivery, but broker delivery failures do not change simulation correctness or replay truth. Commands entering the simulation are accepted by the gateway/worker and then become timestamped simulation events in the worker's authoritative queue.
