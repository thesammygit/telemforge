import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane derives Stage 104 source-review readiness from Stage 103", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 104 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath;
  const sourceReviewReadinessLane =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane;
  const builtSourceReviewReadinessLane =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLane(
      sourceReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceReviewPath);
  assert.ok(sourceReviewReadinessLane);
  assert.ok(builtSourceReviewReadinessLane);
  assert.deepEqual(sourceReviewReadinessLane, builtSourceReviewReadinessLane);
  assert.strictEqual(
    sourceReviewReadinessLane.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath,
    sourceReviewPath,
  );
  assert.equal(
    sourceReviewReadinessLane.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path_source_review_readiness_lane.v1",
  );
  assert.equal(
    sourceReviewReadinessLane.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path source-review readiness lane and static source-follow-up cues",
  );
  assert.equal(sourceReviewReadinessLane.localStatus, "fixture");
  assert.deepEqual(
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext
      .sourceStage103DefaultSourceReviewContext,
    sourceReviewPath.summary.defaultSourceReviewContext,
  );
  assert.equal(
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext
      .defaultSourceReviewPathStepId,
    sourceReviewReadinessLane.defaultSourceReviewReadinessLaneRow
      .sourceSourceReviewPathStepId,
  );
  assert.equal(
    sourceReviewReadinessLane.summary.defaultSourceReviewReadinessContext
      .defaultStaticSourceReviewPromptCardId,
    sourceReviewReadinessLane.defaultStaticSourceFollowUpCueCard
      .sourceStaticSourceReviewPromptCardId,
  );
  assert.equal(
    sourceReviewReadinessLane.summary.counts.sourceReviewReadinessLaneRowCount,
    sourceReviewPath.sourceReviewPathSteps.length,
  );
  assert.equal(
    sourceReviewReadinessLane.summary.counts.staticSourceFollowUpCueCardCount,
    sourceReviewPath.staticSourceReviewPromptCards.length,
  );
  assert.deepEqual(
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows.map((row) => [
      row.sourceReviewReadinessLaneRowOrder,
      row.sourceSourceReviewPathStepId,
      row.sourceSourceReviewPathStepIds,
      row.sourceStaticSourceReviewPromptCardIds,
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
      row.sourceCrosswalkLabels,
      row.sourceReviewPathLabels,
      row.sourceReviewReadinessLaneLabels,
      row.sourceCrosswalkText,
      row.sourceReviewPathText,
      row.staticSourceReviewPromptText,
      row.sourceReviewReadinessLaneText,
      row.staticSourceFollowUpCueText,
    ]),
    sourceReviewPath.sourceReviewPathSteps.map((step) => [
      step.sourceReviewPathStepOrder,
      step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      [
        step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      ],
      sourceReviewReadinessLane.sourceReviewReadinessLaneRows.find(
        (row) =>
          row.sourceSourceReviewPathStepId ===
          step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      )?.sourceStaticSourceReviewPromptCardIds,
      step.sourceCrosswalkRowId,
      step.sourceStaticReviewCheckCardIds,
      step.sourceConstraintCoverageReviewPathStepId,
      step.sourceStaticResponsePromptCardIds,
      step.sourceConstraintCoverageRowId,
      step.sourceStaticResponseNotePromptCardIds,
      step.sourceAnswerReviewPathStepId,
      step.sourceStaticConstraintNoteCardIds,
      step.sourceStaticAnswerCheckCardId,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceRevisionFollowUpReadinessReviewPathStepIds,
      step.sourceRevisionFollowUpReadinessRowIds,
      step.sourceStaticResponseCheckCardId,
      step.sourceStaticRevisionFollowUpPromptCardId,
      step.sourceStaticRevisionCheckCardId,
      step.sourceStaticRevisionPromptCardId,
      step.sourceStaticDraftCheckCardId,
      step.sourceStaticResponseCueCardId,
      step.sourceStaticReviewPromptCardId,
      step.sourceStaticReadinessCueCardId,
      step.sourceStaticFollowUpPromptCardId,
      step.sourceStaticCitationGapCueCardId,
      step.sourceCitationReviewLaneRowId,
      step.sourceStaticCitationCheckPromptCardId,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.sourceCrosswalkLabels,
      step.sourceReviewPathLabels,
      sourceReviewReadinessLane.sourceReviewReadinessLaneRows.find(
        (row) =>
          row.sourceSourceReviewPathStepId ===
          step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      )?.sourceReviewReadinessLaneLabels,
      step.sourceCrosswalkText,
      step.sourceReviewPathText,
      step.staticSourceReviewPromptText,
      sourceReviewReadinessLane.sourceReviewReadinessLaneRows.find(
        (row) =>
          row.sourceSourceReviewPathStepId ===
          step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      )?.sourceReviewReadinessLaneText,
      sourceReviewReadinessLane.sourceReviewReadinessLaneRows.find(
        (row) =>
          row.sourceSourceReviewPathStepId ===
          step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId,
      )?.staticSourceFollowUpCueText,
    ]),
  );
  assert.deepEqual(
    sourceReviewReadinessLane.staticSourceFollowUpCueCards.map((card) => [
      card.staticSourceFollowUpCueOrder,
      card.sourceStaticSourceReviewPromptCardId,
      card.sourceStaticSourceReviewPromptCardIds,
      card.sourceSourceReviewReadinessLaneRowIds,
      card.sourceStaticReviewCheckCardId,
      card.sourceSourceCrosswalkReviewPathStepIds,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticSourceReviewPromptLabels,
      card.staticSourceFollowUpCueLabels,
      card.staticReviewCheckText,
      card.staticSourceReviewPromptText,
      card.staticSourceFollowUpCueText,
    ]),
    sourceReviewPath.staticSourceReviewPromptCards.map((card) => [
      card.staticSourceReviewPromptOrder,
      card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      [
        card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      ],
      sourceReviewReadinessLane.staticSourceFollowUpCueCards.find(
        (cueCard) =>
          cueCard.sourceStaticSourceReviewPromptCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      )?.sourceSourceReviewReadinessLaneRowIds,
      card.sourceStaticReviewCheckCardId,
      card.sourceSourceCrosswalkReviewPathStepIds,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticSourceReviewPromptLabels,
      sourceReviewReadinessLane.staticSourceFollowUpCueCards.find(
        (cueCard) =>
          cueCard.sourceStaticSourceReviewPromptCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      )?.staticSourceFollowUpCueLabels,
      card.staticReviewCheckText,
      card.staticSourceReviewPromptText,
      sourceReviewReadinessLane.staticSourceFollowUpCueCards.find(
        (cueCard) =>
          cueCard.sourceStaticSourceReviewPromptCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId,
      )?.staticSourceFollowUpCueText,
    ]),
  );
  assert.ok(
    sourceReviewReadinessLane.sourceReviewReadinessLaneRows.every(
      (row) =>
        row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneRowId.length > 0 &&
        row.sourceReviewReadinessLaneLabels.includes(
          "source-review readiness lane row",
        ) &&
        row.sourceReviewReadinessLaneLabels.includes(
          "static source-follow-up cue carry-forward",
        ) &&
        row.sourceReviewReadinessLaneText.includes(row.sourceSourceReviewPathStepId) &&
        row.sourceReviewReadinessLaneText.includes(row.sourceCrosswalkRowId) &&
        row.staticSourceFollowUpCueText.includes(row.sourceSourceReviewPathStepId) &&
        row.staticNonGoalFlags.noSavedSourceReviewReadinessState &&
        row.staticNonGoalFlags.noSavedSourceReviewReadinessLaneState &&
        row.staticNonGoalFlags.noSavedSourceFollowUpState &&
        row.staticNonGoalFlags.noSavedSourceFollowUpCueState &&
        row.staticNonGoalFlags.noSavedSourceSelections &&
        row.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.ok(
    sourceReviewReadinessLane.staticSourceFollowUpCueCards.every(
      (card) =>
        card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneStaticSourceFollowUpCueCardId.length > 0 &&
        card.staticSourceFollowUpCueLabels.includes(
          "static source-follow-up cue card",
        ) &&
        card.staticSourceFollowUpCueLabels.includes(
          "static source-review prompt carry-forward",
        ) &&
        card.staticSourceFollowUpCueText.includes(
          card.sourceStaticSourceReviewPromptCardId,
        ) &&
        card.staticSourceFollowUpCueText.includes(
          card.sourceStaticReviewCheckCardId,
        ) &&
        card.staticNonGoalFlags.noSavedSourceReviewReadinessState &&
        card.staticNonGoalFlags.noSavedSourceReviewReadinessLaneState &&
        card.staticNonGoalFlags.noSavedStaticSourceFollowUpCues &&
        card.staticNonGoalFlags.noSavedStaticSourceFollowUpCueCards &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.match(missionConsoleSource, /Stage 104 source-review readiness lane/);
  assert.match(missionConsoleSource, /No saved source-review readiness state/);
});
