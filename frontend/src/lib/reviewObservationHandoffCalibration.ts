import type {
  ReviewObservationHandoffCalibrationCardView,
  ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  ReviewObservationHandoffCalibrationStaticNonGoalFlagsView,
  ReviewObservationHandoffCalibrationView,
  ReviewObservationHandoffDriftGuardRowView,
  ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView,
  ReviewObservationHandoffDriftGuardView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffCalibration(
  sourceObservationHandoffDriftGuard: ReviewObservationHandoffDriftGuardView | undefined,
): ReviewObservationHandoffCalibrationView | undefined {
  if (!sourceObservationHandoffDriftGuard?.driftGuardRows.length) {
    return undefined;
  }

  const calibrationCards =
    sourceObservationHandoffDriftGuard.driftGuardRows.map((row) =>
      buildCalibrationCard(row),
    );
  const staticAlignmentNotes =
    sourceObservationHandoffDriftGuard.staticRegressionMapEntries.map((entry) =>
      buildStaticAlignmentNote(entry),
    );
  const defaultCalibrationCard =
    calibrationCards.find(
      (card) =>
        card.sourceDriftGuardRowId ===
        sourceObservationHandoffDriftGuard.defaultDriftGuardRow.driftGuardRowId,
    ) ?? calibrationCards[0];

  return {
    schema: "telemforge.review_observation_handoff_calibration.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff calibration board and static alignment notes",
    localStatus: sourceObservationHandoffDriftGuard.localStatus,
    summary: {
      calibrationId: "candidate-local-review-observation-handoff-calibration",
      label: "Local observation handoff calibration",
      summary:
        "A static calibration board and alignment note surface derive from the Stage 46 drift guard rows and regression map so reviewers can compare source identifiers, local anchors, evidence callbacks, gap prompts, and deferred-scope reminders before review without saved calibration notes, saved calibration state, saved drift state, reviewer progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultDriftGuardContext: {
        defaultDriftGuardRowId:
          sourceObservationHandoffDriftGuard.defaultDriftGuardRow
            .driftGuardRowId,
        defaultCueId:
          sourceObservationHandoffDriftGuard.summary.defaultContinuityContext
            .defaultCueId,
        defaultDebriefPromptId:
          sourceObservationHandoffDriftGuard.summary.defaultContinuityContext
            .defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceObservationHandoffDriftGuard.summary.defaultContinuityContext
            .defaultAnchorTargetId,
        sourceDriftGuardSummary:
          sourceObservationHandoffDriftGuard.summary.summary,
        sourceContinuitySummary:
          sourceObservationHandoffDriftGuard.summary.defaultContinuityContext
            .sourceContinuitySummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffDriftGuard,
        calibrationCards,
        staticAlignmentNotes,
      ),
    },
    defaultCalibrationCard,
    calibrationCards,
    staticAlignmentNotes,
    staticCalibrationSummary:
      "Stage 47 calibration cards and static alignment notes are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save calibration notes, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffDriftGuard,
  };
}

function buildCalibrationCard(
  row: ReviewObservationHandoffDriftGuardRowView,
): ReviewObservationHandoffCalibrationCardView {
  return {
    calibrationCardId: `review-observation-handoff-calibration:${row.driftGuardRowId}`,
    cardNumber: row.rowNumber,
    label: `${row.label} calibration`,
    summary:
      `Calibration card ${row.rowNumber} aligns ${row.sourceCueId}, ${row.sourceDebriefPromptId}, ${row.sourceFollowUpMapEntryIds.length} follow-up map links, ${row.anchorTargetIds.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion points, and ${row.deferredScopeReminderIds.length} deferred-scope reminders from ${row.driftGuardRowId} without saved calibration notes, saved calibration state, saved drift state, reviewer progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    calibrationPrompt:
      `Compare ${row.driftGuardRowId} against ${row.sourceCueId}, ${row.sourcePathStepId}, ${row.sourceAgendaSectionId}, ${row.sourcePromptGroupId}, ${row.sourceCoverageRowId}, and ${row.sourceHandoffCardId}; keep the calibration static, local, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceDriftGuardRowId: row.driftGuardRowId,
    sourceCueId: row.sourceCueId,
    sourceCueIds: row.sourceCueIds,
    sourceDebriefPromptId: row.sourceDebriefPromptId,
    sourceDebriefPromptIds: row.sourceDebriefPromptIds,
    sourceFollowUpMapEntryIds: row.sourceFollowUpMapEntryIds,
    sourcePathStepId: row.sourcePathStepId,
    sourcePathStepIds: row.sourcePathStepIds,
    sourceAgendaSectionId: row.sourceAgendaSectionId,
    sourceAgendaSectionIds: row.sourceAgendaSectionIds,
    sourcePromptGroupId: row.sourcePromptGroupId,
    sourcePromptGroupIds: row.sourcePromptGroupIds,
    sourceCoverageRowId: row.sourceCoverageRowId,
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceHandoffCardId: row.sourceHandoffCardId,
    sourceHandoffCardIds: row.sourceHandoffCardIds,
    sourceSummaryReference: row.sourceSummaryReference,
    sourceReferences: row.sourceReferences,
    localAnchorHrefs: row.localAnchorHrefs,
    anchorTargetIds: row.anchorTargetIds,
    evidenceCallbackIds: row.evidenceCallbackIds,
    gapDiscussionPointIds: row.gapDiscussionPointIds,
    deferredScopeReminderIds: row.deferredScopeReminderIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticCalibrationItemFlags(),
  };
}

function buildStaticAlignmentNote(
  entry: ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView,
): ReviewObservationHandoffCalibrationStaticAlignmentNoteView {
  return {
    staticAlignmentNoteId: `review-observation-handoff-calibration:alignment:${entry.staticRegressionMapEntryId}`,
    alignmentOrder: entry.regressionOrder,
    sourceStaticRegressionMapEntryId: entry.staticRegressionMapEntryId,
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
    label: `${entry.label} alignment note`,
    summary:
      `Static alignment note ${entry.regressionOrder} preserves Stage 46 regression order for ${entry.localAnchorHref}, ${entry.sourceFollowUpMapEntryId}, ${entry.sourceAnchorCoverageEntryId}, and ${entry.sourceDebriefPromptId}; it is local calibration context only, not saved calibration state, saved drift state, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: entry.evidenceCallbackIds,
    gapDiscussionPointIds: entry.gapDiscussionPointIds,
    deferredScopeReminderIds: entry.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticCalibrationItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffDriftGuard: ReviewObservationHandoffDriftGuardView,
  calibrationCards: ReviewObservationHandoffCalibrationCardView[],
  staticAlignmentNotes: ReviewObservationHandoffCalibrationStaticAlignmentNoteView[],
): ReviewObservationHandoffCalibrationView["summary"]["counts"] {
  return {
    calibrationCardCount: calibrationCards.length,
    staticAlignmentNoteCount: staticAlignmentNotes.length,
    sourceDriftGuardRowCount:
      sourceObservationHandoffDriftGuard.driftGuardRows.length,
    sourceStaticRegressionMapEntryCount:
      sourceObservationHandoffDriftGuard.staticRegressionMapEntries.length,
    sourceCueCount: new Set(calibrationCards.map((card) => card.sourceCueId))
      .size,
    sourceDebriefPromptCount: new Set(
      calibrationCards.map((card) => card.sourceDebriefPromptId),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      staticAlignmentNotes.map((note) => note.sourceFollowUpMapEntryId),
    ).size,
    sourcePathStepCount: new Set(
      calibrationCards.map((card) => card.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      calibrationCards.map((card) => card.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      calibrationCards.map((card) => card.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      calibrationCards.map((card) => card.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      calibrationCards.map((card) => card.sourceHandoffCardId),
    ).size,
    localOnlyCalibrationCardCount: calibrationCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffCalibrationStaticNonGoalFlagsView {
  return {
    noSavedCalibrationNotes: true,
    noSavedCalibrationState: true,
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

function staticCalibrationItemFlags() {
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
