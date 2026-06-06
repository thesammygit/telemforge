import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffFollowUpReadinessBriefRowView,
  ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffFollowUpReadinessReviewBoard } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessReviewBoard.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffFollowUpReadinessReviewBoard derives ordered board rows from Stage 65 brief rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const followUpReadinessBrief =
    view.reviewObservationHandoffFollowUpReadinessBrief;
  const readinessReviewBoard =
    buildReviewObservationHandoffFollowUpReadinessReviewBoard(
      followUpReadinessBrief,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(followUpReadinessBrief);
  assert.ok(readinessReviewBoard);
  assert.equal(
    readinessReviewBoard.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_review_board.v1",
  );
  assert.equal(readinessReviewBoard.version, 1);
  assert.equal(
    readinessReviewBoard.contractLabel,
    "local deterministic observation handoff follow-up readiness review board and static question prompts",
  );
  assert.equal(readinessReviewBoard.localStatus, "fixture");
  assert.strictEqual(
    readinessReviewBoard.sourceReviewObservationHandoffFollowUpReadinessBrief,
    followUpReadinessBrief,
  );
  assert.deepEqual(readinessReviewBoard.summary.defaultReviewBoardContext, {
    defaultReviewBoardRowId:
      readinessReviewBoard.defaultReviewBoardRow.followUpReadinessReviewBoardRowId,
    defaultFollowUpReadinessBriefRowId:
      readinessReviewBoard.defaultReviewBoardRow.followUpReadinessBriefRowId,
    defaultFollowUpTriageRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    defaultSynthesisRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    defaultReviewLaneRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    defaultReadinessBriefRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    defaultReviewPathStepId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageReviewPathStepId,
    defaultCoverageRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceCoverageRowId,
    defaultTraceRowId:
      readinessReviewBoard.defaultReviewBoardRow
        .sourceReadinessResponseTraceRowId,
    defaultStaticQuestionPromptCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .followUpReadinessReviewBoardStaticQuestionPromptCardId,
    defaultStaticReviewerPromptCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .followUpReadinessBriefStaticReviewerPromptCardId,
    defaultStaticCheckPromptCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
    defaultStaticFollowUpNoteCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    defaultStaticHumanCheckPromptCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    defaultStaticReviewerCueCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    defaultStaticHandoffPromptCardId:
      readinessReviewBoard.defaultStaticQuestionPromptCard
        .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
    sourceFollowUpReadinessBriefSummary:
      followUpReadinessBrief.summary.summary,
    sourceFollowUpReadinessBriefDefaultContext:
      followUpReadinessBrief.summary.defaultFollowUpReadinessBriefContext,
  });
  assert.equal(
    readinessReviewBoard.summary.counts.reviewBoardRowCount,
    followUpReadinessBrief.followUpReadinessBriefRows.length,
  );
  assert.equal(
    readinessReviewBoard.summary.counts.staticQuestionPromptCardCount,
    followUpReadinessBrief.staticReviewerPromptCards.length,
  );
  assert.deepEqual(
    readinessReviewBoard.reviewBoardRows.map(
      (row) => row.followUpReadinessBriefRowId,
    ),
    followUpReadinessBrief.followUpReadinessBriefRows.map(
      (row) => row.followUpReadinessBriefRowId,
    ),
  );
  assert.deepEqual(
    readinessReviewBoard.reviewBoardRows.map(
      (row) => row.followUpReadinessReviewBoardRowOrder,
    ),
    followUpReadinessBrief.followUpReadinessBriefRows.map(
      (row) => row.followUpReadinessBriefRowOrder,
    ),
  );
  assert.deepEqual(
    readinessReviewBoard.reviewBoardRows.map(
      (row) => row.matchedStaticReviewerPromptCardIds,
    ),
    followUpReadinessBrief.followUpReadinessBriefRows.map((row) =>
      expectedStaticReviewerPromptCardIdsForBriefRow(
        row,
        followUpReadinessBrief.staticReviewerPromptCards,
      ),
    ),
  );
  assert.ok(
    readinessReviewBoard.reviewBoardRows.every(
      (row) =>
        row.followUpReadinessReviewBoardRowId.includes(
          row.followUpReadinessBriefRowId,
        ) &&
        row.staticQuestionPromptText.includes(row.followUpReadinessBriefRowId) &&
        row.staticNonGoalFlags.noSavedReviewBoardState &&
        row.staticNonGoalFlags.noSavedReviewBoardRows &&
        row.staticNonGoalFlags.noSavedStaticQuestionPrompts &&
        row.staticNonGoalFlags.noSavedQuestionPromptState &&
        row.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        row.staticNonGoalFlags.noSavedPromptState,
    ),
  );
  assert.deepEqual(
    readinessReviewBoard.staticQuestionPromptCards.map(
      (card) => card.followUpReadinessBriefStaticReviewerPromptCardId,
    ),
    followUpReadinessBrief.staticReviewerPromptCards.map(
      (card) => card.followUpReadinessBriefStaticReviewerPromptCardId,
    ),
  );
  assert.deepEqual(
    readinessReviewBoard.staticQuestionPromptCards.map(
      (card) => card.matchedReviewBoardRowIds,
    ),
    followUpReadinessBrief.staticReviewerPromptCards.map((card) =>
      expectedReviewBoardRowIdsForStaticQuestionPromptCard(
        card,
        readinessReviewBoard.reviewBoardRows,
      ),
    ),
  );
  assert.ok(
    readinessReviewBoard.staticQuestionPromptCards.every(
      (card) =>
        card.followUpReadinessReviewBoardStaticQuestionPromptCardId.includes(
          card.followUpReadinessBriefStaticReviewerPromptCardId,
        ) &&
        card.staticQuestionPromptText.includes(
          card.followUpReadinessReviewBoardStaticQuestionPromptCardId,
        ) &&
        card.staticNonGoalFlags.noSavedReviewBoardState &&
        card.staticNonGoalFlags.noSavedBoardRows &&
        card.staticNonGoalFlags.noSavedStaticQuestionPrompts &&
        card.staticNonGoalFlags.noSavedQuestionPromptState &&
        card.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        card.staticNonGoalFlags.noSavedPromptState,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-review-board",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Readiness review board and static question prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved review board state"));
  assert.ok(missionConsoleSource.includes("No saved static question prompts"));
});

function expectedStaticReviewerPromptCardIdsForBriefRow(
  followUpReadinessBriefRow: ReviewObservationHandoffFollowUpReadinessBriefRowView,
  staticReviewerPromptCards: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView[],
): string[] {
  return staticReviewerPromptCards
    .filter((card) =>
      card.matchedFollowUpReadinessBriefRowIds.includes(
        followUpReadinessBriefRow.followUpReadinessBriefRowId,
      ) ||
      card.matchedFollowUpTriageRowIds.includes(
        followUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      card.matchedSynthesisRowIds.includes(
        followUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      card.matchedReviewLaneRowIds.includes(
        followUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      card.matchedReadinessBriefRowIds.includes(
        followUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      card.matchedReviewPathStepIds.includes(
        followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      card.matchedCoverageRowIds.includes(
        followUpReadinessBriefRow.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      card.matchedResponseTraceRowIds.includes(
        followUpReadinessBriefRow.sourceReadinessResponseTraceRowId,
      ) ||
      card.matchedResponseWalkthroughStepIds.includes(
        followUpReadinessBriefRow.sourceReadinessResponseWalkthroughStepId,
      ) ||
      card.matchedResponseRowIds.includes(
        followUpReadinessBriefRow.sourceReadinessResponseRowId,
      ) ||
      card.matchedQuestionRowIds.includes(
        followUpReadinessBriefRow.sourceReadinessQuestionRowId,
      ))
    .map((card) => card.followUpReadinessBriefStaticReviewerPromptCardId);
}

function expectedReviewBoardRowIdsForStaticQuestionPromptCard(
  staticReviewerPromptCard: ReviewObservationHandoffFollowUpReadinessBriefStaticReviewerPromptCardView,
  reviewBoardRows: ReturnType<
    typeof buildReviewObservationHandoffFollowUpReadinessReviewBoard
  > extends { reviewBoardRows: infer T }
    ? T
    : never,
): string[] {
  return reviewBoardRows
    .filter(
      (row) =>
        row.matchedStaticReviewerPromptCardIds.includes(
          staticReviewerPromptCard.followUpReadinessBriefStaticReviewerPromptCardId,
        ) ||
        staticReviewerPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
          row.followUpReadinessBriefRowId,
        ) ||
        staticReviewerPromptCard.matchedFollowUpTriageRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) ||
        staticReviewerPromptCard.matchedSynthesisRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        ) ||
        staticReviewerPromptCard.matchedReviewLaneRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) ||
        staticReviewerPromptCard.matchedReadinessBriefRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) ||
        staticReviewerPromptCard.matchedReviewPathStepIds.includes(
          row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ) ||
        staticReviewerPromptCard.matchedCoverageRowIds.includes(
          row.sourceReadinessResponseTraceCoverageRowId,
        ) ||
        staticReviewerPromptCard.matchedResponseTraceRowIds.includes(
          row.sourceReadinessResponseTraceRowId,
        ) ||
        staticReviewerPromptCard.matchedResponseWalkthroughStepIds.includes(
          row.sourceReadinessResponseWalkthroughStepId,
        ) ||
        staticReviewerPromptCard.matchedResponseRowIds.includes(
          row.sourceReadinessResponseRowId,
        ) ||
        staticReviewerPromptCard.matchedQuestionRowIds.includes(
          row.sourceReadinessQuestionRowId,
        ),
    )
    .map((row) => row.followUpReadinessReviewBoardRowId);
}
