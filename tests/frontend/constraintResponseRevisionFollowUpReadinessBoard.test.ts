import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseRevisionFollowUpReadinessBoard derives readiness rows from Stage 95 revision follow-up context", async () => {
  const { buildConstraintResponseRevisionFollowUpReadinessBoard } =
    await import(
      "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessBoard.ts"
    ).catch((error) =>
      assert.fail(`expected Stage 96 helper module to exist: ${error.message}`),
    );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionCoverageReviewPath =
    view.constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath;

  assert.ok(sourceRevisionCoverageReviewPath);

  const readinessBoard =
    buildConstraintResponseRevisionFollowUpReadinessBoard(
      sourceRevisionCoverageReviewPath,
    );

  assert.ok(readinessBoard);
  assert.equal(
    readinessBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_board.v1",
  );
  assert.strictEqual(
    readinessBoard.sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath,
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
      .sourceStage95DefaultRevisionCoverageReviewPathContext,
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
    firstRow.revisionFollowUpReadinessText.includes(
      firstRow.sourceStaticRevisionCheckCardIds[0],
    ),
  );
  assert.ok(
    firstRow.staticResponseCheckText.includes(
      firstRow.sourceResponseReadinessReviewPathStepId,
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
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseNotes, true);

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
    firstResponseCheck.staticNonGoalFlags.noSavedStaticRevisionFollowUpPromptCards,
    true,
  );
});
