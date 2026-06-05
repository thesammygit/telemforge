import type {
  ReviewObservationHandoffSourceReadinessQuestionBoardView,
  ReviewObservationHandoffSourceReadinessQuestionRowView,
  ReviewObservationHandoffSourceReadinessResponseMatrixStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseMatrixView,
  ReviewObservationHandoffSourceReadinessResponseRowView,
  ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView,
  ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseMatrix(
  sourceReviewObservationHandoffSourceReadinessQuestionBoard:
    | ReviewObservationHandoffSourceReadinessQuestionBoardView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseMatrixView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessQuestionBoard?.questionRows
      .length
  ) {
    return undefined;
  }

  const responseRows =
    sourceReviewObservationHandoffSourceReadinessQuestionBoard.questionRows.map(
      (row) =>
        buildResponseRow(
          row,
          sourceReviewObservationHandoffSourceReadinessQuestionBoard
            .staticFollowUpPrompts,
        ),
    );
  const staticEvidenceNotes =
    sourceReviewObservationHandoffSourceReadinessQuestionBoard.staticFollowUpPrompts.map(
      (prompt) =>
        buildStaticEvidenceNote(
          prompt,
          sourceReviewObservationHandoffSourceReadinessQuestionBoard
            .questionRows,
        ),
    );
  const defaultResponseRow =
    responseRows.find(
      (row) =>
        row.sourceReadinessQuestionRowId ===
        sourceReviewObservationHandoffSourceReadinessQuestionBoard
          .defaultQuestionRow.sourceReadinessQuestionRowId,
    ) ?? responseRows[0];
  const defaultQuestionContext =
    sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary
      .defaultQuestionContext;

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_matrix.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response matrix and static evidence notes",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.localStatus,
    summary: {
      sourceReadinessResponseMatrixId:
        "candidate-local-review-observation-handoff-source-readiness-response-matrix",
      label: "Local observation handoff source readiness response matrix",
      summary:
        "A static source readiness response matrix derives from the Stage 55 source readiness question rows and static follow-up prompts so reviewers can inspect ordered questions, matched static follow-ups, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, and response-note cues before human handoff without saved reviewer answers, saved response progress, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultResponseContext: {
        defaultResponseRowId:
          defaultResponseRow.sourceReadinessResponseRowId,
        defaultQuestionRowId: defaultQuestionContext.defaultQuestionRowId,
        defaultRehearsalPromptRowId:
          defaultQuestionContext.defaultRehearsalPromptRowId,
        defaultSourceReadinessRowId:
          defaultQuestionContext.defaultSourceReadinessRowId,
        defaultSourceReadoutRowId:
          defaultQuestionContext.defaultSourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          defaultQuestionContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          defaultQuestionContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId: defaultQuestionContext.defaultRelayStepId,
        defaultAnchorTargetId: defaultQuestionContext.defaultAnchorTargetId,
        sourceReadinessQuestionBoardSummary:
          sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary
            .summary,
        sourceReadinessRehearsalSummary:
          defaultQuestionContext.sourceReadinessRehearsalSummary,
        sourceReadinessSummary: defaultQuestionContext.sourceReadinessSummary,
        sourceReadoutSummary: defaultQuestionContext.sourceReadoutSummary,
        sourceWalkthroughSummary:
          defaultQuestionContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary: defaultQuestionContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          defaultQuestionContext.sourceRelayTrailSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseRows,
        staticEvidenceNotes,
        sourceReviewObservationHandoffSourceReadinessQuestionBoard,
      ),
    },
    defaultResponseRow,
    responseRows,
    staticEvidenceNotes,
    staticSourceReadinessResponseMatrixSummary:
      "Stage 56 source readiness response rows and static evidence notes are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, source readiness response progress, source readiness question progress, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessQuestionBoard,
  };
}

function buildResponseRow(
  row: ReviewObservationHandoffSourceReadinessQuestionRowView,
  staticFollowUpPrompts: ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView[],
): ReviewObservationHandoffSourceReadinessResponseRowView {
  const matchedStaticFollowUpPrompts = staticFollowUpPrompts.filter((prompt) =>
    row.matchedStaticReviewerPromptCheckRowIds.includes(
      prompt.sourceStaticReviewerPromptCheckRowId,
    ),
  );

  return {
    sourceReadinessResponseRowId: `review-observation-handoff-source-readiness-response:${row.sourceReadinessQuestionRowId}`,
    responseOrder: row.questionOrder,
    label: `${row.label} response`,
    summary:
      `Source readiness response row ${row.questionOrder} preserves Stage 55 question row order for ${row.sourceReadinessQuestionRowId}, ${row.sourceReadinessRehearsalPromptRowId}, ${row.sourceReadinessRowId}, ${row.sourceReadoutRowId}, ${row.sourceWalkthroughSectionId}, ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion prompts, ${row.deferredScopeReminderIds.length} deferred-scope reminders, ${row.matchedStaticReviewCheckIds.length} matched static review checks, ${row.matchedStaticReviewerPromptCheckRowIds.length} matched static reviewer prompt rows, ${matchedStaticFollowUpPrompts.length} matched static follow-up prompts, and ${row.staticReviewCueIds.length} static review cues without saved reviewer answers, saved response progress, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    reviewerPromptText: row.reviewerPrompt,
    followUpQuestionText: row.followUpQuestion,
    responseNoteCue:
      `Draft static response context for ${row.sourceReadinessQuestionRowId} by citing callbacks ${row.evidenceCallbackIds.join(", ")}, gap prompts ${row.gapDiscussionPointIds.join(", ")}, deferred reminders ${row.deferredScopeReminderIds.join(", ")}, anchors ${row.anchorTargetIds.join(", ")}, and matched follow-ups ${matchedStaticFollowUpPrompts.map((prompt) => prompt.sourceReadinessStaticFollowUpPromptRowId).join(", ")} without saving answers or reviewer progress.`,
    sourceReadinessQuestionRowId: row.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds: [row.sourceReadinessQuestionRowId],
    sourceReadinessRehearsalPromptRowId:
      row.sourceReadinessRehearsalPromptRowId,
    sourceReadinessRehearsalPromptRowIds:
      row.sourceReadinessRehearsalPromptRowIds,
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
      row.matchedStaticReviewerPromptCheckRowIds,
    matchedStaticFollowUpPromptRowIds: matchedStaticFollowUpPrompts.map(
      (prompt) => prompt.sourceReadinessStaticFollowUpPromptRowId,
    ),
    staticReviewCueIds: row.staticReviewCueIds,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticResponseMatrixItemFlags(),
  };
}

function buildStaticEvidenceNote(
  prompt: ReviewObservationHandoffSourceReadinessStaticFollowUpPromptRowView,
  questionRows: ReviewObservationHandoffSourceReadinessQuestionRowView[],
): ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView {
  const matchedQuestionRows = questionRows.filter((row) =>
    row.matchedStaticReviewerPromptCheckRowIds.includes(
      prompt.sourceStaticReviewerPromptCheckRowId,
    ),
  );

  return {
    sourceReadinessStaticEvidenceNoteRowId: `review-observation-handoff-source-readiness-response:evidence-note:${prompt.sourceReadinessStaticFollowUpPromptRowId}`,
    evidenceNoteOrder: prompt.followUpOrder,
    sourceReadinessStaticFollowUpPromptRowId:
      prompt.sourceReadinessStaticFollowUpPromptRowId,
    sourceReadinessStaticFollowUpPromptRowIds: [
      prompt.sourceReadinessStaticFollowUpPromptRowId,
    ],
    sourceStaticReviewerPromptCheckRowId:
      prompt.sourceStaticReviewerPromptCheckRowId,
    sourceStaticReviewerPromptCheckRowIds:
      prompt.sourceStaticReviewerPromptCheckRowIds,
    sourceStaticReviewCheckRowId: prompt.sourceStaticReviewCheckRowId,
    sourceStaticReviewCheckRowIds: prompt.sourceStaticReviewCheckRowIds,
    sourceStaticReviewCueRowIds: prompt.sourceStaticReviewCueRowIds,
    matchedQuestionRowIds: matchedQuestionRows.map(
      (row) => row.sourceReadinessQuestionRowId,
    ),
    matchedRehearsalPromptRowIds: prompt.matchedRehearsalPromptRowIds,
    matchedSourceReadinessRowIds: prompt.matchedSourceReadinessRowIds,
    matchedSourceReadoutRowIds: prompt.matchedSourceReadoutRowIds,
    matchedSourceWalkthroughSectionIds:
      prompt.matchedSourceWalkthroughSectionIds,
    matchedSourceCrosswalkRowIds: prompt.matchedSourceCrosswalkRowIds,
    sourceRelayStepIds: prompt.sourceRelayStepIds,
    sourceLocalAnchorHrefs: prompt.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: prompt.sourceAnchorTargetIds,
    localAnchorHref: prompt.localAnchorHref,
    anchorTargetId: prompt.anchorTargetId,
    label: `${prompt.label} evidence note`,
    summary:
      `Static evidence note ${prompt.followUpOrder} preserves Stage 55 static follow-up prompt order for ${prompt.sourceReadinessStaticFollowUpPromptRowId}, ${prompt.sourceStaticReviewerPromptCheckRowId}, ${prompt.sourceStaticReviewCheckRowId}, ${prompt.sourceStaticReviewCueRowIds.join(", ")}, ${matchedQuestionRows.length} matched question rows, ${prompt.matchedRehearsalPromptRowIds.length} matched rehearsal prompts, ${prompt.matchedSourceReadinessRowIds.length} matched source readiness rows, ${prompt.matchedSourceReadoutRowIds.length} matched readout rows, ${prompt.matchedSourceWalkthroughSectionIds.length} walkthrough sections, ${prompt.matchedSourceCrosswalkRowIds.length} crosswalk rows, ${prompt.sourceLocalAnchorHrefs.length} local anchors, ${prompt.evidenceCallbackIds.length} evidence callbacks, ${prompt.gapDiscussionPointIds.length} gap discussion prompts, and ${prompt.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer answers, saved response progress, saved source readiness question progress, saved source readiness rehearsal progress, owner assignment, task launchers, runnable checklists, tickets, routes, reports, handoff packages, signoff, audit records, scores, certification, meeting workflow, exports, or commands.`,
    reviewerPromptText: prompt.reviewerPrompt,
    followUpPromptText: prompt.followUpPrompt,
    responseNoteCue:
      `Use ${prompt.sourceReadinessStaticFollowUpPromptRowId} as static evidence-note context for matched questions ${matchedQuestionRows.map((row) => row.sourceReadinessQuestionRowId).join(", ")} and anchor ${prompt.anchorTargetId}; do not store reviewer answers, response progress, owners, routes, exports, signoff, scores, certifications, task launchers, or commands.`,
    evidenceCallbackIds: prompt.evidenceCallbackIds,
    gapDiscussionPointIds: prompt.gapDiscussionPointIds,
    deferredScopeReminderIds: prompt.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticResponseMatrixItemFlags(),
  };
}

function buildCounts(
  responseRows: ReviewObservationHandoffSourceReadinessResponseRowView[],
  staticEvidenceNotes: ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView[],
  sourceReviewObservationHandoffSourceReadinessQuestionBoard: ReviewObservationHandoffSourceReadinessQuestionBoardView,
): ReviewObservationHandoffSourceReadinessResponseMatrixView["summary"]["counts"] {
  return {
    responseRowCount: responseRows.length,
    staticEvidenceNoteCount: staticEvidenceNotes.length,
    questionRowCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.questionRows
        .length,
    staticFollowUpPromptCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard
        .staticFollowUpPrompts.length,
    sourceReadinessRowCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary.counts
        .sourceReadinessRowCount,
    sourceReadoutRowCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary.counts
        .sourceReadoutRowCount,
    sourceWalkthroughSectionCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary.counts
        .sourceWalkthroughSectionCount,
    sourceCrosswalkRowCount:
      sourceReviewObservationHandoffSourceReadinessQuestionBoard.summary.counts
        .sourceCrosswalkRowCount,
    sourceRelayStepCount: new Set(
      responseRows.flatMap((row) => row.sourceRelayStepIds),
    ).size,
    sourceInspectionReferenceCount: responseRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    evidenceCallbackCount: responseRows.reduce(
      (count, row) => count + row.evidenceCallbackIds.length,
      0,
    ),
    gapDiscussionPointCount: responseRows.reduce(
      (count, row) => count + row.gapDiscussionPointIds.length,
      0,
    ),
    deferredScopeReminderCount: responseRows.reduce(
      (count, row) => count + row.deferredScopeReminderIds.length,
      0,
    ),
    matchedStaticReviewCheckCount: new Set(
      responseRows.flatMap((row) => row.matchedStaticReviewCheckIds),
    ).size,
    matchedStaticReviewerPromptCheckRowCount: new Set(
      responseRows.flatMap(
        (row) => row.matchedStaticReviewerPromptCheckRowIds,
      ),
    ).size,
    matchedStaticFollowUpPromptRowCount: new Set(
      responseRows.flatMap((row) => row.matchedStaticFollowUpPromptRowIds),
    ).size,
    staticReviewCueCount: new Set(
      responseRows.flatMap((row) => row.staticReviewCueIds),
    ).size,
    localOnlyResponseRowCount: responseRows.filter((row) => row.localOnly)
      .length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffSourceReadinessResponseMatrixStaticNonGoalFlagsView {
  return {
    noSavedSourceReadinessResponseProgress: true,
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

function staticResponseMatrixItemFlags() {
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
