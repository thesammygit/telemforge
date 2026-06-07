import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

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
