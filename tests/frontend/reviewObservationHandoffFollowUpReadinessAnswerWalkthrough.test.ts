import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerWalkthrough } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerWalkthrough.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffFollowUpReadinessAnswerWalkthrough derives ordered walkthrough steps from Stage 68 answer coverage rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerCoverage =
    view.reviewObservationHandoffFollowUpReadinessAnswerCoverage;
  const answerWalkthrough =
    buildReviewObservationHandoffFollowUpReadinessAnswerWalkthrough(
      answerCoverage,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerCoverage);
  assert.ok(answerWalkthrough);
  assert.equal(
    answerWalkthrough.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_walkthrough.v1",
  );
  assert.equal(answerWalkthrough.version, 1);
  assert.equal(
    answerWalkthrough.contractLabel,
    "local deterministic observation handoff follow-up readiness answer walkthrough and static review notes",
  );
  assert.equal(answerWalkthrough.localStatus, "fixture");
  assert.strictEqual(
    answerWalkthrough.sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage,
    answerCoverage,
  );
  assert.ok(view.reviewObservationHandoffFollowUpReadinessAnswerWalkthrough);
  assert.strictEqual(
    view.reviewObservationHandoffFollowUpReadinessAnswerWalkthrough
      .sourceReviewObservationHandoffFollowUpReadinessAnswerCoverage,
    answerCoverage,
  );
  assert.deepEqual(
    answerWalkthrough.summary.defaultAnswerWalkthroughContext
      .sourceFollowUpReadinessAnswerCoverageDefaultContext,
    answerCoverage.summary.defaultAnswerCoverageContext,
  );
  assert.equal(
    answerWalkthrough.summary.counts.answerWalkthroughStepCount,
    answerCoverage.answerCoverageRows.length,
  );
  assert.equal(
    answerWalkthrough.summary.counts.staticReviewNoteCardCount,
    answerCoverage.staticReviewerCheckPromptCards.length,
  );
  assert.deepEqual(
    answerWalkthrough.answerWalkthroughSteps.map(
      (step) => step.sourceAnswerCoverageRowId,
    ),
    answerCoverage.answerCoverageRows.map(
      (row) => row.followUpReadinessAnswerCoverageRowId,
    ),
  );
  assert.deepEqual(
    answerWalkthrough.answerWalkthroughSteps.map(
      (step) => step.followUpReadinessAnswerWalkthroughStepOrder,
    ),
    answerCoverage.answerCoverageRows.map(
      (row) => row.followUpReadinessAnswerCoverageRowOrder,
    ),
  );
  assert.deepEqual(
    answerWalkthrough.answerWalkthroughSteps.map(
      (step) => step.sourceStaticReviewerCheckPromptCardIds,
    ),
    answerCoverage.answerCoverageRows.map((row) =>
      expectedStaticReviewerCheckPromptCardIdsForAnswerCoverageRow(
        row,
        answerCoverage.staticReviewerCheckPromptCards,
      ),
    ),
  );

  const firstSourceRow = answerCoverage.answerCoverageRows[0];
  const firstWalkthroughStep = answerWalkthrough.answerWalkthroughSteps[0];
  assert.equal(
    firstWalkthroughStep.sourceAnswerCoverageRowId,
    firstSourceRow.followUpReadinessAnswerCoverageRowId,
  );
  assert.equal(
    firstWalkthroughStep.sourceRehearsalPathStepId,
    firstSourceRow.sourceRehearsalPathStepId,
  );
  assert.equal(
    firstWalkthroughStep.sourceReviewBoardRowId,
    firstSourceRow.sourceReviewBoardRowId,
  );
  assert.equal(
    firstWalkthroughStep.followUpReadinessBriefRowId,
    firstSourceRow.followUpReadinessBriefRowId,
  );
  assert.equal(
    firstWalkthroughStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    firstSourceRow
      .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
  );
  assert.deepEqual(
    firstWalkthroughStep.sourceLocalAnchorHrefs,
    firstSourceRow.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstWalkthroughStep.sourceAnchorTargetIds,
    firstSourceRow.sourceAnchorTargetIds,
  );
  assert.deepEqual(
    firstWalkthroughStep.evidenceCallbackIds,
    firstSourceRow.evidenceCallbackIds,
  );
  assert.equal(
    firstWalkthroughStep.coverageNoteText,
    firstSourceRow.coverageNoteText,
  );
  assert.equal(
    firstWalkthroughStep.handoffPromptText,
    firstSourceRow.handoffPromptText,
  );
  assert.equal(
    firstWalkthroughStep.staticReviewerCheckPromptText,
    firstSourceRow.staticReviewerCheckPromptText,
  );
  assert.ok(firstWalkthroughStep.staticReviewNoteText.length > 0);
  assert.ok(
    answerWalkthrough.answerWalkthroughSteps.every(
      (step) =>
        step.followUpReadinessAnswerWalkthroughStepId.includes(
          step.sourceAnswerCoverageRowId,
        ) &&
        step.staticReviewNoteText.includes(step.sourceAnswerCoverageRowId) &&
        step.staticReviewNoteText.includes(step.staticReviewerCheckPromptText) &&
        step.staticNonGoalContext.includes("manual static answer walkthrough") &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedAnswerDrafts &&
        step.staticNonGoalFlags.noSavedWalkthroughState &&
        step.staticNonGoalFlags.noSavedReviewNotes &&
        step.staticNonGoalFlags.noSavedAnswerCoverageState &&
        step.staticNonGoalFlags.noSavedReviewerCheckPrompts,
    ),
  );

  assert.deepEqual(
    answerWalkthrough.staticReviewNoteCards.map(
      (card) => card.sourceStaticReviewerCheckPromptCardId,
    ),
    answerCoverage.staticReviewerCheckPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    answerWalkthrough.staticReviewNoteCards.map(
      (card) => card.staticReviewNoteOrder,
    ),
    answerCoverage.staticReviewerCheckPromptCards.map(
      (card) => card.staticReviewerCheckPromptOrder,
    ),
  );
  assert.deepEqual(
    answerWalkthrough.staticReviewNoteCards.map(
      (card) => card.matchedAnswerWalkthroughStepIds,
    ),
    answerCoverage.staticReviewerCheckPromptCards.map((card) =>
      expectedAnswerWalkthroughStepIdsForStaticReviewerCheckPromptCard(
        card,
        answerWalkthrough.answerWalkthroughSteps,
      ),
    ),
  );
  assert.ok(
    answerWalkthrough.staticReviewNoteCards.every(
      (card) =>
        card.followUpReadinessAnswerWalkthroughStaticReviewNoteCardId.includes(
          card.sourceStaticReviewerCheckPromptCardId,
        ) &&
        card.staticReviewNoteText.includes(
          card.sourceStaticReviewerCheckPromptCardId,
        ) &&
        card.staticReviewNoteText.includes(card.staticReviewerCheckPromptText) &&
        card.staticNonGoalContext.includes("static review note") &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedAnswerDrafts &&
        card.staticNonGoalFlags.noSavedWalkthroughState &&
        card.staticNonGoalFlags.noSavedReviewNotes &&
        card.staticNonGoalFlags.noSavedReviewerCheckPromptState,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-walkthrough",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Answer walkthrough and static review notes",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved walkthrough state"));
  assert.ok(missionConsoleSource.includes("No saved review notes"));
});

function expectedStaticReviewerCheckPromptCardIdsForAnswerCoverageRow(
  answerCoverageRow: ReviewObservationHandoffFollowUpReadinessAnswerCoverageRowView,
  staticReviewerCheckPromptCards: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView[],
): string[] {
  return staticReviewerCheckPromptCards
    .filter((card) =>
      card.matchedAnswerCoverageRowIds.includes(
        answerCoverageRow.followUpReadinessAnswerCoverageRowId,
      ) ||
      card.matchedRehearsalPathStepIds.includes(
        answerCoverageRow.sourceRehearsalPathStepId,
      ) ||
      card.matchedReviewBoardRowIds.includes(
        answerCoverageRow.sourceReviewBoardRowId,
      ) ||
      card.matchedFollowUpReadinessBriefRowIds.includes(
        answerCoverageRow.followUpReadinessBriefRowId,
      ) ||
      card.matchedFollowUpTriageRowIds.includes(
        answerCoverageRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      answerCoverageRow.sourceStaticAnswerPrepPromptCardIds.some((cardId) =>
        card.sourceStaticAnswerPrepPromptCardIds.includes(cardId),
      ),
    )
    .map(
      (card) =>
        card.followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
    );
}

function expectedAnswerWalkthroughStepIdsForStaticReviewerCheckPromptCard(
  staticReviewerCheckPromptCard: ReviewObservationHandoffFollowUpReadinessAnswerCoverageStaticReviewerCheckPromptCardView,
  answerWalkthroughSteps: Array<{
    followUpReadinessAnswerWalkthroughStepId: string;
    sourceAnswerCoverageRowId: string;
    sourceStaticReviewerCheckPromptCardIds: string[];
  }>,
): string[] {
  return answerWalkthroughSteps
    .filter(
      (step) =>
        staticReviewerCheckPromptCard.matchedAnswerCoverageRowIds.includes(
          step.sourceAnswerCoverageRowId,
        ) ||
        step.sourceStaticReviewerCheckPromptCardIds.includes(
          staticReviewerCheckPromptCard
            .followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId,
        ),
    )
    .map((step) => step.followUpReadinessAnswerWalkthroughStepId);
}
