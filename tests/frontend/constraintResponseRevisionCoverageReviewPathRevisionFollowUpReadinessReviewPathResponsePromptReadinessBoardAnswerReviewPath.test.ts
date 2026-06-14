import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Stage 119 answer-review path derives steps and constraint notes from Stage 118", async () => {
  const {
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 119 helper module to exist: ${error.message}`),
  );
  assert.equal(
    typeof buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath,
    "function",
  );

  const view = buildMissionConsoleView(stage07ConsoleFixture);
  const sourceResponsePromptReadinessBoard =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard;
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(sourceResponsePromptReadinessBoard);

  const answerReviewPath =
    buildConstraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath(
      sourceResponsePromptReadinessBoard,
    );

  assert.ok(answerReviewPath);
  assert.equal(
    answerReviewPath.schema,
    "telemforge.constraint_response_revision_coverage_review_path_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path.v1",
  );
  assert.strictEqual(
    answerReviewPath.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
    sourceResponsePromptReadinessBoard,
  );
  assert.equal(
    answerReviewPath.summary.counts.answerReviewPathStepCount,
    sourceResponsePromptReadinessBoard.staticAnswerCheckCards.length,
  );
  assert.equal(
    answerReviewPath.summary.counts.staticConstraintNoteCardCount,
    sourceResponsePromptReadinessBoard.responsePromptReadinessRows.length,
  );
  assert.deepEqual(
    answerReviewPath.summary.defaultAnswerReviewContext
      .sourceStage118DefaultResponsePromptReadinessContext,
    sourceResponsePromptReadinessBoard.summary
      .defaultResponsePromptReadinessContext,
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
      step.sourceLocalAnchorHrefs,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.staticAnswerCheckLabels,
      step.answerReviewPathLabels,
    ]),
    sourceResponsePromptReadinessBoard.staticAnswerCheckCards.map((card) => [
      card.staticAnswerCheckOrder,
      card.staticAnswerCheckCardId,
      [card.staticAnswerCheckCardId],
      sourceResponsePromptReadinessBoard.responsePromptReadinessRows
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
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.staticAnswerCheckLabels,
      answerReviewPath.answerReviewPathSteps.find(
        (step) =>
          step.sourceStaticAnswerCheckCardId === card.staticAnswerCheckCardId,
      )?.answerReviewPathLabels,
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
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responsePromptReadinessLabels,
      card.staticConstraintNoteLabels,
    ]),
    sourceResponsePromptReadinessBoard.responsePromptReadinessRows.map((row) => [
      row.responsePromptReadinessRowOrder,
      row.responsePromptReadinessRowId,
      [row.responsePromptReadinessRowId],
      sourceResponsePromptReadinessBoard.staticAnswerCheckCards
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
    ]),
  );

  const firstStep = answerReviewPath.answerReviewPathSteps[0];
  const firstConstraintNote = answerReviewPath.staticConstraintNoteCards[0];
  const forbiddenLabelBoundary = /priority|ranking|score|certification|owner|signoff/i;

  assert.ok(
    firstStep.answerReviewPathText.includes(
      firstStep.sourceStaticAnswerCheckCardId,
    ) &&
      firstStep.answerReviewPathText.includes(
        firstStep.sourceStaticResponsePromptCardId,
      ) &&
      firstStep.answerReviewPathText.includes(
        firstStep.sourceStaticResponseCheckCardId,
      ) &&
      firstStep.answerReviewPathText.includes(
        "Stage 115 through Stage 64 source lineage ids",
      ) &&
      firstStep.staticConstraintNoteText.includes(
        firstStep.sourceStaticAnswerCheckCardId,
      ) &&
      firstStep.answerReviewPathLabels.includes("answer-review path step") &&
      firstStep.answerReviewPathLabels.includes(
        "static constraint-note context",
      ) &&
      firstStep.answerReviewPathLabels.every(
        (label) => !forbiddenLabelBoundary.test(label),
      ) &&
      firstStep.staticNonGoalFlags.noSavedAnswerReviewState &&
      firstStep.staticNonGoalFlags.noSavedConstraintNoteState &&
      firstStep.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstStep.staticNonGoalFlags.noSavedPromptReadinessState &&
      firstStep.staticNonGoalFlags.noSavedAnswerCheckState,
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

  assert.strictEqual(
    view.constraintResponseRevisionCoverageReviewPathRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath
      ?.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapReviewPathSourceCrosswalkReviewPathSourceReviewReadinessLaneSourceFollowUpMapSourceCitationReviewLaneEvidenceCheckReviewPathEvidenceGapReadinessMatrixEvidenceGapFollowUpReviewPathEvidenceGapFollowUpCoverageBoardEvidenceGapFollowUpCoverageReviewPathResponseReadinessBoardResponseReadinessReviewPathRevisionCoverageReviewPathRevisionFollowUpReadinessBoardRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoard,
    sourceResponsePromptReadinessBoard,
  );
  assert.ok(missionConsoleSource.includes("Stage 119 answer-review path"));
  assert.ok(
    missionConsoleSource.includes(
      "Answer-review path and static constraint notes",
    ),
  );
  assert.ok(missionConsoleSource.includes("No saved answer-review state"));
  assert.ok(missionConsoleSource.includes("No saved constraint-note state"));
});
