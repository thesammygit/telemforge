import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPath(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
      ?.coverageRows.length
  ) {
    return undefined;
  }

  const reviewPathSteps =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.coverageRows.map(
      (coverageRow) =>
        buildReviewPathStep(
          coverageRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.staticGapNoteCards,
        ),
    );
  const staticHandoffPromptCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.staticGapNoteCards.map(
      (gapNoteCard) =>
        buildStaticHandoffPromptCard(
          gapNoteCard,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.coverageRows,
        ),
    );
  const defaultReviewPathStep =
    reviewPathSteps.find(
      (step) =>
        step.sourceReadinessResponseTraceCoverageRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
          .summary.defaultCoverageContext.defaultCoverageRowId,
    ) ?? reviewPathSteps[0];
  const defaultStaticHandoffPromptCard =
    staticHandoffPromptCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
          .summary.defaultCoverageContext.defaultGapNoteCardId,
    ) ?? staticHandoffPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage review path and static handoff prompts",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
        .localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageReviewPathId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-review-path",
      label:
        "Local observation handoff source readiness response trace coverage review path",
      summary:
        "A static coverage review path derives from Stage 59 coverage rows and static gap note cards so reviewers can inspect coverage order, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, and handoff prompts before human review without saved reviewer answers, saved trace coverage progress, saved coverage review progress, saved gap notes, saved handoff prompt edits, saved response progress, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultCoverageReviewPathContext: {
        defaultReviewPathStepId:
          defaultReviewPathStep.sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultReviewPathStep.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultReviewPathStep.sourceReadinessResponseTraceRowId,
        defaultResponseTraceRowId:
          defaultReviewPathStep.sourceReadinessResponseTraceRowId,
        defaultStaticHandoffPromptCardId:
          defaultStaticHandoffPromptCard
            .sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId,
        defaultGapNoteCardId:
          defaultStaticHandoffPromptCard
            .sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
        defaultSourceAlignmentNoteCardId:
          defaultStaticHandoffPromptCard
            .sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
        sourceReadinessResponseTraceCoverageBoardSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
            .summary.summary,
        sourceReadinessResponseTraceCoverageBoardDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
            .summary.defaultCoverageContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        reviewPathSteps,
        staticHandoffPromptCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
      ),
    },
    defaultReviewPathStep,
    defaultStaticHandoffPromptCard,
    reviewPathSteps,
    staticHandoffPromptCards,
    staticSourceReadinessResponseTraceCoverageReviewPathSummary:
      "Stage 60 coverage review path steps and static handoff prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, trace coverage progress, coverage review progress, gap notes, handoff prompt edits, response progress, source readiness progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard,
  };
}

function buildReviewPathStep(
  coverageRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView,
  staticGapNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView {
  const matchedStaticGapNoteCards = staticGapNoteCards.filter((card) =>
    coverageRow.matchedSourceAlignmentNoteCardIds.includes(
      card.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    ),
  );

  return {
    sourceReadinessResponseTraceCoverageReviewPathStepId: `review-observation-handoff-source-readiness-response-trace-coverage-review-path:${coverageRow.sourceReadinessResponseTraceCoverageRowId}`,
    reviewPathOrder: coverageRow.coverageOrder,
    label: `${coverageRow.label} review path`,
    summary:
      `Coverage review step ${coverageRow.coverageOrder} preserves Stage 59 coverage row order for ${coverageRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${coverageRow.sourceReadinessResponseTraceRowId}, walkthrough step ${coverageRow.sourceReadinessResponseWalkthroughStepId}, response row ${coverageRow.sourceReadinessResponseRowId}, question row ${coverageRow.sourceReadinessQuestionRowId}, ${coverageRow.matchedSourceAlignmentNoteCardIds.length} source alignment notes, ${coverageRow.matchedStaticEvidenceNoteRowIds.length} evidence notes, ${coverageRow.matchedStaticFollowUpPromptRowIds.length} follow-up prompts, ${coverageRow.sourceAnchorTargetIds.length} anchors, ${coverageRow.evidenceCallbackIds.length} callbacks, ${coverageRow.gapDiscussionPointIds.length} gap prompts, and ${coverageRow.deferredScopeReminderIds.length} deferred reminders without saved coverage review progress, saved trace coverage progress, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceCoverageRowId:
      coverageRow.sourceReadinessResponseTraceCoverageRowId,
    sourceReadinessResponseTraceCoverageRowIds: [
      coverageRow.sourceReadinessResponseTraceCoverageRowId,
    ],
    sourceReadinessResponseTraceRowId:
      coverageRow.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds:
      coverageRow.sourceReadinessResponseTraceRowIds,
    sourceReadinessResponseWalkthroughStepId:
      coverageRow.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds:
      coverageRow.sourceReadinessResponseWalkthroughStepIds,
    sourceReadinessResponseRowId:
      coverageRow.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds:
      coverageRow.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId:
      coverageRow.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds:
      coverageRow.sourceReadinessQuestionRowIds,
    matchedSourceAlignmentNoteCardIds:
      coverageRow.matchedSourceAlignmentNoteCardIds,
    matchedStaticGapNoteCardIds: matchedStaticGapNoteCards.map(
      (card) =>
        card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    ),
    matchedStaticEvidenceNoteRowIds:
      coverageRow.matchedStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      coverageRow.matchedStaticFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: coverageRow.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: coverageRow.sourceAnchorTargetIds,
    evidenceCallbackIds: coverageRow.evidenceCallbackIds,
    gapDiscussionPointIds: coverageRow.gapDiscussionPointIds,
    deferredScopeReminderIds: coverageRow.deferredScopeReminderIds,
    responseNoteCue: coverageRow.responseNoteCue,
    reviewerCueText: coverageRow.reviewerCueText,
    coverageNoteText: coverageRow.coverageNoteText,
    gapNoteText:
      matchedStaticGapNoteCards.map((card) => card.gapNoteText).join(" ") ||
      "No matched static gap note card is available for this coverage row.",
    staticHandoffPromptText:
      `Handoff prompt for ${coverageRow.sourceReadinessResponseTraceCoverageRowId}: inspect anchors ${coverageRow.sourceAnchorTargetIds.join(", ")}, evidence callbacks ${coverageRow.evidenceCallbackIds.join(", ")}, gap prompts ${coverageRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${coverageRow.deferredScopeReminderIds.join(", ")}, source alignment notes ${coverageRow.matchedSourceAlignmentNoteCardIds.join(", ") || "none"}, and static gap notes ${matchedStaticGapNoteCards.map((card) => card.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId).join(", ") || "none"} as static review context only.`,
    staticNonGoalContexts: coverageRow.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(coverageRow.staticNonGoalFlags),
    ...staticResponseTraceCoverageReviewPathItemFlags(),
  };
}

function buildStaticHandoffPromptCard(
  gapNoteCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticGapNoteCardView,
  coverageRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView {
  const matchedCoverageRows = coverageRows.filter((row) =>
    row.matchedSourceAlignmentNoteCardIds.includes(
      gapNoteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    ),
  );

  return {
    sourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardId: `review-observation-handoff-source-readiness-response-trace-coverage-review-path:handoff-prompt:${gapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId}`,
    handoffPromptOrder: gapNoteCard.gapNoteOrder,
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId:
      gapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardIds: [
      gapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId,
    ],
    sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId:
      gapNoteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardId,
    sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds:
      gapNoteCard.sourceReadinessResponseTraceMapStaticSourceAlignmentNoteCardIds,
    matchedCoverageRowIds: matchedCoverageRows.map(
      (row) => row.sourceReadinessResponseTraceCoverageRowId,
    ),
    matchedResponseTraceRowIds: gapNoteCard.matchedResponseTraceRowIds,
    matchedResponseRowIds: gapNoteCard.matchedResponseRowIds,
    matchedQuestionRowIds: gapNoteCard.matchedQuestionRowIds,
    matchedStaticEvidenceNoteRowIds:
      gapNoteCard.sourceReadinessStaticEvidenceNoteRowIds,
    matchedStaticFollowUpPromptRowIds:
      gapNoteCard.sourceReadinessStaticFollowUpPromptRowIds,
    sourceLocalAnchorHrefs: gapNoteCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: gapNoteCard.sourceAnchorTargetIds,
    localAnchorHref: gapNoteCard.localAnchorHref,
    anchorTargetId: gapNoteCard.anchorTargetId,
    evidenceCallbackIds: gapNoteCard.evidenceCallbackIds,
    gapDiscussionPointIds: gapNoteCard.gapDiscussionPointIds,
    deferredScopeReminderIds: gapNoteCard.deferredScopeReminderIds,
    label: `${gapNoteCard.label} handoff prompt`,
    summary:
      `Static handoff prompt ${gapNoteCard.gapNoteOrder} preserves Stage 59 static gap note order for ${gapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId} and matched coverage rows ${matchedCoverageRows.map((row) => row.sourceReadinessResponseTraceCoverageRowId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    cueText: gapNoteCard.cueText,
    gapNoteText: gapNoteCard.gapNoteText,
    handoffPromptText:
      `Handoff prompt ${gapNoteCard.sourceReadinessResponseTraceCoverageBoardStaticGapNoteCardId}: discuss ${gapNoteCard.cueText} with trace rows ${gapNoteCard.matchedResponseTraceRowIds.join(", ") || "none"}, coverage rows ${matchedCoverageRows.map((row) => row.sourceReadinessResponseTraceCoverageRowId).join(", ") || "none"}, anchors ${gapNoteCard.sourceAnchorTargetIds.join(", ")}, callbacks ${gapNoteCard.evidenceCallbackIds.join(", ")}, gap prompts ${gapNoteCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${gapNoteCard.deferredScopeReminderIds.join(", ")} as a static handoff prompt only.`,
    staticNonGoalFlags: staticNonGoalFlags(gapNoteCard.staticNonGoalFlags),
    ...staticResponseTraceCoverageReviewPathItemFlags(),
  };
}

function buildCounts(
  reviewPathSteps: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStepView[],
  staticHandoffPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticHandoffPromptCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathSummaryView["counts"] {
  return {
    reviewPathStepCount: reviewPathSteps.length,
    staticHandoffPromptCardCount: staticHandoffPromptCards.length,
    coverageRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
        .coverageRows.length,
    staticGapNoteCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard
        .staticGapNoteCards.length,
    responseTraceRowCount: new Set(
      reviewPathSteps.flatMap((step) =>
        step.sourceReadinessResponseTraceRowIds,
      ),
    ).size,
    responseWalkthroughStepCount: new Set(
      reviewPathSteps.flatMap((step) =>
        step.sourceReadinessResponseWalkthroughStepIds,
      ),
    ).size,
    responseRowCount: new Set(
      reviewPathSteps.flatMap((step) => step.sourceReadinessResponseRowIds),
    ).size,
    questionRowCount: new Set(
      reviewPathSteps.flatMap((step) => step.sourceReadinessQuestionRowIds),
    ).size,
    sourceAlignmentNoteCardCount: new Set(
      reviewPathSteps.flatMap((step) => step.matchedSourceAlignmentNoteCardIds),
    ).size,
    staticEvidenceNoteCount: new Set(
      reviewPathSteps.flatMap((step) => step.matchedStaticEvidenceNoteRowIds),
    ).size,
    staticFollowUpPromptCount: new Set(
      reviewPathSteps.flatMap((step) => step.matchedStaticFollowUpPromptRowIds),
    ).size,
    sourceAnchorCount: new Set(
      reviewPathSteps.flatMap((step) => step.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.coverageRows.reduce(
        (count, row) => count + row.evidenceCallbackIds.length,
        0,
      ),
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.coverageRows.reduce(
        (count, row) => count + row.gapDiscussionPointIds.length,
        0,
      ),
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageBoard.coverageRows.reduce(
        (count, row) => count + row.deferredScopeReminderIds.length,
        0,
      ),
    localOnlyReviewPathStepCount: reviewPathSteps.filter(
      (step) => step.localOnly,
    ).length,
    localOnlyStaticHandoffPromptCardCount: staticHandoffPromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageBoardStaticNonGoalFlagsView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReviewPathStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageReviewProgress: true,
    noSavedCoverageReviewProgress: true,
    noSavedCoverageProgress: true,
    noSavedHandoffPromptEdits: true,
  };
}

function staticResponseTraceCoverageReviewPathItemFlags() {
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
