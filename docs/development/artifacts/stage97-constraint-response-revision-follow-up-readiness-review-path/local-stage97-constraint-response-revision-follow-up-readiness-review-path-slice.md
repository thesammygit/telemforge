# Stage 97 Constraint Response Revision Follow-Up Readiness Review Path Slice

## Summary

Stage 97 adds a deterministic local revision follow-up readiness review path
over the completed Stage 96 revision follow-up readiness board. The new surface
derives review-path steps from Stage 96 readiness rows and static
response-prompt cards from Stage 96 static response-check cards so reviewers can
walk each readiness row to the next manual response prompt before editing
outside the app.

The slice is local, fixture-safe, in-page, static, non-actionable,
non-persistent, non-executable, non-routing, non-ranking, and non-certifying.

## Source-Bearing Changes

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPath.ts`
  builds the Stage 97 view from the Stage 96 view.
- `frontend/src/features/mission-console/types.ts` defines the Stage 97
  review-path step, static response-prompt card, summary, boundary, and
  aggregate view contracts.
- `frontend/src/features/mission-console/consoleViewModel.ts` wires the Stage
  97 review path directly after Stage 96.
- `frontend/src/features/mission-console/MissionConsole.tsx` renders the
  compact Stage 97 panel near Stage 96 without routes, saved state, exports,
  commands, signoff, owner assignment, scoring, ranking, certification, or
  workflow actions.
- `frontend/src/styles/global.css` gives the Stage 97 panel the same responsive
  static review layout behavior as the adjacent Stage 96 panel.
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPath.test.ts`
  covers the helper contract and step/card derivation from Stage 96.
- `tests/frontend/consoleViewModel.test.ts` covers Mission Console integration.

## Deterministic Lineage

- Review-path step order preserves the Stage 96 readiness row order.
- Static response-prompt card order preserves the Stage 96 static
  response-check card order.
- The default review-path context carries the Stage 96 default revision
  follow-up readiness context.
- Each review-path step carries the Stage 96 readiness row ids, Stage 96 static
  response-check card ids, Stage 95 revision coverage review-path step ids,
  Stage 95 static revision follow-up prompt card ids, Stage 94 revision
  coverage row and revision-check card ids, Stage 93 through Stage 64 source
  lineage ids, local anchors, callbacks, gap prompts, deferred reminders,
  labels, response-prompt text, local-only flags, and static non-goal context
  from its source rows.

## Static Boundary

The Stage 97 review path does not introduce saved reviewer answers, saved answer
drafts, saved revision drafts, saved response drafts, saved reviewer notes,
saved response notes, saved revision follow-up readiness selections, saved
response-check selections, saved response-prompt selections, saved review-path
state, local storage, persistence, reviewer identity, signoff, audit retention,
owner assignment, runnable checklists, task launchers, ticketing, messaging,
report export, handoff packages, command runners, shell panels, scoring,
ranking, certification, meeting workflow, app-wide routing, route changes,
auth, cloud, deploy, release, publish, merge, or main fast-forward behavior.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapReadinessMatrix.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceCitationReviewLane.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
```

## Human Test Gate

Open the mission console in fixture mode, find the Stage 97 panel immediately
after Stage 96, confirm review-path step order mirrors Stage 96 readiness row
order, confirm static response-prompt card order mirrors Stage 96 static
response-check card order, follow local in-page anchors, and verify labels and
prompts stay static manual-review context rather than saved answers, drafts,
revision notes, response notes, selections, response-prompt state, review-path
state, priorities, rankings, scores, certifications, owners, signoff, workflow
actions, exports, or commands.
