import type {
  ReviewObservationBoundaryWalkthroughStepView,
  ReviewObservationBoundaryWalkthroughView,
  ReviewObservationStorylinePriorSurfaceReferenceView,
  ReviewObservationStorylineSegmentView,
  ReviewObservationStorylineSourceStageEvidenceGroupView,
  ReviewObservationStorylineStaticGuardrailReferenceView,
  ReviewObservationStorylineView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationStoryline(
  sourceObservationBoundaryWalkthrough:
    | ReviewObservationBoundaryWalkthroughView
    | undefined,
): ReviewObservationStorylineView | undefined {
  if (!sourceObservationBoundaryWalkthrough?.steps.length) {
    return undefined;
  }

  const segmentIdBySourceStepId = new Map(
    sourceObservationBoundaryWalkthrough.steps.map((step) => [
      step.stepId,
      buildSegmentId(step.stepId),
    ]),
  );
  const sourceStageEvidenceGroups =
    sourceObservationBoundaryWalkthrough.sourcePathGroups.map((group) => ({
      evidenceGroupId: `review-observation-storyline-source-stage:${group.sourceStageNumber}`,
      sourcePathGroupId: group.sourcePathGroupId,
      sourceStageGroupId: group.sourceStageGroupId,
      sourceMapRowId: group.sourceMapRowId,
      sourceStageNumber: group.sourceStageNumber,
      label: group.label,
      sourceSchemas: group.sourceSchemas,
      sourceContractLabels: group.sourceContractLabels,
      sourceBoundaryRowIds: group.boundaryRowIds,
      sourceStepIds: group.boundaryStepIds,
      segmentIds: group.boundaryStepIds
        .map((stepId) => segmentIdBySourceStepId.get(stepId))
        .filter((segmentId): segmentId is string => Boolean(segmentId)),
      relatedObservationRowIds: group.relatedObservationRowIds,
      sourceAnchorHrefs: group.anchorHrefs,
      localOnly: true,
      sourceBacked: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    })) satisfies ReviewObservationStorylineSourceStageEvidenceGroupView[];
  const staticGuardrailReferences =
    sourceObservationBoundaryWalkthrough.staticGuardrailGroups.map((group) => ({
      guardrailReferenceId: `review-observation-storyline-guardrail:${group.sourceNonGoalNoteId}`,
      sourceGuardrailGroupId: group.guardrailGroupId,
      sourceNonGoalNoteId: group.sourceNonGoalNoteId,
      kind: group.kind,
      label: group.label,
      summary: group.summary,
      sourceBoundaryRowIds: group.boundaryRowIds,
      sourceStepIds: group.boundaryStepIds,
      segmentIds: group.boundaryStepIds
        .map((stepId) => segmentIdBySourceStepId.get(stepId))
        .filter((segmentId): segmentId is string => Boolean(segmentId)),
      sourceObservationRowIds: group.sourceObservationRowIds,
      sourceAnchorIds: group.sourceAnchorIds,
      localOnly: true,
      staticReviewContext: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      notATask: true,
      notATicket: true,
      notAChecklist: true,
      notOwnerAssigned: true,
    })) satisfies ReviewObservationStorylineStaticGuardrailReferenceView[];
  const evidenceGroupIdBySourcePathGroupId = new Map(
    sourceStageEvidenceGroups.map((group) => [
      group.sourcePathGroupId,
      group.evidenceGroupId,
    ]),
  );
  const guardrailReferenceIdByGroupId = new Map(
    staticGuardrailReferences.map((reference) => [
      reference.sourceGuardrailGroupId,
      reference.guardrailReferenceId,
    ]),
  );
  const segments = sourceObservationBoundaryWalkthrough.steps.map(
    (step, index) =>
      buildStorylineSegment(
        step,
        index + 1,
        evidenceGroupIdBySourcePathGroupId,
        guardrailReferenceIdByGroupId,
      ),
  );
  const defaultSegment = segments[0];

  return {
    schema: "telemforge.review_observation_storyline.v1",
    version: 1,
    contractLabel:
      "local deterministic observation storyline and static evidence path",
    localStatus: sourceObservationBoundaryWalkthrough.localStatus,
    summary: {
      storylineId: "candidate-local-review-observation-storyline",
      label: "Local observation storyline",
      summary:
        "A static storyline traces each Stage 36 walkthrough step from source summary through local anchors, related observations, source-stage context, guardrails, and prior review surfaces without saving reviewer state.",
      defaultOpeningSegmentId: defaultSegment.segmentId,
      defaultSourceStageEvidenceGroupId:
        sourceStageEvidenceGroups[0]?.evidenceGroupId ?? "",
      defaultStaticGuardrailReferenceId:
        staticGuardrailReferences[0]?.guardrailReferenceId ?? "",
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        storylineSegmentCount: segments.length,
        sourceStageEvidenceGroupCount: sourceStageEvidenceGroups.length,
        staticGuardrailReferenceCount: staticGuardrailReferences.length,
        priorSurfaceReferenceCount: segments.reduce(
          (count, segment) => count + segment.priorSurfaceReferences.length,
          0,
        ),
        sourceWalkthroughStepCount:
          sourceObservationBoundaryWalkthrough.steps.length,
        sourceBoundaryLedgerRowCount:
          sourceObservationBoundaryWalkthrough.sourceObservationBoundaryLedger
            .boundaryRows.length,
      },
    },
    defaultOpening: {
      storylineId: "candidate-local-review-observation-storyline",
      label: defaultSegment.label,
      summary:
        "Default opening uses the first Stage 36 walkthrough step and remains local review context only.",
      defaultOpeningSegmentId: defaultSegment.segmentId,
      sourceStepId: defaultSegment.sourceStepId,
      sourceBoundaryRowId: defaultSegment.sourceBoundaryRowId,
      sourceSummaryId: defaultSegment.sourceSummaryId,
      sourceAnchorHrefs: defaultSegment.sourceAnchorHrefs,
      relatedObservationRowIds: defaultSegment.relatedObservationRowIds,
      relatedSourceStageNumbers: defaultSegment.relatedSourceStageNumbers,
      staticGuardrailReferenceIds:
        defaultSegment.staticGuardrailReferenceIds,
      priorSurfaceReferences: defaultSegment.priorSurfaceReferences,
      localOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
    segments,
    sourceStageEvidenceGroups,
    staticGuardrailReferences,
    staticStorylineSummary:
      "Stage 37 observation storyline segments are local, static, source-backed, in-page only, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save storyline selections, reviewer progress, observations, notes, filters, anchors, reports, owners, scores, certifications, routes, command runners, task launchers, or runnable checklists.",
    sourceObservationBoundaryWalkthrough,
  };
}

function buildStorylineSegment(
  step: ReviewObservationBoundaryWalkthroughStepView,
  segmentNumber: number,
  evidenceGroupIdBySourcePathGroupId: Map<string, string>,
  guardrailReferenceIdByGroupId: Map<string, string>,
): ReviewObservationStorylineSegmentView {
  const segmentId = buildSegmentId(step.stepId);

  return {
    segmentId,
    segmentNumber,
    sourceStepId: step.stepId,
    sourceBoundaryRowId: step.sourceBoundaryRowId,
    sourceBoundaryCitationId: step.sourceBoundaryCitationId,
    sourceSummaryId: step.sourceSummaryId,
    label: step.label,
    sourceSummary: step.sourceSummary,
    sourceAnchorIds: step.sourceAnchorIds,
    sourceAnchorHrefs: step.sourceAnchorHrefs,
    relatedObservationRowIds: step.relatedObservationRowIds,
    relatedCitationRowIds: step.relatedCitationRowIds,
    relatedSourceStageNumbers: step.relatedSourceStageNumbers,
    staticNonGoalNoteIds: step.staticNonGoalNoteIds,
    sourcePathGroupIds: step.sourcePathGroupIds,
    sourceStageEvidenceGroupIds: step.sourcePathGroupIds
      .map((groupId) => evidenceGroupIdBySourcePathGroupId.get(groupId))
      .filter((groupId): groupId is string => Boolean(groupId)),
    staticGuardrailGroupIds: step.staticGuardrailGroupIds,
    staticGuardrailReferenceIds: step.staticGuardrailGroupIds
      .map((groupId) => guardrailReferenceIdByGroupId.get(groupId))
      .filter((groupId): groupId is string => Boolean(groupId)),
    staticNonGoalContexts: step.staticNonGoalContexts,
    priorSurfaceReferences: buildPriorSurfaceReferences(segmentId, step),
    localOnly: true,
    sourceBacked: true,
    inPageOnly: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  };
}

function buildPriorSurfaceReferences(
  segmentId: string,
  step: ReviewObservationBoundaryWalkthroughStepView,
): ReviewObservationStorylinePriorSurfaceReferenceView[] {
  return [
    {
      referenceId: `${segmentId}:citation-trail`,
      sourceStageNumber: 34,
      surfaceId: "review-observation-citations",
      label: "Stage 34 citation trail",
      anchorHref: "#review-observation-citations",
      sourceIds: [step.sourceBoundaryCitationId],
      localOnly: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
    {
      referenceId: `${segmentId}:boundary-ledger`,
      sourceStageNumber: 35,
      surfaceId: "review-observation-boundary-ledger",
      label: "Stage 35 boundary ledger",
      anchorHref: "#review-observation-boundary-ledger",
      sourceIds: [step.sourceBoundaryRowId],
      localOnly: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
    {
      referenceId: `${segmentId}:boundary-walkthrough`,
      sourceStageNumber: 36,
      surfaceId: "review-observation-boundary-walkthrough",
      label: "Stage 36 boundary walkthrough",
      anchorHref: "#review-observation-boundary-walkthrough",
      sourceIds: [step.stepId],
      localOnly: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
  ];
}

function buildSegmentId(stepId: string): string {
  return stepId.replace(
    "review-observation-boundary-walkthrough:",
    "review-observation-storyline:",
  );
}
