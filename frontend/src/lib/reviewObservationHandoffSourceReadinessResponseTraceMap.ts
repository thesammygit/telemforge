import type {
  ReviewObservationHandoffSourceReadinessResponseTraceMapStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceMapView,
  ReviewObservationHandoffSourceReadinessResponseTraceRowView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticCueCardView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceMap(
  sourceReviewObservationHandoffSourceReadinessResponseWalkthrough:
    | ReviewObservationHandoffSourceReadinessResponseWalkthroughView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceMapView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseWalkthrough
      ?.walkthroughSteps.length
  ) {
    return undefined;
  }

  const responseTraceRows =
    sourceReviewObservationHandoffSourceReadinessResponseWalkthrough.walkthroughSteps.map(
      buildResponseTraceRow,
    );
  const staticSourceAlignmentNoteCards =
    sourceReviewObservationHandoffSourceReadinessResponseWalkthrough.staticReviewerCueCards.map(
      (card) => buildStaticSourceAlignmentNoteCard(card, responseTraceRows),
    );
  const defaultWalkthroughContext =
    sourceReviewObservationHandoffSourceReadinessResponseWalkthrough.summary
      .defaultResponseWalkthroughContext;
  const defaultTraceRow =
    responseTraceRows.find(
      (row) =>
        row.sourceReadinessResponseWalkthroughStepId ===
        defaultWalkthroughContext.defaultWalkthroughStepId,
    ) ?? responseTraceRows[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_map.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace map and static source alignment notes",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseWalkthrough
        .localStatus,
    summary: {
      sourceReadinessResponseTraceMapId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-map",
      label:
        "Local observation handoff source readiness response trace map",
      summary:
        "A static source readiness response trace map derives from Stage 57 response walkthrough steps and reviewer cue cards so reviewers can trace ordered response walkthrough steps back through response rows, question rows, evidence notes, static follow-up prompts, source anchors, callbacks, gap prompts, deferred reminders, response-note cues, reviewer cue text, and source alignment notes before human handoff without saved reviewer answers, saved response progress, saved response walkthrough progress, saved trace progress, saved question progress, saved rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultResponseTraceContext: {
        defaultTraceRowId: defaultTraceRow.sourceReadinessResponseTraceRowId,
        defaultWalkthroughStepId:
          defaultWalkthroughContext.defaultWalkthroughStepId,
        defaultResponseRowId: defaultWalkthroughContext.defaultResponseRowId,
        defaultQuestionRowId: defaultWalkthroughContext.defaultQuestionRowId,
        defaultRehearsalPromptRowId:
          defaultWalkthroughContext.defaultRehearsalPromptRowId,
        defaultSourceReadinessRowId:
          defaultWalkthroughContext.defaultSourceReadinessRowId,
        defaultSourceReadoutRowId:
          defaultWalkthroughContext.defaultSourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          defaultWalkthroughContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          defaultWalkthroughContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId: defaultWalkthroughContext.defaultRelayStepId,
        defaultAnchorTargetId:
          defaultWalkthroughContext.defaultAnchorTargetId,
        sourceReadinessResponseWalkthroughSummary:
          sourceReviewObservationHandoffSourceReadinessResponseWalkthrough
            .summary.summary,
        sourceReadinessResponseMatrixSummary:
          defaultWalkthroughContext.sourceReadinessResponseMatrixSummary,
        sourceReadinessQuestionBoardSummary:
          defaultWalkthroughContext.sourceReadinessQuestionBoardSummary,
        sourceReadinessRehearsalSummary:
          defaultWalkthroughContext.sourceReadinessRehearsalSummary,
        sourceReadinessSummary:
          defaultWalkthroughContext.sourceReadinessSummary,
        sourceReadoutSummary: defaultWalkthroughContext.sourceReadoutSummary,
        sourceWalkthroughSummary:
          defaultWalkthroughContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary:
          defaultWalkthroughContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          defaultWalkthroughContext.sourceRelayTrailSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseTraceRows,
        staticSourceAlignmentNoteCards,
        sourceReviewObservationHandoffSourceReadinessResponseWalkthrough,
      ),
    },
    defaultTraceRow,
    responseTraceRows,
    staticSourceAlignmentNoteCards,
    staticSourceReadinessResponseTraceMapSummary:
      "Stage 58 source readiness response trace rows and static source alignment notes are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, source readiness response progress, response walkthrough progress, response trace progress, source readiness question progress, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseWalkthrough,
  };
}

function buildResponseTraceRow(
  step: ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView,
): ReviewObservationHandoffSourceReadinessResponseTraceRowView {
  return {
    sourceReadinessResponseTraceRowId: `review-observation-handoff-source-readiness-response-trace:${step.sourceReadinessResponseWalkthroughStepId}`,
    traceOrder: step.stepOrder,
    label: `${step.label} trace`,
    summary:
      `Response trace row ${step.stepOrder} preserves Stage 57 walkthrough step order for ${step.sourceReadinessResponseWalkthroughStepId}, response row ${step.sourceReadinessResponseRowId}, question row ${step.sourceReadinessQuestionRowId}, evidence notes ${step.matchedStaticEvidenceNoteRowIds.join(", ")}, static follow-ups ${step.matchedStaticFollowUpPromptRowIds.join(", ")}, anchors ${step.anchorTargetIds.join(", ")}, ${step.evidenceCallbackIds.length} evidence callbacks, ${step.gapDiscussionPointIds.length} gap prompts, and ${step.deferredScopeReminderIds.length} deferred reminders without saved reviewer answers, saved response progress, saved response walkthrough progress, saved response trace progress, saved question progress, saved rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseWalkthroughStepId:
      step.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds: [
      step.sourceReadinessResponseWalkthroughStepId,
    ],
    sourceReadinessResponseRowId: step.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds: step.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId: step.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds: step.sourceReadinessQuestionRowIds,
    matchedStaticEvidenceNoteRowIds: step.matchedStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      step.matchedStaticFollowUpPromptRowIds,
    sourceReadinessRehearsalPromptRowId:
      step.sourceReadinessRehearsalPromptRowId,
    sourceReadinessRehearsalPromptRowIds:
      step.sourceReadinessRehearsalPromptRowIds,
    sourceReadinessRowId: step.sourceReadinessRowId,
    sourceReadinessRowIds: step.sourceReadinessRowIds,
    sourceReadoutRowId: step.sourceReadoutRowId,
    sourceReadoutRowIds: step.sourceReadoutRowIds,
    sourceWalkthroughSectionId: step.sourceWalkthroughSectionId,
    sourceWalkthroughSectionIds: step.sourceWalkthroughSectionIds,
    sourceCrosswalkRowId: step.sourceCrosswalkRowId,
    sourceCrosswalkRowIds: step.sourceCrosswalkRowIds,
    sourceRelayStepId: step.sourceRelayStepId,
    sourceRelayStepIds: step.sourceRelayStepIds,
    sourceInspectionReferenceIds: step.sourceInspectionReferenceIds,
    sourceKinds: step.sourceKinds,
    sourceIds: step.sourceIds,
    sourceLabels: step.sourceLabels,
    localAnchorHrefs: step.localAnchorHrefs,
    anchorTargetIds: step.anchorTargetIds,
    sourceSynthesisRowIds: step.sourceSynthesisRowIds,
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
    matchedStaticReviewCheckIds: step.matchedStaticReviewCheckIds,
    matchedStaticReviewerPromptCheckRowIds:
      step.matchedStaticReviewerPromptCheckRowIds,
    staticReviewCueIds: step.staticReviewCueIds,
    reviewerPromptText: step.reviewerPromptText,
    followUpQuestionText: step.followUpQuestionText,
    responseNoteCue: step.responseNoteCue,
    reviewerCueText: step.staticReviewerCueText,
    sourceAlignmentNoteText:
      `Trace ${step.sourceReadinessResponseWalkthroughStepId} aligns response ${step.sourceReadinessResponseRowId} to question ${step.sourceReadinessQuestionRowId}, evidence notes ${step.matchedStaticEvidenceNoteRowIds.join(", ")}, follow-up prompts ${step.matchedStaticFollowUpPromptRowIds.join(", ")}, local anchors ${step.anchorTargetIds.join(", ")}, evidence callbacks ${step.evidenceCallbackIds.join(", ")}, gap prompts ${step.gapDiscussionPointIds.join(", ")}, and deferred-scope reminders ${step.deferredScopeReminderIds.join(", ")} as static source alignment context only.`,
    staticNonGoalContexts: step.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(step.staticNonGoalFlags),
    ...staticResponseTraceMapItemFlags(),
  };
}

function buildStaticSourceAlignmentNoteCard(
  card: ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticCueCardView,
  responseTraceRows: ReviewObservationHandoffSourceReadinessResponseTraceRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView {
  const matchedTraceRows = responseTraceRows.filter(
    (row) =>
      card.matchedResponseRowIds.includes(row.sourceReadinessResponseRowId) ||
      card.matchedQuestionRowIds.includes(row.sourceReadinessQuestionRowId),
  );

  return {
    sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId: `review-observation-handoff-source-readiness-response-trace:alignment-note:${card.sourceReadinessResponseWalkthroughStaticCueCardId}`,
    noteOrder: card.cueOrder,
    sourceReadinessResponseWalkthroughStaticCueCardId:
      card.sourceReadinessResponseWalkthroughStaticCueCardId,
    sourceReadinessResponseWalkthroughStaticCueCardIds: [
      card.sourceReadinessResponseWalkthroughStaticCueCardId,
    ],
    sourceReadinessStaticEvidenceNoteRowId:
      card.sourceReadinessStaticEvidenceNoteRowId,
    sourceReadinessStaticEvidenceNoteRowIds:
      card.sourceReadinessStaticEvidenceNoteRowIds,
    sourceReadinessStaticFollowUpPromptRowId:
      card.sourceReadinessStaticFollowUpPromptRowId,
    sourceReadinessStaticFollowUpPromptRowIds:
      card.sourceReadinessStaticFollowUpPromptRowIds,
    matchedResponseRowIds: card.matchedResponseRowIds,
    matchedQuestionRowIds: card.matchedQuestionRowIds,
    matchedSourceFollowUpPromptRowIds:
      card.matchedSourceFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: card.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: card.sourceAnchorTargetIds,
    localAnchorHref: card.localAnchorHref,
    anchorTargetId: card.anchorTargetId,
    label: `${card.label} alignment note`,
    summary:
      `Static source alignment note ${card.cueOrder} preserves Stage 57 reviewer cue card order for ${card.sourceReadinessResponseWalkthroughStaticCueCardId}, static evidence note ${card.sourceReadinessStaticEvidenceNoteRowId}, ${card.matchedResponseRowIds.length} matched response rows, ${card.matchedQuestionRowIds.length} matched question rows, ${card.matchedSourceFollowUpPromptRowIds.length} matched static follow-up prompts, ${card.sourceLocalAnchorHrefs.length} source anchors, ${card.evidenceCallbackIds.length} callbacks, ${card.gapDiscussionPointIds.length} gap prompts, and ${card.deferredScopeReminderIds.length} deferred reminders without saved reviewer answers, saved response progress, saved response walkthrough progress, saved response trace progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, owners, tickets, or commands.`,
    reviewerPromptText: card.reviewerPromptText,
    followUpPromptText: card.followUpPromptText,
    responseNoteCue: card.responseNoteCue,
    cueText: card.cueText,
    alignmentNoteText:
      `Align ${card.sourceReadinessResponseWalkthroughStaticCueCardId} to trace rows ${matchedTraceRows.map((row) => row.sourceReadinessResponseTraceRowId).join(", ")}, response rows ${card.matchedResponseRowIds.join(", ")}, question rows ${card.matchedQuestionRowIds.join(", ")}, follow-up prompts ${card.matchedSourceFollowUpPromptRowIds.join(", ")}, anchors ${card.sourceAnchorTargetIds.join(", ")}, callbacks ${card.evidenceCallbackIds.join(", ")}, gap prompts ${card.gapDiscussionPointIds.join(", ")}, and deferred reminders ${card.deferredScopeReminderIds.join(", ")} as local static source alignment only.`,
    evidenceCallbackIds: card.evidenceCallbackIds,
    gapDiscussionPointIds: card.gapDiscussionPointIds,
    deferredScopeReminderIds: card.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(card.staticNonGoalFlags),
    ...staticResponseTraceMapItemFlags(),
  };
}

function buildCounts(
  responseTraceRows: ReviewObservationHandoffSourceReadinessResponseTraceRowView[],
  staticSourceAlignmentNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseWalkthrough: ReviewObservationHandoffSourceReadinessResponseWalkthroughView,
): ReviewObservationHandoffSourceReadinessResponseTraceMapView["summary"]["counts"] {
  return {
    responseTraceRowCount: responseTraceRows.length,
    staticSourceAlignmentNoteCardCount:
      staticSourceAlignmentNoteCards.length,
    responseWalkthroughStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseWalkthrough
        .walkthroughSteps.length,
    staticReviewerCueCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseWalkthrough
        .staticReviewerCueCards.length,
    responseRowCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    staticEvidenceNoteCount: new Set(
      staticSourceAlignmentNoteCards.flatMap(
        (card) => card.sourceReadinessStaticEvidenceNoteRowIds,
      ),
    ).size,
    questionRowCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    matchedStaticFollowUpPromptRowCount: new Set(
      responseTraceRows.flatMap(
        (row) => row.matchedStaticFollowUpPromptRowIds,
      ),
    ).size,
    sourceReadinessRehearsalPromptRowCount: new Set(
      responseTraceRows.flatMap(
        (row) => row.sourceReadinessRehearsalPromptRowIds,
      ),
    ).size,
    sourceReadinessRowCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceReadinessRowIds),
    ).size,
    sourceReadoutRowCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceReadoutRowIds),
    ).size,
    sourceWalkthroughSectionCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceWalkthroughSectionIds),
    ).size,
    sourceCrosswalkRowCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceCrosswalkRowIds),
    ).size,
    sourceRelayStepCount: new Set(
      responseTraceRows.flatMap((row) => row.sourceRelayStepIds),
    ).size,
    sourceInspectionReferenceCount: responseTraceRows.reduce(
      (count, row) => count + row.sourceInspectionReferenceIds.length,
      0,
    ),
    evidenceCallbackCount: responseTraceRows.reduce(
      (count, row) => count + row.evidenceCallbackIds.length,
      0,
    ),
    gapDiscussionPointCount: responseTraceRows.reduce(
      (count, row) => count + row.gapDiscussionPointIds.length,
      0,
    ),
    deferredScopeReminderCount: responseTraceRows.reduce(
      (count, row) => count + row.deferredScopeReminderIds.length,
      0,
    ),
    localOnlyTraceRowCount: responseTraceRows.filter((row) => row.localOnly)
      .length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView["staticNonGoalFlags"],
): ReviewObservationHandoffSourceReadinessResponseTraceMapStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceProgress: true,
    noSavedTraceProgress: true,
  };
}

function staticResponseTraceMapItemFlags() {
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
