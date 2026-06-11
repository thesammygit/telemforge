import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard derives readiness rows from Stage 97 review path", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 98 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionFollowUpReadinessReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPath;

  assert.ok(sourceRevisionFollowUpReadinessReviewPath);

  const readinessBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard(
      sourceRevisionFollowUpReadinessReviewPath,
    );

  assert.ok(readinessBoard);
  assert.equal(
    readinessBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board.v1",
  );
  assert.strictEqual(
    readinessBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPath,
    sourceRevisionFollowUpReadinessReviewPath,
  );
  assert.equal(
    readinessBoard.responsePromptReadinessRows.length,
    sourceRevisionFollowUpReadinessReviewPath.revisionFollowUpReadinessReviewPathSteps
      .length,
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
      .sourceStage97DefaultRevisionFollowUpReadinessReviewPathContext,
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
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedResponseNotes, true);

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
    firstAnswerCheck.staticNonGoalFlags.noSavedAnswerCheckSelections,
    true,
  );
  assert.equal(
    firstAnswerCheck.staticNonGoalFlags.noSavedStaticResponsePromptCards,
    true,
  );
});
