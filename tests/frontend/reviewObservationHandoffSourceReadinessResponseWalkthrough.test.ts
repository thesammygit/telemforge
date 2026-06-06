import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildFixtureStreamConnection,
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseWalkthrough } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseWalkthrough.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseWalkthrough derives ordered walkthrough steps from Stage 56 response rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseMatrix =
    view.reviewObservationHandoffSourceReadinessResponseMatrix;
  const responseWalkthrough =
    buildReviewObservationHandoffSourceReadinessResponseWalkthrough(
      responseMatrix,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(responseMatrix);
  assert.ok(responseWalkthrough);
  assert.equal(
    responseWalkthrough.schema,
    "telemforge.review_observation_handoff_source_readiness_response_walkthrough.v1",
  );
  assert.equal(responseWalkthrough.version, 1);
  assert.equal(
    responseWalkthrough.contractLabel,
    "local deterministic observation handoff source readiness response walkthrough and static reviewer cues",
  );
  assert.equal(responseWalkthrough.localStatus, "fixture");
  assert.strictEqual(
    responseWalkthrough.sourceReviewObservationHandoffSourceReadinessResponseMatrix,
    responseMatrix,
  );
  assert.deepEqual(
    responseWalkthrough.summary.defaultResponseWalkthroughContext,
    {
      defaultWalkthroughStepId:
        responseWalkthrough.defaultWalkthroughStep
          .sourceReadinessResponseWalkthroughStepId,
      defaultResponseRowId:
        responseMatrix.summary.defaultResponseContext.defaultResponseRowId,
      defaultQuestionRowId:
        responseMatrix.summary.defaultResponseContext.defaultQuestionRowId,
      defaultRehearsalPromptRowId:
        responseMatrix.summary.defaultResponseContext
          .defaultRehearsalPromptRowId,
      defaultSourceReadinessRowId:
        responseMatrix.summary.defaultResponseContext
          .defaultSourceReadinessRowId,
      defaultSourceReadoutRowId:
        responseMatrix.summary.defaultResponseContext.defaultSourceReadoutRowId,
      defaultSourceWalkthroughSectionId:
        responseMatrix.summary.defaultResponseContext
          .defaultSourceWalkthroughSectionId,
      defaultSourceCrosswalkRowId:
        responseMatrix.summary.defaultResponseContext
          .defaultSourceCrosswalkRowId,
      defaultRelayStepId:
        responseMatrix.summary.defaultResponseContext.defaultRelayStepId,
      defaultAnchorTargetId:
        responseMatrix.summary.defaultResponseContext.defaultAnchorTargetId,
      sourceReadinessResponseMatrixSummary: responseMatrix.summary.summary,
      sourceReadinessQuestionBoardSummary:
        responseMatrix.summary.defaultResponseContext
          .sourceReadinessQuestionBoardSummary,
      sourceReadinessRehearsalSummary:
        responseMatrix.summary.defaultResponseContext
          .sourceReadinessRehearsalSummary,
      sourceReadinessSummary:
        responseMatrix.summary.defaultResponseContext.sourceReadinessSummary,
      sourceReadoutSummary:
        responseMatrix.summary.defaultResponseContext.sourceReadoutSummary,
      sourceWalkthroughSummary:
        responseMatrix.summary.defaultResponseContext.sourceWalkthroughSummary,
      sourceCrosswalkSummary:
        responseMatrix.summary.defaultResponseContext.sourceCrosswalkSummary,
      sourceRelayTrailSummary:
        responseMatrix.summary.defaultResponseContext.sourceRelayTrailSummary,
    },
  );
  assert.deepEqual(
    responseWalkthrough.walkthroughSteps.map((step) => [
      step.stepOrder,
      step.sourceReadinessResponseRowId,
      step.sourceReadinessResponseRowIds,
      step.sourceReadinessQuestionRowId,
      step.sourceReadinessQuestionRowIds,
      step.matchedStaticEvidenceNoteRowIds,
      step.matchedStaticFollowUpPromptRowIds,
      step.sourceReadinessRehearsalPromptRowId,
      step.sourceReadinessRehearsalPromptRowIds,
      step.sourceReadinessRowId,
      step.sourceReadinessRowIds,
      step.sourceReadoutRowId,
      step.sourceReadoutRowIds,
      step.sourceWalkthroughSectionId,
      step.sourceWalkthroughSectionIds,
      step.sourceCrosswalkRowId,
      step.sourceCrosswalkRowIds,
      step.sourceRelayStepId,
      step.sourceRelayStepIds,
      step.sourceInspectionReferenceIds,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.responseNoteCue,
      step.staticReviewCueIds,
      step.staticNonGoalContexts.length,
    ]),
    responseMatrix.responseRows.map((row) => [
      row.responseOrder,
      row.sourceReadinessResponseRowId,
      [row.sourceReadinessResponseRowId],
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      responseMatrix.staticEvidenceNotes
        .filter(
          (note) =>
            row.matchedStaticFollowUpPromptRowIds.includes(
              note.sourceReadinessStaticFollowUpPromptRowId,
            ) ||
            note.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ),
        )
        .map((note) => note.sourceReadinessStaticEvidenceNoteRowId),
      row.matchedStaticFollowUpPromptRowIds,
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
      row.responseNoteCue,
      row.staticReviewCueIds,
      row.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    responseWalkthrough.walkthroughSteps.every(
      (step) =>
        step.staticReviewerCueText.includes(
          step.sourceReadinessResponseRowId,
        ) &&
        step.staticReviewerCueText.includes(step.responseNoteCue) &&
        step.localOnly &&
        step.sourceBacked &&
        step.inPageOnly &&
        step.explanatoryOnly &&
        step.staticOnly &&
        step.informationalOnly &&
        step.nonActionable &&
        step.nonPersistent &&
        step.nonExecutable &&
        step.nonRouting &&
        step.nonCertifying &&
        step.nonRanking &&
        step.notATask &&
        step.notATicket &&
        step.notAChecklist &&
        step.notOwnerAssigned &&
        step.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress &&
        step.staticNonGoalFlags.noSavedWalkthroughProgress &&
        step.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        step.staticNonGoalFlags.noSavedReviewerAnswers &&
        step.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        step.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        step.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        step.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        step.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        step.staticNonGoalFlags.noSavedSourceInspectionState &&
        step.staticNonGoalFlags.noSavedAnchorState &&
        step.staticNonGoalFlags.noSavedRelayProgress &&
        step.staticNonGoalFlags.noPersistence &&
        step.staticNonGoalFlags.noRouteChanges &&
        step.staticNonGoalFlags.noCommandExecution &&
        step.staticNonGoalFlags.noExports &&
        step.staticNonGoalFlags.noSignoff &&
        step.staticNonGoalFlags.noAuditRetention &&
        step.staticNonGoalFlags.noOwnerAssignment &&
        step.staticNonGoalFlags.noScoring &&
        step.staticNonGoalFlags.noCertification &&
        step.staticNonGoalFlags.noMeetingWorkflow &&
        step.staticNonGoalFlags.noHandoffPackageGeneration &&
        step.staticNonGoalFlags.noTaskLaunchers &&
        step.staticNonGoalFlags.noRunnableChecklists,
    ),
  );

  for (const step of responseWalkthrough.walkthroughSteps) {
    for (const targetId of step.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-response-walkthrough"',
    ),
    "Mission console should expose a local Stage 57 response walkthrough anchor",
  );
});

test("buildReviewObservationHandoffSourceReadinessResponseWalkthrough preserves Stage 56 static evidence note order for reviewer cue cards", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseMatrix =
    view.reviewObservationHandoffSourceReadinessResponseMatrix;
  const responseWalkthrough =
    buildReviewObservationHandoffSourceReadinessResponseWalkthrough(
      responseMatrix,
    );

  assert.ok(responseMatrix);
  assert.ok(responseWalkthrough);
  assert.deepEqual(
    responseWalkthrough.staticReviewerCueCards.map((card) => [
      card.cueOrder,
      card.sourceReadinessStaticEvidenceNoteRowId,
      card.sourceReadinessStaticEvidenceNoteRowIds,
      card.sourceReadinessStaticFollowUpPromptRowId,
      card.sourceReadinessStaticFollowUpPromptRowIds,
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.matchedSourceFollowUpPromptRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.localAnchorHref,
      card.anchorTargetId,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseNoteCue,
    ]),
    responseMatrix.staticEvidenceNotes.map((note) => [
      note.evidenceNoteOrder,
      note.sourceReadinessStaticEvidenceNoteRowId,
      [note.sourceReadinessStaticEvidenceNoteRowId],
      note.sourceReadinessStaticFollowUpPromptRowId,
      note.sourceReadinessStaticFollowUpPromptRowIds,
      responseMatrix.responseRows
        .filter(
          (row) =>
            note.matchedQuestionRowIds.includes(
              row.sourceReadinessQuestionRowId,
            ) ||
            row.matchedStaticFollowUpPromptRowIds.includes(
              note.sourceReadinessStaticFollowUpPromptRowId,
            ),
        )
        .map((row) => row.sourceReadinessResponseRowId),
      note.matchedQuestionRowIds,
      note.sourceReadinessStaticFollowUpPromptRowIds,
      note.sourceLocalAnchorHrefs,
      note.sourceAnchorTargetIds,
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
      note.responseNoteCue,
    ]),
  );
  assert.equal(
    responseWalkthrough.summary.counts.walkthroughStepCount,
    responseMatrix.responseRows.length,
  );
  assert.equal(
    responseWalkthrough.summary.counts.staticReviewerCueCardCount,
    responseMatrix.staticEvidenceNotes.length,
  );
  assert.ok(
    responseWalkthrough.staticReviewerCueCards.every(
      (card) =>
        card.cueText.includes(card.sourceReadinessStaticEvidenceNoteRowId) &&
        card.localOnly &&
        card.sourceBacked &&
        card.staticOnly &&
        card.nonActionable &&
        card.nonPersistent &&
        card.nonExecutable &&
        card.nonRouting &&
        card.nonCertifying &&
        card.nonRanking &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress &&
        card.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        card.staticNonGoalFlags.noSavedReviewerAnswers,
    ),
  );
});

test("buildMissionConsoleView wires the Stage 57 response walkthrough through fixture and local-live modes", () => {
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

  assert.ok(
    fixtureView.reviewObservationHandoffSourceReadinessResponseWalkthrough,
  );
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.sourceReviewObservationHandoffSourceReadinessResponseMatrix,
    fixtureView.reviewObservationHandoffSourceReadinessResponseMatrix,
  );
  assert.equal(
    fixtureView.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.localStatus,
    "fixture",
  );
  assert.ok(liveView.reviewObservationHandoffSourceReadinessResponseWalkthrough);
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.sourceReviewObservationHandoffSourceReadinessResponseMatrix,
    liveView.reviewObservationHandoffSourceReadinessResponseMatrix,
  );
  assert.equal(
    liveView.reviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.localStatus,
    "local-live",
  );
});
