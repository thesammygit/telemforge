import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";
import { buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath } from "../../frontend/src/lib/constraintResponseEvidenceGapFollowUpCoverageReviewPath.ts";
import { buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPath } from "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseEvidenceGapFollowUpCoverageReviewPath derives deterministic review steps from Stage 90 coverage rows", async () => {
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

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPath derives Stage 111 coverage-review path from Stage 110", async () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCoverageBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard;
  const coverageReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPath;
  const builtCoverageReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPath(
      sourceCoverageBoard,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceCoverageBoard);
  assert.ok(coverageReviewPath);
  assert.ok(builtCoverageReviewPath);
  assert.deepEqual(coverageReviewPath, builtCoverageReviewPath);
  assert.strictEqual(
    coverageReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoard,
    sourceCoverageBoard,
  );
  assert.equal(
    coverageReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path.v1",
  );
  assert.equal(
    coverageReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path evidence-gap follow-up review path evidence-gap follow-up coverage board evidence-gap follow-up coverage-review path and static response cues",
  );
  assert.equal(coverageReviewPath.localStatus, "fixture");
  assert.equal(
    coverageReviewPath.summary.counts.coverageReviewPathStepCount,
    sourceCoverageBoard.coverageRows.length,
  );
  assert.equal(
    coverageReviewPath.summary.counts.staticResponseCueCardCount,
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
      .sourceStage110DefaultCoverageContext,
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
  assert.ok(firstStep.responseCueText.includes(firstStep.sourceCoverageRowId));
  assert.ok(
    firstStep.coverageReviewLabels.includes("coverage-review path step"),
  );
  assert.ok(firstStep.responseCueLabels.includes("static response cue context"));
  assert.equal(firstStep.staticNonGoalFlags.noSavedCoverageReviewPathState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedCoverageReviewSelections, true);
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
  assert.ok(firstCue.staticResponseCueLabels.includes("static response cue card"));
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticResponseCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedResponseCueState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticReviewPromptCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.ok(
    coverageReviewPath.staticCoverageReviewPathBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 111 evidence gap follow-up coverage-review path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence gap follow-up coverage-review path and static response cues",
    ),
  );
});
