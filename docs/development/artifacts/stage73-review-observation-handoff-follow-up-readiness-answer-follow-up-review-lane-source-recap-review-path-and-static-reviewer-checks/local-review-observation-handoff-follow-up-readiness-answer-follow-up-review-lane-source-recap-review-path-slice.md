# Stage 73 Local Source Recap Review Path Slice

## Scope

Stage 73 adds a deterministic local source recap review path over the completed
Stage 72 answer follow-up review lane source recap. The slice is static,
in-page, non-actionable, non-persistent, non-routing, non-executable,
non-ranking, and non-certifying.

## Source Chain

- Stage 73 review-path steps derive from Stage 72 source-recap rows.
- Stage 73 static reviewer-check cards derive from Stage 72 static next-pass
  prompt cards.
- Review-path step order preserves Stage 72 source-recap row order.
- Static reviewer-check order preserves Stage 72 static next-pass prompt card
  order.
- Default review-path context carries the Stage 72 default source-recap
  context.

## Surface

The mission console now renders a compact Stage 73 panel near Stage 72:

- source-backed review-path steps with Stage 72 source-recap row ids and static
  next-pass prompt card ids;
- carried Stage 71 review-lane row and decision-cue card ids;
- carried Stage 70 crosswalk row and static follow-up prompt ids;
- carried Stage 69 walkthrough/static review note ids;
- carried Stage 68 answer coverage/reviewer-check prompt ids;
- carried Stage 67 rehearsal path and answer-prep prompt ids;
- carried Stage 66 board/question prompt ids;
- carried Stage 65 brief and Stage 64 triage ids;
- local anchors, evidence callbacks, gap prompts, deferred reminders, lane
  labels, source-recap text, static next-pass prompt text, review-path text,
  static reviewer-check text, local-only flags, and static non-goal context.

## Non-Goals

This slice does not add saved reviewer answers, saved answer drafts, saved
reviewer notes, saved recap state, saved review-path state, saved reviewer
checks, local storage, persistence, reviewer identity, signoff, audit
retention, owner assignment, runnable checklists, task launchers, ticketing,
messaging, report exports, handoff packages, command runners, shell panels,
scoring, ranking, certification, meeting workflow, app-wide routing, route
changes, auth, cloud, deploy, release, publish, main fast-forward, or
production handoff semantics.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 73
panel near Stage 72, confirm review-path step order mirrors Stage 72
source-recap row order, confirm static reviewer-check card order mirrors Stage
72 static next-pass prompt order, follow local anchors in-page, and verify the
labels/checks are static manual-review context rather than saved decisions,
priorities, rankings, scores, or certifications.

## Verification

Focused verification for this slice:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerCoverage.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessRehearsalPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessReviewBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessBrief.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/incidentReviewPackets.test.ts
node --experimental-strip-types --test tests/frontend/scenarioRunbooks.test.ts
node --experimental-strip-types --test tests/frontend/stage09LiveConsoleAdapter.test.ts
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
