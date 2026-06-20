# Stage 120 Constraint-Coverage Map Slice

## Contract

Stage 120 adds a deterministic local constraint-coverage map and static
response-note prompt surface over the completed Stage 119 answer-review path.
Constraint-coverage rows derive from Stage 119 answer-review steps in the same
order. Static response-note prompt cards derive from Stage 119 static
constraint-note cards in the same order. The default response-note context
mirrors the Stage 119 default answer-review context.

Each constraint-coverage row exposes Stage 119 answer-review step ids, Stage
119 constraint-note ids, Stage 118 answer-check and readiness ids, Stage 117
response-prompt and review-path ids, Stage 116 response-check and readiness
ids, Stage 115 through Stage 64 lineage ids, local anchors, callbacks, gap
prompts, deferred reminders, answer-review labels, constraint-note labels,
constraint-coverage labels, static response-note prompts, local-only flags, and
static non-goal context.

The surface is fixture-first, read-only, in-page, non-persistent,
non-executable, non-routing, non-ranking, and non-certifying. It does not save
reviewer answers, answer drafts, revision drafts, response drafts, reviewer
notes, response notes, constraint-coverage state, response-note state,
answer-review state, constraint-note state, prompt-readiness state,
answer-check state, local storage, routes, exports, signoff, owners, scores,
rankings, certifications, meeting workflow, task launchers, runnable
checklists, commands, or handoff packages.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 120
constraint-coverage map directly after the Stage 119 answer-review path,
confirm constraint-coverage row order mirrors Stage 119 answer-review order,
confirm static response-note prompt order mirrors Stage 119 constraint-note
order, follow the in-page anchors, and verify the panel is static
manual-review context only.

## Verification

- `node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPath.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts`
- `node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts`
- `node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts`
- `npm --prefix frontend run test`
- `python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_packets.py`
- `python3 -m unittest discover -s tests/backend -p test_stage12_incident_review_exports.py`
- `python3 -m unittest discover -s tests/backend -p test_stage11_scenario_runbooks.py`
- `python3 -m unittest discover -s tests/backend -p test_stage10_alert_acknowledgement.py`
- `python3 -m unittest discover -s tests/backend -p test_stage10_alert_resolution.py`
- `python3 -m unittest discover -s tests/backend -p test_stage07_api.py`

## Filename Constraint

The shorter Stage 120 helper filename was accepted locally, so the Stage 120
schema and builder live in their own helper module rather than being appended
to the adjacent long Stage 119 helper file.

## Deferred Production Features

Persistence, saved reviewer answers, saved answer drafts, saved revision
drafts, saved response drafts, saved reviewer notes, saved response notes,
constraint-coverage state, response-note state, answer-review state,
constraint-note state, prompt-readiness state, answer-check state, routing,
exports, signoff, owners, scoring, ranking, certification, meeting workflow,
handoff package generation, task launchers, runnable checklists, command
execution UI, auth, cloud, deploy, and release work remain deferred.
