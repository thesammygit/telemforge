import type {
  ReviewProofNavigatorDeferredBoundaryMarkerView,
  ReviewProofNavigatorLaneKind,
  ReviewProofNavigatorLaneView,
  ReviewProofNavigatorRowView,
  ReviewProofNavigatorSourceCrosswalkRowView,
  ReviewProofNavigatorStaticCommandReferenceView,
  ReviewProofNavigatorStaticInspectionPromptView,
  ReviewProofNavigatorSummaryView,
  ReviewProofNavigatorView,
  ReviewProofPacketRowView,
  ReviewProofPacketStaticCommandReferenceView,
  ReviewProofPacketView,
  ReviewProofPriorityRowStatus,
} from "../features/mission-console/types.ts";

type LaneDefinition = {
  laneKind: ReviewProofNavigatorLaneKind;
  order: number;
  label: string;
  summary: string;
};

const laneDefinitions: Record<ReviewProofPriorityRowStatus, LaneDefinition> = {
  unresolved_local_proof_gap: {
    laneKind: "local_proof_gap",
    order: 1,
    label: "Local proof gaps",
    summary:
      "Unresolved local proof gap packets are reviewed first because they still need static human inspection.",
  },
  ready_local_evidence: {
    laneKind: "ready_local_evidence",
    order: 2,
    label: "Ready local evidence",
    summary:
      "Ready local evidence packets are reviewed after unresolved gaps and remain informational.",
  },
  deferred_production_scope: {
    laneKind: "deferred_production_scope",
    order: 3,
    label: "Deferred production scope",
    summary:
      "Deferred production scope packets stay visible for boundary awareness and remain non-actionable.",
  },
};

const orderedLaneDefinitions: LaneDefinition[] = [
  laneDefinitions.unresolved_local_proof_gap,
  laneDefinitions.ready_local_evidence,
  laneDefinitions.deferred_production_scope,
];

const stage28ProofCommand = {
  commandId: "review-proof-navigator",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewProofNavigator.test.ts",
  label: "Stage 28 proof navigator test",
  purpose:
    "Proves the local proof navigator and source crosswalk are derived from Stage 27 proof packet rows.",
};

export function buildReviewProofNavigator(
  reviewProofPacket: ReviewProofPacketView | undefined,
): ReviewProofNavigatorView | undefined {
  if (!reviewProofPacket?.packets.length) {
    return undefined;
  }

  const navigatorRows = reviewProofPacket.packets
    .map((packet) => buildNavigatorRow(packet, reviewProofPacket))
    .sort(compareNavigatorRows)
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const defaultNavigatorRow =
    navigatorRows.find(
      (row) => row.packetId === reviewProofPacket.summary.defaultPacketId,
    ) ?? navigatorRows[0];
  const reviewLanes = buildReviewLanes(navigatorRows);
  const packetById = new Map(
    reviewProofPacket.packets.map((packet) => [packet.packetId, packet]),
  );
  const sourceCrosswalkRows = navigatorRows.map((row) =>
    buildSourceCrosswalkRow(row, packetById.get(row.packetId) ?? reviewProofPacket.defaultPacket),
  );
  const staticInspectionPrompts = navigatorRows.map((row) =>
    buildStaticInspectionPrompt(
      row,
      packetById.get(row.packetId) ?? reviewProofPacket.defaultPacket,
    ),
  );
  const deferredBoundaryMarkers = navigatorRows.flatMap((row) =>
    buildDeferredBoundaryMarkers(
      row,
      packetById.get(row.packetId) ?? reviewProofPacket.defaultPacket,
    ),
  );
  const staticCommandReferences = buildStaticCommandReferences(
    navigatorRows,
    reviewProofPacket.proofCommandReferences,
  );
  const counts = buildCounts(
    navigatorRows,
    reviewLanes,
    sourceCrosswalkRows,
    staticInspectionPrompts,
    staticCommandReferences,
    deferredBoundaryMarkers,
  );

  return {
    schema: "telemforge.review_proof_navigator.v1",
    version: 1,
    contractLabel: "local deterministic review proof navigator and source crosswalk",
    localStatus: reviewProofPacket.localStatus,
    summary: {
      navigatorId: "candidate-local-review-proof-navigator",
      label: "Local proof navigator",
      summary: summaryText(counts),
      defaultNavigatorRowId: defaultNavigatorRow.navigatorRowId,
      defaultPacketId: defaultNavigatorRow.packetId,
      defaultLaneId: `proof-navigator-lane:${defaultNavigatorRow.laneKind}`,
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    navigatorRows,
    defaultNavigatorRow,
    reviewLanes,
    sourceCrosswalkRows,
    staticInspectionPrompts,
    staticCommandReferences,
    deferredBoundaryMarkers,
    staticNavigatorSummary:
      "Stage 28 proof navigator rows, source crosswalks, prompts, and command references are static, local, non-executable, informational, and non-certifying; the mission console does not save navigator selections, store reviewer progress, run commands, or export handoff reports.",
    sourceProofPacket: reviewProofPacket,
  };
}

function buildNavigatorRow(
  packet: ReviewProofPacketRowView,
  reviewProofPacket: ReviewProofPacketView,
): ReviewProofNavigatorRowView {
  const laneDefinition = laneDefinitions[packet.status];
  const navigatorRowId = `proof-navigator:${packet.packetId}`;
  const staticHumanGateStepIds = packet.staticHumanGateSteps.map(
    (step) => step.gateStepId,
  );

  return {
    navigatorRowId,
    rank: packet.rank,
    laneKind: laneDefinition.laneKind,
    laneLabel: laneDefinition.label,
    laneSummary: laneDefinition.summary,
    packetId: packet.packetId,
    packetRank: packet.rank,
    packetStatus: packet.status,
    priority: packet.priority,
    actionability: packet.actionability,
    label: packet.label,
    summary: packet.summary,
    sourcePriorityRowId: packet.sourcePriorityRowId,
    sourceCoverageRowIds: packet.sourceCoverageRowIds,
    sourceTraceRowIds: packet.sourceTraceRowIds,
    sourceOutcomeRowIds: packet.sourceOutcomeRowIds,
    sourceReadinessRowIds: packet.sourceReadinessRowIds,
    sourceResolutionIds: packet.sourceResolutionIds,
    sourceMatrixRowIds: packet.sourceMatrixRowIds,
    sourceActionIds: packet.sourceActionIds,
    evidenceTargetIds: packet.evidenceTargetIds,
    proofBucketLabels: packet.proofBucketLabels,
    proofCommandIds: packet.proofCommandIds,
    staticHumanGateStepIds,
    sourceStaticReviewStepIds: packet.staticReviewStepIds,
    deferredBoundaryMarkerIds: packet.deferredBoundaryContext.map(
      (boundary) => `proof-navigator-boundary:${navigatorRowId}:${boundary.boundaryId}`,
    ),
    defaultRow: packet.packetId === reviewProofPacket.summary.defaultPacketId,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildReviewLanes(
  rows: ReviewProofNavigatorRowView[],
): ReviewProofNavigatorLaneView[] {
  return orderedLaneDefinitions.map((definition) => {
    const laneRows = rows.filter((row) => row.laneKind === definition.laneKind);

    return {
      laneId: `proof-navigator-lane:${definition.laneKind}`,
      laneKind: definition.laneKind,
      order: definition.order,
      label: definition.label,
      summary: definition.summary,
      rowCount: laneRows.length,
      navigatorRowIds: laneRows.map((row) => row.navigatorRowId),
      firstNavigatorRowId: laneRows[0]?.navigatorRowId ?? null,
      localOnly: true,
      informationalOnly: true,
      nonCertifying: true,
    };
  });
}

function buildSourceCrosswalkRow(
  row: ReviewProofNavigatorRowView,
  packet: ReviewProofPacketRowView,
): ReviewProofNavigatorSourceCrosswalkRowView {
  return {
    crosswalkRowId: `proof-navigator-crosswalk:${row.navigatorRowId}`,
    navigatorRowId: row.navigatorRowId,
    packetId: row.packetId,
    label: row.label,
    summary:
      "Packet, priority, coverage, trace, readiness, resolution, action, target, proof command, and static gate ids are preserved for local inspection.",
    laneKind: row.laneKind,
    packetStatus: row.packetStatus,
    sourcePriorityRowId: row.sourcePriorityRowId,
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    sourceReadinessRowIds: row.sourceReadinessRowIds,
    sourceResolutionIds: row.sourceResolutionIds,
    sourceMatrixRowIds: row.sourceMatrixRowIds,
    sourceActionIds: row.sourceActionIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofBucketLabels: row.proofBucketLabels,
    proofCommandIds: row.proofCommandIds,
    staticHumanGateStepIds: row.staticHumanGateStepIds,
    sourceStaticReviewStepIds: row.sourceStaticReviewStepIds,
    repoRelativeReferences: unique([
      "frontend/src/lib/reviewProofNavigator.ts",
      "frontend/src/lib/reviewProofPacket.ts",
      ...packet.staticHumanGateSteps.map((step) => step.repoRelativeReference),
      ...packet.staticCommandReferences.map(
        (command) => command.repoRelativeReference,
      ),
    ]),
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildStaticInspectionPrompt(
  row: ReviewProofNavigatorRowView,
  packet: ReviewProofPacketRowView,
): ReviewProofNavigatorStaticInspectionPromptView {
  return {
    promptId: `proof-navigator-prompt:${row.navigatorRowId}:inspect-static-source-crosswalk`,
    kind: "inspect_static_source_crosswalk",
    label: `Inspect ${row.label}`,
    summary:
      "Compare the navigator row, source crosswalk, static human gate steps, and deferred markers as local source-backed references only.",
    navigatorRowIds: [row.navigatorRowId],
    packetIds: [row.packetId],
    repoRelativeReferences: unique([
      "frontend/src/lib/reviewProofNavigator.ts",
      "frontend/src/features/mission-console/MissionConsole.tsx",
      "tests/frontend/reviewProofNavigator.test.ts",
      ...packet.staticHumanGateSteps.map((step) => step.repoRelativeReference),
    ]),
    sourcePriorityRowIds: [row.sourcePriorityRowId],
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofCommandIds: row.proofCommandIds,
    staticHumanGateStepIds: row.staticHumanGateStepIds,
    localOnly: true,
    sourceBacked: true,
    staticOnly: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildDeferredBoundaryMarkers(
  row: ReviewProofNavigatorRowView,
  packet: ReviewProofPacketRowView,
): ReviewProofNavigatorDeferredBoundaryMarkerView[] {
  return packet.deferredBoundaryContext.map((boundary) => ({
    markerId: `proof-navigator-boundary:${row.navigatorRowId}:${boundary.boundaryId}`,
    navigatorRowId: row.navigatorRowId,
    packetId: row.packetId,
    label: boundary.label,
    summary: boundary.summary,
    sourcePriorityRowIds: boundary.sourcePriorityRowIds,
    sourceCoverageRowIds: boundary.sourceCoverageRowIds,
    sourceTraceRowIds: boundary.sourceTraceRowIds,
    sourceOutcomeRowIds: boundary.sourceOutcomeRowIds,
    evidenceTargetIds: boundary.evidenceTargetIds,
    actionability: "deferred_non_actionable",
    nonActionable: true,
    nonCertifying: true,
  }));
}

function buildStaticCommandReferences(
  rows: ReviewProofNavigatorRowView[],
  sourceReferences: ReviewProofPacketStaticCommandReferenceView[],
): ReviewProofNavigatorStaticCommandReferenceView[] {
  const stage28Reference: ReviewProofNavigatorStaticCommandReferenceView = {
    ...stage28ProofCommand,
    repoRelativeReference: "tests/frontend/reviewProofNavigator.test.ts",
    source: "stage28_navigator",
    navigatorRowIds: rows.map((row) => row.navigatorRowId),
    packetIds: rows.map((row) => row.packetId),
    sourcePriorityRowIds: rows.map((row) => row.sourcePriorityRowId),
    sourceCoverageRowIds: unique(rows.flatMap((row) => row.sourceCoverageRowIds)),
    sourceTraceRowIds: unique(rows.flatMap((row) => row.sourceTraceRowIds)),
    sourceOutcomeRowIds: unique(rows.flatMap((row) => row.sourceOutcomeRowIds)),
    evidenceTargetIds: unique(rows.flatMap((row) => row.evidenceTargetIds)),
    proofBucketLabels: unique(rows.flatMap((row) => row.proofBucketLabels)),
    staticHumanGateStepIds: unique(
      rows.flatMap((row) => row.staticHumanGateStepIds),
    ),
    localOnly: true,
    staticOnly: true,
    nonExecutable: true,
  };

  return [
    stage28Reference,
    ...sourceReferences.map((reference) => {
      const sourceRows = rows.filter((row) => commandReferenceMatchesRow(reference, row));

      return {
        commandId: reference.commandId,
        command: reference.command,
        label: reference.label,
        purpose: reference.purpose,
        repoRelativeReference: reference.repoRelativeReference,
        source: reference.source,
        navigatorRowIds: sourceRows.map((row) => row.navigatorRowId),
        packetIds: sourceRows.map((row) => row.packetId),
        sourcePriorityRowIds: reference.sourcePriorityRowIds,
        sourceCoverageRowIds: reference.sourceCoverageRowIds,
        sourceTraceRowIds: reference.sourceTraceRowIds,
        sourceOutcomeRowIds: reference.sourceOutcomeRowIds,
        evidenceTargetIds: reference.evidenceTargetIds,
        proofBucketLabels: reference.proofBucketLabels,
        staticHumanGateStepIds: unique(
          sourceRows.flatMap((row) => row.staticHumanGateStepIds),
        ),
        localOnly: true,
        staticOnly: true,
        nonExecutable: true,
      };
    }),
  ];
}

function commandReferenceMatchesRow(
  reference: ReviewProofPacketStaticCommandReferenceView,
  row: ReviewProofNavigatorRowView,
): boolean {
  return (
    reference.sourcePriorityRowIds.includes(row.sourcePriorityRowId) ||
    intersects(reference.sourceCoverageRowIds, row.sourceCoverageRowIds) ||
    intersects(reference.sourceTraceRowIds, row.sourceTraceRowIds) ||
    intersects(reference.sourceOutcomeRowIds, row.sourceOutcomeRowIds) ||
    intersects(reference.evidenceTargetIds, row.evidenceTargetIds)
  );
}

function buildCounts(
  rows: ReviewProofNavigatorRowView[],
  lanes: ReviewProofNavigatorLaneView[],
  crosswalkRows: ReviewProofNavigatorSourceCrosswalkRowView[],
  prompts: ReviewProofNavigatorStaticInspectionPromptView[],
  commandReferences: ReviewProofNavigatorStaticCommandReferenceView[],
  deferredMarkers: ReviewProofNavigatorDeferredBoundaryMarkerView[],
): ReviewProofNavigatorSummaryView["counts"] {
  return {
    totalNavigatorRowCount: rows.length,
    localProofGapNavigatorRowCount: rows.filter(
      (row) => row.laneKind === "local_proof_gap",
    ).length,
    readyLocalEvidenceNavigatorRowCount: rows.filter(
      (row) => row.laneKind === "ready_local_evidence",
    ).length,
    deferredProductionNavigatorRowCount: rows.filter(
      (row) => row.laneKind === "deferred_production_scope",
    ).length,
    reviewLaneCount: lanes.length,
    sourceCrosswalkRowCount: crosswalkRows.length,
    staticInspectionPromptCount: prompts.length,
    staticCommandReferenceCount: commandReferences.length,
    deferredBoundaryMarkerCount: deferredMarkers.length,
    sourcePriorityRowCount: unique(rows.map((row) => row.sourcePriorityRowId))
      .length,
    sourceCoverageRowCount: unique(
      rows.flatMap((row) => row.sourceCoverageRowIds),
    ).length,
    sourceTraceRowCount: unique(rows.flatMap((row) => row.sourceTraceRowIds))
      .length,
    sourceOutcomeRowCount: unique(rows.flatMap((row) => row.sourceOutcomeRowIds))
      .length,
    sourceReadinessRowCount: unique(
      rows.flatMap((row) => row.sourceReadinessRowIds),
    ).length,
    sourceResolutionRowCount: unique(
      rows.flatMap((row) => row.sourceResolutionIds),
    ).length,
    sourceMatrixRowCount: unique(rows.flatMap((row) => row.sourceMatrixRowIds))
      .length,
    sourceActionCount: unique(rows.flatMap((row) => row.sourceActionIds)).length,
    evidenceTargetCount: unique(rows.flatMap((row) => row.evidenceTargetIds))
      .length,
    proofBucketCount: unique(rows.flatMap((row) => row.proofBucketLabels)).length,
    staticHumanGateStepCount: unique(
      rows.flatMap((row) => row.staticHumanGateStepIds),
    ).length,
  };
}

function summaryText(
  counts: ReviewProofNavigatorSummaryView["counts"],
): string {
  return `${counts.totalNavigatorRowCount} proof navigator rows order ${counts.localProofGapNavigatorRowCount} unresolved local proof gap packets before ${counts.readyLocalEvidenceNavigatorRowCount} ready local evidence packets and ${counts.deferredProductionNavigatorRowCount} deferred production scope packet.`;
}

function compareNavigatorRows(
  left: ReviewProofNavigatorRowView,
  right: ReviewProofNavigatorRowView,
): number {
  return (
    laneDefinitions[left.packetStatus].order -
      laneDefinitions[right.packetStatus].order ||
    left.packetRank - right.packetRank ||
    left.packetId.localeCompare(right.packetId)
  );
}

function intersects(left: string[], right: string[]): boolean {
  const rightValues = new Set(right);
  return left.some((value) => rightValues.has(value));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
