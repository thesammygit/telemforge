import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard derives revision coverage from Stage 93 review path", async () => {
  const {
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 94 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponseReadinessReviewPath =
    view.constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath;

  assert.ok(sourceResponseReadinessReviewPath);

  const revisionCoverageBoard =
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard(
      sourceResponseReadinessReviewPath,
    );

  assert.ok(revisionCoverageBoard);
  assert.equal(
    revisionCoverageBoard.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path_revision_coverage_board.v1",
  );
  assert.strictEqual(
    revisionCoverageBoard.sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath,
    sourceResponseReadinessReviewPath,
  );
  assert.equal(
    revisionCoverageBoard.revisionCoverageRows.length,
    sourceResponseReadinessReviewPath.responseReadinessReviewPathSteps.length,
  );
  assert.equal(
    revisionCoverageBoard.staticRevisionCheckCards.length,
    sourceResponseReadinessReviewPath.staticRevisionPromptCards.length,
  );
  assert.deepEqual(
    revisionCoverageBoard.revisionCoverageRows.map(
      (row) => row.sourceResponseReadinessReviewPathStepId,
    ),
    sourceResponseReadinessReviewPath.responseReadinessReviewPathSteps.map(
      (step) => step.responseReadinessReviewPathStepId,
    ),
  );
  assert.deepEqual(
    revisionCoverageBoard.staticRevisionCheckCards.map(
      (card) => card.sourceStaticRevisionPromptCardId,
    ),
    sourceResponseReadinessReviewPath.staticRevisionPromptCards.map(
      (card) => card.staticRevisionPromptCardId,
    ),
  );
  assert.deepEqual(
    revisionCoverageBoard.summary.defaultRevisionCoverageContext
      .sourceStage93DefaultResponseReadinessReviewContext,
    sourceResponseReadinessReviewPath.summary.defaultResponseReadinessReviewContext,
  );

  const firstRow = revisionCoverageBoard.revisionCoverageRows[0];
  assert.equal(firstRow.revisionCoverageRowOrder, 1);
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceStaticRevisionPromptCardIds[0],
    ),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(firstRow.sourceResponseReadinessRowId),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceCoverageReviewPathStepId,
    ),
  );
  assert.ok(firstRow.revisionCoverageText.includes(firstRow.sourceCoverageRowId));
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.staticRevisionCheckText.includes(
      firstRow.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.revisionCoverageLabels.includes("revision coverage row"),
  );
  assert.ok(
    firstRow.staticRevisionCheckLabels.includes(
      "static revision-check carry-forward",
    ),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionCoverageState, true);
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedRevisionCoverageSelections,
    true,
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseNotes, true);

  const firstRevisionCheck = revisionCoverageBoard.staticRevisionCheckCards[0];
  assert.equal(firstRevisionCheck.staticRevisionCheckOrder, 1);
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticDraftCheckCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticResponseCueCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckLabels.includes(
      "static revision-check card",
    ),
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedStaticRevisionCheckCards,
    true,
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedRevisionCheckState,
    true,
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedStaticRevisionPromptCards,
    true,
  );
});

test("Stage 114 revision coverage board derives rows from Stage 113 review path", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 114 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponseReadinessReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath;

  assert.ok(sourceResponseReadinessReviewPath);

  const revisionCoverageBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard(
      sourceResponseReadinessReviewPath,
    );

  assert.ok(revisionCoverageBoard);
  assert.equal(
    revisionCoverageBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_board.v1",
  );
  assert.strictEqual(
    revisionCoverageBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath,
    sourceResponseReadinessReviewPath,
  );
  assert.equal(
    revisionCoverageBoard.summary.counts.revisionCoverageRowCount,
    sourceResponseReadinessReviewPath.responseReadinessReviewPathSteps.length,
  );
  assert.equal(
    revisionCoverageBoard.summary.counts.staticRevisionCheckCardCount,
    sourceResponseReadinessReviewPath.staticRevisionPromptCards.length,
  );
  assert.deepEqual(
    revisionCoverageBoard.summary.defaultRevisionCoverageContext
      .sourceStage113DefaultResponseReadinessReviewContext,
    sourceResponseReadinessReviewPath.summary.defaultResponseReadinessReviewContext,
  );

  const firstRow = revisionCoverageBoard.revisionCoverageRows[0];
  assert.equal(firstRow.revisionCoverageRowOrder, 1);
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceStaticRevisionPromptCardIds[0],
    ),
  );
  assert.ok(firstRow.staticRevisionCheckText.includes(firstRow.sourceResponseReadinessRowId));
  assert.ok(
    firstRow.staticRevisionCheckText.includes(
      firstRow.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionCoverageState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionPromptState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionDrafts, true);

  const firstRevisionCheck = revisionCoverageBoard.staticRevisionCheckCards[0];
  assert.equal(firstRevisionCheck.staticRevisionCheckOrder, 1);
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticDraftCheckCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticResponseCueCardId,
    ),
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedStaticRevisionCheckCards,
    true,
  );
});
