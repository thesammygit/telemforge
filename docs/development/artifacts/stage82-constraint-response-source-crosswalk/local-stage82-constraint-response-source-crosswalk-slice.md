# Stage 82 Constraint-Response Source Crosswalk Slice

## Summary

Stage 82 adds a deterministic local constraint-response source crosswalk and
static review-check surface over the completed Stage 81 constraint-response
review path. The slice lets reviewers compare each response-prep prompt with
its source chain before drafting outside the app.

The implementation is fixture-first, local-live safe, read-only, static,
in-page, non-actionable, non-persistent, non-executable, non-routing,
non-ranking, and non-certifying.

## Source Files

- `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

- Source-crosswalk rows derive from Stage 81 constraint-response review-path
  steps.
- Static review-check cards derive from Stage 81 static response-review prompt
  cards.
- Source-crosswalk row order preserves Stage 81 review-path step order.
- Static review-check card order preserves Stage 81 response-review prompt
  order.
- The default source-check context carries the Stage 81 default
  constraint-response context.
- Rows and cards expose Stage 81 through Stage 64 source ids, local anchors,
  callbacks, gap prompts, deferred reminders, labels, static response-review
  prompt text, and static review-check text as manual-review context only.

## Human Test Gate

1. Open the mission console in fixture mode.
2. Find the Stage 82 source-crosswalk panel near Stage 81.
3. Confirm row order mirrors Stage 81 review-path step order.
4. Confirm static review-check order mirrors Stage 81 response-review prompt
   order.
5. Follow local anchors and confirm the page stays in the same route.
6. Confirm labels and checks are static context, not saved decisions, drafts,
   notes, rankings, scores, certifications, owners, signoff, workflow actions,
   exports, or commands.

## Verification

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
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

## Deferred Features

No saved reviewer answers, saved answer drafts, saved reviewer notes, saved
response notes, saved source selections, saved response-review state, saved
source-crosswalk state, local storage, persistence, owner assignment, runnable
checklists, task launchers, ticketing, messaging, report export, handoff
package generation, command execution, shell panel, scoring, ranking,
certification, meeting workflow, app-wide routing, route changes, auth, cloud,
deploy, release, publish, main fast-forward, force-push, merge, destructive
cleanup, or credential edits were added.
