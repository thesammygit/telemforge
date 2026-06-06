import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 70 answer-source crosswalk rows and static follow-up prompts from Stage 69", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerWalkthrough =
    view.reviewObservationHandoffFollowUpReadinessAnswerWalkthrough;
  const answerSourceCrosswalk =
    view.reviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk;
  const builtAnswerSourceCrosswalk =
    buildReviewObservationHandoffFollowUpReadinessAnswerSourceCrosswalk(
      answerWalkthrough,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerWalkthrough);
  assert.ok(answerSourceCrosswalk);
  assert.ok(builtAnswerSourceCrosswalk);
  assert.strictEqual(
    builtAnswerSourceCrosswalk.sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough,
    answerWalkthrough,
  );
  assert.equal(
    answerSourceCrosswalk.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_source_crosswalk.v1",
  );
  assert.equal(answerSourceCrosswalk.version, 1);
  assert.equal(
    answerSourceCrosswalk.contractLabel,
    "local deterministic observation handoff follow-up readiness answer-source crosswalk and static follow-up prompts",
  );
  assert.equal(answerSourceCrosswalk.localStatus, "fixture");
  assert.strictEqual(
    answerSourceCrosswalk.sourceReviewObservationHandoffFollowUpReadinessAnswerWalkthrough,
    answerWalkthrough,
  );
  assert.deepEqual(
    answerSourceCrosswalk.summary.defaultAnswerSourceCrosswalkContext
      .sourceFollowUpReadinessAnswerWalkthroughDefaultContext,
    answerWalkthrough.summary.defaultAnswerWalkthroughContext,
  );
  assert.equal(
    answerSourceCrosswalk.summary.counts.answerSourceCrosswalkRowCount,
    answerWalkthrough.answerWalkthroughSteps.length,
  );
  assert.equal(
    answerSourceCrosswalk.summary.counts.staticFollowUpPromptCardCount,
    answerWalkthrough.staticReviewNoteCards.length,
  );
  assert.deepEqual(
    answerSourceCrosswalk.answerSourceCrosswalkRows.map(
      (row) => row.sourceAnswerWalkthroughStepId,
    ),
    answerWalkthrough.answerWalkthroughSteps.map(
      (step) => step.followUpReadinessAnswerWalkthroughStepId,
    ),
  );
  assert.deepEqual(
    answerSourceCrosswalk.answerSourceCrosswalkRows.map(
      (row) => row.followUpReadinessAnswerSourceCrosswalkRowOrder,
    ),
    answerWalkthrough.answerWalkthroughSteps.map(
      (step) => step.followUpReadinessAnswerWalkthroughStepOrder,
    ),
  );
  assert.deepEqual(
    answerSourceCrosswalk.staticFollowUpPromptCards.map(
      (card) => card.sourceStaticReviewNoteCardId,
    ),
    answerWalkthrough.staticReviewNoteCards.map(
      (card) =>
        card.followUpReadinessAnswerWalkthroughStaticReviewNoteCardId,
    ),
  );
  assert.deepEqual(
    answerSourceCrosswalk.staticFollowUpPromptCards.map(
      (card) => card.staticFollowUpPromptOrder,
    ),
    answerWalkthrough.staticReviewNoteCards.map(
      (card) => card.staticReviewNoteOrder,
    ),
  );

  const firstSourceStep = answerWalkthrough.answerWalkthroughSteps[0];
  const firstCrosswalkRow =
    answerSourceCrosswalk.answerSourceCrosswalkRows[0];
  assert.equal(
    firstCrosswalkRow.sourceAnswerWalkthroughStepId,
    firstSourceStep.followUpReadinessAnswerWalkthroughStepId,
  );
  assert.equal(
    firstCrosswalkRow.sourceAnswerCoverageRowId,
    firstSourceStep.sourceAnswerCoverageRowId,
  );
  assert.equal(
    firstCrosswalkRow.sourceRehearsalPathStepId,
    firstSourceStep.sourceRehearsalPathStepId,
  );
  assert.equal(
    firstCrosswalkRow.sourceReviewBoardRowId,
    firstSourceStep.sourceReviewBoardRowId,
  );
  assert.deepEqual(
    firstCrosswalkRow.sourceLocalAnchorHrefs,
    firstSourceStep.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstCrosswalkRow.sourceAnchorTargetIds,
    firstSourceStep.sourceAnchorTargetIds,
  );
  assert.deepEqual(
    firstCrosswalkRow.evidenceCallbackIds,
    firstSourceStep.evidenceCallbackIds,
  );
  assert.deepEqual(
    firstCrosswalkRow.gapDiscussionPointIds,
    firstSourceStep.gapDiscussionPointIds,
  );
  assert.deepEqual(
    firstCrosswalkRow.deferredScopeReminderIds,
    firstSourceStep.deferredScopeReminderIds,
  );
  assert.equal(
    firstCrosswalkRow.coverageNoteText,
    firstSourceStep.coverageNoteText,
  );
  assert.equal(
    firstCrosswalkRow.handoffPromptText,
    firstSourceStep.handoffPromptText,
  );
  assert.equal(
    firstCrosswalkRow.staticReviewNoteText,
    firstSourceStep.staticReviewNoteText,
  );
  assert.ok(firstCrosswalkRow.staticFollowUpPromptText.length > 0);
  assert.ok(
    answerSourceCrosswalk.answerSourceCrosswalkRows.every(
      (row) =>
        row.followUpReadinessAnswerSourceCrosswalkRowId.includes(
          row.sourceAnswerWalkthroughStepId,
        ) &&
        row.staticFollowUpPromptText.includes(
          row.sourceAnswerWalkthroughStepId,
        ) &&
        row.staticNonGoalContext.includes("static answer-source crosswalk") &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedAnswerDrafts &&
        row.staticNonGoalFlags.noSavedAnswerSourceCrosswalkState &&
        row.staticNonGoalFlags.noSavedFollowUpPrompts &&
        row.staticNonGoalFlags.noSavedWalkthroughState &&
        row.staticNonGoalFlags.noSavedReviewNotes,
    ),
  );
  assert.ok(
    answerSourceCrosswalk.staticFollowUpPromptCards.every(
      (card) =>
        card.followUpReadinessAnswerSourceCrosswalkStaticFollowUpPromptCardId.includes(
          card.sourceStaticReviewNoteCardId,
        ) &&
        card.staticFollowUpPromptText.includes(
          card.sourceStaticReviewNoteCardId,
        ) &&
        card.staticFollowUpPromptText.includes(card.staticReviewNoteText) &&
        card.staticNonGoalContext.includes("static follow-up prompt") &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedAnswerDrafts &&
        card.staticNonGoalFlags.noSavedAnswerSourceCrosswalkState &&
        card.staticNonGoalFlags.noSavedFollowUpPrompts &&
        card.staticNonGoalFlags.noSavedWalkthroughState &&
        card.staticNonGoalFlags.noSavedReviewNotes,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-source-crosswalk",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Answer-source crosswalk and static follow-up prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved answer-source crosswalk"));
  assert.ok(missionConsoleSource.includes("No saved follow-up prompts"));
});
