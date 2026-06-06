import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 72 source recap rows and static next-pass prompts from Stage 71", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerFollowUpReviewLane =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane;
  const answerFollowUpReviewLaneSourceRecap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap;
  const builtAnswerFollowUpReviewLaneSourceRecap =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecap(
      answerFollowUpReviewLane,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerFollowUpReviewLane);
  assert.ok(answerFollowUpReviewLaneSourceRecap);
  assert.ok(builtAnswerFollowUpReviewLaneSourceRecap);
  assert.strictEqual(
    builtAnswerFollowUpReviewLaneSourceRecap.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane,
    answerFollowUpReviewLane,
  );
  assert.equal(
    answerFollowUpReviewLaneSourceRecap.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap.v1",
  );
  assert.equal(answerFollowUpReviewLaneSourceRecap.version, 1);
  assert.equal(
    answerFollowUpReviewLaneSourceRecap.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap and static next-pass prompts",
  );
  assert.equal(answerFollowUpReviewLaneSourceRecap.localStatus, "fixture");
  assert.strictEqual(
    answerFollowUpReviewLaneSourceRecap.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane,
    answerFollowUpReviewLane,
  );
  assert.deepEqual(
    answerFollowUpReviewLaneSourceRecap.summary.defaultSourceRecapContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneDefaultContext,
    answerFollowUpReviewLane.summary.defaultAnswerFollowUpReviewLaneContext,
  );
  assert.equal(
    answerFollowUpReviewLaneSourceRecap.summary.counts.sourceRecapRowCount,
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.length,
  );
  assert.equal(
    answerFollowUpReviewLaneSourceRecap.summary.counts.staticNextPassPromptCardCount,
    answerFollowUpReviewLane.staticDecisionCueCards.length,
  );
  assert.deepEqual(
    answerFollowUpReviewLaneSourceRecap.sourceRecapRows.map(
      (row) => row.sourceAnswerFollowUpReviewLaneRowId,
    ),
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.map(
      (row) => row.followUpReadinessAnswerFollowUpReviewLaneRowId,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLaneSourceRecap.sourceRecapRows.map(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowOrder,
    ),
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.map(
      (row) => row.followUpReadinessAnswerFollowUpReviewLaneRowOrder,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLaneSourceRecap.staticNextPassPromptCards.map(
      (card) => card.sourceStaticDecisionCueCardId,
    ),
    answerFollowUpReviewLane.staticDecisionCueCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLaneSourceRecap.staticNextPassPromptCards.map(
      (card) => card.staticNextPassPromptOrder,
    ),
    answerFollowUpReviewLane.staticDecisionCueCards.map(
      (card) => card.staticDecisionCueOrder,
    ),
  );

  const firstReviewLaneRow =
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows[0];
  const firstSourceRecapRow =
    answerFollowUpReviewLaneSourceRecap.sourceRecapRows[0];
  assert.equal(
    firstSourceRecapRow.sourceAnswerFollowUpReviewLaneRowId,
    firstReviewLaneRow.followUpReadinessAnswerFollowUpReviewLaneRowId,
  );
  assert.equal(
    firstSourceRecapRow.sourceAnswerSourceCrosswalkRowId,
    firstReviewLaneRow.sourceAnswerSourceCrosswalkRowId,
  );
  assert.equal(
    firstSourceRecapRow.sourceAnswerWalkthroughStepId,
    firstReviewLaneRow.sourceAnswerWalkthroughStepId,
  );
  assert.equal(
    firstSourceRecapRow.sourceAnswerCoverageRowId,
    firstReviewLaneRow.sourceAnswerCoverageRowId,
  );
  assert.equal(
    firstSourceRecapRow.sourceRehearsalPathStepId,
    firstReviewLaneRow.sourceRehearsalPathStepId,
  );
  assert.equal(
    firstSourceRecapRow.sourceReviewBoardRowId,
    firstReviewLaneRow.sourceReviewBoardRowId,
  );
  assert.deepEqual(
    firstSourceRecapRow.sourceStaticFollowUpPromptCardIds,
    firstReviewLaneRow.sourceStaticFollowUpPromptCardIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.sourceStaticReviewNoteCardIds,
    firstReviewLaneRow.sourceStaticReviewNoteCardIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.sourceStaticReviewerCheckPromptCardIds,
    firstReviewLaneRow.sourceStaticReviewerCheckPromptCardIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.sourceStaticAnswerPrepPromptCardIds,
    firstReviewLaneRow.sourceStaticAnswerPrepPromptCardIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.matchedStaticQuestionPromptCardIds,
    firstReviewLaneRow.matchedStaticQuestionPromptCardIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.sourceLocalAnchorHrefs,
    firstReviewLaneRow.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstSourceRecapRow.evidenceCallbackIds,
    firstReviewLaneRow.evidenceCallbackIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.gapDiscussionPointIds,
    firstReviewLaneRow.gapDiscussionPointIds,
  );
  assert.deepEqual(
    firstSourceRecapRow.deferredScopeReminderIds,
    firstReviewLaneRow.deferredScopeReminderIds,
  );
  assert.equal(
    firstSourceRecapRow.staticDecisionCueText,
    firstReviewLaneRow.staticDecisionCueText,
  );
  assert.ok(
    firstSourceRecapRow.sourceRecapLabels.includes(
      "source-backed lane recap",
    ),
  );
  assert.ok(
    firstSourceRecapRow.sourceRecapLabels.includes(
      "gap-focused source recap",
    ),
  );
  assert.ok(
    firstSourceRecapRow.sourceRecapLabels.includes(
      "deferred-scope next-pass reminder",
    ),
  );
  assert.ok(
    firstSourceRecapRow.sourceRecapLabels.includes("lane-label carry-forward"),
  );
  assert.ok(
    answerFollowUpReviewLaneSourceRecap.sourceRecapRows.every(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapRowId.includes(
          row.sourceAnswerFollowUpReviewLaneRowId,
        ) &&
        row.sourceRecapText.includes(row.sourceAnswerFollowUpReviewLaneRowId) &&
        row.sourceRecapText.includes(row.sourceAnswerSourceCrosswalkRowId) &&
        row.sourceRecapText.includes(row.sourceAnswerWalkthroughStepId) &&
        row.sourceRecapText.includes(row.sourceAnswerCoverageRowId) &&
        row.sourceRecapText.includes(row.sourceRehearsalPathStepId) &&
        row.sourceRecapText.includes(row.sourceReviewBoardRowId) &&
        row.sourceRecapText.includes(row.followUpReadinessBriefRowId) &&
        row.sourceRecapText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) &&
        row.staticNextPassPromptText.includes(
          row.sourceAnswerFollowUpReviewLaneRowId,
        ) &&
        row.staticNextPassPromptText.includes("without saving reviewer answers") &&
        row.staticNonGoalContext.includes("source recap") &&
        row.staticNonGoalFlags.noSavedAnswerFollowUpReviewLaneState &&
        row.staticNonGoalFlags.noSavedFollowUpLaneState &&
        row.staticNonGoalFlags.noSavedDecisionCues &&
        row.staticNonGoalFlags.noSavedSourceRecapState &&
        row.staticNonGoalFlags.noSavedNextPassPrompts &&
        row.staticNonGoalFlags.noSavedReviewerDecisions,
    ),
  );
  assert.ok(
    answerFollowUpReviewLaneSourceRecap.staticNextPassPromptCards.every(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapStaticNextPassPromptCardId.includes(
          card.sourceStaticDecisionCueCardId,
        ) &&
        card.staticNextPassPromptText.includes(card.sourceStaticDecisionCueCardId) &&
        card.staticNextPassPromptText.includes(card.staticDecisionCueText) &&
        card.staticNonGoalContext.includes("static next-pass prompt") &&
        card.staticNonGoalFlags.noSavedFollowUpLaneState &&
        card.staticNonGoalFlags.noSavedDecisionCues &&
        card.staticNonGoalFlags.noSavedSourceRecapState &&
        card.staticNonGoalFlags.noSavedNextPassPrompts &&
        card.staticNonGoalFlags.noSavedNextPassPromptCards,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Review lane source recap and static next-pass prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved source recap state"));
  assert.ok(missionConsoleSource.includes("No saved next-pass prompts"));
});
