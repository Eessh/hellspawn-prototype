# Filter live streams and persist full traces

Hellspawn streams only subscribed live updates to clients during scenario execution, expressed as view, entity, metric, and trace-channel subscriptions. The full diagnostic event trace is persisted server-side and queried as needed instead of being pushed wholesale to browsers. This protects interactive performance for large warehouse runs while keeping deep causality inspection available.
