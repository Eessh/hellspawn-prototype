# Replay from event log and world snapshot

Hellspawn replays scenario runs from an initial world snapshot/config version plus an authoritative replay log containing user inputs, external inputs, random seeds, and configuration choices. Internal emitted events, system transitions, reservations, metrics samples, and service calls belong to a diagnostic event trace that explains causality but is not the compact replay source. Users may opt into video recording for visual review, but video is an attached artifact, not the authoritative replay source.
