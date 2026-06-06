# Stage 60 Source Readiness Response Trace Coverage Review Path Slice

## Contract

Stage 60 adds a deterministic local
`telemforge.review_observation_handoff_source_readiness_response_trace_coverage_review_path.v1`
surface over the completed Stage 59 trace coverage board.

The slice derives ordered coverage review path steps from Stage 59 coverage
rows and static handoff prompt cards from Stage 59 static gap note cards. It
preserves source order, carries the Stage 59 default coverage context, and
exposes source anchors, evidence callbacks, gap discussion prompts,
deferred-scope reminders, coverage notes, gap notes, and static handoff prompts
as in-page review context only.

## Source Files

- `frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verified Behavior

- Review path step order mirrors Stage 59 coverage row order.
- Static handoff prompt card order mirrors Stage 59 static gap note card order.
- Each review path step carries coverage row ids, response trace row ids,
  walkthrough step ids, response row ids, question row ids, source alignment
  note card ids, static evidence note ids, static follow-up prompt ids, source
  local anchor hrefs, anchor target ids, evidence callback ids, gap discussion
  point ids, deferred-scope reminder ids, response-note cues, reviewer cues,
  coverage notes, gap notes, and static handoff prompt text.
- Each static handoff prompt card carries source gap note ids, matched coverage
  rows, matched trace rows, matched response rows, matched question rows,
  static evidence notes, static follow-up prompts, anchors, callbacks, gap
  prompts, deferred reminders, cue text, gap note text, and static prompt text.
- Fixture mode and explicit local-live mode remain deterministic and do not add
  routes, persistence, commands, exports, signoff, scoring, certification,
  meeting workflow, task launchers, runnable checklists, or owner assignment.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceMap.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseMatrix.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessQuestionBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessRehearsal.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadiness.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadout.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceWalkthrough.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffRelayTrail.test.ts
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

## Human Test Gate

A reviewer should open the mission console in fixture mode and find the Stage
60 coverage review path near the Stage 59 trace coverage board. The reviewer
should confirm review step order mirrors coverage row order, static handoff
prompt order mirrors static gap note order, in-page anchor links stay on the
same route, and the panel remains static manual-review context.

## Deferred Production Features

This slice intentionally defers saved reviewer answers, saved trace coverage
progress, saved coverage review progress, saved gap notes, saved handoff prompt
edits, saved response progress, saved source readiness progress, saved source
inspection state, saved anchor state, saved relay progress, owner assignment,
routes, exports, signoff, audit retention, scoring, certification, meeting
workflow, handoff packages, runnable checklists, task launchers, command
execution, persistence, and production handoff semantics.
