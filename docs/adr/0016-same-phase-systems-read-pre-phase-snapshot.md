# Same-phase systems read a pre-phase snapshot

Hellspawn gives all systems executing in the same priority phase the same pre-phase ECS snapshot. Systems produce staged change sets against that snapshot, and the engine commits the merged result at the phase boundary. If one system must observe another system's output, that dependency must be represented with a later phase, subphase, or future event.
