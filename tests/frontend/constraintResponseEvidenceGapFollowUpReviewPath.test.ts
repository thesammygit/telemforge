import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpReviewPath derives deterministic review steps from Stage 88 readiness rows", async () => {
  const { buildConstraintResponseEvidenceGapFollowUpReviewPath } = await import(
    "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 89 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceEvidenceGapReadinessMatrix =
    view.constraintResponseEvidenceGapReadinessMatrix;

  assert.ok(sourceEvidenceGapReadinessMatrix);

  const evidenceGapFollowUpReviewPath =
    buildConstraintResponseEvidenceGapFollowUpReviewPath(
      sourceEvidenceGapReadinessMatrix,
    );

  assert.ok(evidenceGapFollowUpReviewPath);
  assert.equal(
    evidenceGapFollowUpReviewPath.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_review_path.v1",
  );
  assert.strictEqual(
    evidenceGapFollowUpReviewPath.sourceConstraintResponseEvidenceGapReadinessMatrix,
    sourceEvidenceGapReadinessMatrix,
  );
  assert.equal(
    evidenceGapFollowUpReviewPath.followUpReviewPathSteps.length,
    sourceEvidenceGapReadinessMatrix.evidenceGapReadinessRows.length,
  );
  assert.equal(
    evidenceGapFollowUpReviewPath.staticReadinessCueCards.length,
    sourceEvidenceGapReadinessMatrix.staticFollowUpPromptCards.length,
  );
  assert.deepEqual(
    evidenceGapFollowUpReviewPath.followUpReviewPathSteps.map(
      (step) => step.sourceEvidenceGapReadinessRowId,
    ),
    sourceEvidenceGapReadinessMatrix.evidenceGapReadinessRows.map(
      (row) => row.evidenceGapReadinessRowId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpReviewPath.staticReadinessCueCards.map(
      (card) => card.sourceStaticFollowUpPromptCardId,
    ),
    sourceEvidenceGapReadinessMatrix.staticFollowUpPromptCards.map(
      (card) => card.staticFollowUpPromptCardId,
    ),
  );
  assert.deepEqual(
    evidenceGapFollowUpReviewPath.summary.defaultFollowUpReviewContext
      .sourceStage88DefaultEvidenceGapReadinessContext,
    sourceEvidenceGapReadinessMatrix.summary.defaultEvidenceGapReadinessContext,
  );

  const firstStep = evidenceGapFollowUpReviewPath.followUpReviewPathSteps[0];
  assert.equal(firstStep.followUpReviewPathStepOrder, 1);
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceEvidenceGapReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceStaticFollowUpPromptCardIds[0],
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceStaticEvidenceCheckPromptCardId,
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(firstStep.sourceCitationReviewLaneRowIds[0]),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(firstStep.sourceSourceFollowUpMapEntryId),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(firstStep.sourceSourceReadinessLaneRowId),
  );
  assert.ok(firstStep.followUpReviewText.includes(firstStep.sourceSourceReviewPathStepId));
  assert.ok(firstStep.followUpReviewText.includes(firstStep.sourceCrosswalkRowId));
  assert.ok(
    firstStep.followUpReviewLabels.includes("evidence-gap follow-up review path step"),
  );
  assert.ok(
    firstStep.readinessCueLabels.includes("static readiness cue context"),
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedFollowUpReviewPathState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceGapReadinessSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedSourceSelections, true);

  const firstCue = evidenceGapFollowUpReviewPath.staticReadinessCueCards[0];
  assert.equal(firstCue.staticReadinessCueOrder, 1);
  assert.ok(
    firstCue.readinessCueText.includes(firstCue.sourceStaticFollowUpPromptCardId),
  );
  assert.ok(
    firstCue.readinessCueText.includes(firstCue.sourceStaticCitationGapCueCardId),
  );
  assert.ok(firstCue.readinessCueText.includes(firstCue.sourceCitationReviewLaneRowId));
  assert.ok(
    firstCue.readinessCueText.includes(firstCue.sourceStaticCitationCheckPromptCardId),
  );
  assert.ok(
    firstCue.readinessCueLabels.includes("static readiness cue card"),
  );
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticReadinessCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedFollowUpReviewPathState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedCitationSelections, true);
});
