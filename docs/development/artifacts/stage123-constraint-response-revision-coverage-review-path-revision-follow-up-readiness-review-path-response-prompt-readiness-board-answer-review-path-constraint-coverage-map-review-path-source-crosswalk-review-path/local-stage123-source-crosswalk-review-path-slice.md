# Stage 123 Source-Crosswalk Review-Path Slice

## Contract

Stage 123 adds a deterministic local source-crosswalk review path and static
source-review prompt surface over the completed Stage 122 source crosswalk. It
is fixture-first, read-only, in-page, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

Source-review path steps derive from Stage 122 source-crosswalk rows. Static
source-review prompt cards derive from Stage 122 static review-check cards.
Step order preserves Stage 122 source-crosswalk row order, prompt-card order
preserves Stage 122 review-check card order, and the default source-review
context mirrors the Stage 122 default source-check context.

## Source Files

- `frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 123
source-review path panel near the Stage 122 source crosswalk, confirm
source-review path order mirrors Stage 122 source-crosswalk order, confirm
static source-review prompt order mirrors Stage 122 review-check order, follow
local anchors in-page, and verify the panel is static manual review context
only.

The panel must not provide saved reviewer answers, saved drafts, source
selections, persisted source-review state, source-crosswalk state,
review-check state, command execution, routes, exports, signoff, owner
assignment, scoring, ranking, certification, meeting workflow, handoff
packages, task launchers, or runnable checklists.

## Filename Constraint

The shorter Stage 123 helper filename was accepted by the local filesystem, so
the Stage 123 schema and builder are exported from the dedicated helper module
rather than being embedded in an adjacent Stage 122 helper.

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.test.ts
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

Actual browser screenshot remains blocked until frontend dependencies are
installed locally; the dev-server command exits with `sh: vite: command not
found`. The ignored SVG proof is the sanitized project-capability visual for
this slice.

## Deferred Production Features

This slice intentionally does not add saved reviewer answers, saved drafts,
saved source-review prompts, saved source selections, saved source-review
state, saved source-crosswalk state, saved review-check state, local storage,
persistence, route changes, command execution, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, or production handoff semantics.
