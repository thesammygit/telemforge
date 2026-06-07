# Stage 91 Local Evidence-Gap Follow-Up Coverage Review Path Slice

## Scope

This slice adds the first deterministic local Stage 91 surface over the
completed Stage 90 evidence-gap follow-up coverage board.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 91 helper builds:

- coverage-review path steps from Stage 90 coverage rows;
- static response cue cards from Stage 90 static review prompt cards;
- default coverage-review context from the Stage 90 default coverage context;
- explicit Stage 90 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, coverage-review labels, response cue labels,
  and static non-goal flags.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 90 panel. It does not add saved reviewer answers, answer drafts,
reviewer notes, response notes, coverage-review selections, response cue
selections, evidence-gap follow-up selections, coverage-board selections,
coverage state, local storage, persistence, route changes, exports, signoff,
audit retention, owner assignment, scoring, ranking, certification, meeting
workflow, handoff packages, runnable checklists, task launchers, command
runners, auth, cloud, deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 91
coverage-review path near Stage 90, and confirm:

1. coverage-review path step order mirrors Stage 90 coverage row order;
2. static response cue order mirrors Stage 90 static review prompt card order;
3. the default coverage-review context mirrors the Stage 90 default coverage
   context;
4. each step and cue exposes source ids, anchors, callbacks, gap prompts,
   deferred reminders, labels, and static non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceCitationReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceFollowUpMap.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
git diff --check
git diff --cached --check
python3 scripts/public_repo_guard.py --scan-history
```
