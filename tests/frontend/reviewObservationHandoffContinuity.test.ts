import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffContinuity } from "../../frontend/src/lib/reviewObservationHandoffContinuity.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffContinuity derives ordered continuity cards from Stage 44 debrief prompts", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const debrief = view.reviewObservationHandoffDebrief;
  const continuity = buildReviewObservationHandoffContinuity(debrief);

  assert.ok(debrief);
  assert.ok(continuity);
  assert.equal(
    continuity.schema,
    "telemforge.review_observation_handoff_continuity.v1",
  );
  assert.equal(continuity.version, 1);
  assert.equal(
    continuity.contractLabel,
    "local deterministic observation handoff continuity snapshot and static next-pass map",
  );
  assert.equal(continuity.localStatus, "fixture");
  assert.strictEqual(continuity.sourceObservationHandoffDebrief, debrief);
  assert.equal(
    continuity.summary.defaultContinuityCardId,
    continuity.defaultContinuityCard.continuityCardId,
  );
  assert.equal(
    continuity.summary.defaultDebriefPromptId,
    debrief.defaultDebriefPrompt.debriefPromptId,
  );
  assert.equal(
    continuity.defaultContinuityCard.sourceDebriefPromptId,
    debrief.defaultDebriefPrompt.debriefPromptId,
  );
  assert.equal(continuity.summary.defaultCueId, debrief.summary.defaultCueId);
  assert.equal(
    continuity.summary.defaultAnchorTargetId,
    debrief.summary.defaultAnchorTargetId,
  );
  assert.deepEqual(
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
    debrief.debriefPrompts.map((prompt, index) => [
      index + 1,
      prompt.sourceCueId,
      prompt.sourceCueIds,
      prompt.debriefPromptId,
      [prompt.debriefPromptId],
      debrief.followUpMapEntries
        .filter((entry) => entry.sourceCueId === prompt.sourceCueId)
        .map((entry) => entry.followUpMapEntryId),
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
  );
  assert.equal(
    continuity.summary.counts.continuityCardCount,
    debrief.debriefPrompts.length,
  );
  assert.equal(
    continuity.summary.counts.nextPassMapEntryCount,
    debrief.followUpMapEntries.length,
  );
  assert.ok(
    continuity.continuityCards.every(
      (card) =>
        card.localOnly &&
        card.sourceBacked &&
        card.inPageOnly &&
        card.explanatoryOnly &&
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
        card.staticNonGoalFlags.noSavedDebriefNotes &&
        card.staticNonGoalFlags.noSavedReviewerProgress &&
        card.staticNonGoalFlags.noSavedContinuityProgress &&
        card.staticNonGoalFlags.noSavedFollowUpProgress &&
        card.staticNonGoalFlags.noSavedFollowUpOwnership &&
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
});

test("buildReviewObservationHandoffContinuity preserves Stage 44 follow-up order for static next-pass rows", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const debrief = view.reviewObservationHandoffDebrief;
  const continuity = view.reviewObservationHandoffContinuity;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(debrief);
  assert.ok(continuity);
  assert.deepEqual(
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
    debrief.followUpMapEntries.map((entry, index) => [
      index + 1,
      entry.sourceCueId,
      entry.sourceCueIds,
      debrief.debriefPrompts.find(
        (prompt) => prompt.sourceCueId === entry.sourceCueId,
      )?.debriefPromptId,
      [
        debrief.debriefPrompts.find(
          (prompt) => prompt.sourceCueId === entry.sourceCueId,
        )?.debriefPromptId,
      ],
      entry.followUpMapEntryId,
      [entry.followUpMapEntryId],
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
    continuity.nextPassMapEntries.every(
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
        entry.staticNonGoalFlags.noSavedReviewerProgress &&
        entry.staticNonGoalFlags.noSavedContinuityProgress &&
        entry.staticNonGoalFlags.noSavedFollowUpProgress &&
        entry.staticNonGoalFlags.noSavedFollowUpOwnership,
    ),
  );

  for (const entry of continuity.nextPassMapEntries) {
    assert.ok(entry.localAnchorHref.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${entry.anchorTargetId}"`),
      `${entry.anchorTargetId} should resolve to an existing mission-console section`,
    );
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-continuity"',
    ),
    "Mission console should expose a local Stage 45 continuity anchor",
  );
});
