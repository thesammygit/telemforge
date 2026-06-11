# Stage 107 Evidence Check Review Path Slice

## Contract

Stage 107 adds a deterministic local evidence-check review path over the Stage
106 source citation-review lane. Evidence-check review path steps derive from
Stage 106 static evidence-check prompt cards, and static citation-gap cue cards
derive from Stage 106 citation-review lane rows. The surface is static,
fixture-first, read-only, in-page, local-only, non-persistent, non-executable,
non-routing, non-ranking, and non-certifying.

The slice is manual review context only. It does not save reviewer answers,
answer drafts, reviewer notes, response notes, source selections, citation
selections, evidence-check selections, evidence-check review state, local
storage, audit or signoff records, owner assignments, meeting workflow, exports,
handoff packages, task launchers, runnable checklists, scores, certifications,
command execution, credentials, or production handoff state.

## Source Files

- `frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts`
- `frontend/src/features/mission-console/types.ts`
- `frontend/src/features/mission-console/consoleViewModel.ts`
- `frontend/src/features/mission-console/MissionConsole.tsx`
- `tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts`
- `tests/frontend/consoleViewModel.test.ts`

## Verification Commands

```text
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.test.ts
node --experimental-strip-types --test tests/frontend/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.test.ts
node --experimental-strip-types --test tests/frontend/consoleViewModel.test.ts
npm --prefix frontend run test
python3 scripts/public_repo_guard.py --scan-history
```

## Human Test Gate

Open the mission console in fixture mode, find the Stage 107 evidence-check
review path immediately after Stage 106, and confirm evidence-check review path
step order matches Stage 106 static evidence-check prompt card order. Confirm
static citation-gap cue card order matches Stage 106 citation-review lane row
order. Confirm the default review context mirrors the Stage 106 default
citation-review context. Follow local anchors in-page and verify the panel
remains static manual review context with no saved answers, drafts, selections,
state, routes, exports, signoff, scoring, owner assignment, meeting workflow,
runnable checklist, task launcher, or command execution behavior.

## Deferred Production Features

Persisted reviewer answers, reviewer notes, source, citation, or evidence-check
selections, evidence-check review state, exports, handoff packages, audit
retention, owner assignment, meeting workflows, scoring, certification, route
changes, command execution, auth, cloud integration, deploy, release, and
production handoff state remain explicitly out of scope.
