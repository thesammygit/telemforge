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
