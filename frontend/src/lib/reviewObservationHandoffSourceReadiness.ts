import type {
  ReviewObservationHandoffSourceReadinessRowView,
  ReviewObservationHandoffSourceReadinessStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView,
  ReviewObservationHandoffSourceReadinessView,
  ReviewObservationHandoffSourceReadoutRowView,
  ReviewObservationHandoffSourceReadoutStaticReviewCueRowView,
  ReviewObservationHandoffSourceReadoutView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadiness(
  sourceReviewObservationHandoffSourceReadout:
    | ReviewObservationHandoffSourceReadoutView
    | undefined,
): ReviewObservationHandoffSourceReadinessView | undefined {
  if (!sourceReviewObservationHandoffSourceReadout?.sourceReadoutRows.length) {
    return undefined;
  }

  const sourceReadinessRows =
    sourceReviewObservationHandoffSourceReadout.sourceReadoutRows.map((row) =>
      buildSourceReadinessRow(
        row,
        sourceReviewObservationHandoffSourceReadout.staticReviewCues,
      ),
    );
  const staticReviewChecks =
    sourceReviewObservationHandoffSourceReadout.staticReviewCues.map((cue) =>
      buildStaticReviewCheck(
        cue,
        sourceReviewObservationHandoffSourceReadout.sourceReadoutRows,
      ),
    );
  const defaultSourceReadinessRow =
    sourceReadinessRows.find(
      (row) =>
        row.sourceReadoutRowId ===
        sourceReviewObservationHandoffSourceReadout.defaultSourceReadoutRow
          .sourceReadoutRowId,
    ) ?? sourceReadinessRows[0];

  return {
    schema: "telemforge.review_observation_handoff_source_readiness.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness board and static review checks",
    localStatus: sourceReviewObservationHandoffSourceReadout.localStatus,
    summary: {
      sourceReadinessId:
        "candidate-local-review-observation-handoff-source-readiness",
      label: "Local observation handoff source readiness",
      summary:
        "A static source readiness board and review-check surface derive from the Stage 52 source readout rows and static review cues so reviewers can inspect ordered source-backed readout rows, anchors, evidence callbacks, gap prompts, deferred-scope reminders, and linked static review checks before human review without saved reviewer notes, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultSourceReadoutContext: {
        defaultSourceReadoutRowId:
          sourceReviewObservationHandoffSourceReadout.defaultSourceReadoutRow
            .sourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultRelayStepId,
        defaultSynthesisRowId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultSynthesisRowId,
        defaultCalibrationCardId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultCalibrationCardId,
        defaultCueId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultCueId,
        defaultDebriefPromptId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.defaultAnchorTargetId,
        sourceReadoutSummary:
          sourceReviewObservationHandoffSourceReadout.summary.summary,
        sourceWalkthroughSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceRelayTrailSummary,
        sourceSynthesisSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceSynthesisSummary,
        sourceCalibrationSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceReviewObservationHandoffSourceReadout.summary
            .defaultSourceWalkthroughContext.sourceDriftGuardSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceReviewObservationHandoffSourceReadout,
        sourceReadinessRows,
        staticReviewChecks,
      ),
    },
    defaultSourceReadinessRow,
    sourceReadinessRows,
    staticReviewChecks,
    staticSourceReadinessSummary:
      "Stage 53 source readiness rows and static review checks are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, inspection state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadout,
  };
}

function buildSourceReadinessRow(
  row: ReviewObservationHandoffSourceReadoutRowView,
  staticReviewCues: ReviewObservationHandoffSourceReadoutStaticReviewCueRowView[],
): ReviewObservationHandoffSourceReadinessRowView {
  const matchedStaticReviewCueIds = staticReviewCues
    .filter((cue) =>
      cue.matchedSourceWalkthroughSectionIds.includes(
        row.sourceWalkthroughSectionId,
      ),
    )
    .map((cue) => cue.staticReviewCueRowId);

  return {
    sourceReadinessRowId: `review-observation-handoff-source-readiness:${row.sourceReadoutRowId}`,
    rowNumber: row.rowNumber,
    label: `${row.label} readiness`,
    summary:
      `Source readiness row ${row.rowNumber} preserves Stage 52 source readout row order for ${row.sourceReadoutRowId}, ${row.sourceWalkthroughSectionId}, ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion points, ${row.deferredScopeReminderIds.length} deferred-scope reminders, and ${matchedStaticReviewCueIds.length} matched static review cues without saved reviewer notes, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    readinessCue:
      `Check ${row.sourceReadoutRowId} against anchors ${row.anchorTargetIds.join(", ")}, callbacks ${row.evidenceCallbackIds.length}, gap prompts ${row.gapDiscussionPointIds.length}, deferred reminders ${row.deferredScopeReminderIds.length}, and static cues ${matchedStaticReviewCueIds.join(", ")} as static readiness context only.`,
    sourceReadoutRowId: row.sourceReadoutRowId,
    sourceReadoutRowIds: [row.sourceReadoutRowId],
    sourceWalkthroughSectionId: row.sourceWalkthroughSectionId,
    sourceWalkthroughSectionIds: row.sourceWalkthroughSectionIds,
    sourceCrosswalkRowId: row.sourceCrosswalkRowId,
    sourceCrosswalkRowIds: row.sourceCrosswalkRowIds,
    sourceRelayStepId: row.sourceRelayStepId,
    sourceRelayStepIds: row.sourceRelayStepIds,
    sourceInspectionReferenceIds: row.sourceInspectionReferenceIds,
    sourceKinds: row.sourceKinds,
    sourceIds: row.sourceIds,
    sourceLabels: row.sourceLabels,
    localAnchorHrefs: row.localAnchorHrefs,
    anchorTargetIds: row.anchorTargetIds,
    sourceSynthesisRowIds: row.sourceSynthesisRowIds,
    sourceCalibrationCardIds: row.sourceCalibrationCardIds,
    sourceAlignmentNoteIds: row.sourceAlignmentNoteIds,
    sourceCueIds: row.sourceCueIds,
    sourceDebriefPromptIds: row.sourceDebriefPromptIds,
    sourceFollowUpMapEntryIds: row.sourceFollowUpMapEntryIds,
    sourcePathStepIds: row.sourcePathStepIds,
    sourceAgendaSectionIds: row.sourceAgendaSectionIds,
    sourcePromptGroupIds: row.sourcePromptGroupIds,
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceHandoffCardIds: row.sourceHandoffCardIds,
    evidenceCallbackIds: row.evidenceCallbackIds,
    gapDiscussionPointIds: row.gapDiscussionPointIds,
    deferredScopeReminderIds: row.deferredScopeReminderIds,
    matchedStaticReviewCueIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadinessItemFlags(),
  };
}

function buildStaticReviewCheck(
  cue: ReviewObservationHandoffSourceReadoutStaticReviewCueRowView,
  sourceReadoutRows: ReviewObservationHandoffSourceReadoutRowView[],
): ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView {
  const matchedSourceReadoutRows = sourceReadoutRows.filter((row) =>
    cue.matchedSourceWalkthroughSectionIds.includes(
      row.sourceWalkthroughSectionId,
    ),
  );

  return {
    staticReviewCheckRowId: `review-observation-handoff-source-readiness:check:${cue.staticReviewCueRowId}`,
    checkOrder: cue.cueOrder,
    sourceStaticReviewCueRowId: cue.staticReviewCueRowId,
    sourceStaticReviewCueRowIds: [cue.staticReviewCueRowId],
    matchedSourceReadoutRowIds: matchedSourceReadoutRows.map(
      (row) => row.sourceReadoutRowId,
    ),
    matchedSourceWalkthroughSectionIds:
      cue.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: cue.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: cue.sourceRelayStepIds,
    sourceLocalAnchorHrefs: cue.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: cue.sourceAnchorTargetIds,
    localAnchorHref: cue.localAnchorHref,
    anchorTargetId: cue.anchorTargetId,
    label: `${cue.label} static check`,
    summary:
      `Static review check ${cue.cueOrder} preserves Stage 52 static review cue order for ${cue.staticReviewCueRowId}, ${matchedSourceReadoutRows.length} matched source readout rows, ${cue.matchedSourceWalkthroughSectionIds.length} matched walkthrough sections, ${cue.matchedSourceCrosswalkRowIds.length} crosswalk rows, ${cue.localAnchorHref}, and anchor ${cue.anchorTargetId}; it is local source readiness context only, not saved reviewer notes, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    check:
      `Use ${cue.staticReviewCueRowId} to compare matched readout rows ${matchedSourceReadoutRows.map((row) => row.sourceReadoutRowId).join(", ")} against callbacks ${cue.evidenceCallbackIds.length}, gap prompts ${cue.gapDiscussionPointIds.length}, and deferred reminders ${cue.deferredScopeReminderIds.length} as static readiness context only.`,
    evidenceCallbackIds: cue.evidenceCallbackIds,
    gapDiscussionPointIds: cue.gapDiscussionPointIds,
    deferredScopeReminderIds: cue.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadinessItemFlags(),
  };
}

function buildCounts(
  sourceReviewObservationHandoffSourceReadout: ReviewObservationHandoffSourceReadoutView,
  sourceReadinessRows: ReviewObservationHandoffSourceReadinessRowView[],
  staticReviewChecks: ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView[],
): ReviewObservationHandoffSourceReadinessView["summary"]["counts"] {
  return {
    sourceReadinessRowCount: sourceReadinessRows.length,
    staticReviewCheckCount: staticReviewChecks.length,
    sourceReadoutRowCount:
      sourceReviewObservationHandoffSourceReadout.sourceReadoutRows.length,
    staticReviewCueCount:
      sourceReviewObservationHandoffSourceReadout.staticReviewCues.length,
    sourceWalkthroughSectionCount:
      sourceReviewObservationHandoffSourceReadout.summary.counts
        .sourceWalkthroughSectionCount,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceReadout.summary.counts
        .sourceCrosswalkRowCount,
    sourceInspectionReferenceCount: sourceReadinessRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    sourceSynthesisRowCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceSynthesisRowIds),
    ).size,
    sourceCalibrationCardCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceCalibrationCardIds),
    ).size,
    sourceAlignmentNoteCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceAlignmentNoteIds),
    ).size,
    sourceCueCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceCueIds),
    ).size,
    sourceDebriefPromptCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceDebriefPromptIds),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceFollowUpMapEntryIds),
    ).size,
    sourcePathStepCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourcePathStepIds),
    ).size,
    sourceAgendaSectionCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceAgendaSectionIds),
    ).size,
    sourcePromptGroupCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourcePromptGroupIds),
    ).size,
    sourceCoverageRowCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceCoverageRowIds),
    ).size,
    sourceHandoffCardCount: new Set(
      sourceReadinessRows.flatMap((row) => row.sourceHandoffCardIds),
    ).size,
    matchedStaticReviewCueCount: new Set(
      sourceReadinessRows.flatMap((row) => row.matchedStaticReviewCueIds),
    ).size,
    localOnlySourceReadinessRowCount: sourceReadinessRows.filter(
      (row) => row.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceReadinessStaticNonGoalFlagsView {
  return {
    noSavedSourceReadinessProgress: true,
    noSavedSourceReadoutProgress: true,
    noSavedSourceWalkthroughProgress: true,
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

function staticSourceReadinessItemFlags() {
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
