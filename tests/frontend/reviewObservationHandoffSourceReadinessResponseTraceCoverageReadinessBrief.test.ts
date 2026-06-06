import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief derives ordered readiness rows from Stage 60 review path steps", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reviewPath =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath;
  const readinessBrief =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessBrief(
      reviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(reviewPath);
  assert.ok(readinessBrief);
  assert.equal(
    readinessBrief.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_brief.v1",
  );
  assert.equal(readinessBrief.version, 1);
  assert.equal(
    readinessBrief.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage readiness brief and static reviewer cues",
  );
  assert.equal(readinessBrief.localStatus, "fixture");
  assert.strictEqual(
    readinessBrief.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath,
    reviewPath,
  );
  assert.deepEqual(readinessBrief.summary.defaultReadinessBriefContext, {
    defaultReadinessBriefRowId:
      readinessBrief.defaultReadinessBriefRow
        .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    defaultReviewPathStepId:
      reviewPath.summary.defaultCoverageReviewPathContext
        .defaultReviewPathStepId,
    defaultCoverageRowId:
      reviewPath.summary.defaultCoverageReviewPathContext.defaultCoverageRowId,
    defaultTraceRowId:
      reviewPath.summary.defaultCoverageReviewPathContext.defaultTraceRowId,
    defaultResponseTraceRowId:
      readinessBrief.defaultReadinessBriefRow
        .sourceReadinessResponseTraceRowId,
    defaultStaticReviewerCueCardId:
      readinessBrief.defaultStaticReviewerCueCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    defaultStaticHandoffPromptCardId:
      readinessBrief.defaultStaticReviewerCueCard
        .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    defaultGapNoteCardId:
      readinessBrief.defaultStaticReviewerCueCard
        .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    sourceReadinessResponseTraceCoverageReviewPathSummary:
      reviewPath.summary.summary,
    sourceReadinessResponseTraceCoverageReviewPathDefaultContext:
      reviewPath.summary.defaultCoverageReviewPathContext,
  });
  assert.deepEqual(
    readinessBrief.readinessBriefRows.map((row) => [
      row.readinessBriefOrder,
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      row.sourceReadinessResponseTraceCoverageReviewPathStepIds,
      row.sourceReadinessResponseTraceCoverageRowId,
      row.sourceReadinessResponseTraceCoverageRowIds,
      row.sourceReadinessResponseTraceRowId,
      row.sourceReadinessResponseTraceRowIds,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseWalkthroughStepIds,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessResponseRowIds,
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      row.matchedSourceAlignmentNoteCardIds,
      row.matchedStaticGapNoteCardIds,
      row.matchedStaticEvidenceNoteRowIds,
      row.matchedStaticFollowUpPromptRowIds,
      row.matchedStaticHandoffPromptCardIds,
      row.sourceLocalAnchorHrefs,
      row.sourceAnchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responseNoteCue,
      row.reviewerCueText,
      row.coverageNoteText,
      row.gapNoteText,
      row.handoffPromptText,
      row.readinessBriefText,
    ]),
    reviewPath.reviewPathSteps.map((step) => {
      const matchedHandoffPromptCards =
        reviewPath.staticHandoffPromptCards.filter(
          (card) =>
            card.matchedCoverageRowIds.includes(
              step.sourceReadinessResponseTraceCoverageRowId,
            ) ||
            step.matchedStaticGapNoteCardIds.includes(
              card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
            ),
        );

      return [
        step.reviewPathOrder,
        step.sourceReadinessResponseTraceCoverageReviewPathStepId,
        [step.sourceReadinessResponseTraceCoverageReviewPathStepId],
        step.sourceReadinessResponseTraceCoverageRowId,
        step.sourceReadinessResponseTraceCoverageRowIds,
        step.sourceReadinessResponseTraceRowId,
        step.sourceReadinessResponseTraceRowIds,
        step.sourceReadinessResponseWalkthroughStepId,
        step.sourceReadinessResponseWalkthroughStepIds,
        step.sourceReadinessResponseRowId,
        step.sourceReadinessResponseRowIds,
        step.sourceReadinessQuestionRowId,
        step.sourceReadinessQuestionRowIds,
        step.matchedSourceAlignmentNoteCardIds,
        step.matchedStaticGapNoteCardIds,
        step.matchedStaticEvidenceNoteRowIds,
        step.matchedStaticFollowUpPromptRowIds,
        matchedHandoffPromptCards.map(
          (card) =>
            card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        ),
        step.sourceLocalAnchorHrefs,
        step.sourceAnchorTargetIds,
        step.evidenceCallbackIds,
        step.gapDiscussionPointIds,
        step.deferredScopeReminderIds,
        step.responseNoteCue,
        step.reviewerCueText,
        step.coverageNoteText,
        step.gapNoteText,
        matchedHandoffPromptCards.map((card) => card.handoffPromptText).join(
          " ",
        ) || step.staticHandoffPromptText,
        `Readiness brief for ${step.sourceReadinessResponseTraceCoverageReviewPathStepId}: inspect review path step ${step.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${step.sourceReadinessResponseTraceCoverageRowId}, static handoff prompts ${matchedHandoffPromptCards.map((card) => card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId).join(", ") || "none"}, anchors ${step.sourceAnchorTargetIds.join(", ")}, callbacks ${step.evidenceCallbackIds.join(", ")}, gap prompts ${step.gapDiscussionPointIds.join(", ")}, and deferred reminders ${step.deferredScopeReminderIds.join(", ")} as a static readiness brief only.`,
      ];
    }),
  );
  assert.deepEqual(
    readinessBrief.staticReviewerCueCards.map((card) => [
      card.reviewerCueOrder,
      card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
      card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardIds,
      card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
      card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds,
      card.matchedReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedResponseTraceRowIds,
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.matchedStaticEvidenceNoteRowIds,
      card.matchedStaticFollowUpPromptRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.localAnchorHref,
      card.anchorTargetId,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.cueText,
      card.gapNoteText,
      card.handoffPromptText,
      card.readinessBriefText,
    ]),
    reviewPath.staticHandoffPromptCards.map((handoffPromptCard) => {
      const matchedReviewPathSteps = reviewPath.reviewPathSteps.filter(
        (step) =>
          handoffPromptCard.matchedCoverageRowIds.includes(
            step.sourceReadinessResponseTraceCoverageRowId,
          ) ||
          step.matchedStaticGapNoteCardIds.includes(
            handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
          ),
      );

      return [
        handoffPromptCard.handoffPromptOrder,
        handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        [
          handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        ],
        handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        handoffPromptCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds,
        matchedReviewPathSteps.map(
          (step) =>
            step.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ),
        handoffPromptCard.matchedCoverageRowIds,
        handoffPromptCard.matchedResponseTraceRowIds,
        handoffPromptCard.matchedResponseRowIds,
        handoffPromptCard.matchedQuestionRowIds,
        handoffPromptCard.matchedStaticEvidenceNoteRowIds,
        handoffPromptCard.matchedStaticFollowUpPromptRowIds,
        handoffPromptCard.sourceLocalAnchorHrefs,
        handoffPromptCard.sourceAnchorTargetIds,
        handoffPromptCard.localAnchorHref,
        handoffPromptCard.anchorTargetId,
        handoffPromptCard.evidenceCallbackIds,
        handoffPromptCard.gapDiscussionPointIds,
        handoffPromptCard.deferredScopeReminderIds,
        handoffPromptCard.cueText,
        handoffPromptCard.gapNoteText,
        handoffPromptCard.handoffPromptText,
        `Reviewer cue ${handoffPromptCard.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId}: brief matched review path steps ${matchedReviewPathSteps.map((step) => step.sourceReadinessResponseTraceCoverageReviewPathStepId).join(", ") || "none"}, coverage rows ${handoffPromptCard.matchedCoverageRowIds.join(", ") || "none"}, anchors ${handoffPromptCard.sourceAnchorTargetIds.join(", ")}, callbacks ${handoffPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${handoffPromptCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${handoffPromptCard.deferredScopeReminderIds.join(", ")} as a static reviewer cue only.`,
      ];
    }),
  );
  assert.equal(
    readinessBrief.summary.counts.readinessBriefRowCount,
    reviewPath.reviewPathSteps.length,
  );
  assert.equal(
    readinessBrief.summary.counts.staticReviewerCueCardCount,
    reviewPath.staticHandoffPromptCards.length,
  );
  assert.ok(
    readinessBrief.readinessBriefRows.every(
      (row) =>
        row.readinessBriefText.includes(
          row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ) &&
        row.handoffPromptText.includes(row.sourceReadinessResponseTraceRowId) &&
        row.localOnly &&
        row.sourceBacked &&
        row.inPageOnly &&
        row.explanatoryOnly &&
        row.staticOnly &&
        row.informationalOnly &&
        row.nonActionable &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonRouting &&
        row.nonCertifying &&
        row.nonRanking &&
        row.notATask &&
        row.notATicket &&
        row.notAChecklist &&
        row.notOwnerAssigned &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessBriefState &&
        row.staticNonGoalFlags.noSavedReadinessBriefState &&
        row.staticNonGoalFlags.noSavedReviewerCues &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
        row.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        row.staticNonGoalFlags.noSavedCoverageProgress &&
        row.staticNonGoalFlags.noSavedHandoffPromptEdits &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        row.staticNonGoalFlags.noSavedGapNotes &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        row.staticNonGoalFlags.noSavedSourceInspectionState &&
        row.staticNonGoalFlags.noSavedAnchorState &&
        row.staticNonGoalFlags.noSavedRelayProgress &&
        row.staticNonGoalFlags.noPersistence &&
        row.staticNonGoalFlags.noRouteChanges &&
        row.staticNonGoalFlags.noCommandExecution &&
        row.staticNonGoalFlags.noExports &&
        row.staticNonGoalFlags.noSignoff &&
        row.staticNonGoalFlags.noAuditRetention &&
        row.staticNonGoalFlags.noOwnerAssignment &&
        row.staticNonGoalFlags.noScoring &&
        row.staticNonGoalFlags.noCertification &&
        row.staticNonGoalFlags.noMeetingWorkflow &&
        row.staticNonGoalFlags.noHandoffPackageGeneration &&
        row.staticNonGoalFlags.noTaskLaunchers &&
        row.staticNonGoalFlags.noRunnableChecklists,
    ),
  );
  assert.ok(
    readinessBrief.staticReviewerCueCards.every(
      (card) =>
        card.readinessBriefText.includes(
          card.sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        ) &&
        card.handoffPromptText.includes(card.anchorTargetId) &&
        card.localOnly &&
        card.sourceBacked &&
        card.inPageOnly &&
        card.explanatoryOnly &&
        card.staticOnly &&
        card.informationalOnly &&
        card.nonActionable &&
        card.nonPersistent &&
        card.nonExecutable &&
        card.nonRouting &&
        card.nonCertifying &&
        card.nonRanking &&
        card.notATask &&
        card.notATicket &&
        card.notAChecklist &&
        card.notOwnerAssigned &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReadinessBriefState &&
        card.staticNonGoalFlags.noSavedReadinessBriefState &&
        card.staticNonGoalFlags.noSavedReviewerCues &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
        card.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        card.staticNonGoalFlags.noSavedCoverageProgress &&
        card.staticNonGoalFlags.noSavedHandoffPromptEdits &&
        card.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        card.staticNonGoalFlags.noSavedGapNotes &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noPersistence &&
        card.staticNonGoalFlags.noRouteChanges &&
        card.staticNonGoalFlags.noCommandExecution &&
        card.staticNonGoalFlags.noExports &&
        card.staticNonGoalFlags.noSignoff &&
        card.staticNonGoalFlags.noAuditRetention &&
        card.staticNonGoalFlags.noOwnerAssignment &&
        card.staticNonGoalFlags.noScoring &&
        card.staticNonGoalFlags.noCertification &&
        card.staticNonGoalFlags.noMeetingWorkflow &&
        card.staticNonGoalFlags.noHandoffPackageGeneration &&
        card.staticNonGoalFlags.noTaskLaunchers &&
        card.staticNonGoalFlags.noRunnableChecklists,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 61 source readiness response trace coverage readiness",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved readiness brief state"));
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-source-readiness-response-trace-coverage-readiness-brief",
    ),
  );
});
