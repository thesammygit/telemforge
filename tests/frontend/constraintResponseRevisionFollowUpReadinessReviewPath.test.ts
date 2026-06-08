import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseRevisionFollowUpReadinessReviewPath derives review steps from Stage 96 readiness rows", async () => {
  const { buildConstraintResponseRevisionFollowUpReadinessReviewPath } =
    await import(
      "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPath.ts"
    ).catch((error) =>
      assert.fail(`expected Stage 97 helper module to exist: ${error.message}`),
    );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionFollowUpReadinessBoard =
    view.constraintResponseRevisionFollowUpReadinessBoard;

  assert.ok(sourceRevisionFollowUpReadinessBoard);

  const reviewPath = buildConstraintResponseRevisionFollowUpReadinessReviewPath(
    sourceRevisionFollowUpReadinessBoard,
  );

  assert.ok(reviewPath);
  assert.equal(
    reviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path.v1",
  );
  assert.strictEqual(
    reviewPath.sourceConstraintResponseRevisionFollowUpReadinessBoard,
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
      .sourceStage96DefaultRevisionFollowUpReadinessContext,
    sourceRevisionFollowUpReadinessBoard.summary.defaultRevisionFollowUpReadinessContext,
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
    firstStep.revisionFollowUpReadinessReviewPathText.includes(
      firstStep.sourceRevisionCoverageReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.staticResponsePromptText.includes(
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
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewPathState, true);
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedResponsePromptSelections,
    true,
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseNotes, true);

  const firstResponsePrompt = reviewPath.staticResponsePromptCards[0];
  assert.equal(firstResponsePrompt.staticResponsePromptOrder, 1);
  assert.ok(
    firstResponsePrompt.staticResponsePromptText.includes(
      firstResponsePrompt.sourceStaticResponseCheckCardId,
    ),
  );
  assert.ok(
    firstResponsePrompt.staticResponsePromptText.includes(
      firstResponsePrompt.sourceStaticRevisionFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstResponsePrompt.staticResponsePromptText.includes(
      firstResponsePrompt.sourceStaticRevisionCheckCardId,
    ),
  );
  assert.ok(
    firstResponsePrompt.staticResponsePromptLabels.includes(
      "static response-prompt card",
    ),
  );
  assert.equal(
    firstResponsePrompt.staticNonGoalFlags.noSavedStaticResponsePromptCards,
    true,
  );
  assert.equal(
    firstResponsePrompt.staticNonGoalFlags.noSavedResponsePromptSelections,
    true,
  );
  assert.equal(
    firstResponsePrompt.staticNonGoalFlags.noSavedStaticResponseCheckCards,
    true,
  );
});
