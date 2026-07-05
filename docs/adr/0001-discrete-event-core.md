# The sim clock jumps from event to event — nothing ticks

Warehouse life is meaningful moments: task assigned, segment reserved, waypoint reached, answer arrived. We schedule those as timestamped events and let the clock jump straight from one to the next. Idle time costs nothing, quiet stretches simulate in microseconds, and every run is ordered, traceable, and repeatable — none of which a fixed-rate tick loop gives. Fixed-rate behavior may exist inside a specific model or in the renderer, but it never drives the sim clock.
