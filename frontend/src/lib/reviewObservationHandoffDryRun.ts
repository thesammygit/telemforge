import type {
  ReviewObservationHandoffDryRunCueAnchorCoverageEntryView,
  ReviewObservationHandoffDryRunCueView,
  ReviewObservationHandoffDryRunStaticNonGoalFlagsView,
  ReviewObservationHandoffDryRunView,
  ReviewObservationHandoffPathAnchorMapEntryView,
  ReviewObservationHandoffPathStepView,
  ReviewObservationHandoffPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffDryRun(
  sourceObservationHandoffPath: ReviewObservationHandoffPathView | undefined,
): ReviewObservationHandoffDryRunView | undefined {
  if (!sourceObservationHandoffPath?.pathSteps.length) {
    return undefined;
  }

  const cues = sourceObservationHandoffPath.pathSteps.map((step, index) =>
    buildCue(step, index + 1),
  );
  const cueByPathStepId = new Map(
    cues.map((cue) => [cue.sourcePathStepId, cue]),
  );
  const cueAnchorCoverageEntries =
    sourceObservationHandoffPath.anchorMapEntries.map((entry, index) =>
      buildCueAnchorCoverageEntry(entry, index + 1, cueByPathStepId),
    );
  const defaultCue =
    cues.find(
      (cue) =>
        cue.sourcePathStepId ===
        sourceObservationHandoffPath.defaultPathStep.pathStepId,
    ) ?? cues[0];

  return {
    schema: "telemforge.review_observation_handoff_dry_run.v1",
    version: 1,
    contractLabel: "local deterministic observation handoff dry-run cue sheet",
    localStatus: sourceObservationHandoffPath.localStatus,
    summary: {
      dryRunId: "candidate-local-review-observation-handoff-dry-run",
      label: "Local observation handoff dry run",
      summary:
        "A static dry-run cue sheet derives manual rehearsal cues from the Stage 42 handoff path and in-page anchor map so reviewers can rehearse the conversation without saved rehearsal progress, route changes, meeting workflow, exports, signoff, scoring, certification, owner assignment, or command execution.",
      defaultCueId: defaultCue.cueId,
      defaultAnchorTargetId: sourceObservationHandoffPath.summary.defaultAnchorTargetId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffPath,
        cues,
        cueAnchorCoverageEntries,
      ),
    },
    defaultCue,
    cues,
    cueAnchorCoverageEntries,
    staticDryRunSummary:
      "Stage 43 dry-run cues and cue-to-anchor coverage entries are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save dry-run progress, rehearsal sessions, path progress, agenda progress, answers, selections, observations, notes, filters, routes, meetings, owners, signoff, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffPath,
  };
}

function buildCue(
  step: ReviewObservationHandoffPathStepView,
  cueNumber: number,
): ReviewObservationHandoffDryRunCueView {
  const cueId = buildCueId(step.pathStepId);

  return {
    cueId,
    cueNumber,
    label: step.label,
    summary: `${step.summary} This dry-run cue rehearses the manual handoff language for the same source path step without storing rehearsal progress or creating workflow actions.`,
    dryRunPrompt:
      `Rehearse ${step.label} with anchors ${joinLabels(
        step.anchorTargetIds,
      )}; cite ${step.relatedEvidenceStopIds.length} evidence callbacks, ${step.relatedGapDiscussionPointIds.length} gap discussion points, and ${step.relatedDeferredScopeReminderIds.length} deferred-scope reminders while avoiding saved rehearsal progress, route changes, owners, signoff, scoring, certification, exports, meetings, or command execution.`,
    sourcePathStepId: step.pathStepId,
    sourcePathStepIds: [step.pathStepId],
    sourceAgendaSectionId: step.sourceAgendaSectionId,
    sourceAgendaSectionIds: step.sourceAgendaSectionIds,
    sourcePromptGroupId: step.sourcePromptGroupId,
    sourcePromptGroupIds: step.sourcePromptGroupIds,
    sourceCoverageRowId: step.sourceCoverageRowId,
    sourceHandoffCardId: step.sourceHandoffCardId,
    sourceSummaryReference: step.sourceSummaryReference,
    sourceReferences: step.sourceReferences,
    localAnchorHrefs: step.localAnchorHrefs,
    anchorTargetIds: step.anchorTargetIds,
    evidenceCallbackIds: step.relatedEvidenceStopIds,
    gapDiscussionPointIds: step.relatedGapDiscussionPointIds,
    deferredScopeReminderIds: step.relatedDeferredScopeReminderIds,
    facilitationPromptIds: step.relatedFacilitationPromptIds,
    reviewQuestionIds: step.relatedReviewQuestionIds,
    evidencePromptIds: step.relatedEvidencePromptIds,
    gapPromptIds: step.relatedGapPromptIds,
    deferredScopePromptIds: step.relatedDeferredScopePromptIds,
    staticNonGoalContexts: step.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDryRunItemFlags(),
  };
}

function buildCueAnchorCoverageEntry(
  anchorEntry: ReviewObservationHandoffPathAnchorMapEntryView,
  coverageOrder: number,
  cueByPathStepId: Map<string, ReviewObservationHandoffDryRunCueView>,
): ReviewObservationHandoffDryRunCueAnchorCoverageEntryView {
  const cue = cueByPathStepId.get(anchorEntry.sourcePathStepId);

  return {
    cueAnchorCoverageEntryId: `review-observation-handoff-dry-run:coverage:${anchorEntry.anchorEntryId}`,
    coverageOrder,
    sourceCueId: cue?.cueId ?? buildCueId(anchorEntry.sourcePathStepId),
    sourcePathStepId: anchorEntry.sourcePathStepId,
    sourcePathStepIds: [anchorEntry.sourcePathStepId],
    sourceAnchorEntryId: anchorEntry.anchorEntryId,
    sourceAgendaSectionId: anchorEntry.sourceAgendaSectionId,
    sourceAgendaSectionIds: anchorEntry.sourceAgendaSectionIds,
    sourcePromptGroupId: anchorEntry.sourcePromptGroupId,
    sourceCoverageRowId: anchorEntry.sourceCoverageRowId,
    sourceHandoffCardId: anchorEntry.sourceHandoffCardId,
    sourceSummaryReference: anchorEntry.sourceSummaryReference,
    sourceAnchorOrder: anchorEntry.anchorOrder,
    localAnchorHref: anchorEntry.localAnchorHref,
    anchorTargetId: anchorEntry.anchorTargetId,
    label: `${anchorEntry.label} dry-run coverage`,
    summary: `Coverage entry ${coverageOrder} keeps ${anchorEntry.localAnchorHref} in the Stage 42 source anchor order for static dry-run rehearsal; it is in-page context only, not a route, saved selection, meeting workflow, checklist, task, ticket, export, signoff, score, certification, owner assignment, or command.`,
    evidenceCallbackIds: anchorEntry.relatedEvidenceStopIds,
    gapDiscussionPointIds: anchorEntry.relatedGapDiscussionPointIds,
    deferredScopeReminderIds: anchorEntry.relatedDeferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDryRunItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffPath: ReviewObservationHandoffPathView,
  cues: ReviewObservationHandoffDryRunCueView[],
  cueAnchorCoverageEntries: ReviewObservationHandoffDryRunCueAnchorCoverageEntryView[],
): ReviewObservationHandoffDryRunView["summary"]["counts"] {
  return {
    dryRunCueCount: cues.length,
    cueAnchorCoverageEntryCount: cueAnchorCoverageEntries.length,
    sourcePathStepCount: sourceObservationHandoffPath.pathSteps.length,
    sourceAnchorMapEntryCount:
      sourceObservationHandoffPath.anchorMapEntries.length,
    sourceAgendaSectionCount: new Set(
      cues.map((cue) => cue.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(cues.map((cue) => cue.sourcePromptGroupId))
      .size,
    sourceCoverageRowCount: new Set(cues.map((cue) => cue.sourceCoverageRowId))
      .size,
    sourceHandoffCardCount: new Set(cues.map((cue) => cue.sourceHandoffCardId))
      .size,
    localOnlyCueCount: cues.filter((cue) => cue.localOnly).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffDryRunStaticNonGoalFlagsView {
  return {
    noSavedDryRunProgress: true,
    noSavedRehearsalSessions: true,
    noSavedPathProgress: true,
    noSavedAgendaProgress: true,
    noSavedQuestionAnswers: true,
    noSavedSelections: true,
    noRouteChanges: true,
    noCommandExecution: true,
    noExports: true,
    noSignoff: true,
    noOwnerAssignment: true,
    noScoring: true,
    noCertification: true,
    noMeetingWorkflow: true,
  };
}

function staticDryRunItemFlags() {
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

function buildCueId(pathStepId: string): string {
  return `review-observation-handoff-dry-run:${pathStepId}`;
}

function joinLabels(labels: string[]): string {
  if (!labels.length) {
    return "no local anchors";
  }

  return labels.join(", ");
}
