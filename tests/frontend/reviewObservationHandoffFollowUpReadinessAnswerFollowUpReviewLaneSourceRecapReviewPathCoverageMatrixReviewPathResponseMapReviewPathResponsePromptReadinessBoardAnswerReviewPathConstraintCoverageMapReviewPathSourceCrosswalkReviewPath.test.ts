import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 83 source-crosswalk review path and static source-review prompts from Stage 82", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCrosswalk =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk;
  const sourceCrosswalkReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceCrosswalk);
  assert.ok(sourceCrosswalkReviewPath);
  assert.strictEqual(
    sourceCrosswalkReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk,
    sourceCrosswalk,
  );
  assert.equal(
    sourceCrosswalkReviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path.v1",
  );
  assert.equal(sourceCrosswalkReviewPath.version, 1);
  assert.equal(
    sourceCrosswalkReviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-response source-crosswalk review path and static source-review prompts",
  );
  assert.equal(sourceCrosswalkReviewPath.localStatus, "fixture");
  assert.deepEqual(
    sourceCrosswalkReviewPath.summary.defaultSourceReviewContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkDefaultContext,
    sourceCrosswalk.summary.defaultSourceCheckContext,
  );
  assert.equal(
    sourceCrosswalkReviewPath.summary.counts.sourceReviewPathStepCount,
    sourceCrosswalk.sourceCrosswalkRows.length,
  );
  assert.equal(
    sourceCrosswalkReviewPath.summary.counts.staticSourceReviewPromptCardCount,
    sourceCrosswalk.staticReviewCheckCards.length,
  );
  assert.deepEqual(
    sourceCrosswalkReviewPath.sourceReviewPathSteps.map((step) => [
      step.sourceReviewPathStepOrder,
      step.sourceCrosswalkRowId,
      step.sourceStaticReviewCheckCardIds,
      step.sourceConstraintResponseReviewPathStepId,
      step.sourceStaticResponseReviewPromptCardIds,
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
      step.sourceCrosswalkLabels,
      step.sourceReviewPathLabels,
      step.sourceCrosswalkText,
      step.staticReviewCheckText,
      step.sourceReviewPathText,
      step.staticSourceReviewPromptText,
    ]),
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.sourceCrosswalkRowOrder,
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      sourceCrosswalk.staticReviewCheckCards
        .filter((card) =>
          row.sourceStaticResponseReviewPromptCardIds.includes(
            card.sourceStaticResponseReviewPromptCardId,
          ),
        )
        .map(
          (card) =>
            card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
        ),
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
      row.sourceCrosswalkLabels,
      sourceCrosswalkReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.sourceReviewPathLabels,
      row.sourceCrosswalkText,
      row.staticReviewCheckText,
      sourceCrosswalkReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.sourceReviewPathText,
      sourceCrosswalkReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.staticSourceReviewPromptText,
    ]),
  );
  assert.deepEqual(
    sourceCrosswalkReviewPath.staticSourceReviewPromptCards.map((card) => [
      card.staticSourceReviewPromptOrder,
      card.sourceStaticReviewCheckCardId,
      card.sourceStaticResponseReviewPromptCardId,
      card.sourceSourceCrosswalkReviewPathStepIds,
      card.sourceConstraintResponseReviewPathStepIds,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponseMapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticReviewCheckLabels,
      card.staticSourceReviewPromptLabels,
      card.staticReviewCheckText,
      card.staticSourceReviewPromptText,
    ]),
    sourceCrosswalk.staticReviewCheckCards.map((checkCard) => [
      checkCard.staticReviewCheckOrder,
      checkCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      checkCard.sourceStaticResponseReviewPromptCardId,
      sourceCrosswalkReviewPath.sourceReviewPathSteps
        .filter((step) =>
          step.sourceStaticReviewCheckCardIds.includes(
            checkCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
          ),
        )
        .map(
          (step) =>
            step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
        ),
      checkCard.sourceConstraintResponseReviewPathStepIds,
      checkCard.sourceStaticResponseNotePromptCardId,
      checkCard.sourceResponsePromptReadinessRowId,
      checkCard.sourceStaticResponsePromptCardId,
      checkCard.sourceResponseMapRowIds,
      checkCard.sourceLocalAnchorHrefs,
      checkCard.evidenceCallbackIds,
      checkCard.gapDiscussionPointIds,
      checkCard.deferredScopeReminderIds,
      checkCard.staticReviewCheckLabels,
      sourceCrosswalkReviewPath.staticSourceReviewPromptCards.find(
        (card) =>
          card.sourceStaticReviewCheckCardId ===
          checkCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      )?.staticSourceReviewPromptLabels,
      checkCard.staticReviewCheckText,
      sourceCrosswalkReviewPath.staticSourceReviewPromptCards.find(
        (card) =>
          card.sourceStaticReviewCheckCardId ===
          checkCard.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      )?.staticSourceReviewPromptText,
    ]),
  );
  assert.ok(
    sourceCrosswalkReviewPath.sourceReviewPathSteps.every(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId.length > 0 &&
        step.sourceReviewPathLabels.includes(
          "source-crosswalk review path step",
        ) &&
        step.sourceReviewPathLabels.includes("static source-review prompt carry-forward") &&
        step.sourceReviewPathText.includes(step.sourceCrosswalkRowId) &&
        step.sourceReviewPathText.includes(
          step.sourceConstraintResponseReviewPathStepId,
        ) &&
        step.sourceReviewPathText.includes(step.sourceConstraintCoverageRowId) &&
        step.staticSourceReviewPromptText.includes(step.sourceCrosswalkRowId) &&
        step.staticNonGoalFlags.noSavedSourceReviewState &&
        step.staticNonGoalFlags.noSavedSourceReviewPathState &&
        step.staticNonGoalFlags.noSavedStaticSourceReviewPrompts &&
        step.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        step.staticNonGoalFlags.noSavedSourceSelections &&
        step.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.ok(
    sourceCrosswalkReviewPath.staticSourceReviewPromptCards.every(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId.length > 0 &&
        card.staticSourceReviewPromptLabels.includes(
          "static source-review prompt card",
        ) &&
        card.staticSourceReviewPromptLabels.includes(
          "static review-check carry-forward",
        ) &&
        card.staticSourceReviewPromptText.includes(
          card.sourceStaticReviewCheckCardId,
        ) &&
        card.staticSourceReviewPromptText.includes(
          card.sourceStaticResponseReviewPromptCardId,
        ) &&
        card.staticNonGoalFlags.noSavedSourceReviewState &&
        card.staticNonGoalFlags.noSavedSourceReviewPathState &&
        card.staticNonGoalFlags.noSavedStaticSourceReviewPrompts &&
        card.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.match(
    missionConsoleSource,
    /Stage 83 source-crosswalk review path/,
  );
  assert.match(missionConsoleSource, /No saved source-review state/);
});
