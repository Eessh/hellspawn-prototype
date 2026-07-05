# Adapters record every external request and response

Every adapter conversation with an external service is recorded: requests, responses, timestamps, correlation IDs, and the sim-time stamps applied. Live runs record while they interact; Pure-mode and replay read the recording instead of touching any real service. External unpredictability becomes inspectable, replayable data — without claiming Hellspawn controls the hidden state inside someone else's system.
