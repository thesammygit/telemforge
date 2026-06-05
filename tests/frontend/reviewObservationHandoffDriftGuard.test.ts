import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffDriftGuard } from "../../frontend/src/lib/reviewObservationHandoffDriftGuard.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffDriftGuard derives ordered drift guard rows from Stage 45 continuity cards", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const continuity = view.reviewObservationHandoffContinuity;
  const driftGuard = buildReviewObservationHandoffDriftGuard(continuity);

  assert.ok(continuity);
  assert.ok(driftGuard);
  assert.equal(
    driftGuard.schema,
    "telemforge.review_observation_handoff_drift_guard.v1",
  );
  assert.equal(driftGuard.version, 1);
  assert.equal(
    driftGuard.contractLabel,
    "local deterministic observation handoff drift guard and static regression map",
  );
  assert.equal(driftGuard.localStatus, "fixture");
  assert.strictEqual(driftGuard.sourceObservationHandoffContinuity, continuity);
  assert.deepEqual(driftGuard.summary.defaultContinuityContext, {
    defaultContinuityCardId: continuity.summary.defaultContinuityCardId,
    defaultDebriefPromptId: continuity.summary.defaultDebriefPromptId,
    defaultCueId: continuity.summary.defaultCueId,
    defaultAnchorTargetId: continuity.summary.defaultAnchorTargetId,
    sourceContinuitySummary: continuity.summary.summary,
  });
  assert.deepEqual(
    driftGuard.driftGuardRows.map((row) => [
      row.rowNumber,
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
    continuity.continuityCards.map((card) => [
      card.cardNumber,
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
  );
  assert.equal(
    driftGuard.summary.counts.driftGuardRowCount,
    continuity.continuityCards.length,
  );
  assert.equal(
    driftGuard.summary.counts.staticRegressionMapEntryCount,
    continuity.nextPassMapEntries.length,
  );
  assert.ok(
    driftGuard.driftGuardRows.every(
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
        row.staticNonGoalFlags.noSavedDriftState &&
        row.staticNonGoalFlags.noSavedReviewSessions &&
        row.staticNonGoalFlags.noSavedDebriefNotes &&
        row.staticNonGoalFlags.noSavedContinuityProgress &&
        row.staticNonGoalFlags.noSavedFollowUpOwnership &&
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
});

test("buildReviewObservationHandoffDriftGuard preserves next-pass order for static regression map rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const continuity = view.reviewObservationHandoffContinuity;
  const driftGuard = view.reviewObservationHandoffDriftGuard;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(continuity);
  assert.ok(driftGuard);
  assert.deepEqual(
    driftGuard.staticRegressionMapEntries.map((entry) => [
      entry.regressionOrder,
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
    continuity.nextPassMapEntries.map((entry) => [
      entry.nextPassOrder,
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
    driftGuard.staticRegressionMapEntries.every(
      (entry) =>
        entry.localOnly &&
        entry.sourceBacked &&
        entry.inPageOnly &&
        entry.explanatoryOnly &&
        entry.staticOnly &&
        entry.informationalOnly &&
        entry.nonActionable &&
        entry.nonPersistent &&
        entry.nonExecutable &&
        entry.nonRouting &&
        entry.nonCertifying &&
        entry.nonRanking &&
        entry.notATask &&
        entry.notATicket &&
        entry.notAChecklist &&
        entry.notOwnerAssigned &&
        entry.staticNonGoalFlags.noSavedDriftState &&
        entry.staticNonGoalFlags.noSavedReviewerProgress &&
        entry.staticNonGoalFlags.noSavedContinuityProgress &&
        entry.staticNonGoalFlags.noSavedFollowUpProgress &&
        entry.staticNonGoalFlags.noSavedFollowUpOwnership,
    ),
  );

  for (const entry of driftGuard.staticRegressionMapEntries) {
    assert.ok(entry.localAnchorHref.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${entry.anchorTargetId}"`),
      `${entry.anchorTargetId} should resolve to an existing mission-console section`,
    );
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-drift-guard"',
    ),
    "Mission console should expose a local Stage 46 drift guard anchor",
  );
});
