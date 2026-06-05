import type {
  ReviewObservationHandoffCalibrationCardView,
  ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  ReviewObservationHandoffCalibrationView,
  ReviewObservationHandoffSynthesisRowView,
  ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView,
  ReviewObservationHandoffSynthesisStaticNonGoalFlagsView,
  ReviewObservationHandoffSynthesisStaticRelayNoteEntryView,
  ReviewObservationHandoffSynthesisView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSynthesis(
  sourceObservationHandoffCalibration:
    | ReviewObservationHandoffCalibrationView
    | undefined,
): ReviewObservationHandoffSynthesisView | undefined {
  if (!sourceObservationHandoffCalibration?.calibrationCards.length) {
    return undefined;
  }

  const synthesisRows = sourceObservationHandoffCalibration.calibrationCards.map(
    (card) =>
      buildSynthesisRow(
        card,
        sourceObservationHandoffCalibration.staticAlignmentNotes,
      ),
  );
  const staticRelayNotes =
    sourceObservationHandoffCalibration.staticAlignmentNotes.map((note) =>
      buildStaticRelayNoteEntry(
        note,
        sourceObservationHandoffCalibration.calibrationCards,
      ),
    );
  const defaultSynthesisRow =
    synthesisRows.find(
      (row) =>
        row.sourceCalibrationCardId ===
        sourceObservationHandoffCalibration.defaultCalibrationCard
          .calibrationCardId,
    ) ?? synthesisRows[0];

  return {
    schema: "telemforge.review_observation_handoff_synthesis.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff synthesis map and static relay notes",
    localStatus: sourceObservationHandoffCalibration.localStatus,
    summary: {
      synthesisId: "candidate-local-review-observation-handoff-synthesis",
      label: "Local observation handoff synthesis",
      summary:
        "A static synthesis map and relay-note surface derive from the Stage 47 calibration cards and alignment notes so reviewers can trace calibration cards, source references, local anchors, evidence callbacks, gap discussion points, and deferred-scope reminders by relay thread without saved synthesis state, saved calibration state, saved drift state, reviewer progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultCalibrationContext: {
        defaultCalibrationCardId:
          sourceObservationHandoffCalibration.defaultCalibrationCard
            .calibrationCardId,
        defaultDriftGuardRowId:
          sourceObservationHandoffCalibration.summary.defaultDriftGuardContext
            .defaultDriftGuardRowId,
        defaultCueId:
          sourceObservationHandoffCalibration.summary.defaultDriftGuardContext
            .defaultCueId,
        defaultDebriefPromptId:
          sourceObservationHandoffCalibration.summary.defaultDriftGuardContext
            .defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceObservationHandoffCalibration.summary.defaultDriftGuardContext
            .defaultAnchorTargetId,
        sourceCalibrationSummary:
          sourceObservationHandoffCalibration.summary.summary,
        sourceDriftGuardSummary:
          sourceObservationHandoffCalibration.summary.defaultDriftGuardContext
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
        sourceObservationHandoffCalibration,
        synthesisRows,
        staticRelayNotes,
      ),
    },
    defaultSynthesisRow,
    synthesisRows,
    staticRelayNotes,
    staticSynthesisSummary:
      "Stage 48 synthesis rows and static relay notes are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save synthesis notes, synthesis state, calibration notes, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffCalibration,
  };
}

function buildSynthesisRow(
  card: ReviewObservationHandoffCalibrationCardView,
  staticAlignmentNotes: ReviewObservationHandoffCalibrationStaticAlignmentNoteView[],
): ReviewObservationHandoffSynthesisRowView {
  const matchingAlignmentNotes = staticAlignmentNotes.filter((note) =>
    alignmentNoteMatchesCard(note, card),
  );
  const sourceAlignmentNoteIds = matchingAlignmentNotes.map(
    (note) => note.staticAlignmentNoteId,
  );

  return {
    synthesisRowId: `review-observation-handoff-synthesis:${card.calibrationCardId}`,
    rowNumber: card.cardNumber,
    label: `${card.label} synthesis thread`,
    summary:
      `Synthesis row ${card.cardNumber} relays ${card.calibrationCardId} with ${sourceAlignmentNoteIds.length} static alignment notes, ${card.sourceReferences.length} source references, ${card.localAnchorHrefs.length} local anchors, ${card.evidenceCallbackIds.length} evidence callbacks, ${card.gapDiscussionPointIds.length} gap discussion points, and ${card.deferredScopeReminderIds.length} deferred-scope reminders without saved synthesis state, saved calibration state, saved drift state, reviewer progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    relayThreadNote:
      `Use ${card.calibrationCardId} as a static relay thread for ${card.sourceCueId}, ${card.sourceDebriefPromptId}, ${card.sourcePathStepId}, ${card.sourceAgendaSectionId}, ${card.sourcePromptGroupId}, ${card.sourceCoverageRowId}, and ${card.sourceHandoffCardId}; keep the synthesis local, explanatory, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceCalibrationCardId: card.calibrationCardId,
    sourceCalibrationCardIds: [card.calibrationCardId],
    sourceAlignmentNoteIds,
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
    sourceCrosswalkReferences: buildRowCrosswalkReferences(
      card,
      matchingAlignmentNotes,
    ),
    localAnchorHrefs: card.localAnchorHrefs,
    anchorTargetIds: card.anchorTargetIds,
    evidenceCallbackIds: card.evidenceCallbackIds,
    gapDiscussionPointIds: card.gapDiscussionPointIds,
    deferredScopeReminderIds: card.deferredScopeReminderIds,
    staticNonGoalContexts: card.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSynthesisItemFlags(),
  };
}

function buildStaticRelayNoteEntry(
  note: ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  calibrationCards: ReviewObservationHandoffCalibrationCardView[],
): ReviewObservationHandoffSynthesisStaticRelayNoteEntryView {
  const matchingCalibrationCards = calibrationCards.filter((card) =>
    alignmentNoteMatchesCard(note, card),
  );
  const sourceCalibrationCardIds = matchingCalibrationCards.map(
    (card) => card.calibrationCardId,
  );

  return {
    staticRelayNoteEntryId: `review-observation-handoff-synthesis:relay:${note.staticAlignmentNoteId}`,
    relayOrder: note.alignmentOrder,
    sourceAlignmentNoteId: note.staticAlignmentNoteId,
    sourceAlignmentNoteIds: [note.staticAlignmentNoteId],
    sourceCalibrationCardIds,
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
    sourceAgendaSectionId: note.sourceAgendaSectionId,
    sourceAgendaSectionIds: note.sourceAgendaSectionIds,
    sourcePromptGroupId: note.sourcePromptGroupId,
    sourcePromptGroupIds: note.sourcePromptGroupIds,
    sourceCoverageRowId: note.sourceCoverageRowId,
    sourceCoverageRowIds: note.sourceCoverageRowIds,
    sourceHandoffCardId: note.sourceHandoffCardId,
    sourceHandoffCardIds: note.sourceHandoffCardIds,
    sourceSummaryReference: note.sourceSummaryReference,
    sourceCrosswalkReferences: buildRelayNoteCrosswalkReferences(
      note,
      matchingCalibrationCards,
    ),
    localAnchorHref: note.localAnchorHref,
    anchorTargetId: note.anchorTargetId,
    label: `${note.label} relay note`,
    summary:
      `Static relay note ${note.alignmentOrder} preserves Stage 47 alignment order for ${note.staticAlignmentNoteId}, ${sourceCalibrationCardIds.length} matched calibration cards, ${note.localAnchorHref}, ${note.sourceFollowUpMapEntryId}, ${note.sourceDebriefPromptId}, and ${note.sourcePathStepId}; it is local synthesis context only, not saved synthesis state, saved calibration state, saved drift state, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: note.evidenceCallbackIds,
    gapDiscussionPointIds: note.gapDiscussionPointIds,
    deferredScopeReminderIds: note.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSynthesisItemFlags(),
  };
}

function buildCounts(
  sourceObservationHandoffCalibration: ReviewObservationHandoffCalibrationView,
  synthesisRows: ReviewObservationHandoffSynthesisRowView[],
  staticRelayNotes: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView[],
): ReviewObservationHandoffSynthesisView["summary"]["counts"] {
  return {
    synthesisRowCount: synthesisRows.length,
    staticRelayNoteCount: staticRelayNotes.length,
    sourceCalibrationCardCount:
      sourceObservationHandoffCalibration.calibrationCards.length,
    sourceAlignmentNoteCount:
      sourceObservationHandoffCalibration.staticAlignmentNotes.length,
    sourceCueCount: new Set(synthesisRows.map((row) => row.sourceCueId)).size,
    sourceDebriefPromptCount: new Set(
      synthesisRows.map((row) => row.sourceDebriefPromptId),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      staticRelayNotes.map((note) => note.sourceFollowUpMapEntryId),
    ).size,
    sourcePathStepCount: new Set(
      synthesisRows.map((row) => row.sourcePathStepId),
    ).size,
    sourceAgendaSectionCount: new Set(
      synthesisRows.map((row) => row.sourceAgendaSectionId),
    ).size,
    sourcePromptGroupCount: new Set(
      synthesisRows.map((row) => row.sourcePromptGroupId),
    ).size,
    sourceCoverageRowCount: new Set(
      synthesisRows.map((row) => row.sourceCoverageRowId),
    ).size,
    sourceHandoffCardCount: new Set(
      synthesisRows.map((row) => row.sourceHandoffCardId),
    ).size,
    localOnlySynthesisRowCount: synthesisRows.filter((row) => row.localOnly)
      .length,
  };
}

function buildRowCrosswalkReferences(
  card: ReviewObservationHandoffCalibrationCardView,
  matchingAlignmentNotes: ReviewObservationHandoffCalibrationStaticAlignmentNoteView[],
): ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[] {
  return uniqueCrosswalkReferences([
    {
      referenceId: `${card.calibrationCardId}:calibration-card`,
      sourceKind: "calibration_card",
      sourceId: card.calibrationCardId,
      label: card.label,
      localAnchorHref: card.localAnchorHrefs[0],
      anchorTargetId: card.anchorTargetIds[0],
    },
    ...card.sourceReferences.map((reference) => ({
      referenceId: `${card.calibrationCardId}:${reference.referenceId}`,
      sourceKind: reference.sourceKind,
      sourceId: reference.sourceId,
      label: reference.label,
    })),
    ...matchingAlignmentNotes.map((note) => ({
      referenceId: `${card.calibrationCardId}:${note.staticAlignmentNoteId}`,
      sourceKind: "alignment_note" as const,
      sourceId: note.staticAlignmentNoteId,
      label: note.label,
      localAnchorHref: note.localAnchorHref,
      anchorTargetId: note.anchorTargetId,
    })),
  ]);
}

function buildRelayNoteCrosswalkReferences(
  note: ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  matchingCalibrationCards: ReviewObservationHandoffCalibrationCardView[],
): ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[] {
  return uniqueCrosswalkReferences([
    {
      referenceId: `${note.staticAlignmentNoteId}:alignment-note`,
      sourceKind: "alignment_note",
      sourceId: note.staticAlignmentNoteId,
      label: note.label,
      localAnchorHref: note.localAnchorHref,
      anchorTargetId: note.anchorTargetId,
    },
    ...matchingCalibrationCards.map((card) => ({
      referenceId: `${note.staticAlignmentNoteId}:${card.calibrationCardId}`,
      sourceKind: "calibration_card" as const,
      sourceId: card.calibrationCardId,
      label: card.label,
      localAnchorHref: card.localAnchorHrefs[0],
      anchorTargetId: card.anchorTargetIds[0],
    })),
  ]);
}

function uniqueCrosswalkReferences(
  references: ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[],
): ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[] {
  return [
    ...new Map(
      references.map((reference) => [
        `${reference.sourceKind}:${reference.sourceId}:${reference.localAnchorHref ?? ""}`,
        reference,
      ]),
    ).values(),
  ];
}

function alignmentNoteMatchesCard(
  note: ReviewObservationHandoffCalibrationStaticAlignmentNoteView,
  card: ReviewObservationHandoffCalibrationCardView,
): boolean {
  return (
    card.sourceCueIds.includes(note.sourceCueId) ||
    card.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    card.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    card.anchorTargetIds.includes(note.anchorTargetId) ||
    card.sourcePathStepIds.includes(note.sourcePathStepId) ||
    card.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    card.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    card.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    card.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}

function staticNonGoalFlags(): ReviewObservationHandoffSynthesisStaticNonGoalFlagsView {
  return {
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

function staticSynthesisItemFlags() {
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
