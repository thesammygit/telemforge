import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap } from "../../frontend/src/lib/reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 80 constraint coverage and static response-note prompts from Stage 79", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const answerReviewPath =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath;
  const constraintCoverageMap =
    view.reviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap;
  const builtConstraintCoverageMap =
    buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMap(
      answerReviewPath,
    );
  const missionConsoleSource = readFileSync(
    resolve(repoRoot, "frontend/src/features/mission-console/MissionConsole.tsx"),
    "utf8",
  );

  assert.ok(answerReviewPath);
  assert.ok(constraintCoverageMap);
  assert.ok(builtConstraintCoverageMap);
  assert.strictEqual(
    builtConstraintCoverageMap.sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPath,
    answerReviewPath,
  );
  assert.equal(
    constraintCoverageMap.schema,
    "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board_answer_review_path_constraint_coverage_map.v1",
  );
  assert.equal(constraintCoverageMap.version, 1);
  assert.equal(
    constraintCoverageMap.contractLabel,
    "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness-board answer-review path constraint-coverage map and static response notes",
  );
  assert.equal(constraintCoverageMap.localStatus, "fixture");
  assert.deepEqual(
    constraintCoverageMap.summary.defaultResponseNoteContext
      .sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathDefaultContext,
    answerReviewPath.summary.defaultAnswerReviewContext,
  );
  assert.equal(
    constraintCoverageMap.summary.defaultResponseNoteContext.defaultConstraintCoverageRowId,
    constraintCoverageMap.defaultConstraintCoverageRow
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapRowId,
  );
  assert.equal(
    constraintCoverageMap.summary.defaultResponseNoteContext.defaultStaticResponseNotePromptCardId,
    constraintCoverageMap.defaultStaticResponseNotePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathConstraintCoverageMapStaticResponseNotePromptCardId,
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
      row.sourceStaticResponsePromptCardIds,
      row.sourceResponseMapReviewPathStepId,
      row.sourceResponseMapRowId,
      row.sourceResponseMapStaticFollowUpPromptCardIds,
      row.sourceCoverageReviewPathStepId,
      row.sourceStaticCoveragePromptCardIds,
      row.sourceCoverageMatrixRowId,
      row.sourceStaticReadinessCueCardIds,
      row.sourceReviewPathStepId,
      row.sourceStaticReviewerCheckCardIds,
      row.sourceSourceRecapRowId,
      row.sourceStaticNextPassPromptCardIds,
      row.sourceAnswerFollowUpReviewLaneRowId,
      row.sourceStaticDecisionCueCardIds,
      row.sourceAnswerSourceCrosswalkRowId,
      row.sourceStaticFollowUpPromptCardIds,
      row.sourceAnswerWalkthroughStepId,
      row.sourceStaticReviewNoteCardIds,
      row.sourceAnswerCoverageRowId,
      row.sourceStaticReviewerCheckPromptCardIds,
      row.sourceRehearsalPathStepId,
      row.sourceStaticAnswerPrepPromptCardIds,
      row.sourceReviewBoardRowId,
      row.matchedStaticQuestionPromptCardIds,
      row.followUpReadinessBriefRowId,
      row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
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
            ),
        );

      return [
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepOrder,
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
        [
          step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
        ],
        matchedConstraintNotes.map(
          (card) =>
            card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        ),
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
        matchedConstraintNotes.flatMap((card) => card.staticConstraintNoteLabels),
        constraintCoverageMap.constraintCoverageRows.find(
          (row) =>
            row.sourceAnswerReviewPathStepId ===
            step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
        )?.constraintCoverageLabels,
        step.staticAnswerCheckText,
        matchedConstraintNotes.map((card) => card.responsePromptReadinessText).join(" | "),
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
          ),
      );

      return [
        constraintNote.staticConstraintNoteOrder,
        constraintNote
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        [
          constraintNote
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        ],
        matchedSteps.map(
          (step) =>
            step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStepId,
        ),
        constraintNote.sourceResponsePromptReadinessRowId,
        constraintNote.sourceResponsePromptReadinessRowIds,
        constraintNote.sourceStaticAnswerCheckCardIds,
        constraintNote.sourceStaticResponsePromptCardId,
        constraintNote.sourceResponseMapReviewPathStepIds,
        constraintNote.sourceResponseMapRowIds,
        constraintNote.sourceResponseMapStaticFollowUpPromptCardIds,
        constraintNote.sourceStaticCoveragePromptCardIds,
        constraintNote.sourceStaticReadinessCueCardId,
        constraintNote.sourceStaticReviewerCheckCardId,
        constraintNote.sourceStaticNextPassPromptCardId,
        constraintNote.sourceStaticDecisionCueCardId,
        constraintNote.sourceStaticFollowUpPromptCardId,
        constraintNote.sourceStaticReviewNoteCardId,
        constraintNote.sourceLocalAnchorHrefs,
        constraintNote.evidenceCallbackIds,
        constraintNote.gapDiscussionPointIds,
        constraintNote.deferredScopeReminderIds,
        constraintNote.responsePromptReadinessLabels,
        constraintNote.staticConstraintNoteLabels,
        constraintCoverageMap.staticResponseNotePromptCards.find(
          (card) =>
            card.sourceStaticConstraintNoteCardId ===
            constraintNote
              .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        )?.staticResponseNotePromptLabels,
        constraintNote.responsePromptReadinessText,
        constraintNote.staticConstraintNoteText,
        constraintCoverageMap.staticResponseNotePromptCards.find(
          (card) =>
            card.sourceStaticConstraintNoteCardId ===
            constraintNote
              .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardAnswerReviewPathStaticConstraintNoteCardId,
        )?.staticResponseNotePromptText,
      ];
    }),
  );

  const firstCoverageRow = constraintCoverageMap.constraintCoverageRows[0];
  const firstResponseNotePrompt =
    constraintCoverageMap.staticResponseNotePromptCards[0];
  const labelBoundary =
    /priority|ranking|score|certification|decision|signoff|owner/i;
  assert.ok(
    firstCoverageRow.constraintCoverageText.includes(
      firstCoverageRow.sourceAnswerReviewPathStepId,
    ) &&
      firstCoverageRow.constraintCoverageText.includes(
        firstCoverageRow.sourceStaticAnswerCheckCardId,
      ) &&
      firstCoverageRow.constraintCoverageText.includes(
        firstCoverageRow.sourceStaticConstraintNoteCardIds[0],
      ) &&
      firstCoverageRow.staticResponseNotePromptText.includes(
        firstCoverageRow.sourceAnswerReviewPathStepId,
      ) &&
      firstCoverageRow.staticResponseNotePromptText.includes(
        firstCoverageRow.staticResponsePromptReadinessText,
      ) &&
      firstCoverageRow.constraintCoverageLabels.includes(
        "constraint-coverage row",
      ) &&
      firstCoverageRow.constraintCoverageLabels.includes(
        "manual-answer constraint support map",
      ) &&
      firstCoverageRow.constraintCoverageLabels.every(
        (label) => !labelBoundary.test(label),
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
        (label) => !labelBoundary.test(label),
      ) &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedConstraintCoverageState &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedResponseNoteState &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedReviewerAnswers &&
      firstResponseNotePrompt.staticNonGoalFlags.noSavedResponseNotes,
  );
  assert.ok(
    missionConsoleSource.includes("Stage 80 constraint coverage") &&
      missionConsoleSource.includes("Constraint coverage map and response notes") &&
      missionConsoleSource.includes("No saved constraint-coverage state") &&
      missionConsoleSource.includes("No saved response-note state") &&
      missionConsoleSource.includes(
        "review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board-answer-review-path-constraint-coverage-map",
      ),
  );
});
