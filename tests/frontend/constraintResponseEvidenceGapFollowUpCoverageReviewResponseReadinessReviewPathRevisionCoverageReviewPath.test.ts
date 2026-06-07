import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath derives review path from Stage 94 revision coverage", async () => {
  const {
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 95 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionCoverageBoard =
    view.constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard;

  assert.ok(sourceRevisionCoverageBoard);

  const revisionCoverageReviewPath =
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageReviewPath(
      sourceRevisionCoverageBoard,
    );

  assert.ok(revisionCoverageReviewPath);
  assert.equal(
    revisionCoverageReviewPath.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path_revision_coverage_review_path.v1",
  );
  assert.strictEqual(
    revisionCoverageReviewPath.sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard,
    sourceRevisionCoverageBoard,
  );
  assert.equal(
    revisionCoverageReviewPath.revisionCoverageReviewPathSteps.length,
    sourceRevisionCoverageBoard.revisionCoverageRows.length,
  );
  assert.equal(
    revisionCoverageReviewPath.staticRevisionFollowUpPromptCards.length,
    sourceRevisionCoverageBoard.staticRevisionCheckCards.length,
  );
  assert.deepEqual(
    revisionCoverageReviewPath.revisionCoverageReviewPathSteps.map(
      (step) => step.sourceRevisionCoverageRowId,
    ),
    sourceRevisionCoverageBoard.revisionCoverageRows.map(
      (row) => row.revisionCoverageRowId,
    ),
  );
  assert.deepEqual(
    revisionCoverageReviewPath.staticRevisionFollowUpPromptCards.map(
      (card) => card.sourceStaticRevisionCheckCardId,
    ),
    sourceRevisionCoverageBoard.staticRevisionCheckCards.map(
      (card) => card.staticRevisionCheckCardId,
    ),
  );
  assert.deepEqual(
    revisionCoverageReviewPath.summary.defaultRevisionCoverageReviewPathContext
      .sourceStage94DefaultRevisionCoverageContext,
    sourceRevisionCoverageBoard.summary.defaultRevisionCoverageContext,
  );

  const firstStep =
    revisionCoverageReviewPath.revisionCoverageReviewPathSteps[0];
  assert.equal(firstStep.revisionCoverageReviewPathStepOrder, 1);
  assert.ok(
    firstStep.revisionCoverageReviewPathText.includes(
      firstStep.sourceRevisionCoverageRowId,
    ),
  );
  assert.ok(
    firstStep.revisionCoverageReviewPathText.includes(
      firstStep.sourceStaticRevisionCheckCardIds[0],
    ),
  );
  assert.ok(
    firstStep.revisionCoverageReviewPathText.includes(
      firstStep.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.revisionCoverageReviewPathText.includes(
      firstStep.sourceStaticRevisionPromptCardIds[0],
    ),
  );
  assert.ok(
    firstStep.revisionCoverageReviewPathText.includes(
      firstStep.sourceResponseReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.staticRevisionFollowUpPromptText.includes(
      firstStep.sourceRevisionCoverageRowId,
    ),
  );
  assert.ok(
    firstStep.revisionCoverageReviewPathLabels.includes(
      "revision coverage review-path step",
    ),
  );
  assert.ok(
    firstStep.staticRevisionFollowUpPromptLabels.includes(
      "static revision follow-up prompt carry-forward",
    ),
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedRevisionCoverageReviewPathState,
    true,
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedRevisionCoverageReviewPathSelections,
    true,
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedRevisionFollowUpPromptState,
    true,
  );
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedRevisionFollowUpPromptSelections,
    true,
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionDrafts, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerNotes, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseNotes, true);

  const firstFollowUpPrompt =
    revisionCoverageReviewPath.staticRevisionFollowUpPromptCards[0];
  assert.equal(firstFollowUpPrompt.staticRevisionFollowUpPromptOrder, 1);
  assert.ok(
    firstFollowUpPrompt.staticRevisionFollowUpPromptText.includes(
      firstFollowUpPrompt.sourceStaticRevisionCheckCardId,
    ),
  );
  assert.ok(
    firstFollowUpPrompt.staticRevisionFollowUpPromptText.includes(
      firstFollowUpPrompt.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstFollowUpPrompt.staticRevisionFollowUpPromptText.includes(
      firstFollowUpPrompt.sourceStaticDraftCheckCardId,
    ),
  );
  assert.ok(
    firstFollowUpPrompt.staticRevisionFollowUpPromptLabels.includes(
      "static revision follow-up prompt card",
    ),
  );
  assert.equal(
    firstFollowUpPrompt.staticNonGoalFlags
      .noSavedStaticRevisionFollowUpPromptCards,
    true,
  );
  assert.equal(
    firstFollowUpPrompt.staticNonGoalFlags.noSavedRevisionFollowUpPromptState,
    true,
  );
  assert.equal(
    firstFollowUpPrompt.staticNonGoalFlags.noSavedStaticRevisionCheckCards,
    true,
  );
});
