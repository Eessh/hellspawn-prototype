# Models read only sim time, never the wall clock

Model code sees one clock: sim time. Pausing, speeding up, and pacing are runner concerns outside the model, and external services influence a run by injecting timestamped events rather than by driving the clock. In Live modes the runner sets the sim clock from the wall clock 1:1 (ADR-0026), but models still read only sim time — which is why the same model runs unchanged at any speed and replays exactly.
