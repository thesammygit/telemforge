import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildFixtureStreamConnection,
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessQuestionBoard } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessQuestionBoard.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessQuestionBoard derives ordered question rows from Stage 54 rehearsal prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessRehearsal =
    view.reviewObservationHandoffSourceReadinessRehearsal;
  const questionBoard =
    buildReviewObservationHandoffSourceReadinessQuestionBoard(
      readinessRehearsal,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(readinessRehearsal);
  assert.ok(questionBoard);
  assert.equal(
    questionBoard.schema,
    "telemforge.review_observation_handoff_source_readiness_question_board.v1",
  );
  assert.equal(questionBoard.version, 1);
  assert.equal(
    questionBoard.contractLabel,
    "local deterministic observation handoff source readiness question board and static follow-up prompts",
  );
  assert.equal(questionBoard.localStatus, "fixture");
  assert.strictEqual(
    questionBoard.sourceReviewObservationHandoffSourceReadinessRehearsal,
    readinessRehearsal,
  );
  assert.deepEqual(questionBoard.summary.defaultQuestionContext, {
    defaultQuestionRowId:
      questionBoard.defaultQuestionRow.sourceReadinessQuestionRowId,
    defaultRehearsalPromptRowId:
      readinessRehearsal.defaultRehearsalPromptRow
        .sourceReadinessRehearsalPromptRowId,
    defaultSourceReadinessRowId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultSourceReadinessRowId,
    defaultSourceReadoutRowId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultSourceReadoutRowId,
    defaultSourceWalkthroughSectionId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultSourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultRelayStepId,
    defaultAnchorTargetId:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .defaultAnchorTargetId,
    sourceReadinessRehearsalSummary: readinessRehearsal.summary.summary,
    sourceReadinessSummary:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .sourceReadinessSummary,
    sourceReadoutSummary:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .sourceReadoutSummary,
    sourceWalkthroughSummary:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .sourceWalkthroughSummary,
    sourceCrosswalkSummary:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      readinessRehearsal.summary.defaultSourceReadinessContext
        .sourceRelayTrailSummary,
  });
  assert.deepEqual(
    questionBoard.questionRows.map((row) => [
      row.questionOrder,
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
      row.staticReviewCueIds,
      row.reviewerPrompt,
      row.staticNonGoalContexts.length,
    ]),
    readinessRehearsal.rehearsalPromptRows.map((promptRow) => [
      promptRow.promptOrder,
      promptRow.sourceReadinessRehearsalPromptRowId,
      [promptRow.sourceReadinessRehearsalPromptRowId],
      promptRow.sourceReadinessRowId,
      promptRow.sourceReadinessRowIds,
      promptRow.sourceReadoutRowId,
      promptRow.sourceReadoutRowIds,
      promptRow.sourceWalkthroughSectionId,
      promptRow.sourceWalkthroughSectionIds,
      promptRow.sourceCrosswalkRowId,
      promptRow.sourceCrosswalkRowIds,
      promptRow.sourceRelayStepId,
      promptRow.sourceRelayStepIds,
      promptRow.sourceInspectionReferenceIds,
      promptRow.localAnchorHrefs,
      promptRow.anchorTargetIds,
      promptRow.evidenceCallbackIds,
      promptRow.gapDiscussionPointIds,
      promptRow.deferredScopeReminderIds,
      promptRow.matchedStaticReviewCheckIds,
      readinessRehearsal.staticReviewerPromptChecks
        .filter((check) =>
          promptRow.matchedStaticReviewCheckIds.includes(
            check.sourceStaticReviewCheckRowId,
          ),
        )
        .map((check) => check.staticReviewerPromptCheckRowId),
      promptRow.staticReviewCueIds,
      promptRow.reviewerPrompt,
      promptRow.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    questionBoard.questionRows.every(
      (row) =>
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

  for (const row of questionBoard.questionRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-question-board"',
    ),
    "Mission console should expose a local Stage 55 source readiness question board anchor",
  );
});

test("buildReviewObservationHandoffSourceReadinessQuestionBoard preserves Stage 54 static reviewer prompt order for follow-ups", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const readinessRehearsal =
    view.reviewObservationHandoffSourceReadinessRehearsal;
  const questionBoard =
    buildReviewObservationHandoffSourceReadinessQuestionBoard(
      readinessRehearsal,
    );

  assert.ok(readinessRehearsal);
  assert.ok(questionBoard);
  assert.deepEqual(
    questionBoard.staticFollowUpPrompts.map((prompt) => [
      prompt.followUpOrder,
      prompt.sourceStaticReviewerPromptCheckRowId,
      prompt.sourceStaticReviewerPromptCheckRowIds,
      prompt.sourceStaticReviewCheckRowId,
      prompt.sourceStaticReviewCheckRowIds,
      prompt.sourceStaticReviewCueRowIds,
      prompt.matchedRehearsalPromptRowIds,
      prompt.matchedSourceReadinessRowIds,
      prompt.matchedSourceReadoutRowIds,
      prompt.matchedSourceWalkthroughSectionIds,
      prompt.matchedSourceCrosswalkRowIds,
      prompt.sourceLocalAnchorHrefs,
      prompt.sourceAnchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
      prompt.reviewerPrompt,
    ]),
    readinessRehearsal.staticReviewerPromptChecks.map((check) => [
      check.checkOrder,
      check.staticReviewerPromptCheckRowId,
      [check.staticReviewerPromptCheckRowId],
      check.sourceStaticReviewCheckRowId,
      check.sourceStaticReviewCheckRowIds,
      check.sourceStaticReviewCueRowIds,
      readinessRehearsal.rehearsalPromptRows
        .filter((row) =>
          check.matchedSourceReadinessRowIds.includes(
            row.sourceReadinessRowId,
          ),
        )
        .map((row) => row.sourceReadinessRehearsalPromptRowId),
      check.matchedSourceReadinessRowIds,
      check.matchedSourceReadoutRowIds,
      check.matchedSourceWalkthroughSectionIds,
      check.matchedSourceCrosswalkRowIds,
      check.sourceLocalAnchorHrefs,
      check.sourceAnchorTargetIds,
      check.evidenceCallbackIds,
      check.gapDiscussionPointIds,
      check.deferredScopeReminderIds,
      check.reviewerPrompt,
    ]),
  );
  assert.equal(
    questionBoard.summary.counts.questionRowCount,
    readinessRehearsal.rehearsalPromptRows.length,
  );
  assert.equal(
    questionBoard.summary.counts.staticFollowUpPromptCount,
    readinessRehearsal.staticReviewerPromptChecks.length,
  );
  assert.ok(
    questionBoard.staticFollowUpPrompts.every(
      (prompt) =>
        prompt.localOnly &&
        prompt.sourceBacked &&
        prompt.staticOnly &&
        prompt.nonActionable &&
        prompt.nonPersistent &&
        prompt.nonExecutable &&
        prompt.nonRouting &&
        prompt.nonCertifying &&
        prompt.nonRanking &&
        prompt.staticNonGoalFlags.noSavedReviewerAnswers &&
        prompt.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        prompt.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress,
    ),
  );
});

test("buildMissionConsoleView wires the Stage 55 question board through fixture and local-live modes", () => {
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

  assert.ok(fixtureView.reviewObservationHandoffSourceReadinessQuestionBoard);
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.sourceReviewObservationHandoffSourceReadinessRehearsal,
    fixtureView.reviewObservationHandoffSourceReadinessRehearsal,
  );
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.localStatus,
    "fixture",
  );
  assert.ok(liveView.reviewObservationHandoffSourceReadinessQuestionBoard);
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessQuestionBoard?.localStatus,
    "local-live",
  );
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessQuestionBoard
      ?.sourceReviewObservationHandoffSourceReadinessRehearsal,
    liveView.reviewObservationHandoffSourceReadinessRehearsal,
  );
});
