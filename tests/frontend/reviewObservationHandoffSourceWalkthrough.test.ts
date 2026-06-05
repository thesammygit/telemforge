import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import type {
  ReviewObservationHandoffSourceCrosswalkRowView,
  ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
} from "../../frontend/src/features/mission-console/types.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceWalkthrough derives ordered walkthrough sections from Stage 50 source crosswalk rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCrosswalk = view.reviewObservationHandoffSourceCrosswalk;
  const sourceWalkthrough = view.reviewObservationHandoffSourceWalkthrough;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(sourceCrosswalk);
  assert.ok(sourceWalkthrough);
  assert.equal(
    sourceWalkthrough.schema,
    "telemforge.review_observation_handoff_source_walkthrough.v1",
  );
  assert.equal(sourceWalkthrough.version, 1);
  assert.equal(
    sourceWalkthrough.contractLabel,
    "local deterministic observation handoff source walkthrough and static review prompts",
  );
  assert.equal(sourceWalkthrough.localStatus, "fixture");
  assert.strictEqual(
    sourceWalkthrough.sourceReviewObservationHandoffSourceCrosswalk,
    sourceCrosswalk,
  );
  assert.deepEqual(sourceWalkthrough.summary.defaultSourceCrosswalkContext, {
    defaultSourceCrosswalkRowId:
      sourceCrosswalk.defaultSourceCrosswalkRow.sourceCrosswalkRowId,
    defaultRelayStepId:
      sourceCrosswalk.summary.defaultRelayContext.defaultRelayStepId,
    defaultSynthesisRowId:
      sourceCrosswalk.summary.defaultRelayContext.defaultSynthesisRowId,
    defaultCalibrationCardId:
      sourceCrosswalk.summary.defaultRelayContext.defaultCalibrationCardId,
    defaultCueId: sourceCrosswalk.summary.defaultRelayContext.defaultCueId,
    defaultDebriefPromptId:
      sourceCrosswalk.summary.defaultRelayContext.defaultDebriefPromptId,
    defaultAnchorTargetId:
      sourceCrosswalk.summary.defaultRelayContext.defaultAnchorTargetId,
    sourceCrosswalkSummary: sourceCrosswalk.summary.summary,
    sourceRelayTrailSummary:
      sourceCrosswalk.summary.defaultRelayContext.sourceRelayTrailSummary,
    sourceSynthesisSummary:
      sourceCrosswalk.summary.defaultRelayContext.sourceSynthesisSummary,
    sourceCalibrationSummary:
      sourceCrosswalk.summary.defaultRelayContext.sourceCalibrationSummary,
    sourceDriftGuardSummary:
      sourceCrosswalk.summary.defaultRelayContext.sourceDriftGuardSummary,
  });
  assert.deepEqual(
    sourceWalkthrough.walkthroughSections.map((section) => [
      section.sectionNumber,
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
    sourceCrosswalk.sourceCrosswalkRows.map((row) => [
      row.rowNumber,
      row.sourceCrosswalkRowId,
      [row.sourceCrosswalkRowId],
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
  );
  assert.equal(
    sourceWalkthrough.summary.counts.walkthroughSectionCount,
    sourceCrosswalk.sourceCrosswalkRows.length,
  );
  assert.equal(
    sourceWalkthrough.summary.counts.staticReviewPromptCount,
    sourceCrosswalk.staticAnchorNotes.length,
  );
  assert.equal(
    sourceWalkthrough.summary.counts.sourceInspectionReferenceCount,
    sourceCrosswalk.sourceCrosswalkRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
  );
  assert.ok(
    sourceWalkthrough.walkthroughSections.every(
      (section) =>
        section.localOnly &&
        section.sourceBacked &&
        section.inPageOnly &&
        section.explanatoryOnly &&
        section.staticOnly &&
        section.informationalOnly &&
        section.nonActionable &&
        section.nonPersistent &&
        section.nonExecutable &&
        section.nonRouting &&
        section.nonCertifying &&
        section.nonRanking &&
        section.notATask &&
        section.notATicket &&
        section.notAChecklist &&
        section.notOwnerAssigned &&
        section.staticNonGoalFlags.noSavedReviewerNotes &&
        section.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        section.staticNonGoalFlags.noSavedSourceInspectionState &&
        section.staticNonGoalFlags.noSavedAnchorState &&
        section.staticNonGoalFlags.noSavedRelayProgress &&
        section.staticNonGoalFlags.noSavedSynthesisState &&
        section.staticNonGoalFlags.noSavedCalibrationState &&
        section.staticNonGoalFlags.noSavedDriftState &&
        section.staticNonGoalFlags.noSavedReviewerProgress &&
        section.staticNonGoalFlags.noPersistence &&
        section.staticNonGoalFlags.noRouteChanges &&
        section.staticNonGoalFlags.noCommandExecution &&
        section.staticNonGoalFlags.noExports &&
        section.staticNonGoalFlags.noSignoff &&
        section.staticNonGoalFlags.noAuditRetention &&
        section.staticNonGoalFlags.noOwnerAssignment &&
        section.staticNonGoalFlags.noScoring &&
        section.staticNonGoalFlags.noCertification &&
        section.staticNonGoalFlags.noMeetingWorkflow &&
        section.staticNonGoalFlags.noHandoffPackageGeneration &&
        section.staticNonGoalFlags.noTaskLaunchers &&
        section.staticNonGoalFlags.noRunnableChecklists,
    ),
  );

  for (const section of sourceWalkthrough.walkthroughSections) {
    for (const targetId of section.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-walkthrough"',
    ),
    "Mission console should expose a local Stage 51 source walkthrough anchor",
  );
});

test("buildReviewObservationHandoffSourceWalkthrough preserves Stage 50 static anchor note order for review prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const sourceCrosswalk = view.reviewObservationHandoffSourceCrosswalk;
  const sourceWalkthrough = view.reviewObservationHandoffSourceWalkthrough;

  assert.ok(sourceCrosswalk);
  assert.ok(sourceWalkthrough);
  assert.deepEqual(
    sourceWalkthrough.staticReviewPrompts.map((prompt) => [
      prompt.promptOrder,
      prompt.sourceStaticAnchorNoteId,
      prompt.sourceStaticAnchorNoteIds,
      prompt.sourceStaticInspectionNoteId,
      prompt.sourceRelayNoteId,
      prompt.matchedSourceCrosswalkRowIds,
      prompt.matchedSourceWalkthroughSectionIds,
      prompt.sourceRelayStepIds,
      prompt.sourceLocalAnchorHrefs,
      prompt.sourceAnchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
    ]),
    sourceCrosswalk.staticAnchorNotes.map((note) => [
      note.anchorOrder,
      note.staticAnchorNoteEntryId,
      [note.staticAnchorNoteEntryId],
      note.sourceStaticInspectionNoteId,
      note.sourceRelayNoteId,
      note.matchedSourceCrosswalkRowIds,
      expectedWalkthroughSectionIdsForStaticPrompt(
        note,
        sourceCrosswalk.sourceCrosswalkRows,
      ),
      expectedRelayStepIdsForStaticPrompt(
        note,
        sourceCrosswalk.sourceCrosswalkRows,
      ),
      [note.localAnchorHref],
      note.sourceAnchorTargetIds,
      note.evidenceCallbackIds,
      note.gapDiscussionPointIds,
      note.deferredScopeReminderIds,
    ]),
  );
  assert.ok(
    sourceWalkthrough.staticReviewPrompts.every(
      (prompt) =>
        prompt.localOnly &&
        prompt.sourceBacked &&
        prompt.inPageOnly &&
        prompt.explanatoryOnly &&
        prompt.staticOnly &&
        prompt.informationalOnly &&
        prompt.nonActionable &&
        prompt.nonPersistent &&
        prompt.nonExecutable &&
        prompt.nonRouting &&
        prompt.nonCertifying &&
        prompt.nonRanking &&
        prompt.notATask &&
        prompt.notATicket &&
        prompt.notAChecklist &&
        prompt.notOwnerAssigned &&
        prompt.staticNonGoalFlags.noSavedReviewerNotes &&
        prompt.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
        prompt.staticNonGoalFlags.noSavedSourceInspectionState &&
        prompt.staticNonGoalFlags.noSavedAnchorState &&
        prompt.staticNonGoalFlags.noSavedRelayProgress &&
        prompt.staticNonGoalFlags.noPersistence &&
        prompt.staticNonGoalFlags.noCommandExecution &&
        prompt.staticNonGoalFlags.noExports &&
        prompt.staticNonGoalFlags.noScoring &&
        prompt.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildMissionConsoleView carries the source walkthrough through local-live mode", () => {
  const liveStream = {
    state: "live" as const,
    label: "Live review stream",
    detail: "Connected to the local websocket",
  };
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal", liveStream);

  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough?.localStatus,
    "local-live",
  );
  assert.equal(
    view.reviewObservationHandoffSourceWalkthrough
      ?.sourceReviewObservationHandoffSourceCrosswalk,
    view.reviewObservationHandoffSourceCrosswalk,
  );
});

function expectedWalkthroughSectionIdsForStaticPrompt(
  note: ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
  rows: ReviewObservationHandoffSourceCrosswalkRowView[],
): string[] {
  return rows
    .filter((row) =>
      note.matchedSourceCrosswalkRowIds.includes(row.sourceCrosswalkRowId),
    )
    .map(
      (row) =>
        `review-observation-handoff-source-walkthrough:${row.sourceCrosswalkRowId}`,
    );
}

function expectedRelayStepIdsForStaticPrompt(
  note: ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
  rows: ReviewObservationHandoffSourceCrosswalkRowView[],
): string[] {
  return rows
    .filter((row) =>
      note.matchedSourceCrosswalkRowIds.includes(row.sourceCrosswalkRowId),
    )
    .map((row) => row.sourceRelayStepId);
}
