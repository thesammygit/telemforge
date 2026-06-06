import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffFollowUpReadinessBrief } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessBrief.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffFollowUpReadinessBrief derives ordered brief rows from Stage 64 follow-up triage rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const followUpTriage =
    view.reviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage;
  const followUpReadinessBrief =
    buildReviewObservationHandoffFollowUpReadinessBrief(followUpTriage);
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(followUpTriage);
  assert.ok(followUpReadinessBrief);
  assert.equal(
    followUpReadinessBrief.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_brief.v1",
  );
  assert.equal(followUpReadinessBrief.version, 1);
  assert.equal(
    followUpReadinessBrief.contractLabel,
    "local deterministic observation handoff follow-up readiness brief and static reviewer prompts",
  );
  assert.equal(followUpReadinessBrief.localStatus, "fixture");
  assert.strictEqual(
    followUpReadinessBrief.sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage,
    followUpTriage,
  );
  assert.deepEqual(
    followUpReadinessBrief.summary.defaultFollowUpReadinessBriefContext,
    {
      defaultFollowUpReadinessBriefRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .followUpReadinessBriefRowId,
      defaultFollowUpTriageRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      defaultSynthesisRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      defaultReviewLaneRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      defaultReadinessBriefRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      defaultReviewPathStepId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageReviewPathStepId,
      defaultCoverageRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceCoverageRowId,
      defaultTraceRowId:
        followUpReadinessBrief.defaultFollowUpReadinessBriefRow
          .sourceReadinessResponseTraceRowId,
      defaultStaticReviewerPromptCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .followUpReadinessBriefStaticReviewerPromptCardId,
      defaultStaticCheckPromptCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
      defaultStaticFollowUpNoteCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
      defaultStaticHumanCheckPromptCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
      defaultStaticReviewerCueCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
      defaultStaticHandoffPromptCardId:
        followUpReadinessBrief.defaultStaticReviewerPromptCard
          .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
      sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummary:
        followUpTriage.summary.summary,
      sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageDefaultContext:
        followUpTriage.summary.defaultFollowUpTriageContext,
    },
  );
  assert.equal(
    followUpReadinessBrief.summary.counts.followUpReadinessBriefRowCount,
    followUpTriage.followUpTriageRows.length,
  );
  assert.equal(
    followUpReadinessBrief.summary.counts.staticReviewerPromptCardCount,
    followUpTriage.staticCheckPromptCards.length,
  );
  assert.deepEqual(
    followUpReadinessBrief.followUpReadinessBriefRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ),
    followUpTriage.followUpTriageRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ),
  );
  assert.deepEqual(
    followUpReadinessBrief.followUpReadinessBriefRows.map(
      (row) => row.followUpReadinessBriefRowOrder,
    ),
    followUpTriage.followUpTriageRows.map((row) => row.followUpTriageRowOrder),
  );
  assert.deepEqual(
    followUpReadinessBrief.followUpReadinessBriefRows.map((row) =>
      row.matchedStaticCheckPromptCardIds,
    ),
    followUpTriage.followUpTriageRows.map((row) =>
      expectedStaticCheckPromptCardIdsForFollowUpTriageRow(
        row,
        followUpTriage.staticCheckPromptCards,
      ),
    ),
  );
  assert.ok(
    followUpReadinessBrief.followUpReadinessBriefRows.every(
      (row) =>
        row.followUpReadinessBriefRowId.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) &&
        row.staticReviewerPromptText.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) &&
        row.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        row.staticNonGoalFlags.noSavedFollowUpReadinessBriefRows &&
        row.staticNonGoalFlags.noSavedBriefState &&
        row.staticNonGoalFlags.noSavedStaticReviewerPrompts &&
        row.staticNonGoalFlags.noSavedStaticReviewerPromptCards &&
        row.staticNonGoalFlags.noSavedStaticReviewerPromptState &&
        row.staticNonGoalFlags.noSavedPromptState,
    ),
  );
  assert.deepEqual(
    followUpReadinessBrief.staticReviewerPromptCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
    ),
    followUpTriage.staticCheckPromptCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
    ),
  );
  assert.deepEqual(
    followUpReadinessBrief.staticReviewerPromptCards.map((card) =>
      card.matchedFollowUpReadinessBriefRowIds,
    ),
    followUpTriage.staticCheckPromptCards.map((card) =>
      expectedFollowUpReadinessBriefRowIdsForStaticReviewerPromptCard(
        card,
        followUpReadinessBrief.followUpReadinessBriefRows,
      ),
    ),
  );
  assert.ok(
    followUpReadinessBrief.staticReviewerPromptCards.every(
      (card) =>
        card.followUpReadinessBriefStaticReviewerPromptCardId.includes(
          card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        ) &&
        card.staticReviewerPromptText.includes(
          card.followUpReadinessBriefStaticReviewerPromptCardId,
        ) &&
        card.staticNonGoalFlags.noSavedFollowUpReadinessBriefState &&
        card.staticNonGoalFlags.noSavedFollowUpReadinessBriefRows &&
        card.staticNonGoalFlags.noSavedBriefState &&
        card.staticNonGoalFlags.noSavedStaticReviewerPrompts &&
        card.staticNonGoalFlags.noSavedStaticReviewerPromptCards &&
        card.staticNonGoalFlags.noSavedStaticReviewerPromptState &&
        card.staticNonGoalFlags.noSavedPromptState,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-brief",
    ),
  );
  assert.ok(
    missionConsoleSource.includes("Readiness brief and static reviewer prompts"),
  );
  assert.ok(missionConsoleSource.includes("No saved follow-up readiness brief state"));
  assert.ok(missionConsoleSource.includes("No saved static reviewer prompts"));
});

function expectedStaticCheckPromptCardIdsForFollowUpTriageRow(
  followUpTriageRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
  staticCheckPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView[],
): string[] {
  return staticCheckPromptCards
    .filter((card) =>
      card.matchedFollowUpTriageRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      card.matchedSynthesisRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      card.matchedReviewLaneRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      card.matchedReadinessBriefRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      card.matchedReviewPathStepIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      card.matchedCoverageRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      card.matchedResponseTraceRowIds.includes(
        followUpTriageRow.sourceReadinessResponseTraceRowId,
      ) ||
      card.matchedResponseWalkthroughStepIds.includes(
        followUpTriageRow.sourceReadinessResponseWalkthroughStepId,
      ) ||
      card.matchedResponseRowIds.includes(
        followUpTriageRow.sourceReadinessResponseRowId,
      ) ||
      card.matchedQuestionRowIds.includes(
        followUpTriageRow.sourceReadinessQuestionRowId,
      ))
    .map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
    );
}

function expectedFollowUpReadinessBriefRowIdsForStaticReviewerPromptCard(
  staticCheckPromptCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
  followUpReadinessBriefRows: ReturnType<
    typeof buildReviewObservationHandoffFollowUpReadinessBrief
  > extends { followUpReadinessBriefRows: infer T }
    ? T
    : never,
): string[] {
  return followUpReadinessBriefRows
    .filter(
      (row) =>
        row.matchedStaticCheckPromptCardIds.includes(
          staticCheckPromptCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        ) ||
        staticCheckPromptCard.matchedSynthesisRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        ) ||
        staticCheckPromptCard.matchedReviewLaneRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) ||
        staticCheckPromptCard.matchedReadinessBriefRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) ||
        staticCheckPromptCard.matchedReviewPathStepIds.includes(
          row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ) ||
        staticCheckPromptCard.matchedCoverageRowIds.includes(
          row.sourceReadinessResponseTraceCoverageRowId,
        ) ||
        staticCheckPromptCard.matchedResponseTraceRowIds.includes(
          row.sourceReadinessResponseTraceRowId,
        ) ||
        staticCheckPromptCard.matchedResponseWalkthroughStepIds.includes(
          row.sourceReadinessResponseWalkthroughStepId,
        ) ||
        staticCheckPromptCard.matchedResponseRowIds.includes(
          row.sourceReadinessResponseRowId,
        ) ||
        staticCheckPromptCard.matchedQuestionRowIds.includes(
          row.sourceReadinessQuestionRowId,
        ),
    )
    .map((row) => row.followUpReadinessBriefRowId);
}
