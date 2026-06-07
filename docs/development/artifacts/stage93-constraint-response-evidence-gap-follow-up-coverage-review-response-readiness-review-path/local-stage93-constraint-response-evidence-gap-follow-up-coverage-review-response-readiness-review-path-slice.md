# Stage 93 Local Response-Readiness Review Path Slice

## Scope

This slice adds the first deterministic local Stage 93 surface over the
completed Stage 92 evidence-gap follow-up coverage-review response-readiness
board.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.ts`
- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 93 helper builds:

- response-readiness review path steps from Stage 92 response-readiness rows;
- static revision-prompt cards from Stage 92 static draft-check cards;
- default response-readiness review context from the Stage 92 default
  response-readiness context;
- explicit Stage 92 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, response-readiness review labels, static
  revision-prompt labels, response-readiness review text, revision-prompt text,
  local-only flags, and static non-goal context.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 92 panel. It does not add saved reviewer answers, saved answer
drafts, saved revision drafts, saved reviewer notes, saved response notes,
saved response-readiness selections, saved draft-check selections, saved
revision-prompt selections, saved review-path state, local storage,
persistence, route changes, exports, signoff, audit retention, owner
assignment, scoring, ranking, certification, meeting workflow, handoff
packages, runnable checklists, task launchers, command runners, auth, cloud,
deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 93
response-readiness review path near Stage 92, and confirm:

1. response-readiness review path step order mirrors Stage 92
   response-readiness row order;
2. static revision-prompt card order mirrors Stage 92 static draft-check card
   order;
3. the default response-readiness review context mirrors the Stage 92 default
   response-readiness context;
4. each review step and revision prompt exposes source ids, anchors, callbacks,
   gap prompts, deferred reminders, labels, revision-prompt text, and static
   non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.test.ts
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
