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
