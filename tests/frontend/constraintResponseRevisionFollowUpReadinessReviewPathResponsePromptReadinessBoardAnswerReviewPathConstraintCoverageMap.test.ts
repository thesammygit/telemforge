import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap derives Stage 100 coverage from Stage 99", async () => {
  const {
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap,
  } = await import(
    "../../frontend/src/lib/constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.ts"
  ).catch((error) =>
    assert.fail(`expected Stage 100 helper module to exist: ${error.message}`),
  );
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerReviewPath =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath;
  const viewConstraintCoverageMap =
    view.constraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap;
  const constraintCoverageMap =
    buildConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap(
      answerReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerReviewPath);
  assert.ok(viewConstraintCoverageMap);
  assert.ok(constraintCoverageMap);
  assert.deepEqual(viewConstraintCoverageMap, constraintCoverageMap);
  assert.strictEqual(
    constraintCoverageMap.sourceConstraintResponseRevisionFollowUpReadinessReviewPathResponsePromptReadinessBoardAnswerReviewPath,
    answerReviewPath,
  );
  assert.equal(
    constraintCoverageMap.schema,
    "telemforge.constraint_response_revision_follow_up_readiness_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map.v1",
  );
  assert.equal(constraintCoverageMap.version, 1);
  assert.equal(
    constraintCoverageMap.contractLabel,
    "local deterministic constraint-response revision follow-up readiness review-path response-prompt readiness-board answer-review path constraint-coverage map and static response notes",
  );
  assert.deepEqual(
    constraintCoverageMap.summary.defaultResponseNoteContext
      .sourceStage99DefaultAnswerReviewContext,
    answerReviewPath.summary.defaultAnswerReviewContext,
  );
  assert.equal(
    constraintCoverageMap.summary.defaultResponseNoteContext.defaultConstraintCoverageRowId,
    constraintCoverageMap.defaultConstraintCoverageRow.constraintCoverageRowId,
  );
  assert.equal(
    constraintCoverageMap.summary.defaultResponseNoteContext.defaultStaticResponseNotePromptCardId,
    constraintCoverageMap.defaultStaticResponseNotePromptCard
      .staticResponseNotePromptCardId,
  );
  assert.equal(
    constraintCoverageMap.summary.counts.constraintCoverageRowCount,
    answerReviewPath.answerReviewPathSteps.length,
  );
  assert.equal(
    constraintCoverageMap.summary.counts.staticResponseNotePromptCardCount,
    answerReviewPath.staticConstraintNoteCards.length,
  );
  assert.equal(
    constraintCoverageMap.summary.counts.answerReviewPathStepCount,
    answerReviewPath.summary.counts.answerReviewPathStepCount,
  );
  assert.equal(
    constraintCoverageMap.summary.counts.staticConstraintNoteCardCount,
    answerReviewPath.summary.counts.staticConstraintNoteCardCount,
  );

  assert.deepEqual(
    constraintCoverageMap.constraintCoverageRows.map((row) => [
      row.constraintCoverageRowOrder,
      row.sourceAnswerReviewPathStepId,
      row.sourceAnswerReviewPathStepIds,
      row.sourceStaticConstraintNoteCardIds,
      row.sourceStaticAnswerCheckCardId,
      row.sourceStaticAnswerCheckCardIds,
      row.sourceResponsePromptReadinessRowIds,
      row.sourceStaticResponsePromptCardId,
      row.sourceStaticResponsePromptCardIds,
      row.sourceRevisionFollowUpReadinessReviewPathStepIds,
      row.sourceRevisionFollowUpReadinessRowIds,
      row.sourceStaticResponseCheckCardId,
      row.sourceStaticRevisionFollowUpPromptCardId,
      row.sourceStaticRevisionCheckCardId,
      row.sourceStaticRevisionPromptCardId,
      row.sourceStaticDraftCheckCardId,
      row.sourceStaticResponseCueCardId,
      row.sourceStaticReviewPromptCardId,
      row.sourceStaticReadinessCueCardId,
      row.sourceStaticFollowUpPromptCardId,
      row.sourceStaticCitationGapCueCardId,
      row.sourceStaticCitationCheckPromptCardId,
      row.sourceLocalAnchorHrefs,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.staticAnswerCheckLabels,
      row.answerReviewPathLabels,
      row.staticConstraintNoteLabels,
      row.constraintCoverageLabels,
      row.staticAnswerCheckText,
      row.staticResponsePromptReadinessText,
      row.answerReviewPathText,
      row.staticConstraintNoteText,
    ]),
    answerReviewPath.answerReviewPathSteps.map((step) => {
      const matchedConstraintNotes =
        answerReviewPath.staticConstraintNoteCards.filter(
          (card) =>
            step.sourceResponsePromptReadinessRowIds.includes(
              card.sourceResponsePromptReadinessRowId,
            ) ||
            card.sourceStaticAnswerCheckCardIds.includes(
              step.sourceStaticAnswerCheckCardId,
            ) ||
            step.sourceStaticResponsePromptCardIds.includes(
              card.sourceStaticResponsePromptCardIds[0],
            ),
        );

      return [
        step.answerReviewPathStepOrder,
        step.answerReviewPathStepId,
        [step.answerReviewPathStepId],
        matchedConstraintNotes.map((card) => card.staticConstraintNoteCardId),
        step.sourceStaticAnswerCheckCardId,
        step.sourceStaticAnswerCheckCardIds,
        step.sourceResponsePromptReadinessRowIds,
        step.sourceStaticResponsePromptCardId,
        step.sourceStaticResponsePromptCardIds,
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
        matchedConstraintNotes.flatMap((card) => card.staticConstraintNoteLabels),
        constraintCoverageMap.constraintCoverageRows.find(
          (row) => row.sourceAnswerReviewPathStepId === step.answerReviewPathStepId,
        )?.constraintCoverageLabels,
        step.staticAnswerCheckText,
        matchedConstraintNotes
          .map((card) => card.responsePromptReadinessText)
          .join(" | "),
        step.answerReviewPathText,
        step.staticConstraintNoteText,
      ];
    }),
  );

  assert.deepEqual(
    constraintCoverageMap.staticResponseNotePromptCards.map((card) => [
      card.staticResponseNotePromptOrder,
      card.sourceStaticConstraintNoteCardId,
      card.sourceStaticConstraintNoteCardIds,
      card.sourceAnswerReviewPathStepIds,
      card.sourceResponsePromptReadinessRowId,
      card.sourceResponsePromptReadinessRowIds,
      card.sourceStaticAnswerCheckCardIds,
      card.sourceStaticResponsePromptCardIds,
      card.sourceLocalAnchorHrefs,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responsePromptReadinessLabels,
      card.staticConstraintNoteLabels,
      card.staticResponseNotePromptLabels,
      card.responsePromptReadinessText,
      card.staticConstraintNoteText,
      card.staticResponseNotePromptText,
    ]),
    answerReviewPath.staticConstraintNoteCards.map((constraintNote) => {
      const matchedSteps = answerReviewPath.answerReviewPathSteps.filter(
        (step) =>
          step.sourceResponsePromptReadinessRowIds.includes(
            constraintNote.sourceResponsePromptReadinessRowId,
          ) ||
          constraintNote.sourceStaticAnswerCheckCardIds.includes(
            step.sourceStaticAnswerCheckCardId,
          ) ||
          step.sourceStaticResponsePromptCardIds.includes(
            constraintNote.sourceStaticResponsePromptCardIds[0],
          ),
      );

      return [
        constraintNote.staticConstraintNoteOrder,
        constraintNote.staticConstraintNoteCardId,
        [constraintNote.staticConstraintNoteCardId],
        matchedSteps.map((step) => step.answerReviewPathStepId),
        constraintNote.sourceResponsePromptReadinessRowId,
        constraintNote.sourceResponsePromptReadinessRowIds,
        constraintNote.sourceStaticAnswerCheckCardIds,
        constraintNote.sourceStaticResponsePromptCardIds,
        constraintNote.sourceLocalAnchorHrefs,
        constraintNote.evidenceCallbackIds,
        constraintNote.gapDiscussionPointIds,
        constraintNote.deferredScopeReminderIds,
        constraintNote.responsePromptReadinessLabels,
        constraintNote.staticConstraintNoteLabels,
        constraintCoverageMap.staticResponseNotePromptCards.find(
          (card) =>
            card.sourceStaticConstraintNoteCardId ===
            constraintNote.staticConstraintNoteCardId,
        )?.staticResponseNotePromptLabels,
        constraintNote.responsePromptReadinessText,
        constraintNote.staticConstraintNoteText,
        constraintCoverageMap.staticResponseNotePromptCards.find(
          (card) =>
            card.sourceStaticConstraintNoteCardId ===
            constraintNote.staticConstraintNoteCardId,
        )?.staticResponseNotePromptText,
      ];
    }),
  );

  const firstCoverageRow = constraintCoverageMap.constraintCoverageRows[0];
  const firstResponseNotePrompt =
    constraintCoverageMap.staticResponseNotePromptCards[0];
  const forbiddenLabelBoundary = /priority|ranking|score|certification|owner|signoff/i;
  assert.ok(
    firstCoverageRow.constraintCoverageText.includes(
      firstCoverageRow.sourceAnswerReviewPathStepId,
    ) &&
      firstCoverageRow.constraintCoverageText.includes(
        firstCoverageRow.sourceStaticAnswerCheckCardId,
      ) &&
      firstCoverageRow.staticResponseNotePromptText.includes(
        firstCoverageRow.sourceAnswerReviewPathStepId,
      ) &&
      firstCoverageRow.constraintCoverageLabels.includes(
        "constraint-coverage row",
      ) &&
      firstCoverageRow.constraintCoverageLabels.includes(
        "manual-answer constraint support map",
      ) &&
      firstCoverageRow.constraintCoverageLabels.every(
        (label) => !forbiddenLabelBoundary.test(label),
      ) &&
      firstCoverageRow.staticNonGoalFlags.noSavedConstraintCoverageState &&
      firstCoverageRow.staticNonGoalFlags.noSavedResponseNoteState &&
      firstCoverageRow.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstCoverageRow.staticNonGoalFlags.noSavedResponseNotes,
  );
  assert.ok(
    firstResponseNotePrompt.staticResponseNotePromptText.includes(
      firstResponseNotePrompt.sourceStaticConstraintNoteCardId,
    ) &&
      firstResponseNotePrompt.staticResponseNotePromptText.includes(
        firstResponseNotePrompt.sourceResponsePromptReadinessRowId,
      ) &&
      firstResponseNotePrompt.staticResponseNotePromptLabels.includes(
        "static response-note prompt",
      ) &&
      firstResponseNotePrompt.staticResponseNotePromptLabels.includes(
        "manual answer constraint carry-forward",
      ) &&
      firstResponseNotePrompt.staticResponseNotePromptLabels.every(
        (label) => !forbiddenLabelBoundary.test(label),
      ) &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedConstraintCoverageState &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedResponseNoteState &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedResponseNotes,
  );

  assert.match(
    missionConsoleSource,
    /constraint-response-revision-follow-up-readiness-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map/,
  );
  assert.match(missionConsoleSource, /Stage 100 constraint coverage/);
  assert.match(missionConsoleSource, /Constraint coverage map and response notes/);
});
