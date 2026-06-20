import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 121 constraint-coverage review path derives response prompts from Stage 120", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 121 helper module to exist: ${error.message}`),
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceConstraintCoverageMap =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap;
  const viewReviewPath =
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath;
  const builtReviewPath =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath(
      sourceConstraintCoverageMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceConstraintCoverageMap);
  assert.ok(viewReviewPath);
  assert.ok(builtReviewPath);
  assert.deepEqual(viewReviewPath, builtReviewPath);
  assert.strictEqual(
    builtReviewPath.sourceConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap,
    sourceConstraintCoverageMap,
  );
  assert.equal(
    viewReviewPath.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path.v1",
  );
  assert.equal(
    viewReviewPath.contractLabel,
    "local deterministic constraint-response revision coverage review-path revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map review path and static response prompts",
  );
  assert.deepEqual(
    viewReviewPath.summary.defaultResponsePromptContext
      .sourceStage120DefaultResponseNoteContext,
    sourceConstraintCoverageMap.summary.defaultResponseNoteContext,
  );
  assert.equal(
    viewReviewPath.summary.counts.constraintCoverageReviewPathStepCount,
    sourceConstraintCoverageMap.constraintCoverageRows.length,
  );
  assert.equal(
    viewReviewPath.summary.counts.staticResponsePromptCardCount,
    sourceConstraintCoverageMap.staticResponseNotePromptCards.length,
  );

  assert.deepEqual(
    viewReviewPath.constraintCoverageReviewPathSteps.map((step) => [
      step.constraintCoverageReviewPathStepOrder,
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
      step.constraintCoverageLabels,
      step.constraintCoverageReviewPathLabels,
      step.constraintCoverageText,
      step.staticResponseNotePromptText,
      step.constraintCoverageReviewPathText,
      step.staticResponsePromptText,
    ]),
    sourceConstraintCoverageMap.constraintCoverageRows.map((row) => {
      const matchedResponseNotePrompts =
        sourceConstraintCoverageMap.staticResponseNotePromptCards.filter(
          (card) =>
            card.sourceAnswerReviewPathStepIds.includes(
              row.sourceAnswerReviewPathStepId,
            ) ||
            row.sourceStaticConstraintNoteCardIds.includes(
              card.sourceStaticConstraintNoteCardId,
            ) ||
            row.sourceResponsePromptReadinessRowIds.includes(
              card.sourceResponsePromptReadinessRowId,
            ) ||
            row.sourceStaticResponsePromptCardIds.some((sourcePromptCardId) =>
              card.sourceStaticResponsePromptCardIds.includes(sourcePromptCardId),
            ),
        );

      return [
        row.constraintCoverageRowOrder,
        row.constraintCoverageRowId,
        matchedResponseNotePrompts.map(
          (card) => card.staticResponseNotePromptCardId,
        ),
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
        row.constraintCoverageLabels,
        viewReviewPath.constraintCoverageReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.constraintCoverageRowId,
        )?.constraintCoverageReviewPathLabels,
        row.constraintCoverageText,
        row.staticResponseNotePromptText,
        viewReviewPath.constraintCoverageReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.constraintCoverageRowId,
        )?.constraintCoverageReviewPathText,
        viewReviewPath.constraintCoverageReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.constraintCoverageRowId,
        )?.staticResponsePromptText,
      ];
    }),
  );

  assert.deepEqual(
    viewReviewPath.staticResponsePromptCards.map((card) => [
      card.staticResponsePromptOrder,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceStaticConstraintNoteCardId,
      card.sourceConstraintCoverageReviewPathStepIds,
      card.sourceAnswerReviewPathStepIds,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticResponsePromptCardIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticResponseNotePromptLabels,
      card.staticResponsePromptLabels,
      card.staticResponseNotePromptText,
      card.staticResponsePromptText,
    ]),
    sourceConstraintCoverageMap.staticResponseNotePromptCards.map((promptCard) => {
      const matchedSteps =
        viewReviewPath.constraintCoverageReviewPathSteps.filter((step) =>
          step.sourceStaticResponseNotePromptCardIds.includes(
            promptCard.staticResponseNotePromptCardId,
          ),
        );

      return [
        promptCard.staticResponseNotePromptOrder,
        promptCard.staticResponseNotePromptCardId,
        promptCard.sourceStaticConstraintNoteCardId,
        matchedSteps.map((step) => step.constraintCoverageReviewPathStepId),
        promptCard.sourceAnswerReviewPathStepIds,
        promptCard.sourceResponsePromptReadinessRowId,
        promptCard.sourceStaticResponsePromptCardIds,
        promptCard.sourceLocalAnchorHrefs,
        promptCard.evidenceCallbackIds,
        promptCard.gapDiscussionPointIds,
        promptCard.deferredScopeReminderIds,
        promptCard.staticResponseNotePromptLabels,
        viewReviewPath.staticResponsePromptCards.find(
          (card) =>
            card.sourceStaticResponseNotePromptCardId ===
            promptCard.staticResponseNotePromptCardId,
        )?.staticResponsePromptLabels,
        promptCard.staticResponseNotePromptText,
        viewReviewPath.staticResponsePromptCards.find(
          (card) =>
            card.sourceStaticResponseNotePromptCardId ===
            promptCard.staticResponseNotePromptCardId,
        )?.staticResponsePromptText,
      ];
    }),
  );

  assert.ok(
    viewReviewPath.constraintCoverageReviewPathSteps.every(
      (step) =>
        step.constraintCoverageReviewPathLabels.includes(
          "constraint-coverage review path step",
        ) &&
        step.constraintCoverageReviewPathLabels.includes(
          "static response-prompt carry-forward",
        ) &&
        step.constraintCoverageReviewPathText.includes(
          step.sourceConstraintCoverageRowId,
        ) &&
        step.constraintCoverageReviewPathText.includes(
          step.sourceAnswerReviewPathStepId,
        ) &&
        step.staticResponsePromptText.includes(step.sourceAnswerReviewPathStepId) &&
        step.staticNonGoalFlags.noSavedConstraintCoverageReviewState &&
        step.staticNonGoalFlags.noSavedReviewPathState &&
        step.staticNonGoalFlags.noSavedResponsePromptState &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.ok(
    viewReviewPath.staticResponsePromptCards.every(
      (card) =>
        card.staticResponsePromptLabels.includes("static response prompt") &&
        card.staticResponsePromptLabels.includes(
          "response-note prompt carry-forward",
        ) &&
        card.staticResponsePromptText.includes(
          card.sourceStaticResponseNotePromptCardId,
        ) &&
        card.staticResponsePromptText.includes(
          card.sourceResponsePromptReadinessRowId,
        ) &&
        card.staticNonGoalFlags.noSavedConstraintCoverageReviewState &&
        card.staticNonGoalFlags.noSavedReviewPathState &&
        card.staticNonGoalFlags.noSavedResponsePromptState &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.match(missionConsoleSource, /Stage 121 constraint coverage review path/);
  assert.match(missionConsoleSource, /No saved response-prompt state/);
});
