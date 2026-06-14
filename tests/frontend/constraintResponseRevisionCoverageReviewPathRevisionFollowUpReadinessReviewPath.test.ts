import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 117 revision follow-up readiness review path derives steps from Stage 116 readiness rows", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 117 helper module to exist: ${error.message}`),
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionFollowUpReadinessBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceRevisionFollowUpReadinessBoard);

  const reviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath(
      sourceRevisionFollowUpReadinessBoard,
    );

  assert.ok(reviewPath);
  assert.equal(
    reviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_review_path_revision_follow_up_readiness_board_revision_follow_up_readiness_review_path.v1",
  );
  assert.strictEqual(
    reviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard,
    sourceRevisionFollowUpReadinessBoard,
  );
  assert.equal(
    reviewPath.revisionFollowUpReadinessReviewPathSteps.length,
    sourceRevisionFollowUpReadinessBoard.revisionFollowUpReadinessRows.length,
  );
  assert.equal(
    reviewPath.staticResponsePromptCards.length,
    sourceRevisionFollowUpReadinessBoard.staticResponseCheckCards.length,
  );
  assert.deepEqual(
    reviewPath.revisionFollowUpReadinessReviewPathSteps.map(
      (step) => step.sourceRevisionFollowUpReadinessRowId,
    ),
    sourceRevisionFollowUpReadinessBoard.revisionFollowUpReadinessRows.map(
      (row) => row.revisionFollowUpReadinessRowId,
    ),
  );
  assert.deepEqual(
    reviewPath.staticResponsePromptCards.map(
      (card) => card.sourceStaticResponseCheckCardId,
    ),
    sourceRevisionFollowUpReadinessBoard.staticResponseCheckCards.map(
      (card) => card.staticResponseCheckCardId,
    ),
  );
  assert.deepEqual(
    reviewPath.summary.defaultRevisionFollowUpReadinessReviewPathContext
      .sourceStage116DefaultRevisionFollowUpReadinessContext,
    sourceRevisionFollowUpReadinessBoard.summary
      .defaultRevisionFollowUpReadinessContext,
  );

  const firstStep = reviewPath.revisionFollowUpReadinessReviewPathSteps[0];
  assert.equal(firstStep.revisionFollowUpReadinessReviewPathStepOrder, 1);
  assert.ok(
    firstStep.revisionFollowUpReadinessReviewPathText.includes(
      firstStep.sourceRevisionFollowUpReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.revisionFollowUpReadinessReviewPathText.includes(
      firstStep.sourceStaticResponseCheckCardIds[0],
    ),
  );
  assert.ok(
    firstStep.responsePromptText.includes(
      firstStep.sourceStaticRevisionFollowUpPromptCardIds[0],
    ),
  );
  assert.ok(
    firstStep.revisionFollowUpReadinessReviewPathLabels.includes(
      "revision follow-up readiness review-path step",
    ),
  );
  assert.ok(
    firstStep.staticResponsePromptLabels.includes(
      "static response-prompt carry-forward",
    ),
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedRevisionFollowUpReadinessReviewPathState,
    true,
  );
  assert.equal(
    firstStep.staticNonGoalFlags
      .noSavedRevisionFollowUpReadinessReviewPathSelections,
    true,
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponsePromptSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstPrompt = reviewPath.staticResponsePromptCards[0];
  assert.equal(firstPrompt.staticResponsePromptOrder, 1);
  assert.ok(
    firstPrompt.responsePromptText.includes(
      firstPrompt.sourceStaticResponseCheckCardId,
    ),
  );
  assert.ok(
    firstPrompt.responsePromptText.includes(
      firstPrompt.sourceRevisionFollowUpReadinessRowIds[0],
    ),
  );
  assert.ok(
    firstPrompt.staticResponsePromptLabels.includes(
      "static response-prompt card",
    ),
  );
  assert.equal(
    firstPrompt.staticNonGoalFlags.noSavedStaticResponsePromptCards,
    true,
  );
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedResponsePromptState, true);
  assert.equal(
    firstPrompt.staticNonGoalFlags.noSavedResponsePromptSelections,
    true,
  );

  assert.strictEqual(
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath?.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard,
    sourceRevisionFollowUpReadinessBoard,
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 117 revision follow-up readiness review path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Revision follow-up readiness review path and static response prompts",
    ),
  );
});
