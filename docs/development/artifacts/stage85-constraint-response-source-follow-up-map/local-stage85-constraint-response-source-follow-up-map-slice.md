# Stage 85 Constraint Response Source Follow-Up Map Slice

Task ID: `telemforge-stage85-constraint-response-source-follow-up-map-start-2026-06-07`

## Summary

Stage 85 adds a deterministic local source follow-up map and static
citation-check prompt surface over the completed Stage 84 source-review
readiness lane. The mission console can now show which Stage 84 readiness rows
and static source-follow-up cue cards should be inspected before reviewers
draft outside the app.

## Source Derivation

- Source follow-up map entries derive from Stage 84 source-readiness lane rows.
- Static citation-check prompt cards derive from Stage 84 static source
  follow-up cue cards.
- Follow-up map entry order preserves Stage 84 source-readiness lane row order.
- Citation-check prompt card order preserves Stage 84 static source-follow-up
  cue card order.
- Default follow-up context carries the Stage 84 default source-readiness
  context.

## Local Boundary

The slice is static, local, deterministic, in-page, informational,
non-actionable, non-persistent, non-executable, non-routing, non-ranking, and
non-certifying. It does not add saved reviewer answers, answer drafts, reviewer
notes, response notes, source selections, citation selections,
source-follow-up state, citation-check state, local storage, routes, exports,
signoff, owner assignment, scoring, ranking, certification, meeting workflow,
handoff packages, runnable checklists, task launchers, command execution,
auth, cloud, deploy, release, or production handoff behavior.

## Implementation

- `frontend/src/lib/constraintResponseSourceFollowUpMap.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `frontend/src/styles/global.css`
- `tests/frontend/constraintResponseSourceFollowUpMap.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification Note

The focused Stage 85 test uses the short queued filename
`tests/frontend/constraintResponseSourceFollowUpMap.test.ts`. Shared mission
console coverage confirms the Stage 85 panel remains exposed through
`buildMissionConsoleView` and derives from the Stage 84 source-readiness lane.
