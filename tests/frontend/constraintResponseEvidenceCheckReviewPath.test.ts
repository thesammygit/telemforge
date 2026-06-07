import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildConstraintResponseEvidenceCheckReviewPath } from "../../frontend/src/lib/constraintResponseEvidenceCheckReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceCheckReviewPath derives deterministic steps from Stage 86 evidence prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceCitationReviewLane = view.constraintResponseSourceCitationReviewLane;

  assert.ok(sourceCitationReviewLane);

  const evidenceCheckReviewPath =
    buildConstraintResponseEvidenceCheckReviewPath(sourceCitationReviewLane);

  assert.ok(evidenceCheckReviewPath);
  assert.equal(
    evidenceCheckReviewPath.schema,
    "telemforge.constraint_response_evidence_check_review_path.v1",
  );
  assert.strictEqual(
    evidenceCheckReviewPath.sourceConstraintResponseSourceCitationReviewLane,
    sourceCitationReviewLane,
  );
  assert.equal(
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.length,
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.length,
  );
  assert.equal(
    evidenceCheckReviewPath.staticCitationGapCueCards.length,
    sourceCitationReviewLane.citationReviewLaneRows.length,
  );
  assert.deepEqual(
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.map(
      (step) => step.sourceStaticEvidenceCheckPromptCardId,
    ),
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map(
      (card) => card.staticEvidenceCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.staticCitationGapCueCards.map(
      (card) => card.sourceCitationReviewLaneRowId,
    ),
    sourceCitationReviewLane.citationReviewLaneRows.map(
      (row) => row.citationReviewLaneRowId,
    ),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext
      .sourceStage86DefaultCitationReviewContext,
    sourceCitationReviewLane.summary.defaultCitationReviewContext,
  );

  const firstStep = evidenceCheckReviewPath.evidenceCheckReviewPathSteps[0];
  assert.equal(firstStep.evidenceCheckReviewPathStepOrder, 1);
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceStaticEvidenceCheckPromptCardId,
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceCitationReviewLaneRowIds[0],
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(
      firstStep.sourceSourceFollowUpMapEntryId,
    ),
  );
  assert.ok(
    firstStep.evidenceCheckReviewText.includes(firstStep.sourceSourceReviewPathStepId),
  );
  assert.ok(
    firstStep.evidenceCheckReviewLabels.includes(
      "evidence-check review path step",
    ),
  );
  assert.ok(
    firstStep.citationGapCueLabels.includes(
      "matched citation-gap cue context",
    ),
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckReviewState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedCitationSelections, true);

  const firstCue = evidenceCheckReviewPath.staticCitationGapCueCards[0];
  assert.equal(firstCue.staticCitationGapCueOrder, 1);
  assert.ok(
    firstCue.citationGapCueText.includes(firstCue.sourceCitationReviewLaneRowId),
  );
  assert.ok(
    firstCue.citationGapCueText.includes(
      firstCue.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(
    firstCue.citationGapCueText.includes(
      firstCue.sourceStaticEvidenceCheckPromptCardIds[0],
    ),
  );
  assert.ok(
    firstCue.citationGapCueLabels.includes("static citation-gap cue card"),
  );
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticCitationGapCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedEvidenceCheckReviewPathState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedSourceSelections, true);
});
