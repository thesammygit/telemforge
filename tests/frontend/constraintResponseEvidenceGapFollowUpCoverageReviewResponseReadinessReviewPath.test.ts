import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath derives review steps from Stage 92 readiness rows", async () => {
  const {
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 93 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponseReadinessBoard =
    view.constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard;

  assert.ok(sourceResponseReadinessBoard);

  const responseReadinessReviewPath =
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath(
      sourceResponseReadinessBoard,
    );

  assert.ok(responseReadinessReviewPath);
  assert.equal(
    responseReadinessReviewPath.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path.v1",
  );
  assert.strictEqual(
    responseReadinessReviewPath.sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessBoard,
    sourceResponseReadinessBoard,
  );
  assert.equal(
    responseReadinessReviewPath.responseReadinessReviewPathSteps.length,
    sourceResponseReadinessBoard.responseReadinessRows.length,
  );
  assert.equal(
    responseReadinessReviewPath.staticRevisionPromptCards.length,
    sourceResponseReadinessBoard.staticDraftCheckCards.length,
  );
  assert.deepEqual(
    responseReadinessReviewPath.responseReadinessReviewPathSteps.map(
      (step) => step.sourceResponseReadinessRowId,
    ),
    sourceResponseReadinessBoard.responseReadinessRows.map(
      (row) => row.responseReadinessRowId,
    ),
  );
  assert.deepEqual(
    responseReadinessReviewPath.staticRevisionPromptCards.map(
      (card) => card.sourceStaticDraftCheckCardId,
    ),
    sourceResponseReadinessBoard.staticDraftCheckCards.map(
      (card) => card.staticDraftCheckCardId,
    ),
  );
  assert.deepEqual(
    responseReadinessReviewPath.summary.defaultResponseReadinessReviewContext
      .sourceStage92DefaultResponseReadinessContext,
    sourceResponseReadinessBoard.summary.defaultResponseReadinessContext,
  );

  const firstStep = responseReadinessReviewPath.responseReadinessReviewPathSteps[0];
  assert.equal(firstStep.responseReadinessReviewPathStepOrder, 1);
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceResponseReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceCoverageReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceStaticDraftCheckCardIds[0],
    ),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(firstStep.sourceCoverageRowId),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceFollowUpReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceEvidenceGapReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.responseReadinessReviewText.includes(
      firstStep.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.revisionPromptText.includes(firstStep.sourceResponseReadinessRowId),
  );
  assert.ok(
    firstStep.responseReadinessReviewLabels.includes(
      "response-readiness review path step",
    ),
  );
  assert.ok(
    firstStep.staticRevisionPromptLabels.includes(
      "static revision-prompt carry-forward",
    ),
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedResponseReadinessReviewPathState,
    true,
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedResponseReadinessReviewPathSelections,
    true,
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionPromptState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionPromptSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedAnswerDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseNotes, true);

  const firstRevisionPrompt = responseReadinessReviewPath.staticRevisionPromptCards[0];
  assert.equal(firstRevisionPrompt.staticRevisionPromptOrder, 1);
  assert.ok(
    firstRevisionPrompt.revisionPromptText.includes(
      firstRevisionPrompt.sourceStaticDraftCheckCardId,
    ),
  );
  assert.ok(
    firstRevisionPrompt.revisionPromptText.includes(
      firstRevisionPrompt.sourceStaticResponseCueCardId,
    ),
  );
  assert.ok(
    firstRevisionPrompt.revisionPromptText.includes(
      firstRevisionPrompt.sourceStaticReviewPromptCardId,
    ),
  );
  assert.ok(
    firstRevisionPrompt.staticRevisionPromptLabels.includes(
      "static revision-prompt card",
    ),
  );
  assert.equal(
    firstRevisionPrompt.staticNonGoalFlags.noSavedStaticRevisionPromptCards,
    true,
  );
  assert.equal(
    firstRevisionPrompt.staticNonGoalFlags.noSavedRevisionPromptState,
    true,
  );
  assert.equal(
    firstRevisionPrompt.staticNonGoalFlags.noSavedStaticDraftCheckCards,
    true,
  );
});
