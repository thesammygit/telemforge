import type {
  ReviewObservationBoundaryLedgerRowView,
  ReviewObservationBoundaryLedgerView,
  ReviewObservationBoundarySourcePathGroupView,
  ReviewObservationBoundaryStaticGuardrailGroupView,
  ReviewObservationBoundaryWalkthroughStaticContextView,
  ReviewObservationBoundaryWalkthroughStepView,
  ReviewObservationBoundaryWalkthroughView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationBoundaryWalkthrough(
  sourceObservationBoundaryLedger: ReviewObservationBoundaryLedgerView | undefined,
): ReviewObservationBoundaryWalkthroughView | undefined {
  if (!sourceObservationBoundaryLedger?.boundaryRows.length) {
    return undefined;
  }

  const stepIdByBoundaryRowId = new Map(
    sourceObservationBoundaryLedger.boundaryRows.map((row) => [
      row.boundaryRowId,
      buildStepId(row.boundaryRowId),
    ]),
  );
  const sourcePathGroups = sourceObservationBoundaryLedger.sourceStageBoundaryGroups.map(
    (group) => ({
      sourcePathGroupId: `review-observation-boundary-walkthrough-source-path:${group.sourceStageNumber}`,
      sourceStageGroupId: group.sourceStageGroupId,
      sourceMapRowId: group.sourceMapRowId,
      sourceStageNumber: group.sourceStageNumber,
      label: group.label,
      sourceSchemas: group.sourceSchemas,
      sourceContractLabels: group.sourceContractLabels,
      boundaryRowIds: group.boundaryRowIds,
      boundaryStepIds: group.boundaryRowIds
        .map((boundaryRowId) => stepIdByBoundaryRowId.get(boundaryRowId))
        .filter((stepId): stepId is string => Boolean(stepId)),
      relatedObservationRowIds: group.relatedObservationRowIds,
      anchorHrefs: group.anchorHrefs,
      localOnly: true,
      sourceBacked: true,
      inPageOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    }) satisfies ReviewObservationBoundarySourcePathGroupView,
  );
  const staticGuardrailGroups =
    sourceObservationBoundaryLedger.staticNonGoalNotes.map((note) => ({
      guardrailGroupId: `review-observation-boundary-walkthrough-guardrail:${note.kind}`,
      sourceNonGoalNoteId: note.nonGoalNoteId,
      kind: note.kind,
      label: note.label,
      summary: note.summary,
      boundaryRowIds: note.relatedBoundaryRowIds,
      boundaryStepIds: note.relatedBoundaryRowIds
        .map((boundaryRowId) => stepIdByBoundaryRowId.get(boundaryRowId))
        .filter((stepId): stepId is string => Boolean(stepId)),
      sourceObservationRowIds: note.sourceObservationRowIds,
      sourceAnchorIds: note.sourceAnchorIds,
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
    })) satisfies ReviewObservationBoundaryStaticGuardrailGroupView[];
  const sourcePathGroupIdsByBoundaryRowId = groupIdsByBoundaryRowId(
    sourcePathGroups,
    "sourcePathGroupId",
  );
  const staticGuardrailGroupIdsByBoundaryRowId = groupIdsByBoundaryRowId(
    staticGuardrailGroups,
    "guardrailGroupId",
  );
  const staticGuardrailBySourceNoteId = new Map(
    sourceObservationBoundaryLedger.staticNonGoalNotes.map((note) => [
      note.nonGoalNoteId,
      note,
    ]),
  );
  const steps = sourceObservationBoundaryLedger.boundaryRows.map((row, index) =>
    buildWalkthroughStep(
      row,
      index + 1,
      sourcePathGroupIdsByBoundaryRowId.get(row.boundaryRowId) ?? [],
      staticGuardrailGroupIdsByBoundaryRowId.get(row.boundaryRowId) ?? [],
      row.staticNonGoalNoteIds
        .map((noteId) => staticGuardrailBySourceNoteId.get(noteId))
        .filter((note): note is ReviewObservationBoundaryLedgerView["staticNonGoalNotes"][number] =>
          Boolean(note),
        ),
    ),
  );
  const defaultStep = steps[0];

  return {
    schema: "telemforge.review_observation_boundary_walkthrough.v1",
    version: 1,
    contractLabel: "local deterministic boundary walkthrough and static source path",
    localStatus: sourceObservationBoundaryLedger.localStatus,
    summary: {
      walkthroughId: "candidate-local-review-observation-boundary-walkthrough",
      label: "Local boundary walkthrough",
      summary:
        "A static walkthrough traces each Stage 35 deferred-boundary row through source summaries, local anchors, related observations, source stages, and non-goal guardrails without saving reviewer state.",
      defaultStepId: defaultStep.stepId,
      defaultSourcePathGroupId: sourcePathGroups[0]?.sourcePathGroupId ?? "",
      defaultStaticGuardrailGroupId:
        staticGuardrailGroups[0]?.guardrailGroupId ?? "",
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        boundaryStepCount: steps.length,
        sourcePathGroupCount: sourcePathGroups.length,
        staticGuardrailGroupCount: staticGuardrailGroups.length,
        sourceLedgerBoundaryRowCount:
          sourceObservationBoundaryLedger.boundaryRows.length,
        sourceLedgerObservationReferenceGroupCount:
          sourceObservationBoundaryLedger.observationReferenceGroups.length,
        sourceLedgerAnchorReferenceGroupCount:
          sourceObservationBoundaryLedger.anchorReferenceGroups.length,
      },
    },
    defaultFocus: {
      walkthroughId: "candidate-local-review-observation-boundary-walkthrough",
      label: defaultStep.label,
      summary:
        "Default focus uses the first Stage 35 boundary row and remains local review context only.",
      defaultStepId: defaultStep.stepId,
      sourceBoundaryRowId: defaultStep.sourceBoundaryRowId,
      sourceSummaryId: defaultStep.sourceSummaryId,
      sourceAnchorHrefs: defaultStep.sourceAnchorHrefs,
      relatedObservationRowIds: defaultStep.relatedObservationRowIds,
      relatedSourceStageNumbers: defaultStep.relatedSourceStageNumbers,
      staticNonGoalNoteIds: defaultStep.staticNonGoalNoteIds,
      localOnly: true,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    },
    steps,
    sourcePathGroups,
    staticGuardrailGroups,
    staticWalkthroughSummary:
      "Stage 36 boundary walkthrough steps are local, static, source-backed, in-page only, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save walkthrough selections, reviewer progress, observations, notes, filters, anchors, reports, owners, scores, certifications, routes, command runners, or runnable checklists.",
    sourceObservationBoundaryLedger,
  };
}

function buildWalkthroughStep(
  row: ReviewObservationBoundaryLedgerRowView,
  stepNumber: number,
  sourcePathGroupIds: string[],
  staticGuardrailGroupIds: string[],
  staticNonGoalNotes: ReviewObservationBoundaryLedgerView["staticNonGoalNotes"],
): ReviewObservationBoundaryWalkthroughStepView {
  return {
    stepId: buildStepId(row.boundaryRowId),
    stepNumber,
    sourceBoundaryRowId: row.boundaryRowId,
    sourceBoundaryCitationId: row.sourceBoundaryCitationId,
    sourceSummaryId: row.sourceSummaryId,
    label: row.label,
    sourceSummary: row.sourceSummary,
    sourceAnchorIds: row.sourceAnchorIds,
    sourceAnchorHrefs: row.sourceAnchorHrefs,
    relatedObservationRowIds: row.relatedObservationRowIds,
    relatedCitationRowIds: row.relatedCitationRowIds,
    relatedSourceStageNumbers: row.relatedSourceStageNumbers,
    staticNonGoalNoteIds: row.staticNonGoalNoteIds,
    sourcePathGroupIds,
    staticGuardrailGroupIds,
    staticNonGoalContexts: staticNonGoalNotes.map(
      (note) =>
        ({
          nonGoalNoteId: note.nonGoalNoteId,
          kind: note.kind,
          label: note.label,
          summary: note.summary,
          staticReviewContext: true,
          informationalOnly: true,
          nonActionable: true,
          nonPersistent: true,
          nonExecutable: true,
          nonCertifying: true,
          nonRanking: true,
        }) satisfies ReviewObservationBoundaryWalkthroughStaticContextView,
    ),
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

function groupIdsByBoundaryRowId<
  T extends { boundaryRowIds: string[] },
  K extends keyof T,
>(groups: T[], idKey: K): Map<string, string[]> {
  const groupsByBoundaryRowId = new Map<string, string[]>();
  for (const group of groups) {
    for (const boundaryRowId of group.boundaryRowIds) {
      groupsByBoundaryRowId.set(boundaryRowId, [
        ...(groupsByBoundaryRowId.get(boundaryRowId) ?? []),
        String(group[idKey]),
      ]);
    }
  }
  return groupsByBoundaryRowId;
}

function buildStepId(boundaryRowId: string): string {
  return boundaryRowId.replace(
    "review-observation-boundary-ledger:",
    "review-observation-boundary-walkthrough:",
  );
}
