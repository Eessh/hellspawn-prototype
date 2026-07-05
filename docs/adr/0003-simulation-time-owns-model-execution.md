# Simulation time owns model execution

Hellspawn executes model behavior against deterministic simulation time, not wall-clock time. Live pacing, pausing, speed-run, and replay are runner concerns; systems and local scheduled events use simulation timestamps even when an external controller is connected. External controllers influence a scenario run by injecting delayed timestamped command events, which preserves deterministic replay while still allowing real services to control simulated robots.
