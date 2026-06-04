# Stage 19 Local Review Coverage Matrix Slice

## Boundary

This slice turns the Stage 18 local review handoff rehearsal into a deterministic
local review coverage matrix and a compact verification command checklist.

It stays fixture-first and local-live compatible through the mission-console
view model. It does not add saved reviewer sessions, persistent notes, action
ownership, reviewer signoff, external ticketing, report authoring, report
exports, production handoff services, deploy/release behavior, or cloud-backed
state.

## Source Files

- `frontend/src/lib/reviewHandoffCoverageMatrix.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewHandoffCoverageMatrix.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Local Coverage Contract

- Schema: `telemforge.review_handoff_coverage_matrix.v1`
- Version: `1`
- Contract label: `local deterministic review coverage matrix`
- Matrix rows:
  - derived one row per Stage 18 rehearsal step;
  - expose the action id, rehearsal step id, rehearsal step label, readiness verdict, blocker status, target coverage counts, source coverage buckets, next local step, and source evidence references;
  - keep local blocker status explicit so missing targets never collapse into a silent success.
- Source coverage buckets:
  - briefing board rows;
  - replay frames;
  - runbook targets;
  - incident packet refs;
  - evidence export refs;
  - source paths.
- Verification command checklist:
  - static and repo-relative;
  - non-executable from the UI;
  - focused on the matrix, its Stage 18 dependencies, and the public repo guard.

## Matrix Summary

- Row 1: `action:follow-up:decision:alert-lifecycle-handoff`
  - blocker status: blocked;
  - readiness: local coverage blocked;
  - coverage: 3 resolved targets, 0 missing targets, and full local source bucket visibility.
- Row 2: `action:follow-up:decision:evidence-export-boundary`
  - blocker status: blocked;
  - readiness: local coverage blocked;
  - coverage: 3 resolved targets, 0 missing targets, and full local source bucket visibility.
- Row 3: `action:deferred-production-handoff-scope`
  - blocker status: deferred;
  - readiness: local coverage ready; production scope deferred;
  - coverage: local evidence is ready while production handoff remains later-stage scope.

## Human-Testable Flow

1. Inspect the Stage 18 local review handoff rehearsal.
2. Read the Stage 19 coverage matrix row by row.
3. Confirm each row maps to a rehearsal action, shows target coverage counts,
   source coverage buckets, blocker status, and source references.
4. Inspect the local command checklist and confirm the commands are repo-relative
   and non-executable from the UI.
5. Confirm unresolved local blockers remain explicit.
6. Confirm deferred production scope remains visible but non-blocking.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewHandoffCoverageMatrix.test.ts
node --experimental-strip-types --test tests/frontend/reviewHandoffRehearsal.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewActionQueue.test.ts
node --experimental-strip-types --test tests/frontend/reviewBriefingBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewDecisionRegister.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
python3 scripts/public_repo_guard.py --scan-history
```

## Deferred

- production authentication and collaboration identity;
- saved reviewer sessions, persistent notes, and action ownership;
- reviewer signoff, audit retention, and production readiness certification;
- external ticketing, messaging, or email integrations;
- cloud services, telemetry upload, paid APIs, or browser-cookie import;
- report designer, downloadable styled reports, report package writers, or
  handoff report exports;
- deploy, release, publish, or main-branch fast-forward.
