import type {
  ReviewObservationAnchorReferenceView,
  ReviewObservationAttentionGroupView,
  ReviewObservationAttentionKind,
  ReviewObservationCountSignalView,
  ReviewObservationDeferredBoundarySummaryView,
  ReviewObservationLensView,
  ReviewObservationRowView,
  ReviewObservationSourceReferenceView,
  ReviewWalkthroughPathView,
  ReviewWalkthroughStepView,
} from "../features/mission-console/types.ts";

type AttentionDefinition = {
  kind: ReviewObservationAttentionKind;
  order: number;
  label: string;
  summary: string;
};

const attentionDefinitions: AttentionDefinition[] = [
  {
    kind: "source_alignment",
    order: 1,
    label: "Source alignment",
    summary:
      "Compare walkthrough rows against source schemas, contract labels, local statuses, and source labels.",
  },
  {
    kind: "anchor_resolution",
    order: 2,
    label: "Anchor resolution",
    summary:
      "Confirm local in-page anchors remain available without routes, saved selections, or navigation state.",
  },
  {
    kind: "count_signal",
    order: 3,
    label: "Useful count signals",
    summary:
      "Review compact count signals as informational local context without ranking or proof scoring.",
  },
  {
    kind: "deferred_boundary",
    order: 4,
    label: "Deferred boundaries",
    summary:
      "Keep production and workflow boundaries visible, non-actionable, and non-certifying.",
  },
];

export function buildReviewObservationLens(
  walkthroughPath: ReviewWalkthroughPathView | undefined,
): ReviewObservationLensView | undefined {
  if (!walkthroughPath?.steps.length || !walkthroughPath.promptGroups.length) {
    return undefined;
  }

  const steps = [...walkthroughPath.steps].sort(
    (left, right) => left.stepNumber - right.stepNumber,
  );
  const deferredBoundarySummaries =
    walkthroughPath.deferredBoundaryNotes.map(buildDeferredBoundarySummary);
  const deferredSummariesByStepId = groupDeferredSummariesByStepId(
    deferredBoundarySummaries,
  );
  const sourceReferences = steps.map(buildSourceReference);
  const sourceReferenceByStepId = new Map(
    sourceReferences.map((reference) => [reference.sourceStepId, reference]),
  );
  const anchorReferences = steps.map(buildAnchorReference);
  const countSignals = steps.flatMap(buildCountSignals);
  const countSignalsByStepId = groupCountSignalsByStepId(countSignals);
  const observationRows = steps.map((step, index) =>
    buildObservationRow(
      step,
      index + 1,
      sourceReferenceByStepId.get(step.stepId)!,
      countSignalsByStepId.get(step.stepId) ?? [],
      deferredSummariesByStepId.get(step.stepId) ?? [],
    ),
  );
  const attentionGroups = buildAttentionGroups(
    observationRows,
    countSignalsByStepId,
  );
  const counts = buildCounts(
    observationRows,
    attentionGroups,
    sourceReferences,
    anchorReferences,
    countSignals,
    deferredBoundarySummaries,
  );

  return {
    schema: "telemforge.review_observation_lens.v1",
    version: 1,
    contractLabel:
      "local deterministic review observation lens and static attention map",
    localStatus: walkthroughPath.localStatus,
    summary: {
      lensId: "candidate-local-review-observation-lens",
      label: "Local review observation lens",
      summary:
        "A static attention map turns the Stage 31 walkthrough into source, anchor, count, and deferred-boundary observations without saved notes or review progress.",
      defaultObservationRowId: observationRows[0].observationRowId,
      defaultAnchorId: observationRows[0].anchor.anchorId,
      defaultAttentionGroupId: attentionGroups[0].attentionGroupId,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts,
    },
    observationRows,
    attentionGroups,
    sourceReferences,
    anchorReferences,
    countSignals,
    deferredBoundarySummaries,
    staticAttentionSummary:
      "Stage 32 observation rows and attention groups are local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; the mission console does not save observations, store reviewer notes, assign owners, run commands, export reports, score proofs, certify readiness, or create routes.",
    sourceWalkthroughPath: walkthroughPath,
  };
}

function buildSourceReference(
  step: ReviewWalkthroughStepView,
): ReviewObservationSourceReferenceView {
  return {
    sourceReferenceId: `review-observation-source:${step.stepId}`,
    sourceStepId: step.stepId,
    sourceSurfaceId: step.sourceSurfaceId,
    sourceStageNumber: step.sourceStageNumber,
    sourceSchema: step.sourceSchema,
    sourceContractLabel: step.sourceContractLabel,
    sourceLabels: step.sourceLabels,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildAnchorReference(
  step: ReviewWalkthroughStepView,
): ReviewObservationAnchorReferenceView {
  return {
    anchorReferenceId: `review-observation-anchor:${step.stepId}`,
    sourceStepId: step.stepId,
    anchorId: step.anchor.anchorId,
    href: step.anchor.href,
    label: step.anchor.label,
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
  };
}

function buildCountSignals(
  step: ReviewWalkthroughStepView,
): ReviewObservationCountSignalView[] {
  return step.usefulCounts.map((count) => ({
    signalId: `review-observation-count:${step.stepId}:${slugify(
      count.sourcePath,
    )}:${slugify(count.label)}`,
    sourceStepId: step.stepId,
    sourceSurfaceId: step.sourceSurfaceId,
    label: count.label,
    value: count.value,
    sourcePath: count.sourcePath,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  }));
}

function buildDeferredBoundarySummary(
  note: ReviewWalkthroughPathView["deferredBoundaryNotes"][number],
): ReviewObservationDeferredBoundarySummaryView {
  return {
    summaryId: note.noteId.replace(
      "review-walkthrough-boundary:",
      "review-observation-boundary:",
    ),
    sourceNoteId: note.noteId,
    label: note.label,
    summary: `${note.summary} The observation lens keeps this boundary visible as static attention context only.`,
    sourceStepIds: note.sourceStepIds,
    sourceSurfaceIds: note.sourceSurfaceIds,
    sourceAnchorIds: note.sourceAnchorIds,
    actionability: note.actionability,
    nonActionable: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildObservationRow(
  step: ReviewWalkthroughStepView,
  observationNumber: number,
  sourceReference: ReviewObservationSourceReferenceView,
  countSignals: ReviewObservationCountSignalView[],
  deferredBoundarySummaries: ReviewObservationDeferredBoundarySummaryView[],
): ReviewObservationRowView {
  return {
    observationRowId: `review-observation:${step.stepId}`,
    observationNumber,
    workflowGroup: step.workflowGroup,
    label: step.label,
    summary: `Observe ${step.label} through source, anchor, count, and deferred-boundary context derived from walkthrough step ${step.stepNumber}.`,
    sourceStepId: step.stepId,
    sourceSurfaceId: step.sourceSurfaceId,
    sourceStageNumber: step.sourceStageNumber,
    sourceSchema: step.sourceSchema,
    sourceContractLabel: step.sourceContractLabel,
    localStatusLabel: step.localStatusLabel,
    statusLabel: step.statusLabel,
    anchor: step.anchor,
    sourceReferenceId: sourceReference.sourceReferenceId,
    countSignalIds: countSignals.map((signal) => signal.signalId),
    deferredBoundarySummaryIds: deferredBoundarySummaries.map(
      (summary) => summary.summaryId,
    ),
    sourceLabels: step.sourceLabels,
    staticInspectionPrompt: step.staticInspectionPrompt,
    staticExpectedObservation: step.expectedObservation,
    attentionKinds: buildAttentionKinds(countSignals, deferredBoundarySummaries),
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function buildAttentionKinds(
  countSignals: ReviewObservationCountSignalView[],
  deferredBoundarySummaries: ReviewObservationDeferredBoundarySummaryView[],
): ReviewObservationAttentionKind[] {
  const kinds: ReviewObservationAttentionKind[] = [
    "source_alignment",
    "anchor_resolution",
  ];
  if (countSignals.length) {
    kinds.push("count_signal");
  }
  if (deferredBoundarySummaries.length) {
    kinds.push("deferred_boundary");
  }
  return kinds;
}

function buildAttentionGroups(
  rows: ReviewObservationRowView[],
  countSignalsByStepId: Map<string, ReviewObservationCountSignalView[]>,
): ReviewObservationAttentionGroupView[] {
  return attentionDefinitions.map((definition) => {
    const groupRows = rows.filter((row) =>
      row.attentionKinds.includes(definition.kind),
    );
    const countSignalIds =
      definition.kind === "count_signal"
        ? unique(
            groupRows.flatMap(
              (row) =>
                countSignalsByStepId
                  .get(row.sourceStepId)
                  ?.map((signal) => signal.signalId) ?? [],
            ),
          )
        : [];
    const deferredBoundarySummaryIds =
      definition.kind === "deferred_boundary"
        ? unique(groupRows.flatMap((row) => row.deferredBoundarySummaryIds))
        : [];

    return {
      attentionGroupId: `review-observation-attention:${definition.kind}`,
      kind: definition.kind,
      order: definition.order,
      label: definition.label,
      summary: definition.summary,
      observationRowIds: groupRows.map((row) => row.observationRowId),
      anchorIds: unique(groupRows.map((row) => row.anchor.anchorId)),
      countSignalIds,
      deferredBoundarySummaryIds,
      localOnly: true,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    };
  });
}

function buildCounts(
  rows: ReviewObservationRowView[],
  attentionGroups: ReviewObservationAttentionGroupView[],
  sourceReferences: ReviewObservationSourceReferenceView[],
  anchorReferences: ReviewObservationAnchorReferenceView[],
  countSignals: ReviewObservationCountSignalView[],
  deferredBoundarySummaries: ReviewObservationDeferredBoundarySummaryView[],
): ReviewObservationLensView["summary"]["counts"] {
  return {
    totalObservationRowCount: rows.length,
    attentionGroupCount: attentionGroups.length,
    localAnchorCount: new Set(anchorReferences.map((anchor) => anchor.anchorId))
      .size,
    sourceReferenceCount: sourceReferences.length,
    countSignalCount: countSignals.length,
    deferredBoundarySummaryCount: deferredBoundarySummaries.length,
    staticExpectedObservationCount: rows.filter(
      (row) => row.staticExpectedObservation.length > 0,
    ).length,
    localOnlyObservationCount: rows.filter((row) => row.localOnly).length,
  };
}

function groupDeferredSummariesByStepId(
  summaries: ReviewObservationDeferredBoundarySummaryView[],
): Map<string, ReviewObservationDeferredBoundarySummaryView[]> {
  const grouped = new Map<string, ReviewObservationDeferredBoundarySummaryView[]>();
  for (const summary of summaries) {
    for (const stepId of summary.sourceStepIds) {
      const current = grouped.get(stepId) ?? [];
      current.push(summary);
      grouped.set(stepId, current);
    }
  }
  return grouped;
}

function groupCountSignalsByStepId(
  signals: ReviewObservationCountSignalView[],
): Map<string, ReviewObservationCountSignalView[]> {
  const grouped = new Map<string, ReviewObservationCountSignalView[]>();
  for (const signal of signals) {
    const current = grouped.get(signal.sourceStepId) ?? [];
    current.push(signal);
    grouped.set(signal.sourceStepId, current);
  }
  return grouped;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
