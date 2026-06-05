import type {
  ReviewObservationHandoffDebriefFollowUpMapEntryView,
  ReviewObservationHandoffDebriefPromptView,
  ReviewObservationHandoffDebriefStaticNonGoalFlagsView,
  ReviewObservationHandoffDebriefView,
  ReviewObservationHandoffDryRunCueAnchorCoverageEntryView,
  ReviewObservationHandoffDryRunCueView,
  ReviewObservationHandoffDryRunView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffDebrief(
  sourceObservationHandoffDryRun: ReviewObservationHandoffDryRunView | undefined,
): ReviewObservationHandoffDebriefView | undefined {
  if (!sourceObservationHandoffDryRun?.cues.length) {
    return undefined;
  }

  const debriefPrompts = sourceObservationHandoffDryRun.cues.map((cue, index) =>
    buildDebriefPrompt(cue, index + 1),
  );
  const promptByCueId = new Map(
    debriefPrompts.map((prompt) => [prompt.sourceCueId, prompt]),
  );
  const followUpMapEntries =
    sourceObservationHandoffDryRun.cueAnchorCoverageEntries.map(
      (entry, index) => buildFollowUpMapEntry(entry, index + 1, promptByCueId),
    );
  const defaultDebriefPrompt =
    debriefPrompts.find(
      (prompt) =>
        prompt.sourceCueId === sourceObservationHandoffDryRun.defaultCue.cueId,
    ) ?? debriefPrompts[0];

  return {
    schema: "telemforge.review_observation_handoff_debrief.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff debrief and static follow-up map",
    localStatus: sourceObservationHandoffDryRun.localStatus,
    summary: {
      debriefId: "candidate-local-review-observation-handoff-debrief",
      label: "Local observation handoff debrief",
      summary:
        "A static debrief prompt set and cue-backed follow-up map derive from the Stage 43 dry-run cue sheet so reviewers can inspect what the rehearsal would leave behind without saving debrief notes, assigning follow-up ownership, changing routes, exporting packages, scoring, certifying, meeting workflow, or command execution.",
      defaultDebriefPromptId: defaultDebriefPrompt.debriefPromptId,
      defaultCueId: sourceObservationHandoffDryRun.defaultCue.cueId,
      defaultAnchorTargetId:
        sourceObservationHandoffDryRun.summary.defaultAnchorTargetId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffDryRun,
        debriefPrompts,
        followUpMapEntries,
      ),
    },
    defaultDebriefPrompt,
    debriefPrompts,
    followUpMapEntries,
    staticDebriefSummary:
      "Stage 44 debrief prompts and follow-up map entries are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save debrief notes, follow-up progress, follow-up ownership, rehearsal progress, dry-run progress, path progress, agenda progress, answers, selections, observations, notes, filters, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffDryRun,
  };
}

function buildDebriefPrompt(
  cue: ReviewObservationHandoffDryRunCueView,
  promptNumber: number,
): ReviewObservationHandoffDebriefPromptView {
  return {
    debriefPromptId: buildDebriefPromptId(cue.cueId),
    promptNumber,
    label: cue.label,
    summary: `${cue.summary} This debrief prompt captures the static follow-up inspection context for the same source cue without saving notes, owners, progress, signoff, scores, exports, meetings, or commands.`,
    debriefPrompt:
      `Debrief ${cue.label} from ${cue.cueId}; confirm ${cue.anchorTargetIds.length} local anchors, ${cue.evidenceCallbackIds.length} evidence callbacks, ${cue.gapDiscussionPointIds.length} gap discussion points, and ${cue.deferredScopeReminderIds.length} deferred-scope reminders while keeping follow-up context static, in-page, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceCueId: cue.cueId,
    sourceCueIds: [cue.cueId],
    sourcePathStepId: cue.sourcePathStepId,
    sourcePathStepIds: cue.sourcePathStepIds,
    sourceAgendaSectionId: cue.sourceAgendaSectionId,
    sourceAgendaSectionIds: cue.sourceAgendaSectionIds,
    sourcePromptGroupId: cue.sourcePromptGroupId,
    sourcePromptGroupIds: cue.sourcePromptGroupIds,
    sourceCoverageRowId: cue.sourceCoverageRowId,
    sourceCoverageRowIds: [cue.sourceCoverageRowId],
    sourceHandoffCardId: cue.sourceHandoffCardId,
    sourceHandoffCardIds: [cue.sourceHandoffCardId],
    sourceSummaryReference: cue.sourceSummaryReference,
    sourceReferences: cue.sourceReferences,
    localAnchorHrefs: cue.localAnchorHrefs,
    anchorTargetIds: cue.anchorTargetIds,
    evidenceCallbackIds: cue.evidenceCallbackIds,
    gapDiscussionPointIds: cue.gapDiscussionPointIds,
    deferredScopeReminderIds: cue.deferredScopeReminderIds,
    facilitationPromptIds: cue.facilitationPromptIds,
    reviewQuestionIds: cue.reviewQuestionIds,
    evidencePromptIds: cue.evidencePromptIds,
    gapPromptIds: cue.gapPromptIds,
    deferredScopePromptIds: cue.deferredScopePromptIds,
    staticNonGoalContexts: cue.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDebriefItemFlags(),
  };
}

function buildFollowUpMapEntry(
  coverageEntry: ReviewObservationHandoffDryRunCueAnchorCoverageEntryView,
  followUpOrder: number,
  promptByCueId: Map<string, ReviewObservationHandoffDebriefPromptView>,
): ReviewObservationHandoffDebriefFollowUpMapEntryView {
  const prompt = promptByCueId.get(coverageEntry.sourceCueId);

  return {
    followUpMapEntryId: `review-observation-handoff-debrief:follow-up:${coverageEntry.cueAnchorCoverageEntryId}`,
    followUpOrder,
    sourceCueId: coverageEntry.sourceCueId,
    sourceCueIds: [coverageEntry.sourceCueId],
    sourceAnchorCoverageEntryId: coverageEntry.cueAnchorCoverageEntryId,
    sourceAnchorCoverageEntryIds: [coverageEntry.cueAnchorCoverageEntryId],
    sourcePathStepId: coverageEntry.sourcePathStepId,
    sourcePathStepIds: coverageEntry.sourcePathStepIds,
    sourceAnchorOrder: coverageEntry.sourceAnchorOrder,
    sourceAgendaSectionId: coverageEntry.sourceAgendaSectionId,
    sourceAgendaSectionIds: coverageEntry.sourceAgendaSectionIds,
    sourcePromptGroupId: coverageEntry.sourcePromptGroupId,
    sourceCoverageRowId: coverageEntry.sourceCoverageRowId,
    sourceCoverageRowIds: [coverageEntry.sourceCoverageRowId],
    sourceHandoffCardId: coverageEntry.sourceHandoffCardId,
    sourceHandoffCardIds: [coverageEntry.sourceHandoffCardId],
    sourceSummaryReference: coverageEntry.sourceSummaryReference,
    localAnchorHref: coverageEntry.localAnchorHref,
    anchorTargetId: coverageEntry.anchorTargetId,
    label: `${coverageEntry.label} follow-up map`,
    summary:
      `Follow-up map entry ${followUpOrder} keeps ${coverageEntry.localAnchorHref} in Stage 43 cue coverage order for ${prompt?.label ?? coverageEntry.sourceCueId}; it is static inspection context only, not a saved note, owner assignment, ticket, task, checklist, route, report, handoff package, signoff, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: coverageEntry.evidenceCallbackIds,
    gapDiscussionPointIds: coverageEntry.gapDiscussionPointIds,
    deferredScopeReminderIds: coverageEntry.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDebriefItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffDryRun: ReviewObservationHandoffDryRunView,
  debriefPrompts: ReviewObservationHandoffDebriefPromptView[],
  followUpMapEntries: ReviewObservationHandoffDebriefFollowUpMapEntryView[],
): ReviewObservationHandoffDebriefView["summary"]["counts"] {
  return {
    debriefPromptCount: debriefPrompts.length,
    followUpMapEntryCount: followUpMapEntries.length,
    sourceCueCount: sourceObservationHandoffDryRun.cues.length,
    sourceCueAnchorCoverageEntryCount:
      sourceObservationHandoffDryRun.cueAnchorCoverageEntries.length,
    sourcePathStepCount: new Set(
      debriefPrompts.map((prompt) => prompt.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      debriefPrompts.map((prompt) => prompt.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      debriefPrompts.map((prompt) => prompt.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      debriefPrompts.map((prompt) => prompt.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      debriefPrompts.map((prompt) => prompt.sourceHandoffCardId),
    ).size,
    localOnlyDebriefPromptCount: debriefPrompts.filter(
      (prompt) => prompt.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffDebriefStaticNonGoalFlagsView {
  return {
    noSavedDebriefNotes: true,
    noSavedFollowUpProgress: true,
    noSavedFollowUpOwnership: true,
    noSavedDryRunProgress: true,
    noSavedRehearsalSessions: true,
    noSavedPathProgress: true,
    noSavedAgendaProgress: true,
    noSavedQuestionAnswers: true,
    noSavedSelections: true,
    noPersistence: true,
    noRouteChanges: true,
    noCommandExecution: true,
    noExports: true,
    noSignoff: true,
    noOwnerAssignment: true,
    noScoring: true,
    noCertification: true,
    noMeetingWorkflow: true,
    noExternalTicketing: true,
    noHandoffPackageGeneration: true,
  };
}

function staticDebriefItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonRouting: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  } as const;
}

function buildDebriefPromptId(cueId: string): string {
  return `review-observation-handoff-debrief:${cueId}`;
}
