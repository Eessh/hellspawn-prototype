# Live external services cap the speed of a run

A real WMS or fleet controller answers at its own real speed, and a simulation cannot know an answer before the service produces it. So a run with live services can never go faster than reality allows, while a run with recorded or mocked services can go as fast as the CPU. Refined by ADR-0026 into the three run modes: Pure (mocked, fast), Live (real, 1:1), Warp (real, internal durations shrunk — still capped by external think time).
