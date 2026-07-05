# Browsers get subscriptions; the full trace goes to storage

During a run, a browser receives only what it subscribed to — views (what my camera sees), entities, metrics, and trace channels. The full diagnostic trace is written server-side and queried on demand instead of being pushed wholesale to clients. Big warehouse runs stay smooth in the browser while deep causality inspection stays available.
