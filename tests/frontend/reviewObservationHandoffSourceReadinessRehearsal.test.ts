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

test("buildReviewObservationHandoffSourceReadinessRehearsal derives ordered rehearsal prompts from Stage 53 readiness rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReadiness = view.reviewObservationHandoffSourceReadiness;
  const readinessRehearsal =
    view.reviewObservationHandoffSourceReadinessRehearsal;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(sourceReadiness);
  assert.ok(readinessRehearsal);
  assert.equal(
    readinessRehearsal.schema,
    "telemforge.review_observation_handoff_source_readiness_rehearsal.v1",
  );
  assert.equal(readinessRehearsal.version, 1);
  assert.equal(
    readinessRehearsal.contractLabel,
    "local deterministic observation handoff source readiness rehearsal and static reviewer prompts",
  );
  assert.equal(readinessRehearsal.localStatus, "fixture");
  assert.strictEqual(
    readinessRehearsal.sourceReviewObservationHandoffSourceReadiness,
    sourceReadiness,
  );
  assert.deepEqual(readinessRehearsal.summary.defaultSourceReadinessContext, {
    defaultSourceReadinessRowId:
      sourceReadiness.defaultSourceReadinessRow.sourceReadinessRowId,
    defaultSourceReadoutRowId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultSourceReadoutRowId,
    defaultSourceWalkthroughSectionId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultSourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      sourceReadiness.summary.defaultSourceReadoutContext.defaultRelayStepId,
    defaultSynthesisRowId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultSynthesisRowId,
    defaultCalibrationCardId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultCalibrationCardId,
    defaultCueId:
      sourceReadiness.summary.defaultSourceReadoutContext.defaultCueId,
    defaultDebriefPromptId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultDebriefPromptId,
    defaultAnchorTargetId:
      sourceReadiness.summary.defaultSourceReadoutContext
        .defaultAnchorTargetId,
    sourceReadinessSummary: sourceReadiness.summary.summary,
    sourceReadoutSummary:
      sourceReadiness.summary.defaultSourceReadoutContext.sourceReadoutSummary,
    sourceWalkthroughSummary:
      sourceReadiness.summary.defaultSourceReadoutContext
        .sourceWalkthroughSummary,
    sourceCrosswalkSummary:
      sourceReadiness.summary.defaultSourceReadoutContext
        .sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      sourceReadiness.summary.defaultSourceReadoutContext
        .sourceRelayTrailSummary,
    sourceSynthesisSummary:
      sourceReadiness.summary.defaultSourceReadoutContext.sourceSynthesisSummary,
    sourceCalibrationSummary:
      sourceReadiness.summary.defaultSourceReadoutContext
        .sourceCalibrationSummary,
    sourceDriftGuardSummary:
      sourceReadiness.summary.defaultSourceReadoutContext
        .sourceDriftGuardSummary,
  });
  assert.deepEqual(
    readinessRehearsal.rehearsalPromptRows.map((row) => [
      row.promptOrder,
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
      row.staticReviewCueIds,
      row.staticNonGoalContexts.length,
    ]),
    sourceReadiness.sourceReadinessRows.map((readinessRow) => [
      readinessRow.rowNumber,
      readinessRow.sourceReadinessRowId,
      [readinessRow.sourceReadinessRowId],
      readinessRow.sourceReadoutRowId,
      readinessRow.sourceReadoutRowIds,
      readinessRow.sourceWalkthroughSectionId,
      readinessRow.sourceWalkthroughSectionIds,
      readinessRow.sourceCrosswalkRowId,
      readinessRow.sourceCrosswalkRowIds,
      readinessRow.sourceRelayStepId,
      readinessRow.sourceRelayStepIds,
      readinessRow.sourceInspectionReferenceIds,
      readinessRow.localAnchorHrefs,
      readinessRow.anchorTargetIds,
      readinessRow.evidenceCallbackIds,
      readinessRow.gapDiscussionPointIds,
      readinessRow.deferredScopeReminderIds,
      sourceReadiness.staticReviewChecks
        .filter((check) =>
          readinessRow.matchedStaticReviewCueIds.includes(
            check.sourceStaticReviewCueRowId,
          ),
        )
        .map((check) => check.staticReviewCheckRowId),
      readinessRow.matchedStaticReviewCueIds,
      readinessRow.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    readinessRehearsal.summary.counts.rehearsalPromptRowCount,
    sourceReadiness.sourceReadinessRows.length,
  );
  assert.equal(
    readinessRehearsal.summary.counts.staticReviewerPromptCheckCount,
    sourceReadiness.staticReviewChecks.length,
  );
  assert.ok(
    readinessRehearsal.rehearsalPromptRows.every(
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
        row.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
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

  for (const row of readinessRehearsal.rehearsalPromptRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-rehearsal"',
    ),
    "Mission console should expose a local Stage 54 source readiness rehearsal anchor",
  );
});

test("buildReviewObservationHandoffSourceReadinessRehearsal preserves Stage 53 static review check order for reviewer prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceReadiness = view.reviewObservationHandoffSourceReadiness;
  const readinessRehearsal =
    view.reviewObservationHandoffSourceReadinessRehearsal;

  assert.ok(sourceReadiness);
  assert.ok(readinessRehearsal);
  assert.deepEqual(
    readinessRehearsal.staticReviewerPromptChecks.map((check) => [
      check.checkOrder,
      check.sourceStaticReviewCheckRowId,
      check.sourceStaticReviewCheckRowIds,
      check.sourceStaticReviewCueRowIds,
      check.matchedSourceReadinessRowIds,
      check.matchedSourceReadoutRowIds,
      check.matchedSourceWalkthroughSectionIds,
      check.matchedSourceCrosswalkRowIds,
      check.sourceLocalAnchorHrefs,
      check.sourceAnchorTargetIds,
      check.evidenceCallbackIds,
      check.gapDiscussionPointIds,
      check.deferredScopeReminderIds,
    ]),
    sourceReadiness.staticReviewChecks.map((sourceCheck) => [
      sourceCheck.checkOrder,
      sourceCheck.staticReviewCheckRowId,
      [sourceCheck.staticReviewCheckRowId],
      sourceCheck.sourceStaticReviewCueRowIds,
      sourceReadiness.sourceReadinessRows
        .filter((row) =>
          sourceCheck.matchedSourceReadoutRowIds.includes(
            row.sourceReadoutRowId,
          ),
        )
        .map((row) => row.sourceReadinessRowId),
      sourceCheck.matchedSourceReadoutRowIds,
      sourceCheck.matchedSourceWalkthroughSectionIds,
      sourceCheck.matchedSourceCrosswalkRowIds,
      sourceCheck.sourceLocalAnchorHrefs,
      sourceCheck.sourceAnchorTargetIds,
      sourceCheck.evidenceCallbackIds,
      sourceCheck.gapDiscussionPointIds,
      sourceCheck.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    readinessRehearsal.staticReviewerPromptChecks.every(
      (check) =>
        check.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        check.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        check.staticNonGoalFlags.noSavedReviewerNotes &&
        check.staticNonGoalFlags.noRouteChanges &&
        check.staticNonGoalFlags.noCommandExecution &&
        check.staticNonGoalFlags.noExports &&
        check.staticNonGoalFlags.noOwnerAssignment &&
        check.staticNonGoalFlags.noScoring &&
        check.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildReviewObservationHandoffSourceReadinessRehearsal keeps local-live mode explicit", () => {
  const liveStream = {
    ...buildFixtureStreamConnection(stage07ConsoleFixture),
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };

  const view = buildMissionConsoleView(
    stage07ConsoleFixture,
    "thermal",
    liveStream,
  );

  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceReadinessRehearsal
      ?.sourceReviewObservationHandoffSourceReadiness,
    view.reviewObservationHandoffSourceReadiness,
  );
});
