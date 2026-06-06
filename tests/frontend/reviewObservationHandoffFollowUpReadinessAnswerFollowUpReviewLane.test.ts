import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 71 answer follow-up review lane rows and static decision cues from Stage 70", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerSourceCrosswalk =
    view.reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk;
  const answerFollowUpReviewLane =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane;
  const builtAnswerFollowUpReviewLane =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLane(
      answerSourceCrosswalk,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerSourceCrosswalk);
  assert.ok(answerFollowUpReviewLane);
  assert.ok(builtAnswerFollowUpReviewLane);
  assert.strictEqual(
    builtAnswerFollowUpReviewLane.sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk,
    answerSourceCrosswalk,
  );
  assert.equal(
    answerFollowUpReviewLane.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane.v1",
  );
  assert.equal(answerFollowUpReviewLane.version, 1);
  assert.equal(
    answerFollowUpReviewLane.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane and static decision cues",
  );
  assert.equal(answerFollowUpReviewLane.localStatus, "fixture");
  assert.strictEqual(
    answerFollowUpReviewLane.sourceReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk,
    answerSourceCrosswalk,
  );
  assert.deepEqual(
    answerFollowUpReviewLane.summary.defaultAnswerFollowUpReviewLaneContext
      .sourceFollowUpReadinessAnswerSourceCrosswalkDefaultContext,
    answerSourceCrosswalk.summary.defaultAnswerSourceCrosswalkContext,
  );
  assert.equal(
    answerFollowUpReviewLane.summary.counts.answerFollowUpReviewLaneRowCount,
    answerSourceCrosswalk.answerSourceCrosswalkRows.length,
  );
  assert.equal(
    answerFollowUpReviewLane.summary.counts.staticDecisionCueCardCount,
    answerSourceCrosswalk.staticFollowUpPromptCards.length,
  );
  assert.deepEqual(
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.map(
      (row) => row.sourceAnswerSourceCrosswalkRowId,
    ),
    answerSourceCrosswalk.answerSourceCrosswalkRows.map(
      (row) => row.followUpReadinessAnswerSourceCrosswalkRowId,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.map(
      (row) => row.followUpReadinessAnswerFollowUpReviewLaneRowOrder,
    ),
    answerSourceCrosswalk.answerSourceCrosswalkRows.map(
      (row) => row.followUpReadinessAnswerSourceCrosswalkRowOrder,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLane.staticDecisionCueCards.map(
      (card) => card.sourceStaticFollowUpPromptCardId,
    ),
    answerSourceCrosswalk.staticFollowUpPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId,
    ),
  );
  assert.deepEqual(
    answerFollowUpReviewLane.staticDecisionCueCards.map(
      (card) => card.staticDecisionCueOrder,
    ),
    answerSourceCrosswalk.staticFollowUpPromptCards.map(
      (card) => card.staticFollowUpPromptOrder,
    ),
  );

  const firstSourceRow = answerSourceCrosswalk.answerSourceCrosswalkRows[0];
  const firstReviewLaneRow =
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows[0];
  assert.equal(
    firstReviewLaneRow.sourceAnswerSourceCrosswalkRowId,
    firstSourceRow.followUpReadinessAnswerSourceCrosswalkRowId,
  );
  assert.equal(
    firstReviewLaneRow.sourceAnswerWalkthroughStepId,
    firstSourceRow.sourceAnswerWalkthroughStepId,
  );
  assert.equal(
    firstReviewLaneRow.sourceAnswerCoverageRowId,
    firstSourceRow.sourceAnswerCoverageRowId,
  );
  assert.equal(
    firstReviewLaneRow.sourceRehearsalPathStepId,
    firstSourceRow.sourceRehearsalPathStepId,
  );
  assert.equal(
    firstReviewLaneRow.sourceReviewBoardRowId,
    firstSourceRow.sourceReviewBoardRowId,
  );
  assert.deepEqual(
    firstReviewLaneRow.sourceLocalAnchorHrefs,
    firstSourceRow.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstReviewLaneRow.sourceAnchorTargetIds,
    firstSourceRow.sourceAnchorTargetIds,
  );
  assert.deepEqual(
    firstReviewLaneRow.evidenceCallbackIds,
    firstSourceRow.evidenceCallbackIds,
  );
  assert.deepEqual(
    firstReviewLaneRow.gapDiscussionPointIds,
    firstSourceRow.gapDiscussionPointIds,
  );
  assert.deepEqual(
    firstReviewLaneRow.deferredScopeReminderIds,
    firstSourceRow.deferredScopeReminderIds,
  );
  assert.equal(
    firstReviewLaneRow.staticFollowUpPromptText,
    firstSourceRow.staticFollowUpPromptText,
  );
  assert.ok(firstReviewLaneRow.laneLabels.includes("source-ready follow-up scan"));
  assert.ok(firstReviewLaneRow.laneLabels.includes("gap-focused prompt review"));
  assert.ok(
    firstReviewLaneRow.laneLabels.includes("deferred-scope boundary check"),
  );
  assert.ok(
    firstReviewLaneRow.laneLabels.includes("handoff-context source check"),
  );
  assert.ok(
    answerFollowUpReviewLane.answerFollowUpReviewLaneRows.every(
      (row) =>
        row.followUpReadinessAnswerFollowUpReviewLaneRowId.includes(
          row.sourceAnswerSourceCrosswalkRowId,
        ) &&
        row.answerFollowUpReviewLaneText.includes(
          row.sourceAnswerSourceCrosswalkRowId,
        ) &&
        row.staticDecisionCueText.includes(
          row.sourceAnswerSourceCrosswalkRowId,
        ) &&
        row.staticDecisionCueText.includes("without saving reviewer decisions") &&
        row.staticNonGoalContext.includes("static decision cues") &&
        row.staticNonGoalFlags.noSavedAnswerSourceCrosswalkState &&
        row.staticNonGoalFlags.noSavedFollowUpPrompts &&
        row.staticNonGoalFlags.noSavedAnswerFollowUpReviewLaneState &&
        row.staticNonGoalFlags.noSavedFollowUpLaneState &&
        row.staticNonGoalFlags.noSavedDecisionCues &&
        row.staticNonGoalFlags.noSavedReviewerDecisions,
    ),
  );
  assert.ok(
    answerFollowUpReviewLane.staticDecisionCueCards.every(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneStaticDecisionCueCardId.includes(
          card.sourceStaticFollowUpPromptCardId,
        ) &&
        card.staticDecisionCueText.includes(card.sourceStaticFollowUpPromptCardId) &&
        card.staticDecisionCueText.includes(card.staticFollowUpPromptText) &&
        card.staticNonGoalContext.includes("static decision-cue") &&
        card.staticNonGoalFlags.noSavedAnswerSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedFollowUpPrompts &&
        card.staticNonGoalFlags.noSavedAnswerFollowUpReviewLaneState &&
        card.staticNonGoalFlags.noSavedFollowUpLaneState &&
        card.staticNonGoalFlags.noSavedDecisionCues &&
        card.staticNonGoalFlags.noSavedDecisionCueCards &&
        card.staticNonGoalFlags.noSavedReviewerDecisions,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Answer follow-up review lane and static decision cues",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved follow-up lane state"));
  assert.ok(missionConsoleSource.includes("No saved decision cues"));
});
