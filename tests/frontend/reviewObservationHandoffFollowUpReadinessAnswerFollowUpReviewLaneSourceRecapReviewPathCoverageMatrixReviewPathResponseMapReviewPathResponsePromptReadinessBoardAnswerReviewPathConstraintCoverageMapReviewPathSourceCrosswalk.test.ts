import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 82 constraint-response source crosswalk and static review checks from Stage 81", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const constraintResponseReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath;
  const sourceCrosswalk =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(constraintResponseReviewPath);
  assert.ok(sourceCrosswalk);
  assert.strictEqual(
    sourceCrosswalk.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath,
    constraintResponseReviewPath,
  );
  assert.equal(
    sourceCrosswalk.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk.v1",
  );
  assert.equal(sourceCrosswalk.version, 1);
  assert.equal(
    sourceCrosswalk.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source crosswalk and static review checks",
  );
  assert.equal(sourceCrosswalk.localStatus, "fixture");
  assert.deepEqual(
    sourceCrosswalk.summary.defaultSourceCheckContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathDefaultContext,
    constraintResponseReviewPath.summary.defaultConstraintResponseReviewContext,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.sourceCrosswalkRowCount,
    constraintResponseReviewPath.constraintResponseReviewPathSteps.length,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.staticReviewCheckCardCount,
    constraintResponseReviewPath.staticResponseReviewPromptCards.length,
  );
  assert.deepEqual(
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.sourceCrosswalkRowOrder,
      row.sourceConstraintResponseReviewPathStepId,
      row.sourceStaticResponseReviewPromptCardIds,
      row.sourceConstraintCoverageRowId,
      row.sourceStaticResponseNotePromptCardIds,
      row.sourceAnswerReviewPathStepId,
      row.sourceStaticConstraintNoteCardIds,
      row.sourceStaticAnswerCheckCardId,
      row.sourceResponsePromptReadinessRowIds,
      row.sourceStaticResponsePromptCardIds,
      row.sourceResponseMapReviewPathStepId,
      row.sourceResponseMapRowId,
      row.sourceResponseMapStaticFollowUpPromptCardIds,
      row.sourceCoverageReviewPathStepId,
      row.sourceCoverageMatrixRowId,
      row.sourceReviewPathStepId,
      row.sourceSourceRecapRowId,
      row.sourceAnswerFollowUpReviewLaneRowId,
      row.sourceAnswerSourceCrosswalkRowId,
      row.sourceAnswerWalkthroughStepId,
      row.sourceAnswerCoverageRowId,
      row.sourceRehearsalPathStepId,
      row.sourceReviewBoardRowId,
      row.followUpReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.constraintResponseReviewPathLabels,
      row.sourceCrosswalkLabels,
      row.staticResponseReviewPromptText,
      row.sourceCrosswalkText,
      row.staticReviewCheckText,
    ]),
    constraintResponseReviewPath.constraintResponseReviewPathSteps.map((step) => [
      step.constraintResponseReviewPathStepOrder,
      step
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
      step.sourceStaticResponseNotePromptCardIds.map(
        (promptId) =>
          constraintResponseReviewPath.staticResponseReviewPromptCards.find(
            (card) => card.sourceStaticResponseNotePromptCardId === promptId,
          )
            ?.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
      ),
      step.sourceConstraintCoverageRowId,
      step.sourceStaticResponseNotePromptCardIds,
      step.sourceAnswerReviewPathStepId,
      step.sourceStaticConstraintNoteCardIds,
      step.sourceStaticAnswerCheckCardId,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceStaticResponsePromptCardIds,
      step.sourceResponseMapReviewPathStepId,
      step.sourceResponseMapRowId,
      step.sourceResponseMapStaticFollowUpPromptCardIds,
      step.sourceCoverageReviewPathStepId,
      step.sourceCoverageMatrixRowId,
      step.sourceReviewPathStepId,
      step.sourceSourceRecapRowId,
      step.sourceAnswerFollowUpReviewLaneRowId,
      step.sourceAnswerSourceCrosswalkRowId,
      step.sourceAnswerWalkthroughStepId,
      step.sourceAnswerCoverageRowId,
      step.sourceRehearsalPathStepId,
      step.sourceReviewBoardRowId,
      step.followUpReadinessBriefRowId,
      step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.constraintResponseReviewPathLabels,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintResponseReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
      )?.sourceCrosswalkLabels,
      step.staticResponseReviewPromptText,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintResponseReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
      )?.sourceCrosswalkText,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintResponseReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
      )?.staticReviewCheckText,
    ]),
  );
  assert.deepEqual(
    sourceCrosswalk.staticReviewCheckCards.map((card) => [
      card.staticReviewCheckOrder,
      card.sourceStaticResponseReviewPromptCardId,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceConstraintResponseReviewPathStepIds,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponseMapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticResponseReviewPromptLabels,
      card.staticReviewCheckLabels,
      card.staticResponseReviewPromptText,
      card.staticReviewCheckText,
    ]),
    constraintResponseReviewPath.staticResponseReviewPromptCards.map((promptCard) => [
      promptCard.staticResponseReviewPromptOrder,
      promptCard
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
      promptCard.sourceStaticResponseNotePromptCardId,
      promptCard.sourceConstraintResponseReviewPathStepIds,
      promptCard.sourceResponsePromptReadinessRowId,
      promptCard.sourceStaticResponsePromptCardId,
      promptCard.sourceResponseMapRowIds,
      promptCard.sourceLocalAnchorHrefs,
      promptCard.evidenceCallbackIds,
      promptCard.gapDiscussionPointIds,
      promptCard.deferredScopeReminderIds,
      promptCard.staticResponseReviewPromptLabels,
      sourceCrosswalk.staticReviewCheckCards.find(
        (card) =>
          card.sourceStaticResponseReviewPromptCardId ===
          promptCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
      )?.staticReviewCheckLabels,
      promptCard.staticResponseReviewPromptText,
      sourceCrosswalk.staticReviewCheckCards.find(
        (card) =>
          card.sourceStaticResponseReviewPromptCardId ===
          promptCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
      )?.staticReviewCheckText,
    ]),
  );
  assert.ok(
    sourceCrosswalk.sourceCrosswalkRows.every(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId.length > 0 &&
        row.sourceCrosswalkLabels.includes(
          "constraint-response source crosswalk row",
        ) &&
        row.sourceCrosswalkLabels.includes("static review-check source chain") &&
        row.sourceCrosswalkText.includes(
          row.sourceConstraintResponseReviewPathStepId,
        ) &&
        row.sourceCrosswalkText.includes(row.sourceConstraintCoverageRowId) &&
        row.staticReviewCheckText.includes(
          row.sourceConstraintResponseReviewPathStepId,
        ) &&
        row.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        row.staticNonGoalFlags.noSavedSourceSelections &&
        row.staticNonGoalFlags.noSavedResponseReviewState &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.ok(
    sourceCrosswalk.staticReviewCheckCards.every(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId.length > 0 &&
        card.staticReviewCheckLabels.includes("static review-check card") &&
        card.staticReviewCheckLabels.includes(
          "response-review prompt source check",
        ) &&
        card.staticReviewCheckText.includes(
          card.sourceStaticResponseReviewPromptCardId,
        ) &&
        card.staticReviewCheckText.includes(
          card.sourceResponsePromptReadinessRowId,
        ) &&
        card.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedResponseReviewState &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.match(
    missionConsoleSource,
    /Stage 82 constraint-response source crosswalk/,
  );
  assert.match(missionConsoleSource, /No saved source-crosswalk state/);
});
