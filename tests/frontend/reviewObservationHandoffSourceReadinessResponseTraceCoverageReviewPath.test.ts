import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath derives ordered review steps from Stage 59 coverage rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverageBoard =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageBoard;
  const reviewPath =
    buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath(
      coverageBoard,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(coverageBoard);
  assert.ok(reviewPath);
  assert.equal(
    reviewPath.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_review_path.v1",
  );
  assert.equal(reviewPath.version, 1);
  assert.equal(
    reviewPath.contractLabel,
    "local deterministic observation handoff source readiness response trace coverage review path and static handoff prompts",
  );
  assert.equal(reviewPath.localStatus, "fixture");
  assert.strictEqual(
    reviewPath.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
    coverageBoard,
  );
  assert.deepEqual(reviewPath.summary.defaultCoverageReviewPathContext, {
    defaultReviewPathStepId:
      reviewPath.defaultReviewPathStep
        .sourceReadinessResponseTraceCoverageReviewPathStepId,
    defaultCoverageRowId:
      coverageBoard.summary.defaultCoverageContext.defaultCoverageRowId,
    defaultTraceRowId:
      coverageBoard.summary.defaultCoverageContext.defaultTraceRowId,
    defaultResponseTraceRowId:
      reviewPath.defaultReviewPathStep.sourceReadinessResponseTraceRowId,
    defaultStaticHandoffPromptCardId:
      reviewPath.defaultStaticHandoffPromptCard
        .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    defaultGapNoteCardId:
      reviewPath.defaultStaticHandoffPromptCard
        .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    defaultSourceAlignmentNoteCardId:
      reviewPath.defaultStaticHandoffPromptCard
        .sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    sourceReadinessResponseTraceCoverageBoardSummary:
      coverageBoard.summary.summary,
    sourceReadinessResponseTraceCoverageBoardDefaultContext:
      coverageBoard.summary.defaultCoverageContext,
  });
  assert.deepEqual(
    reviewPath.reviewPathSteps.map((step) => [
      step.reviewPathOrder,
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
      step.sourceLocalAnchorHrefs,
      step.sourceAnchorTargetIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.responseNoteCue,
      step.reviewerCueText,
      step.coverageNoteText,
      step.gapNoteText,
      step.staticHandoffPromptText,
    ]),
    coverageBoard.coverageRows.map((row) => {
      const matchedGapNoteCards = coverageBoard.staticGapNoteCards.filter(
        (card) =>
          row.matchedSourceAlignmentNoteCardIds.includes(
            card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
          ),
      );

      return [
        row.coverageOrder,
        row.sourceReadinessResponseTraceCoverageRowId,
        [row.sourceReadinessResponseTraceCoverageRowId],
        row.sourceReadinessResponseTraceRowId,
        row.sourceReadinessResponseTraceRowIds,
        row.sourceReadinessResponseWalkthroughStepId,
        row.sourceReadinessResponseWalkthroughStepIds,
        row.sourceReadinessResponseRowId,
        row.sourceReadinessResponseRowIds,
        row.sourceReadinessQuestionRowId,
        row.sourceReadinessQuestionRowIds,
        row.matchedSourceAlignmentNoteCardIds,
        matchedGapNoteCards.map(
          (card) =>
            card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        ),
        row.matchedStaticEvidenceNoteRowIds,
        row.matchedStaticFollowUpPromptRowIds,
        row.sourceLocalAnchorHrefs,
        row.sourceAnchorTargetIds,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.responseNoteCue,
        row.reviewerCueText,
        row.coverageNoteText,
        matchedGapNoteCards.map((card) => card.gapNoteText).join(" ") ||
          "No matched static gap note card is available for this coverage row.",
        `Handoff prompt for ${row.sourceReadinessResponseTraceCoverageRowId}: inspect anchors ${row.sourceAnchorTargetIds.join(", ")}, evidence callbacks ${row.evidenceCallbackIds.join(", ")}, gap prompts ${row.gapDiscussionPointIds.join(", ")}, deferred reminders ${row.deferredScopeReminderIds.join(", ")}, source alignment notes ${row.matchedSourceAlignmentNoteCardIds.join(", ") || "none"}, and static gap notes ${matchedGapNoteCards.map((card) => card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId).join(", ") || "none"} as static review context only.`,
      ];
    }),
  );
  assert.deepEqual(
    reviewPath.staticHandoffPromptCards.map((card) => [
      card.handoffPromptOrder,
      card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
      card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds,
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds,
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
    ]),
    coverageBoard.staticGapNoteCards.map((card) => {
      const matchedCoverageRows = coverageBoard.coverageRows.filter((row) =>
        row.matchedSourceAlignmentNoteCardIds.includes(
          card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        ),
      );

      return [
        card.gapNoteOrder,
        card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        [card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId],
        card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds,
        matchedCoverageRows.map(
          (row) => row.sourceReadinessResponseTraceCoverageRowId,
        ),
        card.matchedResponseTraceRowIds,
        card.matchedResponseRowIds,
        card.matchedQuestionRowIds,
        card.sourceReadinessStaticEvidenceNoteRowIds,
        card.sourceReadinessStaticFollowUpPromptRowIds,
        card.sourceLocalAnchorHrefs,
        card.sourceAnchorTargetIds,
        card.localAnchorHref,
        card.anchorTargetId,
        card.evidenceCallbackIds,
        card.gapDiscussionPointIds,
        card.deferredScopeReminderIds,
        card.cueText,
        card.gapNoteText,
        `Handoff prompt ${card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId}: discuss ${card.cueText} with trace rows ${card.matchedResponseTraceRowIds.join(", ") || "none"}, coverage rows ${matchedCoverageRows.map((row) => row.sourceReadinessResponseTraceCoverageRowId).join(", ") || "none"}, anchors ${card.sourceAnchorTargetIds.join(", ")}, callbacks ${card.evidenceCallbackIds.join(", ")}, gap prompts ${card.gapDiscussionPointIds.join(", ")}, and deferred reminders ${card.deferredScopeReminderIds.join(", ")} as a static handoff prompt only.`,
      ];
    }),
  );
  assert.equal(
    reviewPath.summary.counts.reviewPathStepCount,
    coverageBoard.coverageRows.length,
  );
  assert.equal(
    reviewPath.summary.counts.staticHandoffPromptCardCount,
    coverageBoard.staticGapNoteCards.length,
  );
  assert.ok(
    reviewPath.reviewPathSteps.every(
      (step) =>
        step.staticHandoffPromptText.includes(
          step.sourceReadinessResponseTraceCoverageRowId,
        ) &&
        step.gapNoteText.includes(step.sourceReadinessResponseTraceRowId) &&
        step.localOnly &&
        step.sourceBacked &&
        step.inPageOnly &&
        step.explanatoryOnly &&
        step.staticOnly &&
        step.informationalOnly &&
        step.nonActionable &&
        step.nonPersistent &&
        step.nonExecutable &&
        step.nonRouting &&
        step.nonCertifying &&
        step.nonRanking &&
        step.notATask &&
        step.notATicket &&
        step.notAChecklist &&
        step.notOwnerAssigned &&
        step.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageReviewProgress &&
        step.staticNonGoalFlags.noSavedCoverageReviewProgress &&
        step.staticNonGoalFlags.noSavedCoverageProgress &&
        step.staticNonGoalFlags.noSavedHandoffPromptEdits &&
        step.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceCoverageProgress &&
        step.staticNonGoalFlags.noSavedTraceCoverageProgress &&
        step.staticNonGoalFlags.noSavedGapNotes &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        step.staticNonGoalFlags.noSavedSourceInspectionState &&
        step.staticNonGoalFlags.noSavedAnchorState &&
        step.staticNonGoalFlags.noSavedRelayProgress &&
        step.staticNonGoalFlags.noPersistence &&
        step.staticNonGoalFlags.noRouteChanges &&
        step.staticNonGoalFlags.noCommandExecution &&
        step.staticNonGoalFlags.noExports &&
        step.staticNonGoalFlags.noSignoff &&
        step.staticNonGoalFlags.noAuditRetention &&
        step.staticNonGoalFlags.noOwnerAssignment &&
        step.staticNonGoalFlags.noScoring &&
        step.staticNonGoalFlags.noCertification &&
        step.staticNonGoalFlags.noMeetingWorkflow &&
        step.staticNonGoalFlags.noHandoffPackageGeneration &&
        step.staticNonGoalFlags.noTaskLaunchers &&
        step.staticNonGoalFlags.noRunnableChecklists,
    ),
  );
  assert.ok(
    reviewPath.staticHandoffPromptCards.every(
      (card) =>
        card.handoffPromptText.includes(
          card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
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
      "Stage 60 source readiness response trace coverage review path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "No saved coverage review progress",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-source-readiness-response-trace-coverage-review-path",
    ),
  );
});
