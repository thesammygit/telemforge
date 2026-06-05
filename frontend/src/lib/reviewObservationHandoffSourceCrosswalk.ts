import type {
  ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  ReviewObservationHandoffRelayTrailStepView,
  ReviewObservationHandoffRelayTrailView,
  ReviewObservationHandoffSourceCrosswalkRowView,
  ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
  ReviewObservationHandoffSourceCrosswalkStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceCrosswalkView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceCrosswalk(
  sourceReviewObservationHandoffRelayTrail:
    | ReviewObservationHandoffRelayTrailView
    | undefined,
): ReviewObservationHandoffSourceCrosswalkView | undefined {
  if (!sourceReviewObservationHandoffRelayTrail?.relaySteps.length) {
    return undefined;
  }

  const sourceCrosswalkRows =
    sourceReviewObservationHandoffRelayTrail.relaySteps.map((step) =>
      buildSourceCrosswalkRow(step),
    );
  const staticAnchorNotes =
    sourceReviewObservationHandoffRelayTrail.staticInspectionNotes.map((note) =>
      buildStaticAnchorNote(note, sourceReviewObservationHandoffRelayTrail.relaySteps),
    );
  const defaultSourceCrosswalkRow =
    sourceCrosswalkRows.find(
      (row) =>
        row.sourceRelayStepId ===
        sourceReviewObservationHandoffRelayTrail.defaultRelayStep.relayStepId,
    ) ?? sourceCrosswalkRows[0];

  return {
    schema: "telemforge.review_observation_handoff_source_crosswalk.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source crosswalk and static anchor notes",
    localStatus: sourceReviewObservationHandoffRelayTrail.localStatus,
    summary: {
      sourceCrosswalkId:
        "candidate-local-review-observation-handoff-source-crosswalk",
      label: "Local observation handoff source crosswalk",
      summary:
        "A static source crosswalk and anchor-note surface derive from the Stage 49 relay steps and source inspection references so reviewers can inspect relay source chains, local anchors, evidence callbacks, gap discussion points, and deferred-scope reminders before handoff without saved reviewer notes, saved relay progress, saved source inspection state, saved anchor state, saved synthesis state, saved calibration state, saved drift state, reviewer progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultRelayContext: {
        defaultRelayStepId:
          sourceReviewObservationHandoffRelayTrail.defaultRelayStep.relayStepId,
        defaultSynthesisRowId:
          sourceReviewObservationHandoffRelayTrail.defaultRelayStep
            .sourceSynthesisRowId,
        defaultCalibrationCardId:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .defaultCalibrationCardId,
        defaultCueId:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .defaultCueId,
        defaultDebriefPromptId:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .defaultAnchorTargetId,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffRelayTrail.summary.summary,
        sourceSynthesisSummary:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .sourceSynthesisSummary,
        sourceCalibrationSummary:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
            .sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceReviewObservationHandoffRelayTrail.summary.defaultSynthesisContext
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
        sourceReviewObservationHandoffRelayTrail,
        sourceCrosswalkRows,
        staticAnchorNotes,
      ),
    },
    defaultSourceCrosswalkRow,
    sourceCrosswalkRows,
    staticAnchorNotes,
    staticSourceCrosswalkSummary:
      "Stage 50 source crosswalk rows and static anchor notes are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, relay progress, source inspection state, anchor state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffRelayTrail,
  };
}

function buildSourceCrosswalkRow(
  step: ReviewObservationHandoffRelayTrailStepView,
): ReviewObservationHandoffSourceCrosswalkRowView {
  const sourceInspectionReferenceIds = step.sourceInspectionReferences.map(
    (reference) => reference.referenceId,
  );
  const sourceKinds = step.sourceInspectionReferences.map(
    (reference) => reference.sourceKind,
  );
  const sourceIds = step.sourceInspectionReferences.map(
    (reference) => reference.sourceId,
  );
  const sourceLabels = step.sourceInspectionReferences.map(
    (reference) => reference.label,
  );

  return {
    sourceCrosswalkRowId: `review-observation-handoff-source-crosswalk:${step.relayStepId}`,
    rowNumber: step.stepNumber,
    label: `${step.label} source crosswalk`,
    summary:
      `Source crosswalk row ${step.stepNumber} preserves Stage 49 relay step order for ${step.relayStepId}, ${step.sourceSynthesisRowId}, ${sourceInspectionReferenceIds.length} source inspection references, ${step.localAnchorHrefs.length} local anchors, ${step.evidenceCallbackIds.length} evidence callbacks, ${step.gapDiscussionPointIds.length} gap discussion points, and ${step.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer notes, saved relay progress, saved source inspection state, saved anchor state, saved synthesis state, saved calibration state, saved drift state, reviewer progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    anchorNote:
      `Use ${step.relayStepId} as a static source crosswalk for ${sourceIds.join(", ")} and local anchors ${step.anchorTargetIds.join(", ")}; keep it local, explanatory, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    sourceRelayStepId: step.relayStepId,
    sourceRelayStepIds: [step.relayStepId],
    sourceSynthesisRowIds: step.sourceSynthesisRowIds,
    sourceInspectionReferenceIds,
    sourceKinds,
    sourceIds,
    sourceLabels,
    localAnchorHrefs: step.localAnchorHrefs,
    anchorTargetIds: step.anchorTargetIds,
    sourceCalibrationCardIds: step.sourceCalibrationCardIds,
    sourceAlignmentNoteIds: step.sourceAlignmentNoteIds,
    sourceCueIds: step.sourceCueIds,
    sourceDebriefPromptIds: step.sourceDebriefPromptIds,
    sourceFollowUpMapEntryIds: step.sourceFollowUpMapEntryIds,
    sourcePathStepIds: step.sourcePathStepIds,
    sourceAgendaSectionIds: step.sourceAgendaSectionIds,
    sourcePromptGroupIds: step.sourcePromptGroupIds,
    sourceCoverageRowIds: step.sourceCoverageRowIds,
    sourceHandoffCardIds: step.sourceHandoffCardIds,
    evidenceCallbackIds: step.evidenceCallbackIds,
    gapDiscussionPointIds: step.gapDiscussionPointIds,
    deferredScopeReminderIds: step.deferredScopeReminderIds,
    staticNonGoalContexts: step.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceCrosswalkItemFlags(),
  };
}

function buildStaticAnchorNote(
  note: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  relaySteps: ReviewObservationHandoffRelayTrailStepView[],
): ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView {
  const matchedSourceCrosswalkRowIds = relaySteps
    .filter((step) => staticAnchorNoteMatchesRelayStep(note, step))
    .map(
      (step) =>
        `review-observation-handoff-source-crosswalk:${step.relayStepId}`,
    );

  return {
    staticAnchorNoteEntryId: `review-observation-handoff-source-crosswalk:anchor:${note.staticInspectionNoteEntryId}`,
    anchorOrder: note.inspectionOrder,
    sourceStaticInspectionNoteId: note.staticInspectionNoteEntryId,
    sourceStaticInspectionNoteIds: [note.staticInspectionNoteEntryId],
    sourceRelayNoteId: note.sourceRelayNoteId,
    sourceRelayNoteIds: note.sourceRelayNoteIds,
    matchedSourceCrosswalkRowIds,
    sourceAlignmentNoteId: note.sourceAlignmentNoteId,
    sourceAlignmentNoteIds: note.sourceAlignmentNoteIds,
    sourceAnchorTargetIds: note.sourceAnchorTargetIds,
    sourceAnchorOrder: note.sourceAnchorOrder,
    localAnchorHref: note.localAnchorHref,
    anchorTargetId: note.anchorTargetId,
    label: `${note.label} anchor note`,
    summary:
      `Static anchor note ${note.inspectionOrder} preserves Stage 49 inspection-note order for ${note.staticInspectionNoteEntryId}, ${note.sourceRelayNoteId}, ${matchedSourceCrosswalkRowIds.length} matched source crosswalk rows, ${note.localAnchorHref}, ${note.sourceAlignmentNoteId}, and anchor ${note.anchorTargetId}; it is local anchor context only, not saved reviewer notes, saved relay progress, saved source inspection state, saved anchor state, saved synthesis state, saved calibration state, saved drift state, saved progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    evidenceCallbackIds: note.evidenceCallbackIds,
    gapDiscussionPointIds: note.gapDiscussionPointIds,
    deferredScopeReminderIds: note.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceCrosswalkItemFlags(),
  };
}

function buildCounts(
  sourceReviewObservationHandoffRelayTrail: ReviewObservationHandoffRelayTrailView,
  sourceCrosswalkRows: ReviewObservationHandoffSourceCrosswalkRowView[],
  staticAnchorNotes: ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView[],
): ReviewObservationHandoffSourceCrosswalkView["summary"]["counts"] {
  return {
    sourceCrosswalkRowCount: sourceCrosswalkRows.length,
    staticAnchorNoteCount: staticAnchorNotes.length,
    sourceRelayStepCount:
      sourceReviewObservationHandoffRelayTrail.relaySteps.length,
    sourceStaticInspectionNoteCount:
      sourceReviewObservationHandoffRelayTrail.staticInspectionNotes.length,
    sourceInspectionReferenceCount: sourceCrosswalkRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    sourceSynthesisRowCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceSynthesisRowIds),
    ).size,
    sourceCalibrationCardCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceCalibrationCardIds),
    ).size,
    sourceAlignmentNoteCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceAlignmentNoteIds),
    ).size,
    sourceCueCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceCueIds),
    ).size,
    sourceDebriefPromptCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceDebriefPromptIds),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceFollowUpMapEntryIds),
    ).size,
    sourcePathStepCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourcePathStepIds),
    ).size,
    sourceAgendaSectionCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceAgendaSectionIds),
    ).size,
    sourcePromptGroupCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourcePromptGroupIds),
    ).size,
    sourceCoverageRowCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceCoverageRowIds),
    ).size,
    sourceHandoffCardCount: new Set(
      sourceCrosswalkRows.flatMap((row) => row.sourceHandoffCardIds),
    ).size,
    localOnlySourceCrosswalkRowCount: sourceCrosswalkRows.filter(
      (row) => row.localOnly,
    ).length,
  };
}

function staticAnchorNoteMatchesRelayStep(
  note: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView,
  step: ReviewObservationHandoffRelayTrailStepView,
): boolean {
  return (
    step.sourceAlignmentNoteIds.includes(note.sourceAlignmentNoteId) ||
    step.sourceCalibrationCardIds.some((sourceCalibrationCardId) =>
      note.sourceCalibrationCardIds.includes(sourceCalibrationCardId),
    ) ||
    step.sourceCueIds.includes(note.sourceCueId) ||
    step.sourceDebriefPromptIds.includes(note.sourceDebriefPromptId) ||
    step.sourceFollowUpMapEntryIds.some((sourceFollowUpMapEntryId) =>
      note.sourceFollowUpMapEntryIds.includes(sourceFollowUpMapEntryId),
    ) ||
    step.anchorTargetIds.includes(note.anchorTargetId) ||
    step.sourcePathStepIds.includes(note.sourcePathStepId) ||
    step.sourceAgendaSectionIds.includes(note.sourceAgendaSectionId) ||
    step.sourcePromptGroupIds.includes(note.sourcePromptGroupId) ||
    step.sourceCoverageRowIds.includes(note.sourceCoverageRowId) ||
    step.sourceHandoffCardIds.includes(note.sourceHandoffCardId)
  );
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceCrosswalkStaticNonGoalFlagsView {
  return {
    noSavedReviewerNotes: true,
    noSavedRelayProgress: true,
    noSavedInspectionState: true,
    noSavedSourceInspectionState: true,
    noSavedAnchorState: true,
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

function staticSourceCrosswalkItemFlags() {
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
