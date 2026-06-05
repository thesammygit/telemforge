import type {
  ReviewObservationHandoffSourceCrosswalkRowView,
  ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
  ReviewObservationHandoffSourceCrosswalkView,
  ReviewObservationHandoffSourceWalkthroughSectionView,
  ReviewObservationHandoffSourceWalkthroughStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceWalkthroughStaticReviewPromptRowView,
  ReviewObservationHandoffSourceWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceWalkthrough(
  sourceReviewObservationHandoffSourceCrosswalk:
    | ReviewObservationHandoffSourceCrosswalkView
    | undefined,
): ReviewObservationHandoffSourceWalkthroughView | undefined {
  if (!sourceReviewObservationHandoffSourceCrosswalk?.sourceCrosswalkRows.length) {
    return undefined;
  }

  const walkthroughSections =
    sourceReviewObservationHandoffSourceCrosswalk.sourceCrosswalkRows.map(
      (row) => buildWalkthroughSection(row),
    );
  const staticReviewPrompts =
    sourceReviewObservationHandoffSourceCrosswalk.staticAnchorNotes.map(
      (note) =>
        buildStaticReviewPrompt(
          note,
          sourceReviewObservationHandoffSourceCrosswalk.sourceCrosswalkRows,
        ),
    );
  const defaultWalkthroughSection =
    walkthroughSections.find(
      (section) =>
        section.sourceCrosswalkRowId ===
        sourceReviewObservationHandoffSourceCrosswalk.defaultSourceCrosswalkRow
          .sourceCrosswalkRowId,
    ) ?? walkthroughSections[0];

  return {
    schema: "telemforge.review_observation_handoff_source_walkthrough.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source walkthrough and static review prompts",
    localStatus: sourceReviewObservationHandoffSourceCrosswalk.localStatus,
    summary: {
      sourceWalkthroughId:
        "candidate-local-review-observation-handoff-source-walkthrough",
      label: "Local observation handoff source walkthrough",
      summary:
        "A static source walkthrough and review-prompt surface derive from the Stage 50 source crosswalk rows and static anchor notes so reviewers can inspect ordered source paths, local anchor checkpoints, evidence callbacks, gap discussion points, and deferred-scope reminders before human review handoff without saved reviewer notes, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultSourceCrosswalkContext: {
        defaultSourceCrosswalkRowId:
          sourceReviewObservationHandoffSourceCrosswalk.defaultSourceCrosswalkRow
            .sourceCrosswalkRowId,
        defaultRelayStepId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultRelayStepId,
        defaultSynthesisRowId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultSynthesisRowId,
        defaultCalibrationCardId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultCalibrationCardId,
        defaultCueId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultCueId,
        defaultDebriefPromptId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultDebriefPromptId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.defaultAnchorTargetId,
        sourceCrosswalkSummary:
          sourceReviewObservationHandoffSourceCrosswalk.summary.summary,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.sourceRelayTrailSummary,
        sourceSynthesisSummary:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.sourceSynthesisSummary,
        sourceCalibrationSummary:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.sourceCalibrationSummary,
        sourceDriftGuardSummary:
          sourceReviewObservationHandoffSourceCrosswalk.summary
            .defaultRelayContext.sourceDriftGuardSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceReviewObservationHandoffSourceCrosswalk,
        walkthroughSections,
        staticReviewPrompts,
      ),
    },
    defaultWalkthroughSection,
    walkthroughSections,
    staticReviewPrompts,
    staticSourceWalkthroughSummary:
      "Stage 51 source walkthrough sections and static review prompts are deterministic, local, static, source-backed, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer notes, source walkthrough progress, source inspection state, anchor state, relay progress, inspection state, synthesis state, calibration state, drift state, review sessions, reviewer progress, debrief notes, continuity progress, follow-up progress, follow-up ownership, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceCrosswalk,
  };
}

function buildWalkthroughSection(
  row: ReviewObservationHandoffSourceCrosswalkRowView,
): ReviewObservationHandoffSourceWalkthroughSectionView {
  return {
    sourceWalkthroughSectionId: `review-observation-handoff-source-walkthrough:${row.sourceCrosswalkRowId}`,
    sectionNumber: row.rowNumber,
    label: `${row.label} walkthrough`,
    summary:
      `Source walkthrough section ${row.rowNumber} preserves Stage 50 source crosswalk row order for ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion points, and ${row.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer notes, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    reviewPrompt:
      `Walk ${row.sourceCrosswalkRowId} through source ids ${row.sourceIds.join(", ")} and local anchors ${row.anchorTargetIds.join(", ")}; discuss evidence callbacks, gap prompts, deferred-scope reminders, and static non-goal boundaries without saving progress, assigning owners, launching tasks, routing, exporting, signing off, scoring, certifying, or executing commands.`,
    sourceCrosswalkRowId: row.sourceCrosswalkRowId,
    sourceCrosswalkRowIds: [row.sourceCrosswalkRowId],
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
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceWalkthroughItemFlags(),
  };
}

function buildStaticReviewPrompt(
  note: ReviewObservationHandoffSourceCrosswalkStaticAnchorNoteEntryView,
  sourceCrosswalkRows: ReviewObservationHandoffSourceCrosswalkRowView[],
): ReviewObservationHandoffSourceWalkthroughStaticReviewPromptRowView {
  const matchedRows = sourceCrosswalkRows.filter((row) =>
    note.matchedSourceCrosswalkRowIds.includes(row.sourceCrosswalkRowId),
  );
  const matchedSourceWalkthroughSectionIds = matchedRows.map(
    (row) =>
      `review-observation-handoff-source-walkthrough:${row.sourceCrosswalkRowId}`,
  );

  return {
    staticReviewPromptRowId: `review-observation-handoff-source-walkthrough:prompt:${note.staticAnchorNoteEntryId}`,
    promptOrder: note.anchorOrder,
    sourceStaticAnchorNoteId: note.staticAnchorNoteEntryId,
    sourceStaticAnchorNoteIds: [note.staticAnchorNoteEntryId],
    sourceStaticInspectionNoteId: note.sourceStaticInspectionNoteId,
    sourceStaticInspectionNoteIds: note.sourceStaticInspectionNoteIds,
    sourceRelayNoteId: note.sourceRelayNoteId,
    sourceRelayNoteIds: note.sourceRelayNoteIds,
    matchedSourceCrosswalkRowIds: note.matchedSourceCrosswalkRowIds,
    matchedSourceWalkthroughSectionIds,
    sourceRelayStepIds: matchedRows.map((row) => row.sourceRelayStepId),
    sourceLocalAnchorHrefs: [note.localAnchorHref],
    sourceAnchorTargetIds: note.sourceAnchorTargetIds,
    localAnchorHref: note.localAnchorHref,
    anchorTargetId: note.anchorTargetId,
    label: `${note.label} review prompt`,
    summary:
      `Static review prompt ${note.anchorOrder} preserves Stage 50 static anchor note order for ${note.staticAnchorNoteEntryId}, ${note.sourceStaticInspectionNoteId}, ${matchedSourceWalkthroughSectionIds.length} matched walkthrough sections, ${note.localAnchorHref}, and anchor ${note.anchorTargetId}; it is local source walkthrough context only, not saved reviewer notes, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, task launcher, runnable checklist, ticket, route, report, handoff package, signoff, audit record, score, certification, meeting workflow, export, or command.`,
    prompt:
      `Discuss ${note.sourceStaticInspectionNoteId}, matched rows ${note.matchedSourceCrosswalkRowIds.join(", ")}, evidence callbacks ${note.evidenceCallbackIds.length}, gap points ${note.gapDiscussionPointIds.length}, and deferred reminders ${note.deferredScopeReminderIds.length} as static review context only.`,
    evidenceCallbackIds: note.evidenceCallbackIds,
    gapDiscussionPointIds: note.gapDiscussionPointIds,
    deferredScopeReminderIds: note.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticSourceWalkthroughItemFlags(),
  };
}

function buildCounts(
  sourceReviewObservationHandoffSourceCrosswalk: ReviewObservationHandoffSourceCrosswalkView,
  walkthroughSections: ReviewObservationHandoffSourceWalkthroughSectionView[],
  staticReviewPrompts: ReviewObservationHandoffSourceWalkthroughStaticReviewPromptRowView[],
): ReviewObservationHandoffSourceWalkthroughView["summary"]["counts"] {
  return {
    walkthroughSectionCount: walkthroughSections.length,
    staticReviewPromptCount: staticReviewPrompts.length,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceCrosswalk.sourceCrosswalkRows.length,
    staticAnchorNoteCount:
      sourceReviewObservationHandoffSourceCrosswalk.staticAnchorNotes.length,
    sourceRelayStepCount:
      sourceReviewObservationHandoffSourceCrosswalk.summary.counts
        .sourceRelayStepCount,
    sourceInspectionReferenceCount: walkthroughSections.reduce(
      (count, section) => count + section.sourceInspectionReferenceIds.length,
      0,
    ),
    sourceSynthesisRowCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceSynthesisRowIds),
    ).size,
    sourceCalibrationCardCount: new Set(
      walkthroughSections.flatMap(
        (section) => section.sourceCalibrationCardIds,
      ),
    ).size,
    sourceAlignmentNoteCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceAlignmentNoteIds),
    ).size,
    sourceCueCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceCueIds),
    ).size,
    sourceDebriefPromptCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceDebriefPromptIds),
    ).size,
    sourceFollowUpMapEntryCount: new Set(
      walkthroughSections.flatMap(
        (section) => section.sourceFollowUpMapEntryIds,
      ),
    ).size,
    sourcePathStepCount: new Set(
      walkthroughSections.flatMap((section) => section.sourcePathStepIds),
    ).size,
    sourceAgendaSectionCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceAgendaSectionIds),
    ).size,
    sourcePromptGroupCount: new Set(
      walkthroughSections.flatMap((section) => section.sourcePromptGroupIds),
    ).size,
    sourceCoverageRowCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceCoverageRowIds),
    ).size,
    sourceHandoffCardCount: new Set(
      walkthroughSections.flatMap((section) => section.sourceHandoffCardIds),
    ).size,
    localOnlyWalkthroughSectionCount: walkthroughSections.filter(
      (section) => section.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceWalkthroughStaticNonGoalFlagsView {
  return {
    noSavedReviewerNotes: true,
    noSavedRelayProgress: true,
    noSavedInspectionState: true,
    noSavedSourceWalkthroughProgress: true,
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

function staticSourceWalkthroughItemFlags() {
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
