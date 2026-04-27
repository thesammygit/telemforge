# TelemForge Automation System

Updated: `2026-04-27T16:00:30Z`

## Project State

TelemForge is currently a docs-first planning repository. The automation workspace is allowed to implement the product stage-by-stage without further human approval unless it hits a human-only blocker.

## Viability Question

Is TelemForge steadily becoming a polished open-source mission-ops telemetry sandbox that a new user can run locally, understand quickly, demo live telemetry/fault/replay behavior, and trust as a credible portfolio artifact?

## Target Product

- synthetic spacecraft subsystem simulation
- live telemetry transport
- mission-control style console
- fault injection
- event/alert history
- replay workflow
- explainable anomaly overlays
- one-command local demo by the end of MVP

## Accepted Stack Direction

- Backend: Python + FastAPI
- Frontend: React + TypeScript + Vite
- Local/test storage: SQLite where useful
- Runtime/compose storage: PostgreSQL later
- Streaming: websocket-first; avoid broker complexity until justified
- Anomaly V1: explainable methods such as thresholds, rolling z-scores, changepoints, residual/envelope checks

## Stage Sequence

0. working agreement — accepted by Sam for automated stage-by-stage build
1. stack/workspace decisions — current first implementation task
2. telemetry contracts and fixtures
3. simulation spike and visualization
4. API skeleton and storage
5. live console foundation
6. faults, alerts, events
7. replay and anomaly layer
8. hardening, Docker, release readiness

## Automation Roles

- `telemforge-sentinel`: health and control-plane integrity checks.
- `telemforge-planner`: selects one bounded stage task and advances stages when exit criteria pass.
- `telemforge-executor`: implements the queued bounded stage task, verifies it, commits, and pushes.
- `telemforge-governor`: weekly posture, roadmap, stage-gate policy, prompt drift, and product coherence.
- `telemforge-repo-hygiene`: periodic semantic cleanup and clean-worktree commits.

## Operating Rules

- Read `control.md`, `inbox/`, and `human_overrides.json` first.
- Do one bounded task per run.
- Keep changes explainable and human-testable.
- Commit and push verified successful work.
- Write run notes with commands, artifacts, and next steps.
- If an output is visual/UI-related, capture screenshots or explain why screenshots were not possible.
- Never hide blockers behind generic success.
