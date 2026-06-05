import type {
  ReviewObservationHandoffAgendaSectionView,
  ReviewObservationHandoffAgendaView,
  ReviewObservationHandoffPathAnchorMapEntryView,
  ReviewObservationHandoffPathSourceReferenceView,
  ReviewObservationHandoffPathStaticNonGoalFlagsView,
  ReviewObservationHandoffPathStepView,
  ReviewObservationHandoffPathView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationHandoffPath(
  sourceObservationHandoffAgenda:
    | ReviewObservationHandoffAgendaView
    | undefined,
): ReviewObservationHandoffPathView | undefined {
  if (!sourceObservationHandoffAgenda?.sections.length) {
    return undefined;
  }

  const pathSteps = sourceObservationHandoffAgenda.sections.map(
    (section, index) => buildPathStep(section, index + 1),
  );
  const anchorMapEntries = pathSteps.flatMap(buildAnchorMapEntries);
  const defaultPathStep =
    pathSteps.find(
      (step) =>
        step.sourceAgendaSectionId ===
        sourceObservationHandoffAgenda.defaultAgendaSection.sectionId,
    ) ?? pathSteps[0];

  return {
    schema: "telemforge.review_observation_handoff_path.v1",
    version: 1,
    contractLabel:
      "local deterministic observation handoff path and static anchor map",
    localStatus: sourceObservationHandoffAgenda.localStatus,
    summary: {
      pathId: "candidate-local-review-observation-handoff-path",
      label: "Local observation handoff path",
      summary:
        "A static handoff path maps Stage 41 agenda sections to local in-page anchors so the reviewer can follow the conversation order without saved path state, route changes, exports, signoff, scoring, certification, owner assignment, or command execution.",
      defaultPathStepId: defaultPathStep.pathStepId,
      defaultAnchorTargetId: defaultPathStep.anchorTargetIds[0] ?? "",
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonRouting: true,
      nonCertifying: true,
      nonRanking: true,
      counts: buildCounts(
        sourceObservationHandoffAgenda,
        pathSteps,
        anchorMapEntries,
      ),
    },
    defaultPathStep,
    pathSteps,
    anchorMapEntries,
    staticAnchorMapSummary:
      "Stage 42 handoff path steps and anchor-map entries are deterministic, local, in-page only, explanatory, non-actionable, non-persistent, non-executable, non-routing, non-ranking, and non-certifying; they do not save path progress, agenda progress, answers, selections, observations, notes, filters, routes, owners, signoff, reports, handoff packages, scores, certifications, task launchers, runnable checklists, command runners, exports, or production handoff state.",
    sourceObservationHandoffAgenda,
  };
}

function buildPathStep(
  section: ReviewObservationHandoffAgendaSectionView,
  stepNumber: number,
): ReviewObservationHandoffPathStepView {
  const pathStepId = buildPathStepId(section.sectionId);
  const anchorTargetIds = section.localAnchorHrefs.map(anchorTargetId);

  return {
    pathStepId,
    stepNumber,
    label: section.label,
    summary: `${section.goal} The path step keeps these local anchors in the handoff conversation order and remains static review context only.`,
    sourceAgendaSectionId: section.sectionId,
    sourceAgendaSectionIds: [section.sectionId],
    sourcePromptGroupId: section.sourcePromptGroupId,
    sourcePromptGroupIds: section.sourcePromptGroupIds,
    sourceCoverageRowId: section.sourceCoverageRowId,
    sourceHandoffCardId: section.sourceHandoffCardId,
    sourceSummaryReference: section.sourceSummaryReference,
    sourceReferences: buildSourceReferences(pathStepId, section),
    localAnchorHrefs: section.localAnchorHrefs,
    anchorTargetIds,
    relatedReviewQuestionIds: section.relatedReviewQuestionIds,
    relatedEvidencePromptIds: section.relatedEvidencePromptIds,
    relatedGapPromptIds: section.relatedGapPromptIds,
    relatedDeferredScopePromptIds: section.relatedDeferredScopePromptIds,
    relatedFacilitationPromptIds: section.facilitationPromptIds,
    relatedEvidenceStopIds: section.evidenceStopIds,
    relatedGapDiscussionPointIds: section.gapDiscussionPointIds,
    relatedDeferredScopeReminderIds: section.deferredScopeReminderIds,
    staticNonGoalContexts: section.staticNonGoalContexts,
    staticReviewPrompt:
      `Walk ${section.label} through anchors ${joinLabels(
        anchorTargetIds,
      )}; use ${section.facilitationPromptIds.length} facilitation prompts, ${section.evidenceStopIds.length} evidence stops, ${section.gapDiscussionPointIds.length} gap points, and ${section.deferredScopeReminderIds.length} deferred-scope reminders without creating saved progress, routes, owners, signoff, scores, exports, or commands.`,
    staticNonGoalFlags: staticNonGoalFlags(),
    ...staticPathItemFlags(),
  };
}

function buildAnchorMapEntries(
  pathStep: ReviewObservationHandoffPathStepView,
): ReviewObservationHandoffPathAnchorMapEntryView[] {
  return pathStep.localAnchorHrefs.map((href, index) => {
    const targetId = anchorTargetId(href);

    return {
      anchorEntryId: `${pathStep.pathStepId}:anchor:${targetId}`,
      sourcePathStepId: pathStep.pathStepId,
      sourceAgendaSectionId: pathStep.sourceAgendaSectionId,
      sourceAgendaSectionIds: pathStep.sourceAgendaSectionIds,
      sourcePromptGroupId: pathStep.sourcePromptGroupId,
      sourceCoverageRowId: pathStep.sourceCoverageRowId,
      sourceHandoffCardId: pathStep.sourceHandoffCardId,
      sourceSummaryReference: pathStep.sourceSummaryReference,
      anchorOrder: index + 1,
      localAnchorHref: href,
      anchorTargetId: targetId,
      label: `${pathStep.label} anchor ${index + 1}`,
      summary: `In-page anchor ${href} is mapped from ${pathStep.label} in Stage 41 source order; it is a static local reference, not a route change, saved selection, task, ticket, checklist, export, score, signoff, certification, or command.`,
      relatedFacilitationPromptIds: pathStep.relatedFacilitationPromptIds,
      relatedEvidenceStopIds: pathStep.relatedEvidenceStopIds,
      relatedGapDiscussionPointIds: pathStep.relatedGapDiscussionPointIds,
      relatedDeferredScopeReminderIds:
        pathStep.relatedDeferredScopeReminderIds,
      staticNonGoalFlags: staticNonGoalFlags(),
      ...staticPathItemFlags(),
    };
  });
}

function buildSourceReferences(
  pathStepId: string,
  section: ReviewObservationHandoffAgendaSectionView,
): ReviewObservationHandoffPathSourceReferenceView[] {
  return [
    {
      referenceId: `${pathStepId}:source:agenda-section`,
      sourceKind: "agenda_section",
      sourceId: section.sectionId,
      label: "Stage 41 agenda section",
    },
    {
      referenceId: `${pathStepId}:source:prompt-group`,
      sourceKind: "prompt_group",
      sourceId: section.sourcePromptGroupId,
      label: "Stage 40 prompt group",
    },
    {
      referenceId: `${pathStepId}:source:coverage-row`,
      sourceKind: "coverage_row",
      sourceId: section.sourceCoverageRowId,
      label: "Stage 39 coverage row",
    },
    {
      referenceId: `${pathStepId}:source:handoff-card`,
      sourceKind: "handoff_card",
      sourceId: section.sourceHandoffCardId,
      label: "Stage 38 handoff card",
    },
  ];
}

function buildCounts(
  sourceObservationHandoffAgenda: ReviewObservationHandoffAgendaView,
  pathSteps: ReviewObservationHandoffPathStepView[],
  anchorMapEntries: ReviewObservationHandoffPathAnchorMapEntryView[],
): ReviewObservationHandoffPathView["summary"]["counts"] {
  return {
    pathStepCount: pathSteps.length,
    anchorMapEntryCount: anchorMapEntries.length,
    sourceAgendaSectionCount: sourceObservationHandoffAgenda.sections.length,
    sourceFacilitationPromptCount:
      sourceObservationHandoffAgenda.facilitationPrompts.length,
    sourceEvidenceStopCount: sourceObservationHandoffAgenda.evidenceStops.length,
    sourceGapDiscussionPointCount:
      sourceObservationHandoffAgenda.gapDiscussionPoints.length,
    sourceDeferredScopeReminderCount:
      sourceObservationHandoffAgenda.deferredScopeReminders.length,
    localOnlyPathStepCount: pathSteps.filter((step) => step.localOnly).length,
  };
}

function staticNonGoalFlags(): ReviewObservationHandoffPathStaticNonGoalFlagsView {
  return {
    noSavedPathProgress: true,
    noSavedAgendaProgress: true,
    noSavedQuestionAnswers: true,
    noSavedSelections: true,
    noRouteChanges: true,
    noCommandExecution: true,
    noExports: true,
    noSignoff: true,
    noOwnerAssignment: true,
    noScoring: true,
    noCertification: true,
  };
}

function staticPathItemFlags() {
  return {
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    explanatoryOnly: true,
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

function buildPathStepId(sectionId: string): string {
  return `review-observation-handoff-path:${sectionId}`;
}

function anchorTargetId(href: string): string {
  return href.replace(/^#/, "");
}

function joinLabels(labels: string[]): string {
  if (!labels.length) {
    return "no local anchors";
  }

  return labels.join(", ");
}
