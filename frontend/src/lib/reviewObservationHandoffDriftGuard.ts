import type {
  ReviewObservationHandoffContinuityCardView,
  ReviewObservationHandoffContinuityNextPassMapEntryView,
  ReviewObservationHandoffContinuityView,
  ReviewObservationHandoffDriftGuardRowView,
  ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView,
  ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView,
  ReviewObservationHandoffDriftGuardView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffDriftGuard(
  sourceObservationHandoffContinuity: ReviewObservationHandoffContinuityView | undefined,
): ReviewObservationHandoffDriftGuardView | undefined {
  if (!sourceObservationHandoffContinuity?.continuityCards.length) {
    return undefined;
  }

  const driftGuardRows =
    sourceObservationHandoffContinuity.continuityCards.map((card) =>
      buildDriftGuardRow(card),
    );
  const staticRegressionMapEntries =
    sourceObservationHandoffContinuity.nextPassMapEntries.map((entry) =>
      buildStaticRegressionMapEntry(entry),
    );
  const defaultDriftGuardRow =
    driftGuardRows.find(
      (row) =>
        row.sourceDebriefPromptId ===
        sourceObservationHandoffContinuity.summary.defaultDebriefPromptId,
    ) ?? driftGuardRows[0];

  return {
    schema: "telemforge.review_observation_handoff_drift_guard.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff drift guard and static regression map",
    localStatus: sourceObservationHandoffContinuity.localStatus,
    summary: {
      driftGuardId: "candidate-local-review-observation-handoff-drift-guard",
      label: "Local observation handoff drift guard",
      summary:
        "A static drift guard and regression map derive from the Stage 45 continuity cards and next-pass rows so reviewers can verify source identifiers, anchors, evidence callbacks, gap prompts, and deferred-scope reminders still line up before another manual review pass without saved drift state, saved reviewer progress, saved debrief notes, saved continuity progress, saved follow-up ownership, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultContinuityContext: {
        defaultContinuityCardId:
          sourceObservationHandoffContinuity.summary.defaultContinuityCardId,
        defaultDebriefPromptId:
          sourceObservationHandoffContinuity.summary.defaultDebriefPromptId,
        defaultCueId: sourceObservationHandoffContinuity.summary.defaultCueId,
        defaultAnchorTargetId:
          sourceObservationHandoffContinuity.summary.defaultAnchorTargetId,
        sourceContinuitySummary:
          sourceObservationHandoffContinuity.summary.summary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffContinuity,
        driftGuardRows,
        staticRegressionMapEntries,
      ),
    },
    defaultDriftGuardRow,
    driftGuardRows,
    staticRegressionMapEntries,
    staticDriftGuardSummary:
      "Stage 46 drift guard rows and static regression map entries are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffContinuity,
  };
}

function buildDriftGuardRow(
  card: ReviewObservationHandoffContinuityCardView,
): ReviewObservationHandoffDriftGuardRowView {
  return {
    driftGuardRowId: `review-observation-handoff-drift-guard:${card.continuityCardId}`,
    rowNumber: card.cardNumber,
    label: `${card.label} drift guard`,
    summary:
      `Drift guard row ${card.cardNumber} checks ${card.sourceDebriefPromptId}, ${card.sourceFollowUpMapEntryIds.length} follow-up map links, ${card.localAnchorHrefs.length} local anchors, ${card.evidenceCallbackIds.length} evidence callbacks, ${card.gapDiscussionPointIds.length} gap discussion points, and ${card.deferredScopeReminderIds.length} deferred-scope reminders against the Stage 45 continuity card without saving drift state, reviewer progress, debrief notes, continuity progress, follow-up ownership, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    guardPrompt:
      `Verify that ${card.continuityCardId} still points to ${card.sourceCueId}, ${card.sourcePathStepId}, ${card.sourceAgendaSectionId}, ${card.sourcePromptGroupId}, ${card.sourceCoverageRowId}, and ${card.sourceHandoffCardId}; keep the check static, local, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceCueId: card.sourceCueId,
    sourceCueIds: card.sourceCueIds,
    sourceDebriefPromptId: card.sourceDebriefPromptId,
    sourceDebriefPromptIds: card.sourceDebriefPromptIds,
    sourceFollowUpMapEntryIds: card.sourceFollowUpMapEntryIds,
    sourcePathStepId: card.sourcePathStepId,
    sourcePathStepIds: card.sourcePathStepIds,
    sourceAgendaSectionId: card.sourceAgendaSectionId,
    sourceAgendaSectionIds: card.sourceAgendaSectionIds,
    sourcePromptGroupId: card.sourcePromptGroupId,
    sourcePromptGroupIds: card.sourcePromptGroupIds,
    sourceCoverageRowId: card.sourceCoverageRowId,
    sourceCoverageRowIds: card.sourceCoverageRowIds,
    sourceHandoffCardId: card.sourceHandoffCardId,
    sourceHandoffCardIds: card.sourceHandoffCardIds,
    sourceSummaryReference: card.sourceSummaryReference,
    sourceReferences: card.sourceReferences,
    localAnchorHrefs: card.localAnchorHrefs,
    anchorTargetIds: card.anchorTargetIds,
    evidenceCallbackIds: card.evidenceCallbackIds,
    gapDiscussionPointIds: card.gapDiscussionPointIds,
    deferredScopeReminderIds: card.deferredScopeReminderIds,
    staticNonGoalContexts: card.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDriftGuardItemFlags(),
  };
}

function buildStaticRegressionMapEntry(
  entry: ReviewObservationHandoffContinuityNextPassMapEntryView,
): ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView {
  return {
    staticRegressionMapEntryId: `review-observation-handoff-drift-guard:regression:${entry.nextPassMapEntryId}`,
    regressionOrder: entry.nextPassOrder,
    sourceCueId: entry.sourceCueId,
    sourceCueIds: entry.sourceCueIds,
    sourceDebriefPromptId: entry.sourceDebriefPromptId,
    sourceDebriefPromptIds: entry.sourceDebriefPromptIds,
    sourceFollowUpMapEntryId: entry.sourceFollowUpMapEntryId,
    sourceFollowUpMapEntryIds: entry.sourceFollowUpMapEntryIds,
    sourceAnchorCoverageEntryId: entry.sourceAnchorCoverageEntryId,
    sourceAnchorCoverageEntryIds: entry.sourceAnchorCoverageEntryIds,
    sourcePathStepId: entry.sourcePathStepId,
    sourcePathStepIds: entry.sourcePathStepIds,
    sourceAnchorOrder: entry.sourceAnchorOrder,
    sourceAgendaSectionId: entry.sourceAgendaSectionId,
    sourceAgendaSectionIds: entry.sourceAgendaSectionIds,
    sourcePromptGroupId: entry.sourcePromptGroupId,
    sourcePromptGroupIds: entry.sourcePromptGroupIds,
    sourceCoverageRowId: entry.sourceCoverageRowId,
    sourceCoverageRowIds: entry.sourceCoverageRowIds,
    sourceHandoffCardId: entry.sourceHandoffCardId,
    sourceHandoffCardIds: entry.sourceHandoffCardIds,
    sourceSummaryReference: entry.sourceSummaryReference,
    localAnchorHref: entry.localAnchorHref,
    anchorTargetId: entry.anchorTargetId,
    label: `${entry.label} regression guard`,
    summary:
      `Static regression map entry ${entry.nextPassOrder} mirrors Stage 45 next-pass order for ${entry.localAnchorHref}, ${entry.sourceFollowUpMapEntryId}, ${entry.sourceAnchorCoverageEntryId}, and ${entry.sourceDebriefPromptId}; it is local drift review context only, not saved drift state, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: entry.evidenceCallbackIds,
    gapDiscussionPointIds: entry.gapDiscussionPointIds,
    deferredScopeReminderIds: entry.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticDriftGuardItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffContinuity: ReviewObservationHandoffContinuityView,
  driftGuardRows: ReviewObservationHandoffDriftGuardRowView[],
  staticRegressionMapEntries: ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView[],
): ReviewObservationHandoffDriftGuardView["summary"]["counts"] {
  return {
    driftGuardRowCount: driftGuardRows.length,
    staticRegressionMapEntryCount: staticRegressionMapEntries.length,
    sourceContinuityCardCount:
      sourceObservationHandoffContinuity.continuityCards.length,
    sourceNextPassMapEntryCount:
      sourceObservationHandoffContinuity.nextPassMapEntries.length,
    sourceCueCount: new Set(driftGuardRows.map((row) => row.sourceCueId)).size,
    sourceDebriefPromptCount: new Set(
      driftGuardRows.map((row) => row.sourceDebriefPromptId),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      staticRegressionMapEntries.map((entry) => entry.sourceFollowUpMapEntryId),
    ).size,
    sourcePathStepCount: new Set(
      driftGuardRows.map((row) => row.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      driftGuardRows.map((row) => row.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      driftGuardRows.map((row) => row.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      driftGuardRows.map((row) => row.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      driftGuardRows.map((row) => row.sourceHandoffCardId),
    ).size,
    localOnlyDriftGuardRowCount: driftGuardRows.filter((row) => row.localOnly)
      .length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView {
  return {
    noSavedDriftState: true,
    noSavedReviewSessions: true,
    noSavedReviewerProgress: true,
    noSavedDebriefNotes: true,
    noSavedContinuityProgress: true,
    noSavedFollowUpProgress: true,
    noSavedFollowUpOwnership: true,
    noSavedDryRunProgress: true,
    noSavedRehearsalSessions: true,
    noSavedPathProgress: true,
    noSavedAgendaProgress: true,
    noSavedQuestionAnswers: true,
    noSavedSelections: true,
    noPersistence: true,
    noLocalStorage: true,
    noRouteChanges: true,
    noCommandExecution: true,
    noExports: true,
    noSignoff: true,
    noAuditRetention: true,
    noOwnerAssignment: true,
    noScoring: true,
    noCertification: true,
    noMeetingWorkflow: true,
    noExternalTicketing: true,
    noReportAuthoring: true,
    noHandoffPackageGeneration: true,
    noTaskLaunchers: true,
    noRunnableChecklists: true,
  };
}

function staticDriftGuardItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
    staticOnly: true,
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
