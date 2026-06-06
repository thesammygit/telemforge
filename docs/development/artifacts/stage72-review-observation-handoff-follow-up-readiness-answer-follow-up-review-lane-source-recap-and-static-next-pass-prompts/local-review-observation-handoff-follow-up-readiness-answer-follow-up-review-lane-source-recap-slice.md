# Stage 72 Local Review Lane Source Recap Slice

## Scope

Stage 72 adds a deterministic local source recap surface over the completed
Stage 71 answer follow-up review lane. The slice is static, in-page,
non-actionable, non-persistent, non-routing, non-executable, non-ranking, and
non-certifying.

## Source Chain

- Stage 72 source recap rows derive from Stage 71 answer follow-up review lane
  rows.
- Stage 72 static next-pass prompt cards derive from Stage 71 static
  decision-cue cards.
- Row order preserves Stage 71 review-lane row order.
- Static next-pass prompt order preserves Stage 71 static decision-cue order.
- Default source-recap context carries the Stage 71 default review-lane
  context.

## Surface

The mission console now renders a compact Stage 72 panel near Stage 71:

- source-backed recap rows with Stage 71 lane row ids and decision-cue ids;
- carried Stage 70 crosswalk row and static follow-up prompt ids;
- carried Stage 69 walkthrough/static review note ids;
- carried Stage 68 answer coverage/reviewer-check ids;
- carried Stage 67 rehearsal path and answer-prep prompt ids;
- carried Stage 66 board/question prompt ids;
- carried Stage 65 brief and Stage 64 triage ids;
- local anchors, evidence callbacks, gap prompts, deferred reminders, lane
  labels, source recap labels, static decision-cue text, source-recap text, and
  static next-pass prompt text.

## Non-Goals

This slice does not add saved reviewer answers, saved answer drafts, saved
reviewer notes, saved follow-up lane state, saved source recap state, saved
next-pass prompts, local storage, persistence, reviewer identity, signoff,
audit retention, owner assignment, runnable checklists, task launchers,
ticketing, messaging, report exports, handoff packages, command runners, shell
panels, scoring, ranking, certification, meeting workflow, app-wide routing,
route changes, auth, cloud, deploy, release, publish, main fast-forward, or
production handoff semantics.

## Verification

Focused verification for this slice:

```text
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
