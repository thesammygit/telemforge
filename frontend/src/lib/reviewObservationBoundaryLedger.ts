import type {
  ReviewObservationBoundaryAnchorGroupView,
  ReviewObservationBoundaryLedgerRowView,
  ReviewObservationBoundaryLedgerView,
  ReviewObservationBoundaryObservationGroupView,
  ReviewObservationBoundarySourceStageGroupView,
  ReviewObservationBoundaryStaticNonGoalNoteView,
  ReviewObservationCitationDeferredBoundaryView,
  ReviewObservationCitationRowView,
  ReviewObservationCitationTrailView,
} from "../features/mission-console/types.ts";

export function buildReviewObservationBoundaryLedger(
  sourceObservationCitations: ReviewObservationCitationTrailView | undefined,
): ReviewObservationBoundaryLedgerView | undefined {
  if (
    !sourceObservationCitations?.citationRows.length ||
    !sourceObservationCitations.deferredBoundaryCitations.length
  ) {
    return undefined;
  }

  const citationRowByObservationRowId = new Map(
    sourceObservationCitations.citationRows.map((row) => [
      row.sourceObservationRowId,
      row,
    ]),
  );
  const anchorCitationGroupByAnchorId = new Map(
    sourceObservationCitations.anchorCitationGroups.map((group) => [
      group.anchorId,
      group,
    ]),
  );
  const boundaryRows =
    sourceObservationCitations.deferredBoundaryCitations.map((citation) =>
      buildBoundaryRow(
        citation,
        citationRowByObservationRowId,
        anchorCitationGroupByAnchorId,
        sourceObservationCitations.blindSpotCitationNotes,
      ),
    );
  const boundaryRowBySourceSummaryId = new Map(
    boundaryRows.map((row) => [row.sourceSummaryId, row]),
  );
  const boundaryRowsByAnchorId = groupBoundaryRowsByAnchorId(boundaryRows);
  const observationReferenceGroups =
    sourceObservationCitations.citationRows.map((row) =>
      buildObservationReferenceGroup(row, boundaryRowBySourceSummaryId),
    );
  const anchorReferenceGroups =
    sourceObservationCitations.anchorCitationGroups
      .map((group) => {
        const rows = boundaryRowsByAnchorId.get(group.anchorId) ?? [];
        if (!rows.length) {
          return undefined;
        }

        return {
          anchorGroupId: `review-observation-boundary-anchor:${group.anchorId}`,
          sourceAnchorCitationGroupId: group.anchorCitationGroupId,
          anchorId: group.anchorId,
          href: group.href,
          label: group.label,
          boundaryRowIds: rows.map((row) => row.boundaryRowId),
          relatedObservationRowIds: unique(
            rows.flatMap((row) => row.relatedObservationRowIds),
          ),
          relatedSourceStageNumbers: uniqueNumbers(
            rows.flatMap((row) => row.relatedSourceStageNumbers),
          ),
          localOnly: true,
          inPageOnly: true,
          informationalOnly: true,
          nonActionable: true,
          nonPersistent: true,
          nonExecutable: true,
        } satisfies ReviewObservationBoundaryAnchorGroupView;
      })
      .filter(
        (group): group is ReviewObservationBoundaryAnchorGroupView =>
          Boolean(group),
      );
  const sourceStageBoundaryGroups =
    sourceObservationCitations.sourceMapRows
      .map((row) => {
        const rows = row.deferredBoundarySummaryIds
          .map((summaryId) => boundaryRowBySourceSummaryId.get(summaryId))
          .filter(
            (boundaryRow): boundaryRow is ReviewObservationBoundaryLedgerRowView =>
              Boolean(boundaryRow),
          );
        if (!rows.length) {
          return undefined;
        }

        return {
          sourceStageGroupId: `review-observation-boundary-source-stage:${row.sourceStageNumber}`,
          sourceMapRowId: row.sourceMapRowId,
          sourceStageNumber: row.sourceStageNumber,
          label: row.label,
          sourceSchemas: row.sourceSchemas,
          sourceContractLabels: row.sourceContractLabels,
          boundaryRowIds: rows.map((boundaryRow) => boundaryRow.boundaryRowId),
          relatedObservationRowIds: unique(
            rows.flatMap((boundaryRow) => boundaryRow.relatedObservationRowIds),
          ),
          anchorHrefs: row.anchorHrefs,
          localOnly: true,
          sourceBacked: true,
          informationalOnly: true,
          nonActionable: true,
          nonPersistent: true,
          nonExecutable: true,
          nonCertifying: true,
          nonRanking: true,
        } satisfies ReviewObservationBoundarySourceStageGroupView;
      })
      .filter(
        (group): group is ReviewObservationBoundarySourceStageGroupView =>
          Boolean(group),
      );
  const staticNonGoalNotes =
    sourceObservationCitations.blindSpotCitationNotes.map((note) => ({
      nonGoalNoteId: buildStaticNonGoalNoteId(note.citationNoteId),
      sourceBlindSpotCitationNoteId: note.citationNoteId,
      kind: note.kind,
      label: note.label,
      summary: note.summary,
      relatedBoundaryRowIds: note.sourceDeferredBoundarySummaryIds
        .map((summaryId) => boundaryRowBySourceSummaryId.get(summaryId)?.boundaryRowId)
        .filter((rowId): rowId is string => Boolean(rowId)),
      sourceObservationRowIds: note.sourceObservationRowIds,
      sourceAnchorIds: note.sourceAnchorIds,
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
    })) satisfies ReviewObservationBoundaryStaticNonGoalNoteView[];

  return {
    schema: "telemforge.review_observation_boundary_ledger.v1",
    version: 1,
    contractLabel:
      "local deterministic deferred-boundary ledger and static non-goal map",
    localStatus: sourceObservationCitations.localStatus,
    summary: {
      ledgerId: "candidate-local-review-observation-boundary-ledger",
      label: "Local deferred-boundary ledger",
      summary:
        "A static ledger maps Stage 34 deferred-boundary citations to local observations, anchors, source stages, and non-goal notes without saved boundary state.",
      defaultBoundaryRowId: boundaryRows[0].boundaryRowId,
      defaultObservationReferenceGroupId:
        observationReferenceGroups[0].observationGroupId,
      defaultAnchorReferenceGroupId: anchorReferenceGroups[0].anchorGroupId,
      defaultSourceStageBoundaryGroupId:
        sourceStageBoundaryGroups[0].sourceStageGroupId,
      informationalOnly: true,
      nonActionable: true,
      nonPersistent: true,
      nonExecutable: true,
      nonCertifying: true,
      nonRanking: true,
      counts: {
        boundaryRowCount: boundaryRows.length,
        observationReferenceGroupCount: observationReferenceGroups.length,
        anchorReferenceGroupCount: anchorReferenceGroups.length,
        sourceStageBoundaryGroupCount: sourceStageBoundaryGroups.length,
        staticNonGoalNoteCount: staticNonGoalNotes.length,
        sourceCitationRowCount: sourceObservationCitations.citationRows.length,
      },
    },
    boundaryRows,
    observationReferenceGroups,
    anchorReferenceGroups,
    sourceStageBoundaryGroups,
    staticNonGoalNotes,
    staticBoundarySummary:
      "Stage 35 boundary ledger rows are local, static, source-backed, non-actionable, non-persistent, non-executable, non-ranking, and non-certifying; they do not save boundary selections, assign owners, launch tasks, run commands, export reports, score proofs, certify readiness, or add routes.",
    sourceObservationCitations,
  };
}

function buildBoundaryRow(
  citation: ReviewObservationCitationDeferredBoundaryView,
  citationRowByObservationRowId: Map<string, ReviewObservationCitationRowView>,
  anchorCitationGroupByAnchorId: Map<
    string,
    ReviewObservationCitationTrailView["anchorCitationGroups"][number]
  >,
  blindSpotCitationNotes: ReviewObservationCitationTrailView["blindSpotCitationNotes"],
): ReviewObservationBoundaryLedgerRowView {
  const relatedCitationRows = citation.sourceObservationRowIds
    .map((rowId) => citationRowByObservationRowId.get(rowId))
    .filter((row): row is ReviewObservationCitationRowView => Boolean(row));

  return {
    boundaryRowId: `review-observation-boundary-ledger:${citation.sourceSummaryId}`,
    sourceBoundaryCitationId: citation.citationId,
    sourceSummaryId: citation.sourceSummaryId,
    label: citation.label,
    sourceSummary: citation.summaryReference,
    sourceAnchorIds: citation.sourceAnchorIds,
    sourceAnchorHrefs: citation.sourceAnchorIds.map(
      (anchorId) => anchorCitationGroupByAnchorId.get(anchorId)?.href ?? `#${anchorId}`,
    ),
    relatedObservationRowIds: citation.sourceObservationRowIds,
    relatedCitationRowIds: relatedCitationRows.map((row) => row.citationRowId),
    relatedSourceStageNumbers: uniqueNumbers(
      relatedCitationRows.map((row) => row.sourceStageNumber),
    ),
    staticNonGoalNoteIds: blindSpotCitationNotes
      .filter((note) =>
        note.sourceDeferredBoundarySummaryIds.includes(citation.sourceSummaryId),
      )
      .map((note) => buildStaticNonGoalNoteId(note.citationNoteId)),
    localOnly: true,
    sourceBacked: true,
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

function buildObservationReferenceGroup(
  row: ReviewObservationCitationRowView,
  boundaryRowBySourceSummaryId: Map<string, ReviewObservationBoundaryLedgerRowView>,
): ReviewObservationBoundaryObservationGroupView {
  const boundaryRows = row.deferredBoundarySummaryIds
    .map((summaryId) => boundaryRowBySourceSummaryId.get(summaryId))
    .filter(
      (boundaryRow): boundaryRow is ReviewObservationBoundaryLedgerRowView =>
        Boolean(boundaryRow),
    );

  return {
    observationGroupId: `review-observation-boundary-observation:${row.sourceObservationRowId}`,
    sourceCitationRowId: row.citationRowId,
    sourceObservationRowId: row.sourceObservationRowId,
    observationNumber: row.observationNumber,
    label: row.label,
    workflowGroup: row.workflowGroup,
    sourceStageNumber: row.sourceStageNumber,
    localAnchor: row.localAnchor,
    boundaryRowIds: boundaryRows.map((boundaryRow) => boundaryRow.boundaryRowId),
    sourceSummaryIds: row.deferredBoundarySummaryIds,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonActionable: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
    nonRanking: true,
  };
}

function groupBoundaryRowsByAnchorId(
  boundaryRows: ReviewObservationBoundaryLedgerRowView[],
): Map<string, ReviewObservationBoundaryLedgerRowView[]> {
  const rowsByAnchorId = new Map<string, ReviewObservationBoundaryLedgerRowView[]>();
  for (const row of boundaryRows) {
    for (const anchorId of row.sourceAnchorIds) {
      rowsByAnchorId.set(anchorId, [
        ...(rowsByAnchorId.get(anchorId) ?? []),
        row,
      ]);
    }
  }
  return rowsByAnchorId;
}

function buildStaticNonGoalNoteId(citationNoteId: string): string {
  return citationNoteId.replace(
    "review-observation-citation-blind-spot:",
    "review-observation-boundary-non-goal:",
  );
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)];
}
