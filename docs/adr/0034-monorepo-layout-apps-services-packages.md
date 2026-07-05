# Monorepo layout: apps/, services/, packages/

Workspace grammar: `apps/hellspawn` (frontend), `services/gateway`, `services/simulation-worker`, `packages/*` for shared testable modules — `packages/protocol` first (event types, run-update wire format, checkpoint format, fingerprint). There is deliberately no separate `shared/` folder: one home for shared code, so "which folder?" never drifts. The pre-existing `backend/` and `frontend/` prototype code predates this architecture and is discarded, not migrated.
