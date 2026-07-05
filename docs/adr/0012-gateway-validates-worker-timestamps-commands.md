# Gateway checks permissions; worker stamps commands into sim time

A user command first passes the gateway: who are you, may you touch this project and session. The worker then admits accepted commands at the next safe boundary — after one event finishes, before the next begins — stamping each with sim time, microstep, phase, and sequence, and enqueueing it like any other event. Gateway logic stays out of sim time; commands can never mutate the world mid-event.
