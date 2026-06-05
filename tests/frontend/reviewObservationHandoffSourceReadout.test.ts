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

test("buildReviewObservationHandoffSourceReadout derives ordered readout rows from Stage 51 source walkthrough sections", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceWalkthrough = view.reviewObservationHandoffSourceWalkthrough;
  const sourceReadout = view.reviewObservationHandoffSourceReadout;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(sourceWalkthrough);
  assert.ok(sourceReadout);
  assert.equal(
    sourceReadout.schema,
    "telemforge.review_observation_handoff_source_readout.v1",
  );
  assert.equal(sourceReadout.version, 1);
  assert.equal(
    sourceReadout.contractLabel,
    "local deterministic observation handoff source readout and static review cues",
  );
  assert.equal(sourceReadout.localStatus, "fixture");
  assert.strictEqual(
    sourceReadout.sourceReviewObservationHandoffSourceWalkthrough,
    sourceWalkthrough,
  );
  assert.deepEqual(sourceReadout.summary.defaultSourceWalkthroughContext, {
    defaultSourceWalkthroughSectionId:
      sourceWalkthrough.defaultWalkthroughSection.sourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultRelayStepId,
    defaultSynthesisRowId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultSynthesisRowId,
    defaultCalibrationCardId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultCalibrationCardId,
    defaultCueId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext.defaultCueId,
    defaultDebriefPromptId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultDebriefPromptId,
    defaultAnchorTargetId:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .defaultAnchorTargetId,
    sourceWalkthroughSummary: sourceWalkthrough.summary.summary,
    sourceCrosswalkSummary:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .sourceRelayTrailSummary,
    sourceSynthesisSummary:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .sourceSynthesisSummary,
    sourceCalibrationSummary:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .sourceCalibrationSummary,
    sourceDriftGuardSummary:
      sourceWalkthrough.summary.defaultSourceCrosswalkContext
        .sourceDriftGuardSummary,
  });
  assert.deepEqual(
    sourceReadout.sourceReadoutRows.map((row) => [
      row.rowNumber,
      row.sourceWalkthroughSectionId,
      row.sourceWalkthroughSectionIds,
      row.sourceCrosswalkRowId,
      row.sourceCrosswalkRowIds,
      row.sourceRelayStepId,
      row.sourceRelayStepIds,
      row.sourceInspectionReferenceIds,
      row.sourceKinds,
      row.sourceIds,
      row.sourceLabels,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.sourceSynthesisRowIds,
      row.sourceCalibrationCardIds,
      row.sourceAlignmentNoteIds,
      row.sourceCueIds,
      row.sourceDebriefPromptIds,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepIds,
      row.sourceAgendaSectionIds,
      row.sourcePromptGroupIds,
      row.sourceCoverageRowIds,
      row.sourceHandoffCardIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.staticNonGoalContexts.length,
    ]),
    sourceWalkthrough.walkthroughSections.map((section) => [
      section.sectionNumber,
      section.sourceWalkthroughSectionId,
      [section.sourceWalkthroughSectionId],
      section.sourceCrosswalkRowId,
      section.sourceCrosswalkRowIds,
      section.sourceRelayStepId,
      section.sourceRelayStepIds,
      section.sourceInspectionReferenceIds,
      section.sourceKinds,
      section.sourceIds,
      section.sourceLabels,
      section.localAnchorHrefs,
      section.anchorTargetIds,
      section.sourceSynthesisRowIds,
      section.sourceCalibrationCardIds,
      section.sourceAlignmentNoteIds,
      section.sourceCueIds,
      section.sourceDebriefPromptIds,
      section.sourceFollowUpMapEntryIds,
      section.sourcePathStepIds,
      section.sourceAgendaSectionIds,
      section.sourcePromptGroupIds,
      section.sourceCoverageRowIds,
      section.sourceHandoffCardIds,
      section.evidenceCallbackIds,
      section.gapDiscussionPointIds,
      section.deferredScopeReminderIds,
      section.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    sourceReadout.summary.counts.sourceReadoutRowCount,
    sourceWalkthrough.walkthroughSections.length,
  );
  assert.equal(
    sourceReadout.summary.counts.staticReviewCueCount,
    sourceWalkthrough.staticReviewPrompts.length,
  );
  assert.equal(
    sourceReadout.summary.counts.sourceInspectionReferenceCount,
    sourceWalkthrough.walkthroughSections.reduce(
      (count, section) => count + section.sourceInspectionReferenceIds.length,
      0,
    ),
  );
  assert.ok(
    sourceReadout.sourceReadoutRows.every(
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
        row.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        row.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedReviewerNotes &&
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

  for (const row of sourceReadout.sourceReadoutRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readout"',
    ),
    "Mission console should expose a local Stage 52 source readout anchor",
  );
});

test("buildReviewObservationHandoffSourceReadout preserves Stage 51 static review prompt order for review cues", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceWalkthrough = view.reviewObservationHandoffSourceWalkthrough;
  const sourceReadout = view.reviewObservationHandoffSourceReadout;

  assert.ok(sourceWalkthrough);
  assert.ok(sourceReadout);
  assert.deepEqual(
    sourceReadout.staticReviewCues.map((cue) => [
      cue.cueOrder,
      cue.sourceStaticReviewPromptId,
      cue.sourceStaticReviewPromptIds,
      cue.sourceStaticAnchorNoteId,
      cue.sourceStaticInspectionNoteId,
      cue.sourceRelayNoteId,
      cue.matchedSourceWalkthroughSectionIds,
      cue.matchedSourceCrosswalkRowIds,
      cue.sourceRelayStepIds,
      cue.sourceLocalAnchorHrefs,
      cue.sourceAnchorTargetIds,
      cue.evidenceCallbackIds,
      cue.gapDiscussionPointIds,
      cue.deferredScopeReminderIds,
    ]),
    sourceWalkthrough.staticReviewPrompts.map((prompt) => [
      prompt.promptOrder,
      prompt.staticReviewPromptRowId,
      [prompt.staticReviewPromptRowId],
      prompt.sourceStaticAnchorNoteId,
      prompt.sourceStaticInspectionNoteId,
      prompt.sourceRelayNoteId,
      prompt.matchedSourceWalkthroughSectionIds,
      prompt.matchedSourceCrosswalkRowIds,
      prompt.sourceRelayStepIds,
      prompt.sourceLocalAnchorHrefs,
      prompt.sourceAnchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    sourceReadout.staticReviewCues.every(
      (cue) =>
        cue.localOnly &&
        cue.sourceBacked &&
        cue.inPageOnly &&
        cue.explanatoryOnly &&
        cue.staticOnly &&
        cue.informationalOnly &&
        cue.nonActionable &&
        cue.nonPersistent &&
        cue.nonExecutable &&
        cue.nonRouting &&
        cue.nonCertifying &&
        cue.nonRanking &&
        cue.notATask &&
        cue.notATicket &&
        cue.notAChecklist &&
        cue.notOwnerAssigned &&
        cue.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        cue.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        cue.staticNonGoalFlags.noCommandExecution &&
        cue.staticNonGoalFlags.noExports &&
        cue.staticNonGoalFlags.noOwnerAssignment &&
        cue.staticNonGoalFlags.noScoring &&
        cue.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildReviewObservationHandoffSourceReadout stays deterministic in local-live mode", () => {
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

  assert.equal(
    liveView.reviewObservationHandoffSourceReadout?.localStatus,
    "local-live",
  );
  assert.equal(
    liveView.reviewObservationHandoffSourceReadout
      ?.sourceReviewObservationHandoffSourceWalkthrough,
    liveView.reviewObservationHandoffSourceWalkthrough,
  );
  assert.deepEqual(
    liveView.reviewObservationHandoffSourceReadout?.sourceReadoutRows.map(
      readoutRowProjection,
    ),
    fixtureView.reviewObservationHandoffSourceReadout?.sourceReadoutRows.map(
      readoutRowProjection,
    ),
  );
  assert.deepEqual(
    liveView.reviewObservationHandoffSourceReadout?.staticReviewCues.map(
      staticReviewCueProjection,
    ),
    fixtureView.reviewObservationHandoffSourceReadout?.staticReviewCues.map(
      staticReviewCueProjection,
    ),
  );
});

function readoutRowProjection(
  row: NonNullable<
    ReturnType<typeof buildMissionConsoleView>["reviewObservationHandoffSourceReadout"]
  >["sourceReadoutRows"][number],
) {
  return {
    rowNumber: row.rowNumber,
    sourceWalkthroughSectionId: row.sourceWalkthroughSectionId,
    sourceCrosswalkRowId: row.sourceCrosswalkRowId,
    sourceRelayStepId: row.sourceRelayStepId,
    sourceInspectionReferenceIds: row.sourceInspectionReferenceIds,
    sourceIds: row.sourceIds,
    localAnchorHrefs: row.localAnchorHrefs,
    anchorTargetIds: row.anchorTargetIds,
    evidenceCallbackIds: row.evidenceCallbackIds,
    gapDiscussionPointIds: row.gapDiscussionPointIds,
    deferredScopeReminderIds: row.deferredScopeReminderIds,
  };
}

function staticReviewCueProjection(
  cue: NonNullable<
    ReturnType<typeof buildMissionConsoleView>["reviewObservationHandoffSourceReadout"]
  >["staticReviewCues"][number],
) {
  return {
    cueOrder: cue.cueOrder,
    sourceStaticReviewPromptId: cue.sourceStaticReviewPromptId,
    sourceStaticAnchorNoteId: cue.sourceStaticAnchorNoteId,
    sourceStaticInspectionNoteId: cue.sourceStaticInspectionNoteId,
    sourceRelayNoteId: cue.sourceRelayNoteId,
    matchedSourceWalkthroughSectionIds:
      cue.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: cue.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: cue.sourceRelayStepIds,
    sourceLocalAnchorHrefs: cue.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: cue.sourceAnchorTargetIds,
  };
}
