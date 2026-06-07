import type {
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardRowView as RevisionCoverageRowView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticNonGoalFlagsView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticRevisionCheckCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardSummaryView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticNonGoalFlagsView as Stage93StaticNonGoalFlags,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStaticRevisionPromptCardView as Stage93StaticRevisionPromptCardView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathStepView as Stage93StepView,
  ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathView as Stage93View,
} from "../features/mission-console/types.ts";

export function buildConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoard(
  responseReadinessReviewPath: Stage93View | undefined,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardView | undefined {
  if (
    !responseReadinessReviewPath?.responseReadinessReviewPathSteps.length ||
    !responseReadinessReviewPath.staticRevisionPromptCards.length
  ) {
    return undefined;
  }

  const revisionCoverageRows = responseReadinessReviewPath.responseReadinessReviewPathSteps.map(
    (step) =>
      buildRevisionCoverageRow(
        step,
        responseReadinessReviewPath.staticRevisionPromptCards,
      ),
  );
  const staticRevisionCheckCards = responseReadinessReviewPath.staticRevisionPromptCards.map(
    (card) =>
      buildStaticRevisionCheckCard(
        card,
        responseReadinessReviewPath.responseReadinessReviewPathSteps,
      ),
  );
  const defaultRevisionCoverageRow =
    revisionCoverageRows.find(
      (row) =>
        row.sourceResponseReadinessReviewPathStepId ===
        responseReadinessReviewPath.defaultResponseReadinessReviewPathStep.responseReadinessReviewPathStepId,
    ) ?? revisionCoverageRows[0];
  const defaultStaticRevisionCheckCard =
    staticRevisionCheckCards.find(
      (card) =>
        card.sourceStaticRevisionPromptCardId ===
        responseReadinessReviewPath.defaultStaticRevisionPromptCard.staticRevisionPromptCardId,
    ) ?? staticRevisionCheckCards[0];
  const defaultStage93Context =
    responseReadinessReviewPath.summary.defaultResponseReadinessReviewContext;

  return {
    schema:
      "telemforge.constraint_response_evidence_gap_follow_up_coverage_review_response_readiness_review_path_revision_coverage_board.v1",
    version: 1,
    contractLabel:
      "local deterministic constraint-response evidence-gap follow-up coverage-review response-readiness review-path revision coverage board and static revision checks",
    localStatus: responseReadinessReviewPath.localStatus,
    summary: {
      constraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardId:
        "candidate-local-constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-board",
      label:
        "Local constraint-response evidence-gap follow-up coverage-review response-readiness review-path revision coverage board",
      summary:
        "A static revision coverage board derives rows from Stage 93 response-readiness review-path steps and static revision-check cards from Stage 93 static revision-prompt cards so reviewers can compare review-path steps, revision prompts, source lineage, local anchors, callbacks, gap prompts, deferred reminders, and revision checks before editing outside the app without saved answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, revision-coverage selections, revision-check selections, revision-coverage state, persistence, routes, exports, signoff, owner assignment, scoring, ranking, certification, meeting workflow, handoff packages, runnable checklists, task launchers, command execution, or production handoff semantics.",
      defaultRevisionCoverageContext: {
        defaultRevisionCoverageRowId: defaultRevisionCoverageRow.revisionCoverageRowId,
        defaultStaticRevisionCheckCardId:
          defaultStaticRevisionCheckCard.staticRevisionCheckCardId,
        defaultResponseReadinessReviewPathStepId:
          defaultRevisionCoverageRow.sourceResponseReadinessReviewPathStepId,
        defaultStaticRevisionPromptCardId:
          defaultStaticRevisionCheckCard.sourceStaticRevisionPromptCardId,
        defaultResponseReadinessRowId:
          defaultRevisionCoverageRow.sourceResponseReadinessRowId,
        defaultStaticDraftCheckCardId:
          defaultStaticRevisionCheckCard.sourceStaticDraftCheckCardId,
        defaultCoverageReviewPathStepId:
          defaultRevisionCoverageRow.sourceCoverageReviewPathStepId,
        defaultStaticResponseCueCardId:
          defaultStaticRevisionCheckCard.sourceStaticResponseCueCardId,
        defaultCoverageRowId: defaultRevisionCoverageRow.sourceCoverageRowId,
        defaultStaticReviewPromptCardId:
          defaultStaticRevisionCheckCard.sourceStaticReviewPromptCardId,
        defaultFollowUpReviewPathStepId:
          defaultRevisionCoverageRow.sourceFollowUpReviewPathStepId,
        defaultStaticReadinessCueCardId:
          defaultStaticRevisionCheckCard.sourceStaticReadinessCueCardId,
        defaultEvidenceGapReadinessRowId:
          defaultRevisionCoverageRow.sourceEvidenceGapReadinessRowId,
        defaultStaticFollowUpPromptCardId:
          defaultStaticRevisionCheckCard.sourceStaticFollowUpPromptCardId,
        defaultEvidenceCheckReviewPathStepId:
          defaultRevisionCoverageRow.sourceEvidenceCheckReviewPathStepId,
        defaultStaticCitationGapCueCardId:
          defaultStaticRevisionCheckCard.sourceStaticCitationGapCueCardId,
        defaultStaticEvidenceCheckPromptCardId:
          defaultRevisionCoverageRow.sourceStaticEvidenceCheckPromptCardId,
        defaultCitationReviewLaneRowId:
          defaultStaticRevisionCheckCard.sourceCitationReviewLaneRowId,
        defaultStaticCitationCheckPromptCardId:
          defaultStaticRevisionCheckCard.sourceStaticCitationCheckPromptCardId,
        defaultSourceFollowUpMapEntryId:
          defaultRevisionCoverageRow.sourceSourceFollowUpMapEntryId,
        sourceStage93ResponseReadinessReviewPathSummary:
          responseReadinessReviewPath.summary.summary,
        sourceStage93DefaultResponseReadinessReviewContext:
          defaultStage93Context,
      },
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        revisionCoverageRows,
        staticRevisionCheckCards,
        responseReadinessReviewPath,
      ),
    },
    defaultRevisionCoverageRow,
    defaultStaticRevisionCheckCard,
    revisionCoverageRows,
    staticRevisionCheckCards,
    staticRevisionCoverageBoundarySummary:
      "Stage 94 revision coverage rows and static revision-check cards are deterministic, local, source-backed, in-page only, explanatory, static, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, revision-coverage selections, revision-check selections, revision-coverage state, local storage, routes, tickets, meetings, owners, signoff, audits, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPath:
      responseReadinessReviewPath,
  };
}

function buildRevisionCoverageRow(
  responseReadinessReviewPathStep: Stage93StepView,
  staticRevisionPromptCards: Stage93StaticRevisionPromptCardView[],
): RevisionCoverageRowView {
  const sourceResponseReadinessReviewPathStepId =
    responseReadinessReviewPathStep.responseReadinessReviewPathStepId;
  const matchedStaticRevisionPromptCards = staticRevisionPromptCards.filter(
    (card) => rowMatchesStaticRevisionCheckCard(responseReadinessReviewPathStep, card),
  );
  const sourceStaticRevisionPromptCardIds = matchedStaticRevisionPromptCards.map(
    (card) => card.staticRevisionPromptCardId,
  );
  const revisionCoverageLabels = buildRowRevisionCoverageLabels(
    responseReadinessReviewPathStep,
    matchedStaticRevisionPromptCards,
  );
  const staticRevisionCheckLabels = buildRowStaticRevisionCheckLabels(
    responseReadinessReviewPathStep,
    matchedStaticRevisionPromptCards,
  );
  const revisionCoverageRowId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-board:row:${sourceResponseReadinessReviewPathStepId}`;

  return {
    ...responseReadinessReviewPathStep,
    revisionCoverageRowId,
    revisionCoverageRowIds: [revisionCoverageRowId],
    revisionCoverageRowOrder:
      responseReadinessReviewPathStep.responseReadinessReviewPathStepOrder,
    sourceResponseReadinessReviewPathStepId,
    sourceResponseReadinessReviewPathStepIds: [sourceResponseReadinessReviewPathStepId],
    sourceStaticRevisionPromptCardIds,
    revisionCoverageLabels,
    staticRevisionCheckLabels,
    revisionCoverageText:
      `Revision coverage row ${sourceResponseReadinessReviewPathStepId}: carry Stage 93 response-readiness review path step ${sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${responseReadinessReviewPathStep.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticDraftCheckCardIds)}, Stage 91 coverage-review path step ${responseReadinessReviewPathStep.sourceCoverageReviewPathStepId}, Stage 91 static response cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticResponseCueCardIds)}, Stage 90 coverage row ${responseReadinessReviewPathStep.sourceCoverageRowId}, Stage 90 static review prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticReviewPromptCardIds)}, Stage 89 follow-up review path step ${responseReadinessReviewPathStep.sourceFollowUpReviewPathStepId}, Stage 89 static readiness cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticReadinessCueCardIds)}, Stage 88 readiness row ${responseReadinessReviewPathStep.sourceEvidenceGapReadinessRowId}, Stage 88 static follow-up prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 evidence-check review path step ${responseReadinessReviewPathStep.sourceEvidenceCheckReviewPathStepId}, Stage 87 citation-gap cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 static evidence-check prompt card ${responseReadinessReviewPathStep.sourceStaticEvidenceCheckPromptCardId}, Stage 86 citation-review lane rows ${joinOrNone(responseReadinessReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 source follow-up map entry ${responseReadinessReviewPathStep.sourceSourceFollowUpMapEntryId}, Stage 85 citation prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness row ${responseReadinessReviewPathStep.sourceSourceReadinessLaneRowId}, Stage 84 cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticSourceFollowUpCueCardIds)}, Stage 83 source-review path step ${responseReadinessReviewPathStep.sourceSourceReviewPathStepId}, Stage 83 static source-review prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticSourceReviewPromptCardIds)}, Stage 82 source-crosswalk row ${responseReadinessReviewPathStep.sourceCrosswalkRowId}, Stage 82 static review-check cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticReviewCheckCardIds)}, Stage 81 review-path step ${responseReadinessReviewPathStep.sourceConstraintResponseReviewPathStepId}, Stage 81 response-review prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticResponseReviewPromptCardIds)}, Stage 80 constraint-coverage row ${responseReadinessReviewPathStep.sourceConstraintCoverageRowId}, Stage 80 response-note prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticResponseNotePromptCardIds)}, Stage 79 answer-review step ${responseReadinessReviewPathStep.sourceAnswerReviewPathStepId}, Stage 79 constraint-note cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticConstraintNoteCardIds)}, Stage 78 answer-check card ${responseReadinessReviewPathStep.sourceStaticAnswerCheckCardId}, Stage 78 readiness rows ${joinOrNone(responseReadinessReviewPathStep.sourceResponsePromptReadinessRowIds)}, Stage 77 response-prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticResponsePromptCardIds)}, Stage 77 response-map review-path step ${responseReadinessReviewPathStep.sourceResponseMapReviewPathStepId}, Stage 76 response-map row ${responseReadinessReviewPathStep.sourceResponseMapRowId}, Stage 75 coverage-review step ${responseReadinessReviewPathStep.sourceCoverageReviewPathStepId}, Stage 74 coverage row ${responseReadinessReviewPathStep.sourceCoverageMatrixRowId}, Stage 73 review-path step ${responseReadinessReviewPathStep.sourceReviewPathStepId}, Stage 72 source recap row ${responseReadinessReviewPathStep.sourceSourceRecapRowId}, Stage 71 review-lane row ${responseReadinessReviewPathStep.sourceAnswerFollowUpReviewLaneRowId}, Stage 70 crosswalk row ${responseReadinessReviewPathStep.sourceAnswerSourceCrosswalkRowId}, Stage 69 walkthrough step ${responseReadinessReviewPathStep.sourceAnswerWalkthroughStepId}, Stage 68 answer coverage row ${responseReadinessReviewPathStep.sourceAnswerCoverageRowId}, Stage 67 rehearsal step ${responseReadinessReviewPathStep.sourceRehearsalPathStepId}, Stage 66 board row ${responseReadinessReviewPathStep.sourceReviewBoardRowId}, Stage 65 brief row ${responseReadinessReviewPathStep.followUpReadinessBriefRowId}, Stage 64 triage row ${responseReadinessReviewPathStep.sourceReadinessResponseTraceCoverageReadinessReviewSynthesisFollowUpTriageRowId}, anchors ${joinOrNone(responseReadinessReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responseReadinessReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(responseReadinessReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responseReadinessReviewPathStep.deferredScopeReminderIds)}, revision coverage labels ${joinOrNone(revisionCoverageLabels)}, static revision-check labels ${joinOrNone(staticRevisionCheckLabels)}, Stage 93 response-readiness review-path text "${responseReadinessReviewPathStep.responseReadinessReviewText}", and Stage 93 revision-prompt text "${responseReadinessReviewPathStep.revisionPromptText}" as deterministic manual revision coverage context only.`,
    staticRevisionCheckText:
      `Static revision-check context for revision coverage row ${sourceResponseReadinessReviewPathStepId}: inspect Stage 93 response-readiness review path step ${sourceResponseReadinessReviewPathStepId}, Stage 93 static revision-prompt cards ${joinOrNone(sourceStaticRevisionPromptCardIds)}, Stage 92 response-readiness row ${responseReadinessReviewPathStep.sourceResponseReadinessRowId}, Stage 92 static draft-check cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticDraftCheckCardIds)}, Stage 91 static response cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticResponseCueCardIds)}, Stage 90 static review prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticReviewPromptCardIds)}, Stage 89 static readiness cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticReadinessCueCardIds)}, Stage 88 static follow-up prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticFollowUpPromptCardIds)}, Stage 87 citation-gap cue cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticCitationGapCueCardIds)}, Stage 86 citation-review lane rows ${joinOrNone(responseReadinessReviewPathStep.sourceCitationReviewLaneRowIds)}, Stage 85 citation prompt cards ${joinOrNone(responseReadinessReviewPathStep.sourceStaticCitationCheckPromptCardIds)}, Stage 84 readiness rows ${joinOrNone(responseReadinessReviewPathStep.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(responseReadinessReviewPathStep.sourceSourceReviewPathStepIds)}, Stage 82 source-crosswalk rows ${joinOrNone(responseReadinessReviewPathStep.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(responseReadinessReviewPathStep.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(responseReadinessReviewPathStep.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(responseReadinessReviewPathStep.evidenceCallbackIds)}, gap prompts ${joinOrNone(responseReadinessReviewPathStep.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(responseReadinessReviewPathStep.deferredScopeReminderIds)}, and Stage 93 labels ${joinOrNone([...responseReadinessReviewPathStep.responseReadinessReviewLabels, ...responseReadinessReviewPathStep.staticRevisionPromptLabels])} before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, revision-coverage selections, revision-check selections, revision-coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision-coverage context: manual Stage 93 response-readiness review-path, static revision-prompt, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved revision-coverage selections, saved revision-check selections, saved revision-coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      responseReadinessReviewPathStep.staticNonGoalFlags,
    ),
  };
}

function buildStaticRevisionCheckCard(
  staticRevisionPromptCard: Stage93StaticRevisionPromptCardView,
  responseReadinessReviewPathSteps: Stage93StepView[],
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticRevisionCheckCardView {
  const sourceStaticRevisionPromptCardId =
    staticRevisionPromptCard.staticRevisionPromptCardId;
  const matchedResponseReadinessReviewPathSteps = responseReadinessReviewPathSteps.filter(
    (step) => rowMatchesStaticRevisionCheckCard(step, staticRevisionPromptCard),
  );
  const sourceResponseReadinessReviewPathStepIds =
    matchedResponseReadinessReviewPathSteps.map(
      (step) => step.responseReadinessReviewPathStepId,
    );
  const revisionCoverageLabels = buildCardRevisionCoverageLabels(
    staticRevisionPromptCard,
    matchedResponseReadinessReviewPathSteps,
  );
  const staticRevisionCheckLabels = buildCardStaticRevisionCheckLabels(
    staticRevisionPromptCard,
    matchedResponseReadinessReviewPathSteps,
  );
  const staticRevisionCheckCardId =
    `constraint-response-evidence-gap-follow-up-coverage-review-response-readiness-review-path-revision-coverage-board:static-revision-check:${sourceStaticRevisionPromptCardId}`;

  return {
    ...staticRevisionPromptCard,
    staticRevisionCheckCardId,
    staticRevisionCheckCardIds: [staticRevisionCheckCardId],
    staticRevisionCheckOrder: staticRevisionPromptCard.staticRevisionPromptOrder,
    sourceStaticRevisionPromptCardId,
    sourceStaticRevisionPromptCardIds: [sourceStaticRevisionPromptCardId],
    sourceResponseReadinessReviewPathStepIds,
    revisionCoverageLabels,
    staticRevisionCheckLabels,
    revisionCoverageText:
      `Revision coverage card ${sourceStaticRevisionPromptCardId}: carry Stage 93 static revision-prompt card ${sourceStaticRevisionPromptCardId}, Stage 93 response-readiness review path steps ${joinOrNone(sourceResponseReadinessReviewPathStepIds)}, Stage 92 static draft-check card ${staticRevisionPromptCard.sourceStaticDraftCheckCardId}, Stage 92 response-readiness rows ${joinOrNone(staticRevisionPromptCard.sourceResponseReadinessRowIds)}, Stage 91 static response cue card ${staticRevisionPromptCard.sourceStaticResponseCueCardId}, Stage 91 coverage-review path steps ${joinOrNone(staticRevisionPromptCard.sourceCoverageReviewPathStepIds)}, Stage 90 static review prompt card ${staticRevisionPromptCard.sourceStaticReviewPromptCardId}, Stage 90 coverage rows ${joinOrNone(staticRevisionPromptCard.sourceCoverageRowIds)}, Stage 89 static readiness cue ${staticRevisionPromptCard.sourceStaticReadinessCueCardId}, Stage 89 follow-up review path steps ${joinOrNone(staticRevisionPromptCard.sourceFollowUpReviewPathStepIds)}, Stage 88 static follow-up prompt card ${staticRevisionPromptCard.sourceStaticFollowUpPromptCardId}, Stage 88 readiness rows ${joinOrNone(staticRevisionPromptCard.sourceEvidenceGapReadinessRowIds)}, Stage 87 static citation-gap cue ${staticRevisionPromptCard.sourceStaticCitationGapCueCardId}, Stage 87 evidence-check review path steps ${joinOrNone(staticRevisionPromptCard.sourceEvidenceCheckReviewPathStepIds)}, Stage 86 citation-review lane row ${staticRevisionPromptCard.sourceCitationReviewLaneRowId}, Stage 86 static evidence-check prompt cards ${joinOrNone(staticRevisionPromptCard.sourceStaticEvidenceCheckPromptCardIds)}, Stage 85 citation prompt card ${staticRevisionPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 85 source follow-up map entries ${joinOrNone(staticRevisionPromptCard.sourceSourceFollowUpMapEntryIds)}, anchors ${joinOrNone(staticRevisionPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionPromptCard.deferredScopeReminderIds)}, revision coverage labels ${joinOrNone(revisionCoverageLabels)}, static revision-check labels ${joinOrNone(staticRevisionCheckLabels)}, Stage 93 response-readiness review-path text "${staticRevisionPromptCard.responseReadinessReviewText}", and Stage 93 revision-prompt text "${staticRevisionPromptCard.revisionPromptText}" as deterministic manual revision coverage context only.`,
    staticRevisionCheckText:
      `Static revision-check card ${sourceStaticRevisionPromptCardId}: inspect Stage 93 static revision-prompt card ${sourceStaticRevisionPromptCardId}, Stage 92 static draft-check card ${staticRevisionPromptCard.sourceStaticDraftCheckCardId}, Stage 92 response-readiness rows ${joinOrNone(staticRevisionPromptCard.sourceResponseReadinessRowIds)}, Stage 91 static response cue card ${staticRevisionPromptCard.sourceStaticResponseCueCardId}, Stage 90 static review prompt card ${staticRevisionPromptCard.sourceStaticReviewPromptCardId}, Stage 89 static readiness cue ${staticRevisionPromptCard.sourceStaticReadinessCueCardId}, Stage 88 static follow-up prompt card ${staticRevisionPromptCard.sourceStaticFollowUpPromptCardId}, Stage 87 citation-gap cue ${staticRevisionPromptCard.sourceStaticCitationGapCueCardId}, Stage 86 citation-review lane row ${staticRevisionPromptCard.sourceCitationReviewLaneRowId}, Stage 85 citation prompt ${staticRevisionPromptCard.sourceStaticCitationCheckPromptCardId}, Stage 84 readiness rows ${joinOrNone(staticRevisionPromptCard.sourceSourceReadinessLaneRowIds)}, Stage 83 source-review path steps ${joinOrNone(staticRevisionPromptCard.sourceSourceReviewPathStepIds)}, Stage 82 crosswalk rows ${joinOrNone(staticRevisionPromptCard.sourceCrosswalkRowIds)}, Stage 81 review-path steps ${joinOrNone(staticRevisionPromptCard.sourceConstraintResponseReviewPathStepIds)}, anchors ${joinOrNone(staticRevisionPromptCard.sourceLocalAnchorHrefs)}, callbacks ${joinOrNone(staticRevisionPromptCard.evidenceCallbackIds)}, gap prompts ${joinOrNone(staticRevisionPromptCard.gapDiscussionPointIds)}, deferred reminders ${joinOrNone(staticRevisionPromptCard.deferredScopeReminderIds)}, static revision-check labels ${joinOrNone(staticRevisionCheckLabels)}, and Stage 93 draft-check text "${staticRevisionPromptCard.staticDraftCheckText}" before editing outside the app without saved reviewer answers, answer drafts, revision drafts, reviewer notes, response notes, response-readiness selections, revision-coverage selections, revision-check selections, revision-coverage state, priorities, rankings, scores, certifications, owners, routes, exports, signoff, meetings, packages, task launchers, runnable checklists, or commands.`,
    staticNonGoalContext:
      "Static revision-check context: manual Stage 93 static revision-prompt, response-readiness-review-path, source-lineage, anchor, callback, gap-prompt, and deferred-reminder comparison only; no saved reviewer answers, saved answer drafts, saved revision drafts, saved reviewer notes, saved response notes, saved response-readiness selections, saved revision-coverage selections, saved revision-check selections, saved revision-coverage state, persistence, routing, scoring, ranking, certification, owner assignment, meeting workflow, exports, handoff packages, task launchers, runnable checklists, or commands.",
    staticNonGoalFlags: staticNonGoalFlags(
      staticRevisionPromptCard.staticNonGoalFlags,
    ),
  };
}

function rowMatchesStaticRevisionCheckCard(
  responseReadinessReviewPathStep: Stage93StepView,
  staticRevisionPromptCard: Stage93StaticRevisionPromptCardView,
): boolean {
  return (
    responseReadinessReviewPathStep.sourceStaticDraftCheckCardIds.includes(
      staticRevisionPromptCard.sourceStaticDraftCheckCardId,
    ) ||
    staticRevisionPromptCard.sourceResponseReadinessRowIds.includes(
      responseReadinessReviewPathStep.sourceResponseReadinessRowId,
    )
  );
}

function buildCounts(
  revisionCoverageRows: RevisionCoverageRowView[],
  staticRevisionCheckCards: ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticRevisionCheckCardView[],
  responseReadinessReviewPath: Stage93View,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardSummaryView["counts"] {
  const sourceCounts = responseReadinessReviewPath.summary.counts;

  return {
    ...sourceCounts,
    revisionCoverageRowCount: revisionCoverageRows.length,
    staticRevisionCheckCardCount: staticRevisionCheckCards.length,
    revisionCoverageLabelCount: unique([
      ...revisionCoverageRows.flatMap((row) => row.revisionCoverageLabels),
      ...staticRevisionCheckCards.flatMap((card) => card.revisionCoverageLabels),
    ]).length,
    staticRevisionCheckLabelCount: unique([
      ...revisionCoverageRows.flatMap((row) => row.staticRevisionCheckLabels),
      ...staticRevisionCheckCards.flatMap((card) => card.staticRevisionCheckLabels),
    ]).length,
    localOnlyRevisionCoverageRowCount: revisionCoverageRows.filter(
      (row) => row.localOnly,
    ).length,
    localOnlyStaticRevisionCheckCardCount: staticRevisionCheckCards.filter(
      (card) => card.localOnly,
    ).length,
  };
}

function buildRowRevisionCoverageLabels(
  responseReadinessReviewPathStep: Stage93StepView,
  matchedStaticRevisionPromptCards: Stage93StaticRevisionPromptCardView[],
): string[] {
  const labels = [
    "revision coverage row",
    "Stage 93 response-readiness review-path carry-forward",
  ];

  if (matchedStaticRevisionPromptCards.length) {
    labels.push("matched Stage 93 static revision-prompt context");
  }

  if (responseReadinessReviewPathStep.responseReadinessReviewLabels.length) {
    labels.push("response-readiness review-path label carry-forward");
  }

  return labels;
}

function buildRowStaticRevisionCheckLabels(
  responseReadinessReviewPathStep: Stage93StepView,
  matchedStaticRevisionPromptCards: Stage93StaticRevisionPromptCardView[],
): string[] {
  const labels = [
    "static revision-check carry-forward",
    "Stage 93 review-path comparison",
  ];

  if (matchedStaticRevisionPromptCards.length) {
    labels.push("matched Stage 93 static revision-prompt card");
  }

  if (
    responseReadinessReviewPathStep.gapDiscussionPointIds.length ||
    responseReadinessReviewPathStep.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder revision-check");
  }

  return labels;
}

function buildCardRevisionCoverageLabels(
  staticRevisionPromptCard: Stage93StaticRevisionPromptCardView,
  matchedResponseReadinessReviewPathSteps: Stage93StepView[],
): string[] {
  const labels = [
    "revision coverage card",
    "Stage 93 static revision-prompt carry-forward",
  ];

  if (matchedResponseReadinessReviewPathSteps.length) {
    labels.push("matched response-readiness review path steps");
  }

  if (staticRevisionPromptCard.responseReadinessReviewLabels.length) {
    labels.push("response-readiness card label carry-forward");
  }

  return labels;
}

function buildCardStaticRevisionCheckLabels(
  staticRevisionPromptCard: Stage93StaticRevisionPromptCardView,
  matchedResponseReadinessReviewPathSteps: Stage93StepView[],
): string[] {
  const labels = [
    "static revision-check card",
    "Stage 93 static revision-prompt carry-forward",
  ];

  if (matchedResponseReadinessReviewPathSteps.length) {
    labels.push("matched response-readiness row revision context");
  }

  if (
    staticRevisionPromptCard.gapDiscussionPointIds.length ||
    staticRevisionPromptCard.deferredScopeReminderIds.length
  ) {
    labels.push("gap prompt and deferred reminder revision-check");
  }

  return labels;
}

function staticNonGoalFlags(
  sourceFlags: StaticRevisionCoverageSourceFlags,
): ConstraintResponseEvidenceGapFollowUpCoverageReviewResponseReadinessReviewPathRevisionCoverageBoardStaticNonGoalFlagsView {
  return {
    ...sourceFlags,
    noSavedRevisionCoverageBoardState: true,
    noSavedRevisionCoverageRows: true,
    noSavedRevisionCoverageState: true,
    noSavedRevisionCoverageSelections: true,
    noSavedRevisionCheckState: true,
    noSavedRevisionCheckSelections: true,
    noSavedStaticRevisionCheckCards: true,
  };
}

function joinOrNone(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

type StaticRevisionCoverageSourceFlags = Stage93StaticNonGoalFlags;
