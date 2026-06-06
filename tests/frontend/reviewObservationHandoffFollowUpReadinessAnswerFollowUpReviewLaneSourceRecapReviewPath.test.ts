import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 73 source recap review path steps and static reviewer checks from Stage 72", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceRecap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap;
  const reviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath;
  const builtReviewPath =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath(
      sourceRecap,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceRecap);
  assert.ok(reviewPath);
  assert.ok(builtReviewPath);
  assert.strictEqual(
    builtReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap,
    sourceRecap,
  );
  assert.equal(
    reviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path.v1",
  );
  assert.equal(reviewPath.version, 1);
  assert.equal(
    reviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review path and static reviewer checks",
  );
  assert.equal(reviewPath.localStatus, "fixture");
  assert.strictEqual(
    reviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap,
    sourceRecap,
  );
  assert.deepEqual(
    reviewPath.summary.defaultReviewPathContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapDefaultContext,
    sourceRecap.summary.defaultSourceRecapContext,
  );
  assert.equal(
    reviewPath.summary.counts.reviewPathStepCount,
    sourceRecap.sourceRecapRows.length,
  );
  assert.equal(
    reviewPath.summary.counts.staticReviewerCheckCardCount,
    sourceRecap.staticNextPassPromptCards.length,
  );
  assert.deepEqual(
    reviewPath.reviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepOrder,
      step.sourceSourceRecapRowId,
      step.sourceSourceRecapRowIds,
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
      step.sourceRecapText,
      step.staticNextPassPromptText,
      step.reviewPathLabels,
    ]),
    sourceRecap.sourceRecapRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowOrder,
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
      [row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId],
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
      row.sourceRecapText,
      row.staticNextPassPromptText,
      reviewPath.reviewPathSteps.find(
        (step) =>
          step.sourceSourceRecapRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId,
      )?.reviewPathLabels,
    ]),
  );
  assert.deepEqual(
    reviewPath.staticReviewerCheckCards.map((card) => [
      card.staticReviewerCheckOrder,
      card.sourceStaticNextPassPromptCardId,
      card.sourceStaticNextPassPromptCardIds,
      card.sourceStaticDecisionCueCardId,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticReviewNoteCardId,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceAnswerCoverageRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.sourceRecapLabels,
      card.staticNextPassPromptText,
    ]),
    sourceRecap.staticNextPassPromptCards.map((card) => [
      card.staticNextPassPromptOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId,
      ],
      card.sourceStaticDecisionCueCardId,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticReviewNoteCardId,
      card.matchedSourceRecapRowIds,
      card.matchedAnswerFollowUpReviewLaneRowIds,
      card.matchedAnswerSourceCrosswalkRowIds,
      card.sourceAnswerCoverageRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.sourceRecapLabels,
      card.staticNextPassPromptText,
    ]),
  );

  const firstStep = reviewPath.reviewPathSteps[0];
  const firstCard = reviewPath.staticReviewerCheckCards[0];
  assert.ok(
    firstStep.reviewPathText.includes(firstStep.sourceSourceRecapRowId) &&
      firstStep.reviewPathText.includes(firstStep.sourceAnswerFollowUpReviewLaneRowId) &&
      firstStep.reviewPathText.includes(firstStep.sourceAnswerSourceCrosswalkRowId) &&
      firstStep.reviewPathText.includes(firstStep.sourceAnswerWalkthroughStepId) &&
      firstStep.reviewPathText.includes(firstStep.sourceAnswerCoverageRowId) &&
      firstStep.reviewPathText.includes(firstStep.sourceRehearsalPathStepId) &&
      firstStep.reviewPathText.includes(firstStep.sourceReviewBoardRowId) &&
      firstStep.reviewPathText.includes(firstStep.followUpReadinessBriefRowId) &&
      firstStep.reviewPathText.includes(
        firstStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) &&
      firstStep.sourceRecapText.includes(firstStep.sourceSourceRecapRowId) &&
      firstStep.staticNextPassPromptText.includes(firstStep.sourceSourceRecapRowId) &&
      firstStep.staticReviewerCheckText.includes(firstStep.sourceSourceRecapRowId) &&
      firstStep.reviewPathLabels.includes("source-order review step") &&
      firstStep.reviewPathLabels.includes("next-pass prompt comparison") &&
      firstStep.reviewPathLabels.includes("gap-prompt reviewer check") &&
      firstStep.reviewPathLabels.includes("deferred-boundary reviewer check") &&
      firstStep.reviewPathLabels.includes("source-recap label carry-forward") &&
      firstStep.reviewPathLabels.includes("evidence-callback review cue") &&
      firstStep.staticNonGoalFlags.noSavedAnswerFollowUpReviewLaneState &&
      firstStep.staticNonGoalFlags.noSavedFollowUpLaneState &&
      firstStep.staticNonGoalFlags.noSavedDecisionCues &&
      firstStep.staticNonGoalFlags.noSavedSourceRecapState &&
      firstStep.staticNonGoalFlags.noSavedNextPassPrompts &&
      firstStep.staticNonGoalFlags.noSavedReviewPathState &&
      firstStep.staticNonGoalFlags.noSavedReviewPathSteps &&
      firstStep.staticNonGoalFlags.noSavedReviewerChecks &&
      firstStep.staticNonGoalFlags.noSavedReviewerCheckCards &&
      firstStep.staticNonGoalFlags.noSavedReviewerDecisions,
  );
  assert.ok(
    firstCard.staticReviewerCheckText.includes(
      firstCard.sourceStaticNextPassPromptCardId,
    ) &&
      firstCard.staticReviewerCheckText.includes(
        firstCard.sourceStaticDecisionCueCardId,
      ) &&
      firstCard.staticReviewerCheckText.includes(
        firstCard.sourceStaticFollowUpPromptCardId,
      ) &&
      firstCard.staticReviewerCheckText.includes(
        firstCard.sourceStaticReviewNoteCardId,
      ) &&
      firstCard.staticNextPassPromptText.includes(
        firstCard.sourceStaticNextPassPromptCardId,
      ) &&
      firstCard.staticNonGoalFlags.noSavedSourceRecapState &&
      firstCard.staticNonGoalFlags.noSavedNextPassPrompts &&
      firstCard.staticNonGoalFlags.noSavedReviewPathState &&
      firstCard.staticNonGoalFlags.noSavedReviewerChecks &&
      firstCard.staticNonGoalFlags.noSavedReviewerCheckCards,
  );
  assert.ok(
    reviewPath.reviewPathSteps.every(
      (step) =>
        step.reviewPathText.includes("deterministic manual-review context") &&
        step.staticReviewerCheckText.includes("without saving reviewer answers") &&
        !step.reviewPathLabels.some(
          (label) =>
            label.includes("priority") ||
            label.includes("score") ||
            label.includes("certification"),
        ),
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Source recap review path and static reviewer checks",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved review-path state"));
  assert.ok(missionConsoleSource.includes("No saved reviewer checks"));
});
