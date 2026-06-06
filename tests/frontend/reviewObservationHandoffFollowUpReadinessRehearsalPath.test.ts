import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
  ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffFollowUpReadinessRehearsalPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessRehearsalPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffFollowUpReadinessRehearsalPath derives ordered rehearsal steps from Stage 66 board rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessReviewBoard =
    view.reviewObservationHandoffFollowUpReadinessReviewBoard;
  const readinessRehearsalPath =
    buildReviewObservationHandoffFollowUpReadinessRehearsalPath(
      readinessReviewBoard,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(readinessReviewBoard);
  assert.ok(readinessRehearsalPath);
  assert.equal(
    readinessRehearsalPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_rehearsal_path.v1",
  );
  assert.equal(readinessRehearsalPath.version, 1);
  assert.equal(
    readinessRehearsalPath.contractLabel,
    "local deterministic observation handoff follow-up readiness rehearsal path and static answer-prep prompts",
  );
  assert.equal(readinessRehearsalPath.localStatus, "fixture");
  assert.strictEqual(
    readinessRehearsalPath.sourceReviewObservationHandoffFollowUpReadinessReviewBoard,
    readinessReviewBoard,
  );
  assert.deepEqual(
    readinessRehearsalPath.summary.defaultRehearsalContext
      .sourceReviewBoardDefaultContext,
    readinessReviewBoard.summary.defaultReviewBoardContext,
  );
  assert.equal(
    readinessRehearsalPath.summary.counts.rehearsalPathStepCount,
    readinessReviewBoard.reviewBoardRows.length,
  );
  assert.equal(
    readinessRehearsalPath.summary.counts.staticAnswerPrepPromptCardCount,
    readinessReviewBoard.staticQuestionPromptCards.length,
  );
  assert.deepEqual(
    readinessRehearsalPath.rehearsalPathSteps.map(
      (step) => step.sourceReviewBoardRowId,
    ),
    readinessReviewBoard.reviewBoardRows.map(
      (row) => row.followUpReadinessReviewBoardRowId,
    ),
  );
  assert.deepEqual(
    readinessRehearsalPath.rehearsalPathSteps.map(
      (step) => step.followUpReadinessRehearsalPathStepOrder,
    ),
    readinessReviewBoard.reviewBoardRows.map(
      (row) => row.followUpReadinessReviewBoardRowOrder,
    ),
  );
  assert.deepEqual(
    readinessRehearsalPath.rehearsalPathSteps.map(
      (step) => step.matchedStaticQuestionPromptCardIds,
    ),
    readinessReviewBoard.reviewBoardRows.map((row) =>
      expectedStaticQuestionPromptCardIdsForReviewBoardRow(
        row,
        readinessReviewBoard.staticQuestionPromptCards,
      ),
    ),
  );

  const firstSourceRow = readinessReviewBoard.reviewBoardRows[0];
  const firstRehearsalStep = readinessRehearsalPath.rehearsalPathSteps[0];
  assert.equal(
    firstRehearsalStep.followUpReadinessBriefRowId,
    firstSourceRow.followUpReadinessBriefRowId,
  );
  assert.equal(
    firstRehearsalStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    firstSourceRow
      .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
  );
  assert.deepEqual(
    firstRehearsalStep.sourceLocalAnchorHrefs,
    firstSourceRow.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstRehearsalStep.sourceAnchorTargetIds,
    firstSourceRow.sourceAnchorTargetIds,
  );
  assert.deepEqual(
    firstRehearsalStep.evidenceCallbackIds,
    firstSourceRow.evidenceCallbackIds,
  );
  assert.equal(firstRehearsalStep.coverageNoteText, firstSourceRow.coverageNoteText);
  assert.equal(firstRehearsalStep.gapNoteText, firstSourceRow.gapNoteText);
  assert.equal(firstRehearsalStep.handoffPromptText, firstSourceRow.handoffPromptText);
  assert.equal(
    firstRehearsalStep.staticQuestionPromptText,
    firstSourceRow.staticQuestionPromptText,
  );
  assert.ok(
    readinessRehearsalPath.rehearsalPathSteps.every(
      (step) =>
        step.followUpReadinessRehearsalPathStepId.includes(
          step.sourceReviewBoardRowId,
        ) &&
        step.staticAnswerPrepPromptText.includes(step.sourceReviewBoardRowId) &&
        step.staticAnswerPrepPromptText.includes(
          step.staticQuestionPromptText,
        ) &&
        step.staticNonGoalContext.includes("manual static answer prep") &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedAnswerDrafts &&
        step.staticNonGoalFlags.noSavedRehearsalState &&
        step.staticNonGoalFlags.noSavedStaticAnswerPrepPrompts &&
        step.staticNonGoalFlags.noSavedReviewBoardState &&
        step.staticNonGoalFlags.noSavedQuestionPromptState,
    ),
  );

  assert.deepEqual(
    readinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (card) => card.sourceStaticQuestionPromptCardId,
    ),
    readinessReviewBoard.staticQuestionPromptCards.map(
      (card) =>
        card.followUpReadinessReviewBoardStaticQuestionPromptCardId,
    ),
  );
  assert.deepEqual(
    readinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (card) => card.staticAnswerPrepPromptOrder,
    ),
    readinessReviewBoard.staticQuestionPromptCards.map(
      (card) => card.staticQuestionPromptOrder,
    ),
  );
  assert.deepEqual(
    readinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (card) => card.matchedRehearsalPathStepIds,
    ),
    readinessReviewBoard.staticQuestionPromptCards.map((card) =>
      expectedRehearsalPathStepIdsForStaticQuestionPromptCard(
        card,
        readinessRehearsalPath.rehearsalPathSteps,
      ),
    ),
  );
  assert.ok(
    readinessRehearsalPath.staticAnswerPrepPromptCards.every(
      (card) =>
        card.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId.includes(
          card.sourceStaticQuestionPromptCardId,
        ) &&
        card.staticAnswerPrepPromptText.includes(
          card.sourceStaticQuestionPromptCardId,
        ) &&
        card.staticAnswerPrepPromptText.includes(card.staticQuestionPromptText) &&
        card.staticNonGoalContext.includes("static answer-prep prompt") &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedAnswerDrafts &&
        card.staticNonGoalFlags.noSavedRehearsalState &&
        card.staticNonGoalFlags.noSavedStaticAnswerPrepPrompts &&
        card.staticNonGoalFlags.noSavedReviewBoardState &&
        card.staticNonGoalFlags.noSavedStaticQuestionPrompts,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-rehearsal-path",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Readiness rehearsal path and static answer-prep prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved reviewer answers"));
  assert.ok(missionConsoleSource.includes("No saved answer drafts"));
});

function expectedStaticQuestionPromptCardIdsForReviewBoardRow(
  reviewBoardRow: ReviewObservationHandoffFollowUpReadinessReviewBoardRowView,
  staticQuestionPromptCards: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView[],
): string[] {
  return staticQuestionPromptCards
    .filter((card) =>
      card.matchedReviewBoardRowIds.includes(
        reviewBoardRow.followUpReadinessReviewBoardRowId,
      ) ||
      card.matchedFollowUpReadinessBriefRowIds.includes(
        reviewBoardRow.followUpReadinessBriefRowId,
      ) ||
      card.matchedFollowUpTriageRowIds.includes(
        reviewBoardRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      card.matchedSynthesisRowIds.includes(
        reviewBoardRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      card.matchedReviewLaneRowIds.includes(
        reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      card.matchedReadinessBriefRowIds.includes(
        reviewBoardRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      card.matchedReviewPathStepIds.includes(
        reviewBoardRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      card.matchedCoverageRowIds.includes(
        reviewBoardRow.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      card.matchedResponseTraceRowIds.includes(
        reviewBoardRow.sourceReadinessResponseTraceRowId,
      ) ||
      card.matchedResponseWalkthroughStepIds.includes(
        reviewBoardRow.sourceReadinessResponseWalkthroughStepId,
      ) ||
      card.matchedResponseRowIds.includes(
        reviewBoardRow.sourceReadinessResponseRowId,
      ) ||
      card.matchedQuestionRowIds.includes(
        reviewBoardRow.sourceReadinessQuestionRowId,
      ))
    .map((card) => card.followUpReadinessReviewBoardStaticQuestionPromptCardId);
}

function expectedRehearsalPathStepIdsForStaticQuestionPromptCard(
  staticQuestionPromptCard: ReviewObservationHandoffFollowUpReadinessReviewBoardStaticQuestionPromptCardView,
  rehearsalPathSteps: ReturnType<
    typeof buildReviewObservationHandoffFollowUpReadinessRehearsalPath
  > extends { rehearsalPathSteps: infer T }
    ? T
    : never,
): string[] {
  return rehearsalPathSteps
    .filter(
      (step) =>
        staticQuestionPromptCard.matchedReviewBoardRowIds.includes(
          step.sourceReviewBoardRowId,
        ) ||
        staticQuestionPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
          step.followUpReadinessBriefRowId,
        ) ||
        staticQuestionPromptCard.matchedFollowUpTriageRowIds.includes(
          step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) ||
        staticQuestionPromptCard.matchedSynthesisRowIds.includes(
          step.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        ) ||
        staticQuestionPromptCard.matchedReviewLaneRowIds.includes(
          step.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) ||
        staticQuestionPromptCard.matchedReadinessBriefRowIds.includes(
          step.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) ||
        staticQuestionPromptCard.matchedReviewPathStepIds.includes(
          step.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ) ||
        staticQuestionPromptCard.matchedCoverageRowIds.includes(
          step.sourceReadinessResponseTraceCoverageRowId,
        ) ||
        staticQuestionPromptCard.matchedResponseTraceRowIds.includes(
          step.sourceReadinessResponseTraceRowId,
        ) ||
        staticQuestionPromptCard.matchedResponseWalkthroughStepIds.includes(
          step.sourceReadinessResponseWalkthroughStepId,
        ) ||
        staticQuestionPromptCard.matchedResponseRowIds.includes(
          step.sourceReadinessResponseRowId,
        ) ||
        staticQuestionPromptCard.matchedQuestionRowIds.includes(
          step.sourceReadinessQuestionRowId,
        ),
    )
    .map((step) => step.followUpReadinessRehearsalPathStepId);
}
