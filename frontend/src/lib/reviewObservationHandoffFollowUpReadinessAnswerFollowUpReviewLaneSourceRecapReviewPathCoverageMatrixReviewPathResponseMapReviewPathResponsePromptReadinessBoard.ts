import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticNonGoalFlagsView as Stage77StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardView as Stage77StaticResponsePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepView as Stage77ReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardView as Stage78StaticAnswerCheckCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticNonGoalFlagsView as Stage78StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowView as Stage78ReadinessRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardSummaryView as Stage78Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardView as Stage78View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathView as Stage77View,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoard(
  sourceResponseMapReviewPath: Stage77View | undefined,
): Stage78View | undefined {
  if (
    !sourceResponseMapReviewPath?.staticResponsePromptCards.length ||
    !sourceResponseMapReviewPath.responseMapReviewPathSteps.length
  ) {
    return undefined;
  }

  const staticAnswerCheckCards =
    sourceResponseMapReviewPath.responseMapReviewPathSteps.map((reviewPathStep) =>
      buildStaticAnswerCheckCard(
        reviewPathStep,
        sourceResponseMapReviewPath.staticResponsePromptCards,
      ),
    );
  const responsePromptReadinessRows =
    sourceResponseMapReviewPath.staticResponsePromptCards.map(
      (staticResponsePromptCard) =>
        buildResponsePromptReadinessRow(
          staticResponsePromptCard,
          staticAnswerCheckCards,
        ),
    );
  const defaultResponsePromptReadinessRow =
    responsePromptReadinessRows.find(
      (row) =>
        row.sourceStaticResponsePromptCardId ===
        sourceResponseMapReviewPath.defaultStaticResponsePromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
    ) ?? responsePromptReadinessRows[0];
  const defaultStaticAnswerCheckCard =
    staticAnswerCheckCards.find(
      (card) =>
        card.sourceResponseMapReviewPathStepId ===
        sourceResponseMapReviewPath.defaultReviewPathStep
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
    ) ?? staticAnswerCheckCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path_response_prompt_readiness_board.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review-path response-prompt readiness board and static answer checks",
    localStatus: sourceResponseMapReviewPath.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path-response-prompt-readiness-board",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review-path response-prompt readiness board",
      summary:
        "A static response-prompt readiness board derives from Stage 77 static response-prompt cards and response-map review-path steps so reviewers can verify prompt coverage, source anchors, callbacks, gap prompts, deferred reminders, response-prompt labels, response-map review-path labels, and manual-answer constraints before drafting the next response outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved prompt readiness state, saved answer-check state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultReadinessContext: {
        defaultResponsePromptReadinessRowId:
          defaultResponsePromptReadinessRow
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
        defaultStaticAnswerCheckCardId:
          defaultStaticAnswerCheckCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
        defaultStaticResponsePromptCardId:
          defaultResponsePromptReadinessRow.sourceStaticResponsePromptCardId,
        defaultResponseMapReviewPathStepId:
          defaultStaticAnswerCheckCard.sourceResponseMapReviewPathStepId,
        defaultResponseMapRowId: defaultStaticAnswerCheckCard.sourceResponseMapRowId,
        defaultResponseMapStaticFollowUpPromptCardId:
          defaultResponsePromptReadinessRow.sourceResponseMapStaticFollowUpPromptCardId,
        defaultCoverageReviewPathStepId:
          defaultStaticAnswerCheckCard.sourceCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultStaticAnswerCheckCard.sourceCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          defaultStaticAnswerCheckCard.sourceReviewPathStepId,
        defaultSourceRecapRowId: defaultStaticAnswerCheckCard.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultStaticAnswerCheckCard.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultStaticAnswerCheckCard.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultStaticAnswerCheckCard.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultStaticAnswerCheckCard.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultStaticAnswerCheckCard.sourceRehearsalPathStepId,
        defaultReviewBoardRowId: defaultStaticAnswerCheckCard.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultStaticAnswerCheckCard.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultStaticAnswerCheckCard
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultStaticCoveragePromptCardId:
          defaultResponsePromptReadinessRow.sourceStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultResponsePromptReadinessRow.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultResponsePromptReadinessRow.sourceStaticReviewerCheckCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathSummary:
          sourceResponseMapReviewPath.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathDefaultContext:
          sourceResponseMapReviewPath.summary.defaultReviewPathContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responsePromptReadinessRows,
        staticAnswerCheckCards,
        sourceResponseMapReviewPath,
      ),
    },
    defaultResponsePromptReadinessRow,
    defaultStaticAnswerCheckCard,
    responsePromptReadinessRows,
    staticAnswerCheckCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardSummary:
      "Stage 78 response-prompt readiness rows and static answer-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, prompt readiness state, answer-check state, response prompts, response-map review-path state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath:
      sourceResponseMapReviewPath,
  };
}

function buildResponsePromptReadinessRow(
  staticResponsePromptCard: Stage77StaticResponsePromptCard,
  staticAnswerCheckCards: Stage78StaticAnswerCheckCard[],
): Stage78ReadinessRow {
  const sourceStaticResponsePromptCardId =
    staticResponsePromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId;
  const matchedStaticAnswerCheckCards = staticAnswerCheckCards.filter((card) =>
    card.sourceStaticResponsePromptCardIds.includes(sourceStaticResponsePromptCardId),
  );
  const responsePromptReadinessLabels = buildResponsePromptReadinessLabels(
    staticResponsePromptCard,
    matchedStaticAnswerCheckCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board:readiness:${sourceStaticResponsePromptCardId}`;

  return {
    ...staticResponsePromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowOrder:
      staticResponsePromptCard.staticResponsePromptOrder,
    sourceStaticResponsePromptCardId,
    sourceStaticResponsePromptCardIds: [sourceStaticResponsePromptCardId],
    sourceResponseMapReviewPathStepIds:
      staticResponsePromptCard.matchedResponseMapReviewPathStepIds,
    sourceResponseMapRowIds: staticResponsePromptCard.matchedResponseMapRowIds,
    responsePromptReadinessLabels,
    responsePromptReadinessText:
      `Response-prompt readiness row ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardReadinessRowId}: verify Stage 77 static response-prompt card ${sourceStaticResponsePromptCardId}, Stage 77 response-map review-path steps ${staticResponsePromptCard.matchedResponseMapReviewPathStepIds.join(", ") || "none"}, Stage 76 response-map rows ${staticResponsePromptCard.matchedResponseMapRowIds.join(", ") || "none"}, Stage 76 static follow-up prompt card ${staticResponsePromptCard.sourceResponseMapStaticFollowUpPromptCardId}, Stage 75 coverage-review steps ${staticResponsePromptCard.matchedCoverageReviewPathStepIds.join(", ") || "none"}, Stage 75 static coverage-prompt card ${staticResponsePromptCard.sourceStaticCoveragePromptCardId}, Stage 74 readiness-cue card ${staticResponsePromptCard.sourceStaticReadinessCueCardId}, Stage 73 reviewer-check card ${staticResponsePromptCard.sourceStaticReviewerCheckCardId}, Stage 72 next-pass prompt card ${staticResponsePromptCard.sourceStaticNextPassPromptCardId}, Stage 71 decision-cue card ${staticResponsePromptCard.sourceStaticDecisionCueCardId}, Stage 70 follow-up prompt card ${staticResponsePromptCard.sourceStaticFollowUpPromptCardId}, Stage 69 review-note card ${staticResponsePromptCard.sourceStaticReviewNoteCardId}, anchors ${staticResponsePromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticResponsePromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticResponsePromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticResponsePromptCard.deferredScopeReminderIds.join(", ")}, response-prompt labels ${staticResponsePromptCard.responsePromptLabels.join(", ") || "none"}, readiness labels ${responsePromptReadinessLabels.join(", ") || "none"}, and carried static response-prompt text "${staticResponsePromptCard.staticResponsePromptText}" as local manual-answer preparation context only.`,
    staticAnswerCheckText:
      `Static answer-check prompt for readiness row ${sourceStaticResponsePromptCardId}: compare matched answer-check cards ${matchedStaticAnswerCheckCards.map((card) => card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId).join(", ") || "none"} against Stage 77 static response-prompt card ${sourceStaticResponsePromptCardId}, Stage 76 static follow-up prompt ${staticResponsePromptCard.sourceResponseMapStaticFollowUpPromptCardId}, anchors ${staticResponsePromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticResponsePromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticResponsePromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticResponsePromptCard.deferredScopeReminderIds.join(", ")}, and response-prompt labels ${staticResponsePromptCard.responsePromptLabels.join(", ") || "none"} without saving reviewer answers, answer drafts, reviewer notes, response notes, prompt readiness state, answer-check state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-prompt readiness context: manual response-prompt coverage and answer-check preparation only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved prompt readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticResponsePromptCard.staticNonGoalFlags,
    ),
  };
}

function buildStaticAnswerCheckCard(
  responseMapReviewPathStep: Stage77ReviewPathStep,
  staticResponsePromptCards: Stage77StaticResponsePromptCard[],
): Stage78StaticAnswerCheckCard {
  const sourceResponseMapReviewPathStepId =
    responseMapReviewPathStep
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId;
  const matchedStaticResponsePromptCards = staticResponsePromptCards.filter((card) =>
    staticResponsePromptCardMatchesReviewPathStep(card, responseMapReviewPathStep),
  );
  const sourceStaticResponsePromptCardIds = matchedStaticResponsePromptCards.map(
    (card) =>
      card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
  );
  const staticAnswerCheckLabels = buildStaticAnswerCheckLabels(
    responseMapReviewPathStep,
    matchedStaticResponsePromptCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path-response-prompt-readiness-board:static-answer-check:${sourceResponseMapReviewPathStepId}`;

  return {
    ...responseMapReviewPathStep,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId,
      ],
    sourceResponseMapReviewPathStepId,
    sourceResponseMapReviewPathStepIds: [sourceResponseMapReviewPathStepId],
    sourceStaticResponsePromptCardIds,
    staticAnswerCheckOrder:
      responseMapReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepOrder,
    staticAnswerCheckLabels,
    staticAnswerCheckText:
      `Static answer check ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathResponsePromptReadinessBoardStaticAnswerCheckCardId}: review Stage 77 response-map review-path step ${sourceResponseMapReviewPathStepId}, Stage 77 static response-prompt cards ${sourceStaticResponsePromptCardIds.join(", ") || "none"}, Stage 76 response-map row ${responseMapReviewPathStep.sourceResponseMapRowId}, Stage 76 static follow-up prompt cards ${responseMapReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${responseMapReviewPathStep.sourceCoverageReviewPathStepId}, Stage 75 static coverage-prompt cards ${responseMapReviewPathStep.sourceStaticCoveragePromptCardIds.join(", ") || "none"}, Stage 74 coverage row ${responseMapReviewPathStep.sourceCoverageMatrixRowId}, Stage 74 readiness-cue cards ${responseMapReviewPathStep.sourceStaticReadinessCueCardIds.join(", ") || "none"}, Stage 73 review-path step ${responseMapReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${responseMapReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${responseMapReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${responseMapReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${responseMapReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${responseMapReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal path step ${responseMapReviewPathStep.sourceRehearsalPathStepId}, Stage 66 review board row ${responseMapReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${responseMapReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${responseMapReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${responseMapReviewPathStep.sourceLocalAnchorHrefs.join(", ")}, callbacks ${responseMapReviewPathStep.evidenceCallbackIds.join(", ")}, gap prompts ${responseMapReviewPathStep.gapDiscussionPointIds.join(", ")}, deferred reminders ${responseMapReviewPathStep.deferredScopeReminderIds.join(", ")}, response-map review-path labels ${responseMapReviewPathStep.responseMapReviewPathLabels.join(", ") || "none"}, response-prompt labels ${responseMapReviewPathStep.responsePromptLabels.join(", ") || "none"}, answer-check labels ${staticAnswerCheckLabels.join(", ") || "none"}, review-path text "${responseMapReviewPathStep.responseMapReviewPathText}", and static response-prompt text "${responseMapReviewPathStep.staticResponsePromptText}" as deterministic manual-answer constraint context only.`,
    staticNonGoalContext:
      "Static answer-check context: manual answer constraints and source coverage checks only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved prompt readiness state, saved answer-check state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responseMapReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  responsePromptReadinessRows: Stage78ReadinessRow[],
  staticAnswerCheckCards: Stage78StaticAnswerCheckCard[],
  sourceResponseMapReviewPath: Stage77View,
): Stage78Summary["counts"] {
  const sourceCounts = sourceResponseMapReviewPath.summary.counts;

  return {
    ...sourceCounts,
    responsePromptReadinessRowCount: responsePromptReadinessRows.length,
    staticAnswerCheckCardCount: staticAnswerCheckCards.length,
    responsePromptReadinessLabelCount: unique(
      responsePromptReadinessRows.flatMap(
        (row) => row.responsePromptReadinessLabels,
      ),
    ).length,
    staticAnswerCheckLabelCount: unique(
      staticAnswerCheckCards.flatMap((card) => card.staticAnswerCheckLabels),
    ).length,
    localOnlyResponsePromptReadinessRowCount: responsePromptReadinessRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticAnswerCheckCardCount: staticAnswerCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildResponsePromptReadinessLabels(
  staticResponsePromptCard: Stage77StaticResponsePromptCard,
  matchedStaticAnswerCheckCards: Stage78StaticAnswerCheckCard[],
): string[] {
  const labels = ["response-prompt readiness row", "static answer-check context"];

  if (matchedStaticAnswerCheckCards.length) {
    labels.push("response-map review-path source alignment");
  }

  if (staticResponsePromptCard.responsePromptLabels.length) {
    labels.push("response-prompt label carry-forward");
  }

  if (
    staticResponsePromptCard.sourceLocalAnchorHrefs.length ||
    staticResponsePromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback readiness context");
  }

  if (
    staticResponsePromptCard.gapDiscussionPointIds.length ||
    staticResponsePromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder readiness context");
  }

  return labels;
}

function buildStaticAnswerCheckLabels(
  responseMapReviewPathStep: Stage77ReviewPathStep,
  matchedStaticResponsePromptCards: Stage77StaticResponsePromptCard[],
): string[] {
  const labels = ["static answer check", "manual answer constraint"];

  if (matchedStaticResponsePromptCards.length) {
    labels.push("response-prompt source alignment");
  }

  if (responseMapReviewPathStep.responseMapReviewPathLabels.length) {
    labels.push("response-map review-path carry-forward");
  }

  if (
    responseMapReviewPathStep.sourceLocalAnchorHrefs.length ||
    responseMapReviewPathStep.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback answer check");
  }

  if (
    responseMapReviewPathStep.gapDiscussionPointIds.length ||
    responseMapReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder answer check");
  }

  return labels;
}

function staticResponsePromptCardMatchesReviewPathStep(
  staticResponsePromptCard: Stage77StaticResponsePromptCard,
  responseMapReviewPathStep: Stage77ReviewPathStep,
): boolean {
  return (
    staticResponsePromptCard.matchedResponseMapReviewPathStepIds.includes(
      responseMapReviewPathStep
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
    ) ||
    staticResponsePromptCard.sourceResponseMapStaticFollowUpPromptCardIds.some(
      (cardId) =>
        responseMapReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.includes(
          cardId,
        ),
    ) ||
    staticResponsePromptCard.matchedResponseMapRowIds.includes(
      responseMapReviewPathStep.sourceResponseMapRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage77StaticNonGoalFlags,
): Stage78StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedPromptReadinessState: true,
    noSavedResponsePromptReadinessBoard: true,
    noSavedReadinessRows: true,
    noSavedAnswerCheckState: true,
    noSavedAnswerChecks: true,
    noSavedAnswerCheckCards: true,
    noSavedManualAnswerConstraints: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
