import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildConstraintResponseEvidenceGapReadinessMatrix } from "../../frontend/src/lib/constraintResponseEvidenceGapReadinessMatrix.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapReadinessMatrix derives deterministic rows from Stage 87 review steps", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceEvidenceCheckReviewPath =
    view.constraintResponseEvidenceCheckReviewPath;

  assert.ok(sourceEvidenceCheckReviewPath);

  const evidenceGapReadinessMatrix =
    buildConstraintResponseEvidenceGapReadinessMatrix(
      sourceEvidenceCheckReviewPath,
    );

  assert.ok(evidenceGapReadinessMatrix);
  assert.equal(
    evidenceGapReadinessMatrix.schema,
    "telemforge.constraint_response_evidence_gap_readiness_matrix.v1",
  );
  assert.strictEqual(
    evidenceGapReadinessMatrix.sourceConstraintResponseEvidenceCheckReviewPath,
    sourceEvidenceCheckReviewPath,
  );
  assert.equal(
    evidenceGapReadinessMatrix.evidenceGapReadinessRows.length,
    sourceEvidenceCheckReviewPath.evidenceCheckReviewPathSteps.length,
  );
  assert.equal(
    evidenceGapReadinessMatrix.staticFollowUpPromptCards.length,
    sourceEvidenceCheckReviewPath.staticCitationGapCueCards.length,
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.evidenceGapReadinessRows.map(
      (row) => row.sourceEvidenceCheckReviewPathStepId,
    ),
    sourceEvidenceCheckReviewPath.evidenceCheckReviewPathSteps.map(
      (step) => step.evidenceCheckReviewPathStepId,
    ),
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.staticFollowUpPromptCards.map(
      (card) => card.sourceStaticCitationGapCueCardId,
    ),
    sourceEvidenceCheckReviewPath.staticCitationGapCueCards.map(
      (card) => card.staticCitationGapCueCardId,
    ),
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.summary.defaultEvidenceGapReadinessContext
      .sourceStage87DefaultEvidenceCheckReviewContext,
    sourceEvidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext,
  );

  const firstRow = evidenceGapReadinessMatrix.evidenceGapReadinessRows[0];
  assert.equal(firstRow.evidenceGapReadinessRowOrder, 1);
  assert.ok(
    firstRow.readinessText.includes(
      firstRow.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.readinessText.includes(
      firstRow.sourceStaticCitationGapCueCardIds[0],
    ),
  );
  assert.ok(
    firstRow.readinessText.includes(
      firstRow.sourceStaticEvidenceCheckPromptCardId,
    ),
  );
  assert.ok(
    firstRow.readinessText.includes(firstRow.sourceCitationReviewLaneRowIds[0]),
  );
  assert.ok(
    firstRow.readinessText.includes(firstRow.sourceSourceFollowUpMapEntryId),
  );
  assert.ok(firstRow.readinessText.includes(firstRow.sourceSourceReadinessLaneRowId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceSourceReviewPathStepId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceCrosswalkRowId));
  assert.ok(
    firstRow.readinessLabels.includes("evidence-gap readiness matrix row"),
  );
  assert.ok(
    firstRow.followUpPromptLabels.includes("static follow-up prompt context"),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapReadinessState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapReadinessSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceCheckSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedSourceSelections, true);

  const firstCard = evidenceGapReadinessMatrix.staticFollowUpPromptCards[0];
  assert.equal(firstCard.staticFollowUpPromptOrder, 1);
  assert.ok(
    firstCard.followUpPromptText.includes(
      firstCard.sourceStaticCitationGapCueCardId,
    ),
  );
  assert.ok(
    firstCard.followUpPromptText.includes(
      firstCard.sourceCitationReviewLaneRowId,
    ),
  );
  assert.ok(
    firstCard.followUpPromptText.includes(
      firstCard.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(
    firstCard.followUpPromptText.includes(
      firstCard.sourceStaticEvidenceCheckPromptCardIds[0],
    ),
  );
  assert.ok(
    firstCard.followUpPromptLabels.includes("static follow-up prompt card"),
  );
  assert.equal(firstCard.staticNonGoalFlags.noSavedStaticFollowUpPromptCards, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedEvidenceGapReadinessMatrixState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationSelections, true);
});
