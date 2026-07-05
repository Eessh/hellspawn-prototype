# Worker emits one stream; the gateway fans out to clients

The worker tags each run update with routing metadata and sends it over a single stream. The gateway handles everything browser-shaped: connections, subscriptions, routing, fanout. The worker never manages client subscriptions — it stays a pure sim engine. Refined by ADR-0027: no message broker sits in the live-view path; a dedicated stream service can be split out of the gateway later if fanout load demands it.
