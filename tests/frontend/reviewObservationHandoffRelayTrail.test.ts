import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffSynthesisRowView,
  ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffRelayTrail } from "../../frontend/src/lib/reviewObservationHandoffRelayTrail.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffRelayTrail derives ordered relay steps from Stage 48 synthesis rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const synthesis = view.reviewObservationHandoffSynthesis;
  const relayTrail = buildReviewObservationHandoffRelayTrail(synthesis);
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(synthesis);
  assert.ok(relayTrail);
  assert.equal(
    relayTrail.schema,
    "telemforge.review_observation_handoff_relay_trail.v1",
  );
  assert.equal(relayTrail.version, 1);
  assert.equal(
    relayTrail.contractLabel,
    "local deterministic observation handoff relay trail and static inspection notes",
  );
  assert.equal(relayTrail.localStatus, "fixture");
  assert.strictEqual(relayTrail.sourceObservationHandoffSynthesis, synthesis);
  assert.deepEqual(relayTrail.summary.defaultSynthesisContext, {
    defaultSynthesisRowId: synthesis.defaultSynthesisRow.synthesisRowId,
    defaultCalibrationCardId:
      synthesis.summary.defaultCalibrationContext.defaultCalibrationCardId,
    defaultDriftGuardRowId:
      synthesis.summary.defaultCalibrationContext.defaultDriftGuardRowId,
    defaultCueId: synthesis.summary.defaultCalibrationContext.defaultCueId,
    defaultDebriefPromptId:
      synthesis.summary.defaultCalibrationContext.defaultDebriefPromptId,
    defaultAnchorTargetId:
      synthesis.summary.defaultCalibrationContext.defaultAnchorTargetId,
    sourceSynthesisSummary: synthesis.summary.summary,
    sourceCalibrationSummary:
      synthesis.summary.defaultCalibrationContext.sourceCalibrationSummary,
    sourceDriftGuardSummary:
      synthesis.summary.defaultCalibrationContext.sourceDriftGuardSummary,
  });
  assert.deepEqual(
    relayTrail.relaySteps.map((step) => [
      step.stepNumber,
      step.sourceSynthesisRowId,
      step.sourceSynthesisRowIds,
      step.sourceCalibrationCardId,
      step.sourceCalibrationCardIds,
      step.sourceAlignmentNoteIds,
      step.sourceCueId,
      step.sourceCueIds,
      step.sourceDebriefPromptId,
      step.sourceDebriefPromptIds,
      step.sourceFollowUpMapEntryIds,
      step.sourcePathStepId,
      step.sourcePathStepIds,
      step.sourceAgendaSectionId,
      step.sourceAgendaSectionIds,
      step.sourcePromptGroupId,
      step.sourcePromptGroupIds,
      step.sourceCoverageRowId,
      step.sourceCoverageRowIds,
      step.sourceHandoffCardId,
      step.sourceHandoffCardIds,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.sourceInspectionReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      step.staticNonGoalContexts.length,
    ]),
    synthesis.synthesisRows.map((row) => [
      row.rowNumber,
      row.synthesisRowId,
      [row.synthesisRowId],
      row.sourceCalibrationCardId,
      row.sourceCalibrationCardIds,
      row.sourceAlignmentNoteIds,
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
      [
        ["synthesis_row", row.synthesisRowId],
        ...row.sourceCrosswalkReferences.map((reference) => [
          reference.sourceKind,
          reference.sourceId,
        ]),
      ],
      row.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    relayTrail.summary.counts.relayStepCount,
    synthesis.synthesisRows.length,
  );
  assert.equal(
    relayTrail.summary.counts.staticInspectionNoteCount,
    synthesis.staticRelayNotes.length,
  );
  assert.equal(
    relayTrail.summary.counts.sourceStaticRelayNoteCount,
    synthesis.staticRelayNotes.length,
  );
  assert.ok(
    relayTrail.relaySteps.every(
      (step) =>
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
        step.staticNonGoalFlags.noSavedReviewerNotes &&
        step.staticNonGoalFlags.noSavedRelayProgress &&
        step.staticNonGoalFlags.noSavedInspectionState &&
        step.staticNonGoalFlags.noSavedSynthesisState &&
        step.staticNonGoalFlags.noSavedCalibrationState &&
        step.staticNonGoalFlags.noSavedDriftState &&
        step.staticNonGoalFlags.noSavedReviewerProgress &&
        step.staticNonGoalFlags.noPersistence &&
        step.staticNonGoalFlags.noLocalStorage &&
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

  for (const step of relayTrail.relaySteps) {
    for (const targetId of step.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-relay-trail"',
    ),
    "Mission console should expose a local Stage 49 relay trail anchor",
  );
});

test("buildReviewObservationHandoffRelayTrail preserves Stage 48 static relay note order for inspection notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const synthesis = view.reviewObservationHandoffSynthesis;
  const relayTrail = view.reviewObservationHandoffRelayTrail;

  assert.ok(synthesis);
  assert.ok(relayTrail);
  assert.deepEqual(
    relayTrail.staticInspectionNotes.map((note) => [
      note.inspectionOrder,
      note.sourceRelayNoteId,
      note.sourceRelayNoteIds,
      note.sourceAlignmentNoteId,
      note.sourceAlignmentNoteIds,
      note.matchedSourceSynthesisRowIds,
      note.sourceCalibrationCardIds,
      note.sourceCueId,
      note.sourceCueIds,
      note.sourceDebriefPromptId,
      note.sourceDebriefPromptIds,
      note.sourceFollowUpMapEntryId,
      note.sourceFollowUpMapEntryIds,
      note.sourcePathStepId,
      note.sourcePathStepIds,
      note.sourceAnchorOrder,
      note.sourceAnchorTargetIds,
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
      note.sourceInspectionReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
    ]),
    synthesis.staticRelayNotes.map((note) => [
      note.relayOrder,
      note.staticRelayNoteEntryId,
      [note.staticRelayNoteEntryId],
      note.sourceAlignmentNoteId,
      note.sourceAlignmentNoteIds,
      expectedSynthesisRowIdsForRelayNote(note, synthesis.synthesisRows),
      note.sourceCalibrationCardIds,
      note.sourceCueId,
      note.sourceCueIds,
      note.sourceDebriefPromptId,
      note.sourceDebriefPromptIds,
      note.sourceFollowUpMapEntryId,
      note.sourceFollowUpMapEntryIds,
      note.sourcePathStepId,
      note.sourcePathStepIds,
      note.sourceAnchorOrder,
      [note.anchorTargetId],
      note.localAnchorHref,
      note.anchorTargetId,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
      [
        ["static_relay_note", note.staticRelayNoteEntryId],
        ...note.sourceCrosswalkReferences.map((reference) => [
          reference.sourceKind,
          reference.sourceId,
        ]),
        ...expectedSynthesisRowIdsForRelayNote(
          note,
          synthesis.synthesisRows,
        ).map((synthesisRowId) => ["synthesis_row", synthesisRowId]),
      ],
    ]),
  );
  assert.ok(
    relayTrail.staticInspectionNotes.every(
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
        note.staticNonGoalFlags.noSavedInspectionState &&
        note.staticNonGoalFlags.noSavedSynthesisState &&
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

function expectedSynthesisRowIdsForRelayNote(
  note: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  synthesisRows: ReviewObservationHandoffSynthesisRowView[],
): string[] {
  return synthesisRows
    .filter((row) => relayNoteMatchesSynthesisRow(note, row))
    .map((row) => row.synthesisRowId);
}

function relayNoteMatchesSynthesisRow(
  note: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  row: ReviewObservationHandoffSynthesisRowView,
): boolean {
  return (
    row.sourceAlignmentNoteIds.includes(note.sourceAlignmentNoteId) ||
    row.sourceCalibrationCardIds.some((sourceCalibrationCardId) =>
      note.sourceCalibrationCardIds.includes(sourceCalibrationCardId),
    ) ||
    row.sourceCueIds.includes(note.sourceCueId) ||
    row.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    row.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    row.anchorTargetIds.includes(note.anchorTargetId) ||
    row.sourcePathStepIds.includes(note.sourcePathStepId) ||
    row.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    row.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    row.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    row.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}
