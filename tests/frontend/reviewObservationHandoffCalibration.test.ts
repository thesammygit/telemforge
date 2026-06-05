import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffCalibration } from "../../frontend/src/lib/reviewObservationHandoffCalibration.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffCalibration derives ordered calibration cards from Stage 46 drift guard rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const driftGuard = view.reviewObservationHandoffDriftGuard;
  const calibration = buildReviewObservationHandoffCalibration(driftGuard);
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(driftGuard);
  assert.ok(calibration);
  assert.equal(
    calibration.schema,
    "telemforge.review_observation_handoff_calibration.v1",
  );
  assert.equal(calibration.version, 1);
  assert.equal(
    calibration.contractLabel,
    "local deterministic observation handoff calibration board and static alignment notes",
  );
  assert.equal(calibration.localStatus, "fixture");
  assert.strictEqual(calibration.sourceObservationHandoffDriftGuard, driftGuard);
  assert.deepEqual(calibration.summary.defaultDriftGuardContext, {
    defaultDriftGuardRowId: driftGuard.defaultDriftGuardRow.driftGuardRowId,
    defaultCueId:
      driftGuard.summary.defaultContinuityContext.defaultCueId,
    defaultDebriefPromptId:
      driftGuard.summary.defaultContinuityContext.defaultDebriefPromptId,
    defaultAnchorTargetId:
      driftGuard.summary.defaultContinuityContext.defaultAnchorTargetId,
    sourceDriftGuardSummary: driftGuard.summary.summary,
    sourceContinuitySummary:
      driftGuard.summary.defaultContinuityContext.sourceContinuitySummary,
  });
  assert.deepEqual(
    calibration.calibrationCards.map((card) => [
      card.cardNumber,
      card.sourceDriftGuardRowId,
      card.sourceCueId,
      card.sourceCueIds,
      card.sourceDebriefPromptId,
      card.sourceDebriefPromptIds,
      card.sourceFollowUpMapEntryIds,
      card.sourcePathStepId,
      card.sourcePathStepIds,
      card.sourceAgendaSectionId,
      card.sourceAgendaSectionIds,
      card.sourcePromptGroupId,
      card.sourcePromptGroupIds,
      card.sourceCoverageRowId,
      card.sourceCoverageRowIds,
      card.sourceHandoffCardId,
      card.sourceHandoffCardIds,
      card.localAnchorHrefs,
      card.anchorTargetIds,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      card.staticNonGoalContexts.length,
    ]),
    driftGuard.driftGuardRows.map((row) => [
      row.rowNumber,
      row.driftGuardRowId,
      row.sourceCueId,
      row.sourceCueIds,
      row.sourceDebriefPromptId,
      row.sourceDebriefPromptIds,
      row.sourceFollowUpMapEntryIds,
      row.sourcePathStepId,
      row.sourcePathStepIds,
      row.sourceAgendaSectionId,
      row.sourceAgendaSectionIds,
      row.sourcePromptGroupId,
      row.sourcePromptGroupIds,
      row.sourceCoverageRowId,
      row.sourceCoverageRowIds,
      row.sourceHandoffCardId,
      row.sourceHandoffCardIds,
      row.localAnchorHrefs,
      row.anchorTargetIds,
      row.evidenceCallbackIds,
      row.gapDiscussionPointIds,
      row.deferredScopeReminderIds,
      row.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      row.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    calibration.summary.counts.calibrationCardCount,
    driftGuard.driftGuardRows.length,
  );
  assert.equal(
    calibration.summary.counts.staticAlignmentNoteCount,
    driftGuard.staticRegressionMapEntries.length,
  );
  assert.ok(
    calibration.calibrationCards.every(
      (card) =>
        card.localOnly &&
        card.sourceBacked &&
        card.inPageOnly &&
        card.explanatoryOnly &&
        card.staticOnly &&
        card.informationalOnly &&
        card.nonActionable &&
        card.nonPersistent &&
        card.nonExecutable &&
        card.nonRouting &&
        card.nonCertifying &&
        card.nonRanking &&
        card.notATask &&
        card.notATicket &&
        card.notAChecklist &&
        card.notOwnerAssigned &&
        card.staticNonGoalFlags.noSavedCalibrationNotes &&
        card.staticNonGoalFlags.noSavedCalibrationState &&
        card.staticNonGoalFlags.noSavedDriftState &&
        card.staticNonGoalFlags.noSavedReviewerProgress &&
        card.staticNonGoalFlags.noSavedDebriefNotes &&
        card.staticNonGoalFlags.noSavedContinuityProgress &&
        card.staticNonGoalFlags.noSavedFollowUpOwnership &&
        card.staticNonGoalFlags.noPersistence &&
        card.staticNonGoalFlags.noLocalStorage &&
        card.staticNonGoalFlags.noRouteChanges &&
        card.staticNonGoalFlags.noCommandExecution &&
        card.staticNonGoalFlags.noExports &&
        card.staticNonGoalFlags.noSignoff &&
        card.staticNonGoalFlags.noAuditRetention &&
        card.staticNonGoalFlags.noOwnerAssignment &&
        card.staticNonGoalFlags.noScoring &&
        card.staticNonGoalFlags.noCertification &&
        card.staticNonGoalFlags.noMeetingWorkflow &&
        card.staticNonGoalFlags.noHandoffPackageGeneration &&
        card.staticNonGoalFlags.noTaskLaunchers &&
        card.staticNonGoalFlags.noRunnableChecklists,
    ),
  );

  for (const card of calibration.calibrationCards) {
    for (const targetId of card.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-calibration"',
    ),
    "Mission console should expose a local Stage 47 calibration anchor",
  );
});

test("buildReviewObservationHandoffCalibration preserves Stage 46 regression order for static alignment notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const driftGuard = view.reviewObservationHandoffDriftGuard;
  const calibration = view.reviewObservationHandoffCalibration;

  assert.ok(driftGuard);
  assert.ok(calibration);
  assert.deepEqual(
    calibration.staticAlignmentNotes.map((note) => [
      note.alignmentOrder,
      note.sourceStaticRegressionMapEntryId,
      note.sourceCueId,
      note.sourceCueIds,
      note.sourceDebriefPromptId,
      note.sourceDebriefPromptIds,
      note.sourceFollowUpMapEntryId,
      note.sourceFollowUpMapEntryIds,
      note.sourceAnchorCoverageEntryId,
      note.sourceAnchorCoverageEntryIds,
      note.sourcePathStepId,
      note.sourcePathStepIds,
      note.sourceAnchorOrder,
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
    ]),
    driftGuard.staticRegressionMapEntries.map((entry) => [
      entry.regressionOrder,
      entry.staticRegressionMapEntryId,
      entry.sourceCueId,
      entry.sourceCueIds,
      entry.sourceDebriefPromptId,
      entry.sourceDebriefPromptIds,
      entry.sourceFollowUpMapEntryId,
      entry.sourceFollowUpMapEntryIds,
      entry.sourceAnchorCoverageEntryId,
      entry.sourceAnchorCoverageEntryIds,
      entry.sourcePathStepId,
      entry.sourcePathStepIds,
      entry.sourceAnchorOrder,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.evidenceCallbackIds,
      entry.gapDiscussionPointIds,
      entry.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    calibration.staticAlignmentNotes.every(
      (note) =>
        note.localOnly &&
        note.sourceBacked &&
        note.inPageOnly &&
        note.explanatoryOnly &&
        note.staticOnly &&
        note.informationalOnly &&
        note.nonActionable &&
        note.nonPersistent &&
        note.nonExecutable &&
        note.nonRouting &&
        note.nonCertifying &&
        note.nonRanking &&
        note.notATask &&
        note.notATicket &&
        note.notAChecklist &&
        note.notOwnerAssigned &&
        note.staticNonGoalFlags.noSavedCalibrationState &&
        note.staticNonGoalFlags.noSavedDriftState &&
        note.staticNonGoalFlags.noSavedReviewerProgress &&
        note.staticNonGoalFlags.noPersistence &&
        note.staticNonGoalFlags.noLocalStorage &&
        note.staticNonGoalFlags.noRouteChanges &&
        note.staticNonGoalFlags.noCommandExecution &&
        note.staticNonGoalFlags.noExports &&
        note.staticNonGoalFlags.noScoring &&
        note.staticNonGoalFlags.noCertification,
    ),
  );
});
