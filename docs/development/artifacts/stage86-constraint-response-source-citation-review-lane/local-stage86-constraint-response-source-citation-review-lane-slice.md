# Stage 86 Local Source Citation-Review Lane Slice

## Summary

Stage 86 adds a deterministic local source citation-review lane over the
completed Stage 85 source follow-up map. Citation-review lane rows derive from
Stage 85 static citation-check prompt cards. Static evidence-check prompt cards
derive from Stage 85 source follow-up map entries.

The surface is local, static, in-page, non-actionable, non-persistent,
non-executable, non-routing, non-ranking, and non-certifying. It does not save
reviewer answers, answer drafts, reviewer notes, response notes, source
selections, citation selections, citation-review state, evidence-check state,
owners, signoff, audit state, scores, reports, handoff packages, runnable
checklists, task launchers, commands, or external workflow state.

## Source Contract

- Builder: `frontend/src/lib/constraintResponseSourceCitationReviewLane.ts`
- Source view: `constraintResponseSourceFollowUpMap`
- Citation-review rows preserve
  `staticCitationCheckPromptCards` order from Stage 85.
- Static evidence-check prompt cards preserve
  `sourceFollowUpMapEntries` order from Stage 85.
- The Stage 86 default citation-review context carries Stage 85
  `summary.defaultFollowUpContext`.
- Mission Console renders the Stage 86 panel immediately after Stage 85.

## Reviewer Checks

1. Open the Mission Console in fixture mode.
2. Locate "Stage 86 source citation review lane" near Stage 85.
3. Confirm citation-review row order mirrors Stage 85 citation prompt order.
4. Confirm evidence-check prompt order mirrors Stage 85 follow-up entry order.
5. Follow local in-page anchors and verify labels/prompts are manual-review
   context, not saved state or workflow actions.

## Verification

Passed locally:

```text
node --experimental-strip-types --test tests/frontend/constraintResponseSourceCitationReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
npm --prefix frontend run test
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py
python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py
python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py
python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py
python3 -m unittest discover -s tests/backend -p test_stage07_api.py
```

Screenshot note: a browser screenshot was not possible because
`npm --prefix frontend run dev -- --host 127.0.0.1 --port 5173` exits with
`sh: vite: command not found`; `frontend/node_modules` does not provide Vite in
this workspace. The ignored local visual proof is
`docs/automation/demos/telemforge-stage86-source-citation-review-lane-20260607.svg`.
