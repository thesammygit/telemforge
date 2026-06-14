import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 118 response-prompt readiness board derives rows and answer checks from Stage 117", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 118 helper module to exist: ${error.message}`),
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionFollowUpReadinessReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceRevisionFollowUpReadinessReviewPath);

  const readinessBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard(
      sourceRevisionFollowUpReadinessReviewPath,
    );

  assert.ok(readinessBoard);
  assert.equal(
    readinessBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_review_path_revision_follow_up_readiness_board_revision_follow_up_readiness_review_path_response_prompt_readiness_board.v1",
  );
  assert.strictEqual(
    readinessBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath,
    sourceRevisionFollowUpReadinessReviewPath,
  );
  assert.equal(
    readinessBoard.responsePromptReadinessRows.length,
    sourceRevisionFollowUpReadinessReviewPath
      .revisionFollowUpReadinessReviewPathSteps.length,
  );
  assert.equal(
    readinessBoard.staticAnswerCheckCards.length,
    sourceRevisionFollowUpReadinessReviewPath.staticResponsePromptCards.length,
  );
  assert.deepEqual(
    readinessBoard.responsePromptReadinessRows.map(
      (row) => row.sourceRevisionFollowUpReadinessReviewPathStepId,
    ),
    sourceRevisionFollowUpReadinessReviewPath.revisionFollowUpReadinessReviewPathSteps.map(
      (step) => step.revisionFollowUpReadinessReviewPathStepId,
    ),
  );
  assert.deepEqual(
    readinessBoard.staticAnswerCheckCards.map(
      (card) => card.sourceStaticResponsePromptCardId,
    ),
    sourceRevisionFollowUpReadinessReviewPath.staticResponsePromptCards.map(
      (card) => card.staticResponsePromptCardId,
    ),
  );
  assert.deepEqual(
    readinessBoard.summary.defaultResponsePromptReadinessContext
      .sourceStage117DefaultRevisionFollowUpReadinessReviewPathContext,
    sourceRevisionFollowUpReadinessReviewPath.summary
      .defaultRevisionFollowUpReadinessReviewPathContext,
  );

  const firstRow = readinessBoard.responsePromptReadinessRows[0];
  assert.equal(firstRow.responsePromptReadinessRowOrder, 1);
  assert.ok(
    firstRow.responsePromptReadinessText.includes(
      firstRow.sourceRevisionFollowUpReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.responsePromptReadinessText.includes(
      firstRow.sourceStaticResponsePromptCardIds[0],
    ),
  );
  assert.ok(
    firstRow.responsePromptReadinessText.includes(
      firstRow.sourceRevisionFollowUpReadinessRowId,
    ),
  );
  assert.ok(
    firstRow.staticAnswerCheckText.includes(
      firstRow.sourceStaticResponseCheckCardIds[0],
    ),
  );
  assert.ok(
    firstRow.responsePromptReadinessLabels.includes(
      "response-prompt readiness row",
    ),
  );
  assert.ok(
    firstRow.staticAnswerCheckLabels.includes(
      "static answer-check carry-forward",
    ),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedPromptReadinessState, true);
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedPromptReadinessSelections,
    true,
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedAnswerCheckSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedAnswerDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseNotes, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponsePromptSelections, true);

  const firstAnswerCheck = readinessBoard.staticAnswerCheckCards[0];
  assert.equal(firstAnswerCheck.staticAnswerCheckOrder, 1);
  assert.ok(
    firstAnswerCheck.staticAnswerCheckText.includes(
      firstAnswerCheck.sourceStaticResponsePromptCardId,
    ),
  );
  assert.ok(
    firstAnswerCheck.staticAnswerCheckText.includes(
      firstAnswerCheck.sourceStaticResponseCheckCardId,
    ),
  );
  assert.ok(
    firstAnswerCheck.staticAnswerCheckText.includes(
      firstAnswerCheck.sourceStaticRevisionFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstAnswerCheck.staticAnswerCheckLabels.includes(
      "static answer-check card",
    ),
  );
  assert.equal(
    firstAnswerCheck.staticNonGoalFlags.noSavedStaticAnswerCheckCards,
    true,
  );
  assert.equal(
    firstAnswerCheck.staticNonGoalFlags.noSavedStaticResponsePromptCards,
    true,
  );
  assert.equal(
    firstAnswerCheck.staticNonGoalFlags.noSavedAnswerCheckSelections,
    true,
  );

  assert.strictEqual(
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard?.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPath,
    sourceRevisionFollowUpReadinessReviewPath,
  );
  assert.ok(missionConsoleSource.includes("Stage 118 response-prompt readiness board"));
  assert.ok(
    missionConsoleSource.includes(
      "Response-prompt readiness board and static answer checks",
    ),
  );
});
