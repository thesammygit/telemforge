import type {
  ReviewObservationHandoffSourceReadinessRehearsalPromptRowView,
  ReviewObservationHandoffSourceReadinessRehearsalStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView,
  ReviewObservationHandoffSourceReadinessRehearsalView,
  ReviewObservationHandoffSourceReadinessRowView,
  ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView,
  ReviewObservationHandoffSourceReadinessView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessRehearsal(
  sourceReviewObservationHandoffSourceReadiness:
    | ReviewObservationHandoffSourceReadinessView
    | undefined,
): ReviewObservationHandoffSourceReadinessRehearsalView | undefined {
  if (!sourceReviewObservationHandoffSourceReadiness?.sourceReadinessRows.length) {
    return undefined;
  }

  const rehearsalPromptRows =
    sourceReviewObservationHandoffSourceReadiness.sourceReadinessRows.map((row) =>
      buildRehearsalPromptRow(
        row,
        sourceReviewObservationHandoffSourceReadiness.staticReviewChecks,
      ),
    );
  const staticReviewerPromptChecks =
    sourceReviewObservationHandoffSourceReadiness.staticReviewChecks.map(
      (check) =>
        buildStaticReviewerPromptCheck(
          check,
          sourceReviewObservationHandoffSourceReadiness.sourceReadinessRows,
        ),
    );
  const defaultRehearsalPromptRow =
    rehearsalPromptRows.find(
      (row) =>
        row.sourceReadinessRowId ===
        sourceReviewObservationHandoffSourceReadiness.defaultSourceReadinessRow
          .sourceReadinessRowId,
    ) ?? rehearsalPromptRows[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_rehearsal.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness rehearsal and static reviewer prompts",
    localStatus: sourceReviewObservationHandoffSourceReadiness.localStatus,
    summary: {
      sourceReadinessRehearsalId:
        "candidate-local-review-observation-handoff-source-readiness-rehearsal",
      label: "Local observation handoff source readiness rehearsal",
      summary:
        "A static source readiness rehearsal and reviewer-prompt surface derive from the Stage 53 source readiness rows and static review checks so reviewers can walk ordered readiness rows, anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, and source-backed context before human handoff without saved reviewer notes, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultSourceReadinessContext: {
        defaultSourceReadinessRowId:
          sourceReviewObservationHandoffSourceReadiness
            .defaultSourceReadinessRow.sourceReadinessRowId,
        defaultSourceReadoutRowId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultSourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultRelayStepId,
        defaultSynthesisRowId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultSynthesisRowId,
        defaultCalibrationCardId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultCalibrationCardId,
        defaultCueId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultCueId,
        defaultDebriefPromptId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.defaultAnchorTargetId,
        sourceReadinessSummary:
          sourceReviewObservationHandoffSourceReadiness.summary.summary,
        sourceReadoutSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceReadoutSummary,
        sourceWalkthroughSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceRelayTrailSummary,
        sourceSynthesisSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceSynthesisSummary,
        sourceCalibrationSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceReviewObservationHandoffSourceReadiness.summary
            .defaultSourceReadoutContext.sourceDriftGuardSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceReviewObservationHandoffSourceReadiness,
        rehearsalPromptRows,
        staticReviewerPromptChecks,
      ),
    },
    defaultRehearsalPromptRow,
    rehearsalPromptRows,
    staticReviewerPromptChecks,
    staticSourceReadinessRehearsalSummary:
      "Stage 54 source readiness rehearsal prompts and static reviewer prompt checks are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, inspection state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadiness,
  };
}

function buildRehearsalPromptRow(
  row: ReviewObservationHandoffSourceReadinessRowView,
  staticReviewChecks: ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView[],
): ReviewObservationHandoffSourceReadinessRehearsalPromptRowView {
  const matchedStaticReviewChecks = staticReviewChecks.filter((check) =>
    row.matchedStaticReviewCueIds.includes(check.sourceStaticReviewCueRowId),
  );

  return {
    sourceReadinessRehearsalPromptRowId: `review-observation-handoff-source-readiness-rehearsal:${row.sourceReadinessRowId}`,
    promptOrder: row.rowNumber,
    label: `${row.label} rehearsal`,
    summary:
      `Source readiness rehearsal prompt ${row.rowNumber} preserves Stage 53 source readiness row order for ${row.sourceReadinessRowId}, ${row.sourceReadoutRowId}, ${row.sourceWalkthroughSectionId}, ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion points, ${row.deferredScopeReminderIds.length} deferred-scope reminders, ${matchedStaticReviewChecks.length} matched static review checks, and ${row.matchedStaticReviewCueIds.length} static review cues without saved reviewer notes, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    reviewerPrompt:
      `Walk ${row.sourceReadinessRowId} through anchors ${row.anchorTargetIds.join(", ")}, evidence callbacks ${row.evidenceCallbackIds.join(", ")}, gap prompts ${row.gapDiscussionPointIds.join(", ")}, deferred reminders ${row.deferredScopeReminderIds.join(", ")}, matched checks ${matchedStaticReviewChecks.map((check) => check.staticReviewCheckRowId).join(", ")}, and static cues ${row.matchedStaticReviewCueIds.join(", ")} as local static rehearsal context only.`,
    sourceReadinessRowId: row.sourceReadinessRowId,
    sourceReadinessRowIds: [row.sourceReadinessRowId],
    sourceReadoutRowId: row.sourceReadoutRowId,
    sourceReadoutRowIds: row.sourceReadoutRowIds,
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
    matchedStaticReviewCheckIds: matchedStaticReviewChecks.map(
      (check) => check.staticReviewCheckRowId,
    ),
    staticReviewCueIds: row.matchedStaticReviewCueIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadinessRehearsalItemFlags(),
  };
}

function buildStaticReviewerPromptCheck(
  check: ReviewObservationHandoffSourceReadinessStaticReviewCheckRowView,
  sourceReadinessRows: ReviewObservationHandoffSourceReadinessRowView[],
): ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView {
  const matchedSourceReadinessRows = sourceReadinessRows.filter((row) =>
    check.matchedSourceReadoutRowIds.includes(row.sourceReadoutRowId),
  );

  return {
    staticReviewerPromptCheckRowId: `review-observation-handoff-source-readiness-rehearsal:prompt-check:${check.staticReviewCheckRowId}`,
    checkOrder: check.checkOrder,
    sourceStaticReviewCheckRowId: check.staticReviewCheckRowId,
    sourceStaticReviewCheckRowIds: [check.staticReviewCheckRowId],
    sourceStaticReviewCueRowIds: check.sourceStaticReviewCueRowIds,
    matchedSourceReadinessRowIds: matchedSourceReadinessRows.map(
      (row) => row.sourceReadinessRowId,
    ),
    matchedSourceReadoutRowIds: check.matchedSourceReadoutRowIds,
    matchedSourceWalkthroughSectionIds:
      check.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: check.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: check.sourceRelayStepIds,
    sourceLocalAnchorHrefs: check.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: check.sourceAnchorTargetIds,
    localAnchorHref: check.localAnchorHref,
    anchorTargetId: check.anchorTargetId,
    label: `${check.label} reviewer prompt`,
    summary:
      `Static reviewer prompt check ${check.checkOrder} preserves Stage 53 static review check order for ${check.staticReviewCheckRowId}, ${check.sourceStaticReviewCueRowIds.join(", ")}, ${matchedSourceReadinessRows.length} matched source readiness rows, ${check.matchedSourceReadoutRowIds.length} matched source readout rows, ${check.matchedSourceWalkthroughSectionIds.length} matched walkthrough sections, ${check.matchedSourceCrosswalkRowIds.length} crosswalk rows, ${check.localAnchorHref}, and anchor ${check.anchorTargetId}; it is local source readiness rehearsal context only, not saved reviewer notes, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    reviewerPrompt:
      `Ask reviewers to compare source check ${check.staticReviewCheckRowId} with readiness rows ${matchedSourceReadinessRows.map((row) => row.sourceReadinessRowId).join(", ")}, callbacks ${check.evidenceCallbackIds.join(", ")}, gap prompts ${check.gapDiscussionPointIds.join(", ")}, and deferred reminders ${check.deferredScopeReminderIds.join(", ")} as static rehearsal context only.`,
    evidenceCallbackIds: check.evidenceCallbackIds,
    gapDiscussionPointIds: check.gapDiscussionPointIds,
    deferredScopeReminderIds: check.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadinessRehearsalItemFlags(),
  };
}

function buildCounts(
  sourceReviewObservationHandoffSourceReadiness: ReviewObservationHandoffSourceReadinessView,
  rehearsalPromptRows: ReviewObservationHandoffSourceReadinessRehearsalPromptRowView[],
  staticReviewerPromptChecks: ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView[],
): ReviewObservationHandoffSourceReadinessRehearsalView["summary"]["counts"] {
  return {
    rehearsalPromptRowCount: rehearsalPromptRows.length,
    staticReviewerPromptCheckCount: staticReviewerPromptChecks.length,
    sourceReadinessRowCount:
      sourceReviewObservationHandoffSourceReadiness.sourceReadinessRows.length,
    staticReviewCheckCount:
      sourceReviewObservationHandoffSourceReadiness.staticReviewChecks.length,
    sourceReadoutRowCount:
      sourceReviewObservationHandoffSourceReadiness.summary.counts
        .sourceReadoutRowCount,
    staticReviewCueCount:
      sourceReviewObservationHandoffSourceReadiness.summary.counts
        .staticReviewCueCount,
    sourceWalkthroughSectionCount:
      sourceReviewObservationHandoffSourceReadiness.summary.counts
        .sourceWalkthroughSectionCount,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceReadiness.summary.counts
        .sourceCrosswalkRowCount,
    sourceInspectionReferenceCount: rehearsalPromptRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    sourceSynthesisRowCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceSynthesisRowIds),
    ).size,
    sourceCalibrationCardCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceCalibrationCardIds),
    ).size,
    sourceAlignmentNoteCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceAlignmentNoteIds),
    ).size,
    sourceCueCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceCueIds),
    ).size,
    sourceDebriefPromptCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceDebriefPromptIds),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceFollowUpMapEntryIds),
    ).size,
    sourcePathStepCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourcePathStepIds),
    ).size,
    sourceAgendaSectionCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceAgendaSectionIds),
    ).size,
    sourcePromptGroupCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourcePromptGroupIds),
    ).size,
    sourceCoverageRowCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceCoverageRowIds),
    ).size,
    sourceHandoffCardCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.sourceHandoffCardIds),
    ).size,
    matchedStaticReviewCheckCount: new Set(
      rehearsalPromptRows.flatMap((row) => row.matchedStaticReviewCheckIds),
    ).size,
    localOnlyRehearsalPromptRowCount: rehearsalPromptRows.filter(
      (row) => row.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceReadinessRehearsalStaticNonGoalFlagsView {
  return {
    noSavedSourceReadinessRehearsalProgress: true,
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

function staticSourceReadinessRehearsalItemFlags() {
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
