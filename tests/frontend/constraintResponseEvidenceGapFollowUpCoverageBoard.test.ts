import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseEvidenceGapFollowUpCoverageBoard derives deterministic coverage rows from Stage 89 review path steps", async () => {
  const { buildConstraintResponseEvidenceGapFollowUpCoverageBoard } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageBoard.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 90 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceFollowUpReviewPath =
    view.constraintResponseEvidenceGapFollowUpReviewPath;

  assert.ok(sourceFollowUpReviewPath);

  const evidenceGapFollowUpCoverageBoard =
    buildConstraintResponseEvidenceGapFollowUpCoverageBoard(
      sourceFollowUpReviewPath,
    );

  assert.ok(evidenceGapFollowUpCoverageBoard);
  assert.equal(
    evidenceGapFollowUpCoverageBoard.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_board.v1",
  );
  assert.strictEqual(
    evidenceGapFollowUpCoverageBoard.sourceConstraintResponseEvidenceGapFollowUpReviewPath,
    sourceFollowUpReviewPath,
  );
  assert.equal(
    evidenceGapFollowUpCoverageBoard.coverageRows.length,
    sourceFollowUpReviewPath.followUpReviewPathSteps.length,
  );
  assert.equal(
    evidenceGapFollowUpCoverageBoard.staticReviewPromptCards.length,
    sourceFollowUpReviewPath.staticReadinessCueCards.length,
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.coverageRows.map(
      (row) => row.sourceFollowUpReviewPathStepId,
    ),
    sourceFollowUpReviewPath.followUpReviewPathSteps.map(
      (step) => step.followUpReviewPathStepId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.staticReviewPromptCards.map(
      (card) => card.sourceStaticReadinessCueCardId,
    ),
    sourceFollowUpReviewPath.staticReadinessCueCards.map(
      (card) => card.staticReadinessCueCardId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.summary.defaultCoverageContext
      .sourceStage89DefaultFollowUpReviewContext,
    sourceFollowUpReviewPath.summary.defaultFollowUpReviewContext,
  );

  const firstRow = evidenceGapFollowUpCoverageBoard.coverageRows[0];
  assert.equal(firstRow.coverageRowOrder, 1);
  assert.ok(firstRow.coverageText.includes(firstRow.sourceFollowUpReviewPathStepId));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceStaticReadinessCueCardIds[0]));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceEvidenceGapReadinessRowId));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceStaticFollowUpPromptCardIds[0]));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceEvidenceCheckReviewPathStepId));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceStaticEvidenceCheckPromptCardId));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceCitationReviewLaneRowIds[0]));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceSourceFollowUpMapEntryId));
  assert.ok(firstRow.coverageLabels.includes("evidence-gap follow-up coverage row"));
  assert.ok(
    firstRow.staticReviewPromptLabels.includes("static review prompt context"),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedCoverageBoardState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCoverageBoardSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapFollowUpSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstPrompt = evidenceGapFollowUpCoverageBoard.staticReviewPromptCards[0];
  assert.equal(firstPrompt.staticReviewPromptOrder, 1);
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticReadinessCueCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticCitationGapCueCardId,
    ),
  );
  assert.ok(firstPrompt.staticReviewPromptLabels.includes("static review prompt card"));
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedStaticReviewPromptCards, true);
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedCoverageBoardState, true);
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedCitationSelections, true);
});

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard derives Stage 110 coverage from Stage 109", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 110 helper export to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceFollowUpReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath;
  const evidenceGapFollowUpCoverageBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard;
  const builtEvidenceGapFollowUpCoverageBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard(
      sourceFollowUpReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceFollowUpReviewPath);
  assert.ok(evidenceGapFollowUpCoverageBoard);
  assert.ok(builtEvidenceGapFollowUpCoverageBoard);
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard,
    builtEvidenceGapFollowUpCoverageBoard,
  );
  assert.strictEqual(
    evidenceGapFollowUpCoverageBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath,
    sourceFollowUpReviewPath,
  );
  assert.equal(
    evidenceGapFollowUpCoverageBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board.v1",
  );
  assert.equal(
    evidenceGapFollowUpCoverageBoard.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path evidence-gap follow-up review path evidence-gap follow-up coverage board and static review prompts",
  );
  assert.equal(evidenceGapFollowUpCoverageBoard.localStatus, "fixture");
  assert.equal(
    evidenceGapFollowUpCoverageBoard.summary.counts.coverageRowCount,
    sourceFollowUpReviewPath.followUpReviewPathSteps.length,
  );
  assert.equal(
    evidenceGapFollowUpCoverageBoard.summary.counts.staticReviewPromptCardCount,
    sourceFollowUpReviewPath.staticReadinessCueCards.length,
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.coverageRows.map(
      (row) => row.sourceFollowUpReviewPathStepId,
    ),
    sourceFollowUpReviewPath.followUpReviewPathSteps.map(
      (step) => step.followUpReviewPathStepId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.staticReviewPromptCards.map(
      (card) => card.sourceStaticReadinessCueCardId,
    ),
    sourceFollowUpReviewPath.staticReadinessCueCards.map(
      (card) => card.staticReadinessCueCardId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpCoverageBoard.summary.defaultCoverageContext
      .sourceStage109DefaultFollowUpReviewContext,
    sourceFollowUpReviewPath.summary.defaultFollowUpReviewContext,
  );

  const firstRow = evidenceGapFollowUpCoverageBoard.coverageRows[0];
  assert.equal(firstRow.coverageRowOrder, 1);
  assert.ok(firstRow.coverageText.includes(firstRow.sourceFollowUpReviewPathStepId));
  assert.ok(
    firstRow.coverageText.includes(firstRow.sourceStaticReadinessCueCardIds[0]),
  );
  assert.ok(firstRow.coverageText.includes(firstRow.sourceEvidenceGapReadinessRowId));
  assert.ok(
    firstRow.coverageText.includes(firstRow.sourceStaticFollowUpPromptCardIds[0]),
  );
  assert.ok(firstRow.coverageText.includes(firstRow.sourceEvidenceCheckReviewPathStepId));
  assert.ok(
    firstRow.coverageText.includes(firstRow.sourceStaticCitationGapCueCardIds[0]),
  );
  assert.ok(
    firstRow.coverageText.includes(firstRow.sourceStaticEvidenceCheckPromptCardId),
  );
  assert.ok(firstRow.coverageText.includes(firstRow.sourceCitationReviewLaneRowIds[0]));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceSourceFollowUpMapEntryId));
  assert.ok(
    firstRow.coverageText.includes(firstRow.sourceSourceReviewReadinessLaneRowId),
  );
  assert.ok(firstRow.coverageText.includes(firstRow.sourceSourceReviewPathStepId));
  assert.ok(firstRow.coverageText.includes(firstRow.sourceCrosswalkRowId));
  assert.ok(firstRow.coverageLabels.includes("evidence-gap follow-up coverage row"));
  assert.ok(
    firstRow.staticReviewPromptLabels.includes("static review prompt context"),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedCoverageBoardState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCoverageBoardSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCoverageState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapFollowUpSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedFollowUpReviewPathState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedSourceSelections, true);

  const firstPrompt = evidenceGapFollowUpCoverageBoard.staticReviewPromptCards[0];
  assert.equal(firstPrompt.staticReviewPromptOrder, 1);
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticReadinessCueCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticCitationGapCueCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(firstPrompt.sourceCitationReviewLaneRowId),
  );
  assert.ok(
    firstPrompt.staticReviewPromptText.includes(
      firstPrompt.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(firstPrompt.staticReviewPromptLabels.includes("static review prompt card"));
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedStaticReviewPromptCards, true);
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedCoverageBoardState, true);
  assert.equal(firstPrompt.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.ok(
    evidenceGapFollowUpCoverageBoard.staticCoverageBoardBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 110 evidence gap follow-up coverage board",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence gap follow-up coverage board and static review prompts",
    ),
  );
});
