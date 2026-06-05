import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffCalibrationCardView,
  ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
} from "../../frontend/src/features/mission-console/types.ts";
import { buildReviewObservationHandoffSynthesis } from "../../frontend/src/lib/reviewObservationHandoffSynthesis.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSynthesis derives ordered synthesis rows from Stage 47 calibration cards", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const calibration = view.reviewObservationHandoffCalibration;
  const synthesis = buildReviewObservationHandoffSynthesis(calibration);
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(calibration);
  assert.ok(synthesis);
  assert.equal(
    synthesis.schema,
    "telemforge.review_observation_handoff_synthesis.v1",
  );
  assert.equal(synthesis.version, 1);
  assert.equal(
    synthesis.contractLabel,
    "local deterministic observation handoff synthesis map and static relay notes",
  );
  assert.equal(synthesis.localStatus, "fixture");
  assert.strictEqual(synthesis.sourceObservationHandoffCalibration, calibration);
  assert.deepEqual(synthesis.summary.defaultCalibrationContext, {
    defaultCalibrationCardId: calibration.defaultCalibrationCard.calibrationCardId,
    defaultDriftGuardRowId:
      calibration.summary.defaultDriftGuardContext.defaultDriftGuardRowId,
    defaultCueId: calibration.summary.defaultDriftGuardContext.defaultCueId,
    defaultDebriefPromptId:
      calibration.summary.defaultDriftGuardContext.defaultDebriefPromptId,
    defaultAnchorTargetId:
      calibration.summary.defaultDriftGuardContext.defaultAnchorTargetId,
    sourceCalibrationSummary: calibration.summary.summary,
    sourceDriftGuardSummary:
      calibration.summary.defaultDriftGuardContext.sourceDriftGuardSummary,
  });
  assert.deepEqual(
    synthesis.synthesisRows.map((row) => [
      row.rowNumber,
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
      row.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      row.sourceCrosswalkReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      row.staticNonGoalContexts.length,
    ]),
    calibration.calibrationCards.map((card) => [
      card.cardNumber,
      card.calibrationCardId,
      [card.calibrationCardId],
      expectedAlignmentNoteIdsForCard(card, calibration.staticAlignmentNotes),
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
      [
        ["calibration_card", card.calibrationCardId],
        ...card.sourceReferences.map((reference) => [
          reference.sourceKind,
          reference.sourceId,
        ]),
        ...expectedAlignmentNoteIdsForCard(
          card,
          calibration.staticAlignmentNotes,
        ).map((alignmentNoteId) => ["alignment_note", alignmentNoteId]),
      ],
      card.staticNonGoalContexts.length,
    ]),
  );
  assert.equal(
    synthesis.summary.counts.synthesisRowCount,
    calibration.calibrationCards.length,
  );
  assert.equal(
    synthesis.summary.counts.staticRelayNoteCount,
    calibration.staticAlignmentNotes.length,
  );
  assert.ok(
    synthesis.synthesisRows.every(
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
        row.staticNonGoalFlags.noSavedSynthesisState &&
        row.staticNonGoalFlags.noSavedCalibrationState &&
        row.staticNonGoalFlags.noSavedDriftState &&
        row.staticNonGoalFlags.noSavedReviewerProgress &&
        row.staticNonGoalFlags.noPersistence &&
        row.staticNonGoalFlags.noLocalStorage &&
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

  for (const row of synthesis.synthesisRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes('id="review-observation-handoff-synthesis"'),
    "Mission console should expose a local Stage 48 synthesis anchor",
  );
});

test("buildReviewObservationHandoffSynthesis preserves Stage 47 alignment order for static relay notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const calibration = view.reviewObservationHandoffCalibration;
  const synthesis = view.reviewObservationHandoffSynthesis;

  assert.ok(calibration);
  assert.ok(synthesis);
  assert.deepEqual(
    synthesis.staticRelayNotes.map((note) => [
      note.relayOrder,
      note.sourceAlignmentNoteId,
      note.sourceAlignmentNoteIds,
      note.sourceCalibrationCardIds,
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
    calibration.staticAlignmentNotes.map((note) => [
      note.alignmentOrder,
      note.staticAlignmentNoteId,
      [note.staticAlignmentNoteId],
      expectedCalibrationCardIdsForAlignmentNote(
        note,
        calibration.calibrationCards,
      ),
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
  );
  assert.ok(
    synthesis.staticRelayNotes.every(
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

function expectedAlignmentNoteIdsForCard(
  card: ReviewObservationHandoffCalibrationCardView,
  staticAlignmentNotes: ReviewObservationHandoffCalibrationStaticAlignmentNoteView[],
): string[] {
  return staticAlignmentNotes
    .filter((note) => alignmentNoteMatchesCard(note, card))
    .map((note) => note.staticAlignmentNoteId);
}

function expectedCalibrationCardIdsForAlignmentNote(
  note: ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  calibrationCards: ReviewObservationHandoffCalibrationCardView[],
): string[] {
  return calibrationCards
    .filter((card) => alignmentNoteMatchesCard(note, card))
    .map((card) => card.calibrationCardId);
}

function alignmentNoteMatchesCard(
  note: ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  card: ReviewObservationHandoffCalibrationCardView,
): boolean {
  return (
    card.sourceCueIds.includes(note.sourceCueId) ||
    card.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    card.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    card.anchorTargetIds.includes(note.anchorTargetId) ||
    card.sourcePathStepIds.includes(note.sourcePathStepId) ||
    card.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    card.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    card.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    card.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}
