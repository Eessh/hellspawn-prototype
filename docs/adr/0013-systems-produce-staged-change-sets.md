# Systems stage changes; the engine commits them

A system never pokes the world directly. It reads the current world view and stages a change set — component writes, emitted events, trace records — which the engine commits at a deterministic boundary. Ordering, conflict detection, tracing, and replay all become inspectable engine concerns instead of side effects buried inside handlers.
