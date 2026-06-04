import type {
  ReviewSurfaceIndexRowView,
  ReviewSurfaceIndexView,
  ReviewSurfaceWorkflowGroupKind,
  ReviewWalkthroughDeferredBoundaryNoteView,
  ReviewWalkthroughLocalCountSummaryView,
  ReviewWalkthroughPathView,
  ReviewWalkthroughPromptGroupView,
  ReviewWalkthroughStepView,
} from "../features/mission-console/types.ts";

export function buildReviewWalkthroughPath(
  sourceSurfaceIndex: ReviewSurfaceIndexView | undefined,
): ReviewWalkthroughPathView | undefined {
  if (!sourceSurfaceIndex?.rows.length || !sourceSurfaceIndex.workflowGroups.length) {
    return undefined;
  }

  const rows = [...sourceSurfaceIndex.rows].sort(
    (left, right) => left.localOrder - right.localOrder,
  );
  const steps = rows.map(buildStep);
  const stepsBySurfaceId = new Map(
    steps.map((step) => [step.sourceSurfaceId, step]),
  );
  const promptGroups = sourceSurfaceIndex.workflowGroups
    .map((group) => buildPromptGroup(group.workflowGroup, sourceSurfaceIndex, steps))
    .filter((group): group is ReviewWalkthroughPromptGroupView => group !== null)
    .sort((left, right) => left.order - right.order);
  const deferredBoundaryNotes = sourceSurfaceIndex.deferredBoundaryNotes.map(
    (note) => ({
      noteId: note.noteId.replace(
        "review-surface-boundary:",
        "review-walkthrough-boundary:",
      ),
      label: note.label,
      summary: `${note.summary} The walkthrough presents this as static review context only.`,
      sourceStepIds: note.sourceSurfaceIds
        .map((surfaceId) => stepsBySurfaceId.get(surfaceId)?.stepId)
        .filter((stepId): stepId is string => Boolean(stepId)),
      sourceSurfaceIds: note.sourceSurfaceIds,
      sourceAnchorIds: note.sourceAnchorIds,
      actionability: note.actionability,
      nonActionable: true,
      informationalOnly: true,
      nonExecutable: true,
      nonCertifying: true,
    } satisfies ReviewWalkthroughDeferredBoundaryNoteView),
  );
  const counts = buildSummaryCounts(steps, promptGroups, deferredBoundaryNotes);

  return {
    schema: "telemforge.review_walkthrough_path.v1",
    version: 1,
    contractLabel:
      "local deterministic review walkthrough path and static prompt deck",
    localStatus: sourceSurfaceIndex.localStatus,
    summary: {
      walkthroughId: "candidate-local-review-walkthrough-path",
      label: "Local review walkthrough path",
      summary:
        "A static reviewer path walks the Stage 30 surface index in stable phase order while preserving local anchors, source labels, and non-executable prompts.",
      defaultStepId: steps[0].stepId,
      defaultAnchorId: steps[0].anchor.anchorId,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      counts,
    },
    steps,
    promptGroups,
    anchorReferences: steps.map((step) => step.anchor),
    deferredBoundaryNotes,
    staticBoundarySummary:
      "The walkthrough is local, informational, non-persistent, non-executable, and non-certifying; it adds no saved progress, reviewer identity, command runner, export, signoff, ownership, scoring, routing, or production handoff behavior.",
    sourceSurfaceIndex,
  };
}

function buildStep(
  row: ReviewSurfaceIndexRowView,
  index: number,
): ReviewWalkthroughStepView {
  const stepNumber = index + 1;
  const usefulCounts = row.sourceCounts.slice(0, 4);

  return {
    stepId: `review-walkthrough-step:${row.surfaceId}`,
    stepNumber,
    workflowGroup: row.workflowGroup,
    label: row.label,
    summary: row.summary,
    sourceSurfaceId: row.surfaceId,
    sourceStageNumber: row.stageNumber,
    sourceSchema: row.sourceSchema,
    sourceContractLabel: row.sourceContractLabel,
    localStatusLabel: row.localStatusLabel,
    statusLabel: row.statusLabel,
    anchor: row.anchor,
    usefulCounts,
    sourceLabels: row.sourceLabels,
    staticInspectionPrompt: buildStepPrompt(row, usefulCounts.map((count) => count.label)),
    expectedObservation: buildStepObservation(row),
    deferredBoundaryCount: row.deferredBoundaryCount,
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildPromptGroup(
  workflowGroup: ReviewSurfaceWorkflowGroupKind,
  sourceSurfaceIndex: ReviewSurfaceIndexView,
  steps: ReviewWalkthroughStepView[],
): ReviewWalkthroughPromptGroupView | null {
  const sourceGroup = sourceSurfaceIndex.workflowGroups.find(
    (group) => group.workflowGroup === workflowGroup,
  );
  if (!sourceGroup) {
    return null;
  }

  const groupSteps = steps.filter((step) => step.workflowGroup === workflowGroup);
  if (!groupSteps.length) {
    return null;
  }

  return {
    promptGroupId: `review-walkthrough-prompt:${workflowGroup}`,
    workflowGroup,
    order: sourceGroup.order,
    label: sourceGroup.label,
    summary: sourceGroup.summary,
    staticInspectionPrompt:
      `Review the ${sourceGroup.label.toLowerCase()} phase in stable order ${sourceGroup.order} across ${groupSteps.length} indexed surfaces: ${joinLabels(groupSteps.map((step) => step.label))}.`,
    expectedObservation:
      `Expect local anchors ${joinLabels(groupSteps.map((step) => step.anchor.anchorId))} to resolve in-page while source metrics remain informational and non-certifying.`,
    stepIds: groupSteps.map((step) => step.stepId),
    anchorIds: groupSteps.map((step) => step.anchor.anchorId),
    localCounts: buildLocalCountSummary(groupSteps),
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildStepPrompt(row: ReviewSurfaceIndexRowView, countLabels: string[]): string {
  return `Inspect ${row.label} at ${row.anchor.href}; confirm ${row.sourceSchema}, ${row.sourceContractLabel}, ${row.localStatusLabel}, and ${joinLabels(countLabels)} match the Stage 30 source row.`;
}

function buildStepObservation(row: ReviewSurfaceIndexRowView): string {
  return `Expect ${row.statusLabel.replace(/_/g, " ")} with ${row.deferredBoundaryCount} deferred boundary notes and local anchor ${row.anchor.anchorId}; no saved progress, command execution, export, signoff, scoring, or certification control is present.`;
}

function buildLocalCountSummary(
  steps: ReviewWalkthroughStepView[],
): ReviewWalkthroughLocalCountSummaryView {
  return {
    stepCount: steps.length,
    anchorCount: new Set(steps.map((step) => step.anchor.anchorId)).size,
    sourceSchemaCount: new Set(steps.map((step) => step.sourceSchema)).size,
    sourceCountMetricCount: steps.reduce(
      (total, step) => total + step.usefulCounts.length,
      0,
    ),
    deferredBoundaryCount: steps.reduce(
      (total, step) => total + step.deferredBoundaryCount,
      0,
    ),
  };
}

function buildSummaryCounts(
  steps: ReviewWalkthroughStepView[],
  promptGroups: ReviewWalkthroughPromptGroupView[],
  deferredBoundaryNotes: ReviewWalkthroughDeferredBoundaryNoteView[],
): ReviewWalkthroughPathView["summary"]["counts"] {
  return {
    totalStepCount: steps.length,
    promptGroupCount: promptGroups.length,
    localAnchorCount: new Set(steps.map((step) => step.anchor.anchorId)).size,
    sourceSchemaCount: new Set(steps.map((step) => step.sourceSchema)).size,
    sourceCountMetricCount: steps.reduce(
      (total, step) => total + step.usefulCounts.length,
      0,
    ),
    deferredBoundaryNoteCount: deferredBoundaryNotes.length,
    localOnlyStepCount: steps.filter((step) => step.localOnly).length,
  };
}

function joinLabels(labels: string[]): string {
  if (!labels.length) {
    return "no local counts";
  }
  return labels.join(", ");
}
