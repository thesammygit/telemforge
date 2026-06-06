# Stage 67: Review Observation Handoff Follow-Up Readiness Rehearsal Path

## Goal

Turn the completed Stage 66 follow-up readiness review board into a
deterministic local readiness rehearsal path and static answer-prep prompts
surface so a reviewer can step through board rows, static question prompt
cards, Stage 65 brief references, Stage 64 triage references, default review
board context, source anchors, evidence callbacks, gap discussion prompts,
deferred-scope reminders, follow-up notes, static reviewer prompts, static
question prompts, and manual static answer-prep prompts in stable order before
human review.

This slice is local, read-only, fixture-first, non-persistent,
non-executable, non-routing, non-ranking, and non-certifying. It does not add
saved reviewer answers, saved answer drafts, saved rehearsal state, saved
review board state, saved question prompt state, saved readiness brief state,
saved triage state, saved prompt state, saved notes, saved gap notes, saved
handoff prompt edits, saved source readiness progress, owner assignment,
routes, exports, signoff, audit retention, scoring, certification, meeting
workflow, handoff packages, runnable checklists, task launchers, or command
execution.

## Source Files

- [`frontend/src/lib/reviewObservationHandoffFollowUpReadinessRehearsalPath.ts`](../../../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessRehearsalPath.ts)
- [`frontend/src/features/mission-console/types.ts`](../../../../frontend/src/features/mission-console/types.ts)
- [`frontend/src/features/mission-console/consoleViewModel.ts`](../../../../frontend/src/features/mission-console/consoleViewModel.ts)
- [`frontend/src/features/mission-console/MissionConsole.tsx`](../../../../frontend/src/features/mission-console/MissionConsole.tsx)
- [`frontend/src/styles/global.css`](../../../../frontend/src/styles/global.css)
- [`tests/frontend/reviewObservationHandoffFollowUpReadinessRehearsalPath.test.ts`](../../../../tests/frontend/reviewObservationHandoffFollowUpReadinessRehearsalPath.test.ts)
- [`tests/frontend/consoleViewModel.test.ts`](../../../../tests/frontend/consoleViewModel.test.ts)

## Verification

The Stage 67 slice should be verified with:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessRehearsalPath.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessReviewBoard.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessBrief.test.ts
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
git diff --check
git diff --cached --check
python3 scripts/public_repo_guard.py --scan-history
```

## Human Test Gate

A reviewer should be able to:

1. open the mission console in fixture mode;
2. find the Stage 67 readiness rehearsal path near the Stage 66 readiness
   review board panel;
3. confirm rehearsal path step order preserves Stage 66 board row order;
4. confirm static answer-prep prompt order preserves Stage 66 static question
   prompt card order;
5. confirm the default rehearsal context carries the Stage 66 default review
   board context;
6. follow local anchor links in-page;
7. confirm the panel is static manual-review context only and does not become
   saved reviewer answers, saved answer drafts, saved rehearsal state, saved
   review board state, saved question prompt state, saved readiness brief
   state, saved prompt state, saved notes, saved gap notes, saved handoff
   prompt edits, saved source readiness progress, route changes, exports,
   signoff, audit retention, scoring, certification, owner assignment, meeting
   workflow, handoff package generation, runnable checklist behavior, task
   launcher behavior, or command execution.

## Deferred Production Features

- no production authentication or collaboration identity;
- no persistence, local storage, saved reviewer answers, saved answer drafts,
  or saved rehearsal progress;
- no ticketing, messaging, report authoring, report export, or handoff
  package generation;
- no owner assignment, signoff, audit retention, scoring, ranking, or
  certification;
- no shell panel, command runner, runnable checklist, or executable workflow;
- no broad routing changes or app-wide navigation shell;
- no deploy, release, publish, cloud, telemetry upload, or paid API use.

## Visual Proof

This run should create a sanitized local automation demo under
`docs/automation/demos/` after focused verification.
