import type {
  ReviewProofPacketDeferredBoundaryContextView,
  ReviewProofPacketExpectedObservationView,
  ReviewProofPacketHumanGateStepView,
  ReviewProofPacketObservationKind,
  ReviewProofPacketRowView,
  ReviewProofPacketSectionKind,
  ReviewProofPacketSectionView,
  ReviewProofPacketStaticCommandReferenceView,
  ReviewProofPacketView,
  ReviewProofPriorityDeferredBoundaryContextView,
  ReviewProofPriorityProofCommandReferenceView,
  ReviewProofPriorityRowView,
  ReviewProofPriorityView,
} from "../features/mission-console/types.ts";

type PacketCounts = ReviewProofPacketView["summary"]["counts"];

type SourceCommandReference = {
  commandId: string;
  command: string;
  label: string;
  purpose: string;
  source: ReviewProofPacketStaticCommandReferenceView["source"];
};

const stage27ProofCommand: SourceCommandReference = {
  commandId: "review-proof-packet",
  command:
    "node --experimental-strip-types --test tests/frontend/reviewProofPacket.test.ts",
  label: "Stage 27 proof packet test",
  purpose:
    "Proves the local proof packet and static human test gate are derived from Stage 26 priority rows.",
  source: "stage27_proof_packet",
};

export function buildReviewProofPacket(
  reviewProofPriority: ReviewProofPriorityView | undefined,
): ReviewProofPacketView | undefined {
  if (!reviewProofPriority?.priorityRows.length) {
    return undefined;
  }

  const sourceCommands = uniqueSourceCommands([
    stage27ProofCommand,
    ...reviewProofPriority.proofCommandReferences.map(toSourceCommand),
  ]);
  const packets = reviewProofPriority.priorityRows
    .map((row) => buildProofPacket(row, reviewProofPriority, sourceCommands))
    .sort(comparePackets);
  const defaultPacket =
    packets.find(
      (packet) =>
        packet.sourcePriorityRowId ===
        reviewProofPriority.defaultPriorityRow.priorityRowId,
    ) ?? packets[0];
  const deferredBoundaryContexts = packets.flatMap(
    (packet) => packet.deferredBoundaryContext,
  );
  const counts = buildCounts(packets, deferredBoundaryContexts);

  return {
    schema: "telemforge.review_proof_packet.v1",
    version: 1,
    contractLabel:
      "local deterministic review proof packet and static human test gate",
    localStatus: reviewProofPriority.localStatus,
    summary: {
      packetSetId: "candidate-local-review-proof-packet",
      label: "Local proof packet gate",
      summary: summaryText(counts),
      defaultPacketId: defaultPacket.packetId,
      defaultPriorityRowId: defaultPacket.sourcePriorityRowId,
      defaultCoverageRowId: defaultPacket.sourceCoverageRowIds[0],
      defaultHumanGateStepId: defaultPacket.staticHumanGateSteps[0].gateStepId,
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    packets,
    defaultPacket,
    deferredBoundaryContexts,
    proofCommandReferences: mergeStaticCommandReferences(
      packets.flatMap((packet) => packet.staticCommandReferences),
    ),
    staticHumanGateSummary:
      "Stage 27 human gate steps are static, local, repo-relative, source-backed, and non-executable; the mission console does not save proof packet selections, store reviewer progress, run commands, or certify production readiness.",
    sourcePriority: reviewProofPriority,
  };
}

function buildProofPacket(
  row: ReviewProofPriorityRowView,
  reviewProofPriority: ReviewProofPriorityView,
  sourceCommands: SourceCommandReference[],
): ReviewProofPacketRowView {
  const packetId = `proof-packet:${row.priorityRowId}`;
  const sourceEvidenceChain = {
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
    staticReviewStepIds: row.staticReviewStepIds,
  };
  const sections = buildSections(packetId, row);
  const expectedObservations = buildExpectedObservations(packetId, row);
  const staticCommandReferences = buildStaticCommandReferences(
    packetId,
    row,
    sourceCommands,
  );
  const staticHumanGateSteps = buildHumanGateSteps(
    packetId,
    row,
    expectedObservations,
  );
  const deferredBoundaryContext = buildDeferredBoundaryContext(
    row,
    reviewProofPriority.deferredBoundaryContexts,
  );

  return {
    packetId,
    rank: row.rank,
    priority: row.priority,
    status: row.status,
    actionability: row.actionability,
    label: row.label,
    summary: row.summary,
    sourcePriorityRowId: row.priorityRowId,
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
    staticReviewStepIds: row.staticReviewStepIds,
    sourceEvidenceChain,
    sections,
    expectedObservations,
    staticHumanGateSteps,
    staticCommandReferences,
    deferredBoundaryContext,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildSections(
  packetId: string,
  row: ReviewProofPriorityRowView,
): ReviewProofPacketSectionView[] {
  return [
    buildSection(
      packetId,
      row,
      "source_evidence_chain",
      "Source evidence chain",
      "Coverage, trace, outcome, readiness, resolution, matrix, action, and evidence target ids are carried forward from the selected priority row.",
    ),
    buildSection(
      packetId,
      row,
      "expected_local_observations",
      "Expected local observations",
      "Observations describe what a reviewer should see locally and do not certify production readiness.",
    ),
    buildSection(
      packetId,
      row,
      "static_human_gate",
      "Static human gate",
      "Gate steps are repo-relative inspection references only and do not launch commands or store progress.",
    ),
    buildSection(
      packetId,
      row,
      "deferred_boundary_context",
      "Deferred boundary context",
      row.deferredBoundaryNotes.length
        ? "Deferred production boundaries stay visible and non-actionable inside the packet."
        : "No production boundary is actionable in this local packet.",
    ),
  ];
}

function buildSection(
  packetId: string,
  row: ReviewProofPriorityRowView,
  kind: ReviewProofPacketSectionKind,
  label: string,
  summary: string,
): ReviewProofPacketSectionView {
  return {
    sectionId: `proof-packet-section:${packetId}:${kind}`,
    kind,
    label,
    summary,
    sourcePriorityRowIds: [row.priorityRowId],
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    localOnly: true,
    staticOnly: true,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildExpectedObservations(
  packetId: string,
  row: ReviewProofPriorityRowView,
): ReviewProofPacketExpectedObservationView[] {
  return [
    buildExpectedObservation(
      packetId,
      row,
      "source_chain_visible",
      "Source chain is visible",
      "The packet shows the source coverage, trace, outcome, readiness, resolution, matrix, action, and evidence target ids for the priority row.",
    ),
    buildExpectedObservation(
      packetId,
      row,
      "priority_reason_visible",
      "Priority reason is visible",
      row.rankingSummary,
    ),
    buildExpectedObservation(
      packetId,
      row,
      "static_reference_visible",
      "Static references are visible",
      "The packet keeps proof command ids and static review step ids as local text references.",
    ),
    buildExpectedObservation(
      packetId,
      row,
      "deferred_boundary_visible",
      "Deferred boundary is visible",
      row.deferredBoundaryNotes.length
        ? row.deferredBoundaryNotes.join(" ")
        : "The packet has no actionable production boundary and remains informational.",
    ),
  ];
}

function buildExpectedObservation(
  packetId: string,
  row: ReviewProofPriorityRowView,
  kind: ReviewProofPacketObservationKind,
  label: string,
  summary: string,
): ReviewProofPacketExpectedObservationView {
  return {
    observationId: `proof-observation:${packetId}:${kind}`,
    kind,
    label,
    summary,
    sourcePriorityRowIds: [row.priorityRowId],
    sourceCoverageRowIds: row.sourceCoverageRowIds,
    sourceTraceRowIds: row.sourceTraceRowIds,
    sourceOutcomeRowIds: row.sourceOutcomeRowIds,
    evidenceTargetIds: row.evidenceTargetIds,
    proofBucketLabels: row.proofBucketLabels,
    staticReviewStepIds: row.staticReviewStepIds,
    localOnly: true,
    sourceBacked: true,
    informationalOnly: true,
    nonCertifying: true,
  };
}

function buildStaticCommandReferences(
  packetId: string,
  row: ReviewProofPriorityRowView,
  sourceCommands: SourceCommandReference[],
): ReviewProofPacketStaticCommandReferenceView[] {
  return unique(["review-proof-packet", ...row.proofCommandIds]).map(
    (proofCommandId) => {
      const command = sourceCommands.find(
        (reference) => reference.commandId === proofCommandId,
      );
      const commandText = command?.command ?? proofCommandId;

      return {
        commandId: proofCommandId,
        command: commandText,
        label: command?.label ?? proofCommandId,
        purpose:
          command?.purpose ??
          "Static proof reference carried forward from the source priority row.",
        repoRelativeReference: repoRelativeReference(commandText),
        source: command?.source ?? "unknown_static_reference",
        sourcePriorityRowIds: [row.priorityRowId],
        sourceCoverageRowIds: row.sourceCoverageRowIds,
        sourceTraceRowIds: row.sourceTraceRowIds,
        sourceOutcomeRowIds: row.sourceOutcomeRowIds,
        evidenceTargetIds: row.evidenceTargetIds,
        proofBucketLabels: row.proofBucketLabels,
        staticReviewStepIds: row.staticReviewStepIds,
        localOnly: true,
        staticOnly: true,
        nonExecutable: true,
      };
    },
  );
}

function buildHumanGateSteps(
  packetId: string,
  row: ReviewProofPriorityRowView,
  expectedObservations: ReviewProofPacketExpectedObservationView[],
): ReviewProofPacketHumanGateStepView[] {
  const observationIds = expectedObservations.map(
    (observation) => observation.observationId,
  );

  return [
    {
      gateStepId: `proof-gate-step:${packetId}:inspect-source-chain`,
      kind: "inspect_source_chain",
      label: "Inspect source evidence chain",
      summary:
        "Confirm the packet source ids match the selected Stage 26 priority row and Stage 25 coverage row.",
      repoRelativeReference: "frontend/src/lib/reviewProofPacket.ts",
      sourcePriorityRowIds: [row.priorityRowId],
      sourceCoverageRowIds: row.sourceCoverageRowIds,
      sourceTraceRowIds: row.sourceTraceRowIds,
      sourceOutcomeRowIds: row.sourceOutcomeRowIds,
      evidenceTargetIds: row.evidenceTargetIds,
      proofCommandIds: row.proofCommandIds,
      expectedObservationIds: observationIds,
      localOnly: true,
      sourceBacked: true,
      staticOnly: true,
      nonExecutable: true,
      nonCertifying: true,
    },
    {
      gateStepId: `proof-gate-step:${packetId}:compare-expected-observations`,
      kind: "compare_expected_observations",
      label: "Compare expected observations",
      summary:
        "Read the expected observations as local informational proof notes, not production certification.",
      repoRelativeReference: "tests/frontend/reviewProofPacket.test.ts",
      sourcePriorityRowIds: [row.priorityRowId],
      sourceCoverageRowIds: row.sourceCoverageRowIds,
      sourceTraceRowIds: row.sourceTraceRowIds,
      sourceOutcomeRowIds: row.sourceOutcomeRowIds,
      evidenceTargetIds: row.evidenceTargetIds,
      proofCommandIds: row.proofCommandIds,
      expectedObservationIds: observationIds,
      localOnly: true,
      sourceBacked: true,
      staticOnly: true,
      nonExecutable: true,
      nonCertifying: true,
    },
    {
      gateStepId: `proof-gate-step:${packetId}:confirm-non-executing-gate`,
      kind: "confirm_non_executing_gate",
      label: "Confirm non-executing gate",
      summary:
        "Confirm the mission console exposes static references without command controls, saved selections, progress state, signoff, or report export.",
      repoRelativeReference:
        "frontend/src/features/mission-console/MissionConsole.tsx",
      sourcePriorityRowIds: [row.priorityRowId],
      sourceCoverageRowIds: row.sourceCoverageRowIds,
      sourceTraceRowIds: row.sourceTraceRowIds,
      sourceOutcomeRowIds: row.sourceOutcomeRowIds,
      evidenceTargetIds: row.evidenceTargetIds,
      proofCommandIds: row.proofCommandIds,
      expectedObservationIds: observationIds,
      localOnly: true,
      sourceBacked: true,
      staticOnly: true,
      nonExecutable: true,
      nonCertifying: true,
    },
  ];
}

function buildDeferredBoundaryContext(
  row: ReviewProofPriorityRowView,
  contexts: ReviewProofPriorityDeferredBoundaryContextView[],
): ReviewProofPacketDeferredBoundaryContextView[] {
  return contexts
    .filter((context) => boundaryMatchesRow(context, row))
    .map((context) => ({
      boundaryId: `proof-packet-boundary:${context.boundaryId}`,
      label: context.label,
      summary: context.summary,
      sourcePriorityRowIds: [row.priorityRowId],
      sourceCoverageRowIds: context.sourceCoverageRowIds,
      sourceTraceRowIds: context.sourceTraceRowIds,
      sourceOutcomeRowIds: context.sourceOutcomeRowIds,
      evidenceTargetIds: context.evidenceTargetIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      nonCertifying: true,
    }));
}

function buildCounts(
  packets: ReviewProofPacketRowView[],
  deferredBoundaryContexts: ReviewProofPacketDeferredBoundaryContextView[],
): PacketCounts {
  return {
    totalPacketCount: packets.length,
    unresolvedLocalProofGapPacketCount: packets.filter(
      (packet) => packet.status === "unresolved_local_proof_gap",
    ).length,
    readyLocalEvidencePacketCount: packets.filter(
      (packet) => packet.status === "ready_local_evidence",
    ).length,
    deferredProductionScopePacketCount: packets.filter(
      (packet) => packet.status === "deferred_production_scope",
    ).length,
    sourcePriorityRowCount: unique(
      packets.map((packet) => packet.sourcePriorityRowId),
    ).length,
    sourceCoverageRowCount: unique(
      packets.flatMap((packet) => packet.sourceCoverageRowIds),
    ).length,
    sourceTraceRowCount: unique(
      packets.flatMap((packet) => packet.sourceTraceRowIds),
    ).length,
    sourceOutcomeRowCount: unique(
      packets.flatMap((packet) => packet.sourceOutcomeRowIds),
    ).length,
    sourceReadinessRowCount: unique(
      packets.flatMap((packet) => packet.sourceReadinessRowIds),
    ).length,
    sourceResolutionRowCount: unique(
      packets.flatMap((packet) => packet.sourceResolutionIds),
    ).length,
    sourceMatrixRowCount: unique(
      packets.flatMap((packet) => packet.sourceMatrixRowIds),
    ).length,
    sourceActionCount: unique(
      packets.flatMap((packet) => packet.sourceActionIds),
    ).length,
    evidenceTargetCount: unique(
      packets.flatMap((packet) => packet.evidenceTargetIds),
    ).length,
    proofBucketCount: unique(
      packets.flatMap((packet) => packet.proofBucketLabels),
    ).length,
    packetSectionCount: packets.flatMap((packet) => packet.sections).length,
    expectedObservationCount: packets.flatMap(
      (packet) => packet.expectedObservations,
    ).length,
    staticHumanGateStepCount: packets.flatMap(
      (packet) => packet.staticHumanGateSteps,
    ).length,
    staticCommandReferenceCount: packets.flatMap(
      (packet) => packet.staticCommandReferences,
    ).length,
    deferredBoundaryContextCount: deferredBoundaryContexts.length,
  };
}

function summaryText(counts: PacketCounts): string {
  return `${counts.totalPacketCount} local proof packets keep the Stage 26 default priority row inspectable; ${counts.unresolvedLocalProofGapPacketCount} unresolved local packets require static human inspection.`;
}

function comparePackets(
  left: ReviewProofPacketRowView,
  right: ReviewProofPacketRowView,
): number {
  return left.rank - right.rank || left.packetId.localeCompare(right.packetId);
}

function boundaryMatchesRow(
  context: ReviewProofPriorityDeferredBoundaryContextView,
  row: ReviewProofPriorityRowView,
): boolean {
  return (
    intersects(context.sourceCoverageRowIds, row.sourceCoverageRowIds) ||
    intersects(context.sourceTraceRowIds, row.sourceTraceRowIds) ||
    intersects(context.sourceOutcomeRowIds, row.sourceOutcomeRowIds) ||
    intersects(context.evidenceTargetIds, row.evidenceTargetIds)
  );
}

function toSourceCommand(
  command: ReviewProofPriorityProofCommandReferenceView,
): SourceCommandReference {
  return { ...command };
}

function uniqueSourceCommands(
  commands: SourceCommandReference[],
): SourceCommandReference[] {
  const seen = new Set<string>();
  const uniqueCommands: SourceCommandReference[] = [];

  for (const command of commands) {
    if (!seen.has(command.commandId)) {
      uniqueCommands.push(command);
      seen.add(command.commandId);
    }
  }

  return uniqueCommands;
}

function mergeStaticCommandReferences(
  references: ReviewProofPacketStaticCommandReferenceView[],
): ReviewProofPacketStaticCommandReferenceView[] {
  const merged = new Map<string, ReviewProofPacketStaticCommandReferenceView>();

  for (const reference of references) {
    const existing = merged.get(reference.commandId);
    if (!existing) {
      merged.set(reference.commandId, { ...reference });
      continue;
    }

    existing.sourcePriorityRowIds = unique([
      ...existing.sourcePriorityRowIds,
      ...reference.sourcePriorityRowIds,
    ]);
    existing.sourceCoverageRowIds = unique([
      ...existing.sourceCoverageRowIds,
      ...reference.sourceCoverageRowIds,
    ]);
    existing.sourceTraceRowIds = unique([
      ...existing.sourceTraceRowIds,
      ...reference.sourceTraceRowIds,
    ]);
    existing.sourceOutcomeRowIds = unique([
      ...existing.sourceOutcomeRowIds,
      ...reference.sourceOutcomeRowIds,
    ]);
    existing.evidenceTargetIds = unique([
      ...existing.evidenceTargetIds,
      ...reference.evidenceTargetIds,
    ]);
    existing.proofBucketLabels = unique([
      ...existing.proofBucketLabels,
      ...reference.proofBucketLabels,
    ]);
    existing.staticReviewStepIds = unique([
      ...existing.staticReviewStepIds,
      ...reference.staticReviewStepIds,
    ]);
  }

  return Array.from(merged.values());
}

function repoRelativeReference(command: string): string {
  const match = command.match(/\b((?:docs|frontend|scripts|tests)\/[^\s'"]+)/);

  return match?.[1] ?? command;
}

function intersects(left: string[], right: string[]): boolean {
  const rightValues = new Set(right);
  return left.some((value) => rightValues.has(value));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
