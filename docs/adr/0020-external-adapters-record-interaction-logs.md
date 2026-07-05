# External adapters record interaction logs

Replay-capable external adapters record requests, responses, timestamps, correlation IDs, and modeled latency for their interactions with external systems. Live mode uses the real external system and records the interaction log; recorded mode replays that log as simulation input. This makes external nondeterminism inspectable and replayable without claiming Hellspawn controls hidden state inside external services.
