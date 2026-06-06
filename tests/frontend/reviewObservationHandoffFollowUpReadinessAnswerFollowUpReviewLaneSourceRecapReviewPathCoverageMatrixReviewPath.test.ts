import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 75 coverage-review steps and static coverage prompts from Stage 74", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const coverageMatrix =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix;
  const coverageReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath;
  const builtCoverageReviewPath =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPath(
      coverageMatrix,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(coverageMatrix);
  assert.ok(coverageReviewPath);
  assert.ok(builtCoverageReviewPath);
  assert.strictEqual(
    builtCoverageReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix,
    coverageMatrix,
  );
  assert.equal(
    coverageReviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path.v1",
  );
  assert.equal(coverageReviewPath.version, 1);
  assert.equal(
    coverageReviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage matrix review path and static coverage prompts",
  );
  assert.equal(coverageReviewPath.localStatus, "fixture");
  assert.deepEqual(
    coverageReviewPath.summary.defaultCoverageReviewContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixDefaultContext,
    coverageMatrix.summary.defaultCoverageContext,
  );
  assert.equal(
    coverageReviewPath.summary.counts.coverageReviewPathStepCount,
    coverageMatrix.coverageRows.length,
  );
  assert.equal(
    coverageReviewPath.summary.counts.staticCoveragePromptCardCount,
    coverageMatrix.staticReadinessCueCards.length,
  );
  assert.deepEqual(
    coverageReviewPath.coverageReviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathStepOrder,
      step.sourceCoverageMatrixRowId,
      step.sourceCoverageMatrixRowIds,
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
      step.laneLabels,
      step.reviewPathLabels,
      step.coverageLabels,
      step.coverageReviewLabels,
      step.sourceRecapText,
      step.reviewPathText,
      step.staticReviewerCheckText,
      step.coverageText,
      step.readinessCueText,
    ]),
    coverageMatrix.coverageRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowOrder,
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
      [
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
      ],
      coverageReviewPath.coverageReviewPathSteps.find(
        (step) =>
          step.sourceCoverageMatrixRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
      )?.sourceStaticReadinessCueCardIds,
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
      row.laneLabels,
      row.reviewPathLabels,
      row.coverageLabels,
      coverageReviewPath.coverageReviewPathSteps.find(
        (step) =>
          step.sourceCoverageMatrixRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowId,
      )?.coverageReviewLabels,
      row.sourceRecapText,
      row.reviewPathText,
      row.staticReviewerCheckText,
      row.coverageText,
      row.readinessCueText,
    ]),
  );
  assert.deepEqual(
    coverageReviewPath.staticCoveragePromptCards.map((card) => [
      card.staticCoveragePromptOrder,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReadinessCueCardIds,
      card.sourceStaticReviewerCheckCardId,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceAnswerCoverageRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.reviewPathLabels,
      card.readinessCueLabels,
      card.coverageReviewLabels,
      card.staticReviewerCheckText,
      card.staticReadinessCueText,
    ]),
    coverageMatrix.staticReadinessCueCards.map((card) => [
      card.staticReadinessCueOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
      ],
      card.sourceStaticReviewerCheckCardId,
      coverageReviewPath.staticCoveragePromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticReadinessCueCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
      )?.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceAnswerCoverageRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.reviewPathLabels,
      card.readinessCueLabels,
      coverageReviewPath.staticCoveragePromptCards.find(
        (promptCard) =>
          promptCard.sourceStaticReadinessCueCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixStaticReadinessCueCardId,
      )?.coverageReviewLabels,
      card.staticReviewerCheckText,
      card.staticReadinessCueText,
    ]),
  );

  const firstCoverageReviewStep = coverageReviewPath.coverageReviewPathSteps[0];
  const firstStaticCoveragePrompt = coverageReviewPath.staticCoveragePromptCards[0];
  assert.ok(
    firstCoverageReviewStep.coverageReviewText.includes(
      firstCoverageReviewStep.sourceCoverageMatrixRowId,
    ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceReviewPathStepId,
      ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceSourceRecapRowId,
      ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceAnswerFollowUpReviewLaneRowId,
      ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceAnswerSourceCrosswalkRowId,
      ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceAnswerWalkthroughStepId,
      ) &&
      firstCoverageReviewStep.coverageReviewText.includes(
        firstCoverageReviewStep.sourceAnswerCoverageRowId,
      ) &&
      firstCoverageReviewStep.staticCoveragePromptText.includes(
        firstCoverageReviewStep.sourceCoverageMatrixRowId,
      ) &&
      firstCoverageReviewStep.coverageReviewLabels.includes(
        "coverage-review path step",
      ) &&
      firstCoverageReviewStep.coverageReviewLabels.includes(
        "static coverage-prompt cue",
      ) &&
      firstCoverageReviewStep.coverageReviewLabels.includes(
        "coverage matrix carry-forward",
      ) &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedCoverageState &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedReadinessCues &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedCoverageReviewState &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedCoverageReviewPathSteps &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedCoveragePrompts &&
      firstCoverageReviewStep.staticNonGoalFlags.noSavedCoveragePromptCards,
  );
  assert.ok(
    firstStaticCoveragePrompt.staticCoveragePromptText.includes(
      firstStaticCoveragePrompt.sourceStaticReadinessCueCardId,
    ) &&
      firstStaticCoveragePrompt.staticCoveragePromptText.includes(
        firstStaticCoveragePrompt.sourceStaticReviewerCheckCardId,
      ) &&
      firstStaticCoveragePrompt.staticCoveragePromptText.includes(
        firstStaticCoveragePrompt.sourceStaticNextPassPromptCardId,
      ) &&
      firstStaticCoveragePrompt.coverageReviewLabels.includes(
        "static coverage prompt",
      ) &&
      firstStaticCoveragePrompt.coverageReviewLabels.includes(
        "readiness-cue carry-forward",
      ) &&
      firstStaticCoveragePrompt.staticNonGoalFlags.noSavedReadinessCues &&
      firstStaticCoveragePrompt.staticNonGoalFlags.noSavedCoverageReviewState &&
      firstStaticCoveragePrompt.staticNonGoalFlags.noSavedCoveragePrompts &&
      firstStaticCoveragePrompt.staticNonGoalFlags.noSavedCoveragePromptCards,
  );
  assert.ok(
    coverageReviewPath.coverageReviewPathSteps.every(
      (step) =>
        step.coverageReviewText.includes("deterministic manual-review context") &&
        step.staticCoveragePromptText.includes("without saving reviewer answers") &&
        !step.coverageReviewLabels.some(
          (label) =>
            label.includes("priority") ||
            label.includes("score") ||
            label.includes("certification"),
        ),
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Coverage-review path and static coverage prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved coverage-review state"));
  assert.ok(missionConsoleSource.includes("No saved coverage prompts"));
});
