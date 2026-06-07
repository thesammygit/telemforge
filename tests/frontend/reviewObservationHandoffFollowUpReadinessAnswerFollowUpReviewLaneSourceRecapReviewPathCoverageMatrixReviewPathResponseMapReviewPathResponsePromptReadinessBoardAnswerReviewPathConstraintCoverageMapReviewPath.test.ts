import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 81 constraint-response review path and static response prompts from Stage 80", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const constraintCoverageMap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap;
  const constraintResponseReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath;
  const builtConstraintResponseReviewPath =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPath(
      constraintCoverageMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(constraintCoverageMap);
  assert.ok(constraintResponseReviewPath);
  assert.ok(builtConstraintResponseReviewPath);
  assert.strictEqual(
    builtConstraintResponseReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap,
    constraintCoverageMap,
  );
  assert.equal(
    constraintResponseReviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map_review_path.v1",
  );
  assert.equal(constraintResponseReviewPath.version, 1);
  assert.equal(
    constraintResponseReviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-coverage map constraint-response review path and static response prompts",
  );
  assert.equal(constraintResponseReviewPath.localStatus, "fixture");
  assert.deepEqual(
    constraintResponseReviewPath.summary.defaultConstraintResponseReviewContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapDefaultContext,
    constraintCoverageMap.summary.defaultResponseNoteContext,
  );
  assert.equal(
    constraintResponseReviewPath.summary.defaultConstraintResponseReviewContext
      .defaultConstraintResponseReviewPathStepId,
    constraintResponseReviewPath.defaultConstraintResponseReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
  );
  assert.equal(
    constraintResponseReviewPath.summary.defaultConstraintResponseReviewContext
      .defaultStaticResponseReviewPromptCardId,
    constraintResponseReviewPath.defaultStaticResponseReviewPromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStaticResponsePromptCardId,
  );
  assert.equal(
    constraintResponseReviewPath.summary.counts.constraintResponseReviewPathStepCount,
    constraintCoverageMap.constraintCoverageRows.length,
  );
  assert.equal(
    constraintResponseReviewPath.summary.counts.staticResponseReviewPromptCardCount,
    constraintCoverageMap.staticResponseNotePromptCards.length,
  );
  assert.deepEqual(
    constraintResponseReviewPath.constraintResponseReviewPathSteps.map((step) => [
      step.constraintResponseReviewPathStepOrder,
      step.sourceConstraintCoverageRowId,
      step.sourceStaticResponseNotePromptCardIds,
      step.sourceAnswerReviewPathStepId,
      step.sourceStaticConstraintNoteCardIds,
      step.sourceStaticAnswerCheckCardId,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceStaticResponsePromptCardIds,
      step.sourceResponseMapReviewPathStepId,
      step.sourceResponseMapRowId,
      step.sourceResponseMapStaticFollowUpPromptCardIds,
      step.sourceCoverageReviewPathStepId,
      step.sourceCoverageMatrixRowId,
      step.sourceReviewPathStepId,
      step.sourceSourceRecapRowId,
      step.sourceAnswerFollowUpReviewLaneRowId,
      step.sourceAnswerSourceCrosswalkRowId,
      step.sourceAnswerWalkthroughStepId,
      step.sourceAnswerCoverageRowId,
      step.sourceRehearsalPathStepId,
      step.sourceReviewBoardRowId,
      step.followUpReadinessBriefRowId,
      step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.constraintCoverageLabels,
      step.constraintResponseReviewPathLabels,
      step.staticResponseNotePromptText,
      step.constraintResponseReviewPathText,
      step.staticResponseReviewPromptText,
    ]),
    constraintCoverageMap.constraintCoverageRows.map((row) => {
      const matchedResponseNotePrompts =
        constraintCoverageMap.staticResponseNotePromptCards.filter(
          (card) =>
            card.sourceAnswerReviewPathStepIds.includes(
              row.sourceAnswerReviewPathStepId,
            ) ||
            row.sourceStaticConstraintNoteCardIds.includes(
              card.sourceStaticConstraintNoteCardId,
            ),
        );

      return [
        row.constraintCoverageRowOrder,
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
        matchedResponseNotePrompts.map(
          (card) =>
            card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
        ),
        row.sourceAnswerReviewPathStepId,
        row.sourceStaticConstraintNoteCardIds,
        row.sourceStaticAnswerCheckCardId,
        row.sourceResponsePromptReadinessRowIds,
        row.sourceStaticResponsePromptCardIds,
        row.sourceResponseMapReviewPathStepId,
        row.sourceResponseMapRowId,
        row.sourceResponseMapStaticFollowUpPromptCardIds,
        row.sourceCoverageReviewPathStepId,
        row.sourceCoverageMatrixRowId,
        row.sourceReviewPathStepId,
        row.sourceSourceRecapRowId,
        row.sourceAnswerFollowUpReviewLaneRowId,
        row.sourceAnswerSourceCrosswalkRowId,
        row.sourceAnswerWalkthroughStepId,
        row.sourceAnswerCoverageRowId,
        row.sourceRehearsalPathStepId,
        row.sourceReviewBoardRowId,
        row.followUpReadinessBriefRowId,
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        row.sourceLocalAnchorHrefs,
        row.evidenceCallbackIds,
        row.gapDiscussionPointIds,
        row.deferredScopeReminderIds,
        row.constraintCoverageLabels,
        constraintResponseReviewPath.constraintResponseReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
        )?.constraintResponseReviewPathLabels,
        row.staticResponseNotePromptText,
        constraintResponseReviewPath.constraintResponseReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
        )?.constraintResponseReviewPathText,
        constraintResponseReviewPath.constraintResponseReviewPathSteps.find(
          (step) => step.sourceConstraintCoverageRowId === row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
        )?.staticResponseReviewPromptText,
      ];
    }),
  );
  assert.deepEqual(
    constraintResponseReviewPath.staticResponseReviewPromptCards.map((card) => [
      card.staticResponseReviewPromptOrder,
      card.sourceStaticResponseNotePromptCardId,
      card.sourceStaticConstraintNoteCardId,
      card.sourceConstraintResponseReviewPathStepIds,
      card.sourceAnswerReviewPathStepIds,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponseMapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticResponseNotePromptLabels,
      card.staticResponseReviewPromptLabels,
      card.staticResponseNotePromptText,
      card.staticResponseReviewPromptText,
    ]),
    constraintCoverageMap.staticResponseNotePromptCards.map((responseNotePrompt) => {
      const matchedSteps =
        constraintResponseReviewPath.constraintResponseReviewPathSteps.filter(
          (step) =>
            step.sourceStaticResponseNotePromptCardIds.includes(
              responseNotePrompt.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
            ),
        );

      return [
        responseNotePrompt.staticResponseNotePromptOrder,
        responseNotePrompt
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
        responseNotePrompt.sourceStaticConstraintNoteCardId,
        matchedSteps.map(
          (step) =>
            step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathStepId,
        ),
        responseNotePrompt.sourceAnswerReviewPathStepIds,
        responseNotePrompt.sourceResponsePromptReadinessRowId,
        responseNotePrompt.sourceStaticResponsePromptCardId,
        responseNotePrompt.sourceResponseMapRowIds,
        responseNotePrompt.sourceLocalAnchorHrefs,
        responseNotePrompt.evidenceCallbackIds,
        responseNotePrompt.gapDiscussionPointIds,
        responseNotePrompt.deferredScopeReminderIds,
        responseNotePrompt.staticResponseNotePromptLabels,
        constraintResponseReviewPath.staticResponseReviewPromptCards.find(
          (card) => card.sourceStaticResponseNotePromptCardId === responseNotePrompt.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
        )?.staticResponseReviewPromptLabels,
        responseNotePrompt.staticResponseNotePromptText,
        constraintResponseReviewPath.staticResponseReviewPromptCards.find(
          (card) => card.sourceStaticResponseNotePromptCardId === responseNotePrompt.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
        )?.staticResponseReviewPromptText,
      ];
    }),
  );
  assert.ok(
    constraintResponseReviewPath.constraintResponseReviewPathSteps.every(
      (step) =>
        step.constraintResponseReviewPathLabels.includes(
          "constraint-response review path step",
        ) &&
        step.constraintResponseReviewPathLabels.includes(
          "static response prompt carry-forward",
        ) &&
        step.constraintResponseReviewPathText.includes(
          step.sourceConstraintCoverageRowId,
        ) &&
        step.constraintResponseReviewPathText.includes(
          step.sourceAnswerReviewPathStepId,
        ) &&
        step.staticResponseReviewPromptText.includes(
          step.sourceAnswerReviewPathStepId,
        ) &&
        step.staticNonGoalFlags.noSavedConstraintResponseReviewState &&
        step.staticNonGoalFlags.noSavedReviewPathState &&
        step.staticNonGoalFlags.noSavedResponseReviewPromptState &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.ok(
    constraintResponseReviewPath.staticResponseReviewPromptCards.every(
      (card) =>
        card.staticResponseReviewPromptLabels.includes(
          "static response-review prompt",
        ) &&
        card.staticResponseReviewPromptLabels.includes(
          "response-note prompt carry-forward",
        ) &&
        card.staticResponseReviewPromptText.includes(
          card.sourceStaticResponseNotePromptCardId,
        ) &&
        card.staticResponseReviewPromptText.includes(
          card.sourceResponsePromptReadinessRowId,
        ) &&
        card.staticNonGoalFlags.noSavedConstraintResponseReviewState &&
        card.staticNonGoalFlags.noSavedReviewPathState &&
        card.staticNonGoalFlags.noSavedResponseReviewPromptState &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedResponseNotes,
    ),
  );
  assert.match(
    missionConsoleSource,
    /Stage 81 constraint-response review path/,
  );
  assert.match(
    missionConsoleSource,
    /No saved response-review prompt state/,
  );
});
