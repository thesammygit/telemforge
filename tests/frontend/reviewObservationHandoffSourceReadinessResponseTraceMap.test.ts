import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffSourceReadinessResponseTraceMap } from "../../frontend/src/lib/reviewObservationHandoffSourceReadinessResponseTraceMap.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffSourceReadinessResponseTraceMap derives ordered trace rows from Stage 57 walkthrough steps", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseWalkthrough =
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough;
  const responseTraceMap =
    buildReviewObservationHandoffSourceReadinessResponseTraceMap(
      responseWalkthrough,
    );
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(responseWalkthrough);
  assert.ok(responseTraceMap);
  assert.equal(
    responseTraceMap.schema,
    "telemforge.review_observation_handoff_source_readiness_response_trace_map.v1",
  );
  assert.equal(responseTraceMap.version, 1);
  assert.equal(
    responseTraceMap.contractLabel,
    "local deterministic observation handoff source readiness response trace map and static source alignment notes",
  );
  assert.equal(responseTraceMap.localStatus, "fixture");
  assert.strictEqual(
    responseTraceMap.sourceReviewObservationHandoffSourceReadinessResponseWalkthrough,
    responseWalkthrough,
  );
  assert.deepEqual(responseTraceMap.summary.defaultResponseTraceContext, {
    defaultTraceRowId:
      responseTraceMap.defaultTraceRow.sourceReadinessResponseTraceRowId,
    defaultWalkthroughStepId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultWalkthroughStepId,
    defaultResponseRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultResponseRowId,
    defaultQuestionRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultQuestionRowId,
    defaultRehearsalPromptRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultRehearsalPromptRowId,
    defaultSourceReadinessRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultSourceReadinessRowId,
    defaultSourceReadoutRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultSourceReadoutRowId,
    defaultSourceWalkthroughSectionId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultSourceWalkthroughSectionId,
    defaultSourceCrosswalkRowId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultSourceCrosswalkRowId,
    defaultRelayStepId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultRelayStepId,
    defaultAnchorTargetId:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .defaultAnchorTargetId,
    sourceReadinessResponseWalkthroughSummary:
      responseWalkthrough.summary.summary,
    sourceReadinessResponseMatrixSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceReadinessResponseMatrixSummary,
    sourceReadinessQuestionBoardSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceReadinessQuestionBoardSummary,
    sourceReadinessRehearsalSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceReadinessRehearsalSummary,
    sourceReadinessSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceReadinessSummary,
    sourceReadoutSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceReadoutSummary,
    sourceWalkthroughSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceWalkthroughSummary,
    sourceCrosswalkSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceCrosswalkSummary,
    sourceRelayTrailSummary:
      responseWalkthrough.summary.defaultResponseWalkthroughContext
        .sourceRelayTrailSummary,
  });
  assert.deepEqual(
    responseTraceMap.responseTraceRows.map((row) => [
      row.traceOrder,
      row.sourceReadinessResponseWalkthroughStepId,
      row.sourceReadinessResponseWalkthroughStepIds,
      row.sourceReadinessResponseRowId,
      row.sourceReadinessResponseRowIds,
      row.sourceReadinessQuestionRowId,
      row.sourceReadinessQuestionRowIds,
      row.matchedStaticEvidenceNoteRowIds,
      row.matchedStaticFollowUpPromptRowIds,
      row.sourceReadinessRehearsalPromptRowId,
      row.sourceReadinessRehearsalPromptRowIds,
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
      row.responseNoteCue,
      row.reviewerCueText,
      row.staticReviewCueIds,
      row.staticNonGoalContexts.length,
    ]),
    responseWalkthrough.walkthroughSteps.map((step) => [
      step.stepOrder,
      step.sourceReadinessResponseWalkthroughStepId,
      [step.sourceReadinessResponseWalkthroughStepId],
      step.sourceReadinessResponseRowId,
      step.sourceReadinessResponseRowIds,
      step.sourceReadinessQuestionRowId,
      step.sourceReadinessQuestionRowIds,
      step.matchedStaticEvidenceNoteRowIds,
      step.matchedStaticFollowUpPromptRowIds,
      step.sourceReadinessRehearsalPromptRowId,
      step.sourceReadinessRehearsalPromptRowIds,
      step.sourceReadinessRowId,
      step.sourceReadinessRowIds,
      step.sourceReadoutRowId,
      step.sourceReadoutRowIds,
      step.sourceWalkthroughSectionId,
      step.sourceWalkthroughSectionIds,
      step.sourceCrosswalkRowId,
      step.sourceCrosswalkRowIds,
      step.sourceRelayStepId,
      step.sourceRelayStepIds,
      step.sourceInspectionReferenceIds,
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.evidenceCallbackIds,
      step.gapDiscussionPointIds,
      step.deferredScopeReminderIds,
      step.responseNoteCue,
      step.staticReviewerCueText,
      step.staticReviewCueIds,
      step.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    responseTraceMap.responseTraceRows.every(
      (row) =>
        row.sourceAlignmentNoteText.includes(
          row.sourceReadinessResponseWalkthroughStepId,
        ) &&
        row.sourceAlignmentNoteText.includes(row.sourceReadinessResponseRowId) &&
        row.sourceAlignmentNoteText.includes(row.sourceReadinessQuestionRowId) &&
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
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceProgress &&
        row.staticNonGoalFlags.noSavedTraceProgress &&
        row.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedWalkthroughProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessResponseProgress &&
        row.staticNonGoalFlags.noSavedReviewerAnswers &&
        row.staticNonGoalFlags.noSavedSourceReadinessQuestionProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessRehearsalProgress &&
        row.staticNonGoalFlags.noSavedSourceReadinessProgress &&
        row.staticNonGoalFlags.noSavedSourceReadoutProgress &&
        row.staticNonGoalFlags.noSavedSourceWalkthroughProgress &&
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

  for (const row of responseTraceMap.responseTraceRows) {
    for (const targetId of row.anchorTargetIds) {
      assert.ok(
        missionConsoleSource.includes(`id="${targetId}"`),
        `${targetId} should resolve to an existing mission-console section`,
      );
    }
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-source-readiness-response-trace-map"',
    ),
    "Mission console should expose a local Stage 58 response trace map anchor",
  );
});

test("buildReviewObservationHandoffSourceReadinessResponseTraceMap preserves Stage 57 cue-card order for source alignment notes", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const responseWalkthrough =
    view.reviewObservationHandoffSourceReadinessResponseWalkthrough;
  const responseTraceMap =
    buildReviewObservationHandoffSourceReadinessResponseTraceMap(
      responseWalkthrough,
    );

  assert.ok(responseWalkthrough);
  assert.ok(responseTraceMap);
  assert.deepEqual(
    responseTraceMap.staticSourceAlignmentNoteCards.map((card) => [
      card.noteOrder,
      card.sourceReadinessResponseWalkthroughStaticCueCardId,
      card.sourceReadinessResponseWalkthroughStaticCueCardIds,
      card.sourceReadinessStaticEvidenceNoteRowId,
      card.sourceReadinessStaticEvidenceNoteRowIds,
      card.sourceReadinessStaticFollowUpPromptRowId,
      card.sourceReadinessStaticFollowUpPromptRowIds,
      card.matchedResponseRowIds,
      card.matchedQuestionRowIds,
      card.matchedSourceFollowUpPromptRowIds,
      card.sourceLocalAnchorHrefs,
      card.sourceAnchorTargetIds,
      card.localAnchorHref,
      card.anchorTargetId,
      card.evidenceCallbackIds,
      card.gapDiscussionPointIds,
      card.deferredScopeReminderIds,
      card.responseNoteCue,
      card.cueText,
    ]),
    responseWalkthrough.staticReviewerCueCards.map((cueCard) => [
      cueCard.cueOrder,
      cueCard.sourceReadinessResponseWalkthroughStaticCueCardId,
      [cueCard.sourceReadinessResponseWalkthroughStaticCueCardId],
      cueCard.sourceReadinessStaticEvidenceNoteRowId,
      cueCard.sourceReadinessStaticEvidenceNoteRowIds,
      cueCard.sourceReadinessStaticFollowUpPromptRowId,
      cueCard.sourceReadinessStaticFollowUpPromptRowIds,
      cueCard.matchedResponseRowIds,
      cueCard.matchedQuestionRowIds,
      cueCard.matchedSourceFollowUpPromptRowIds,
      cueCard.sourceLocalAnchorHrefs,
      cueCard.sourceAnchorTargetIds,
      cueCard.localAnchorHref,
      cueCard.anchorTargetId,
      cueCard.evidenceCallbackIds,
      cueCard.gapDiscussionPointIds,
      cueCard.deferredScopeReminderIds,
      cueCard.responseNoteCue,
      cueCard.cueText,
    ]),
  );
  assert.ok(
    responseTraceMap.staticSourceAlignmentNoteCards.every(
      (card) =>
        card.alignmentNoteText.includes(
          card.sourceReadinessResponseWalkthroughStaticCueCardId,
        ) &&
        card.alignmentNoteText.includes(
          card.sourceReadinessStaticEvidenceNoteRowId,
        ) &&
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
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseTraceProgress &&
        card.staticNonGoalFlags.noSavedTraceProgress &&
        card.staticNonGoalFlags
          .noSavedSourceReadinessResponseWalkthroughProgress,
    ),
  );
  assert.equal(
    responseTraceMap.summary.counts.responseTraceRowCount,
    responseWalkthrough.walkthroughSteps.length,
  );
  assert.equal(
    responseTraceMap.summary.counts.staticSourceAlignmentNoteCardCount,
    responseWalkthrough.staticReviewerCueCards.length,
  );
  assert.equal(
    responseTraceMap.summary.counts.responseWalkthroughStepCount,
    responseWalkthrough.walkthroughSteps.length,
  );
  assert.equal(
    responseTraceMap.summary.counts.staticReviewerCueCardCount,
    responseWalkthrough.staticReviewerCueCards.length,
  );
});
