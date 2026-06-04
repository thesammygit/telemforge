import type {
  ReviewObservationCitationAnchorGroupView,
  ReviewObservationCitationCountSignalView,
  ReviewObservationCitationDeferredBoundaryView,
  ReviewObservationCitationPhaseGroupView,
  ReviewObservationCitationRowView,
  ReviewObservationCitationSourceMapRowView,
  ReviewObservationCitationTrailView,
  ReviewObservationCoverageView,
  ReviewObservationRowView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationCitations(
  sourceObservationCoverage: ReviewObservationCoverageView | undefined,
): ReviewObservationCitationTrailView | undefined {
  const sourceObservationLens = sourceObservationCoverage?.sourceObservationLens;
  if (!sourceObservationCoverage || !sourceObservationLens?.observationRows.length) {
    return undefined;
  }

  const observationRows = [...sourceObservationLens.observationRows].sort(
    (left, right) => left.observationNumber - right.observationNumber,
  );
  const countSignalCitations = sourceObservationLens.countSignals.map(
    (signal) => {
      const sourceObservationRow = observationRows.find(
        (row) => row.sourceStepId === signal.sourceStepId,
      );

      return {
        citationId: `review-observation-citation-count:${signal.signalId}`,
        sourceSignalId: signal.signalId,
        sourceObservationRowId:
          sourceObservationRow?.observationRowId ?? signal.sourceStepId,
        sourceStepId: signal.sourceStepId,
        sourceSurfaceId: signal.sourceSurfaceId,
        label: signal.label,
        value: signal.value,
        sourcePath: signal.sourcePath,
        localOnly: true,
        sourceBacked: true,
        informationalOnly: true,
        nonPersistent: true,
        nonExecutable: true,
        nonCertifying: true,
        nonRanking: true,
      } satisfies ReviewObservationCitationCountSignalView;
    },
  );
  const countSignalCitationBySignalId = new Map(
    countSignalCitations.map((citation) => [
      citation.sourceSignalId,
      citation,
    ]),
  );
  const deferredBoundaryCitations =
    sourceObservationLens.deferredBoundarySummaries.map((summary) => ({
      citationId: `review-observation-citation-boundary:${summary.summaryId}`,
      sourceSummaryId: summary.summaryId,
      sourceObservationRowIds: observationRows
        .filter((row) =>
          row.deferredBoundarySummaryIds.includes(summary.summaryId),
        )
        .map((row) => row.observationRowId),
      label: summary.label,
      summaryReference: summary.summary,
      sourceAnchorIds: summary.sourceAnchorIds,
      nonActionable: true,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
    }) satisfies ReviewObservationCitationDeferredBoundaryView);
  const deferredBoundaryCitationBySummaryId = new Map(
    deferredBoundaryCitations.map((citation) => [
      citation.sourceSummaryId,
      citation,
    ]),
  );
  const phaseCoverageByWorkflowGroup = new Map(
    sourceObservationCoverage.phaseCoverageRows.map((row) => [
      row.workflowGroup,
      row,
    ]),
  );
  const sourceStageCoverageByStageNumber = new Map(
    sourceObservationCoverage.sourceStageCoverageRows.map((row) => [
      row.sourceStageNumber,
      row,
    ]),
  );
  const citationRows = observationRows.map((row) =>
    buildCitationRow(
      row,
      phaseCoverageByWorkflowGroup.get(row.workflowGroup)?.phaseRowId,
      sourceStageCoverageByStageNumber.get(row.sourceStageNumber)
        ?.sourceStageRowId,
      countSignalCitationBySignalId,
      deferredBoundaryCitationBySummaryId,
    ),
  );
  const citationByObservationRowId = new Map(
    citationRows.map((row) => [row.sourceObservationRowId, row]),
  );
  const citationRowsByAnchorId = groupCitationRowsByAnchorId(citationRows);
  const sourceMapRows = sourceObservationCoverage.sourceStageCoverageRows.map(
    (sourceStageRow) =>
      buildSourceMapRow(
        sourceStageRow,
        citationRows.filter(
          (row) => row.sourceStageNumber === sourceStageRow.sourceStageNumber,
        ),
      ),
  );
  const phaseCitationGroups =
    sourceObservationCoverage.phaseCoverageRows.map((phaseRow) =>
      buildPhaseCitationGroup(
        phaseRow,
        phaseRow.observationRowIds
          .map((rowId) => citationByObservationRowId.get(rowId))
          .filter((row): row is ReviewObservationCitationRowView => Boolean(row)),
      ),
    );
  const anchorCitationGroups = sourceObservationLens.anchorReferences.map(
    (anchor) => {
      const rows = citationRowsByAnchorId.get(anchor.anchorId) ?? [];
      return {
        anchorCitationGroupId: `review-observation-citation-anchor:${anchor.anchorId}`,
        anchorId: anchor.anchorId,
        href: anchor.href,
        label: anchor.label,
        citationRowIds: rows.map((row) => row.citationRowId),
        sourceStageNumbers: uniqueNumbers(
          rows.map((row) => row.sourceStageNumber),
        ),
        localOnly: true,
        inPageOnly: true,
        informationalOnly: true,
        nonPersistent: true,
        nonExecutable: true,
      } satisfies ReviewObservationCitationAnchorGroupView;
    },
  );
  const blindSpotCitationNotes = sourceObservationCoverage.blindSpotRows.map(
    (row) => ({
      citationNoteId: `review-observation-citation-blind-spot:${row.kind}`,
      sourceBlindSpotRowId: row.blindSpotRowId,
      kind: row.kind,
      label: row.label,
      summary: row.summary,
      sourceObservationRowIds: row.sourceObservationRowIds,
      sourceAnchorIds: row.sourceAnchorIds,
      sourceDeferredBoundarySummaryIds: row.sourceDeferredBoundarySummaryIds,
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
    }),
  );

  return {
    schema: "telemforge.review_observation_citations.v1",
    version: 1,
    contractLabel:
      "local deterministic observation citation trail and source map",
    localStatus: sourceObservationCoverage.localStatus,
    summary: {
      citationTrailId: "candidate-local-review-observation-citation-trail",
      label: "Local observation citation trail",
      summary:
        "A static source map traces each Stage 33 observation coverage row through its source stage, local anchor, count signals, and deferred-boundary references without saved citation state.",
      defaultCitationRowId: citationRows[0].citationRowId,
      defaultSourceMapRowId: sourceMapRows[0].sourceMapRowId,
      defaultPhaseCitationGroupId:
        phaseCitationGroups[0].phaseCitationGroupId,
      informationalOnly: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        citationRowCount: citationRows.length,
        sourceMapRowCount: sourceMapRows.length,
        phaseCitationGroupCount: phaseCitationGroups.length,
        anchorCitationGroupCount: anchorCitationGroups.length,
        countSignalCitationCount: countSignalCitations.length,
        deferredBoundaryCitationCount: deferredBoundaryCitations.length,
        blindSpotCitationNoteCount: blindSpotCitationNotes.length,
      },
    },
    citationRows,
    sourceMapRows,
    phaseCitationGroups,
    anchorCitationGroups,
    countSignalCitations,
    deferredBoundaryCitations,
    blindSpotCitationNotes,
    staticCitationSummary:
      "Stage 34 citations are local, static, source-backed, non-persistent, non-executable, non-ranking, and non-certifying; they do not save citation selections, store observations, assign owners, run commands, export reports, score proofs, certify readiness, or add routes.",
    sourceObservationCoverage,
  };
}

function buildCitationRow(
  row: ReviewObservationRowView,
  sourceCoveragePhaseRowId: string | undefined,
  sourceCoverageStageRowId: string | undefined,
  countSignalCitationBySignalId: Map<
    string,
    ReviewObservationCitationCountSignalView
  >,
  deferredBoundaryCitationBySummaryId: Map<
    string,
    ReviewObservationCitationDeferredBoundaryView
  >,
): ReviewObservationCitationRowView {
  return {
    citationRowId: `review-observation-citation:${row.observationRowId}`,
    sourceObservationRowId: row.observationRowId,
    sourceCoveragePhaseRowId:
      sourceCoveragePhaseRowId ??
      `review-observation-coverage-phase:${row.workflowGroup}`,
    sourceCoverageStageRowId:
      sourceCoverageStageRowId ??
      `review-observation-coverage-source-stage:${row.sourceStageNumber}`,
    observationNumber: row.observationNumber,
    workflowGroup: row.workflowGroup,
    sourceStageNumber: row.sourceStageNumber,
    label: row.label,
    sourceSchema: row.sourceSchema,
    sourceContractLabel: row.sourceContractLabel,
    sourceReferenceId: row.sourceReferenceId,
    localAnchor: {
      anchorId: row.anchor.anchorId,
      href: row.anchor.href,
      label: row.anchor.label,
      inPageOnly: true,
    },
    countSignalCitationIds: row.countSignalIds
      .map((signalId) => countSignalCitationBySignalId.get(signalId)?.citationId)
      .filter((citationId): citationId is string => Boolean(citationId)),
    countSignalSourcePaths: row.countSignalIds
      .map((signalId) => countSignalCitationBySignalId.get(signalId)?.sourcePath)
      .filter((sourcePath): sourcePath is string => Boolean(sourcePath)),
    deferredBoundaryCitationIds: row.deferredBoundarySummaryIds
      .map(
        (summaryId) =>
          deferredBoundaryCitationBySummaryId.get(summaryId)?.citationId,
      )
      .filter((citationId): citationId is string => Boolean(citationId)),
    deferredBoundarySummaryIds: row.deferredBoundarySummaryIds,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function buildSourceMapRow(
  sourceStageRow: ReviewObservationCoverageView["sourceStageCoverageRows"][number],
  citationRows: ReviewObservationCitationRowView[],
): ReviewObservationCitationSourceMapRowView {
  return {
    sourceMapRowId: `review-observation-citation-source-map:${sourceStageRow.sourceStageNumber}`,
    sourceCoverageStageRowId: sourceStageRow.sourceStageRowId,
    sourceStageNumber: sourceStageRow.sourceStageNumber,
    label: sourceStageRow.label,
    workflowGroups: sourceStageRow.workflowGroups,
    sourceSchemas: sourceStageRow.sourceSchemas,
    sourceContractLabels: sourceStageRow.sourceContractLabels,
    citationRowIds: citationRows.map((row) => row.citationRowId),
    anchorHrefs: unique(citationRows.map((row) => row.localAnchor.href)),
    countSignalSourcePaths: unique(
      citationRows.flatMap((row) => row.countSignalSourcePaths),
    ),
    deferredBoundarySummaryIds: sourceStageRow.deferredBoundarySummaryIds,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function buildPhaseCitationGroup(
  phaseRow: ReviewObservationCoverageView["phaseCoverageRows"][number],
  citationRows: ReviewObservationCitationRowView[],
): ReviewObservationCitationPhaseGroupView {
  return {
    phaseCitationGroupId: `review-observation-citation-phase:${phaseRow.workflowGroup}`,
    sourceCoveragePhaseRowId: phaseRow.phaseRowId,
    workflowGroup: phaseRow.workflowGroup,
    order: phaseRow.order,
    label: phaseRow.label,
    citationRowIds: citationRows.map((row) => row.citationRowId),
    sourceStageNumbers: phaseRow.sourceStageNumbers,
    anchorIds: phaseRow.anchorIds,
    countSignalCitationIds: citationRows.flatMap(
      (row) => row.countSignalCitationIds,
    ),
    deferredBoundaryCitationIds: citationRows.flatMap(
      (row) => row.deferredBoundaryCitationIds,
    ),
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function groupCitationRowsByAnchorId(
  citationRows: ReviewObservationCitationRowView[],
): Map<string, ReviewObservationCitationRowView[]> {
  const rowsByAnchorId = new Map<string, ReviewObservationCitationRowView[]>();
  for (const row of citationRows) {
    rowsByAnchorId.set(row.localAnchor.anchorId, [
      ...(rowsByAnchorId.get(row.localAnchor.anchorId) ?? []),
      row,
    ]);
  }
  return rowsByAnchorId;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)];
}
