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

test("buildReviewObservationHandoffSourceReadiness derives ordered readiness rows from Stage 52 source readout rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReadout = view.reviewObservationHandoffSourceReadout;
  const sourceReadiness = view.reviewObservationHandoffSourceReadiness;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(sourceReadout);
  assert.ok(sourceReadiness);
  assert.equal(
    sourceReadiness.schema,
    "telemforge.review_observation_handoff_source_readiness.v1",
  );
  assert.equal(sourceReadiness.version, 1);
  assert.equal(
    sourceReadiness.contractLabel,
    "local deterministic observation handoff source readiness board and static review checks",
  );
  assert.equal(sourceReadiness.localStatus, "fixture");
  assert.strictEqual(
    sourceReadiness.sourceReviewObservationHandoffSourceReadout,
    sourceReadout,
  );
  assert.deepEqual(sourceReadiness.summary.defaultSourceReadoutContext, {
    defaultSourceReadoutRowId:
      sourceReadout.defaultSourceReadoutRow.sourceReadoutRowId,
    defaultSourceWalkthroughSectionId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultSourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      sourceReadout.summary.defaultSourceWalkthroughContext.defaultRelayStepId,
    defaultSynthesisRowId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultSynthesisRowId,
    defaultCalibrationCardId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultCalibrationCardId,
    defaultCueId:
      sourceReadout.summary.defaultSourceWalkthroughContext.defaultCueId,
    defaultDebriefPromptId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultDebriefPromptId,
    defaultAnchorTargetId:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .defaultAnchorTargetId,
    sourceReadoutSummary: sourceReadout.summary.summary,
    sourceWalkthroughSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceWalkthroughSummary,
    sourceCrosswalkSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceRelayTrailSummary,
    sourceSynthesisSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceSynthesisSummary,
    sourceCalibrationSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceCalibrationSummary,
    sourceDriftGuardSummary:
      sourceReadout.summary.defaultSourceWalkthroughContext
        .sourceDriftGuardSummary,
  });
  assert.deepEqual(
    sourceReadiness.sourceReadinessRows.map((row) => [
      row.rowNumber,
      row.sourceReadoutRowId,
      row.sourceReadoutRowIds,
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
      row.matchedStaticReviewCueIds,
      row.staticNonGoalContexts.length,
    ]),
    sourceReadout.sourceReadoutRows.map((readoutRow) => [
      readoutRow.rowNumber,
      readoutRow.sourceReadoutRowId,
      [readoutRow.sourceReadoutRowId],
      readoutRow.sourceWalkthroughSectionId,
      readoutRow.sourceWalkthroughSectionIds,
      readoutRow.sourceCrosswalkRowId,
      readoutRow.sourceCrosswalkRowIds,
      readoutRow.sourceRelayStepId,
      readoutRow.sourceRelayStepIds,
      readoutRow.sourceInspectionReferenceIds,
      readoutRow.sourceKinds,
      readoutRow.sourceIds,
      readoutRow.sourceLabels,
      readoutRow.localAnchorHrefs,
      readoutRow.anchorTargetIds,
      readoutRow.sourceSynthesisRowIds,
      readoutRow.sourceCalibrationCardIds,
      readoutRow.sourceAlignmentNoteIds,
      readoutRow.sourceCueIds,
      readoutRow.sourceDebriefPromptIds,
      readoutRow.sourceFollowUpMapEntryIds,
      readoutRow.sourcePathStepIds,
      readoutRow.sourceAgendaSectionIds,
      readoutRow.sourcePromptGroupIds,
      readoutRow.sourceCoverageRowIds,
      readoutRow.sourceHandoffCardIds,
      readoutRow.evidenceCallbackIds,
      readoutRow.gapDiscussionPointIds,
      readoutRow.deferredScopeReminderIds,
      sourceReadout.staticReviewCues
        .filter((cue) =>
          cue.matchedSourceWalkthroughSectionIds.includes(
            readoutRow.sourceWalkthroughSectionId,
          ),
        )
        .map((cue) => cue.staticReviewCueRowId),
      readoutRow.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    sourceReadiness.summary.counts.sourceReadinessRowCount,
    sourceReadout.sourceReadoutRows.length,
  );
  assert.equal(
    sourceReadiness.summary.counts.staticReviewCheckCount,
    sourceReadout.staticReviewCues.length,
  );
  assert.ok(
    sourceReadiness.sourceReadinessRows.every(
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
        row.staticNonGoalFlags.noSavedSourceReadinessProgress &&
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

  for (const row of sourceReadiness.sourceReadinessRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness"',
    ),
    "Mission console should expose a local Stage 53 source readiness anchor",
  );
});

test("buildReviewObservationHandoffSourceReadiness preserves Stage 52 static review cue order for static checks", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReadout = view.reviewObservationHandoffSourceReadout;
  const sourceReadiness = view.reviewObservationHandoffSourceReadiness;

  assert.ok(sourceReadout);
  assert.ok(sourceReadiness);
  assert.deepEqual(
    sourceReadiness.staticReviewChecks.map((check) => [
      check.checkOrder,
      check.sourceStaticReviewCueRowId,
      check.sourceStaticReviewCueRowIds,
      check.matchedSourceReadoutRowIds,
      check.matchedSourceWalkthroughSectionIds,
      check.matchedSourceCrosswalkRowIds,
      check.sourceRelayStepIds,
      check.sourceLocalAnchorHrefs,
      check.sourceAnchorTargetIds,
      check.evidenceCallbackIds,
      check.gapDiscussionPointIds,
      check.deferredScopeReminderIds,
    ]),
    sourceReadout.staticReviewCues.map((cue) => [
      cue.cueOrder,
      cue.staticReviewCueRowId,
      [cue.staticReviewCueRowId],
      sourceReadout.sourceReadoutRows
        .filter((row) =>
          cue.matchedSourceWalkthroughSectionIds.includes(
            row.sourceWalkthroughSectionId,
          ),
        )
        .map((row) => row.sourceReadoutRowId),
      cue.matchedSourceWalkthroughSectionIds,
      cue.matchedSourceCrosswalkRowIds,
      cue.sourceRelayStepIds,
      cue.sourceLocalAnchorHrefs,
      cue.sourceAnchorTargetIds,
      cue.evidenceCallbackIds,
      cue.gapDiscussionPointIds,
      cue.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    sourceReadiness.staticReviewChecks.every(
      (check) =>
        check.localOnly &&
        check.sourceBacked &&
        check.inPageOnly &&
        check.explanatoryOnly &&
        check.staticOnly &&
        check.informationalOnly &&
        check.nonActionable &&
        check.nonPersistent &&
        check.nonExecutable &&
        check.nonRouting &&
        check.nonCertifying &&
        check.nonRanking &&
        check.notATask &&
        check.notATicket &&
        check.notAChecklist &&
        check.notOwnerAssigned &&
        check.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        check.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        check.staticNonGoalFlags.noCommandExecution &&
        check.staticNonGoalFlags.noExports &&
        check.staticNonGoalFlags.noOwnerAssignment &&
        check.staticNonGoalFlags.noScoring &&
        check.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildReviewObservationHandoffSourceReadiness stays deterministic in local-live mode", () => {
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
    liveView.reviewObservationHandoffSourceReadiness?.localStatus,
    "local-live",
  );
  assert.equal(
    liveView.reviewObservationHandoffSourceReadiness
      ?.sourceReviewObservationHandoffSourceReadout,
    liveView.reviewObservationHandoffSourceReadout,
  );
  assert.deepEqual(
    liveView.reviewObservationHandoffSourceReadiness?.sourceReadinessRows.map(
      readinessRowProjection,
    ),
    fixtureView.reviewObservationHandoffSourceReadiness?.sourceReadinessRows.map(
      readinessRowProjection,
    ),
  );
  assert.deepEqual(
    liveView.reviewObservationHandoffSourceReadiness?.staticReviewChecks.map(
      staticReviewCheckProjection,
    ),
    fixtureView.reviewObservationHandoffSourceReadiness?.staticReviewChecks.map(
      staticReviewCheckProjection,
    ),
  );
});

function readinessRowProjection(
  row: NonNullable<
    ReturnType<typeof buildMissionConsoleView>["reviewObservationHandoffSourceReadiness"]
  >["sourceReadinessRows"][number],
) {
  return {
    rowNumber: row.rowNumber,
    sourceReadoutRowId: row.sourceReadoutRowId,
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
    matchedStaticReviewCueIds: row.matchedStaticReviewCueIds,
  };
}

function staticReviewCheckProjection(
  check: NonNullable<
    ReturnType<typeof buildMissionConsoleView>["reviewObservationHandoffSourceReadiness"]
  >["staticReviewChecks"][number],
) {
  return {
    checkOrder: check.checkOrder,
    sourceStaticReviewCueRowId: check.sourceStaticReviewCueRowId,
    matchedSourceReadoutRowIds: check.matchedSourceReadoutRowIds,
    matchedSourceWalkthroughSectionIds:
      check.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: check.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: check.sourceRelayStepIds,
    sourceLocalAnchorHrefs: check.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: check.sourceAnchorTargetIds,
  };
}
