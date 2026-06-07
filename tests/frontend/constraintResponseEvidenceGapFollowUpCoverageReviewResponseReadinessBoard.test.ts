import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard derives response-readiness rows from Stage 91 review steps", async () => {
  const {
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 92 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceCoverageReviewPath =
    view.constraintResponseEvidenceGapFollowUpCoverageReviewPath;

  assert.ok(sourceCoverageReviewPath);

  const responseReadinessBoard =
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard(
      sourceCoverageReviewPath,
    );

  assert.ok(responseReadinessBoard);
  assert.equal(
    responseReadinessBoard.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_board.v1",
  );
  assert.strictEqual(
    responseReadinessBoard.sourceConstraintResponseEvidenceGapFollowUpCoverageReviewPath,
    sourceCoverageReviewPath,
  );
  assert.equal(
    responseReadinessBoard.responseReadinessRows.length,
    sourceCoverageReviewPath.coverageReviewPathSteps.length,
  );
  assert.equal(
    responseReadinessBoard.staticDraftCheckCards.length,
    sourceCoverageReviewPath.staticResponseCueCards.length,
  );
  assert.deepEqual(
    responseReadinessBoard.responseReadinessRows.map(
      (row) => row.sourceCoverageReviewPathStepId,
    ),
    sourceCoverageReviewPath.coverageReviewPathSteps.map(
      (step) => step.coverageReviewPathStepId,
    ),
  );
  assert.deepEqual(
    responseReadinessBoard.staticDraftCheckCards.map(
      (card) => card.sourceStaticResponseCueCardId,
    ),
    sourceCoverageReviewPath.staticResponseCueCards.map(
      (card) => card.staticResponseCueCardId,
    ),
  );
  assert.deepEqual(
    responseReadinessBoard.summary.defaultResponseReadinessContext
      .sourceStage91DefaultCoverageReviewContext,
    sourceCoverageReviewPath.summary.defaultCoverageReviewContext,
  );

  const firstRow = responseReadinessBoard.responseReadinessRows[0];
  assert.equal(firstRow.responseReadinessRowOrder, 1);
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceCoverageReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(firstRow.sourceCoverageRowId),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceStaticResponseCueCardIds[0],
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceStaticReviewPromptCardIds[0],
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceFollowUpReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceStaticReadinessCueCardIds[0],
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceEvidenceGapReadinessRowId,
    ),
  );
  assert.ok(
    firstRow.responseReadinessText.includes(
      firstRow.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(firstRow.staticDraftCheckText.includes(firstRow.sourceCoverageRowId));
  assert.ok(
    firstRow.responseReadinessLabels.includes("response-readiness row"),
  );
  assert.ok(
    firstRow.staticDraftCheckLabels.includes(
      "static draft-check carry-forward",
    ),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseReadinessState, true);
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedResponseReadinessSelections,
    true,
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedDraftCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedAnswerDrafts, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseNotes, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstDraftCheck = responseReadinessBoard.staticDraftCheckCards[0];
  assert.equal(firstDraftCheck.staticDraftCheckOrder, 1);
  assert.ok(
    firstDraftCheck.staticDraftCheckText.includes(
      firstDraftCheck.sourceStaticResponseCueCardId,
    ),
  );
  assert.ok(
    firstDraftCheck.staticDraftCheckText.includes(
      firstDraftCheck.sourceStaticReviewPromptCardId,
    ),
  );
  assert.ok(
    firstDraftCheck.staticDraftCheckText.includes(
      firstDraftCheck.sourceStaticReadinessCueCardId,
    ),
  );
  assert.ok(
    firstDraftCheck.staticDraftCheckLabels.includes("static draft-check card"),
  );
  assert.equal(
    firstDraftCheck.staticNonGoalFlags.noSavedStaticDraftCheckCards,
    true,
  );
  assert.equal(firstDraftCheck.staticNonGoalFlags.noSavedDraftCheckState, true);
  assert.equal(
    firstDraftCheck.staticNonGoalFlags.noSavedStaticResponseCueCards,
    true,
  );
});
