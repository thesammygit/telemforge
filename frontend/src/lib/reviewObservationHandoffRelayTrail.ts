import type {
  ReviewObservationHandoffRelayTrailSourceInspectionReferenceView,
  ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  ReviewObservationHandoffRelayTrailStaticNonGoalFlagsView,
  ReviewObservationHandoffRelayTrailStepView,
  ReviewObservationHandoffRelayTrailView,
  ReviewObservationHandoffSynthesisRowView,
  ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  ReviewObservationHandoffSynthesisView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffRelayTrail(
  sourceObservationHandoffSynthesis:
    | ReviewObservationHandoffSynthesisView
    | undefined,
): ReviewObservationHandoffRelayTrailView | undefined {
  if (!sourceObservationHandoffSynthesis?.synthesisRows.length) {
    return undefined;
  }

  const relaySteps = sourceObservationHandoffSynthesis.synthesisRows.map((row) =>
    buildRelayStep(row),
  );
  const staticInspectionNotes =
    sourceObservationHandoffSynthesis.staticRelayNotes.map((note) =>
      buildStaticInspectionNote(
        note,
        sourceObservationHandoffSynthesis.synthesisRows,
      ),
    );
  const defaultRelayStep =
    relaySteps.find(
      (step) =>
        step.sourceSynthesisRowId ===
        sourceObservationHandoffSynthesis.defaultSynthesisRow.synthesisRowId,
    ) ?? relaySteps[0];

  return {
    schema: "telemforge.review_observation_handoff_relay_trail.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff relay trail and static inspection notes",
    localStatus: sourceObservationHandoffSynthesis.localStatus,
    summary: {
      relayTrailId:
        "candidate-local-review-observation-handoff-relay-trail",
      label: "Local observation handoff relay trail",
      summary:
        "A static relay trail and inspection-note surface derive from the Stage 48 synthesis rows and static relay notes so reviewers can walk relay threads in order, inspect source-backed local anchors, and check evidence callbacks, gap discussion points, and deferred-scope reminders without saved reviewer notes, saved relay progress, saved inspection state, saved synthesis state, saved calibration state, saved drift state, reviewer progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultSynthesisContext: {
        defaultSynthesisRowId:
          sourceObservationHandoffSynthesis.defaultSynthesisRow.synthesisRowId,
        defaultCalibrationCardId:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .defaultCalibrationCardId,
        defaultDriftGuardRowId:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .defaultDriftGuardRowId,
        defaultCueId:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .defaultCueId,
        defaultDebriefPromptId:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .defaultAnchorTargetId,
        sourceSynthesisSummary: sourceObservationHandoffSynthesis.summary.summary,
        sourceCalibrationSummary:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceObservationHandoffSynthesis.summary.defaultCalibrationContext
            .sourceDriftGuardSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffSynthesis,
        relaySteps,
        staticInspectionNotes,
      ),
    },
    defaultRelayStep,
    relaySteps,
    staticInspectionNotes,
    staticRelayTrailSummary:
      "Stage 49 relay trail steps and static inspection notes are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, relay progress, inspection state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffSynthesis,
  };
}

function buildRelayStep(
  row: ReviewObservationHandoffSynthesisRowView,
): ReviewObservationHandoffRelayTrailStepView {
  return {
    relayStepId: `review-observation-handoff-relay-trail:${row.synthesisRowId}`,
    stepNumber: row.rowNumber,
    label: `${row.label} relay step`,
    summary:
      `Relay step ${row.rowNumber} preserves Stage 48 synthesis row order for ${row.synthesisRowId}, ${row.sourceCalibrationCardId}, ${row.sourceAlignmentNoteIds.length} static relay-note anchors, ${row.sourceReferences.length} source references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion points, and ${row.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer notes, saved relay progress, saved inspection state, saved synthesis state, saved calibration state, saved drift state, reviewer progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    inspectionNote:
      `Inspect ${row.synthesisRowId} as a static relay thread for ${row.sourceCueId}, ${row.sourceDebriefPromptId}, ${row.sourcePathStepId}, ${row.sourceAgendaSectionId}, ${row.sourcePromptGroupId}, ${row.sourceCoverageRowId}, and ${row.sourceHandoffCardId}; keep the relay trail local, explanatory, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceSynthesisRowId: row.synthesisRowId,
    sourceSynthesisRowIds: [row.synthesisRowId],
    sourceCalibrationCardId: row.sourceCalibrationCardId,
    sourceCalibrationCardIds: row.sourceCalibrationCardIds,
    sourceAlignmentNoteIds: row.sourceAlignmentNoteIds,
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
    sourceInspectionReferences: buildRelayStepInspectionReferences(row),
    localAnchorHrefs: row.localAnchorHrefs,
    anchorTargetIds: row.anchorTargetIds,
    evidenceCallbackIds: row.evidenceCallbackIds,
    gapDiscussionPointIds: row.gapDiscussionPointIds,
    deferredScopeReminderIds: row.deferredScopeReminderIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticRelayTrailItemFlags(),
  };
}

function buildStaticInspectionNote(
  note: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  synthesisRows: ReviewObservationHandoffSynthesisRowView[],
): ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView {
  const matchedSourceSynthesisRowIds = synthesisRows
    .filter((row) => relayNoteMatchesSynthesisRow(note, row))
    .map((row) => row.synthesisRowId);

  return {
    staticInspectionNoteEntryId: `review-observation-handoff-relay-trail:inspection:${note.staticRelayNoteEntryId}`,
    inspectionOrder: note.relayOrder,
    sourceRelayNoteId: note.staticRelayNoteEntryId,
    sourceRelayNoteIds: [note.staticRelayNoteEntryId],
    sourceAlignmentNoteId: note.sourceAlignmentNoteId,
    sourceAlignmentNoteIds: note.sourceAlignmentNoteIds,
    matchedSourceSynthesisRowIds,
    sourceCalibrationCardIds: note.sourceCalibrationCardIds,
    sourceCueId: note.sourceCueId,
    sourceCueIds: note.sourceCueIds,
    sourceDebriefPromptId: note.sourceDebriefPromptId,
    sourceDebriefPromptIds: note.sourceDebriefPromptIds,
    sourceFollowUpMapEntryId: note.sourceFollowUpMapEntryId,
    sourceFollowUpMapEntryIds: note.sourceFollowUpMapEntryIds,
    sourceAnchorCoverageEntryId: note.sourceAnchorCoverageEntryId,
    sourceAnchorCoverageEntryIds: note.sourceAnchorCoverageEntryIds,
    sourcePathStepId: note.sourcePathStepId,
    sourcePathStepIds: note.sourcePathStepIds,
    sourceAnchorOrder: note.sourceAnchorOrder,
    sourceAnchorTargetIds: [note.anchorTargetId],
    sourceAgendaSectionId: note.sourceAgendaSectionId,
    sourceAgendaSectionIds: note.sourceAgendaSectionIds,
    sourcePromptGroupId: note.sourcePromptGroupId,
    sourcePromptGroupIds: note.sourcePromptGroupIds,
    sourceCoverageRowId: note.sourceCoverageRowId,
    sourceCoverageRowIds: note.sourceCoverageRowIds,
    sourceHandoffCardId: note.sourceHandoffCardId,
    sourceHandoffCardIds: note.sourceHandoffCardIds,
    sourceSummaryReference: note.sourceSummaryReference,
    sourceInspectionReferences: buildStaticInspectionReferences(
      note,
      matchedSourceSynthesisRowIds,
    ),
    localAnchorHref: note.localAnchorHref,
    anchorTargetId: note.anchorTargetId,
    label: `${note.label} inspection note`,
    summary:
      `Static inspection note ${note.relayOrder} preserves Stage 48 relay-note order for ${note.staticRelayNoteEntryId}, ${note.sourceAlignmentNoteId}, ${matchedSourceSynthesisRowIds.length} matched synthesis rows, ${note.localAnchorHref}, ${note.sourceFollowUpMapEntryId}, ${note.sourceDebriefPromptId}, and ${note.sourcePathStepId}; it is local inspection context only, not saved reviewer notes, saved relay progress, saved inspection state, saved synthesis state, saved calibration state, saved drift state, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: note.evidenceCallbackIds,
    gapDiscussionPointIds: note.gapDiscussionPointIds,
    deferredScopeReminderIds: note.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticRelayTrailItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffSynthesis: ReviewObservationHandoffSynthesisView,
  relaySteps: ReviewObservationHandoffRelayTrailStepView[],
  staticInspectionNotes: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView[],
): ReviewObservationHandoffRelayTrailView["summary"]["counts"] {
  return {
    relayStepCount: relaySteps.length,
    staticInspectionNoteCount: staticInspectionNotes.length,
    sourceSynthesisRowCount:
      sourceObservationHandoffSynthesis.synthesisRows.length,
    sourceStaticRelayNoteCount:
      sourceObservationHandoffSynthesis.staticRelayNotes.length,
    sourceCalibrationCardCount:
      sourceObservationHandoffSynthesis.summary.counts
        .sourceCalibrationCardCount,
    sourceAlignmentNoteCount:
      sourceObservationHandoffSynthesis.summary.counts
        .sourceAlignmentNoteCount,
    sourceCueCount: new Set(relaySteps.map((step) => step.sourceCueId)).size,
    sourceDebriefPromptCount: new Set(
      relaySteps.map((step) => step.sourceDebriefPromptId),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      staticInspectionNotes.map((note) => note.sourceFollowUpMapEntryId),
    ).size,
    sourcePathStepCount: new Set(
      relaySteps.map((step) => step.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      relaySteps.map((step) => step.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      relaySteps.map((step) => step.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      relaySteps.map((step) => step.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      relaySteps.map((step) => step.sourceHandoffCardId),
    ).size,
    localOnlyRelayStepCount: relaySteps.filter((step) => step.localOnly).length,
  };
}

function buildRelayStepInspectionReferences(
  row: ReviewObservationHandoffSynthesisRowView,
): ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[] {
  return uniqueInspectionReferences([
    {
      referenceId: `${row.synthesisRowId}:synthesis-row`,
      sourceKind: "synthesis_row",
      sourceId: row.synthesisRowId,
      label: row.label,
      localAnchorHref: row.localAnchorHrefs[0],
      anchorTargetId: row.anchorTargetIds[0],
    },
    ...row.sourceCrosswalkReferences.map((reference) => ({
      referenceId: `${row.synthesisRowId}:${reference.referenceId}`,
      sourceKind: reference.sourceKind,
      sourceId: reference.sourceId,
      label: reference.label,
      localAnchorHref: reference.localAnchorHref,
      anchorTargetId: reference.anchorTargetId,
    })),
  ]);
}

function buildStaticInspectionReferences(
  note: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  matchedSourceSynthesisRowIds: string[],
): ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[] {
  return uniqueInspectionReferences([
    {
      referenceId: `${note.staticRelayNoteEntryId}:static-relay-note`,
      sourceKind: "static_relay_note",
      sourceId: note.staticRelayNoteEntryId,
      label: note.label,
      localAnchorHref: note.localAnchorHref,
      anchorTargetId: note.anchorTargetId,
    },
    ...note.sourceCrosswalkReferences.map((reference) => ({
      referenceId: `${note.staticRelayNoteEntryId}:${reference.referenceId}`,
      sourceKind: reference.sourceKind,
      sourceId: reference.sourceId,
      label: reference.label,
      localAnchorHref: reference.localAnchorHref,
      anchorTargetId: reference.anchorTargetId,
    })),
    ...matchedSourceSynthesisRowIds.map((synthesisRowId) => ({
      referenceId: `${note.staticRelayNoteEntryId}:${synthesisRowId}`,
      sourceKind: "synthesis_row" as const,
      sourceId: synthesisRowId,
      label: "Matched synthesis row",
    })),
  ]);
}

function uniqueInspectionReferences(
  references: ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[],
): ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[] {
  return [
    ...new Map(
      references.map((reference) => [
        `${reference.sourceKind}:${reference.sourceId}:${reference.localAnchorHref ?? ""}`,
        reference,
      ]),
    ).values(),
  ];
}

function relayNoteMatchesSynthesisRow(
  note: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  row: ReviewObservationHandoffSynthesisRowView,
): boolean {
  return (
    row.sourceAlignmentNoteIds.includes(note.sourceAlignmentNoteId) ||
    row.sourceCalibrationCardIds.some((sourceCalibrationCardId) =>
      note.sourceCalibrationCardIds.includes(sourceCalibrationCardId),
    ) ||
    row.sourceCueIds.includes(note.sourceCueId) ||
    row.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    row.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    row.anchorTargetIds.includes(note.anchorTargetId) ||
    row.sourcePathStepIds.includes(note.sourcePathStepId) ||
    row.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    row.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    row.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    row.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}

function staticNonGoalFlags(): ReviewObservationHandoffRelayTrailStaticNonGoalFlagsView {
  return {
    noSavedReviewerNotes: true,
    noSavedRelayProgress: true,
    noSavedInspectionState: true,
    noSavedSynthesisState: true,
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

function staticRelayTrailItemFlags() {
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
