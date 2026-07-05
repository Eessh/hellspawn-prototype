# Use explicit reducers for write conflicts

Hellspawn permits multiple systems to contribute writes to the same component field only when an explicit reducer is registered for that field or operation. Reducers make legitimate aggregation deterministic while preventing accidental last-writer-wins behavior. Actual conflicts are detected from staged change sets at commit time, because the event queue alone cannot reliably reveal which entities and component fields a system will touch.
