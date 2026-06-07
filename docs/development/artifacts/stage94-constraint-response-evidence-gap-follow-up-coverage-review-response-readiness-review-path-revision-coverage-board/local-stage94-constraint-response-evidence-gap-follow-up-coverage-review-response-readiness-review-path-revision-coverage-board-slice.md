# Stage 94 Local Revision Coverage Board Slice

## Scope

This slice adds the first deterministic local Stage 94 surface over the
completed Stage 93 response-readiness review path.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 94 helper builds:

- revision coverage rows from Stage 93 response-readiness review-path steps;
- static revision-check cards from Stage 93 static revision-prompt cards;
- default revision coverage context from the Stage 93 default response-readiness
  review context;
- explicit Stage 93 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, revision coverage labels, static revision-check
  labels, revision coverage text, static revision-check text, local-only flags,
  and static non-goal context.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 93 panel. It does not add saved reviewer answers, saved answer
drafts, saved revision drafts, saved reviewer notes, saved response notes,
saved response-readiness selections, saved revision-coverage selections, saved
revision-check selections, saved revision-coverage state, local storage,
persistence, route changes, exports, signoff, audit retention, owner
assignment, scoring, ranking, certification, meeting workflow, handoff
packages, runnable checklists, task launchers, command runners, auth, cloud,
deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 94
revision coverage board near Stage 93, and confirm:

1. revision coverage row order mirrors Stage 93 response-readiness review-path
   step order;
2. static revision-check card order mirrors Stage 93 static revision-prompt
   card order;
3. the default revision coverage context mirrors the Stage 93 default
   response-readiness review context;
4. each revision coverage row and revision check card exposes source ids,
   anchors, callbacks, gap prompts, deferred reminders, labels, revision text,
   and static non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 scripts/public_repo_guard.py --scan-history
```
