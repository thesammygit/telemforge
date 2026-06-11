import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath derives Stage 103 source-review path from Stage 102", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 103 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCrosswalk =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk;
  const sourceReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath;
  const builtSourceReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPath(
      sourceCrosswalk,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceCrosswalk);
  assert.ok(sourceReviewPath);
  assert.ok(builtSourceReviewPath);
  assert.deepEqual(sourceReviewPath, builtSourceReviewPath);
  assert.strictEqual(
    sourceReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk,
    sourceCrosswalk,
  );
  assert.equal(
    sourceReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk_review_path.v1",
  );
  assert.equal(
    sourceReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source-crosswalk review path and static source-review prompts",
  );
  assert.equal(sourceReviewPath.localStatus, "fixture");
  assert.deepEqual(
    sourceReviewPath.summary.defaultSourceReviewContext
      .sourceStage102DefaultSourceCheckContext,
    sourceCrosswalk.summary.defaultSourceCheckContext,
  );
  assert.equal(
    sourceReviewPath.summary.defaultSourceReviewContext.defaultSourceCrosswalkRowId,
    sourceReviewPath.defaultSourceReviewPathStep.sourceCrosswalkRowId,
  );
  assert.equal(
    sourceReviewPath.summary.defaultSourceReviewContext.defaultStaticReviewCheckCardId,
    sourceReviewPath.defaultStaticSourceReviewPromptCard
      .sourceStaticReviewCheckCardId,
  );
  assert.equal(
    sourceReviewPath.summary.counts.sourceReviewPathStepCount,
    sourceCrosswalk.sourceCrosswalkRows.length,
  );
  assert.equal(
    sourceReviewPath.summary.counts.staticSourceReviewPromptCardCount,
    sourceCrosswalk.staticReviewCheckCards.length,
  );
  assert.deepEqual(
    sourceReviewPath.sourceReviewPathSteps.map((step) => [
      step.sourceReviewPathStepOrder,
      step.sourceCrosswalkRowId,
      step.sourceCrosswalkRowIds,
      step.sourceStaticReviewCheckCardIds,
      step.sourceConstraintCoverageReviewPathStepId,
      step.sourceStaticResponsePromptCardIds,
      step.sourceConstraintCoverageRowId,
      step.sourceStaticResponseNotePromptCardIds,
      step.sourceAnswerReviewPathStepId,
      step.sourceStaticConstraintNoteCardIds,
      step.sourceStaticAnswerCheckCardId,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceStaticResponsePromptCardIds,
      step.sourceRevisionFollowUpReadinessReviewPathStepIds,
      step.sourceRevisionFollowUpReadinessRowIds,
      step.sourceStaticResponseCheckCardId,
      step.sourceStaticRevisionFollowUpPromptCardId,
      step.sourceRevisionCoverageReviewPathStepId,
      step.sourceRevisionCoverageRowId,
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
      step.sourceCrosswalkText,
      step.staticReviewCheckText,
      step.sourceReviewPathText,
      step.staticSourceReviewPromptText,
    ]),
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.sourceCrosswalkRowOrder,
      row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowIds,
      sourceReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.sourceStaticReviewCheckCardIds,
      row.sourceConstraintCoverageReviewPathStepId,
      row.sourceStaticResponsePromptCardIds,
      row.sourceConstraintCoverageRowId,
      row.sourceStaticResponseNotePromptCardIds,
      row.sourceAnswerReviewPathStepId,
      row.sourceStaticConstraintNoteCardIds,
      row.sourceStaticAnswerCheckCardId,
      row.sourceResponsePromptReadinessRowIds,
      row.sourceStaticResponsePromptCardIds,
      row.sourceRevisionFollowUpReadinessReviewPathStepIds,
      row.sourceRevisionFollowUpReadinessRowIds,
      row.sourceStaticResponseCheckCardId,
      row.sourceStaticRevisionFollowUpPromptCardId,
      row.sourceRevisionCoverageReviewPathStepId,
      row.sourceRevisionCoverageRowId,
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
      sourceReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.sourceReviewPathLabels,
      row.sourceCrosswalkText,
      row.staticReviewCheckText,
      sourceReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.sourceReviewPathText,
      sourceReviewPath.sourceReviewPathSteps.find(
        (step) =>
          step.sourceCrosswalkRowId ===
          row.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId,
      )?.staticSourceReviewPromptText,
    ]),
  );
  assert.deepEqual(
    sourceReviewPath.staticSourceReviewPromptCards.map((card) => [
      card.staticSourceReviewPromptOrder,
      card.sourceStaticReviewCheckCardId,
      card.sourceStaticReviewCheckCardIds,
      card.sourceSourceCrosswalkReviewPathStepIds,
      card.sourceStaticResponsePromptCardId,
      card.sourceConstraintCoverageReviewPathStepIds,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticReviewCheckLabels,
      card.staticSourceReviewPromptLabels,
      card.staticReviewCheckText,
      card.staticSourceReviewPromptText,
    ]),
    sourceCrosswalk.staticReviewCheckCards.map((card) => [
      card.staticReviewCheckOrder,
      card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardIds,
      sourceReviewPath.staticSourceReviewPromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticReviewCheckCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      )?.sourceSourceCrosswalkReviewPathStepIds,
      card.sourceStaticResponsePromptCardId,
      card.sourceConstraintCoverageReviewPathStepIds,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticReviewCheckLabels,
      sourceReviewPath.staticSourceReviewPromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticReviewCheckCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      )?.staticSourceReviewPromptLabels,
      card.staticReviewCheckText,
      sourceReviewPath.staticSourceReviewPromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticReviewCheckCardId ===
          card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId,
      )?.staticSourceReviewPromptText,
    ]),
  );
  assert.ok(
    sourceReviewPath.sourceReviewPathSteps.every(
      (step) =>
        step.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStepId.length > 0 &&
        step.sourceReviewPathLabels.includes("source-crosswalk review path step") &&
        step.sourceReviewPathLabels.includes("static source-review prompt carry-forward") &&
        step.sourceReviewPathText.includes(step.sourceCrosswalkRowId) &&
        step.sourceReviewPathText.includes(step.sourceStaticReviewCheckCardIds[0]) &&
        step.staticSourceReviewPromptText.includes(step.sourceCrosswalkRowId) &&
        step.staticNonGoalFlags.noSavedSourceReviewState &&
        step.staticNonGoalFlags.noSavedSourceReviewPathState &&
        step.staticNonGoalFlags.noSavedStaticSourceReviewPrompts &&
        step.staticNonGoalFlags.noSavedSourceReviewSelections &&
        step.staticNonGoalFlags.noSavedSourceCrosswalkReviewPathState &&
        step.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        step.staticNonGoalFlags.noSavedSourceSelections &&
        step.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.ok(
    sourceReviewPath.staticSourceReviewPromptCards.every(
      (card) =>
        card.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathStaticSourceReviewPromptCardId.length > 0 &&
        card.staticSourceReviewPromptLabels.includes(
          "static source-review prompt card",
        ) &&
        card.staticSourceReviewPromptLabels.includes("static review-check carry-forward") &&
        card.staticSourceReviewPromptText.includes(card.sourceStaticReviewCheckCardId) &&
        card.staticSourceReviewPromptText.includes(card.sourceResponsePromptReadinessRowId) &&
        card.staticNonGoalFlags.noSavedSourceReviewState &&
        card.staticNonGoalFlags.noSavedSourceReviewPathState &&
        card.staticNonGoalFlags.noSavedStaticSourceReviewPrompts &&
        card.staticNonGoalFlags.noSavedSourceReviewSelections &&
        card.staticNonGoalFlags.noSavedSourceCrosswalkReviewPathState &&
        card.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
  assert.match(missionConsoleSource, /Stage 103 source-review path/);
  assert.match(missionConsoleSource, /No saved source-review state/);
});
