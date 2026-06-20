import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 122 source crosswalk derives review checks from Stage 121", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 122 helper module to exist: ${error.message}`),
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceReviewPath =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath;
  const sourceCrosswalk =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk;
  const builtSourceCrosswalk =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalk(
      sourceReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceReviewPath);
  assert.ok(sourceCrosswalk);
  assert.ok(builtSourceCrosswalk);
  assert.deepEqual(sourceCrosswalk, builtSourceCrosswalk);
  assert.strictEqual(
    sourceCrosswalk.sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath,
    sourceReviewPath,
  );
  assert.equal(
    sourceCrosswalk.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path_source_crosswalk.v1",
  );
  assert.equal(
    sourceCrosswalk.contractLabel,
    "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path source crosswalk and static review checks",
  );
  assert.deepEqual(
    sourceCrosswalk.summary.defaultSourceCheckContext
      .sourceStage121DefaultResponsePromptContext,
    sourceReviewPath.summary.defaultResponsePromptContext,
  );
  assert.equal(
    sourceCrosswalk.summary.defaultSourceCheckContext.defaultConstraintCoverageReviewPathStepId,
    sourceCrosswalk.defaultSourceCrosswalkRow.sourceConstraintCoverageReviewPathStepId,
  );
  assert.equal(
    sourceCrosswalk.summary.defaultSourceCheckContext.defaultStaticResponsePromptCardId,
    sourceCrosswalk.defaultStaticReviewCheckCard.sourceStaticResponsePromptCardId,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.sourceCrosswalkRowCount,
    sourceReviewPath.constraintCoverageReviewPathSteps.length,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.staticReviewCheckCardCount,
    sourceReviewPath.staticResponsePromptCards.length,
  );
  assert.deepEqual(
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.sourceCrosswalkRowOrder,
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
      row.constraintCoverageReviewPathLabels,
      row.sourceCrosswalkLabels,
      row.constraintCoverageReviewPathText,
      row.staticResponsePromptText,
      row.sourceCrosswalkText,
      row.staticReviewCheckText,
    ]),
    sourceReviewPath.constraintCoverageReviewPathSteps.map((step) => [
      step.constraintCoverageReviewPathStepOrder,
      step.constraintCoverageReviewPathStepId,
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
      step.constraintCoverageReviewPathLabels,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintCoverageReviewPathStepId ===
          step.constraintCoverageReviewPathStepId,
      )?.sourceCrosswalkLabels,
      step.constraintCoverageReviewPathText,
      step.staticResponsePromptText,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintCoverageReviewPathStepId ===
          step.constraintCoverageReviewPathStepId,
      )?.sourceCrosswalkText,
      sourceCrosswalk.sourceCrosswalkRows.find(
        (row) =>
          row.sourceConstraintCoverageReviewPathStepId ===
          step.constraintCoverageReviewPathStepId,
      )?.staticReviewCheckText,
    ]),
  );
  assert.deepEqual(
    sourceCrosswalk.staticReviewCheckCards.map((card) => [
      card.staticReviewCheckOrder,
      card.sourceStaticResponsePromptCardId,
      card.sourceConstraintCoverageReviewPathStepIds,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticResponsePromptCardId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticResponsePromptLabels,
      card.staticReviewCheckLabels,
      card.staticResponsePromptText,
      card.staticReviewCheckText,
    ]),
    sourceReviewPath.staticResponsePromptCards.map((card) => [
      card.staticResponsePromptOrder,
      card.staticResponsePromptCardId,
      sourceCrosswalk.sourceCrosswalkRows
        .filter((row) =>
          row.sourceStaticResponsePromptCardIds.includes(
            card.staticResponsePromptCardId,
          ),
        )
        .map((row) => row.sourceConstraintCoverageReviewPathStepId),
      card.sourceStaticResponseNotePromptCardId,
      card.sourceResponsePromptReadinessRowId,
      card.staticResponsePromptCardId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticResponsePromptLabels,
      sourceCrosswalk.staticReviewCheckCards.find(
        (checkCard) =>
          checkCard.sourceStaticResponsePromptCardId ===
          card.staticResponsePromptCardId,
      )?.staticReviewCheckLabels,
      card.staticResponsePromptText,
      sourceCrosswalk.staticReviewCheckCards.find(
        (checkCard) =>
          checkCard.sourceStaticResponsePromptCardId ===
          card.staticResponsePromptCardId,
      )?.staticReviewCheckText,
    ]),
  );
  assert.deepEqual(
    sourceCrosswalk.sourceCrosswalkRows.map((row) => row.sourceCrosswalkRowOrder),
    sourceReviewPath.constraintCoverageReviewPathSteps.map(
      (step) => step.constraintCoverageReviewPathStepOrder,
    ),
  );
  assert.deepEqual(
    sourceCrosswalk.staticReviewCheckCards.map(
      (card) => card.staticReviewCheckOrder,
    ),
    sourceReviewPath.staticResponsePromptCards.map(
      (card) => card.staticResponsePromptOrder,
    ),
  );
  assert.ok(
    sourceCrosswalk.sourceCrosswalkRows.every(
      (row) =>
        row.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkRowId.length > 0 &&
        row.sourceCrosswalkLabels.includes(
          "constraint-response source crosswalk row",
        ) &&
        row.sourceCrosswalkLabels.includes("static review-check source chain") &&
        row.sourceCrosswalkText.includes(
          row.sourceConstraintCoverageReviewPathStepId,
        ) &&
        row.sourceCrosswalkText.includes(row.sourceStaticResponsePromptCardIds[0]) &&
        row.sourceCrosswalkText.includes(row.sourceConstraintCoverageRowId) &&
        row.staticReviewCheckText.includes(
          row.sourceConstraintCoverageReviewPathStepId,
        ) &&
        row.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        row.staticNonGoalFlags.noSavedSourceSelections &&
        row.staticNonGoalFlags.noSavedSourceCheckState &&
        row.staticNonGoalFlags.noSavedStaticReviewChecks &&
        row.staticNonGoalFlags.noSavedResponseReviewState &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.ok(
    sourceCrosswalk.staticReviewCheckCards.every(
      (card) =>
        card.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkStaticReviewCheckCardId.length > 0 &&
        card.staticReviewCheckLabels.includes("static review-check card") &&
        card.staticReviewCheckLabels.includes("response-prompt source check") &&
        card.staticReviewCheckText.includes(card.sourceStaticResponsePromptCardId) &&
        card.staticReviewCheckText.includes(card.sourceResponsePromptReadinessRowId) &&
        card.staticNonGoalFlags.noSavedSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedSourceSelections &&
        card.staticNonGoalFlags.noSavedSourceCheckState &&
        card.staticNonGoalFlags.noSavedStaticReviewChecks &&
        card.staticNonGoalFlags.noSavedResponseReviewState &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.match(missionConsoleSource, /Stage 122 source crosswalk/);
  assert.match(missionConsoleSource, /No saved review-check state/);
});
