import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  ReviewObservationHandoffRelayTrailStepView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffSourceCrosswalk } from "../../frontend/src/lib/reviewObservationHandoffSourceCrosswalk.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceCrosswalk derives ordered source rows from Stage 49 relay steps", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const relayTrail = view.reviewObservationHandoffRelayTrail;
  const sourceCrosswalk =
    buildReviewObservationHandoffSourceCrosswalk(relayTrail);
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(relayTrail);
  assert.ok(sourceCrosswalk);
  assert.equal(
    sourceCrosswalk.schema,
    "telemforge.review_observation_handoff_source_crosswalk.v1",
  );
  assert.equal(sourceCrosswalk.version, 1);
  assert.equal(
    sourceCrosswalk.contractLabel,
    "local deterministic observation handoff source crosswalk and static anchor notes",
  );
  assert.equal(sourceCrosswalk.localStatus, "fixture");
  assert.strictEqual(
    sourceCrosswalk.sourceReviewObservationHandoffRelayTrail,
    relayTrail,
  );
  assert.deepEqual(sourceCrosswalk.summary.defaultRelayContext, {
    defaultRelayStepId: relayTrail.defaultRelayStep.relayStepId,
    defaultSynthesisRowId: relayTrail.defaultRelayStep.sourceSynthesisRowId,
    defaultCalibrationCardId:
      relayTrail.summary.defaultSynthesisContext.defaultCalibrationCardId,
    defaultCueId: relayTrail.summary.defaultSynthesisContext.defaultCueId,
    defaultDebriefPromptId:
      relayTrail.summary.defaultSynthesisContext.defaultDebriefPromptId,
    defaultAnchorTargetId:
      relayTrail.summary.defaultSynthesisContext.defaultAnchorTargetId,
    sourceRelayTrailSummary: relayTrail.summary.summary,
    sourceSynthesisSummary:
      relayTrail.summary.defaultSynthesisContext.sourceSynthesisSummary,
    sourceCalibrationSummary:
      relayTrail.summary.defaultSynthesisContext.sourceCalibrationSummary,
    sourceDriftGuardSummary:
      relayTrail.summary.defaultSynthesisContext.sourceDriftGuardSummary,
  });
  assert.deepEqual(
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.rowNumber,
      row.sourceRelayStepId,
      row.sourceRelayStepIds,
      row.sourceSynthesisRowIds,
      row.sourceInspectionReferenceIds,
      row.sourceKinds,
      row.sourceIds,
      row.sourceLabels,
      row.localAnchorHrefs,
      row.anchorTargetIds,
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
    relayTrail.relaySteps.map((step) => [
      step.stepNumber,
      step.relayStepId,
      [step.relayStepId],
      step.sourceSynthesisRowIds,
      step.sourceInspectionReferences.map((reference) => reference.referenceId),
      step.sourceInspectionReferences.map((reference) => reference.sourceKind),
      step.sourceInspectionReferences.map((reference) => reference.sourceId),
      step.sourceInspectionReferences.map((reference) => reference.label),
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.sourceCalibrationCardIds,
      step.sourceAlignmentNoteIds,
      step.sourceCueIds,
      step.sourceDebriefPromptIds,
      step.sourceFollowUpMapEntryIds,
      step.sourcePathStepIds,
      step.sourceAgendaSectionIds,
      step.sourcePromptGroupIds,
      step.sourceCoverageRowIds,
      step.sourceHandoffCardIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    sourceCrosswalk.summary.counts.sourceCrosswalkRowCount,
    relayTrail.relaySteps.length,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.staticAnchorNoteCount,
    relayTrail.staticInspectionNotes.length,
  );
  assert.equal(
    sourceCrosswalk.summary.counts.sourceInspectionReferenceCount,
    relayTrail.relaySteps.reduce(
      (count, step) => count + step.sourceInspectionReferences.length,
      0,
    ),
  );
  assert.ok(
    sourceCrosswalk.sourceCrosswalkRows.every(
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
        row.staticNonGoalFlags.noSavedReviewerNotes &&
        row.staticNonGoalFlags.noSavedRelayProgress &&
        row.staticNonGoalFlags.noSavedSourceInspectionState &&
        row.staticNonGoalFlags.noSavedAnchorState &&
        row.staticNonGoalFlags.noSavedSynthesisState &&
        row.staticNonGoalFlags.noSavedCalibrationState &&
        row.staticNonGoalFlags.noSavedDriftState &&
        row.staticNonGoalFlags.noSavedReviewerProgress &&
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

  for (const row of sourceCrosswalk.sourceCrosswalkRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-crosswalk"',
    ),
    "Mission console should expose a local Stage 50 source crosswalk anchor",
  );
});

test("buildReviewObservationHandoffSourceCrosswalk preserves Stage 49 static inspection note order for anchor notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const relayTrail = view.reviewObservationHandoffRelayTrail;
  const sourceCrosswalk = view.reviewObservationHandoffSourceCrosswalk;

  assert.ok(relayTrail);
  assert.ok(sourceCrosswalk);
  assert.deepEqual(
    sourceCrosswalk.staticAnchorNotes.map((note) => [
      note.anchorOrder,
      note.sourceStaticInspectionNoteId,
      note.sourceStaticInspectionNoteIds,
      note.sourceRelayNoteId,
      note.sourceRelayNoteIds,
      note.matchedSourceCrosswalkRowIds,
      note.sourceAlignmentNoteId,
      note.sourceAlignmentNoteIds,
      note.sourceAnchorTargetIds,
      note.sourceAnchorOrder,
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
    ]),
    relayTrail.staticInspectionNotes.map((note) => [
      note.inspectionOrder,
      note.staticInspectionNoteEntryId,
      [note.staticInspectionNoteEntryId],
      note.sourceRelayNoteId,
      note.sourceRelayNoteIds,
      expectedCrosswalkRowIdsForStaticNote(note, relayTrail.relaySteps),
      note.sourceAlignmentNoteId,
      note.sourceAlignmentNoteIds,
      note.sourceAnchorTargetIds,
      note.sourceAnchorOrder,
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    sourceCrosswalk.staticAnchorNotes.every(
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
        note.staticNonGoalFlags.noSavedReviewerNotes &&
        note.staticNonGoalFlags.noSavedRelayProgress &&
        note.staticNonGoalFlags.noSavedSourceInspectionState &&
        note.staticNonGoalFlags.noSavedAnchorState &&
        note.staticNonGoalFlags.noSavedSynthesisState &&
        note.staticNonGoalFlags.noSavedCalibrationState &&
        note.staticNonGoalFlags.noSavedDriftState &&
        note.staticNonGoalFlags.noSavedReviewerProgress &&
        note.staticNonGoalFlags.noPersistence &&
        note.staticNonGoalFlags.noCommandExecution &&
        note.staticNonGoalFlags.noExports &&
        note.staticNonGoalFlags.noScoring &&
        note.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildMissionConsoleView carries the source crosswalk through local-live mode", () => {
  const liveStream = {
    ...viewFixtureStream(),
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal", liveStream);

  assert.equal(view.reviewObservationHandoffSourceCrosswalk?.localStatus, "local-live");
  assert.equal(
    view.reviewObservationHandoffSourceCrosswalk
      ?.sourceReviewObservationHandoffRelayTrail,
    view.reviewObservationHandoffRelayTrail,
  );
});

function expectedCrosswalkRowIdsForStaticNote(
  note: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  relaySteps: ReviewObservationHandoffRelayTrailStepView[],
): string[] {
  return relaySteps
    .filter((step) => staticNoteMatchesRelayStep(note, step))
    .map((step) => `review-observation-handoff-source-crosswalk:${step.relayStepId}`);
}

function staticNoteMatchesRelayStep(
  note: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  step: ReviewObservationHandoffRelayTrailStepView,
): boolean {
  return (
    step.sourceAlignmentNoteIds.includes(note.sourceAlignmentNoteId) ||
    step.sourceCalibrationCardIds.some((sourceCalibrationCardId) =>
      note.sourceCalibrationCardIds.includes(sourceCalibrationCardId),
    ) ||
    step.sourceCueIds.includes(note.sourceCueId) ||
    step.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    step.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    step.anchorTargetIds.includes(note.anchorTargetId) ||
    step.sourcePathStepIds.includes(note.sourcePathStepId) ||
    step.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    step.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    step.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    step.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}

function viewFixtureStream() {
  return {
    state: "fixture" as const,
    label: stage07ConsoleFixture.source.snapshot,
    detail: "Fixture review mode",
  };
}
