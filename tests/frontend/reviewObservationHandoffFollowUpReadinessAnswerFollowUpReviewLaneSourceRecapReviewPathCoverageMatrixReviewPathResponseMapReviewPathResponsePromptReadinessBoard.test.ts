import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 78 response-prompt readiness board and static answer checks from Stage 77", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseMapReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath;
  const readinessBoard =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard;
  const builtReadinessBoard =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard(
      responseMapReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(responseMapReviewPath);
  assert.ok(readinessBoard);
  assert.ok(builtReadinessBoard);
  assert.strictEqual(
    builtReadinessBoard.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath,
    responseMapReviewPath,
  );
  assert.equal(
    readinessBoard.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board.v1",
  );
  assert.equal(readinessBoard.version, 1);
  assert.equal(
    readinessBoard.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness board and static answer checks",
  );
  assert.equal(readinessBoard.localStatus, "fixture");
  assert.deepEqual(
    readinessBoard.summary.defaultReadinessContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathDefaultContext,
    responseMapReviewPath.summary.defaultReviewPathContext,
  );
  assert.equal(
    readinessBoard.summary.defaultReadinessContext.defaultResponsePromptReadinessRowId,
    readinessBoard.defaultResponsePromptReadinessRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
  );
  assert.equal(
    readinessBoard.summary.defaultReadinessContext.defaultStaticAnswerCheckCardId,
    readinessBoard.defaultStaticAnswerCheckCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
  );
  assert.equal(
    readinessBoard.summary.counts.responsePromptReadinessRowCount,
    responseMapReviewPath.staticResponsePromptCards.length,
  );
  assert.equal(
    readinessBoard.summary.counts.staticAnswerCheckCardCount,
    responseMapReviewPath.responseMapReviewPathSteps.length,
  );
  assert.equal(
    readinessBoard.summary.counts.staticResponsePromptCardCount,
    responseMapReviewPath.summary.counts.staticResponsePromptCardCount,
  );
  assert.equal(
    readinessBoard.summary.counts.responseMapReviewPathStepCount,
    responseMapReviewPath.summary.counts.responseMapReviewPathStepCount,
  );
  assert.deepEqual(
    readinessBoard.responsePromptReadinessRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowOrder,
      row.sourceStaticResponsePromptCardId,
      row.sourceStaticResponsePromptCardIds,
      row.sourceResponseMapReviewPathStepIds,
      row.sourceResponseMapRowIds,
      row.sourceResponseMapStaticFollowUpPromptCardIds,
      row.sourceStaticCoveragePromptCardIds,
      row.sourceStaticReadinessCueCardId,
      row.sourceStaticReviewerCheckCardId,
      row.sourceStaticNextPassPromptCardId,
      row.sourceStaticDecisionCueCardId,
      row.sourceStaticFollowUpPromptCardId,
      row.sourceStaticReviewNoteCardId,
      row.matchedResponseMapRowIds,
      row.matchedCoverageReviewPathStepIds,
      row.matchedCoverageRowIds,
      row.matchedReviewPathStepIds,
      row.matchedSourceRecapRowIds,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responsePromptLabels,
      row.responsePromptReadinessLabels,
      row.staticResponsePromptText,
    ]),
    responseMapReviewPath.staticResponsePromptCards.map((card) => [
      card.staticResponsePromptOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
      ],
      card.matchedResponseMapReviewPathStepIds,
      card.matchedResponseMapRowIds,
      card.sourceResponseMapStaticFollowUpPromptCardIds,
      card.sourceStaticCoveragePromptCardIds,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      card.sourceStaticNextPassPromptCardId,
      card.sourceStaticDecisionCueCardId,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticReviewNoteCardId,
      card.matchedResponseMapRowIds,
      card.matchedCoverageReviewPathStepIds,
      card.matchedCoverageRowIds,
      card.matchedReviewPathStepIds,
      card.matchedSourceRecapRowIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responsePromptLabels,
      readinessBoard.responsePromptReadinessRows.find(
        (row) =>
          row.sourceStaticResponsePromptCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
      )?.responsePromptReadinessLabels,
      card.staticResponsePromptText,
    ]),
  );
  assert.deepEqual(
    readinessBoard.staticAnswerCheckCards.map((card) => [
      card.staticAnswerCheckOrder,
      card.sourceResponseMapReviewPathStepId,
      card.sourceResponseMapReviewPathStepIds,
      card.sourceStaticResponsePromptCardIds,
      card.sourceResponseMapRowId,
      card.sourceResponseMapStaticFollowUpPromptCardIds,
      card.sourceCoverageReviewPathStepId,
      card.sourceStaticCoveragePromptCardIds,
      card.sourceCoverageMatrixRowId,
      card.sourceStaticReadinessCueCardIds,
      card.sourceReviewPathStepId,
      card.sourceStaticReviewerCheckCardIds,
      card.sourceSourceRecapRowId,
      card.sourceStaticNextPassPromptCardIds,
      card.sourceAnswerFollowUpReviewLaneRowId,
      card.sourceStaticDecisionCueCardIds,
      card.sourceAnswerSourceCrosswalkRowId,
      card.sourceStaticFollowUpPromptCardIds,
      card.sourceAnswerWalkthroughStepId,
      card.sourceStaticReviewNoteCardIds,
      card.sourceAnswerCoverageRowId,
      card.sourceStaticReviewerCheckPromptCardIds,
      card.sourceRehearsalPathStepId,
      card.sourceStaticAnswerPrepPromptCardIds,
      card.sourceReviewBoardRowId,
      card.matchedStaticQuestionPromptCardIds,
      card.followUpReadinessBriefRowId,
      card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseMapReviewPathLabels,
      card.responsePromptLabels,
      card.staticAnswerCheckLabels,
      card.responseMapReviewPathText,
      card.staticResponsePromptText,
    ]),
    responseMapReviewPath.responseMapReviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepOrder,
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
      [
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
      ],
      responseMapReviewPath.staticResponsePromptCards
        .filter((card) =>
          card.matchedResponseMapReviewPathStepIds.includes(
            step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
          ),
        )
        .map(
          (card) =>
            card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
        ),
      step.sourceResponseMapRowId,
      step.sourceResponseMapStaticFollowUpPromptCardIds,
      step.sourceCoverageReviewPathStepId,
      step.sourceStaticCoveragePromptCardIds,
      step.sourceCoverageMatrixRowId,
      step.sourceStaticReadinessCueCardIds,
      step.sourceReviewPathStepId,
      step.sourceStaticReviewerCheckCardIds,
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
      step.responseMapReviewPathLabels,
      step.responsePromptLabels,
      readinessBoard.staticAnswerCheckCards.find(
        (card) =>
          card.sourceResponseMapReviewPathStepId ===
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
      )?.staticAnswerCheckLabels,
      step.responseMapReviewPathText,
      step.staticResponsePromptText,
    ]),
  );

  const firstReadinessRow = readinessBoard.responsePromptReadinessRows[0];
  const firstAnswerCheck = readinessBoard.staticAnswerCheckCards[0];
  const labelBoundary = /priority|ranking|score|certification|decision/i;
  assert.ok(
    firstReadinessRow.responsePromptReadinessText.includes(
      firstReadinessRow.sourceStaticResponsePromptCardId,
    ) &&
      firstReadinessRow.responsePromptReadinessText.includes(
        firstReadinessRow.sourceResponseMapStaticFollowUpPromptCardId,
      ) &&
      firstReadinessRow.responsePromptReadinessText.includes(
        firstReadinessRow.sourceStaticCoveragePromptCardId,
      ) &&
      firstReadinessRow.responsePromptReadinessText.includes(
        firstReadinessRow.sourceStaticReadinessCueCardId,
      ) &&
      firstReadinessRow.staticAnswerCheckText.includes(
        firstReadinessRow.sourceStaticResponsePromptCardId,
      ) &&
      firstReadinessRow.responsePromptReadinessLabels.includes(
        "response-prompt readiness row",
      ) &&
      firstReadinessRow.responsePromptReadinessLabels.includes(
        "static answer-check context",
      ) &&
      firstReadinessRow.responsePromptReadinessLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstReadinessRow.staticNonGoalFlags.noSavedPromptReadinessState &&
      firstReadinessRow.staticNonGoalFlags.noSavedAnswerCheckState &&
      firstReadinessRow.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstReadinessRow.staticNonGoalFlags.noSavedResponsePrompts,
  );
  assert.ok(
    firstAnswerCheck.staticAnswerCheckText.includes(
      firstAnswerCheck.sourceResponseMapReviewPathStepId,
    ) &&
      firstAnswerCheck.staticAnswerCheckText.includes(
        firstAnswerCheck.sourceResponseMapRowId,
      ) &&
      firstAnswerCheck.staticAnswerCheckText.includes(
        firstAnswerCheck.sourceCoverageReviewPathStepId,
      ) &&
      firstAnswerCheck.staticAnswerCheckText.includes(
        firstAnswerCheck.sourceSourceRecapRowId,
      ) &&
      firstAnswerCheck.staticAnswerCheckLabels.includes(
        "static answer check",
      ) &&
      firstAnswerCheck.staticAnswerCheckLabels.includes(
        "manual answer constraint",
      ) &&
      firstAnswerCheck.staticAnswerCheckLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstAnswerCheck.staticNonGoalFlags.noSavedPromptReadinessState &&
      firstAnswerCheck.staticNonGoalFlags.noSavedAnswerCheckState &&
      firstAnswerCheck.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstAnswerCheck.staticNonGoalFlags.noSavedResponseMapReviewPathState,
  );
  assert.ok(
    missionConsoleSource.includes("Stage 78 response-prompt readiness") &&
      missionConsoleSource.includes("Readiness board and static answer checks") &&
      missionConsoleSource.includes("No saved prompt readiness state") &&
      missionConsoleSource.includes("No saved answer-check state") &&
      missionConsoleSource.includes(
        "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board",
      ),
  );
});
