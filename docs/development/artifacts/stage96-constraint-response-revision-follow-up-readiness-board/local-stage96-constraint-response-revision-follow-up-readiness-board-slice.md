# Stage 96 Constraint Response Revision Follow-Up Readiness Board Slice

## Summary

Stage 96 adds a deterministic local revision follow-up readiness board over the
completed Stage 95 revision coverage review path. The new board derives
readiness rows from Stage 95 review-path steps and static response-check cards
from Stage 95 static revision follow-up prompt cards so reviewers can compare
each follow-up prompt with the next manual response check before editing outside
the app.

The slice is local, fixture-safe, in-page, static, non-actionable,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.

## Source-Bearing Changes

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessBoard.ts`
  builds the Stage 96 view from the Stage 95 view.
- `frontend/src/features/mission-console/types.ts` defines the Stage 96 row,
  static response-check card, summary, boundary, and aggregate view contracts.
- `frontend/src/features/mission-console/consoleViewModel.ts` wires the Stage
  96 board directly after Stage 95.
- `frontend/src/features/mission-console/MissionConsole.tsx` renders the compact
  Stage 96 panel near Stage 95 without routes, saved state, exports, commands,
  signoff, owner assignment, scoring, ranking, certification, or workflow
  actions.
- `frontend/src/styles/global.css` gives the Stage 96 panel the same responsive
  static review layout behavior as the adjacent Stage 94 and Stage 95 panels.
- `tests/frontend/constraintResponseRevisionFollowUpReadinessBoard.test.ts`
  covers the helper contract and row/card derivation from Stage 95.
- `tests/frontend/consoleViewModel.test.ts` covers Mission Console integration.

## Deterministic Lineage

- Readiness row order preserves the Stage 95 review-path step order.
- Static response-check card order preserves the Stage 95 static revision
  follow-up prompt card order.
- The default readiness context carries the Stage 95 default revision coverage
  review-path context.
- Each readiness row carries the Stage 95 step ids, Stage 95 prompt card ids,
  Stage 94 revision coverage row and revision-check card ids, Stage 93 through
  Stage 64 source lineage ids, local anchors, callbacks, gap prompts, deferred
  reminders, labels, response-check text, local-only flags, and static non-goal
  context from its source rows.

## Static Boundary

The Stage 96 board does not introduce saved reviewer answers, saved answer
drafts, saved revision drafts, saved response drafts, saved reviewer notes,
saved response notes, saved revision follow-up selections, saved response-check
selections, saved readiness board state, local storage, persistence, reviewer
identity, signoff, audit retention, owner assignment, runnable checklists, task
launchers, ticketing, messaging, report export, handoff packages, command
runners, shell panels, scoring, ranking, certification, meeting workflow,
app-wide routing, route changes, auth, cloud, deploy, release, publish, merge,
or main fast-forward behavior.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessBoard.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts tests/frontend/consoleViewModel.test.ts tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts tests/frontend/constraintResponseSourceCitationReviewLane.test.ts tests/frontend/constraintResponseSourceFollowUpMap.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
```

## Human Test Gate

Open the mission console in fixture mode, find the Stage 96 panel immediately
after Stage 95, confirm readiness row order mirrors Stage 95 review-path step
order, confirm static response-check card order mirrors Stage 95 static revision
follow-up prompt card order, follow local in-page anchors, and verify labels and
prompts stay static manual-review context rather than saved answers, drafts,
revision notes, response notes, selections, readiness board state, priorities,
rankings, scores, certifications, owners, signoff, workflow actions, exports, or
commands.
