import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildFixtureStreamConnection,
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath derives Stage 99 answer-review path from Stage 98", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 99 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard;
  const answerReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath(
      readinessBoard,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(readinessBoard);
  assert.ok(answerReviewPath);
  assert.strictEqual(
    answerReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
    readinessBoard,
  );
  assert.equal(
    answerReviewPath.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path.v1",
  );
  assert.equal(answerReviewPath.version, 1);
  assert.equal(
    answerReviewPath.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path and static constraint notes",
  );
  assert.equal(answerReviewPath.localStatus, "fixture");
  assert.deepEqual(
    answerReviewPath.summary.defaultAnswerReviewContext
      .sourceStage98DefaultResponsePromptReadinessContext,
    readinessBoard.summary.defaultResponsePromptReadinessContext,
  );
  assert.equal(
    answerReviewPath.summary.defaultAnswerReviewContext.defaultAnswerReviewPathStepId,
    answerReviewPath.defaultAnswerReviewPathStep.answerReviewPathStepId,
  );
  assert.equal(
    answerReviewPath.summary.defaultAnswerReviewContext.defaultStaticConstraintNoteCardId,
    answerReviewPath.defaultStaticConstraintNoteCard.staticConstraintNoteCardId,
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
      step.answerReviewPathStepOrder,
      step.sourceStaticAnswerCheckCardId,
      step.sourceStaticAnswerCheckCardIds,
      step.sourceResponsePromptReadinessRowIds,
      step.sourceStaticResponsePromptCardId,
      step.sourceRevisionFollowUpReadinessReviewPathStepIds,
      step.sourceRevisionFollowUpReadinessRowIds,
      step.sourceStaticResponseCheckCardId,
      step.sourceStaticRevisionFollowUpPromptCardId,
      step.sourceStaticRevisionCheckCardId,
      step.sourceStaticRevisionPromptCardId,
      step.sourceStaticDraftCheckCardId,
      step.sourceStaticResponseCueCardId,
      step.sourceStaticReviewPromptCardId,
      step.sourceStaticReadinessCueCardId,
      step.sourceStaticFollowUpPromptCardId,
      step.sourceStaticCitationGapCueCardId,
      step.sourceStaticCitationCheckPromptCardId,
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
      card.staticAnswerCheckCardId,
      [card.staticAnswerCheckCardId],
      readinessBoard.responsePromptReadinessRows
        .filter((row) =>
          row.sourceStaticResponsePromptCardIds.includes(
            card.sourceStaticResponsePromptCardId,
          ),
        )
        .map((row) => row.responsePromptReadinessRowId),
      card.sourceStaticResponsePromptCardId,
      card.sourceRevisionFollowUpReadinessReviewPathStepIds,
      card.sourceRevisionFollowUpReadinessRowIds,
      card.sourceStaticResponseCheckCardId,
      card.sourceStaticRevisionFollowUpPromptCardId,
      card.sourceStaticRevisionCheckCardId,
      card.sourceStaticRevisionPromptCardId,
      card.sourceStaticDraftCheckCardId,
      card.sourceStaticResponseCueCardId,
      card.sourceStaticReviewPromptCardId,
      card.sourceStaticReadinessCueCardId,
      card.sourceStaticFollowUpPromptCardId,
      card.sourceStaticCitationGapCueCardId,
      card.sourceStaticCitationCheckPromptCardId,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticAnswerCheckLabels,
      answerReviewPath.answerReviewPathSteps.find(
        (step) =>
          step.sourceStaticAnswerCheckCardId === card.staticAnswerCheckCardId,
      )?.answerReviewPathLabels,
      card.staticAnswerCheckText,
    ]),
  );

  assert.deepEqual(
    answerReviewPath.staticConstraintNoteCards.map((card) => [
      card.staticConstraintNoteOrder,
      card.sourceResponsePromptReadinessRowId,
      card.sourceResponsePromptReadinessRowIds,
      card.sourceStaticAnswerCheckCardIds,
      card.sourceRevisionFollowUpReadinessReviewPathStepId,
      card.sourceStaticResponsePromptCardIds,
      card.sourceRevisionFollowUpReadinessRowId,
      card.sourceStaticResponseCheckCardIds,
      card.sourceRevisionCoverageReviewPathStepId,
      card.sourceStaticRevisionFollowUpPromptCardIds,
      card.sourceStaticRevisionCheckCardIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responsePromptReadinessLabels,
      card.staticConstraintNoteLabels,
      card.responsePromptReadinessText,
    ]),
    readinessBoard.responsePromptReadinessRows.map((row) => [
      row.responsePromptReadinessRowOrder,
      row.responsePromptReadinessRowId,
      [row.responsePromptReadinessRowId],
      readinessBoard.staticAnswerCheckCards
        .filter((card) =>
          row.sourceStaticResponsePromptCardIds.includes(
            card.sourceStaticResponsePromptCardId,
          ),
        )
        .map((card) => card.staticAnswerCheckCardId),
      row.sourceRevisionFollowUpReadinessReviewPathStepId,
      row.sourceStaticResponsePromptCardIds,
      row.sourceRevisionFollowUpReadinessRowId,
      row.sourceStaticResponseCheckCardIds,
      row.sourceRevisionCoverageReviewPathStepId,
      row.sourceStaticRevisionFollowUpPromptCardIds,
      row.sourceStaticRevisionCheckCardIds,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.responsePromptReadinessLabels,
      answerReviewPath.staticConstraintNoteCards.find(
        (card) =>
          card.sourceResponsePromptReadinessRowId ===
          row.responsePromptReadinessRowId,
      )?.staticConstraintNoteLabels,
      row.responsePromptReadinessText,
    ]),
  );

  const firstAnswerReviewStep = answerReviewPath.answerReviewPathSteps[0];
  const firstConstraintNote = answerReviewPath.staticConstraintNoteCards[0];
  const forbiddenLabelBoundary = /priority|ranking|score|certification|owner|signoff/i;
  assert.ok(
    firstAnswerReviewStep.answerReviewPathText.includes(
      firstAnswerReviewStep.sourceStaticAnswerCheckCardId,
    ) &&
      firstAnswerReviewStep.answerReviewPathText.includes(
        firstAnswerReviewStep.sourceStaticResponsePromptCardId,
      ) &&
      firstAnswerReviewStep.answerReviewPathText.includes(
        firstAnswerReviewStep.sourceStaticResponseCheckCardId,
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
        (label) => !forbiddenLabelBoundary.test(label),
      ) &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedAnswerReviewState &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedConstraintNoteState &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstAnswerReviewStep.staticNonGoalFlags.noSavedPromptReadinessState,
  );
  assert.ok(
    firstConstraintNote.staticConstraintNoteText.includes(
      firstConstraintNote.sourceResponsePromptReadinessRowId,
    ) &&
      firstConstraintNote.staticConstraintNoteText.includes(
        firstConstraintNote.sourceRevisionFollowUpReadinessReviewPathStepId,
      ) &&
      firstConstraintNote.staticConstraintNoteText.includes(
        firstConstraintNote.sourceStaticResponseCheckCardIds[0],
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
        (label) => !forbiddenLabelBoundary.test(label),
      ) &&
      firstConstraintNote.staticNonGoalFlags.noSavedAnswerReviewState &&
      firstConstraintNote.staticNonGoalFlags.noSavedConstraintNoteState &&
      firstConstraintNote.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstConstraintNote.staticNonGoalFlags.noSavedPromptReadinessState,
  );

  const liveStream = {
    ...buildFixtureStreamConnection(stage07ConsoleFixture),
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };
  const liveView = buildMissionConsoleView(
    stage07ConsoleFixture,
    "thermal",
    liveStream,
  );
  const liveAnswerReviewPath =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath(
      liveView.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
    );
  assert.equal(liveAnswerReviewPath?.localStatus, "local-live");

  assert.ok(
    missionConsoleSource.includes("Stage 99 answer-review path") &&
      missionConsoleSource.includes("Answer-review path and constraint notes") &&
      missionConsoleSource.includes("No saved answer-review state") &&
      missionConsoleSource.includes("No saved constraint-note state") &&
      missionConsoleSource.includes(
        "constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path",
      ),
  );
});
