# Systems produce staged change sets

Hellspawn systems do not mutate ECS component state directly during event handling. A system reads the current world view and produces a staged change set containing component writes, emitted events, and trace records; the engine commits that change set at a deterministic boundary. This makes replay, debugging, ordering, and conflict detection clearer than allowing arbitrary mid-handler world mutation.
