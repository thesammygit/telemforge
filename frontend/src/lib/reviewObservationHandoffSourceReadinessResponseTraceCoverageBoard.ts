import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceMapView,
  ReviewObservationHandoffSourceReadinessResponseTraceRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard(
  sourceReviewObservationHandoffSourceReadinessResponseTraceMap:
    | ReviewObservationHandoffSourceReadinessResponseTraceMapView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardView | undefined {
  if (!sourceReviewObservationHandoffSourceReadinessResponseTraceMap?.responseTraceRows.length) {
    return undefined;
  }

  const coverageRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.map(
      (traceRow) =>
        buildCoverageRow(
          traceRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceMap.staticSourceAlignmentNoteCards,
        ),
    );
  const staticGapNoteCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceMap.staticSourceAlignmentNoteCards.map(
      (noteCard) =>
        buildStaticGapNoteCard(
          noteCard,
          sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows,
        ),
    );
  const defaultCoverageRow =
    coverageRows.find(
      (row) =>
        row.sourceReadinessResponseTraceRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceMap.defaultTraceRow.sourceReadinessResponseTraceRowId,
    ) ?? coverageRows[0];
  const defaultGapNoteCard =
    staticGapNoteCards.find(
      (card) =>
        card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId ===
        defaultCoverageRow.matchedSourceAlignmentNoteCardIds[0],
    ) ?? staticGapNoteCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_board.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage board and static gap notes",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageBoardId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-board",
      label:
        "Local observation handoff source readiness response trace coverage board",
      summary:
        "A static response trace coverage board derives from Stage 58 response trace rows and static source alignment notes so reviewers can inspect which trace rows, source alignment notes, evidence notes, follow-up prompts, anchors, evidence callbacks, gap discussion prompts, and deferred-scope reminders are covered before human handoff without saved trace coverage progress, saved gap notes, saved reviewer answers, saved response progress, saved response walkthrough progress, saved response trace progress, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, or commands.",
      defaultCoverageContext: {
        defaultCoverageRowId:
          defaultCoverageRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultCoverageRow.sourceReadinessResponseTraceRowId,
        defaultResponseTraceRowId:
          defaultCoverageRow.sourceReadinessResponseTraceRowId,
        defaultGapNoteCardId:
          defaultGapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        defaultSourceAlignmentNoteCardId:
          defaultGapNoteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        sourceReadinessResponseTraceMapSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceMap.summary.summary,
        sourceReadinessResponseTraceMapDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceMap.summary
            .defaultResponseTraceContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        coverageRows,
        staticGapNoteCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceMap,
      ),
    },
    defaultCoverageRow,
    defaultGapNoteCard,
    coverageRows,
    staticGapNoteCards,
    staticSourceReadinessResponseTraceCoverageBoardSummary:
      "Stage 59 response trace coverage rows and static gap note cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save trace coverage progress, gap notes, reviewer answers, response progress, response walkthrough progress, response trace progress, source readiness question progress, source readiness rehearsal progress, source readiness progress, source readout progress, source walkthrough progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceMap,
  };
}

function buildCoverageRow(
  traceRow: ReviewObservationHandoffSourceReadinessResponseTraceRowView,
  staticSourceAlignmentNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView {
  const matchedSourceAlignmentNoteCards = staticSourceAlignmentNoteCards.filter(
    (card) =>
      card.matchedResponseRowIds.includes(traceRow.sourceReadinessResponseRowId) ||
      card.matchedQuestionRowIds.includes(traceRow.sourceReadinessQuestionRowId),
  );

  return {
    sourceReadinessResponseTraceCoverageRowId: `review-observation-handoff-source-readiness-response-trace-coverage:${traceRow.sourceReadinessResponseTraceRowId}`,
    coverageOrder: traceRow.traceOrder,
    label: `${traceRow.label} coverage`,
    summary:
      `Coverage row ${traceRow.traceOrder} preserves Stage 58 trace row order for ${traceRow.sourceReadinessResponseTraceRowId}, walkthrough step ${traceRow.sourceReadinessResponseWalkthroughStepId}, response row ${traceRow.sourceReadinessResponseRowId}, question row ${traceRow.sourceReadinessQuestionRowId}, ${matchedSourceAlignmentNoteCards.length} matched source alignment notes, ${traceRow.matchedStaticEvidenceNoteRowIds.length} matched static evidence notes, ${traceRow.matchedStaticFollowUpPromptRowIds.length} matched static follow-up prompts, ${traceRow.anchorTargetIds.length} anchors, ${traceRow.evidenceCallbackIds.length} evidence callbacks, ${traceRow.gapDiscussionPointIds.length} gap discussion prompts, and ${traceRow.deferredScopeReminderIds.length} deferred-scope reminders without saved trace coverage progress, saved gap notes, saved reviewer answers, saved response progress, saved response walkthrough progress, saved response trace progress, saved source readiness question progress, saved source readiness rehearsal progress, saved source readiness progress, saved source readout progress, saved source walkthrough progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit state, scores, certifications, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceRowId:
      traceRow.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds: [
      traceRow.sourceReadinessResponseTraceRowId,
    ],
    sourceReadinessResponseWalkthroughStepId:
      traceRow.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds: [
      traceRow.sourceReadinessResponseWalkthroughStepId,
    ],
    sourceReadinessResponseRowId: traceRow.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds: traceRow.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId: traceRow.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds: traceRow.sourceReadinessQuestionRowIds,
    matchedStaticEvidenceNoteRowIds:
      traceRow.matchedStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      traceRow.matchedStaticFollowUpPromptRowIds,
    matchedSourceAlignmentNoteCardIds: matchedSourceAlignmentNoteCards.map(
      (card) => card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    ),
    sourceLocalAnchorHrefs: traceRow.localAnchorHrefs,
    sourceAnchorTargetIds: traceRow.anchorTargetIds,
    evidenceCallbackIds: traceRow.evidenceCallbackIds,
    gapDiscussionPointIds: traceRow.gapDiscussionPointIds,
    deferredScopeReminderIds: traceRow.deferredScopeReminderIds,
    responseNoteCue: traceRow.responseNoteCue,
    reviewerCueText: traceRow.reviewerCueText,
    sourceAlignmentNoteText: traceRow.sourceAlignmentNoteText,
    coverageNoteText:
      `Coverage ${traceRow.sourceReadinessResponseTraceRowId} connects to source alignment notes ${matchedSourceAlignmentNoteCards.map((card) => card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId).join(", ") || "none"}, evidence notes ${traceRow.matchedStaticEvidenceNoteRowIds.join(", ")}, follow-up prompts ${traceRow.matchedStaticFollowUpPromptRowIds.join(", ")}, anchors ${traceRow.anchorTargetIds.join(", ")}, callbacks ${traceRow.evidenceCallbackIds.join(", ")}, gap prompts ${traceRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${traceRow.deferredScopeReminderIds.join(", ")} as static coverage context only.`,
    staticNonGoalContexts: traceRow.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(traceRow.staticNonGoalFlags),
    ...staticResponseTraceCoverageBoardItemFlags(),
  };
}

function buildStaticGapNoteCard(
  noteCard: ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView,
  responseTraceRows: ReviewObservationHandoffSourceReadinessResponseTraceRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView {
  const matchedResponseTraceRows = responseTraceRows.filter(
    (row) =>
      noteCard.matchedResponseRowIds.includes(row.sourceReadinessResponseRowId) ||
      noteCard.matchedQuestionRowIds.includes(row.sourceReadinessQuestionRowId),
  );

  return {
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId: `review-observation-handoff-source-readiness-response-trace-coverage:gap-note:${noteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId}`,
    gapNoteOrder: noteCard.noteOrder,
    sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId:
      noteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds: [
      noteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    ],
    sourceReadinessStaticEvidenceNoteRowId:
      noteCard.sourceReadinessStaticEvidenceNoteRowId,
    sourceReadinessStaticEvidenceNoteRowIds:
      noteCard.sourceReadinessStaticEvidenceNoteRowIds,
    sourceReadinessStaticFollowUpPromptRowId:
      noteCard.sourceReadinessStaticFollowUpPromptRowId,
    sourceReadinessStaticFollowUpPromptRowIds:
      noteCard.sourceReadinessStaticFollowUpPromptRowIds,
    matchedResponseTraceRowIds: matchedResponseTraceRows.map(
      (row) => row.sourceReadinessResponseTraceRowId,
    ),
    matchedResponseRowIds: noteCard.matchedResponseRowIds,
    matchedQuestionRowIds: noteCard.matchedQuestionRowIds,
    matchedSourceFollowUpPromptRowIds:
      noteCard.matchedSourceFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: noteCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: noteCard.sourceAnchorTargetIds,
    localAnchorHref: noteCard.localAnchorHref,
    anchorTargetId: noteCard.anchorTargetId,
    evidenceCallbackIds: noteCard.evidenceCallbackIds,
    gapDiscussionPointIds: noteCard.gapDiscussionPointIds,
    deferredScopeReminderIds: noteCard.deferredScopeReminderIds,
    label: `${noteCard.label} gap note`,
    summary:
      `Gap note ${noteCard.noteOrder} preserves Stage 58 source alignment note order for ${noteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId} and the matched trace rows ${matchedResponseTraceRows.map((row) => row.sourceReadinessResponseTraceRowId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    reviewerPromptText: noteCard.reviewerPromptText,
    followUpPromptText: noteCard.followUpPromptText,
    responseNoteCue: noteCard.responseNoteCue,
    cueText: noteCard.cueText,
    gapNoteText:
      `Gap note ${noteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId} ties trace rows ${matchedResponseTraceRows.map((row) => row.sourceReadinessResponseTraceRowId).join(", ") || "none"} to evidence note ${noteCard.sourceReadinessStaticEvidenceNoteRowId}, follow-up prompt ${noteCard.sourceReadinessStaticFollowUpPromptRowId}, anchors ${noteCard.sourceAnchorTargetIds.join(", ")}, callbacks ${noteCard.evidenceCallbackIds.join(", ")}, gap prompts ${noteCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${noteCard.deferredScopeReminderIds.join(", ")} as a static gap-note reference only.`,
    sourceAlignmentNoteText: noteCard.alignmentNoteText,
    staticNonGoalFlags: staticNonGoalFlags(noteCard.staticNonGoalFlags),
    ...staticResponseTraceCoverageBoardItemFlags(),
  };
}

function buildCounts(
  coverageRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView[],
  staticGapNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceMap: ReviewObservationHandoffSourceReadinessResponseTraceMapView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardSummaryView["counts"] {
  return {
    coverageRowCount: coverageRows.length,
    staticGapNoteCardCount: staticGapNoteCards.length,
    responseTraceRowCount: coverageRows.length,
    staticSourceAlignmentNoteCardCount: staticGapNoteCards.length,
    responseWalkthroughStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.summary
        .counts.responseWalkthroughStepCount,
    responseRowCount: new Set(
      coverageRows.flatMap((row) => row.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      coverageRows.flatMap((row) => row.sourceReadinessQuestionRowIds),
    ).size,
    matchedStaticFollowUpPromptRowCount: new Set(
      coverageRows.flatMap((row) => row.matchedStaticFollowUpPromptRowIds),
    ).size,
    sourceReadinessRehearsalPromptRowCount: new Set(
      coverageRows.flatMap((row) =>
        sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows
          .find(
            (traceRow) =>
              traceRow.sourceReadinessResponseTraceRowId ===
              row.sourceReadinessResponseTraceRowId,
          )
          ?.sourceReadinessRehearsalPromptRowIds ?? [],
      ),
    ).size,
    sourceReadinessRowCount: new Set(
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.flatMap(
        (row) => row.sourceReadinessRowIds,
      ),
    ).size,
    sourceReadoutRowCount: new Set(
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.flatMap(
        (row) => row.sourceReadoutRowIds,
      ),
    ).size,
    sourceWalkthroughSectionCount: new Set(
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.flatMap(
        (row) => row.sourceWalkthroughSectionIds,
      ),
    ).size,
    sourceCrosswalkRowCount: new Set(
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.flatMap(
        (row) => row.sourceCrosswalkRowIds,
      ),
    ).size,
    sourceRelayStepCount: new Set(
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.flatMap(
        (row) => row.sourceRelayStepIds,
      ),
    ).size,
    sourceInspectionReferenceCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.reduce(
        (count, row) => count + row.sourceInspectionReferenceIds.length,
        0,
      ),
    sourceAnchorCount: new Set(
      coverageRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.reduce(
        (count, row) => count + row.evidenceCallbackIds.length,
        0,
      ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.reduce(
        (count, row) => count + row.gapDiscussionPointIds.length,
        0,
      ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceMap.responseTraceRows.reduce(
        (count, row) => count + row.deferredScopeReminderIds.length,
        0,
      ),
    localOnlyCoverageRowCount: coverageRows.filter((row) => row.localOnly).length,
    localOnlyGapNoteCardCount: staticGapNoteCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardView["staticNonGoalFlags"],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageProgress: true,
    noSavedTraceCoverageProgress: true,
    noSavedGapNotes: true,
  };
}

function staticResponseTraceCoverageBoardItemFlags() {
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
