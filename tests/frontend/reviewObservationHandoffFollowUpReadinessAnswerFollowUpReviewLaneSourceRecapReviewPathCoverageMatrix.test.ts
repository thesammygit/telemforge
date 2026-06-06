import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 74 source recap review-path coverage rows and static readiness cues from Stage 73", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const reviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath;
  const coverageMatrix =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix;
  const builtCoverageMatrix =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrix(
      reviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(reviewPath);
  assert.ok(coverageMatrix);
  assert.ok(builtCoverageMatrix);
  assert.strictEqual(
    builtCoverageMatrix.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath,
    reviewPath,
  );
  assert.equal(
    coverageMatrix.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix.v1",
  );
  assert.equal(coverageMatrix.version, 1);
  assert.equal(
    coverageMatrix.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage matrix and static readiness cues",
  );
  assert.equal(coverageMatrix.localStatus, "fixture");
  assert.strictEqual(
    coverageMatrix.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPath,
    reviewPath,
  );
  assert.deepEqual(
    coverageMatrix.summary.defaultCoverageContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathDefaultContext,
    reviewPath.summary.defaultReviewPathContext,
  );
  assert.equal(
    coverageMatrix.summary.counts.coverageRowCount,
    reviewPath.reviewPathSteps.length,
  );
  assert.equal(
    coverageMatrix.summary.counts.staticReadinessCueCardCount,
    reviewPath.staticReviewerCheckCards.length,
  );
  assert.deepEqual(
    coverageMatrix.coverageRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixRowOrder,
      row.sourceReviewPathStepId,
      row.sourceReviewPathStepIds,
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
      row.sourceRecapText,
      row.reviewPathText,
      row.staticReviewerCheckText,
    ]),
    reviewPath.reviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepOrder,
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
      [step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId],
      coverageMatrix.coverageRows.find(
        (row) =>
          row.sourceReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
      )?.sourceStaticReviewerCheckCardIds,
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
      coverageMatrix.coverageRows.find(
        (row) =>
          row.sourceReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStepId,
      )?.coverageLabels,
      step.sourceRecapText,
      step.reviewPathText,
      step.staticReviewerCheckText,
    ]),
  );
  assert.deepEqual(
    coverageMatrix.staticReadinessCueCards.map((card) => [
      card.staticReadinessCueOrder,
      card.sourceStaticReviewerCheckCardId,
      card.sourceStaticReviewerCheckCardIds,
      card.sourceStaticNextPassPromptCardId,
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
      card.staticReviewerCheckText,
    ]),
    reviewPath.staticReviewerCheckCards.map((card) => [
      card.staticReviewerCheckOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
      ],
      card.sourceStaticNextPassPromptCardId,
      coverageMatrix.staticReadinessCueCards.find(
        (cueCard) =>
          cueCard.sourceStaticReviewerCheckCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
      )?.matchedCoverageRowIds,
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
      coverageMatrix.staticReadinessCueCards.find(
        (cueCard) =>
          cueCard.sourceStaticReviewerCheckCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathStaticReviewerCheckCardId,
      )?.readinessCueLabels,
      card.staticReviewerCheckText,
    ]),
  );

  const firstCoverageRow = coverageMatrix.coverageRows[0];
  const firstReadinessCueCard = coverageMatrix.staticReadinessCueCards[0];
  assert.ok(
    firstCoverageRow.coverageText.includes(firstCoverageRow.sourceReviewPathStepId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceSourceRecapRowId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceAnswerFollowUpReviewLaneRowId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceAnswerSourceCrosswalkRowId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceAnswerWalkthroughStepId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceAnswerCoverageRowId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceRehearsalPathStepId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.sourceReviewBoardRowId) &&
      firstCoverageRow.coverageText.includes(firstCoverageRow.followUpReadinessBriefRowId) &&
      firstCoverageRow.coverageText.includes(
        firstCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) &&
      firstCoverageRow.readinessCueText.includes(firstCoverageRow.sourceReviewPathStepId) &&
      firstCoverageRow.coverageLabels.includes("review-path coverage row") &&
      firstCoverageRow.coverageLabels.includes("static reviewer-check readiness cue") &&
      firstCoverageRow.coverageLabels.includes("anchor and callback coverage") &&
      firstCoverageRow.coverageLabels.includes("gap and deferred-reminder coverage") &&
      firstCoverageRow.coverageLabels.includes("source-recap carry-forward coverage") &&
      firstCoverageRow.staticNonGoalFlags.noSavedReviewPathState &&
      firstCoverageRow.staticNonGoalFlags.noSavedReviewerChecks &&
      firstCoverageRow.staticNonGoalFlags.noSavedCoverageState &&
      firstCoverageRow.staticNonGoalFlags.noSavedCoverageRows &&
      firstCoverageRow.staticNonGoalFlags.noSavedCoverageMatrix &&
      firstCoverageRow.staticNonGoalFlags.noSavedReadinessCues &&
      firstCoverageRow.staticNonGoalFlags.noSavedReadinessCueCards &&
      firstCoverageRow.staticNonGoalFlags.noSavedReadinessCueState,
  );
  assert.ok(
    firstReadinessCueCard.staticReadinessCueText.includes(
      firstReadinessCueCard.sourceStaticReviewerCheckCardId,
    ) &&
      firstReadinessCueCard.staticReadinessCueText.includes(
        firstReadinessCueCard.sourceStaticNextPassPromptCardId,
      ) &&
      firstReadinessCueCard.staticReadinessCueText.includes(
        firstReadinessCueCard.sourceStaticDecisionCueCardId,
      ) &&
      firstReadinessCueCard.staticReviewerCheckText.includes(
        firstReadinessCueCard.sourceStaticReviewerCheckCardId,
      ) &&
      firstReadinessCueCard.readinessCueLabels.includes(
        "static readiness cue",
      ) &&
      firstReadinessCueCard.readinessCueLabels.includes(
        "review-path source alignment",
      ) &&
      firstReadinessCueCard.staticNonGoalFlags.noSavedReviewerChecks &&
      firstReadinessCueCard.staticNonGoalFlags.noSavedCoverageState &&
      firstReadinessCueCard.staticNonGoalFlags.noSavedReadinessCues &&
      firstReadinessCueCard.staticNonGoalFlags.noSavedReadinessCueCards,
  );
  assert.ok(
    coverageMatrix.coverageRows.every(
      (row) =>
        row.coverageText.includes("deterministic manual-review context") &&
        row.readinessCueText.includes("without saving reviewer answers") &&
        !row.coverageLabels.some(
          (label) =>
            label.includes("priority") ||
            label.includes("score") ||
            label.includes("certification"),
        ),
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Review-path coverage matrix and static readiness cues",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved coverage state"));
  assert.ok(missionConsoleSource.includes("No saved readiness cues"));
});
