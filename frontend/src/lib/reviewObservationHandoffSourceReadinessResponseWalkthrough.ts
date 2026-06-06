import type {
  ReviewObservationHandoffSourceReadinessResponseMatrixView,
  ReviewObservationHandoffSourceReadinessResponseRowView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticCueCardView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView,
  ReviewObservationHandoffSourceReadinessResponseWalkthroughView,
  ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseWalkthrough(
  sourceReviewObservationHandoffSourceReadinessResponseMatrix:
    | ReviewObservationHandoffSourceReadinessResponseMatrixView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseWalkthroughView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseMatrix?.responseRows
      .length
  ) {
    return undefined;
  }

  const walkthroughSteps =
    sourceReviewObservationHandoffSourceReadinessResponseMatrix.responseRows.map(
      (row) =>
        buildWalkthroughStep(
          row,
          sourceReviewObservationHandoffSourceReadinessResponseMatrix
            .staticEvidenceNotes,
        ),
    );
  const staticReviewerCueCards =
    sourceReviewObservationHandoffSourceReadinessResponseMatrix.staticEvidenceNotes.map(
      (note) =>
        buildStaticReviewerCueCard(
          note,
          sourceReviewObservationHandoffSourceReadinessResponseMatrix
            .responseRows,
        ),
    );
  const defaultWalkthroughStep =
    walkthroughSteps.find(
      (step) =>
        step.sourceReadinessResponseRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseMatrix.summary
          .defaultResponseContext.defaultResponseRowId,
    ) ?? walkthroughSteps[0];
  const defaultResponseContext =
    sourceReviewObservationHandoffSourceReadinessResponseMatrix.summary
      .defaultResponseContext;

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_walkthrough.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response walkthrough and static reviewer cues",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseMatrix.localStatus,
    summary: {
      sourceReadinessResponseWalkthroughId:
        "candidate-local-review-observation-handoff-source-readiness-response-walkthrough",
      label:
        "Local observation handoff source readiness response walkthrough",
      summary:
        "A static source readiness response walkthrough derives from Stage 56 response rows and static evidence notes so reviewers can move through ordered responses, matched evidence notes, anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, response-note cues, and reviewer cue cards before human handoff without saved reviewer answers, saved response progress, saved walkthrough progress, saved question progress, saved rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, owner assignment, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultResponseWalkthroughContext: {
        defaultWalkthroughStepId:
          defaultWalkthroughStep.sourceReadinessResponseWalkthroughStepId,
        defaultResponseRowId: defaultResponseContext.defaultResponseRowId,
        defaultQuestionRowId: defaultResponseContext.defaultQuestionRowId,
        defaultRehearsalPromptRowId:
          defaultResponseContext.defaultRehearsalPromptRowId,
        defaultSourceReadinessRowId:
          defaultResponseContext.defaultSourceReadinessRowId,
        defaultSourceReadoutRowId:
          defaultResponseContext.defaultSourceReadoutRowId,
        defaultSourceWalkthroughSectionId:
          defaultResponseContext.defaultSourceWalkthroughSectionId,
        defaultSourceCrosswalkRowId:
          defaultResponseContext.defaultSourceCrosswalkRowId,
        defaultRelayStepId: defaultResponseContext.defaultRelayStepId,
        defaultAnchorTargetId: defaultResponseContext.defaultAnchorTargetId,
        sourceReadinessResponseMatrixSummary:
          sourceReviewObservationHandoffSourceReadinessResponseMatrix.summary
            .summary,
        sourceReadinessQuestionBoardSummary:
          defaultResponseContext.sourceReadinessQuestionBoardSummary,
        sourceReadinessRehearsalSummary:
          defaultResponseContext.sourceReadinessRehearsalSummary,
        sourceReadinessSummary:
          defaultResponseContext.sourceReadinessSummary,
        sourceReadoutSummary: defaultResponseContext.sourceReadoutSummary,
        sourceWalkthroughSummary:
          defaultResponseContext.sourceWalkthroughSummary,
        sourceCrosswalkSummary:
          defaultResponseContext.sourceCrosswalkSummary,
        sourceRelayTrailSummary:
          defaultResponseContext.sourceRelayTrailSummary,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(walkthroughSteps, staticReviewerCueCards),
    },
    defaultWalkthroughStep,
    walkthroughSteps,
    staticReviewerCueCards,
    staticSourceReadinessResponseWalkthroughSummary:
      "Stage 57 source readiness response walkthrough steps and static reviewer cue cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, response progress, response walkthrough progress, source readiness question progress, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseMatrix,
  };
}

function buildWalkthroughStep(
  row: ReviewObservationHandoffSourceReadinessResponseRowView,
  staticEvidenceNotes: ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView[],
): ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView {
  const matchedStaticEvidenceNotes = staticEvidenceNotes.filter(
    (note) =>
      row.matchedStaticFollowUpPromptRowIds.includes(
        note.sourceReadinessStaticFollowUpPromptRowId,
      ) || note.matchedQuestionRowIds.includes(row.sourceReadinessQuestionRowId),
  );

  return {
    sourceReadinessResponseWalkthroughStepId: `review-observation-handoff-source-readiness-response-walkthrough:${row.sourceReadinessResponseRowId}`,
    stepOrder: row.responseOrder,
    label: `${row.label} walkthrough`,
    summary:
      `Response walkthrough step ${row.responseOrder} preserves Stage 56 response row order for ${row.sourceReadinessResponseRowId}, ${row.sourceReadinessQuestionRowId}, ${row.sourceReadinessRehearsalPromptRowId}, ${row.sourceReadinessRowId}, ${row.sourceReadoutRowId}, ${row.sourceWalkthroughSectionId}, ${row.sourceCrosswalkRowId}, ${row.sourceRelayStepId}, ${matchedStaticEvidenceNotes.length} matched static evidence notes, ${row.matchedStaticFollowUpPromptRowIds.length} matched static follow-up prompts, ${row.sourceInspectionReferenceIds.length} source inspection references, ${row.localAnchorHrefs.length} local anchors, ${row.evidenceCallbackIds.length} evidence callbacks, ${row.gapDiscussionPointIds.length} gap discussion prompts, and ${row.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer answers, saved response progress, saved response walkthrough progress, saved question progress, saved rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseRowId: row.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds: [row.sourceReadinessResponseRowId],
    sourceReadinessQuestionRowId: row.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds: row.sourceReadinessQuestionRowIds,
    matchedStaticEvidenceNoteRowIds: matchedStaticEvidenceNotes.map(
      (note) => note.sourceReadinessStaticEvidenceNoteRowId,
    ),
    matchedStaticFollowUpPromptRowIds: row.matchedStaticFollowUpPromptRowIds,
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
    staticReviewCueIds: row.staticReviewCueIds,
    reviewerPromptText: row.reviewerPromptText,
    followUpQuestionText: row.followUpQuestionText,
    responseNoteCue: row.responseNoteCue,
    staticReviewerCueText:
      `Walk ${row.sourceReadinessResponseRowId} by pairing response cue ${row.responseNoteCue} with evidence notes ${matchedStaticEvidenceNotes.map((note) => note.sourceReadinessStaticEvidenceNoteRowId).join(", ")}, anchors ${row.anchorTargetIds.join(", ")}, evidence callbacks ${row.evidenceCallbackIds.join(", ")}, gap prompts ${row.gapDiscussionPointIds.join(", ")}, and deferred reminders ${row.deferredScopeReminderIds.join(", ")} as static reviewer context only.`,
    staticNonGoalContexts: row.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(row.staticNonGoalFlags),
    ...staticResponseWalkthroughItemFlags(),
  };
}

function buildStaticReviewerCueCard(
  note: ReviewObservationHandoffSourceReadinessStaticEvidenceNoteRowView,
  responseRows: ReviewObservationHandoffSourceReadinessResponseRowView[],
): ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticCueCardView {
  const matchedResponseRows = responseRows.filter(
    (row) =>
      note.matchedQuestionRowIds.includes(row.sourceReadinessQuestionRowId) ||
      row.matchedStaticFollowUpPromptRowIds.includes(
        note.sourceReadinessStaticFollowUpPromptRowId,
      ),
  );

  return {
    sourceReadinessResponseWalkthroughStaticCueCardId: `review-observation-handoff-source-readiness-response-walkthrough:cue-card:${note.sourceReadinessStaticEvidenceNoteRowId}`,
    cueOrder: note.evidenceNoteOrder,
    sourceReadinessStaticEvidenceNoteRowId:
      note.sourceReadinessStaticEvidenceNoteRowId,
    sourceReadinessStaticEvidenceNoteRowIds: [
      note.sourceReadinessStaticEvidenceNoteRowId,
    ],
    sourceReadinessStaticFollowUpPromptRowId:
      note.sourceReadinessStaticFollowUpPromptRowId,
    sourceReadinessStaticFollowUpPromptRowIds:
      note.sourceReadinessStaticFollowUpPromptRowIds,
    matchedResponseRowIds: matchedResponseRows.map(
      (row) => row.sourceReadinessResponseRowId,
    ),
    matchedQuestionRowIds: note.matchedQuestionRowIds,
    matchedSourceFollowUpPromptRowIds:
      note.sourceReadinessStaticFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: note.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: note.sourceAnchorTargetIds,
    localAnchorHref: note.localAnchorHref,
    anchorTargetId: note.anchorTargetId,
    label: `${note.label} reviewer cue`,
    summary:
      `Static reviewer cue card ${note.evidenceNoteOrder} preserves Stage 56 static evidence note order for ${note.sourceReadinessStaticEvidenceNoteRowId}, ${note.sourceReadinessStaticFollowUpPromptRowId}, ${matchedResponseRows.length} matched response rows, ${note.matchedQuestionRowIds.length} matched question rows, ${note.sourceLocalAnchorHrefs.length} local anchors, ${note.evidenceCallbackIds.length} evidence callbacks, ${note.gapDiscussionPointIds.length} gap discussion prompts, and ${note.deferredScopeReminderIds.length} deferred-scope reminders without saved reviewer answers, saved response progress, saved response walkthrough progress, saved question progress, saved rehearsal progress, owner assignment, task launchers, runnable checklists, tickets, routes, reports, handoff packages, signoff, audit records, scores, certification, meeting workflow, exports, or commands.`,
    reviewerPromptText: note.reviewerPromptText,
    followUpPromptText: note.followUpPromptText,
    responseNoteCue: note.responseNoteCue,
    cueText:
      `Use ${note.sourceReadinessStaticEvidenceNoteRowId} to cue matched response rows ${matchedResponseRows.map((row) => row.sourceReadinessResponseRowId).join(", ")}, question rows ${note.matchedQuestionRowIds.join(", ")}, anchors ${note.sourceAnchorTargetIds.join(", ")}, evidence callbacks ${note.evidenceCallbackIds.join(", ")}, gap prompts ${note.gapDiscussionPointIds.join(", ")}, and deferred reminders ${note.deferredScopeReminderIds.join(", ")} as local static reviewer guidance only.`,
    evidenceCallbackIds: note.evidenceCallbackIds,
    gapDiscussionPointIds: note.gapDiscussionPointIds,
    deferredScopeReminderIds: note.deferredScopeReminderIds,
    staticNonGoalFlags: staticNonGoalFlags(note.staticNonGoalFlags),
    ...staticResponseWalkthroughItemFlags(),
  };
}

function buildCounts(
  walkthroughSteps: ReviewObservationHandoffSourceReadinessResponseWalkthroughStepView[],
  staticReviewerCueCards: ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticCueCardView[],
): ReviewObservationHandoffSourceReadinessResponseWalkthroughView["summary"]["counts"] {
  return {
    walkthroughStepCount: walkthroughSteps.length,
    staticReviewerCueCardCount: staticReviewerCueCards.length,
    responseRowCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceReadinessResponseRowIds),
    ).size,
    staticEvidenceNoteCount: new Set(
      staticReviewerCueCards.flatMap(
        (card) => card.sourceReadinessStaticEvidenceNoteRowIds,
      ),
    ).size,
    questionRowCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceReadinessQuestionRowIds),
    ).size,
    matchedStaticFollowUpPromptRowCount: new Set(
      walkthroughSteps.flatMap(
        (step) => step.matchedStaticFollowUpPromptRowIds,
      ),
    ).size,
    sourceReadinessRehearsalPromptRowCount: new Set(
      walkthroughSteps.flatMap(
        (step) => step.sourceReadinessRehearsalPromptRowIds,
      ),
    ).size,
    sourceReadinessRowCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceReadinessRowIds),
    ).size,
    sourceReadoutRowCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceReadoutRowIds),
    ).size,
    sourceWalkthroughSectionCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceWalkthroughSectionIds),
    ).size,
    sourceCrosswalkRowCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceCrosswalkRowIds),
    ).size,
    sourceRelayStepCount: new Set(
      walkthroughSteps.flatMap((step) => step.sourceRelayStepIds),
    ).size,
    sourceInspectionReferenceCount: walkthroughSteps.reduce(
      (count, step) => count + step.sourceInspectionReferenceIds.length,
      0,
    ),
    evidenceCallbackCount: walkthroughSteps.reduce(
      (count, step) => count + step.evidenceCallbackIds.length,
      0,
    ),
    gapDiscussionPointCount: walkthroughSteps.reduce(
      (count, step) => count + step.gapDiscussionPointIds.length,
      0,
    ),
    deferredScopeReminderCount: walkthroughSteps.reduce(
      (count, step) => count + step.deferredScopeReminderIds.length,
      0,
    ),
    localOnlyWalkthroughStepCount: walkthroughSteps.filter(
      (step) => step.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseRowView["staticNonGoalFlags"],
): ReviewObservationHandoffSourceReadinessResponseWalkthroughStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseWalkthroughProgress: true,
    noSavedWalkthroughProgress: true,
  };
}

function staticResponseWalkthroughItemFlags() {
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
