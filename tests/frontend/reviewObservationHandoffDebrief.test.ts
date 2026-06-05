import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffDebrief } from "../../frontend/src/lib/reviewObservationHandoffDebrief.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffDebrief derives ordered prompts from Stage 43 dry-run cues", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const dryRun = view.reviewObservationHandoffDryRun;
  const debrief = buildReviewObservationHandoffDebrief(dryRun);

  assert.ok(dryRun);
  assert.ok(debrief);
  assert.equal(
    debrief.schema,
    "telemforge.review_observation_handoff_debrief.v1",
  );
  assert.equal(debrief.version, 1);
  assert.equal(
    debrief.contractLabel,
    "local deterministic observation handoff debrief and static follow-up map",
  );
  assert.equal(debrief.localStatus, "fixture");
  assert.strictEqual(debrief.sourceObservationHandoffDryRun, dryRun);
  assert.equal(
    debrief.summary.defaultDebriefPromptId,
    debrief.defaultDebriefPrompt.debriefPromptId,
  );
  assert.equal(
    debrief.defaultDebriefPrompt.sourceCueId,
    dryRun.defaultCue.cueId,
  );
  assert.equal(debrief.summary.defaultCueId, dryRun.defaultCue.cueId);
  assert.equal(
    debrief.summary.defaultAnchorTargetId,
    dryRun.summary.defaultAnchorTargetId,
  );
  assert.deepEqual(
    debrief.debriefPrompts.map((prompt) => [
      prompt.promptNumber,
      prompt.sourceCueId,
      prompt.sourceCueIds,
      prompt.sourcePathStepId,
      prompt.sourcePathStepIds,
      prompt.sourceAgendaSectionId,
      prompt.sourceAgendaSectionIds,
      prompt.sourcePromptGroupId,
      prompt.sourcePromptGroupIds,
      prompt.sourceCoverageRowId,
      prompt.sourceCoverageRowIds,
      prompt.sourceHandoffCardId,
      prompt.sourceHandoffCardIds,
      prompt.localAnchorHrefs,
      prompt.anchorTargetIds,
      prompt.evidenceCallbackIds,
      prompt.gapDiscussionPointIds,
      prompt.deferredScopeReminderIds,
      prompt.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      prompt.staticNonGoalContexts.length,
    ]),
    dryRun.cues.map((cue, index) => [
      index + 1,
      cue.cueId,
      [cue.cueId],
      cue.sourcePathStepId,
      cue.sourcePathStepIds,
      cue.sourceAgendaSectionId,
      cue.sourceAgendaSectionIds,
      cue.sourcePromptGroupId,
      cue.sourcePromptGroupIds,
      cue.sourceCoverageRowId,
      [cue.sourceCoverageRowId],
      cue.sourceHandoffCardId,
      [cue.sourceHandoffCardId],
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
  );
  assert.ok(
    debrief.debriefPrompts.every(
      (prompt) =>
        prompt.localOnly &&
        prompt.sourceBacked &&
        prompt.inPageOnly &&
        prompt.explanatoryOnly &&
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
        prompt.staticNonGoalFlags.noSavedDebriefNotes &&
        prompt.staticNonGoalFlags.noSavedFollowUpProgress &&
        prompt.staticNonGoalFlags.noSavedFollowUpOwnership &&
        prompt.staticNonGoalFlags.noSavedDryRunProgress &&
        prompt.staticNonGoalFlags.noSavedRehearsalSessions &&
        prompt.staticNonGoalFlags.noRouteChanges &&
        prompt.staticNonGoalFlags.noCommandExecution &&
        prompt.staticNonGoalFlags.noExports &&
        prompt.staticNonGoalFlags.noSignoff &&
        prompt.staticNonGoalFlags.noOwnerAssignment &&
        prompt.staticNonGoalFlags.noScoring &&
        prompt.staticNonGoalFlags.noCertification &&
        prompt.staticNonGoalFlags.noMeetingWorkflow,
    ),
  );
});

test("buildReviewObservationHandoffDebrief preserves cue-backed follow-up map order", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const dryRun = view.reviewObservationHandoffDryRun;
  const debrief = view.reviewObservationHandoffDebrief;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(dryRun);
  assert.ok(debrief);
  assert.deepEqual(
    debrief.followUpMapEntries.map((entry) => [
      entry.followUpOrder,
      entry.sourceCueId,
      entry.sourceCueIds,
      entry.sourceAnchorCoverageEntryId,
      entry.sourceAnchorCoverageEntryIds,
      entry.sourcePathStepId,
      entry.sourcePathStepIds,
      entry.sourceAnchorOrder,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.sourcePromptGroupId,
      entry.sourceCoverageRowId,
      entry.sourceCoverageRowIds,
      entry.sourceHandoffCardId,
      entry.sourceHandoffCardIds,
    ]),
    dryRun.cueAnchorCoverageEntries.map((entry, index) => [
      index + 1,
      entry.sourceCueId,
      [entry.sourceCueId],
      entry.cueAnchorCoverageEntryId,
      [entry.cueAnchorCoverageEntryId],
      entry.sourcePathStepId,
      entry.sourcePathStepIds,
      entry.sourceAnchorOrder,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.sourcePromptGroupId,
      entry.sourceCoverageRowId,
      [entry.sourceCoverageRowId],
      entry.sourceHandoffCardId,
      [entry.sourceHandoffCardId],
    ]),
  );
  assert.equal(
    debrief.summary.counts.debriefPromptCount,
    dryRun.cues.length,
  );
  assert.equal(
    debrief.summary.counts.followUpMapEntryCount,
    dryRun.cueAnchorCoverageEntries.length,
  );
  assert.ok(
    debrief.followUpMapEntries.every(
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
        entry.notOwnerAssigned &&
        entry.staticNonGoalFlags.noSavedDebriefNotes &&
        entry.staticNonGoalFlags.noSavedFollowUpProgress &&
        entry.staticNonGoalFlags.noSavedFollowUpOwnership,
    ),
  );

  for (const entry of debrief.followUpMapEntries) {
    assert.ok(entry.localAnchorHref.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${entry.anchorTargetId}"`),
      `${entry.anchorTargetId} should resolve to an existing mission-console section`,
    );
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-debrief"',
    ),
    "Mission console should expose a local Stage 44 debrief anchor",
  );
});
