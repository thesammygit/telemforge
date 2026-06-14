import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath derives Stage 107 review path from Stage 106", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 107 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCitationReviewLane =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane;
  const evidenceCheckReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath;
  const builtEvidenceCheckReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath(
      sourceCitationReviewLane,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceCitationReviewLane);
  assert.ok(evidenceCheckReviewPath);
  assert.ok(builtEvidenceCheckReviewPath);
  assert.deepEqual(evidenceCheckReviewPath, builtEvidenceCheckReviewPath);
  assert.strictEqual(
    evidenceCheckReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane,
    sourceCitationReviewLane,
  );
  assert.equal(
    evidenceCheckReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path.v1",
  );
  assert.equal(
    evidenceCheckReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path and static citation-gap cues",
  );
  assert.equal(evidenceCheckReviewPath.localStatus, "fixture");
  assert.equal(
    evidenceCheckReviewPath.summary.counts.evidenceCheckReviewPathStepCount,
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.length,
  );
  assert.equal(
    evidenceCheckReviewPath.summary.counts.staticCitationGapCueCardCount,
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
      .sourceStage106DefaultCitationReviewContext,
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
    firstStep.evidenceCheckReviewText.includes(firstStep.sourceCrosswalkRowId),
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
  assert.ok(
    evidenceCheckReviewPath.staticCitationGapBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("Stage 107 evidence check review path"),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence check review path and static citation gap cues",
    ),
  );
});

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix derives Stage 108 readiness from Stage 107", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceEvidenceCheckReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath;
  const evidenceGapReadinessMatrix =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix;
  const builtEvidenceGapReadinessMatrix =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix(
      sourceEvidenceCheckReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceEvidenceCheckReviewPath);
  assert.ok(evidenceGapReadinessMatrix);
  assert.ok(builtEvidenceGapReadinessMatrix);
  assert.deepEqual(evidenceGapReadinessMatrix, builtEvidenceGapReadinessMatrix);
  assert.strictEqual(
    evidenceGapReadinessMatrix.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
    sourceEvidenceCheckReviewPath,
  );
  assert.equal(
    evidenceGapReadinessMatrix.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix.v1",
  );
  assert.equal(
    evidenceGapReadinessMatrix.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path evidence-gap readiness matrix and static follow-up prompts",
  );
  assert.equal(evidenceGapReadinessMatrix.localStatus, "fixture");
  assert.equal(
    evidenceGapReadinessMatrix.summary.counts.evidenceGapReadinessRowCount,
    sourceEvidenceCheckReviewPath.evidenceCheckReviewPathSteps.length,
  );
  assert.equal(
    evidenceGapReadinessMatrix.summary.counts.staticFollowUpPromptCardCount,
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
      .sourceStage107DefaultEvidenceCheckReviewContext,
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
  assert.ok(
    firstRow.readinessText.includes(firstRow.sourceSourceReviewReadinessLaneRowId),
  );
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
    firstCard.followUpPromptText.includes(firstCard.sourceCitationReviewLaneRowId),
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
  assert.ok(
    evidenceGapReadinessMatrix.staticEvidenceGapReadinessBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("Stage 108 evidence gap readiness matrix"),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence gap readiness matrix and static follow up prompts",
    ),
  );
});

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath derives Stage 109 follow-up review path from Stage 108", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceEvidenceGapReadinessMatrix =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix;
  const evidenceGapFollowUpReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath;
  const builtEvidenceGapFollowUpReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPath(
      sourceEvidenceGapReadinessMatrix,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceEvidenceGapReadinessMatrix);
  assert.ok(evidenceGapFollowUpReviewPath);
  assert.ok(builtEvidenceGapFollowUpReviewPath);
  assert.deepEqual(
    evidenceGapFollowUpReviewPath,
    builtEvidenceGapFollowUpReviewPath,
  );
  assert.strictEqual(
    evidenceGapFollowUpReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix,
    sourceEvidenceGapReadinessMatrix,
  );
  assert.equal(
    evidenceGapFollowUpReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path.v1",
  );
  assert.equal(
    evidenceGapFollowUpReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path evidence-gap follow-up review path and static readiness cues",
  );
  assert.equal(evidenceGapFollowUpReviewPath.localStatus, "fixture");
  assert.equal(
    evidenceGapFollowUpReviewPath.summary.counts.followUpReviewPathStepCount,
    sourceEvidenceGapReadinessMatrix.evidenceGapReadinessRows.length,
  );
  assert.equal(
    evidenceGapFollowUpReviewPath.summary.counts.staticReadinessCueCardCount,
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
      .sourceStage108DefaultEvidenceGapReadinessContext,
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
      firstStep.sourceStaticCitationGapCueCardIds[0],
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceStaticEvidenceCheckPromptCardId,
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceCitationReviewLaneRowIds[0],
    ),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(firstStep.sourceSourceFollowUpMapEntryId),
  );
  assert.ok(
    firstStep.followUpReviewText.includes(
      firstStep.sourceSourceReviewReadinessLaneRowId,
    ),
  );
  assert.ok(firstStep.followUpReviewText.includes(firstStep.sourceSourceReviewPathStepId));
  assert.ok(firstStep.followUpReviewText.includes(firstStep.sourceCrosswalkRowId));
  assert.ok(
    firstStep.readinessCueText.includes(firstStep.sourceEvidenceGapReadinessRowId),
  );
  assert.ok(
    firstStep.followUpReviewLabels.includes(
      "evidence-gap follow-up review path step",
    ),
  );
  assert.ok(firstStep.readinessCueLabels.includes("static readiness cue context"));
  assert.equal(firstStep.staticNonGoalFlags.noSavedFollowUpReviewPathState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceGapFollowUpSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceGapReadinessSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedSourceSelections, true);

  const firstCard = evidenceGapFollowUpReviewPath.staticReadinessCueCards[0];
  assert.equal(firstCard.staticReadinessCueOrder, 1);
  assert.ok(
    firstCard.readinessCueText.includes(firstCard.sourceStaticFollowUpPromptCardId),
  );
  assert.ok(
    firstCard.readinessCueText.includes(firstCard.sourceStaticCitationGapCueCardId),
  );
  assert.ok(
    firstCard.readinessCueText.includes(firstCard.sourceCitationReviewLaneRowId),
  );
  assert.ok(
    firstCard.readinessCueText.includes(
      firstCard.sourceStaticCitationCheckPromptCardId,
    ),
  );
  assert.ok(
    firstCard.readinessCueText.includes(
      firstCard.sourceEvidenceGapReadinessRowIds[0],
    ),
  );
  assert.ok(firstCard.readinessCueLabels.includes("static readiness cue card"));
  assert.equal(firstCard.staticNonGoalFlags.noSavedStaticReadinessCueCards, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedFollowUpReviewPathState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.ok(
    evidenceGapFollowUpReviewPath.staticFollowUpReviewBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Stage 109 evidence gap follow-up review path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Evidence gap follow-up review path and static readiness cues",
    ),
  );
});

test("Stage 113 response-readiness review path derives steps from Stage 112 readiness rows", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 113 helper export to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponseReadinessBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoard;
  const responseReadinessReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceResponseReadinessBoard);

  const builtResponseReadinessReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath(
      sourceResponseReadinessBoard,
    );

  assert.ok(responseReadinessReviewPath);
  assert.ok(builtResponseReadinessReviewPath);
  assert.deepEqual(responseReadinessReviewPath, builtResponseReadinessReviewPath);
  assert.equal(
    responseReadinessReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path.v1",
  );
  assert.strictEqual(
    responseReadinessReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoard,
    sourceResponseReadinessBoard,
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
      .sourceStage112DefaultResponseReadinessContext,
    sourceResponseReadinessBoard.summary.defaultResponseReadinessContext,
  );

  const firstStep =
    responseReadinessReviewPath.responseReadinessReviewPathSteps[0];
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
  assert.ok(firstStep.responseReadinessReviewText.includes(firstStep.sourceCoverageRowId));
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
    firstStep.responseReadinessReviewLabels.includes(
      "Stage 112 response-readiness row carry-forward",
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

  const firstRevisionPrompt =
    responseReadinessReviewPath.staticRevisionPromptCards[0];
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
  assert.ok(missionConsoleSource.includes("Stage 113 response-readiness review path"));
  assert.ok(
    missionConsoleSource.includes(
      "Response-readiness review path and static revision prompts",
    ),
  );
});

test("Stage 114 revision coverage board derives rows from Stage 113 review path", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 114 helper export to exist: ${error.message}`),
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponseReadinessReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath;
  const revisionCoverageBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceResponseReadinessReviewPath);

  const builtRevisionCoverageBoard =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard(
      sourceResponseReadinessReviewPath,
    );

  assert.ok(revisionCoverageBoard);
  assert.ok(builtRevisionCoverageBoard);
  assert.deepEqual(revisionCoverageBoard, builtRevisionCoverageBoard);
  assert.equal(
    revisionCoverageBoard.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_board.v1",
  );
  assert.strictEqual(
    revisionCoverageBoard.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPath,
    sourceResponseReadinessReviewPath,
  );
  assert.deepEqual(
    revisionCoverageBoard.revisionCoverageRows.map(
      (row) => row.sourceResponseReadinessReviewPathStepId,
    ),
    sourceResponseReadinessReviewPath.responseReadinessReviewPathSteps.map(
      (step) => step.responseReadinessReviewPathStepId,
    ),
  );
  assert.deepEqual(
    revisionCoverageBoard.staticRevisionCheckCards.map(
      (card) => card.sourceStaticRevisionPromptCardId,
    ),
    sourceResponseReadinessReviewPath.staticRevisionPromptCards.map(
      (card) => card.staticRevisionPromptCardId,
    ),
  );
  assert.deepEqual(
    revisionCoverageBoard.summary.defaultRevisionCoverageContext
      .sourceStage113DefaultResponseReadinessReviewContext,
    sourceResponseReadinessReviewPath.summary.defaultResponseReadinessReviewContext,
  );

  const firstRow = revisionCoverageBoard.revisionCoverageRows[0];
  assert.equal(firstRow.revisionCoverageRowOrder, 1);
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceStaticRevisionPromptCardIds[0],
    ),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(firstRow.sourceResponseReadinessRowId),
  );
  assert.ok(
    firstRow.revisionCoverageText.includes(
      firstRow.sourceCoverageReviewPathStepId,
    ),
  );
  assert.ok(firstRow.staticRevisionCheckText.includes(firstRow.sourceCoverageRowId));
  assert.ok(
    firstRow.staticRevisionCheckText.includes(
      firstRow.sourceEvidenceCheckReviewPathStepId,
    ),
  );
  assert.ok(firstRow.revisionCoverageLabels.includes("revision coverage row"));
  assert.ok(
    firstRow.staticRevisionCheckLabels.includes(
      "static revision-check carry-forward",
    ),
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionCoverageState, true);
  assert.equal(
    firstRow.staticNonGoalFlags.noSavedRevisionCoverageSelections,
    true,
  );
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionPromptState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedRevisionDrafts, true);

  const firstRevisionCheck = revisionCoverageBoard.staticRevisionCheckCards[0];
  assert.equal(firstRevisionCheck.staticRevisionCheckOrder, 1);
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticDraftCheckCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckText.includes(
      firstRevisionCheck.sourceStaticResponseCueCardId,
    ),
  );
  assert.ok(
    firstRevisionCheck.staticRevisionCheckLabels.includes(
      "static revision-check card",
    ),
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedStaticRevisionCheckCards,
    true,
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedRevisionCheckState,
    true,
  );
  assert.equal(
    firstRevisionCheck.staticNonGoalFlags.noSavedStaticRevisionPromptCards,
    true,
  );
  assert.ok(missionConsoleSource.includes("Stage 114 revision coverage board"));
  assert.ok(
    missionConsoleSource.includes(
      "Revision coverage board and static revision checks",
    ),
  );
});

test("Stage 115 revision coverage review path derives steps from Stage 114 coverage rows", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 115 helper export to exist: ${error.message}`),
  );
  assert.equal(
    typeof buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceRevisionCoverageBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard;
  const revisionCoverageReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceRevisionCoverageBoard);

  const builtRevisionCoverageReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPath(
      sourceRevisionCoverageBoard,
    );

  assert.ok(revisionCoverageReviewPath);
  assert.ok(builtRevisionCoverageReviewPath);
  assert.deepEqual(revisionCoverageReviewPath, builtRevisionCoverageReviewPath);
  assert.equal(
    revisionCoverageReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix_evidence_gap_follow_up_review_path_evidence_gap_follow_up_coverage_board_evidence_gap_follow_up_coverage_review_path_response_readiness_board_response_readiness_review_path_revision_coverage_review_path.v1",
  );
  assert.strictEqual(
    revisionCoverageReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageBoard,
    sourceRevisionCoverageBoard,
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
      .sourceStage114DefaultRevisionCoverageContext,
    sourceRevisionCoverageBoard.summary.defaultRevisionCoverageContext,
  );

  const firstStep = revisionCoverageReviewPath.revisionCoverageReviewPathSteps[0];
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
    firstStep.staticRevisionFollowUpPromptText.includes(
      firstStep.sourceResponseReadinessReviewPathStepId,
    ),
  );
  assert.ok(
    firstStep.staticRevisionFollowUpPromptText.includes(
      firstStep.sourceStaticRevisionPromptCardIds[0],
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
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionCoverageState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedRevisionDrafts, true);

  const firstPrompt =
    revisionCoverageReviewPath.staticRevisionFollowUpPromptCards[0];
  assert.equal(firstPrompt.staticRevisionFollowUpPromptOrder, 1);
  assert.ok(
    firstPrompt.staticRevisionFollowUpPromptText.includes(
      firstPrompt.sourceStaticRevisionCheckCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticRevisionFollowUpPromptText.includes(
      firstPrompt.sourceStaticRevisionPromptCardId,
    ),
  );
  assert.ok(
    firstPrompt.staticRevisionFollowUpPromptLabels.includes(
      "static revision follow-up prompt card",
    ),
  );
  assert.equal(
    firstPrompt.staticNonGoalFlags.noSavedStaticRevisionFollowUpPromptCards,
    true,
  );
  assert.equal(
    firstPrompt.staticNonGoalFlags.noSavedRevisionFollowUpPromptState,
    true,
  );
  assert.equal(
    firstPrompt.staticNonGoalFlags.noSavedStaticRevisionCheckCards,
    true,
  );
  assert.ok(missionConsoleSource.includes("Stage 115 revision coverage review path"));
  assert.ok(
    missionConsoleSource.includes(
      "Revision coverage review path and static revision follow-up prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("Stage 116 revision follow-up readiness"));
  assert.ok(
    missionConsoleSource.includes(
      "Revision follow-up readiness board and static response checks",
    ),
  );
});
