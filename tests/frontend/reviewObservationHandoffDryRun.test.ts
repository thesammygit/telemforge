import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffDryRun } from "../../frontend/src/lib/reviewObservationHandoffDryRun.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffDryRun derives ordered cues from the Stage 42 handoff path", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const handoffPath = view.reviewObservationHandoffPath;
  const dryRun = buildReviewObservationHandoffDryRun(handoffPath);

  assert.ok(handoffPath);
  assert.ok(dryRun);
  assert.equal(
    dryRun.schema,
    "telemforge.review_observation_handoff_dry_run.v1",
  );
  assert.equal(dryRun.version, 1);
  assert.equal(
    dryRun.contractLabel,
    "local deterministic observation handoff dry-run cue sheet",
  );
  assert.equal(dryRun.localStatus, "fixture");
  assert.strictEqual(dryRun.sourceObservationHandoffPath, handoffPath);
  assert.equal(dryRun.summary.defaultCueId, dryRun.defaultCue.cueId);
  assert.equal(
    dryRun.defaultCue.sourcePathStepId,
    handoffPath.defaultPathStep.pathStepId,
  );
  assert.equal(
    dryRun.summary.defaultAnchorTargetId,
    handoffPath.summary.defaultAnchorTargetId,
  );
  assert.deepEqual(
    dryRun.cues.map((cue) => [
      cue.cueNumber,
      cue.sourcePathStepId,
      cue.sourcePathStepIds,
      cue.sourceAgendaSectionId,
      cue.sourceAgendaSectionIds,
      cue.sourcePromptGroupId,
      cue.sourcePromptGroupIds,
      cue.sourceCoverageRowId,
      cue.sourceHandoffCardId,
      cue.localAnchorHrefs,
      cue.anchorTargetIds,
      cue.evidenceCallbackIds,
      cue.gapDiscussionPointIds,
      cue.deferredScopeReminderIds,
      cue.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      cue.staticNonGoalContexts.length,
    ]),
    handoffPath.pathSteps.map((step, index) => [
      index + 1,
      step.pathStepId,
      [step.pathStepId],
      step.sourceAgendaSectionId,
      step.sourceAgendaSectionIds,
      step.sourcePromptGroupId,
      step.sourcePromptGroupIds,
      step.sourceCoverageRowId,
      step.sourceHandoffCardId,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.relatedEvidenceStopIds,
      step.relatedGapDiscussionPointIds,
      step.relatedDeferredScopeReminderIds,
      step.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      step.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    dryRun.cues.every(
      (cue) =>
        cue.localOnly &&
        cue.sourceBacked &&
        cue.inPageOnly &&
        cue.explanatoryOnly &&
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
        cue.staticNonGoalFlags.noSavedDryRunProgress &&
        cue.staticNonGoalFlags.noSavedRehearsalSessions &&
        cue.staticNonGoalFlags.noSavedPathProgress &&
        cue.staticNonGoalFlags.noRouteChanges &&
        cue.staticNonGoalFlags.noCommandExecution &&
        cue.staticNonGoalFlags.noExports &&
        cue.staticNonGoalFlags.noSignoff &&
        cue.staticNonGoalFlags.noOwnerAssignment &&
        cue.staticNonGoalFlags.noScoring &&
        cue.staticNonGoalFlags.noCertification,
    ),
  );
});

test("buildReviewObservationHandoffDryRun preserves cue-to-anchor coverage order as in-page static references", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const handoffPath = view.reviewObservationHandoffPath;
  const dryRun = view.reviewObservationHandoffDryRun;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(handoffPath);
  assert.ok(dryRun);
  assert.deepEqual(
    dryRun.cueAnchorCoverageEntries.map((entry) => [
      entry.coverageOrder,
      entry.sourceAnchorEntryId,
      entry.sourcePathStepId,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.sourcePromptGroupId,
      entry.sourceCoverageRowId,
      entry.sourceHandoffCardId,
    ]),
    handoffPath.anchorMapEntries.map((entry, index) => [
      index + 1,
      entry.anchorEntryId,
      entry.sourcePathStepId,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.sourcePromptGroupId,
      entry.sourceCoverageRowId,
      entry.sourceHandoffCardId,
    ]),
  );
  assert.equal(
    dryRun.summary.counts.dryRunCueCount,
    handoffPath.pathSteps.length,
  );
  assert.equal(
    dryRun.summary.counts.cueAnchorCoverageEntryCount,
    handoffPath.anchorMapEntries.length,
  );
  assert.ok(
    dryRun.cueAnchorCoverageEntries.every(
      (entry) =>
        entry.localOnly &&
        entry.sourceBacked &&
        entry.inPageOnly &&
        entry.explanatoryOnly &&
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
        entry.notOwnerAssigned,
    ),
  );

  for (const entry of dryRun.cueAnchorCoverageEntries) {
    assert.ok(entry.localAnchorHref.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${entry.anchorTargetId}"`),
      `${entry.anchorTargetId} should resolve to an existing mission-console section`,
    );
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-dry-run"',
    ),
    "Mission console should expose a local Stage 43 handoff dry-run anchor",
  );
});
