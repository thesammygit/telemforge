import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildFixtureStreamConnection,
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseMatrix } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseMatrix.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseMatrix derives ordered response rows from Stage 55 questions", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const questionBoard =
    view.reviewObservationHandoffSourceReadinessQuestionBoard;
  const responseMatrix =
    buildReviewObservationHandoffSourceReadinessResponseMatrix(questionBoard);
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(questionBoard);
  assert.ok(responseMatrix);
  assert.equal(
    responseMatrix.schema,
    "telemforge.review_observation_handoff_source_readiness_response_matrix.v1",
  );
  assert.equal(responseMatrix.version, 1);
  assert.equal(
    responseMatrix.contractLabel,
    "local deterministic observation handoff source readiness response matrix and static evidence notes",
  );
  assert.equal(responseMatrix.localStatus, "fixture");
  assert.strictEqual(
    responseMatrix.sourceReviewObservationHandoffSourceReadinessQuestionBoard,
    questionBoard,
  );
  assert.deepEqual(responseMatrix.summary.defaultResponseContext, {
    defaultResponseRowId:
      responseMatrix.defaultResponseRow.sourceReadinessResponseRowId,
    defaultQuestionRowId:
      questionBoard.summary.defaultQuestionContext.defaultQuestionRowId,
    defaultRehearsalPromptRowId:
      questionBoard.summary.defaultQuestionContext.defaultRehearsalPromptRowId,
    defaultSourceReadinessRowId:
      questionBoard.summary.defaultQuestionContext.defaultSourceReadinessRowId,
    defaultSourceReadoutRowId:
      questionBoard.summary.defaultQuestionContext.defaultSourceReadoutRowId,
    defaultSourceWalkthroughSectionId:
      questionBoard.summary.defaultQuestionContext
        .defaultSourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      questionBoard.summary.defaultQuestionContext.defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      questionBoard.summary.defaultQuestionContext.defaultRelayStepId,
    defaultAnchorTargetId:
      questionBoard.summary.defaultQuestionContext.defaultAnchorTargetId,
    sourceReadinessQuestionBoardSummary: questionBoard.summary.summary,
    sourceReadinessRehearsalSummary:
      questionBoard.summary.defaultQuestionContext
        .sourceReadinessRehearsalSummary,
    sourceReadinessSummary:
      questionBoard.summary.defaultQuestionContext.sourceReadinessSummary,
    sourceReadoutSummary:
      questionBoard.summary.defaultQuestionContext.sourceReadoutSummary,
    sourceWalkthroughSummary:
      questionBoard.summary.defaultQuestionContext.sourceWalkthroughSummary,
    sourceCrosswalkSummary:
      questionBoard.summary.defaultQuestionContext.sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      questionBoard.summary.defaultQuestionContext.sourceRelayTrailSummary,
  });
  assert.deepEqual(
    responseMatrix.responseRows.map((row) => [
      row.responseOrder,
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      row.sourceReadinessRehearsalPromptRowId,
      row.sourceReadinessRehearsalPromptRowIds,
      row.sourceReadinessRowId,
      row.sourceReadinessRowIds,
      row.sourceReadoutRowId,
      row.sourceReadoutRowIds,
      row.sourceWalkthroughSectionId,
      row.sourceWalkthroughSectionIds,
      row.sourceCrosswalkRowId,
      row.sourceCrosswalkRowIds,
      row.sourceRelayStepId,
      row.sourceRelayStepIds,
      row.sourceInspectionReferenceIds,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.matchedStaticReviewCheckIds,
      row.matchedStaticReviewerPromptCheckRowIds,
      row.matchedStaticFollowUpPromptRowIds,
      row.staticReviewCueIds,
      row.reviewerPromptText,
      row.followUpQuestionText,
      row.staticNonGoalContexts.length,
    ]),
    questionBoard.questionRows.map((questionRow) => [
      questionRow.questionOrder,
      questionRow.sourceReadinessQuestionRowId,
      [questionRow.sourceReadinessQuestionRowId],
      questionRow.sourceReadinessRehearsalPromptRowId,
      questionRow.sourceReadinessRehearsalPromptRowIds,
      questionRow.sourceReadinessRowId,
      questionRow.sourceReadinessRowIds,
      questionRow.sourceReadoutRowId,
      questionRow.sourceReadoutRowIds,
      questionRow.sourceWalkthroughSectionId,
      questionRow.sourceWalkthroughSectionIds,
      questionRow.sourceCrosswalkRowId,
      questionRow.sourceCrosswalkRowIds,
      questionRow.sourceRelayStepId,
      questionRow.sourceRelayStepIds,
      questionRow.sourceInspectionReferenceIds,
      questionRow.localAnchorHrefs,
      questionRow.anchorTargetIds,
      questionRow.evidenceCallbackIds,
      questionRow.gapDiscussionPointIds,
      questionRow.deferredScopeReminderIds,
      questionRow.matchedStaticReviewCheckIds,
      questionRow.matchedStaticReviewerPromptCheckRowIds,
      questionBoard.staticFollowUpPrompts
        .filter((prompt) =>
          questionRow.matchedStaticReviewerPromptCheckRowIds.includes(
            prompt.sourceStaticReviewerPromptCheckRowId,
          ),
        )
        .map((prompt) => prompt.sourceReadinessStaticFollowUpPromptRowId),
      questionRow.staticReviewCueIds,
      questionRow.reviewerPrompt,
      questionRow.followUpQuestion,
      questionRow.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    responseMatrix.responseRows.every(
      (row) =>
        row.responseNoteCue.includes(row.sourceReadinessQuestionRowId) &&
        row.localOnly &&
        row.sourceBacked &&
        row.inPageOnly &&
        row.explanatoryOnly &&
        row.staticOnly &&
        row.informationalOnly &&
        row.nonActionable &&
        row.nonPersistent &&
        row.nonExecutable &&
        row.nonRouting &&
        row.nonCertifying &&
        row.nonRanking &&
        row.notATask &&
        row.notATicket &&
        row.notAChecklist &&
        row.notOwnerAssigned &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        row.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        row.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedSourceInspectionState &&
        row.staticNonGoalFlags.noSavedAnchorState &&
        row.staticNonGoalFlags.noSavedRelayProgress &&
        row.staticNonGoalFlags.noPersistence &&
        row.staticNonGoalFlags.noRouteChanges &&
        row.staticNonGoalFlags.noCommandExecution &&
        row.staticNonGoalFlags.noExports &&
        row.staticNonGoalFlags.noSignoff &&
        row.staticNonGoalFlags.noAuditRetention &&
        row.staticNonGoalFlags.noOwnerAssignment &&
        row.staticNonGoalFlags.noScoring &&
        row.staticNonGoalFlags.noCertification &&
        row.staticNonGoalFlags.noMeetingWorkflow &&
        row.staticNonGoalFlags.noHandoffPackageGeneration &&
        row.staticNonGoalFlags.noTaskLaunchers &&
        row.staticNonGoalFlags.noRunnableChecklists,
    ),
  );

  for (const row of responseMatrix.responseRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-response-matrix"',
    ),
    "Mission console should expose a local Stage 56 response matrix anchor",
  );
});

test("buildReviewObservationHandoffSourceReadinessResponseMatrix preserves Stage 55 static follow-up prompt order for evidence notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const questionBoard =
    view.reviewObservationHandoffSourceReadinessQuestionBoard;
  const responseMatrix =
    buildReviewObservationHandoffSourceReadinessResponseMatrix(questionBoard);

  assert.ok(questionBoard);
  assert.ok(responseMatrix);
  assert.deepEqual(
    responseMatrix.staticEvidenceNotes.map((note) => [
      note.evidenceNoteOrder,
      note.sourceReadinessStaticFollowUpPromptRowId,
      note.sourceReadinessStaticFollowUpPromptRowIds,
      note.sourceStaticReviewerPromptCheckRowId,
      note.sourceStaticReviewerPromptCheckRowIds,
      note.sourceStaticReviewCheckRowId,
      note.sourceStaticReviewCheckRowIds,
      note.sourceStaticReviewCueRowIds,
      note.matchedQuestionRowIds,
      note.matchedRehearsalPromptRowIds,
      note.matchedSourceReadinessRowIds,
      note.matchedSourceReadoutRowIds,
      note.matchedSourceWalkthroughSectionIds,
      note.matchedSourceCrosswalkRowIds,
      note.sourceRelayStepIds,
      note.sourceLocalAnchorHrefs,
      note.sourceAnchorTargetIds,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
      note.reviewerPromptText,
      note.followUpPromptText,
    ]),
    questionBoard.staticFollowUpPrompts.map((prompt) => [
      prompt.followUpOrder,
      prompt.sourceReadinessStaticFollowUpPromptRowId,
      [prompt.sourceReadinessStaticFollowUpPromptRowId],
      prompt.sourceStaticReviewerPromptCheckRowId,
      prompt.sourceStaticReviewerPromptCheckRowIds,
      prompt.sourceStaticReviewCheckRowId,
      prompt.sourceStaticReviewCheckRowIds,
      prompt.sourceStaticReviewCueRowIds,
      questionBoard.questionRows
        .filter((row) =>
          row.matchedStaticReviewerPromptCheckRowIds.includes(
            prompt.sourceStaticReviewerPromptCheckRowId,
          ),
        )
        .map((row) => row.sourceReadinessQuestionRowId),
      prompt.matchedRehearsalPromptRowIds,
      prompt.matchedSourceReadinessRowIds,
      prompt.matchedSourceReadoutRowIds,
      prompt.matchedSourceWalkthroughSectionIds,
      prompt.matchedSourceCrosswalkRowIds,
      prompt.sourceRelayStepIds,
      prompt.sourceLocalAnchorHrefs,
      prompt.sourceAnchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
      prompt.reviewerPrompt,
      prompt.followUpPrompt,
    ]),
  );
  assert.equal(
    responseMatrix.summary.counts.responseRowCount,
    questionBoard.questionRows.length,
  );
  assert.equal(
    responseMatrix.summary.counts.staticEvidenceNoteCount,
    questionBoard.staticFollowUpPrompts.length,
  );
  assert.ok(
    responseMatrix.staticEvidenceNotes.every(
      (note) =>
        note.responseNoteCue.includes(
          note.sourceReadinessStaticFollowUpPromptRowId,
        ) &&
        note.localOnly &&
        note.sourceBacked &&
        note.staticOnly &&
        note.nonActionable &&
        note.nonPersistent &&
        note.nonExecutable &&
        note.nonRouting &&
        note.nonCertifying &&
        note.nonRanking &&
        note.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        note.staticNonGoalFlags.noSavedReviewerAnswers &&
        note.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress,
    ),
  );
});

test("buildMissionConsoleView wires the Stage 56 response matrix through fixture and local-live modes", () => {
  const liveStream = {
    ...buildFixtureStreamConnection(stage07ConsoleFixture),
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };
  const fixtureView = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const liveView = buildMissionConsoleView(
    stage07ConsoleFixture,
    "thermal",
    liveStream,
  );

  assert.ok(fixtureView.reviewObservationHandoffSourceReadinessResponseMatrix);
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessResponseMatrix
      ?.sourceReviewObservationHandoffSourceReadinessQuestionBoard,
    fixtureView.reviewObservationHandoffSourceReadinessQuestionBoard,
  );
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessResponseMatrix
      ?.localStatus,
    "fixture",
  );
  assert.ok(liveView.reviewObservationHandoffSourceReadinessResponseMatrix);
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessResponseMatrix
      ?.sourceReviewObservationHandoffSourceReadinessQuestionBoard,
    liveView.reviewObservationHandoffSourceReadinessQuestionBoard,
  );
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessResponseMatrix?.localStatus,
    "local-live",
  );
});
