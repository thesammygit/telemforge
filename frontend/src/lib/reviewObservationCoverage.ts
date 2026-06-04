import type {
  ReviewObservationAttentionKind,
  ReviewObservationBlindSpotKind,
  ReviewObservationCoverageAttentionRowView,
  ReviewObservationCoverageBlindSpotRowView,
  ReviewObservationCoveragePhaseRowView,
  ReviewObservationCoverageSourceStageRowView,
  ReviewObservationCoverageView,
  ReviewObservationLensView,
  ReviewObservationRowView,
  ReviewSurfaceWorkflowGroupKind,
} from "../features/mission-console/types.ts";

type WorkflowPhaseDefinition = {
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  order: number;
  label: string;
  summary: string;
};

const workflowPhaseDefinitions: WorkflowPhaseDefinition[] = [
  {
    workflowGroup: "decision",
    order: 1,
    label: "Decision",
    summary:
      "Decision surfaces keep local review findings source-backed, route-free, and non-certifying.",
  },
  {
    workflowGroup: "action",
    order: 2,
    label: "Action",
    summary:
      "Action surfaces keep local follow-up context visible without owners, task launchers, or command execution.",
  },
  {
    workflowGroup: "readiness",
    order: 3,
    label: "Readiness",
    summary:
      "Readiness surfaces keep static proof gaps and pass context visible without saved progress or scoring.",
  },
  {
    workflowGroup: "evidence",
    order: 4,
    label: "Evidence",
    summary:
      "Evidence surfaces keep trace, outcome, and coverage rows source-backed without report export semantics.",
  },
  {
    workflowGroup: "proof",
    order: 5,
    label: "Proof",
    summary:
      "Proof surfaces keep packet and priority context informational, non-ranking, and non-certifying.",
  },
  {
    workflowGroup: "navigator",
    order: 6,
    label: "Navigator",
    summary:
      "Navigator coverage keeps proof source crosswalk anchors local and in-page only.",
  },
  {
    workflowGroup: "reconciliation",
    order: 7,
    label: "Reconciliation",
    summary:
      "Reconciliation coverage keeps proof-chain consistency visible without certification or production handoff.",
  },
];

export function buildReviewObservationCoverage(
  sourceObservationLens: ReviewObservationLensView | undefined,
): ReviewObservationCoverageView | undefined {
  if (!sourceObservationLens?.observationRows.length) {
    return undefined;
  }

  const rows = [...sourceObservationLens.observationRows].sort(
    (left, right) => left.observationNumber - right.observationNumber,
  );
  const phaseCoverageRows = buildPhaseCoverageRows(rows);
  const sourceStageCoverageRows = buildSourceStageCoverageRows(rows);
  const attentionCoverageRows = buildAttentionCoverageRows(sourceObservationLens);
  const anchorCoverage = {
    totalAnchorCount: sourceObservationLens.anchorReferences.length,
    coveredObservationRowCount: new Set(
      rows.map((row) => row.observationRowId),
    ).size,
    localHrefCount: sourceObservationLens.anchorReferences.filter((anchor) =>
      anchor.href.startsWith("#"),
    ).length,
    anchorIds: unique(
      sourceObservationLens.anchorReferences.map((anchor) => anchor.anchorId),
    ),
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
  } satisfies ReviewObservationCoverageView["anchorCoverage"];
  const countSignalCoverage = {
    totalSignalCount: sourceObservationLens.countSignals.length,
    coveredObservationRowCount: rows.filter((row) => row.countSignalIds.length)
      .length,
    sourcePaths: unique(
      sourceObservationLens.countSignals.map((signal) => signal.sourcePath),
    ),
    signalIds: sourceObservationLens.countSignals.map((signal) => signal.signalId),
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  } satisfies ReviewObservationCoverageView["countSignalCoverage"];
  const deferredBoundaryCoverage = {
    totalBoundaryCount: sourceObservationLens.deferredBoundarySummaries.length,
    affectedObservationRowIds: rows
      .filter((row) => row.deferredBoundarySummaryIds.length)
      .map((row) => row.observationRowId),
    sourceAnchorIds: unique(
      sourceObservationLens.deferredBoundarySummaries.flatMap(
        (summary) => summary.sourceAnchorIds,
      ),
    ),
    summaryIds: sourceObservationLens.deferredBoundarySummaries.map(
      (summary) => summary.summaryId,
    ),
    informationalOnly: true,
    nonActionable: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  } satisfies ReviewObservationCoverageView["deferredBoundaryCoverage"];
  const blindSpotRows = buildBlindSpotRows(
    rows,
    sourceObservationLens.deferredBoundarySummaries.map(
      (summary) => summary.summaryId,
    ),
  );

  return {
    schema: "telemforge.review_observation_coverage.v1",
    version: 1,
    contractLabel:
      "local deterministic observation coverage matrix and static blind-spot map",
    localStatus: sourceObservationLens.localStatus,
    summary: {
      coverageId: "candidate-local-review-observation-coverage",
      label: "Local observation coverage matrix",
      summary:
        "A static coverage matrix compares Stage 32 observation phases, source stages, attention categories, anchors, counts, and deferred boundaries without saved review state.",
      defaultPhaseRowId: phaseCoverageRows[0].phaseRowId,
      defaultSourceStageRowId: sourceStageCoverageRows[0].sourceStageRowId,
      defaultAttentionCoverageRowId:
        attentionCoverageRows[0].attentionCoverageRowId,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        phaseCoverageRowCount: phaseCoverageRows.length,
        sourceStageCoverageRowCount: sourceStageCoverageRows.length,
        attentionCoverageRowCount: attentionCoverageRows.length,
        localAnchorCount: anchorCoverage.totalAnchorCount,
        countSignalCount: countSignalCoverage.totalSignalCount,
        deferredBoundaryCount: deferredBoundaryCoverage.totalBoundaryCount,
        blindSpotRowCount: blindSpotRows.length,
        localOnlyCoverageRowCount: phaseCoverageRows.filter(
          (row) => row.localOnly,
        ).length,
      },
    },
    phaseCoverageRows,
    sourceStageCoverageRows,
    attentionCoverageRows,
    anchorCoverage,
    countSignalCoverage,
    deferredBoundaryCoverage,
    blindSpotRows,
    staticCoverageSummary:
      "Stage 33 coverage remains local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; it does not save observations, store notes, assign owners, run commands, export reports, score proofs, certify readiness, or add routes.",
    sourceObservationLens,
  };
}

function buildPhaseCoverageRows(
  rows: ReviewObservationRowView[],
): ReviewObservationCoveragePhaseRowView[] {
  return workflowPhaseDefinitions.map((definition) => {
    const phaseRows = rows.filter(
      (row) => row.workflowGroup === definition.workflowGroup,
    );

    return {
      phaseRowId: `review-observation-coverage-phase:${definition.workflowGroup}`,
      workflowGroup: definition.workflowGroup,
      order: definition.order,
      label: definition.label,
      summary: definition.summary,
      observationRowIds: phaseRows.map((row) => row.observationRowId),
      sourceStageNumbers: uniqueNumbers(
        phaseRows.map((row) => row.sourceStageNumber),
      ),
      anchorIds: unique(phaseRows.map((row) => row.anchor.anchorId)),
      attentionKinds: uniqueAttentionKinds(
        phaseRows.flatMap((row) => row.attentionKinds),
      ),
      countSignalIds: unique(phaseRows.flatMap((row) => row.countSignalIds)),
      deferredBoundarySummaryIds: unique(
        phaseRows.flatMap((row) => row.deferredBoundarySummaryIds),
      ),
      localOnly: true,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    };
  });
}

function buildSourceStageCoverageRows(
  rows: ReviewObservationRowView[],
): ReviewObservationCoverageSourceStageRowView[] {
  return uniqueNumbers(rows.map((row) => row.sourceStageNumber)).map(
    (sourceStageNumber) => {
      const stageRows = rows.filter(
        (row) => row.sourceStageNumber === sourceStageNumber,
      );

      return {
        sourceStageRowId: `review-observation-coverage-source-stage:${sourceStageNumber}`,
        sourceStageNumber,
        label: `Stage ${sourceStageNumber}`,
        observationRowIds: stageRows.map((row) => row.observationRowId),
        workflowGroups: uniqueWorkflowGroups(
          stageRows.map((row) => row.workflowGroup),
        ),
        sourceSchemas: unique(stageRows.map((row) => row.sourceSchema)),
        sourceContractLabels: unique(
          stageRows.map((row) => row.sourceContractLabel),
        ),
        anchorIds: unique(stageRows.map((row) => row.anchor.anchorId)),
        countSignalIds: unique(stageRows.flatMap((row) => row.countSignalIds)),
        deferredBoundarySummaryIds: unique(
          stageRows.flatMap((row) => row.deferredBoundarySummaryIds),
        ),
        localOnly: true,
        sourceBacked: true,
        informationalOnly: true,
        nonExecutable: true,
        nonCertifying: true,
        nonRanking: true,
      };
    },
  );
}

function buildAttentionCoverageRows(
  sourceObservationLens: ReviewObservationLensView,
): ReviewObservationCoverageAttentionRowView[] {
  return [...sourceObservationLens.attentionGroups]
    .sort((left, right) => left.order - right.order)
    .map((group) => ({
      attentionCoverageRowId: `review-observation-coverage-attention:${group.kind}`,
      sourceAttentionGroupId: group.attentionGroupId,
      kind: group.kind,
      order: group.order,
      label: group.label,
      summary: group.summary,
      observationRowIds: group.observationRowIds,
      anchorIds: group.anchorIds,
      countSignalIds: group.countSignalIds,
      deferredBoundarySummaryIds: group.deferredBoundarySummaryIds,
      localOnly: true,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    }));
}

function buildBlindSpotRows(
  rows: ReviewObservationRowView[],
  deferredBoundarySummaryIds: string[],
): ReviewObservationCoverageBlindSpotRowView[] {
  const rowIds = rows.map((row) => row.observationRowId);
  const anchorIds = unique(rows.map((row) => row.anchor.anchorId));

  const blindSpotRows: Array<{
    kind: ReviewObservationBlindSpotKind;
    label: string;
    summary: string;
    sourceDeferredBoundarySummaryIds?: string[];
  }> = [
    {
      kind: "absent_saved_review_state",
      label: "Saved review state absent",
      summary:
        "The Stage 32 lens has source-backed observations but no saved observations, notes, filters, coverage selections, or review progress signal.",
    },
    {
      kind: "absent_identity_or_signoff",
      label: "Reviewer identity and signoff absent",
      summary:
        "Observation coverage is local context only; it does not identify reviewers, retain audit history, assign owners, or collect signoff.",
    },
    {
      kind: "absent_execution_or_scoring",
      label: "Execution and scoring absent",
      summary:
        "Coverage rows expose anchors, counts, and deferred boundaries without command runners, runnable checklists, proof scoring, quality scoring, ranking, or certification.",
    },
  ];

  if (deferredBoundarySummaryIds.length) {
    blindSpotRows.push({
      kind: "deferred_production_boundary",
      label: "Deferred production scope visible",
      summary:
        "Deferred boundary summaries remain visible as non-actionable local review context, not tasks, tickets, checklist items, owners, or certification gates.",
      sourceDeferredBoundarySummaryIds: deferredBoundarySummaryIds,
    });
  }

  return blindSpotRows.map((row) => ({
    blindSpotRowId: `review-observation-coverage-blind-spot:${row.kind}`,
    kind: row.kind,
    label: row.label,
    summary: row.summary,
    sourceObservationRowIds: rowIds,
    sourceAnchorIds: anchorIds,
    sourceDeferredBoundarySummaryIds: row.sourceDeferredBoundarySummaryIds ?? [],
    staticReviewContext: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
    notATask: true,
    notATicket: true,
    notAChecklist: true,
    notOwnerAssigned: true,
  }));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)];
}

function uniqueWorkflowGroups(
  values: ReviewSurfaceWorkflowGroupKind[],
): ReviewSurfaceWorkflowGroupKind[] {
  const ordered = workflowPhaseDefinitions.map(
    (definition) => definition.workflowGroup,
  );
  return ordered.filter((group) => values.includes(group));
}

function uniqueAttentionKinds(
  values: ReviewObservationAttentionKind[],
): ReviewObservationAttentionKind[] {
  const ordered: ReviewObservationAttentionKind[] = [
    "source_alignment",
    "anchor_resolution",
    "count_signal",
    "deferred_boundary",
  ];
  return ordered.filter((kind) => values.includes(kind));
}
