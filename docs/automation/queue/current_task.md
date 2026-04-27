# Current Task: Complete Stage 01 Stack/Workspace Foundation

Updated: `2026-04-27T16:00:30Z`

## Goal

Complete TelemForge Stage 01 by recording stack/workspace decisions and preparing the repo for Stage 02 telemetry contracts/fixtures without overbuilding behavior early.

## Context

Sam approved full automation and accepted the recommended stack:

- Python + FastAPI
- React + TypeScript + Vite
- SQLite for local/test storage where useful
- PostgreSQL later for compose/runtime
- websocket-first streaming
- explainable V1 anomaly methods

## Acceptance Criteria

- Add an ADR or decision doc recording the stack and why.
- Define backend/frontend/test/docs folder conventions.
- Add only minimal workspace scaffolding needed for the next stage; do not implement telemetry simulation yet unless Planner explicitly advances beyond this task after Stage 01 is satisfied.
- Add or update run notes showing what changed, how to inspect it, and what the next stage is.
- Keep the working tree clean by committing verified changes locally and pushing to origin.

## Suggested Verification

- Parse any added JSON/TOML/YAML config.
- Run available tests/build commands if scaffolding introduces them.
- If no code exists yet, verify docs links and git status.
- Final command must show a clean branch: `git status --porcelain=v1 --branch`.

## Stop Conditions

Stop and mark `human_needed` only for a human-only blocker: credentials, paid service, deploy/release decision, destructive cleanup, force-push/history rewrite, or ambiguity that cannot be safely resolved.
