# World objects are data; behavior lives in event-woken systems

Entities are world objects (robots, stations, shelves) carrying plain-data components. All behavior lives in Systems: developer-written functions that wake when an event arrives, change component data, and emit new timestamped events. Data and logic stay cleanly separated without turning the sim into a fixed-tick game loop, and the event core stays in charge of time, ordering, determinism, and replay.
