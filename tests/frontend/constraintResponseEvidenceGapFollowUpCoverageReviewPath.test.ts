import assert from "node:assert/strict";
import test from "node:test";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath derives deterministic review steps from Stage 90 coverage rows", async () => {
  const { buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath } =
    await import(
      "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewPath.ts"
    ).catch((error) =>
      assert.fail(`expected Stage 91 helper module to exist: ${error.message}`),
    );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceCoverageBoard =
    view.constraintResponseEvidenceGapFollowUpCoverageBoard;

  assert.ok(sourceCoverageBoard);

  const coverageReviewPath =
    buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath(
      sourceCoverageBoard,
    );

  assert.ok(coverageReviewPath);
  assert.equal(
    coverageReviewPath.schema,
    "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_path.v1",
  );
  assert.strictEqual(
    coverageReviewPath.sourceConstraintResponseEvidenceGapFollowUpCoverageBoard,
    sourceCoverageBoard,
  );
  assert.equal(
    coverageReviewPath.coverageReviewPathSteps.length,
    sourceCoverageBoard.coverageRows.length,
  );
  assert.equal(
    coverageReviewPath.staticResponseCueCards.length,
    sourceCoverageBoard.staticReviewPromptCards.length,
  );
  assert.deepEqual(
    coverageReviewPath.coverageReviewPathSteps.map(
      (step) => step.sourceCoverageRowId,
    ),
    sourceCoverageBoard.coverageRows.map((row) => row.coverageRowId),
  );
  assert.deepEqual(
    coverageReviewPath.staticResponseCueCards.map(
      (card) => card.sourceStaticReviewPromptCardId,
    ),
    sourceCoverageBoard.staticReviewPromptCards.map(
      (card) => card.staticReviewPromptCardId,
    ),
  );
  assert.deepEqual(
    coverageReviewPath.summary.defaultCoverageReviewContext
      .sourceStage90DefaultCoverageContext,
    sourceCoverageBoard.summary.defaultCoverageContext,
  );

  const firstStep = coverageReviewPath.coverageReviewPathSteps[0];
  assert.equal(firstStep.coverageReviewPathStepOrder, 1);
  assert.ok(firstStep.coverageReviewText.includes(firstStep.sourceCoverageRowId));
  assert.ok(
    firstStep.coverageReviewText.includes(
      firstStep.sourceStaticReviewPromptCardIds[0],
    ),
  );
  assert.ok(
    firstStep.coverageReviewText.includes(
      firstStep.sourceFollowUpReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.coverageReviewText.includes(
      firstStep.sourceStaticReadinessCueCardIds[0],
    ),
  );
  assert.ok(
    firstStep.coverageReviewText.includes(
      firstStep.sourceEvidenceGapReadinessRowId,
    ),
  );
  assert.ok(
    firstStep.coverageReviewText.includes(
      firstStep.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.responseCueText.includes(firstStep.sourceCoverageRowId),
  );
  assert.ok(
    firstStep.coverageReviewLabels.includes(
      "coverage-review path step",
    ),
  );
  assert.ok(
    firstStep.responseCueLabels.includes("static response cue context"),
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedCoverageReviewPathState, true);
  assert.equal(
    firstStep.staticNonGoalFlags.noSavedCoverageReviewSelections,
    true,
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedResponseCueState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedCoverageBoardState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstCue = coverageReviewPath.staticResponseCueCards[0];
  assert.equal(firstCue.staticResponseCueOrder, 1);
  assert.ok(
    firstCue.staticResponseCueText.includes(
      firstCue.sourceStaticReviewPromptCardId,
    ),
  );
  assert.ok(
    firstCue.staticResponseCueText.includes(
      firstCue.sourceStaticReadinessCueCardId,
    ),
  );
  assert.ok(
    firstCue.staticResponseCueText.includes(
      firstCue.sourceStaticFollowUpPromptCardId,
    ),
  );
  assert.ok(
    firstCue.staticResponseCueLabels.includes("static response cue card"),
  );
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticResponseCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedResponseCueState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticReviewPromptCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedCitationSelections, true);
});
