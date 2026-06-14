import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("Stage 116 revision follow-up readiness board derives rows from Stage 115 review path", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 116 helper export to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionCoverageReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath;

  assert.ok(sourceRevisionCoverageReviewPath);

  const readinessBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard(
      sourceRevisionCoverageReviewPath,
    );

  assert.ok(readinessBoard);
  assert.equal(
    readinessBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_review_path_revision_follow_up_readiness_board.v1",
  );
  assert.strictEqual(
    readinessBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath,
    sourceRevisionCoverageReviewPath,
  );
  assert.equal(
    readinessBoard.revisionFollowUpReadinessRows.length,
    sourceRevisionCoverageReviewPath.revisionCoverageReviewPathSteps.length,
  );
  assert.equal(
    readinessBoard.staticResponseCheckCards.length,
    sourceRevisionCoverageReviewPath.staticRevisionFollowUpPromptCards.length,
  );
  assert.deepEqual(
    readinessBoard.revisionFollowUpReadinessRows.map(
      (row) => row.sourceRevisionCoverageReviewPathStepId,
    ),
    sourceRevisionCoverageReviewPath.revisionCoverageReviewPathSteps.map(
      (step) => step.revisionCoverageReviewPathStepId,
    ),
  );
  assert.deepEqual(
    readinessBoard.staticResponseCheckCards.map(
      (card) => card.sourceStaticRevisionFollowUpPromptCardId,
    ),
    sourceRevisionCoverageReviewPath.staticRevisionFollowUpPromptCards.map(
      (card) => card.staticRevisionFollowUpPromptCardId,
    ),
  );
  assert.deepEqual(
    readinessBoard.summary.defaultRevisionFollowUpReadinessContext
      .sourceStage115DefaultRevisionCoverageReviewPathContext,
    sourceRevisionCoverageReviewPath.summary.defaultRevisionCoverageReviewPathContext,
  );

  const firstRow = readinessBoard.revisionFollowUpReadinessRows[0];
  assert.equal(firstRow.revisionFollowUpReadinessRowOrder, 1);
  assert.ok(
    firstRow.revisionFollowUpReadinessText.includes(
      firstRow.sourceRevisionCoverageReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.revisionFollowUpReadinessText.includes(
      firstRow.sourceStaticRevisionFollowUpPromptCardIds[0],
    ),
  );
  assert.ok(
    firstRow.revisionFollowUpReadinessText.includes(
      firstRow.sourceRevisionCoverageRowId,
    ),
  );
  assert.ok(
    firstRow.staticResponseCheckText.includes(
      firstRow.sourceStaticRevisionCheckCardIds[0],
    ),
  );
  assert.ok(
    firstRow.revisionFollowUpReadinessLabels.includes(
      "revision follow-up readiness row",
    ),
  );
  assert.ok(
    firstRow.staticResponseCheckLabels.includes(
      "static response-check carry-forward",
    ),
  );
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedRevisionFollowUpReadinessBoardState,
    true,
  );
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedRevisionFollowUpReadinessSelections,
    true,
  );
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedResponseCheckSelections,
    true,
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerNotes, true);

  const firstResponseCheck = readinessBoard.staticResponseCheckCards[0];
  assert.equal(firstResponseCheck.staticResponseCheckOrder, 1);
  assert.ok(
    firstResponseCheck.staticResponseCheckText.includes(
      firstResponseCheck.sourceStaticRevisionFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstResponseCheck.staticResponseCheckText.includes(
      firstResponseCheck.sourceStaticRevisionCheckCardId,
    ),
  );
  assert.ok(
    firstResponseCheck.staticResponseCheckText.includes(
      firstResponseCheck.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstResponseCheck.staticResponseCheckLabels.includes(
      "static response-check card",
    ),
  );
  assert.equal(
    firstResponseCheck.staticNonGoalFlags.noSavedStaticResponseCheckCards,
    true,
  );
  assert.equal(
    firstResponseCheck.staticNonGoalFlags.noSavedResponseCheckSelections,
    true,
  );
  assert.equal(
    firstResponseCheck.staticNonGoalFlags
      .noSavedStaticRevisionFollowUpPromptCards,
    true,
  );

  assert.strictEqual(
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoard?.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath,
    sourceRevisionCoverageReviewPath,
  );
});
