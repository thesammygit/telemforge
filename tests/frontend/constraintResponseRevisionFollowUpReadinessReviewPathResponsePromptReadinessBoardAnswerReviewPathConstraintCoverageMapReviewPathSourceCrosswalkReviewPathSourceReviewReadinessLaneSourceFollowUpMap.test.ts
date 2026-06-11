import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap derives Stage 105 follow-up map from Stage 104", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 105 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReviewReadinessLane =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane;
  const sourceFollowUpMap =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap;
  const builtSourceFollowUpMap =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap(
      sourceReviewReadinessLane,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceReviewReadinessLane);
  assert.ok(sourceFollowUpMap);
  assert.ok(builtSourceFollowUpMap);
  assert.deepEqual(sourceFollowUpMap, builtSourceFollowUpMap);
  assert.strictEqual(
    sourceFollowUpMap.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane,
    sourceReviewReadinessLane,
  );
  assert.equal(
    sourceFollowUpMap.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane_source_follow_up_map.v1",
  );
  assert.equal(
    sourceFollowUpMap.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane source follow-up map and static citation-check prompts",
  );
  assert.equal(sourceFollowUpMap.localStatus, "fixture");
  assert.deepEqual(
    sourceFollowUpMap.summary.defaultSourceFollowUpContext
      .sourceStage104DefaultSourceReviewReadinessContext,
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext,
  );
  assert.equal(
    sourceFollowUpMap.summary.defaultSourceFollowUpContext
      .defaultSourceReviewReadinessLaneRowId,
    sourceFollowUpMap.defaultSourceFollowUpMapEntry
      .sourceSourceReviewReadinessLaneRowId,
  );
  assert.equal(
    sourceFollowUpMap.summary.defaultSourceFollowUpContext
      .defaultStaticSourceFollowUpCueCardId,
    sourceFollowUpMap.defaultStaticCitationCheckPromptCard
      .sourceStaticSourceFollowUpCueCardId,
  );
  assert.equal(
    sourceFollowUpMap.summary.counts.sourceFollowUpMapEntryCount,
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows.length,
  );
  assert.equal(
    sourceFollowUpMap.summary.counts.staticCitationCheckPromptCardCount,
    sourceReviewReadinessLane.staticSourceFollowUpCueCards.length,
  );
  assert.deepEqual(
    sourceFollowUpMap.sourceFollowUpMapEntries.map((entry) => [
      entry.sourceFollowUpMapEntryOrder,
      entry.sourceSourceReviewReadinessLaneRowId,
      entry.sourceStaticSourceFollowUpCueCardIds,
      entry.sourceSourceReviewPathStepId,
      entry.sourceCrosswalkRowId,
      entry.sourceStaticReviewCheckCardIds,
      entry.sourceConstraintCoverageReviewPathStepId,
      entry.sourceStaticResponsePromptCardIds,
      entry.sourceConstraintCoverageRowId,
      entry.sourceStaticResponseNotePromptCardIds,
      entry.sourceAnswerReviewPathStepId,
      entry.sourceStaticConstraintNoteCardIds,
      entry.sourceStaticAnswerCheckCardId,
      entry.sourceResponsePromptReadinessRowIds,
      entry.sourceRevisionFollowUpReadinessReviewPathStepIds,
      entry.sourceRevisionFollowUpReadinessRowIds,
      entry.sourceStaticResponseCheckCardId,
      entry.sourceStaticRevisionFollowUpPromptCardId,
      entry.sourceStaticRevisionCheckCardId,
      entry.sourceStaticRevisionPromptCardId,
      entry.sourceStaticDraftCheckCardId,
      entry.sourceStaticResponseCueCardId,
      entry.sourceStaticReviewPromptCardId,
      entry.sourceStaticReadinessCueCardId,
      entry.sourceStaticFollowUpPromptCardId,
      entry.sourceStaticCitationGapCueCardId,
      entry.sourceCitationReviewLaneRowId,
      entry.sourceStaticCitationCheckPromptCardId,
      entry.sourceLocalAnchorHrefs,
      entry.evidenceCallbackIds,
      entry.gapDiscussionPointIds,
      entry.deferredScopeReminderIds,
      entry.sourceReviewReadinessLaneLabels,
      entry.sourceFollowUpLabels,
      entry.citationCheckLabels,
      entry.sourceReviewReadinessLaneText,
      entry.sourceFollowUpText,
      entry.citationCheckPromptText,
    ]),
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows.map((row) => [
      row.sourceReviewReadinessLaneRowOrder,
      row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      sourceFollowUpMap.sourceFollowUpMapEntries.find(
        (entry) =>
          entry.sourceSourceReviewReadinessLaneRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      )?.sourceStaticSourceFollowUpCueCardIds,
      row.sourceSourceReviewPathStepId,
      row.sourceCrosswalkRowId,
      row.sourceStaticReviewCheckCardIds,
      row.sourceConstraintCoverageReviewPathStepId,
      row.sourceStaticResponsePromptCardIds,
      row.sourceConstraintCoverageRowId,
      row.sourceStaticResponseNotePromptCardIds,
      row.sourceAnswerReviewPathStepId,
      row.sourceStaticConstraintNoteCardIds,
      row.sourceStaticAnswerCheckCardId,
      row.sourceResponsePromptReadinessRowIds,
      row.sourceRevisionFollowUpReadinessReviewPathStepIds,
      row.sourceRevisionFollowUpReadinessRowIds,
      row.sourceStaticResponseCheckCardId,
      row.sourceStaticRevisionFollowUpPromptCardId,
      row.sourceStaticRevisionCheckCardId,
      row.sourceStaticRevisionPromptCardId,
      row.sourceStaticDraftCheckCardId,
      row.sourceStaticResponseCueCardId,
      row.sourceStaticReviewPromptCardId,
      row.sourceStaticReadinessCueCardId,
      row.sourceStaticFollowUpPromptCardId,
      row.sourceStaticCitationGapCueCardId,
      row.sourceCitationReviewLaneRowId,
      row.sourceStaticCitationCheckPromptCardId,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.sourceReviewReadinessLaneLabels,
      sourceFollowUpMap.sourceFollowUpMapEntries.find(
        (entry) =>
          entry.sourceSourceReviewReadinessLaneRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      )?.sourceFollowUpLabels,
      sourceFollowUpMap.sourceFollowUpMapEntries.find(
        (entry) =>
          entry.sourceSourceReviewReadinessLaneRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      )?.citationCheckLabels,
      row.sourceReviewReadinessLaneText,
      sourceFollowUpMap.sourceFollowUpMapEntries.find(
        (entry) =>
          entry.sourceSourceReviewReadinessLaneRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      )?.sourceFollowUpText,
      sourceFollowUpMap.sourceFollowUpMapEntries.find(
        (entry) =>
          entry.sourceSourceReviewReadinessLaneRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId,
      )?.citationCheckPromptText,
    ]),
  );
  assert.deepEqual(
    sourceFollowUpMap.staticCitationCheckPromptCards.map((card) => [
      card.staticCitationCheckPromptOrder,
      card.sourceStaticSourceFollowUpCueCardId,
      card.sourceStaticSourceFollowUpCueCardIds,
      card.sourceSourceFollowUpMapEntryIds,
      card.sourceStaticSourceReviewPromptCardId,
      card.sourceStaticReviewCheckCardId,
      card.sourceStaticResponsePromptCardId,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticSourceFollowUpCueLabels,
      card.staticCitationCheckLabels,
      card.staticSourceFollowUpCueText,
      card.citationCheckPromptText,
    ]),
    sourceReviewReadinessLane.staticSourceFollowUpCueCards.map((cueCard) => [
      cueCard.staticSourceFollowUpCueOrder,
      cueCard.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
      [
        cueCard.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
      ],
      sourceFollowUpMap.staticCitationCheckPromptCards.find(
        (card) =>
          card.sourceStaticSourceFollowUpCueCardId ===
          cueCard.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
      )?.sourceSourceFollowUpMapEntryIds,
      cueCard.sourceStaticSourceReviewPromptCardId,
      cueCard.sourceStaticReviewCheckCardId,
      cueCard.sourceStaticResponsePromptCardId,
      cueCard.sourceStaticResponseNotePromptCardId,
      cueCard.sourceResponsePromptReadinessRowId,
      cueCard.sourceLocalAnchorHrefs,
      cueCard.evidenceCallbackIds,
      cueCard.gapDiscussionPointIds,
      cueCard.deferredScopeReminderIds,
      cueCard.staticSourceFollowUpCueLabels,
      sourceFollowUpMap.staticCitationCheckPromptCards.find(
        (card) =>
          card.sourceStaticSourceFollowUpCueCardId ===
          cueCard.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
      )?.staticCitationCheckLabels,
      cueCard.staticSourceFollowUpCueText,
      sourceFollowUpMap.staticCitationCheckPromptCards.find(
        (card) =>
          card.sourceStaticSourceFollowUpCueCardId ===
          cueCard.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId,
      )?.citationCheckPromptText,
    ]),
  );
  assert.ok(
    sourceFollowUpMap.sourceFollowUpMapEntries.every(
      (entry) =>
        entry.sourceFollowUpMapEntryId.length > 0 &&
        entry.sourceFollowUpLabels.includes("source follow-up map entry") &&
        entry.sourceFollowUpLabels.includes(
          "Stage 104 source-review readiness lane carry-forward",
        ) &&
        entry.citationCheckLabels.includes(
          "static citation-check prompt context",
        ) &&
        entry.sourceFollowUpText.includes(entry.sourceSourceReviewReadinessLaneRowId) &&
        entry.sourceFollowUpText.includes(entry.sourceSourceReviewPathStepId) &&
        entry.sourceFollowUpText.includes(entry.sourceCrosswalkRowId) &&
        entry.sourceFollowUpText.includes(entry.sourceConstraintCoverageRowId) &&
        entry.citationCheckPromptText.includes(
          entry.sourceSourceReviewPathStepId,
        ) &&
        entry.staticNonGoalFlags.noSavedSourceFollowUpMapState &&
        entry.staticNonGoalFlags.noSavedCitationSelections &&
        entry.staticNonGoalFlags.noSavedCitationCheckState &&
        entry.staticNonGoalFlags.noSavedCitationCheckPromptState &&
        entry.staticNonGoalFlags.noSavedSourceReviewReadinessState &&
        entry.staticNonGoalFlags.noSavedSourceFollowUpState &&
        entry.staticNonGoalFlags.noSavedSourceSelections &&
        entry.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.ok(
    sourceFollowUpMap.staticCitationCheckPromptCards.every(
      (card) =>
        card.staticCitationCheckPromptCardId.length > 0 &&
        card.staticCitationCheckLabels.includes(
          "static citation-check prompt card",
        ) &&
        card.staticCitationCheckLabels.includes(
          "Stage 104 source-follow-up cue carry-forward",
        ) &&
        card.citationCheckPromptText.includes(
          card.sourceStaticSourceFollowUpCueCardId,
        ) &&
        card.citationCheckPromptText.includes(card.sourceStaticReviewCheckCardId) &&
        card.staticNonGoalFlags.noSavedStaticCitationCheckPrompts &&
        card.staticNonGoalFlags.noSavedStaticCitationCheckPromptCards &&
        card.staticNonGoalFlags.noSavedCitationSelections &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  const directStage105PromptStrings = [
    sourceFollowUpMap.summary.summary,
    sourceFollowUpMap.staticCitationCheckBoundarySummary,
    ...sourceFollowUpMap.sourceFollowUpMapEntries.flatMap((entry) => [
      entry.sourceFollowUpText,
      entry.citationCheckPromptText,
      entry.staticNonGoalContext,
      ...entry.sourceFollowUpLabels,
      ...entry.citationCheckLabels,
    ]),
    ...sourceFollowUpMap.staticCitationCheckPromptCards.flatMap((card) => [
      card.citationCheckPromptText,
      card.staticNonGoalContext,
      ...card.staticCitationCheckLabels,
    ]),
  ];

  assert.equal(
    directStage105PromptStrings.filter((value) => value.includes("undefined"))
      .length,
    0,
  );
  assert.equal(
    missionConsoleSource.match(/aria-label="Stage 105 source follow-up map"/g)
      ?.length ?? 0,
    1,
  );
  assert.equal(
    missionConsoleSource.match(
      /const constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMap =/g,
    )?.length ?? 0,
    1,
  );
  assert.match(missionConsoleSource, /Stage 105 source follow-up map/);
  assert.match(missionConsoleSource, /No saved citation-check state/);
});
