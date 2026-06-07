import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 79 answer-review path and static constraint notes from Stage 78", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessBoard =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard;
  const answerReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath;
  const builtAnswerReviewPath =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath(
      readinessBoard,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(readinessBoard);
  assert.ok(answerReviewPath);
  assert.ok(builtAnswerReviewPath);
  assert.strictEqual(
    builtAnswerReviewPath.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard,
    readinessBoard,
  );
  assert.equal(
    answerReviewPath.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path.v1",
  );
  assert.equal(answerReviewPath.version, 1);
  assert.equal(
    answerReviewPath.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path and static constraint notes",
  );
  assert.equal(answerReviewPath.localStatus, "fixture");
  assert.deepEqual(
    answerReviewPath.summary.defaultAnswerReviewContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardDefaultContext,
    readinessBoard.summary.defaultReadinessContext,
  );
  assert.equal(
    answerReviewPath.summary.defaultAnswerReviewContext.defaultAnswerReviewPathStepId,
    answerReviewPath.defaultAnswerReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
  );
  assert.equal(
    answerReviewPath.summary.defaultAnswerReviewContext.defaultStaticConstraintNoteCardId,
    answerReviewPath.defaultStaticConstraintNoteCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
  );
  assert.equal(
    answerReviewPath.summary.counts.answerReviewPathStepCount,
    readinessBoard.staticAnswerCheckCards.length,
  );
  assert.equal(
    answerReviewPath.summary.counts.staticConstraintNoteCardCount,
    readinessBoard.responsePromptReadinessRows.length,
  );
  assert.equal(
    answerReviewPath.summary.counts.staticAnswerCheckCardCount,
    readinessBoard.summary.counts.staticAnswerCheckCardCount,
  );
  assert.equal(
    answerReviewPath.summary.counts.responsePromptReadinessRowCount,
    readinessBoard.summary.counts.responsePromptReadinessRowCount,
  );
  assert.deepEqual(
    answerReviewPath.answerReviewPathSteps.map((step) => [
      step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepOrder,
      step.sourceStaticAnswerCheckCardId,
      step.sourceStaticAnswerCheckCardIds,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceStaticResponsePromptCardIds,
      step.sourceResponseMapReviewPathStepId,
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
      step.staticAnswerCheckLabels,
      step.answerReviewPathLabels,
      step.staticAnswerCheckText,
    ]),
    readinessBoard.staticAnswerCheckCards.map((card) => [
      card.staticAnswerCheckOrder,
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
      [
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
      ],
      readinessBoard.responsePromptReadinessRows
        .filter((row) =>
          row.sourceResponseMapReviewPathStepIds.includes(
            card.sourceResponseMapReviewPathStepId,
          ),
        )
        .map(
          (row) =>
            row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
        ),
      card.sourceStaticResponsePromptCardIds,
      card.sourceResponseMapReviewPathStepId,
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
      card.staticAnswerCheckLabels,
      answerReviewPath.answerReviewPathSteps.find(
        (step) =>
          step.sourceStaticAnswerCheckCardId ===
          card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
      )?.answerReviewPathLabels,
      card.staticAnswerCheckText,
    ]),
  );
  assert.deepEqual(
    answerReviewPath.staticConstraintNoteCards.map((card) => [
      card.staticConstraintNoteOrder,
      card.sourceResponsePromptReadinessRowId,
      card.sourceStaticAnswerCheckCardIds,
      card.sourceStaticResponsePromptCardId,
      card.sourceResponseMapReviewPathStepIds,
      card.sourceResponseMapRowIds,
      card.sourceResponseMapStaticFollowUpPromptCardIds,
      card.sourceStaticCoveragePromptCardIds,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticReviewerCheckCardId,
      card.sourceStaticNextPassPromptCardId,
      card.sourceStaticDecisionCueCardId,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticReviewNoteCardId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responsePromptReadinessLabels,
      card.staticConstraintNoteLabels,
      card.responsePromptReadinessText,
    ]),
    readinessBoard.responsePromptReadinessRows.map((row) => [
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowOrder,
      row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
      readinessBoard.staticAnswerCheckCards
        .filter((card) =>
          card.sourceStaticResponsePromptCardIds.includes(
            row.sourceStaticResponsePromptCardId,
          ),
        )
        .map(
          (card) =>
            card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
        ),
      row.sourceStaticResponsePromptCardId,
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
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responsePromptReadinessLabels,
      answerReviewPath.staticConstraintNoteCards.find(
        (card) =>
          card.sourceResponsePromptReadinessRowId ===
          row.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
      )?.staticConstraintNoteLabels,
      row.responsePromptReadinessText,
    ]),
  );

  const firstAnswerReviewStep = answerReviewPath.answerReviewPathSteps[0];
  const firstConstraintNote = answerReviewPath.staticConstraintNoteCards[0];
  const labelBoundary = /priority|ranking|score|certification|decision/i;
  assert.ok(
    firstAnswerReviewStep.answerReviewPathText.includes(
      firstAnswerReviewStep.sourceStaticAnswerCheckCardId,
    ) &&
      firstAnswerReviewStep.answerReviewPathText.includes(
        firstAnswerReviewStep.sourceResponseMapReviewPathStepId,
      ) &&
      firstAnswerReviewStep.answerReviewPathText.includes(
        firstAnswerReviewStep.sourceResponseMapRowId,
      ) &&
      firstAnswerReviewStep.staticConstraintNoteText.includes(
        firstAnswerReviewStep.sourceStaticAnswerCheckCardId,
      ) &&
      firstAnswerReviewStep.answerReviewPathLabels.includes(
        "answer-review path step",
      ) &&
      firstAnswerReviewStep.answerReviewPathLabels.includes(
        "static constraint-note context",
      ) &&
      firstAnswerReviewStep.answerReviewPathLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedAnswerReviewState &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedConstraintNoteState &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedAnswerCheckState,
  );
  assert.ok(
    firstConstraintNote.staticConstraintNoteText.includes(
      firstConstraintNote.sourceResponsePromptReadinessRowId,
    ) &&
      firstConstraintNote.staticConstraintNoteText.includes(
        firstConstraintNote.sourceStaticResponsePromptCardId,
      ) &&
      firstConstraintNote.staticConstraintNoteText.includes(
        firstConstraintNote.sourceResponseMapStaticFollowUpPromptCardId,
      ) &&
      firstConstraintNote.answerReviewPathText.includes(
        firstConstraintNote.sourceStaticAnswerCheckCardIds[0],
      ) &&
      firstConstraintNote.staticConstraintNoteLabels.includes(
        "static constraint note",
      ) &&
      firstConstraintNote.staticConstraintNoteLabels.includes(
        "manual answer constraint carry-forward",
      ) &&
      firstConstraintNote.staticConstraintNoteLabels.every(
        (label) => !labelBoundary.test(label),
      ) &&
      firstConstraintNote.staticNonGoalFlags.noSavedAnswerReviewState &&
      firstConstraintNote.staticNonGoalFlags.noSavedConstraintNoteState &&
      firstConstraintNote.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstConstraintNote.staticNonGoalFlags.noSavedPromptReadinessState,
  );
  assert.ok(
    missionConsoleSource.includes("Stage 79 answer-review path") &&
      missionConsoleSource.includes("Answer-review path and constraint notes") &&
      missionConsoleSource.includes("No saved answer-review state") &&
      missionConsoleSource.includes("No saved constraint-note state") &&
      missionConsoleSource.includes(
        "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path",
      ),
  );
});
