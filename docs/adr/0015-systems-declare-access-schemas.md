# Systems declare up front what they read and write

At registration, every system declares its component read/write schema. The declaration documents the model, lets the engine validate early, and leaves the door open for scheduling optimizations later — while staged change sets remain the runtime enforcement of what actually got written.
