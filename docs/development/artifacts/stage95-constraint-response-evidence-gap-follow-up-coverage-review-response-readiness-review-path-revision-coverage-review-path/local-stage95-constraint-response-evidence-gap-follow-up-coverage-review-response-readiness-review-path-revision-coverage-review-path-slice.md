# Stage 95 Local Revision Coverage Review Path Slice

## Scope

This slice adds the deterministic local Stage 95 review path over the completed
Stage 94 revision coverage board.

Source-backed runtime files:

- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.ts`
- `frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`

Focused tests:

- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts`
- `tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Contract

The Stage 95 helper builds:

- revision coverage review-path steps from Stage 94 revision coverage rows;
- static revision follow-up prompt cards from Stage 94 static revision-check
  cards;
- default revision coverage review-path context from the Stage 94 default
  revision coverage context;
- explicit Stage 94 through Stage 64 lineage, local anchors, callbacks, gap
  prompts, deferred reminders, labels, follow-up prompt text, local-only flags,
  and static non-goal context.

The mission-console panel is a compact, in-page, read-only review surface near
the Stage 94 panel. It does not add saved reviewer answers, saved answer
drafts, saved revision drafts, saved reviewer notes, saved response notes,
saved response-readiness selections, saved draft-check selections, saved
revision-prompt selections, saved revision coverage selections, saved
revision-check selections, saved revision follow-up selections, saved review
path state, local storage, persistence, route changes, exports, signoff, audit
retention, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, runnable checklists, task launchers, command runners, auth,
cloud, deploy, release, or main-branch integration.

## Human Test Gate

A reviewer should open the mission console in fixture mode, find the Stage 95
revision coverage review path near Stage 94, and confirm:

1. review-path step order mirrors Stage 94 revision coverage row order;
2. static revision follow-up prompt order mirrors Stage 94 static
   revision-check card order;
3. the default revision coverage review-path context mirrors the Stage 94
   default revision coverage context;
4. each review-path step and static follow-up prompt card exposes source ids,
   anchors, callbacks, gap prompts, deferred reminders, labels, prompt text,
   and static non-goal context;
5. anchor links stay in page and no saved state, routes, exports, signoff,
   owner assignment, scoring, certification, meeting workflow, packages,
   runnable checklist behavior, or command execution appears.

## Verification

```text
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 scripts/public_repo_guard.py --scan-history
```
