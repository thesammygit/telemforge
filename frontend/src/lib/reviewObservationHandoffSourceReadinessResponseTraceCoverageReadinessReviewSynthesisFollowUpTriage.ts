import type {
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummaryView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticNonGoalFlagsView,
  ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriage(
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis:
    | ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisView
    | undefined,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageView | undefined {
  if (
    !sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
      ?.synthesisRows.length
  ) {
    return undefined;
  }

  const followUpTriageRows =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis.synthesisRows.map(
      (synthesisRow) =>
        buildFollowUpTriageRow(
          synthesisRow,
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis.staticFollowUpNoteCards,
        ),
    );
  const staticCheckPromptCards =
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis.staticFollowUpNoteCards.map(
      (staticFollowUpNoteCard) =>
        buildStaticCheckPromptCard(
          staticFollowUpNoteCard,
          followUpTriageRows,
        ),
    );
  const defaultFollowUpTriageRow =
    followUpTriageRows.find(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
          .summary.defaultReviewSynthesisContext.defaultSynthesisRowId,
    ) ?? followUpTriageRows[0];
  const defaultStaticCheckPromptCard =
    staticCheckPromptCards.find(
      (card) =>
        card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId ===
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
          .summary.defaultReviewSynthesisContext
          .defaultStaticFollowUpNoteCardId,
    ) ?? staticCheckPromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_source_readiness_response_trace_coverage_readiness_review_synthesis_follow_up_triage.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff source readiness response trace coverage readiness review synthesis follow-up triage and static check prompts",
    localStatus:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis.localStatus,
    summary: {
      sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageId:
        "candidate-local-review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-follow-up-triage",
      label:
        "Local observation handoff source readiness response trace coverage readiness review synthesis follow-up triage",
      summary:
        "A static follow-up triage derives from Stage 63 synthesis rows and static check prompt cards derive from Stage 63 static follow-up note cards so reviewers can inspect synthesis rows, review-lane rows, readiness brief rows, review path steps, coverage rows, response trace rows, walkthrough steps, response rows, question rows, source anchors, evidence callbacks, gap discussion prompts, deferred-scope reminders, coverage notes, gap notes, handoff prompts, readiness brief text, reviewer cue text, review-lane text, human-check prompts, follow-up notes, and static check prompts before human review without saved reviewer answers, saved triage state, saved synthesis state, saved follow-up notes, saved check prompts, saved gap notes, saved handoff prompt edits, saved source readiness progress, saved source inspection state, saved anchor state, saved relay progress, routes, exports, signoff, audit retention, scoring, certification, meeting workflow, handoff packages, runnable checklists, task launchers, owner assignment, or commands.",
      defaultFollowUpTriageContext: {
        defaultFollowUpTriageRowId:
          defaultFollowUpTriageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultSynthesisRowId:
          defaultFollowUpTriageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
        defaultReviewLaneRowId:
          defaultFollowUpTriageRow
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
        defaultReadinessBriefRowId:
          defaultFollowUpTriageRow
            .sourceReadinessResponseTraceCoverageReadinessBriefRowId,
        defaultReviewPathStepId:
          defaultFollowUpTriageRow
            .sourceReadinessResponseTraceCoverageReviewPathStepId,
        defaultCoverageRowId:
          defaultFollowUpTriageRow.sourceReadinessResponseTraceCoverageRowId,
        defaultTraceRowId:
          defaultFollowUpTriageRow.sourceReadinessResponseTraceRowId,
        defaultStaticCheckPromptCardId:
          defaultStaticCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId,
        defaultStaticFollowUpNoteCardId:
          defaultStaticCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
        defaultStaticHumanCheckPromptCardId:
          defaultStaticCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
        defaultStaticReviewerCueCardId:
          defaultStaticCheckPromptCard
            .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
        defaultStaticHandoffPromptCardId:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
            .summary.defaultReviewSynthesisContext.defaultStaticHandoffPromptCardId,
        sourceReadinessResponseTraceCoverageReadinessReviewSynthesisSummary:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
            .summary.summary,
        sourceReadinessResponseTraceCoverageReadinessReviewSynthesisDefaultContext:
          sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
            .summary.defaultReviewSynthesisContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        followUpTriageRows,
        staticCheckPromptCards,
        sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
      ),
    },
    defaultFollowUpTriageRow,
    defaultStaticCheckPromptCard,
    followUpTriageRows,
    staticCheckPromptCards,
    staticSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummary:
      "Stage 64 readiness review synthesis follow-up triage rows and static check prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, triage state, synthesis state, follow-up notes, check prompts, human-check prompts, gap notes, handoff prompt edits, response progress, source readiness progress, source inspection state, anchor state, relay progress, review sessions, reviewer progress, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis,
  };
}

function buildFollowUpTriageRow(
  synthesisRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
  staticFollowUpNoteCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView {
  const matchedStaticFollowUpNoteCards = staticFollowUpNoteCards.filter(
    (card) => staticFollowUpNoteMatchesSynthesisRow(card, synthesisRow),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-follow-up-triage:${synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}`,
    followUpTriageRowOrder: synthesisRow.synthesisRowOrder,
    label: `${synthesisRow.label} follow-up triage`,
    summary:
      `Follow-up triage row ${synthesisRow.synthesisRowOrder} preserves Stage 63 synthesis row order for ${synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}, review-lane row ${synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId}, readiness brief row ${synthesisRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId}, review path step ${synthesisRow.sourceReadinessResponseTraceCoverageReviewPathStepId}, coverage row ${synthesisRow.sourceReadinessResponseTraceCoverageRowId}, trace row ${synthesisRow.sourceReadinessResponseTraceRowId}, walkthrough step ${synthesisRow.sourceReadinessResponseWalkthroughStepId}, response row ${synthesisRow.sourceReadinessResponseRowId}, question row ${synthesisRow.sourceReadinessQuestionRowId}, ${synthesisRow.matchedStaticReviewerCueCardIds.length} static reviewer cues, ${synthesisRow.matchedStaticHumanCheckPromptCardIds.length} static human checks, ${synthesisRow.matchedStaticHandoffPromptCardIds.length} static handoff prompts, ${matchedStaticFollowUpNoteCards.length} static follow-up notes, ${synthesisRow.sourceAnchorTargetIds.length} anchors, ${synthesisRow.evidenceCallbackIds.length} callbacks, ${synthesisRow.gapDiscussionPointIds.length} gap prompts, and ${synthesisRow.deferredScopeReminderIds.length} deferred reminders without saved triage state, saved check prompts, saved synthesis state, saved follow-up notes, saved gap notes, saved handoff prompt edits, saved reviewer answers, routes, exports, signoff, audit state, scores, certification, owner assignment, meetings, packages, task launchers, runnable checklists, or commands.`,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId:
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowIds: [
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ],
    sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId:
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneRowIds:
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowIds,
    sourceReadinessResponseTraceCoverageReadinessBriefRowId:
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    sourceReadinessResponseTraceCoverageReadinessBriefRowIds:
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessBriefRowIds,
    sourceReadinessResponseTraceCoverageReviewPathStepId:
      synthesisRow.sourceReadinessResponseTraceCoverageReviewPathStepId,
    sourceReadinessResponseTraceCoverageReviewPathStepIds:
      synthesisRow.sourceReadinessResponseTraceCoverageReviewPathStepIds,
    sourceReadinessResponseTraceCoverageRowId:
      synthesisRow.sourceReadinessResponseTraceCoverageRowId,
    sourceReadinessResponseTraceCoverageRowIds:
      synthesisRow.sourceReadinessResponseTraceCoverageRowIds,
    sourceReadinessResponseTraceRowId:
      synthesisRow.sourceReadinessResponseTraceRowId,
    sourceReadinessResponseTraceRowIds:
      synthesisRow.sourceReadinessResponseTraceRowIds,
    sourceReadinessResponseWalkthroughStepId:
      synthesisRow.sourceReadinessResponseWalkthroughStepId,
    sourceReadinessResponseWalkthroughStepIds:
      synthesisRow.sourceReadinessResponseWalkthroughStepIds,
    sourceReadinessResponseRowId:
      synthesisRow.sourceReadinessResponseRowId,
    sourceReadinessResponseRowIds:
      synthesisRow.sourceReadinessResponseRowIds,
    sourceReadinessQuestionRowId:
      synthesisRow.sourceReadinessQuestionRowId,
    sourceReadinessQuestionRowIds: synthesisRow.sourceReadinessQuestionRowIds,
    matchedStaticReviewerCueCardIds:
      synthesisRow.matchedStaticReviewerCueCardIds,
    matchedStaticHumanCheckPromptCardIds:
      synthesisRow.matchedStaticHumanCheckPromptCardIds,
    matchedStaticHandoffPromptCardIds:
      synthesisRow.matchedStaticHandoffPromptCardIds,
    matchedStaticFollowUpNoteCardIds:
      matchedStaticFollowUpNoteCards.map(
        (card) =>
          card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
      ),
    sourceLocalAnchorHrefs: synthesisRow.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: synthesisRow.sourceAnchorTargetIds,
    evidenceCallbackIds: synthesisRow.evidenceCallbackIds,
    gapDiscussionPointIds: synthesisRow.gapDiscussionPointIds,
    deferredScopeReminderIds: synthesisRow.deferredScopeReminderIds,
    reviewerCueText: synthesisRow.reviewerCueText,
    coverageNoteText: synthesisRow.coverageNoteText,
    gapNoteText: synthesisRow.gapNoteText,
    handoffPromptText: synthesisRow.handoffPromptText,
    readinessBriefText: synthesisRow.readinessBriefText,
    reviewLaneText: synthesisRow.reviewLaneText,
    humanCheckPromptText: synthesisRow.humanCheckPromptText,
    followUpNoteText: synthesisRow.followUpNoteText,
    staticCheckPromptText:
      `Static check prompt for ${synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId}: verify follow-up notes ${matchedStaticFollowUpNoteCards.map((card) => card.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId).join(", ") || "none"}, review-lane text, human-check prompt text, coverage note, gap note, handoff prompt, anchors ${synthesisRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${synthesisRow.evidenceCallbackIds.join(", ")}, gap prompts ${synthesisRow.gapDiscussionPointIds.join(", ")}, and deferred reminders ${synthesisRow.deferredScopeReminderIds.join(", ")} as local manual-review context only.`,
    staticNonGoalContexts: synthesisRow.staticNonGoalContexts,
    staticNonGoalFlags: staticNonGoalFlags(synthesisRow.staticNonGoalFlags),
    ...staticResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageItemFlags(),
  };
}

function buildStaticCheckPromptCard(
  staticFollowUpNoteCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView,
  followUpTriageRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView[],
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView {
  const cardId =
    staticFollowUpNoteCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId;
  const matchedFollowUpTriageRows = followUpTriageRows.filter((row) =>
    row.matchedStaticFollowUpNoteCardIds.includes(cardId) ||
    staticFollowUpNoteCard.matchedSynthesisRowIds.includes(
      row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticFollowUpNoteCard.matchedReviewLaneRowIds.includes(
      row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    staticFollowUpNoteCard.matchedReadinessBriefRowIds.includes(
      row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
    ) ||
    staticFollowUpNoteCard.matchedReviewPathStepIds.includes(
      row.sourceReadinessResponseTraceCoverageReviewPathStepId,
    ) ||
    staticFollowUpNoteCard.matchedCoverageRowIds.includes(
      row.sourceReadinessResponseTraceCoverageRowId,
    ) ||
    staticFollowUpNoteCard.matchedResponseTraceRowIds.includes(
      row.sourceReadinessResponseTraceRowId,
    ) ||
    staticFollowUpNoteCard.matchedResponseRowIds.includes(
      row.sourceReadinessResponseRowId,
    ) ||
    staticFollowUpNoteCard.matchedQuestionRowIds.includes(
      row.sourceReadinessQuestionRowId,
    ),
  );

  return {
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardId: `review-observation-handoff-source-readiness-response-trace-coverage-readiness-review-synthesis-follow-up-triage:static-check:${cardId}`,
    staticCheckPromptOrder: staticFollowUpNoteCard.followUpNoteOrder,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId:
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
    sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardIds:
      [
        staticFollowUpNoteCard
          .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId,
      ],
    sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId:
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardIds:
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardIds,
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId:
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardId,
    sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardIds:
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessBriefStaticReviewerCueCardIds,
    matchedFollowUpTriageRowIds: matchedFollowUpTriageRows.map(
      (row) =>
        row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
    ),
    matchedSynthesisRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedSynthesisRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) =>
          row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
      ),
    ]),
    matchedReviewLaneRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedReviewLaneRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) =>
          row.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
      ),
    ]),
    matchedReadinessBriefRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedReadinessBriefRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessResponseTraceCoverageReadinessBriefRowId,
      ),
    ]),
    matchedReviewPathStepIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedReviewPathStepIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessResponseTraceCoverageReviewPathStepId,
      ),
    ]),
    matchedCoverageRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedCoverageRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessResponseTraceCoverageRowId,
      ),
    ]),
    matchedResponseTraceRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedResponseTraceRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessResponseTraceRowId,
      ),
    ]),
    matchedResponseWalkthroughStepIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedResponseWalkthroughStepIds,
      ...matchedFollowUpTriageRows.flatMap(
        (row) => row.sourceReadinessResponseWalkthroughStepIds,
      ),
    ]),
    matchedResponseRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedResponseRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessResponseRowId,
      ),
    ]),
    matchedQuestionRowIds: uniqueStrings([
      ...staticFollowUpNoteCard.matchedQuestionRowIds,
      ...matchedFollowUpTriageRows.map(
        (row) => row.sourceReadinessQuestionRowId,
      ),
    ]),
    sourceLocalAnchorHrefs: staticFollowUpNoteCard.sourceLocalAnchorHrefs,
    sourceAnchorTargetIds: staticFollowUpNoteCard.sourceAnchorTargetIds,
    localAnchorHref: staticFollowUpNoteCard.localAnchorHref,
    anchorTargetId: staticFollowUpNoteCard.anchorTargetId,
    evidenceCallbackIds: staticFollowUpNoteCard.evidenceCallbackIds,
    gapDiscussionPointIds: staticFollowUpNoteCard.gapDiscussionPointIds,
    deferredScopeReminderIds:
      staticFollowUpNoteCard.deferredScopeReminderIds,
    label: `${staticFollowUpNoteCard.label} static check prompt`,
    summary:
      `Static check prompt ${staticFollowUpNoteCard.followUpNoteOrder} preserves Stage 63 static follow-up note order for ${staticFollowUpNoteCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId} and matched triage rows ${matchedFollowUpTriageRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId).join(", ") || "none"} while remaining local, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying.`,
    reviewLaneText:
      matchedFollowUpTriageRows.map((row) => row.reviewLaneText).join(" ") ||
      staticFollowUpNoteCard.reviewLaneText,
    followUpNoteText: staticFollowUpNoteCard.followUpNoteText,
    staticCheckPromptText:
      `Static check prompt for ${staticFollowUpNoteCard.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardId}: compare matched triage rows ${matchedFollowUpTriageRows.map((row) => row.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId).join(", ") || "none"}, synthesis rows ${staticFollowUpNoteCard.matchedSynthesisRowIds.join(", ") || "none"}, review-lane rows ${staticFollowUpNoteCard.matchedReviewLaneRowIds.join(", ") || "none"}, readiness brief rows ${staticFollowUpNoteCard.matchedReadinessBriefRowIds.join(", ") || "none"}, review path steps ${staticFollowUpNoteCard.matchedReviewPathStepIds.join(", ") || "none"}, coverage rows ${staticFollowUpNoteCard.matchedCoverageRowIds.join(", ") || "none"}, response traces ${staticFollowUpNoteCard.matchedResponseTraceRowIds.join(", ") || "none"}, responses ${staticFollowUpNoteCard.matchedResponseRowIds.join(", ") || "none"}, questions ${staticFollowUpNoteCard.matchedQuestionRowIds.join(", ") || "none"}, anchors ${staticFollowUpNoteCard.sourceAnchorTargetIds.join(", ")}, callbacks ${staticFollowUpNoteCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticFollowUpNoteCard.gapDiscussionPointIds.join(", ")}, and deferred reminders ${staticFollowUpNoteCard.deferredScopeReminderIds.join(", ")} as static manual-review context only.`,
    staticNonGoalFlags: staticNonGoalFlags(
      staticFollowUpNoteCard.staticNonGoalFlags,
    ),
    ...staticResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageItemFlags(),
  };
}

function staticFollowUpNoteMatchesSynthesisRow(
  staticFollowUpNoteCard: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticFollowUpNoteCardView,
  synthesisRow: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowView,
): boolean {
  return (
    staticFollowUpNoteCard.matchedSynthesisRowIds.includes(
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisRowId,
    ) ||
    staticFollowUpNoteCard.matchedReviewLaneRowIds.includes(
      synthesisRow.sourceReadinessResponseTraceCoverageReadinessReviewLaneRowId,
    ) ||
    synthesisRow.matchedStaticHumanCheckPromptCardIds.includes(
      staticFollowUpNoteCard
        .sourceReadinessResponseTraceCoverageReadinessReviewLaneStaticHumanCheckPromptCardId,
    )
  );
}

function buildCounts(
  followUpTriageRows: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowView[],
  staticCheckPromptCards: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticCheckPromptCardView[],
  sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageSummaryView["counts"] {
  return {
    followUpTriageRowCount: followUpTriageRows.length,
    staticCheckPromptCardCount: staticCheckPromptCards.length,
    synthesisRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .synthesisRows.length,
    staticFollowUpNoteCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .staticFollowUpNoteCards.length,
    reviewLaneRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.reviewLaneRowCount,
    staticHumanCheckPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.staticHumanCheckPromptCardCount,
    readinessBriefRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.readinessBriefRowCount,
    staticReviewerCueCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.staticReviewerCueCardCount,
    reviewPathStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.reviewPathStepCount,
    staticHandoffPromptCardCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.staticHandoffPromptCardCount,
    coverageRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.coverageRowCount,
    responseTraceRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.responseTraceRowCount,
    responseWalkthroughStepCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.responseWalkthroughStepCount,
    responseRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.responseRowCount,
    questionRowCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.questionRowCount,
    sourceAnchorCount: new Set(
      followUpTriageRows.flatMap((row) => row.sourceAnchorTargetIds),
    ).size,
    evidenceCallbackCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.evidenceCallbackCount,
    gapDiscussionPointCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.gapDiscussionPointCount,
    deferredScopeReminderCount:
      sourceReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesis
        .summary.counts.deferredScopeReminderCount,
    localOnlyFollowUpTriageRowCount:
      followUpTriageRows.filter((row) => row.localOnly).length,
    localOnlyStaticCheckPromptCardCount:
      staticCheckPromptCards.filter((card) => card.localOnly).length,
  };
}

function staticNonGoalFlags(
  sourceFlags: ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisStaticNonGoalFlagsView,
): ReviewObservationHandoffSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedSourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageState:
      true,
    noSavedFollowUpTriageState: true,
    noSavedTriageState: true,
    noSavedStaticCheckPrompts: true,
    noSavedCheckPrompts: true,
  };
}

function staticResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageItemFlags() {
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
