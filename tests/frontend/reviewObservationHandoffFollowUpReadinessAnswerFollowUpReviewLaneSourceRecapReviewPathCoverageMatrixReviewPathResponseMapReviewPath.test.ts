import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 77 response-map review path and static response prompts from Stage 76", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseMap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap;
  const reviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath;
  const builtReviewPath =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath(
      responseMap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(responseMap);
  assert.ok(reviewPath);
  assert.ok(builtReviewPath);
  assert.strictEqual(
    builtReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap,
    responseMap,
  );
  assert.equal(
    reviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path.v1",
  );
  assert.equal(reviewPath.version, 1);
  assert.equal(
    reviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review path and static response prompts",
  );
  assert.equal(reviewPath.localStatus, "fixture");
  assert.deepEqual(
    reviewPath.summary.defaultReviewPathContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapDefaultContext,
    responseMap.summary.defaultResponseMapContext,
  );
  assert.equal(
    reviewPath.summary.defaultReviewPathContext.defaultResponseMapReviewPathStepId,
    reviewPath.defaultReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
  );
  assert.equal(
    reviewPath.summary.defaultReviewPathContext.defaultStaticResponsePromptCardId,
    reviewPath.defaultStaticResponsePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
  );
  assert.equal(
    reviewPath.summary.counts.responseMapReviewPathStepCount,
    responseMap.responseMapRows.length,
  );
  assert.equal(
    reviewPath.summary.counts.staticResponsePromptCardCount,
    responseMap.staticFollowUpPromptCards.length,
  );
  assert.equal(
    reviewPath.summary.counts.responseMapRowCount,
    responseMap.summary.counts.responseMapRowCount,
  );
  assert.equal(
    reviewPath.summary.counts.staticFollowUpPromptCardCount,
    responseMap.summary.counts.staticFollowUpPromptCardCount,
  );
  assert.deepEqual(
    reviewPath.responseMapReviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepOrder,
      step.sourceResponseMapRowId,
      step.sourceResponseMapRowIds,
      step.sourceResponseMapStaticFollowUpPromptCardIds,
      step.sourceCoverageReviewPathStepId,
      step.sourceStaticCoveragePromptCardIds,
      step.sourceCoverageMatrixRowId,
      step.sourceStaticReadinessCueCardIds,
      step.sourceReviewPathStepId,
      step.sourceStaticReviewerCheckCardIds,
      step.sourceSourceRecapRowId,
      step.sourceStaticNextPassPromptCardIds,
      step.sourceAnswerFollowUpReviewLaneRowId,
      step.sourceStaticDecisionCueCardIds,
      step.sourceAnswerSourceCrosswalkRowId,
      step.sourceStaticFollowUpPromptCardIds,
      step.sourceAnswerWalkthroughStepId,
      step.sourceStaticReviewNoteCardIds,
      step.sourceAnswerCoverageRowId,
      step.sourceStaticReviewerCheckPromptCardIds,
      step.sourceRehearsalPathStepId,
      step.sourceStaticAnswerPrepPromptCardIds,
      step.sourceReviewBoardRowId,
      step.matchedStaticQuestionPromptCardIds,
      step.followUpReadinessBriefRowId,
      step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.responseMapLabels,
      step.responseMapReviewPathLabels,
      step.responsePromptLabels,
      step.responseMapText,
      step.staticFollowUpPromptText,
    ]),
    responseMap.responseMapRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowOrder,
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
      [
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
      ],
      reviewPath.responseMapReviewPathSteps.find(
        (step) =>
          step.sourceResponseMapRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
      )?.sourceResponseMapStaticFollowUpPromptCardIds,
      row.sourceCoverageReviewPathStepId,
      row.sourceStaticCoveragePromptCardIds,
      row.sourceCoverageMatrixRowId,
      row.sourceStaticReadinessCueCardIds,
      row.sourceReviewPathStepId,
      row.sourceStaticReviewerCheckCardIds,
      row.sourceSourceRecapRowId,
      row.sourceStaticNextPassPromptCardIds,
      row.sourceAnswerFollowUpReviewLaneRowId,
      row.sourceStaticDecisionCueCardIds,
      row.sourceAnswerSourceCrosswalkRowId,
      row.sourceStaticFollowUpPromptCardIds,
      row.sourceAnswerWalkthroughStepId,
      row.sourceStaticReviewNoteCardIds,
      row.sourceAnswerCoverageRowId,
      row.sourceStaticReviewerCheckPromptCardIds,
      row.sourceRehearsalPathStepId,
      row.sourceStaticAnswerPrepPromptCardIds,
      row.sourceReviewBoardRowId,
      row.matchedStaticQuestionPromptCardIds,
      row.followUpReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responseMapLabels,
      reviewPath.responseMapReviewPathSteps.find(
        (step) =>
          step.sourceResponseMapRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
      )?.responseMapReviewPathLabels,
      reviewPath.responseMapReviewPathSteps.find(
        (step) =>
          step.sourceResponseMapRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
      )?.responsePromptLabels,
      row.responseMapText,
      row.staticFollowUpPromptText,
    ]),
  );
  assert.deepEqual(
    reviewPath.staticResponsePromptCards.map((card) => [
      card.staticResponsePromptOrder,
      card.sourceResponseMapStaticFollowUpPromptCardId,
      card.sourceResponseMapStaticFollowUpPromptCardIds,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticCoveragePromptCardId,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      card.matchedResponseMapReviewPathStepIds,
      card.matchedResponseMapRowIds,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseMapLabels,
      card.responsePromptLabels,
      card.staticFollowUpPromptText,
    ]),
    responseMap.staticFollowUpPromptCards.map((card) => [
      card.staticFollowUpPromptOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
      ],
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticCoveragePromptCardId,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      reviewPath.staticResponsePromptCards.find(
        (promptCard) =>
          promptCard.sourceResponseMapStaticFollowUpPromptCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
      )?.matchedResponseMapReviewPathStepIds,
      card.matchedResponseMapRowIds,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseMapLabels,
      reviewPath.staticResponsePromptCards.find(
        (promptCard) =>
          promptCard.sourceResponseMapStaticFollowUpPromptCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
      )?.responsePromptLabels,
      card.staticFollowUpPromptText,
    ]),
  );

  const firstReviewPathStep = reviewPath.responseMapReviewPathSteps[0];
  const firstStaticResponsePrompt = reviewPath.staticResponsePromptCards[0];
  const labelBoundary = /priority|ranking|score|certification|decision/i;
  assert.ok(
    firstReviewPathStep.responseMapReviewPathText.includes(
      firstReviewPathStep.sourceResponseMapRowId,
    ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceCoverageReviewPathStepId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceCoverageMatrixRowId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceReviewPathStepId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceSourceRecapRowId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceAnswerSourceCrosswalkRowId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceAnswerWalkthroughStepId,
      ) &&
      firstReviewPathStep.responseMapReviewPathText.includes(
        firstReviewPathStep.sourceAnswerCoverageRowId,
      ) &&
      firstReviewPathStep.staticResponsePromptText.includes(
        firstReviewPathStep.sourceResponseMapRowId,
      ) &&
      firstReviewPathStep.responseMapReviewPathLabels.includes(
        "response-map review path step",
      ) &&
      firstReviewPathStep.responseMapReviewPathLabels.includes(
        "static response-prompt cue",
      ) &&
      firstReviewPathStep.responsePromptLabels.includes(
        "manual response prompt context",
      ) &&
      firstReviewPathStep.responsePromptLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstReviewPathStep.staticNonGoalFlags.noSavedResponseMapState &&
      firstReviewPathStep.staticNonGoalFlags.noSavedResponseMapReviewPathState &&
      firstReviewPathStep.staticNonGoalFlags.noSavedResponsePrompts &&
      firstReviewPathStep.staticNonGoalFlags.noSavedResponsePromptCards,
  );
  assert.ok(
    firstStaticResponsePrompt.staticResponsePromptText.includes(
      firstStaticResponsePrompt.sourceResponseMapStaticFollowUpPromptCardId,
    ) &&
      firstStaticResponsePrompt.staticResponsePromptText.includes(
        firstStaticResponsePrompt.sourceStaticCoveragePromptCardId,
      ) &&
      firstStaticResponsePrompt.staticResponsePromptText.includes(
        firstStaticResponsePrompt.sourceStaticReadinessCueCardId,
      ) &&
      firstStaticResponsePrompt.responsePromptLabels.includes(
        "static response prompt",
      ) &&
      firstStaticResponsePrompt.responsePromptLabels.includes(
        "follow-up prompt carry-forward",
      ) &&
      firstStaticResponsePrompt.responsePromptLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstStaticResponsePrompt.staticNonGoalFlags.noSavedResponseMapReviewPathState &&
      firstStaticResponsePrompt.staticNonGoalFlags.noSavedResponsePrompts &&
      firstStaticResponsePrompt.staticNonGoalFlags.noSavedResponsePromptCards,
  );
  assert.ok(
    missionConsoleSource.includes("Stage 77 response-map review path") &&
      missionConsoleSource.includes(
        "Review path and static response prompts",
      ) &&
      missionConsoleSource.includes("No saved response-map review-path state") &&
      missionConsoleSource.includes("No saved response prompts") &&
      missionConsoleSource.includes(
        "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path",
      ),
  );
});
