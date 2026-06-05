import type {
  ReviewObservationHandoffSourceReadoutRowView,
  ReviewObservationHandoffSourceReadoutStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadoutStaticReviewCueRowView,
  ReviewObservationHandoffSourceReadoutView,
  ReviewObservationHandoffSourceWalkthroughSectionView,
  ReviewObservationHandoffSourceWalkthroughStaticReviewPromptRowView,
  ReviewObservationHandoffSourceWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadout(
  sourceReviewObservationHandoffSourceWalkthrough:
    | ReviewObservationHandoffSourceWalkthroughView
    | undefined,
): ReviewObservationHandoffSourceReadoutView | undefined {
  if (!sourceReviewObservationHandoffSourceWalkthrough?.walkthroughSections.length) {
    return undefined;
  }

  const sourceReadoutRows =
    sourceReviewObservationHandoffSourceWalkthrough.walkthroughSections.map(
      (section) => buildSourceReadoutRow(section),
    );
  const staticReviewCues =
    sourceReviewObservationHandoffSourceWalkthrough.staticReviewPrompts.map(
      (prompt) => buildStaticReviewCue(prompt),
    );
  const defaultSourceReadoutRow =
    sourceReadoutRows.find(
      (row) =>
        row.sourceWalkthroughSectionId ===
        sourceReviewObservationHandoffSourceWalkthrough
          .defaultWalkthroughSection.sourceWalkthroughSectionId,
    ) ?? sourceReadoutRows[0];

  return {
    schema: "telemforge.review_observation_handoff_source_readout.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readout and static review cues",
    localStatus: sourceReviewObservationHandoffSourceWalkthrough.localStatus,
    summary: {
      sourceReadoutId:
        "candidate-local-review-observation-handoff-source-readout",
      label: "Local observation handoff source readout",
      summary:
        "A static source readout and review-cue surface derive from the Stage 51 source walkthrough sections and static review prompts so reviewers can scan ordered source-backed walkthrough paths, local anchors, evidence callbacks, gap prompts, and deferred-scope reminders before human review handoff without saved reviewer notes, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultSourceWalkthroughContext: {
        defaultSourceWalkthroughSectionId:
          sourceReviewObservationHandoffSourceWalkthrough
            .defaultWalkthroughSection.sourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultRelayStepId,
        defaultSynthesisRowId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultSynthesisRowId,
        defaultCalibrationCardId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultCalibrationCardId,
        defaultCueId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultCueId,
        defaultDebriefPromptId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.defaultAnchorTargetId,
        sourceWalkthroughSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary.summary,
        sourceCrosswalkSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.sourceRelayTrailSummary,
        sourceSynthesisSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.sourceSynthesisSummary,
        sourceCalibrationSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceReviewObservationHandoffSourceWalkthrough.summary
            .defaultSourceCrosswalkContext.sourceDriftGuardSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceReviewObservationHandoffSourceWalkthrough,
        sourceReadoutRows,
        staticReviewCues,
      ),
    },
    defaultSourceReadoutRow,
    sourceReadoutRows,
    staticReviewCues,
    staticSourceReadoutSummary:
      "Stage 52 source readout rows and static review cues are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, inspection state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceWalkthrough,
  };
}

function buildSourceReadoutRow(
  section: ReviewObservationHandoffSourceWalkthroughSectionView,
): ReviewObservationHandoffSourceReadoutRowView {
  return {
    sourceReadoutRowId: `review-observation-handoff-source-readout:${section.sourceWalkthroughSectionId}`,
    rowNumber: section.sectionNumber,
    label: `${section.label} readout`,
    summary:
      `Source readout row ${section.sectionNumber} preserves Stage 51 source walkthrough section order for ${section.sourceWalkthroughSectionId}, ${section.sourceCrosswalkRowId}, ${section.sourceRelayStepId}, ${section.sourceInspectionReferenceIds.length} source inspection references, ${section.localAnchorHrefs.length} local anchors, ${section.evidenceCallbackIds.length} evidence callbacks, ${section.gapDiscussionPointIds.length} gap discussion points, and ${section.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer notes, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    readoutCue:
      `Read out ${section.sourceWalkthroughSectionId} with source ids ${section.sourceIds.join(", ")} and anchors ${section.anchorTargetIds.join(", ")}; keep the discussion static, local, explanatory, non-persistent, non-routing, non-ranking, non-certifying, non-executable, and non-actionable.`,
    sourceWalkthroughSectionId: section.sourceWalkthroughSectionId,
    sourceWalkthroughSectionIds: [section.sourceWalkthroughSectionId],
    sourceCrosswalkRowId: section.sourceCrosswalkRowId,
    sourceCrosswalkRowIds: section.sourceCrosswalkRowIds,
    sourceRelayStepId: section.sourceRelayStepId,
    sourceRelayStepIds: section.sourceRelayStepIds,
    sourceInspectionReferenceIds: section.sourceInspectionReferenceIds,
    sourceKinds: section.sourceKinds,
    sourceIds: section.sourceIds,
    sourceLabels: section.sourceLabels,
    localAnchorHrefs: section.localAnchorHrefs,
    anchorTargetIds: section.anchorTargetIds,
    sourceSynthesisRowIds: section.sourceSynthesisRowIds,
    sourceCalibrationCardIds: section.sourceCalibrationCardIds,
    sourceAlignmentNoteIds: section.sourceAlignmentNoteIds,
    sourceCueIds: section.sourceCueIds,
    sourceDebriefPromptIds: section.sourceDebriefPromptIds,
    sourceFollowUpMapEntryIds: section.sourceFollowUpMapEntryIds,
    sourcePathStepIds: section.sourcePathStepIds,
    sourceAgendaSectionIds: section.sourceAgendaSectionIds,
    sourcePromptGroupIds: section.sourcePromptGroupIds,
    sourceCoverageRowIds: section.sourceCoverageRowIds,
    sourceHandoffCardIds: section.sourceHandoffCardIds,
    evidenceCallbackIds: section.evidenceCallbackIds,
    gapDiscussionPointIds: section.gapDiscussionPointIds,
    deferredScopeReminderIds: section.deferredScopeReminderIds,
    staticNonGoalContexts: section.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadoutItemFlags(),
  };
}

function buildStaticReviewCue(
  prompt: ReviewObservationHandoffSourceWalkthroughStaticReviewPromptRowView,
): ReviewObservationHandoffSourceReadoutStaticReviewCueRowView {
  return {
    staticReviewCueRowId: `review-observation-handoff-source-readout:cue:${prompt.staticReviewPromptRowId}`,
    cueOrder: prompt.promptOrder,
    sourceStaticReviewPromptId: prompt.staticReviewPromptRowId,
    sourceStaticReviewPromptIds: [prompt.staticReviewPromptRowId],
    sourceStaticAnchorNoteId: prompt.sourceStaticAnchorNoteId,
    sourceStaticAnchorNoteIds: prompt.sourceStaticAnchorNoteIds,
    sourceStaticInspectionNoteId: prompt.sourceStaticInspectionNoteId,
    sourceStaticInspectionNoteIds: prompt.sourceStaticInspectionNoteIds,
    sourceRelayNoteId: prompt.sourceRelayNoteId,
    sourceRelayNoteIds: prompt.sourceRelayNoteIds,
    matchedSourceWalkthroughSectionIds:
      prompt.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: prompt.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: prompt.sourceRelayStepIds,
    sourceLocalAnchorHrefs: prompt.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: prompt.sourceAnchorTargetIds,
    localAnchorHref: prompt.localAnchorHref,
    anchorTargetId: prompt.anchorTargetId,
    label: `${prompt.label} cue`,
    summary:
      `Static review cue ${prompt.promptOrder} preserves Stage 51 static review prompt order for ${prompt.staticReviewPromptRowId}, ${prompt.sourceStaticAnchorNoteId}, ${prompt.sourceStaticInspectionNoteId}, ${prompt.sourceRelayNoteId}, ${prompt.matchedSourceWalkthroughSectionIds.length} matched walkthrough sections, ${prompt.localAnchorHref}, and anchor ${prompt.anchorTargetId}; it is local source readout context only, not saved reviewer notes, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    cue:
      `Use ${prompt.staticReviewPromptRowId} to ask reviewers to compare matched walkthrough sections ${prompt.matchedSourceWalkthroughSectionIds.join(", ")} against callbacks ${prompt.evidenceCallbackIds.length}, gap prompts ${prompt.gapDiscussionPointIds.length}, and deferred reminders ${prompt.deferredScopeReminderIds.length} as static readout context only.`,
    evidenceCallbackIds: prompt.evidenceCallbackIds,
    gapDiscussionPointIds: prompt.gapDiscussionPointIds,
    deferredScopeReminderIds: prompt.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceReadoutItemFlags(),
  };
}

function buildCounts(
  sourceReviewObservationHandoffSourceWalkthrough: ReviewObservationHandoffSourceWalkthroughView,
  sourceReadoutRows: ReviewObservationHandoffSourceReadoutRowView[],
  staticReviewCues: ReviewObservationHandoffSourceReadoutStaticReviewCueRowView[],
): ReviewObservationHandoffSourceReadoutView["summary"]["counts"] {
  return {
    sourceReadoutRowCount: sourceReadoutRows.length,
    staticReviewCueCount: staticReviewCues.length,
    sourceWalkthroughSectionCount:
      sourceReviewObservationHandoffSourceWalkthrough.walkthroughSections.length,
    staticReviewPromptCount:
      sourceReviewObservationHandoffSourceWalkthrough.staticReviewPrompts
        .length,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceWalkthrough.summary.counts
        .sourceCrosswalkRowCount,
    sourceInspectionReferenceCount: sourceReadoutRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    sourceSynthesisRowCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceSynthesisRowIds),
    ).size,
    sourceCalibrationCardCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceCalibrationCardIds),
    ).size,
    sourceAlignmentNoteCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceAlignmentNoteIds),
    ).size,
    sourceCueCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceCueIds),
    ).size,
    sourceDebriefPromptCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceDebriefPromptIds),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceFollowUpMapEntryIds),
    ).size,
    sourcePathStepCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourcePathStepIds),
    ).size,
    sourceAgendaSectionCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceAgendaSectionIds),
    ).size,
    sourcePromptGroupCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourcePromptGroupIds),
    ).size,
    sourceCoverageRowCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceCoverageRowIds),
    ).size,
    sourceHandoffCardCount: new Set(
      sourceReadoutRows.flatMap((row) => row.sourceHandoffCardIds),
    ).size,
    localOnlySourceReadoutRowCount: sourceReadoutRows.filter(
      (row) => row.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceReadoutStaticNonGoalFlagsView {
  return {
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

function staticSourceReadoutItemFlags() {
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
