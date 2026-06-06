# Stage 70: Review Observation Handoff Follow-Up Readiness Answer Source Crosswalk And Static Follow-Up Prompts

Stage 70 adds a deterministic local answer-source crosswalk and static follow-up prompt surface over the Stage 69 answer walkthrough. It keeps the surface local, static, non-actionable, non-persistent, non-executable, non-routing, and non-certifying.

## Contract

- Source builder: `frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.ts`
- View-model wiring: `frontend/src/features/mission-console/consoleViewModel.ts`
- UI surface: `frontend/src/features/mission-console/MissionConsole.tsx`
- Type contract: `frontend/src/features/mission-console/types.ts`
- Compact stage styling: `frontend/src/styles/global.css`

## What The Slice Proves

- Stage 70 crosswalk rows are derived from Stage 69 answer walkthrough steps.
- Static follow-up prompt cards are derived from Stage 69 static review note cards.
- Crosswalk row order matches Stage 69 answer walkthrough step order.
- Static follow-up prompt order matches Stage 69 static review note card order.
- The default Stage 69 answer walkthrough context is carried into the Stage 70 summary context.
- The UI shows the new Stage 70 panel near the Stage 69 answer walkthrough panel without saved answers, saved drafts, saved follow-up prompts, saved walkthrough state, saved review notes, routes, exports, signoff, audit retention, scoring, certification, owner assignment, or command execution.

## Verification

Run the focused checks:

```text
node --experimental-strip-types --test tests/frontend/reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
```

The Stage 70 review flow also depends on the already-completed Stage 69 and upstream Stage 68-64 surfaces, so the broader frontend suite remains the final confidence pass when doing a full closeout.

## Human Test Gate

Open the mission console in fixture mode, find the Stage 70 answer-source crosswalk panel immediately after the Stage 69 answer walkthrough panel, confirm that the crosswalk rows preserve the Stage 69 walkthrough step order, confirm that the static follow-up prompt cards preserve the Stage 69 static review note order, and verify the panel reads as local static review context rather than saved reviewer state.

## Deferred

- Saved reviewer answers, answer drafts, follow-up prompts, walkthrough state, review notes, or persisted local state
- Owner assignment, routes, exports, handoff packages, runnable checklists, command execution, signoff, audit retention, scoring, or certification
- Production auth, cloud deployment, release work, or main-branch fast-forward
