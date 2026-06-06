import type {
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowView as Stage76ResponseMapRow,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardView as Stage76StaticFollowUpPromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticNonGoalFlagsView as Stage76StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapSummaryView as Stage76ResponseMapSummary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticNonGoalFlagsView as Stage77StaticNonGoalFlags,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardView as Stage77StaticResponsePromptCard,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepView as Stage77ReviewPathStep,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathSummaryView as Stage77Summary,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathView as Stage77View,
  ReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapView as Stage76ResponseMapView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPath(
  sourceResponseMap: Stage76ResponseMapView | undefined,
): Stage77View | undefined {
  if (
    !sourceResponseMap?.responseMapRows.length ||
    !sourceResponseMap.staticFollowUpPromptCards.length
  ) {
    return undefined;
  }

  const responseMapReviewPathSteps = sourceResponseMap.responseMapRows.map(
    (responseMapRow) =>
      buildResponseMapReviewPathStep(
        responseMapRow,
        sourceResponseMap.staticFollowUpPromptCards,
      ),
  );
  const staticResponsePromptCards =
    sourceResponseMap.staticFollowUpPromptCards.map((staticFollowUpPromptCard) =>
      buildStaticResponsePromptCard(
        staticFollowUpPromptCard,
        responseMapReviewPathSteps,
      ),
    );
  const defaultReviewPathStep =
    responseMapReviewPathSteps.find(
      (step) =>
        step.sourceResponseMapRowId ===
        sourceResponseMap.defaultResponseMapRow
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    ) ?? responseMapReviewPathSteps[0];
  const defaultStaticResponsePromptCard =
    staticResponsePromptCards.find(
      (card) =>
        card.sourceResponseMapStaticFollowUpPromptCardId ===
        sourceResponseMap.defaultStaticFollowUpPromptCard
          .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
    ) ?? staticResponsePromptCards[0];

  return {
    schema:
      "telemforge.review_observation_handoff_follow_up_readiness_answer_follow_up_review_lane_source_recap_review_path_coverage_matrix_review_path_response_map_review_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff follow-up readiness answer follow-up review lane source recap review-path coverage-review response-map review path and static response prompts",
    localStatus: sourceResponseMap.localStatus,
    summary: {
      followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathId:
        "candidate-local-review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-review-response-map-review-path",
      label:
        "Local observation handoff follow-up readiness answer follow-up review lane source recap review path coverage-review response-map review path",
      summary:
        "A static response-map review path derives from Stage 76 response-map rows and static follow-up prompt cards so reviewers can compare response-map rows, follow-up prompts, anchors, callbacks, gap prompts, deferred reminders, response-map labels, and response-prompt labels before drafting the next manual response outside the app without saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-map state, saved response-map review-path state, saved follow-up prompts, saved response prompts, local storage, routes, exports, signoff, audit retention, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, persistence, or production handoff semantics.",
      defaultReviewPathContext: {
        defaultResponseMapReviewPathStepId:
          defaultReviewPathStep
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
        defaultResponseMapRowId: defaultReviewPathStep.sourceResponseMapRowId,
        defaultCoverageReviewPathStepId:
          defaultReviewPathStep.sourceCoverageReviewPathStepId,
        defaultCoverageMatrixRowId:
          defaultReviewPathStep.sourceCoverageMatrixRowId,
        defaultReviewPathSourceStepId:
          defaultReviewPathStep.sourceReviewPathStepId,
        defaultSourceRecapRowId: defaultReviewPathStep.sourceSourceRecapRowId,
        defaultAnswerFollowUpReviewLaneRowId:
          defaultReviewPathStep.sourceAnswerFollowUpReviewLaneRowId,
        defaultAnswerSourceCrosswalkRowId:
          defaultReviewPathStep.sourceAnswerSourceCrosswalkRowId,
        defaultAnswerWalkthroughStepId:
          defaultReviewPathStep.sourceAnswerWalkthroughStepId,
        defaultAnswerCoverageRowId:
          defaultReviewPathStep.sourceAnswerCoverageRowId,
        defaultRehearsalPathStepId:
          defaultReviewPathStep.sourceRehearsalPathStepId,
        defaultReviewBoardRowId: defaultReviewPathStep.sourceReviewBoardRowId,
        defaultFollowUpReadinessBriefRowId:
          defaultReviewPathStep.followUpReadinessBriefRowId,
        defaultFollowUpTriageRowId:
          defaultReviewPathStep
            .sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId,
        defaultStaticResponsePromptCardId:
          defaultStaticResponsePromptCard
            .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
        defaultResponseMapStaticFollowUpPromptCardId:
          defaultStaticResponsePromptCard.sourceResponseMapStaticFollowUpPromptCardId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticResponsePromptCard.sourceStaticFollowUpPromptCardId,
        defaultStaticCoveragePromptCardId:
          defaultStaticResponsePromptCard.sourceStaticCoveragePromptCardId,
        defaultStaticReadinessCueCardId:
          defaultStaticResponsePromptCard.sourceStaticReadinessCueCardId,
        defaultStaticReviewerCheckCardId:
          defaultStaticResponsePromptCard.sourceStaticReviewerCheckCardId,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapSummary:
          sourceResponseMap.summary.summary,
        sourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapDefaultContext:
          sourceResponseMap.summary.defaultResponseMapContext,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        responseMapReviewPathSteps,
        staticResponsePromptCards,
        sourceResponseMap,
      ),
    },
    defaultReviewPathStep,
    defaultStaticResponsePromptCard,
    responseMapReviewPathSteps,
    staticResponsePromptCards,
    staticSourceFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathSummary:
      "Stage 77 response-map review path steps and static response-prompt cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, reviewer notes, response notes, response-map state, response-map review-path state, follow-up prompts, response prompts, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceReviewObservationHandoffFollowUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMap:
      sourceResponseMap,
  };
}

function buildResponseMapReviewPathStep(
  responseMapRow: Stage76ResponseMapRow,
  staticFollowUpPromptCards: Stage76StaticFollowUpPromptCard[],
): Stage77ReviewPathStep {
  const matchedStaticFollowUpPromptCards = staticFollowUpPromptCards.filter(
    (card) => staticFollowUpPromptCardMatchesResponseMapRow(card, responseMapRow),
  );
  const sourceResponseMapStaticFollowUpPromptCardIds =
    matchedStaticFollowUpPromptCards.map(
      (card) =>
        card.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
    );
  const responseMapReviewPathLabels = buildResponseMapReviewPathLabels(
    responseMapRow,
    matchedStaticFollowUpPromptCards,
  );
  const responsePromptLabels = buildResponsePromptLabels(
    responseMapRow,
    matchedStaticFollowUpPromptCards,
  );
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path:${responseMapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId}`;

  return {
    ...responseMapRow,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepOrder:
      responseMapRow
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowOrder,
    sourceResponseMapRowId:
      responseMapRow
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    sourceResponseMapRowIds: [
      responseMapRow
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    ],
    sourceResponseMapStaticFollowUpPromptCardIds,
    responseMapReviewPathLabels,
    responsePromptLabels,
    responseMapReviewPathText:
      `Response-map review path step ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId}: walk Stage 76 response-map row ${responseMapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId}, Stage 76 static follow-up prompt cards ${sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 75 coverage-review step ${responseMapRow.sourceCoverageReviewPathStepId}, Stage 75 static coverage-prompt cards ${responseMapRow.sourceStaticCoveragePromptCardIds.join(", ") || "none"}, Stage 74 coverage row ${responseMapRow.sourceCoverageMatrixRowId}, Stage 74 static readiness-cue cards ${responseMapRow.sourceStaticReadinessCueCardIds.join(", ") || "none"}, Stage 73 review-path step ${responseMapRow.sourceReviewPathStepId}, Stage 73 reviewer-check cards ${responseMapRow.sourceStaticReviewerCheckCardIds.join(", ") || "none"}, Stage 72 source recap row ${responseMapRow.sourceSourceRecapRowId}, Stage 72 static next-pass prompt cards ${responseMapRow.sourceStaticNextPassPromptCardIds.join(", ") || "none"}, Stage 71 review-lane row ${responseMapRow.sourceAnswerFollowUpReviewLaneRowId}, Stage 71 decision-cue cards ${responseMapRow.sourceStaticDecisionCueCardIds.join(", ") || "none"}, Stage 70 crosswalk row ${responseMapRow.sourceAnswerSourceCrosswalkRowId}, Stage 70 follow-up prompt cards ${responseMapRow.sourceStaticFollowUpPromptCardIds.join(", ") || "none"}, Stage 69 walkthrough step ${responseMapRow.sourceAnswerWalkthroughStepId}, Stage 69 review-note cards ${responseMapRow.sourceStaticReviewNoteCardIds.join(", ") || "none"}, Stage 68 answer coverage row ${responseMapRow.sourceAnswerCoverageRowId}, Stage 68 reviewer-check prompt cards ${responseMapRow.sourceStaticReviewerCheckPromptCardIds.join(", ") || "none"}, Stage 67 rehearsal path step ${responseMapRow.sourceRehearsalPathStepId}, Stage 67 answer-prep prompt cards ${responseMapRow.sourceStaticAnswerPrepPromptCardIds.join(", ") || "none"}, Stage 66 review board row ${responseMapRow.sourceReviewBoardRowId}, Stage 66 question prompt cards ${responseMapRow.matchedStaticQuestionPromptCardIds.join(", ") || "none"}, Stage 65 brief row ${responseMapRow.followUpReadinessBriefRowId}, Stage 64 triage row ${responseMapRow.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${responseMapRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${responseMapRow.evidenceCallbackIds.join(", ")}, gap prompts ${responseMapRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${responseMapRow.deferredScopeReminderIds.join(", ")}, response-map labels ${responseMapRow.responseMapLabels.join(", ") || "none"}, review-path labels ${responseMapReviewPathLabels.join(", ") || "none"}, response-prompt labels ${responsePromptLabels.join(", ") || "none"}, response-map text "${responseMapRow.responseMapText}", static follow-up prompt text "${responseMapRow.staticFollowUpPromptText}", and deterministic manual-review context only.`,
    staticResponsePromptText:
      `Static response prompt for ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId}: compare Stage 76 response-map row ${responseMapRow.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId}, Stage 76 static follow-up prompt cards ${sourceResponseMapStaticFollowUpPromptCardIds.join(", ") || "none"}, source anchors ${responseMapRow.sourceLocalAnchorHrefs.join(", ")}, callbacks ${responseMapRow.evidenceCallbackIds.join(", ")}, gap prompts ${responseMapRow.gapDiscussionPointIds.join(", ")}, deferred reminders ${responseMapRow.deferredScopeReminderIds.join(", ")}, response-map labels ${responseMapRow.responseMapLabels.join(", ") || "none"}, review-path labels ${responseMapReviewPathLabels.join(", ") || "none"}, and response-prompt labels ${responsePromptLabels.join(", ") || "none"} before drafting the next manual response outside the app without saving reviewer answers, answer drafts, response notes, response-map state, response-map review-path state, follow-up prompts, response prompts, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static response-map review path context: manual response-map review path steps and static response prompts only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-map state, saved response-map review-path state, saved follow-up prompts, saved response prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(responseMapRow.staticNonGoalFlags),
  };
}

function buildStaticResponsePromptCard(
  staticFollowUpPromptCard: Stage76StaticFollowUpPromptCard,
  responseMapReviewPathSteps: Stage77ReviewPathStep[],
): Stage77StaticResponsePromptCard {
  const sourceResponseMapStaticFollowUpPromptCardId =
    staticFollowUpPromptCard
      .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId;
  const followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId =
    `review-observation-handoff-follow-up-readiness-answer-follow-up-review-lane-source-recap-review-path-coverage-matrix-review-path-response-map-review-path:static-response-prompt:${sourceResponseMapStaticFollowUpPromptCardId}`;
  const matchedResponseMapReviewPathSteps = responseMapReviewPathSteps.filter(
    (step) =>
      staticResponsePromptCardMatchesReviewPathStep(staticFollowUpPromptCard, step),
  );
  const responsePromptLabels = buildStaticResponsePromptLabels(
    staticFollowUpPromptCard,
    matchedResponseMapReviewPathSteps,
  );

  return {
    ...staticFollowUpPromptCard,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
    followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardIds:
      [
        followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId,
      ],
    sourceResponseMapStaticFollowUpPromptCardId,
    sourceResponseMapStaticFollowUpPromptCardIds: [
      sourceResponseMapStaticFollowUpPromptCardId,
    ],
    matchedResponseMapReviewPathStepIds: matchedResponseMapReviewPathSteps.map(
      (step) =>
        step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId,
    ),
    staticResponsePromptOrder: staticFollowUpPromptCard.staticFollowUpPromptOrder,
    responsePromptLabels,
    staticResponsePromptText:
      `Static response prompt card ${followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStaticResponsePromptCardId}: inspect Stage 76 static follow-up prompt card ${sourceResponseMapStaticFollowUpPromptCardId}, matched Stage 77 review-path steps ${matchedResponseMapReviewPathSteps.map((step) => step.followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapReviewPathStepId).join(", ") || "none"}, matched Stage 76 response-map rows ${staticFollowUpPromptCard.matchedResponseMapRowIds.join(", ") || "none"}, Stage 75 coverage-review steps ${staticFollowUpPromptCard.matchedCoverageReviewPathStepIds.join(", ") || "none"}, Stage 74 readiness-cue card ${staticFollowUpPromptCard.sourceStaticReadinessCueCardId}, Stage 73 reviewer-check card ${staticFollowUpPromptCard.sourceStaticReviewerCheckCardId}, Stage 72 next-pass prompt card ${staticFollowUpPromptCard.sourceStaticNextPassPromptCardId}, Stage 71 decision-cue card ${staticFollowUpPromptCard.sourceStaticDecisionCueCardId}, Stage 70 follow-up prompt card ${staticFollowUpPromptCard.sourceStaticFollowUpPromptCardId}, Stage 69 review-note card ${staticFollowUpPromptCard.sourceStaticReviewNoteCardId}, anchors ${staticFollowUpPromptCard.sourceLocalAnchorHrefs.join(", ")}, callbacks ${staticFollowUpPromptCard.evidenceCallbackIds.join(", ")}, gap prompts ${staticFollowUpPromptCard.gapDiscussionPointIds.join(", ")}, deferred reminders ${staticFollowUpPromptCard.deferredScopeReminderIds.join(", ")}, response-map labels ${staticFollowUpPromptCard.responseMapLabels.join(", ") || "none"}, response-prompt labels ${responsePromptLabels.join(", ") || "none"}, and carried static follow-up prompt text as local static response-prompt context only.`,
    staticNonGoalContext:
      "Static response prompt card context: manual response prompt comparison only; no saved reviewer answers, saved answer drafts, saved reviewer notes, saved response notes, saved response-map state, saved response-map review-path state, saved follow-up prompts, saved response prompts, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticFollowUpPromptCard.staticNonGoalFlags,
    ),
  };
}

function buildCounts(
  responseMapReviewPathSteps: Stage77ReviewPathStep[],
  staticResponsePromptCards: Stage77StaticResponsePromptCard[],
  sourceResponseMap: Stage76ResponseMapView,
): Stage77Summary["counts"] {
  const sourceCounts = sourceResponseMap.summary.counts;

  return {
    ...sourceCounts,
    responseMapReviewPathStepCount: responseMapReviewPathSteps.length,
    staticResponsePromptCardCount: staticResponsePromptCards.length,
    responseMapReviewPathLabelCount: unique(
      responseMapReviewPathSteps.flatMap((step) => step.responseMapReviewPathLabels),
    ).length,
    responsePromptLabelCount: unique([
      ...responseMapReviewPathSteps.flatMap((step) => step.responsePromptLabels),
      ...staticResponsePromptCards.flatMap((card) => card.responsePromptLabels),
    ]).length,
    localOnlyResponseMapReviewPathStepCount:
      responseMapReviewPathSteps.filter((step) => step.localOnly).length,
    localOnlyStaticResponsePromptCardCount: staticResponsePromptCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildResponseMapReviewPathLabels(
  responseMapRow: Stage76ResponseMapRow,
  matchedStaticFollowUpPromptCards: Stage76StaticFollowUpPromptCard[],
): string[] {
  const labels = ["response-map review path step"];

  if (matchedStaticFollowUpPromptCards.length) {
    labels.push("static response-prompt cue");
  }

  if (responseMapRow.responseMapLabels.length) {
    labels.push("response-map carry-forward");
  }

  if (
    responseMapRow.sourceLocalAnchorHrefs.length ||
    responseMapRow.evidenceCallbackIds.length ||
    matchedStaticFollowUpPromptCards.some(
      (card) => card.sourceLocalAnchorHrefs.length || card.evidenceCallbackIds.length,
    )
  ) {
    labels.push("anchor and callback review-path context");
  }

  if (
    responseMapRow.gapDiscussionPointIds.length ||
    responseMapRow.deferredScopeReminderIds.length ||
    matchedStaticFollowUpPromptCards.some(
      (card) =>
        card.gapDiscussionPointIds.length || card.deferredScopeReminderIds.length,
    )
  ) {
    labels.push("gap and deferred-reminder review-path context");
  }

  return labels;
}

function buildResponsePromptLabels(
  responseMapRow: Stage76ResponseMapRow,
  matchedStaticFollowUpPromptCards: Stage76StaticFollowUpPromptCard[],
): string[] {
  const labels = ["manual response prompt context"];

  if (matchedStaticFollowUpPromptCards.length) {
    labels.push("static follow-up prompt carry-forward");
  }

  if (responseMapRow.responseMapLabels.length) {
    labels.push("response-map label context");
  }

  if (responseMapRow.sourceStaticCoveragePromptCardIds.length) {
    labels.push("coverage prompt lineage");
  }

  return labels;
}

function buildStaticResponsePromptLabels(
  staticFollowUpPromptCard: Stage76StaticFollowUpPromptCard,
  matchedResponseMapReviewPathSteps: Stage77ReviewPathStep[],
): string[] {
  const labels = ["static response prompt", "follow-up prompt carry-forward"];

  if (matchedResponseMapReviewPathSteps.length) {
    labels.push("response-map review-path source alignment");
  }

  if (staticFollowUpPromptCard.matchedResponseMapRowIds.length) {
    labels.push("response-map row prompt cue");
  }

  if (
    staticFollowUpPromptCard.sourceLocalAnchorHrefs.length ||
    staticFollowUpPromptCard.evidenceCallbackIds.length
  ) {
    labels.push("anchor and callback response prompt");
  }

  if (
    staticFollowUpPromptCard.gapDiscussionPointIds.length ||
    staticFollowUpPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap and deferred-reminder response prompt");
  }

  return labels;
}

function staticFollowUpPromptCardMatchesResponseMapRow(
  staticFollowUpPromptCard: Stage76StaticFollowUpPromptCard,
  responseMapRow: Stage76ResponseMapRow,
): boolean {
  return (
    staticFollowUpPromptCard.matchedResponseMapRowIds.includes(
      responseMapRow
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapRowId,
    ) ||
    responseMapRow.sourceStaticCoveragePromptCardIds.includes(
      staticFollowUpPromptCard.sourceStaticCoveragePromptCardId,
    ) ||
    staticFollowUpPromptCard.matchedCoverageReviewPathStepIds.includes(
      responseMapRow.sourceCoverageReviewPathStepId,
    ) ||
    staticFollowUpPromptCard.matchedCoverageRowIds.includes(
      responseMapRow.sourceCoverageMatrixRowId,
    )
  );
}

function staticResponsePromptCardMatchesReviewPathStep(
  staticFollowUpPromptCard: Stage76StaticFollowUpPromptCard,
  responseMapReviewPathStep: Stage77ReviewPathStep,
): boolean {
  return (
    responseMapReviewPathStep.sourceResponseMapStaticFollowUpPromptCardIds.includes(
      staticFollowUpPromptCard
        .followUpReadinessAnswerFollowUpReviewLaneSourceRecapReviewPathCoverageMatrixReviewPathResponseMapStaticFollowUpPromptCardId,
    ) ||
    staticFollowUpPromptCard.matchedResponseMapRowIds.includes(
      responseMapReviewPathStep.sourceResponseMapRowId,
    ) ||
    staticFollowUpPromptCard.matchedCoverageReviewPathStepIds.includes(
      responseMapReviewPathStep.sourceCoverageReviewPathStepId,
    ) ||
    staticFollowUpPromptCard.matchedCoverageRowIds.includes(
      responseMapReviewPathStep.sourceCoverageMatrixRowId,
    )
  );
}

function staticNonGoalFlags(
  sourceFlags: Stage76StaticNonGoalFlags,
): Stage77StaticNonGoalFlags {
  return {
    ...sourceFlags,
    noSavedResponseMapReviewPathState: true,
    noSavedResponseMapReviewPathSteps: true,
    noSavedResponseMapReviewPath: true,
    noSavedResponsePrompts: true,
    noSavedResponsePromptCards: true,
    noSavedResponsePromptState: true,
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
