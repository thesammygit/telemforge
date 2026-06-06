import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerCoverage } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerCoverage.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffFollowUpReadinessAnswerCoverage derives ordered answer coverage rows from Stage 67 rehearsal steps", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessRehearsalPath =
    view.reviewObservationHandoffFollowUpReadinessRehearsalPath;
  const answerCoverage =
    buildReviewObservationHandoffFollowUpReadinessAnswerCoverage(
      readinessRehearsalPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(readinessRehearsalPath);
  assert.ok(answerCoverage);
  assert.equal(
    answerCoverage.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_coverage.v1",
  );
  assert.equal(answerCoverage.version, 1);
  assert.equal(
    answerCoverage.contractLabel,
    "local deterministic observation handoff follow-up readiness answer coverage and static reviewer-check prompts",
  );
  assert.equal(answerCoverage.localStatus, "fixture");
  assert.strictEqual(
    answerCoverage.sourceReviewObservationHandoffFollowUpReadinessRehearsalPath,
    readinessRehearsalPath,
  );
  assert.ok(view.reviewObservationHandoffFollowUpReadinessAnswerCoverage);
  assert.strictEqual(
    view.reviewObservationHandoffFollowUpReadinessAnswerCoverage
      .sourceReviewObservationHandoffFollowUpReadinessRehearsalPath,
    readinessRehearsalPath,
  );
  assert.deepEqual(
    answerCoverage.summary.defaultAnswerCoverageContext
      .sourceFollowUpReadinessRehearsalPathDefaultContext,
    readinessRehearsalPath.summary.defaultRehearsalContext,
  );
  assert.equal(
    answerCoverage.summary.counts.answerCoverageRowCount,
    readinessRehearsalPath.rehearsalPathSteps.length,
  );
  assert.equal(
    answerCoverage.summary.counts.staticReviewerCheckPromptCardCount,
    readinessRehearsalPath.staticAnswerPrepPromptCards.length,
  );
  assert.deepEqual(
    answerCoverage.answerCoverageRows.map((row) => row.sourceRehearsalPathStepId),
    readinessRehearsalPath.rehearsalPathSteps.map(
      (step) => step.followUpReadinessRehearsalPathStepId,
    ),
  );
  assert.deepEqual(
    answerCoverage.answerCoverageRows.map(
      (row) => row.followUpReadinessAnswerCoverageRowOrder,
    ),
    readinessRehearsalPath.rehearsalPathSteps.map(
      (step) => step.followUpReadinessRehearsalPathStepOrder,
    ),
  );
  assert.deepEqual(
    answerCoverage.answerCoverageRows.map(
      (row) => row.matchedStaticAnswerPrepPromptCardIds,
    ),
    readinessRehearsalPath.rehearsalPathSteps.map((step) =>
      expectedStaticAnswerPrepPromptCardIdsForRehearsalPathStep(
        step,
        readinessRehearsalPath.staticAnswerPrepPromptCards,
      ),
    ),
  );

  const firstSourceStep = readinessRehearsalPath.rehearsalPathSteps[0];
  const firstAnswerCoverageRow = answerCoverage.answerCoverageRows[0];
  assert.equal(
    firstAnswerCoverageRow.sourceReviewBoardRowId,
    firstSourceStep.sourceReviewBoardRowId,
  );
  assert.equal(
    firstAnswerCoverageRow.followUpReadinessBriefRowId,
    firstSourceStep.followUpReadinessBriefRowId,
  );
  assert.equal(
    firstAnswerCoverageRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    firstSourceStep
      .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
  );
  assert.deepEqual(
    firstAnswerCoverageRow.sourceLocalAnchorHrefs,
    firstSourceStep.sourceLocalAnchorHrefs,
  );
  assert.deepEqual(
    firstAnswerCoverageRow.sourceAnchorTargetIds,
    firstSourceStep.sourceAnchorTargetIds,
  );
  assert.deepEqual(
    firstAnswerCoverageRow.evidenceCallbackIds,
    firstSourceStep.evidenceCallbackIds,
  );
  assert.equal(
    firstAnswerCoverageRow.coverageNoteText,
    firstSourceStep.coverageNoteText,
  );
  assert.equal(firstAnswerCoverageRow.gapNoteText, firstSourceStep.gapNoteText);
  assert.equal(
    firstAnswerCoverageRow.handoffPromptText,
    firstSourceStep.handoffPromptText,
  );
  assert.equal(
    firstAnswerCoverageRow.staticQuestionPromptText,
    firstSourceStep.staticQuestionPromptText,
  );
  assert.equal(
    firstAnswerCoverageRow.staticAnswerPrepPromptText,
    firstSourceStep.staticAnswerPrepPromptText,
  );
  assert.ok(
    answerCoverage.answerCoverageRows.every(
      (row) =>
        row.followUpReadinessAnswerCoverageRowId.includes(
          row.sourceRehearsalPathStepId,
        ) &&
        row.staticReviewerCheckPromptText.includes(
          row.sourceRehearsalPathStepId,
        ) &&
        row.staticReviewerCheckPromptText.includes(row.staticAnswerPrepPromptText) &&
        row.staticNonGoalContext.includes("manual static answer coverage") &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedAnswerDrafts &&
        row.staticNonGoalFlags.noSavedAnswerCoverageState &&
        row.staticNonGoalFlags.noSavedAnswerCoverageRows &&
        row.staticNonGoalFlags.noSavedReviewerCheckPrompts &&
        row.staticNonGoalFlags.noSavedRehearsalState,
    ),
  );

  assert.deepEqual(
    answerCoverage.staticReviewerCheckPromptCards.map(
      (card) => card.sourceStaticAnswerPrepPromptCardId,
    ),
    readinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (card) =>
        card.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
    ),
  );
  assert.deepEqual(
    answerCoverage.staticReviewerCheckPromptCards.map(
      (card) => card.staticReviewerCheckPromptOrder,
    ),
    readinessRehearsalPath.staticAnswerPrepPromptCards.map(
      (card) => card.staticAnswerPrepPromptOrder,
    ),
  );
  assert.deepEqual(
    answerCoverage.staticReviewerCheckPromptCards.map(
      (card) => card.matchedAnswerCoverageRowIds,
    ),
    readinessRehearsalPath.staticAnswerPrepPromptCards.map((card) =>
      expectedAnswerCoverageRowIdsForStaticAnswerPrepPromptCard(
        card,
        answerCoverage.answerCoverageRows,
      ),
    ),
  );
  assert.ok(
    answerCoverage.staticReviewerCheckPromptCards.every(
      (card) =>
        card.followUpReadinessAnswerCoverageStaticReviewerCheckPromptCardId.includes(
          card.sourceStaticAnswerPrepPromptCardId,
        ) &&
        card.staticReviewerCheckPromptText.includes(
          card.sourceStaticAnswerPrepPromptCardId,
        ) &&
        card.staticReviewerCheckPromptText.includes(
          card.staticAnswerPrepPromptText,
        ) &&
        card.staticNonGoalContext.includes("static reviewer-check prompt") &&
        card.staticNonGoalFlags.noSavedReviewerAnswers &&
        card.staticNonGoalFlags.noSavedAnswerDrafts &&
        card.staticNonGoalFlags.noSavedAnswerCoverageState &&
        card.staticNonGoalFlags.noSavedReviewerCheckPrompts &&
        card.staticNonGoalFlags.noSavedStaticAnswerPrepPrompts,
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "review-observation-handoff-follow-up-readiness-answer-coverage",
    ),
  );
  assert.ok(
    missionConsoleSource.includes(
      "Answer coverage and static reviewer-check prompts",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved answer coverage state"));
  assert.ok(missionConsoleSource.includes("No saved reviewer-check prompts"));
});

function expectedStaticAnswerPrepPromptCardIdsForRehearsalPathStep(
  rehearsalPathStep: ReviewObservationHandoffFollowUpReadinessRehearsalPathStepView,
  staticAnswerPrepPromptCards: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView[],
): string[] {
  return staticAnswerPrepPromptCards
    .filter((card) =>
      card.matchedRehearsalPathStepIds.includes(
        rehearsalPathStep.followUpReadinessRehearsalPathStepId,
      ) ||
      card.matchedReviewBoardRowIds.includes(
        rehearsalPathStep.sourceReviewBoardRowId,
      ) ||
      card.matchedFollowUpReadinessBriefRowIds.includes(
        rehearsalPathStep.followUpReadinessBriefRowId,
      ) ||
      card.matchedFollowUpTriageRowIds.includes(
        rehearsalPathStep
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      ) ||
      card.matchedSynthesisRowIds.includes(
        rehearsalPathStep
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ) ||
      card.matchedReviewLaneRowIds.includes(
        rehearsalPathStep
          .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ) ||
      card.matchedReadinessBriefRowIds.includes(
        rehearsalPathStep.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ) ||
      card.matchedReviewPathStepIds.includes(
        rehearsalPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ) ||
      card.matchedCoverageRowIds.includes(
        rehearsalPathStep.sourceReadinessResponseTraceCoverageRowId,
      ) ||
      card.matchedResponseTraceRowIds.includes(
        rehearsalPathStep.sourceReadinessResponseTraceRowId,
      ) ||
      card.matchedResponseWalkthroughStepIds.includes(
        rehearsalPathStep.sourceReadinessResponseWalkthroughStepId,
      ) ||
      card.matchedResponseRowIds.includes(
        rehearsalPathStep.sourceReadinessResponseRowId,
      ) ||
      card.matchedQuestionRowIds.includes(
        rehearsalPathStep.sourceReadinessQuestionRowId,
      ))
    .map(
      (card) =>
        card.followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
    );
}

function expectedAnswerCoverageRowIdsForStaticAnswerPrepPromptCard(
  staticAnswerPrepPromptCard: ReviewObservationHandoffFollowUpReadinessRehearsalPathStaticAnswerPrepPromptCardView,
  answerCoverageRows: ReturnType<
    typeof buildReviewObservationHandoffFollowUpReadinessAnswerCoverage
  > extends { answerCoverageRows: infer T }
    ? T
    : never,
): string[] {
  return answerCoverageRows
    .filter(
      (row) =>
        row.matchedStaticAnswerPrepPromptCardIds.includes(
          staticAnswerPrepPromptCard
            .followUpReadinessRehearsalPathStaticAnswerPrepPromptCardId,
        ) ||
        staticAnswerPrepPromptCard.matchedRehearsalPathStepIds.includes(
          row.sourceRehearsalPathStepId,
        ) ||
        staticAnswerPrepPromptCard.matchedReviewBoardRowIds.includes(
          row.sourceReviewBoardRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedFollowUpReadinessBriefRowIds.includes(
          row.followUpReadinessBriefRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedFollowUpTriageRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedSynthesisRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedReviewLaneRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedReadinessBriefRowIds.includes(
          row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedReviewPathStepIds.includes(
          row.sourceReadinessResponseTraceCoverageReviewPathStepId,
        ) ||
        staticAnswerPrepPromptCard.matchedCoverageRowIds.includes(
          row.sourceReadinessResponseTraceCoverageRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedResponseTraceRowIds.includes(
          row.sourceReadinessResponseTraceRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedResponseWalkthroughStepIds.includes(
          row.sourceReadinessResponseWalkthroughStepId,
        ) ||
        staticAnswerPrepPromptCard.matchedResponseRowIds.includes(
          row.sourceReadinessResponseRowId,
        ) ||
        staticAnswerPrepPromptCard.matchedQuestionRowIds.includes(
          row.sourceReadinessQuestionRowId,
        ),
    )
    .map((row) => row.followUpReadinessAnswerCoverageRowId);
}
