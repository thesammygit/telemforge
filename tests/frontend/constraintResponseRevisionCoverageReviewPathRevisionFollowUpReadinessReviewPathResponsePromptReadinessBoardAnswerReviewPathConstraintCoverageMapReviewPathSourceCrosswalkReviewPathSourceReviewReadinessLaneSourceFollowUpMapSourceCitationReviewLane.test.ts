import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 126 source citation-review lane derives evidence checks from Stage 125", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 126 helper module to exist: ${error.message}`),
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceFollowUpMap =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap;
  const sourceCitationReviewLane =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane;
  const builtSourceCitationReviewLane =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane(
      sourceFollowUpMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceFollowUpMap);
  assert.ok(sourceCitationReviewLane);
  assert.ok(builtSourceCitationReviewLane);
  assert.deepEqual(sourceCitationReviewLane, builtSourceCitationReviewLane);
  assert.strictEqual(
    sourceCitationReviewLane.sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap,
    sourceFollowUpMap,
  );
  assert.equal(
    sourceCitationReviewLane.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane.v1",
  );
  assert.equal(
    sourceCitationReviewLane.contractLabel,
    "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane and static evidence-check prompts",
  );
  assert.equal(sourceCitationReviewLane.localStatus, "fixture");
  assert.deepEqual(
    sourceCitationReviewLane.summary.defaultCitationReviewContext
      .sourceStage125DefaultSourceFollowUpContext,
    sourceFollowUpMap.summary.defaultSourceFollowUpContext,
  );
  assert.equal(
    sourceCitationReviewLane.summary.counts.citationReviewLaneRowCount,
    sourceFollowUpMap.staticCitationCheckPromptCards.length,
  );
  assert.equal(
    sourceCitationReviewLane.summary.counts.staticEvidenceCheckPromptCardCount,
    sourceFollowUpMap.sourceFollowUpMapEntries.length,
  );
  assert.deepEqual(
    sourceCitationReviewLane.citationReviewLaneRows.map((row) => [
      row.citationReviewLaneRowOrder,
      row.sourceStaticCitationCheckPromptCardId,
      row.sourceSourceFollowUpMapEntryIds,
      row.sourceStaticSourceFollowUpCueCardId,
      row.sourceStaticSourceReviewPromptCardId,
      row.sourceStaticReviewCheckCardId,
      row.sourceSourceReviewPathStepIds,
      row.sourceCrosswalkRowIds,
      row.sourceConstraintCoverageReviewPathStepIds,
      row.sourceRevisionFollowUpReadinessReviewPathStepIds,
      row.sourceEvidenceCheckReviewPathStepIds,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
    sourceFollowUpMap.staticCitationCheckPromptCards.map((card) => [
      card.staticCitationCheckPromptOrder,
      card.staticCitationCheckPromptCardId,
      card.sourceSourceFollowUpMapEntryIds,
      card.sourceStaticSourceFollowUpCueCardId,
      card.sourceStaticSourceReviewPromptCardId,
      card.sourceStaticReviewCheckCardId,
      sourceCitationReviewLane.citationReviewLaneRows.find(
        (row) =>
          row.sourceStaticCitationCheckPromptCardId ===
          card.staticCitationCheckPromptCardId,
      )?.sourceSourceReviewPathStepIds,
      sourceCitationReviewLane.citationReviewLaneRows.find(
        (row) =>
          row.sourceStaticCitationCheckPromptCardId ===
          card.staticCitationCheckPromptCardId,
      )?.sourceCrosswalkRowIds,
      sourceCitationReviewLane.citationReviewLaneRows.find(
        (row) =>
          row.sourceStaticCitationCheckPromptCardId ===
          card.staticCitationCheckPromptCardId,
      )?.sourceConstraintCoverageReviewPathStepIds,
      sourceCitationReviewLane.citationReviewLaneRows.find(
        (row) =>
          row.sourceStaticCitationCheckPromptCardId ===
          card.staticCitationCheckPromptCardId,
      )?.sourceRevisionFollowUpReadinessReviewPathStepIds,
      sourceCitationReviewLane.citationReviewLaneRows.find(
        (row) =>
          row.sourceStaticCitationCheckPromptCardId ===
          card.staticCitationCheckPromptCardId,
      )?.sourceEvidenceCheckReviewPathStepIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
  );
  assert.deepEqual(
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map((card) => [
      card.staticEvidenceCheckPromptOrder,
      card.sourceSourceFollowUpMapEntryId,
      card.sourceStaticCitationCheckPromptCardIds,
      card.sourceSourceReviewReadinessLaneRowId,
      card.sourceStaticSourceFollowUpCueCardIds,
      card.sourceSourceReviewPathStepId,
      card.sourceCrosswalkRowId,
      card.sourceConstraintCoverageReviewPathStepId,
      card.sourceRevisionFollowUpReadinessReviewPathStepIds,
      card.sourceEvidenceCheckReviewPathStepIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
    sourceFollowUpMap.sourceFollowUpMapEntries.map((entry) => [
      entry.sourceFollowUpMapEntryOrder,
      entry.sourceFollowUpMapEntryId,
      sourceCitationReviewLane.staticEvidenceCheckPromptCards.find(
        (card) =>
          card.sourceSourceFollowUpMapEntryId === entry.sourceFollowUpMapEntryId,
      )?.sourceStaticCitationCheckPromptCardIds,
      entry.sourceSourceReviewReadinessLaneRowId,
      entry.sourceStaticSourceFollowUpCueCardIds,
      entry.sourceSourceReviewPathStepId,
      entry.sourceCrosswalkRowId,
      entry.sourceConstraintCoverageReviewPathStepId,
      entry.sourceRevisionFollowUpReadinessReviewPathStepIds,
      entry.sourceEvidenceCheckReviewPathStepIds,
      entry.sourceLocalAnchorHrefs,
      entry.evidenceCallbackIds,
      entry.gapDiscussionPointIds,
      entry.deferredScopeReminderIds,
    ]),
  );

  const firstRow = sourceCitationReviewLane.citationReviewLaneRows[0];
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceStaticCitationCheckPromptCardId));
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceStaticSourceFollowUpCueCardId));
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceStaticSourceReviewPromptCardId));
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceStaticReviewCheckCardId));
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceSourceReviewPathStepIds[0]));
  assert.ok(firstRow.citationReviewText.includes(firstRow.sourceEvidenceCheckReviewPathStepIds[0]));
  assert.ok(firstRow.evidenceCheckPromptText.includes(firstRow.sourceSourceFollowUpMapEntryIds[0]));
  assert.ok(firstRow.citationReviewLabels.includes("source citation-review lane row"));
  assert.ok(firstRow.citationReviewLabels.includes("Stage 125 static citation-check prompt carry-forward"));
  assert.ok(firstRow.evidenceCheckLabels.includes("static evidence-check prompt context"));
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationReviewLaneState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceCheckState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const firstCard = sourceCitationReviewLane.staticEvidenceCheckPromptCards[0];
  assert.ok(firstCard.evidenceCheckPromptText.includes(firstCard.sourceSourceFollowUpMapEntryId));
  assert.ok(firstCard.evidenceCheckPromptText.includes(firstCard.sourceSourceReviewReadinessLaneRowId));
  assert.ok(firstCard.evidenceCheckPromptText.includes(firstCard.sourceSourceReviewPathStepId));
  assert.ok(firstCard.evidenceCheckPromptText.includes(firstCard.sourceCrosswalkRowId));
  assert.ok(firstCard.evidenceCheckPromptText.includes(firstCard.sourceEvidenceCheckReviewPathStepIds[0]));
  assert.ok(firstCard.evidenceCheckLabels.includes("static evidence-check prompt card"));
  assert.equal(firstCard.staticNonGoalFlags.noSavedEvidenceCheckPromptState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationReviewState, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedSourceSelections, true);
  assert.equal(firstCard.staticNonGoalFlags.noSavedReviewerAnswers, true);

  const directStage126PromptStrings = [
    sourceCitationReviewLane.summary.summary,
    sourceCitationReviewLane.staticEvidenceCheckBoundarySummary,
    ...sourceCitationReviewLane.citationReviewLaneRows.flatMap((row) => [
      row.citationReviewText,
      row.evidenceCheckPromptText,
      row.staticNonGoalContext,
      ...row.citationReviewLabels,
      ...row.evidenceCheckLabels,
    ]),
    ...sourceCitationReviewLane.staticEvidenceCheckPromptCards.flatMap((card) => [
      card.evidenceCheckPromptText,
      card.staticNonGoalContext,
      ...card.citationReviewLabels,
      ...card.evidenceCheckLabels,
    ]),
  ];

  assert.equal(
    directStage126PromptStrings.filter((value) => value.includes("undefined"))
      .length,
    0,
  );
  assert.equal(
    missionConsoleSource.match(/aria-label="Stage 126 source citation-review lane"/g)
      ?.length ?? 0,
    1,
  );
  assert.match(missionConsoleSource, /Stage 126 source citation-review lane/);
  assert.match(missionConsoleSource, /Source citation-review lane and static evidence checks/);
  assert.match(missionConsoleSource, /No saved evidence-check state/);
});

test("Stage 127 evidence-check review path derives citation-gap cues from Stage 126", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts"
  );
  assert.equal(
    typeof buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCitationReviewLane =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane;
  const evidenceCheckReviewPath =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath;
  const builtEvidenceCheckReviewPath =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath(
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
    evidenceCheckReviewPath.sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane,
    sourceCitationReviewLane,
  );
  assert.equal(
    evidenceCheckReviewPath.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path.v1",
  );
  assert.equal(
    evidenceCheckReviewPath.contractLabel,
    "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path and static citation-gap cues",
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
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.map((step) => [
      step.evidenceCheckReviewPathStepOrder,
      step.sourceStaticEvidenceCheckPromptCardId,
      step.sourceCitationReviewLaneRowIds,
      step.sourceSourceFollowUpMapEntryId,
      step.sourceStaticCitationCheckPromptCardIds,
      step.sourceSourceReviewReadinessLaneRowId,
      step.sourceSourceReviewPathStepId,
      step.sourceCrosswalkRowId,
      step.sourceConstraintCoverageReviewPathStepId,
      step.sourceRevisionFollowUpReadinessReviewPathStepIds,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
    ]),
    sourceCitationReviewLane.staticEvidenceCheckPromptCards.map((card) => [
      card.staticEvidenceCheckPromptOrder,
      card.staticEvidenceCheckPromptCardId,
      evidenceCheckReviewPath.evidenceCheckReviewPathSteps.find(
        (step) =>
          step.sourceStaticEvidenceCheckPromptCardId ===
          card.staticEvidenceCheckPromptCardId,
      )?.sourceCitationReviewLaneRowIds,
      card.sourceSourceFollowUpMapEntryId,
      card.sourceStaticCitationCheckPromptCardIds,
      card.sourceSourceReviewReadinessLaneRowId,
      card.sourceSourceReviewPathStepId,
      card.sourceCrosswalkRowId,
      card.sourceConstraintCoverageReviewPathStepId,
      card.sourceRevisionFollowUpReadinessReviewPathStepIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.staticCitationGapCueCards.map((card) => [
      card.staticCitationGapCueOrder,
      card.sourceCitationReviewLaneRowId,
      card.sourceStaticEvidenceCheckPromptCardIds,
      card.sourceStaticCitationCheckPromptCardId,
      card.sourceSourceFollowUpMapEntryIds,
      card.sourceStaticSourceFollowUpCueCardId,
      card.sourceSourceReviewPathStepIds,
      card.sourceCrosswalkRowIds,
      card.sourceRevisionFollowUpReadinessReviewPathStepIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
    ]),
    sourceCitationReviewLane.citationReviewLaneRows.map((row) => [
      row.citationReviewLaneRowOrder,
      row.citationReviewLaneRowId,
      evidenceCheckReviewPath.staticCitationGapCueCards.find(
        (card) =>
          card.sourceCitationReviewLaneRowId === row.citationReviewLaneRowId,
      )?.sourceStaticEvidenceCheckPromptCardIds,
      row.sourceStaticCitationCheckPromptCardId,
      row.sourceSourceFollowUpMapEntryIds,
      row.sourceStaticSourceFollowUpCueCardId,
      row.sourceSourceReviewPathStepIds,
      row.sourceCrosswalkRowIds,
      row.sourceRevisionFollowUpReadinessReviewPathStepIds,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
    ]),
  );
  assert.deepEqual(
    evidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext
      .sourceStage126DefaultCitationReviewContext,
    sourceCitationReviewLane.summary.defaultCitationReviewContext,
  );

  const firstStep = evidenceCheckReviewPath.evidenceCheckReviewPathSteps[0];
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
  assert.ok(firstStep.evidenceCheckReviewText.includes(firstStep.sourceCrosswalkRowId));
  assert.ok(
    firstStep.evidenceCheckReviewLabels.includes(
      "evidence-check review path step",
    ),
  );
  assert.ok(
    firstStep.citationGapCueLabels.includes("matched citation-gap cue context"),
  );
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckReviewState, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedEvidenceCheckSelections, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstStep.staticNonGoalFlags.noSavedCitationSelections, true);

  const firstCue = evidenceCheckReviewPath.staticCitationGapCueCards[0];
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
  assert.ok(firstCue.citationGapCueLabels.includes("static citation-gap cue card"));
  assert.equal(firstCue.staticNonGoalFlags.noSavedStaticCitationGapCueCards, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedEvidenceCheckReviewPathState, true);
  assert.equal(firstCue.staticNonGoalFlags.noSavedSourceSelections, true);
  assert.ok(
    evidenceCheckReviewPath.staticCitationGapBoundarySummary.includes(
      "no saved reviewer answers",
    ),
  );

  assert.equal(
    missionConsoleSource.match(/aria-label="Stage 127 evidence-check review path"/g)
      ?.length ?? 0,
    1,
  );
  assert.match(missionConsoleSource, /Stage 127 evidence-check review path/);
  assert.match(
    missionConsoleSource,
    /Evidence-check review path and static citation-gap cues/,
  );
  assert.match(missionConsoleSource, /No saved evidence-check review state/);
});

test("Stage 128 evidence-gap readiness matrix derives static follow-up prompts from Stage 127", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLane.ts"
  );
  assert.equal(
    typeof buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const evidenceCheckReviewPath =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath;
  const evidenceGapReadinessMatrix =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix;
  const builtEvidenceGapReadinessMatrix =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrix(
      evidenceCheckReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(evidenceCheckReviewPath);
  assert.ok(evidenceGapReadinessMatrix);
  assert.ok(builtEvidenceGapReadinessMatrix);
  assert.deepEqual(evidenceGapReadinessMatrix, builtEvidenceGapReadinessMatrix);
  assert.strictEqual(
    evidenceGapReadinessMatrix.sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPath,
    evidenceCheckReviewPath,
  );
  assert.equal(
    evidenceGapReadinessMatrix.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map_source_citation_review_lane_evidence_check_review_path_evidence_gap_readiness_matrix.v1",
  );
  assert.equal(
    evidenceGapReadinessMatrix.contractLabel,
    "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map source citation-review lane evidence-check review path evidence-gap readiness matrix and static follow-up prompts",
  );
  assert.equal(evidenceGapReadinessMatrix.localStatus, "fixture");
  assert.equal(
    evidenceGapReadinessMatrix.summary.counts.evidenceGapReadinessRowCount,
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.length,
  );
  assert.equal(
    evidenceGapReadinessMatrix.summary.counts.staticFollowUpPromptCardCount,
    evidenceCheckReviewPath.staticCitationGapCueCards.length,
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.evidenceGapReadinessRows.map(
      (row) => row.sourceEvidenceCheckReviewPathStepId,
    ),
    evidenceCheckReviewPath.evidenceCheckReviewPathSteps.map(
      (step) => step.evidenceCheckReviewPathStepId,
    ),
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.staticFollowUpPromptCards.map(
      (card) => card.sourceStaticCitationGapCueCardId,
    ),
    evidenceCheckReviewPath.staticCitationGapCueCards.map(
      (card) => card.staticCitationGapCueCardId,
    ),
  );
  assert.deepEqual(
    evidenceGapReadinessMatrix.summary.defaultEvidenceGapReadinessContext
      .sourceStage127DefaultEvidenceCheckReviewContext,
    evidenceCheckReviewPath.summary.defaultEvidenceCheckReviewContext,
  );

  const firstRow = evidenceGapReadinessMatrix.evidenceGapReadinessRows[0];
  assert.ok(firstRow.readinessText.includes(firstRow.sourceEvidenceCheckReviewPathStepId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceStaticCitationGapCueCardIds[0]));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceStaticEvidenceCheckPromptCardId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceCitationReviewLaneRowIds[0]));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceSourceFollowUpMapEntryId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceSourceReviewReadinessLaneRowId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceSourceReviewPathStepId));
  assert.ok(firstRow.readinessText.includes(firstRow.sourceCrosswalkRowId));
  assert.ok(firstRow.followUpPromptText.includes(firstRow.sourceEvidenceCheckReviewPathStepId));
  assert.ok(firstRow.readinessLabels.includes("evidence-gap readiness matrix row"));
  assert.ok(firstRow.followUpPromptLabels.includes("static follow-up prompt context"));
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapReadinessState, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceGapReadinessSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedEvidenceCheckSelections, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedReviewerAnswers, true);
  assert.equal(firstRow.staticNonGoalFlags.noSavedCitationSelections, true);

  const firstCard = evidenceGapReadinessMatrix.staticFollowUpPromptCards[0];
  assert.ok(
    firstCard.followUpPromptText.includes(
      firstCard.sourceStaticCitationGapCueCardId,
    ),
  );
  assert.ok(firstCard.followUpPromptText.includes(firstCard.sourceCitationReviewLaneRowId));
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
  assert.ok(firstCard.followUpPromptLabels.includes("static follow-up prompt card"));
  assert.equal(firstCard.staticNonGoalFlags.noSavedStaticFollowUpPromptCards, true);
  assert.equal(
    firstCard.staticNonGoalFlags.noSavedEvidenceGapReadinessMatrixState,
    true,
  );
  assert.equal(firstCard.staticNonGoalFlags.noSavedCitationSelections, true);

  const stage128PromptStrings = [
    evidenceGapReadinessMatrix.summary.summary,
    evidenceGapReadinessMatrix.staticEvidenceGapReadinessBoundarySummary,
    ...evidenceGapReadinessMatrix.evidenceGapReadinessRows.flatMap((row) => [
      row.readinessText,
      row.followUpPromptText,
      row.staticNonGoalContext,
      ...row.readinessLabels,
      ...row.followUpPromptLabels,
    ]),
    ...evidenceGapReadinessMatrix.staticFollowUpPromptCards.flatMap((card) => [
      card.readinessText,
      card.followUpPromptText,
      card.staticNonGoalContext,
      ...card.readinessLabels,
      ...card.followUpPromptLabels,
    ]),
  ];
  assert.equal(
    stage128PromptStrings.filter((value) => value.includes("undefined")).length,
    0,
  );
  assert.equal(
    missionConsoleSource.match(/aria-label="Stage 128 evidence gap readiness matrix"/g)
      ?.length ?? 0,
    1,
  );
  assert.match(missionConsoleSource, /Stage 128 evidence gap readiness matrix/);
  assert.match(
    missionConsoleSource,
    /Evidence gap readiness matrix and static follow-up prompts/,
  );
  assert.match(missionConsoleSource, /No saved evidence-gap readiness state/);
});
