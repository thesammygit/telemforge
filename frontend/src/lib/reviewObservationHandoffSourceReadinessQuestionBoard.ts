import type {
  ReviewObservationHandoffSourceReadinessQuestionBoardStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessQuestionBoardView,
  ReviewObservationHandoffSourceReadinessQuestionRowView,
  ReviewObservationHandoffSourceReadinessRehearsalPromptRowView,
  ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView,
  ReviewObservationHandoffSourceReadinessRehearsalView,
  ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessQuestionBoard(
  sourceReviewObservationHandoffSourceReadinessRehearsal:
    | ReviewObservationHandoffSourceReadinessRehearsalView
    | undefined,
): ReviewObservationHandoffSourceReadinessQuestionBoardView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessRehearsal
      ?.rehearsalPromptRows.length
  ) {
    return undefined;
  }

  const questionRows =
    sourceReviewObservationHandoffSourceReadinessRehearsal.rehearsalPromptRows.map(
      (row) =>
        buildQuestionRow(
          row,
          sourceReviewObservationHandoffSourceReadinessRehearsal
            .staticReviewerPromptChecks,
        ),
    );
  const staticFollowUpPrompts =
    sourceReviewObservationHandoffSourceReadinessRehearsal.staticReviewerPromptChecks.map(
      (check) =>
        buildStaticFollowUpPrompt(
          check,
          sourceReviewObservationHandoffSourceReadinessRehearsal
            .rehearsalPromptRows,
        ),
    );
  const defaultQuestionRow =
    questionRows.find(
      (row) =>
        row.sourceReadinessRehearsalPromptRowId ===
        sourceReviewObservationHandoffSourceReadinessRehearsal
          .defaultRehearsalPromptRow.sourceReadinessRehearsalPromptRowId,
    ) ?? questionRows[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_question_board.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness question board and static follow-up prompts",
    localStatus: sourceReviewObservationHandoffSourceReadinessRehearsal.localStatus,
    summary: {
      sourceReadinessQuestionBoardId:
        "candidate-local-review-observation-handoff-source-readiness-question-board",
      label: "Local observation handoff source readiness question board",
      summary:
        "A static source readiness question board derives from the Stage 54 source readiness rehearsal prompts and static reviewer prompt checks so reviewers can inspect ordered prompts, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, and source-backed follow-up questions before human handoff without saved reviewer answers, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultQuestionContext: {
        defaultQuestionRowId: defaultQuestionRow.sourceReadinessQuestionRowId,
        defaultRehearsalPromptRowId:
          sourceReviewObservationHandoffSourceReadinessRehearsal
            .defaultRehearsalPromptRow.sourceReadinessRehearsalPromptRowId,
        defaultSourceReadinessRowId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultSourceReadinessRowId,
        defaultSourceReadoutRowId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultSourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultRelayStepId,
        defaultAnchorTargetId:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.defaultAnchorTargetId,
        sourceReadinessRehearsalSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .summary,
        sourceReadinessSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.sourceReadinessSummary,
        sourceReadoutSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.sourceReadoutSummary,
        sourceWalkthroughSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          sourceReviewObservationHandoffSourceReadinessRehearsal.summary
            .defaultSourceReadinessContext.sourceRelayTrailSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        questionRows,
        staticFollowUpPrompts,
        sourceReviewObservationHandoffSourceReadinessRehearsal,
      ),
    },
    defaultQuestionRow,
    questionRows,
    staticFollowUpPrompts,
    staticSourceReadinessQuestionBoardSummary:
      "Stage 55 source readiness question rows and static follow-up prompts are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, source readiness question progress, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessRehearsal,
  };
}

function buildQuestionRow(
  row: ReviewObservationHandoffSourceReadinessRehearsalPromptRowView,
  staticReviewerPromptChecks: ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView[],
): ReviewObservationHandoffSourceReadinessQuestionRowView {
  const matchedStaticReviewerPromptChecks = staticReviewerPromptChecks.filter(
    (check) =>
      row.matchedStaticReviewCheckIds.includes(
        check.sourceStaticReviewCheckRowId,
      ),
  );

  return {
    sourceReadinessQuestionRowId: `review-observation-handoff-source-readiness-question:${row.sourceReadinessRehearsalPromptRowId}`,
    questionOrder: row.promptOrder,
    label: `${row.label} question`,
    summary:
      `Source readiness question ${row.promptOrder} preserves Stage 54 rehearsal prompt row order for ${row.sourceReadinessRehearsalPromptRowId}, ${row.sourceReadinessRowId}, ${row.sourceReadoutRowId}, ${row.sourceWalkthroughSectionId}, ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion prompts, ${row.deferredScopeReminderIds.length} deferred-scope reminders, ${row.matchedStaticReviewCheckIds.length} matched static review checks, ${matchedStaticReviewerPromptChecks.length} matched static reviewer prompt rows, and ${row.staticReviewCueIds.length} static review cues without saved reviewer answers, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    reviewerPrompt: row.reviewerPrompt,
    followUpQuestion:
      `Before handoff, ask which source-backed evidence callback, gap discussion prompt, or deferred-scope reminder should be mentioned for ${row.sourceReadinessRowId} while keeping the question static and unsaved.`,
    sourceReadinessRehearsalPromptRowId:
      row.sourceReadinessRehearsalPromptRowId,
    sourceReadinessRehearsalPromptRowIds: [
      row.sourceReadinessRehearsalPromptRowId,
    ],
    sourceReadinessRowId: row.sourceReadinessRowId,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
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
    matchedStaticReviewCheckIds: row.matchedStaticReviewCheckIds,
    matchedStaticReviewerPromptCheckRowIds:
      matchedStaticReviewerPromptChecks.map(
        (check) => check.staticReviewerPromptCheckRowId,
      ),
    staticReviewCueIds: row.staticReviewCueIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticQuestionBoardItemFlags(),
  };
}

function buildStaticFollowUpPrompt(
  check: ReviewObservationHandoffSourceReadinessRehearsalStaticReviewerPromptCheckRowView,
  rehearsalPromptRows: ReviewObservationHandoffSourceReadinessRehearsalPromptRowView[],
): ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView {
  const matchedRehearsalPromptRows = rehearsalPromptRows.filter((row) =>
    check.matchedSourceReadinessRowIds.includes(row.sourceReadinessRowId),
  );

  return {
    sourceReadinessStaticFollowUpPromptRowId: `review-observation-handoff-source-readiness-question:follow-up:${check.staticReviewerPromptCheckRowId}`,
    followUpOrder: check.checkOrder,
    sourceStaticReviewerPromptCheckRowId: check.staticReviewerPromptCheckRowId,
    sourceStaticReviewerPromptCheckRowIds: [
      check.staticReviewerPromptCheckRowId,
    ],
    sourceStaticReviewCheckRowId: check.sourceStaticReviewCheckRowId,
    sourceStaticReviewCheckRowIds: check.sourceStaticReviewCheckRowIds,
    sourceStaticReviewCueRowIds: check.sourceStaticReviewCueRowIds,
    matchedRehearsalPromptRowIds: matchedRehearsalPromptRows.map(
      (row) => row.sourceReadinessRehearsalPromptRowId,
    ),
    matchedSourceReadinessRowIds: check.matchedSourceReadinessRowIds,
    matchedSourceReadoutRowIds: check.matchedSourceReadoutRowIds,
    matchedSourceWalkthroughSectionIds:
      check.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: check.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: check.sourceRelayStepIds,
    sourceLocalAnchorHrefs: check.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: check.sourceAnchorTargetIds,
    localAnchorHref: check.localAnchorHref,
    anchorTargetId: check.anchorTargetId,
    label: `${check.label} follow-up`,
    summary:
      `Static follow-up prompt ${check.checkOrder} preserves Stage 54 static reviewer prompt check order for ${check.staticReviewerPromptCheckRowId}, ${check.sourceStaticReviewCheckRowId}, ${check.sourceStaticReviewCueRowIds.join(", ")}, ${matchedRehearsalPromptRows.length} matched rehearsal prompts, ${check.matchedSourceReadinessRowIds.length} matched source readiness rows, ${check.matchedSourceReadoutRowIds.length} matched source readout rows, ${check.matchedSourceWalkthroughSectionIds.length} walkthrough sections, ${check.matchedSourceCrosswalkRowIds.length} crosswalk rows, ${check.sourceLocalAnchorHrefs.length} local anchors, ${check.evidenceCallbackIds.length} evidence callbacks, ${check.gapDiscussionPointIds.length} gap discussion prompts, and ${check.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer answers, saved source readiness question progress, saved source readiness rehearsal progress, owner assignment, task launchers, runnable checklists, tickets, routes, reports, handoff packages, signoff, audit records, scores, certification, meeting workflow, exports, or commands.`,
    reviewerPrompt: check.reviewerPrompt,
    followUpPrompt:
      `Ask reviewers what ${check.sourceStaticReviewCheckRowId} should clarify across matched rehearsal prompts ${matchedRehearsalPromptRows.map((row) => row.sourceReadinessRehearsalPromptRowId).join(", ")} as static local follow-up context only.`,
    evidenceCallbackIds: check.evidenceCallbackIds,
    gapDiscussionPointIds: check.gapDiscussionPointIds,
    deferredScopeReminderIds: check.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticQuestionBoardItemFlags(),
  };
}

function buildCounts(
  questionRows: ReviewObservationHandoffSourceReadinessQuestionRowView[],
  staticFollowUpPrompts: ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView[],
  sourceReviewObservationHandoffSourceReadinessRehearsal: ReviewObservationHandoffSourceReadinessRehearsalView,
): ReviewObservationHandoffSourceReadinessQuestionBoardView["summary"]["counts"] {
  return {
    questionRowCount: questionRows.length,
    staticFollowUpPromptCount: staticFollowUpPrompts.length,
    rehearsalPromptRowCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal.rehearsalPromptRows
        .length,
    staticReviewerPromptCheckCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal
        .staticReviewerPromptChecks.length,
    sourceReadinessRowCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal.summary.counts
        .sourceReadinessRowCount,
    sourceReadoutRowCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal.summary.counts
        .sourceReadoutRowCount,
    sourceWalkthroughSectionCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal.summary.counts
        .sourceWalkthroughSectionCount,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceReadinessRehearsal.summary.counts
        .sourceCrosswalkRowCount,
    sourceRelayStepCount: new Set(
      questionRows.flatMap((row) => row.sourceRelayStepIds),
    ).size,
    sourceInspectionReferenceCount: questionRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    evidenceCallbackCount: questionRows.reduce(
      (count, row) => count + row.evidenceCallbackIds.length,
      0,
    ),
    gapDiscussionPointCount: questionRows.reduce(
      (count, row) => count + row.gapDiscussionPointIds.length,
      0,
    ),
    deferredScopeReminderCount: questionRows.reduce(
      (count, row) => count + row.deferredScopeReminderIds.length,
      0,
    ),
    matchedStaticReviewCheckCount: new Set(
      questionRows.flatMap((row) => row.matchedStaticReviewCheckIds),
    ).size,
    matchedStaticReviewerPromptCheckRowCount: new Set(
      questionRows.flatMap(
        (row) => row.matchedStaticReviewerPromptCheckRowIds,
      ),
    ).size,
    staticReviewCueCount: new Set(
      questionRows.flatMap((row) => row.staticReviewCueIds),
    ).size,
    localOnlyQuestionRowCount: questionRows.filter((row) => row.localOnly)
      .length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceReadinessQuestionBoardStaticNonGoalFlagsView {
  return {
    noSavedReviewerAnswers: true,
    noSavedSourceReadinessQuestionProgress: true,
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

function staticQuestionBoardItemFlags() {
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
