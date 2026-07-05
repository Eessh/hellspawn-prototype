# Represent external delay with modeled latency events

Hellspawn represents external-system delay through modeled latency events. The first supported latency mode is fixed latency: a configured constant simulation-time delay applied to an external interaction. Adapters may record real interaction timing, but wall-clock response time does not decide simulation time unless a future latency model explicitly introduces that behavior.
