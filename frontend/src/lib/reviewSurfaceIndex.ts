import type {
  MissionConsoleView,
  ReplayPlaybackView,
  ReviewActionQueueView,
  ReviewActionWalkthroughView,
  ReviewBriefingBoardView,
  ReviewDecisionRegisterView,
  ReviewEvidenceCoverageView,
  ReviewEvidenceTraceView,
  ReviewGapResolutionView,
  ReviewGapTriageView,
  ReviewHandoffCoverageMatrixView,
  ReviewHandoffRehearsalView,
  ReviewPassOutcomeView,
  ReviewPassReadinessView,
  ReviewProofNavigatorView,
  ReviewProofPacketView,
  ReviewProofPriorityView,
  ReviewProofReconciliationView,
  ReviewSurfaceDeferredBoundaryNoteView,
  ReviewSurfaceIndexRowView,
  ReviewSurfaceIndexSourceCountView,
  ReviewSurfaceIndexView,
  ReviewSurfaceWorkflowGroupKind,
  ReviewSurfaceWorkflowGroupView,
} from "../features/mission-console/types.ts";

type ReviewSurfaceIndexSources = Pick<
  MissionConsoleView,
  | "reviewDecisionRegister"
  | "reviewBriefingBoard"
  | "reviewActionQueue"
  | "reviewActionWalkthrough"
  | "reviewHandoffRehearsal"
  | "reviewHandoffCoverageMatrix"
  | "reviewGapTriage"
  | "reviewGapResolution"
  | "reviewPassReadiness"
  | "reviewPassOutcome"
  | "reviewEvidenceTrace"
  | "reviewEvidenceCoverage"
  | "reviewProofPriority"
  | "reviewProofPacket"
  | "reviewProofNavigator"
  | "reviewProofReconciliation"
>;

type SurfaceRowInput = Omit<
  ReviewSurfaceIndexRowView,
  "localOrder" | "anchor" | "localOnly" | "informationalOnly" | "nonPersistent" | "nonExecutable" | "nonCertifying"
> & {
  anchorId: string;
  sourcePath: string;
};

const workflowGroupOrder: Record<ReviewSurfaceWorkflowGroupKind, number> = {
  decision: 1,
  action: 2,
  readiness: 3,
  evidence: 4,
  proof: 5,
  navigator: 6,
  reconciliation: 7,
};

const workflowGroupLabels: Record<
  ReviewSurfaceWorkflowGroupKind,
  { label: string; summary: string }
> = {
  decision: {
    label: "Decision",
    summary:
      "Stages 14 and 15 keep the decision register and briefing board local, readable, and non-certifying.",
  },
  action: {
    label: "Action",
    summary:
      "Stages 16 through 18 keep review actions and rehearsal steps in the local console without saved state or command execution.",
  },
  readiness: {
    label: "Readiness",
    summary:
      "Stages 19 through 22 keep coverage, triage, resolution, and pass-readiness surfaces aligned on local-only review.",
  },
  evidence: {
    label: "Evidence",
    summary:
      "Stages 23 through 25 keep outcome, trace, and coverage evidence visible without exports or certification.",
  },
  proof: {
    label: "Proof",
    summary:
      "Stages 26 and 27 keep proof priority and proof packet surfaces static, source-backed, and non-executable.",
  },
  navigator: {
    label: "Navigator",
    summary:
      "Stage 28 keeps the proof navigator and source crosswalk local and informational only.",
  },
  reconciliation: {
    label: "Reconciliation",
    summary:
      "Stage 29 keeps the proof-chain reconciliation map local, source-backed, and non-certifying.",
  },
};

export function buildReviewSurfaceIndex(
  sources: ReviewSurfaceIndexSources | undefined,
): ReviewSurfaceIndexView | undefined {
  if (!sources?.reviewDecisionRegister) {
    return undefined;
  }

  const rows = [
    buildDecisionRegisterRow(sources.reviewDecisionRegister),
    buildBriefingBoardRow(sources.reviewBriefingBoard),
    buildActionQueueRow(sources.reviewActionQueue),
    buildActionWalkthroughRow(sources.reviewActionWalkthrough),
    buildHandoffRehearsalRow(sources.reviewHandoffRehearsal),
    buildCoverageMatrixRow(sources.reviewHandoffCoverageMatrix),
    buildGapTriageRow(sources.reviewGapTriage),
    buildGapResolutionRow(sources.reviewGapResolution),
    buildPassReadinessRow(sources.reviewPassReadiness),
    buildPassOutcomeRow(sources.reviewPassOutcome),
    buildEvidenceTraceRow(sources.reviewEvidenceTrace),
    buildEvidenceCoverageRow(sources.reviewEvidenceCoverage),
    buildProofPriorityRow(sources.reviewProofPriority),
    buildProofPacketRow(sources.reviewProofPacket),
    buildProofNavigatorRow(sources.reviewProofNavigator),
    buildProofReconciliationRow(sources.reviewProofReconciliation),
  ];

  if (rows.some((row) => row === null)) {
    return undefined;
  }

  const typedRows = rows as ReviewSurfaceIndexRowView[];
  const workflowGroups = buildWorkflowGroups(typedRows);
  const anchorReferences = typedRows.map(({ anchor }) => anchor);
  const deferredBoundaryNotes = buildDeferredBoundaryNotes(
    typedRows,
    workflowGroups,
  );
  const localStatus = sources.reviewProofReconciliation?.localStatus ??
    sources.reviewDecisionRegister.localStatus;
  const counts = buildCounts(typedRows, workflowGroups, deferredBoundaryNotes);

  return {
    schema: "telemforge.review_surface_index.v1",
    version: 1,
    contractLabel: "local deterministic review surface index and navigation map",
    localStatus,
    summary: {
      indexId: "candidate-local-review-surface-index",
      label: "Local review surface index",
      summary:
        "A compact local navigation map keeps Stage 14 through Stage 29 review surfaces visible, route-free, and non-certifying.",
      defaultSurfaceId: typedRows[0].surfaceId,
      defaultAnchorId: typedRows[0].anchor.anchorId,
      informationalOnly: true,
      nonCertifying: true,
      counts,
    },
    rows: typedRows,
    workflowGroups,
    anchorReferences,
    deferredBoundaryNotes,
    staticBoundarySummary:
      "The index is local, deterministic, and read-only; it preserves in-page anchors and keeps saved navigation state, exports, command execution, ownership, signoff, and production handoff out of scope.",
    sourceReconciliation: sources.reviewProofReconciliation!,
  };
}

function buildDecisionRegisterRow(
  surface: ReviewDecisionRegisterView,
): ReviewSurfaceIndexRowView {
  return buildRow(
    {
      surfaceId: "review-decision-register",
      stageNumber: 14,
      workflowGroup: "decision",
      label: "Review decision register",
      summary:
        "Decision rows stay local and split across ready, follow-up, and deferred paths.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: `${surface.summary.readyCount} ready | ${surface.summary.followUpCount} follow-up | ${surface.summary.deferredCount} deferred`,
      sourceLabels: [
        "Stage 14 decision register",
        surface.contractLabel,
      ],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewDecisionRegister.ts",
        [
          ["Total decisions", surface.summary.totalDecisionCount],
          ["Ready decisions", surface.summary.readyCount],
          ["Follow-up decisions", surface.summary.followUpCount],
          ["Deferred decisions", surface.summary.deferredCount],
        ],
      ),
      deferredBoundaryCount: surface.scopeNotes.length,
      anchorId: "review-decision-register",
      sourcePath: "frontend/src/lib/reviewDecisionRegister.ts",
    },
  );
}

function buildBriefingBoardRow(
  surface: ReviewBriefingBoardView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-briefing-board",
      stageNumber: 15,
      workflowGroup: "decision",
      label: "Review briefing board",
      summary:
        "Decision groups and evidence drilldown remain local and route-free.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readinessStatus.replace(/_/g, " "),
      sourceLabels: [
        "Stage 15 briefing board",
        surface.contractLabel,
      ],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewBriefingBoard.ts",
        [
          ["Total decisions", surface.summary.totalDecisionCount],
          ["Evidence rows", surface.summary.evidenceRowCount],
          ["Follow-up actions", surface.summary.followUpActionCount],
          ["Ready decisions", surface.summary.readyCount],
        ],
      ),
      deferredBoundaryCount: surface.localOnlyScopeNotes.length,
      anchorId: "review-briefing-board",
      sourcePath: "frontend/src/lib/reviewBriefingBoard.ts",
    },
  );
}

function buildActionQueueRow(
  surface: ReviewActionQueueView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-action-queue",
      stageNumber: 16,
      workflowGroup: "action",
      label: "Review action queue",
      summary:
        "Action items remain local, blocking state stays visible, and deferred production scope stays informational.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 16 action queue", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewActionQueue.ts",
        [
          ["Total actions", surface.readiness.counts.totalActionCount],
          ["Blocking actions", surface.readiness.counts.blockingActionCount],
          ["Deferred actions", surface.readiness.counts.deferredProductionActionCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredScopeNotes.length,
      anchorId: "review-action-queue",
      sourcePath: "frontend/src/lib/reviewActionQueue.ts",
    },
  );
}

function buildActionWalkthroughRow(
  surface: ReviewActionWalkthroughView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-action-walkthrough",
      stageNumber: 17,
      workflowGroup: "action",
      label: "Action evidence walkthrough",
      summary:
        "Selected actions stay tied to local evidence paths without route or export semantics.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.selectedAction.blockerCategory.replace(/_/g, " "),
      sourceLabels: ["Stage 17 action walkthrough", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewActionWalkthrough.ts",
        [
          ["Evidence targets", surface.coverage.totalTargetCount],
          ["Resolved targets", surface.coverage.resolvedTargetCount],
          ["Missing targets", surface.coverage.missingTargetCount],
          ["Evidence rows", surface.coverage.evidenceRowCount],
          ["Replay frames", surface.coverage.replayFrameCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredProductionBoundaryNotes.length,
      anchorId: "review-action-walkthrough",
      sourcePath: "frontend/src/lib/reviewActionWalkthrough.ts",
    },
  );
}

function buildHandoffRehearsalRow(
  surface: ReviewHandoffRehearsalView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-handoff-rehearsal",
      stageNumber: 18,
      workflowGroup: "action",
      label: "Review handoff rehearsal",
      summary:
        "Handoff rehearsal steps stay local and keep production scope deferred.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 18 handoff rehearsal", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewHandoffRehearsal.ts",
        [
          ["Total steps", surface.readiness.counts.totalStepCount],
          ["Blocking steps", surface.readiness.counts.blockingStepCount],
          ["Missing targets", surface.readiness.counts.missingTargetStepCount],
          ["Deferred steps", surface.readiness.counts.deferredProductionStepCount],
          ["Resolved checkpoints", surface.readiness.counts.resolvedCheckpointCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredProductionNotes.length,
      anchorId: "review-handoff-rehearsal",
      sourcePath: "frontend/src/lib/reviewHandoffRehearsal.ts",
    },
  );
}

function buildCoverageMatrixRow(
  surface: ReviewHandoffCoverageMatrixView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-coverage-matrix",
      stageNumber: 19,
      workflowGroup: "readiness",
      label: "Review coverage matrix",
      summary:
        "Coverage rows stay local, with source buckets and deferred production notes preserved.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 19 coverage matrix", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewHandoffCoverageMatrix.ts",
        [
          ["Total rows", surface.readiness.counts.totalRowCount],
          ["Blocking rows", surface.readiness.counts.blockingRowCount],
          ["Missing target rows", surface.readiness.counts.missingTargetRowCount],
          ["Deferred rows", surface.readiness.counts.deferredProductionRowCount],
          ["Source refs", surface.readiness.counts.sourceEvidenceReferenceCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredProductionNotes.length,
      anchorId: "review-coverage-matrix",
      sourcePath: "frontend/src/lib/reviewHandoffCoverageMatrix.ts",
    },
  );
}

function buildGapTriageRow(
  surface: ReviewGapTriageView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-gap-triage",
      stageNumber: 20,
      workflowGroup: "readiness",
      label: "Review gap triage",
      summary:
        "Next-pass items remain ranked locally and keep deferred boundaries visible.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 20 gap triage", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewGapTriage.ts",
        [
          ["Total items", surface.readiness.counts.totalItemCount],
          ["Local blockers", surface.readiness.counts.localBlockerItemCount],
          ["Missing targets", surface.readiness.counts.missingTargetItemCount],
          ["Deferred items", surface.readiness.counts.deferredProductionItemCount],
          ["Proof commands", surface.readiness.counts.proofCommandCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredProductionBoundaries.length,
      anchorId: "review-gap-triage",
      sourcePath: "frontend/src/lib/reviewGapTriage.ts",
    },
  );
}

function buildGapResolutionRow(
  surface: ReviewGapResolutionView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-gap-resolution",
      stageNumber: 21,
      workflowGroup: "readiness",
      label: "Review gap resolution",
      summary:
        "Resolution playbook rows stay local and keep production scope non-actionable.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 21 gap resolution", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewGapResolution.ts",
        [
          ["Total resolution rows", surface.readiness.counts.totalResolutionRowCount],
          ["Local actionable", surface.readiness.counts.localActionableRowCount],
          ["Deferred rows", surface.readiness.counts.deferredProductionRowCount],
          ["Evidence targets", surface.readiness.counts.evidenceTargetChecklistRowCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryNotes.length,
      anchorId: "review-gap-resolution",
      sourcePath: "frontend/src/lib/reviewGapResolution.ts",
    },
  );
}

function buildPassReadinessRow(
  surface: ReviewPassReadinessView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-pass-readiness",
      stageNumber: 22,
      workflowGroup: "readiness",
      label: "Review pass readiness",
      summary:
        "Pass readiness rows stay local and keep proof targets and deferred boundaries explicit.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.readiness.label,
      sourceLabels: ["Stage 22 pass readiness", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewPassReadiness.ts",
        [
          ["Total readiness rows", surface.readiness.counts.totalReadinessRowCount],
          ["Local proof targets", surface.readiness.counts.localProofTargetCount],
          ["Static proof ready", surface.readiness.counts.staticProofReadyRowCount],
          ["Deferred rows", surface.readiness.counts.deferredProductionRowCount],
          ["Evidence map rows", surface.readiness.counts.evidenceMapRowCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryNotes.length,
      anchorId: "review-pass-readiness",
      sourcePath: "frontend/src/lib/reviewPassReadiness.ts",
    },
  );
}

function buildPassOutcomeRow(
  surface: ReviewPassOutcomeView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-pass-outcome-board",
      stageNumber: 23,
      workflowGroup: "evidence",
      label: "Review pass outcome",
      summary:
        "Outcome rows keep local evidence, gaps, and deferred scope visible together.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.candidateOutcome.verdict.replace(/_/g, " "),
      sourceLabels: ["Stage 23 pass outcome", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewPassOutcome.ts",
        [
          ["Total outcome rows", surface.candidateOutcome.counts.totalOutcomeRowCount],
          ["Ready evidence", surface.candidateOutcome.counts.readyLocalEvidenceRowCount],
          ["Local proof gaps", surface.candidateOutcome.counts.unresolvedLocalProofGapCount],
          ["Deferred rows", surface.candidateOutcome.counts.deferredProductionScopeRowCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredScopeLedgerRows.length,
      anchorId: "review-pass-outcome-board",
      sourcePath: "frontend/src/lib/reviewPassOutcome.ts",
    },
  );
}

function buildEvidenceTraceRow(
  surface: ReviewEvidenceTraceView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-evidence-trace-navigator",
      stageNumber: 24,
      workflowGroup: "evidence",
      label: "Review evidence trace",
      summary:
        "Trace rows keep source chains and deferred boundary notes visible without execution.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 24 evidence trace", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewEvidenceTrace.ts",
        [
          ["Total trace rows", surface.summary.counts.totalTraceRowCount],
          ["Ready evidence", surface.summary.counts.readyLocalEvidenceRowCount],
          ["Local proof gaps", surface.summary.counts.unresolvedLocalProofGapCount],
          ["Deferred rows", surface.summary.counts.deferredProductionScopeRowCount],
          ["Source outcome rows", surface.summary.counts.sourceOutcomeRowCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryNotes.length,
      anchorId: "review-evidence-trace-navigator",
      sourcePath: "frontend/src/lib/reviewEvidenceTrace.ts",
    },
  );
}

function buildEvidenceCoverageRow(
  surface: ReviewEvidenceCoverageView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-evidence-coverage-map",
      stageNumber: 25,
      workflowGroup: "evidence",
      label: "Review evidence coverage",
      summary:
        "Coverage rows keep proof buckets, static review steps, and deferred boundaries local.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 25 evidence coverage", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewEvidenceCoverage.ts",
        [
          ["Total coverage rows", surface.summary.counts.totalCoverageRowCount],
          ["Ready evidence", surface.summary.counts.readyLocalEvidenceRowCount],
          ["Local proof gaps", surface.summary.counts.unresolvedLocalProofGapCount],
          ["Deferred rows", surface.summary.counts.deferredProductionScopeRowCount],
          ["Proof buckets", surface.summary.counts.proofBucketCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryRollups.length,
      anchorId: "review-evidence-coverage-map",
      sourcePath: "frontend/src/lib/reviewEvidenceCoverage.ts",
    },
  );
}

function buildProofPriorityRow(
  surface: ReviewProofPriorityView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-proof-priority-radar",
      stageNumber: 26,
      workflowGroup: "proof",
      label: "Review proof priority",
      summary:
        "Priority rows keep local proof ordering visible and static only.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 26 proof priority", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewProofPriority.ts",
        [
          ["Total priority rows", surface.summary.counts.totalPriorityRowCount],
          ["Ready evidence", surface.summary.counts.readyLocalEvidenceRowCount],
          ["Local proof gaps", surface.summary.counts.unresolvedLocalProofGapCount],
          ["Deferred rows", surface.summary.counts.deferredProductionScopeRowCount],
          ["Static radar groups", surface.summary.counts.staticRadarGroupCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryContexts.length,
      anchorId: "review-proof-priority-radar",
      sourcePath: "frontend/src/lib/reviewProofPriority.ts",
    },
  );
}

function buildProofPacketRow(
  surface: ReviewProofPacketView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-proof-packet-gate",
      stageNumber: 27,
      workflowGroup: "proof",
      label: "Review proof packet",
      summary:
        "Packet sections and static human gates stay local, source-backed, and non-executable.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 27 proof packet", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewProofPacket.ts",
        [
          ["Total packets", surface.summary.counts.totalPacketCount],
          ["Ready evidence", surface.summary.counts.readyLocalEvidencePacketCount],
          ["Local proof gaps", surface.summary.counts.unresolvedLocalProofGapPacketCount],
          ["Deferred packets", surface.summary.counts.deferredProductionScopePacketCount],
          ["Human gate steps", surface.summary.counts.staticHumanGateStepCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryContexts.length,
      anchorId: "review-proof-packet-gate",
      sourcePath: "frontend/src/lib/reviewProofPacket.ts",
    },
  );
}

function buildProofNavigatorRow(
  surface: ReviewProofNavigatorView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-proof-navigator",
      stageNumber: 28,
      workflowGroup: "navigator",
      label: "Review proof navigator",
      summary:
        "Navigator rows keep static crosswalks and local prompts visible without routing.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 28 proof navigator", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewProofNavigator.ts",
        [
          ["Total navigator rows", surface.summary.counts.totalNavigatorRowCount],
          ["Ready evidence", surface.summary.counts.readyLocalEvidenceNavigatorRowCount],
          ["Local proof gaps", surface.summary.counts.localProofGapNavigatorRowCount],
          ["Deferred rows", surface.summary.counts.deferredProductionNavigatorRowCount],
          ["Lanes", surface.summary.counts.reviewLaneCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryMarkers.length,
      anchorId: "review-proof-navigator",
      sourcePath: "frontend/src/lib/reviewProofNavigator.ts",
    },
  );
}

function buildProofReconciliationRow(
  surface: ReviewProofReconciliationView | undefined,
): ReviewSurfaceIndexRowView | null {
  if (!surface) {
    return null;
  }

  return buildRow(
    {
      surfaceId: "review-proof-reconciliation",
      stageNumber: 29,
      workflowGroup: "reconciliation",
      label: "Review proof reconciliation",
      summary:
        "Reconciliation rows keep proof-chain consistency local, source-backed, and non-certifying.",
      sourceSchema: surface.schema,
      sourceContractLabel: surface.contractLabel,
      localStatus: surface.localStatus,
      localStatusLabel: localStatusLabel(surface.localStatus),
      statusLabel: surface.summary.label,
      sourceLabels: ["Stage 29 proof reconciliation", surface.contractLabel],
      sourceCounts: countEntries(
        "frontend/src/lib/reviewProofReconciliation.ts",
        [
          ["Total reconciliation rows", surface.summary.counts.totalReconciliationRowCount],
          ["Complete chains", surface.summary.counts.completeLocalChainRowCount],
          ["Local inspection gaps", surface.summary.counts.localInspectionGapRowCount],
          ["Deferred boundaries", surface.summary.counts.deferredProductionBoundaryRowCount],
          ["Static refs", surface.summary.counts.staticReviewReferenceCount],
        ],
      ),
      deferredBoundaryCount: surface.deferredBoundaryNotes.length,
      anchorId: "review-proof-reconciliation",
      sourcePath: "frontend/src/lib/reviewProofReconciliation.ts",
    },
  );
}

function buildRow(input: SurfaceRowInput): ReviewSurfaceIndexRowView {
  return {
    surfaceId: input.surfaceId,
    stageNumber: input.stageNumber,
    localOrder: input.stageNumber - 13,
    workflowGroup: input.workflowGroup,
    label: input.label,
    summary: input.summary,
    sourceSchema: input.sourceSchema,
    sourceContractLabel: input.sourceContractLabel,
    localStatus: input.localStatus,
    localStatusLabel: input.localStatusLabel,
    statusLabel: input.statusLabel,
    anchor: {
      anchorId: input.anchorId,
      href: `#${input.anchorId}`,
      label: `Open ${input.label}`,
      resolvesTo: "mission_console_section",
      localOnly: true,
      routeFree: true,
    },
    sourceLabels: input.sourceLabels,
    sourceCounts: input.sourceCounts,
    sourceSurfaceId: input.surfaceId,
    deferredBoundaryCount: input.deferredBoundaryCount,
    localOnly: true,
    informationalOnly: true,
    nonPersistent: true,
    nonExecutable: true,
    nonCertifying: true,
  };
}

function buildWorkflowGroups(
  rows: ReviewSurfaceIndexRowView[],
): ReviewSurfaceWorkflowGroupView[] {
  return Object.keys(workflowGroupOrder)
    .map((workflowGroup) => workflowGroup as ReviewSurfaceWorkflowGroupKind)
    .map((workflowGroup) => {
      const groupedRows = rows.filter((row) => row.workflowGroup === workflowGroup);
      if (!groupedRows.length) {
        return null;
      }

      return {
        groupId: `review-surface-group:${workflowGroup}`,
        workflowGroup,
        order: workflowGroupOrder[workflowGroup],
        label: workflowGroupLabels[workflowGroup].label,
        summary: workflowGroupLabels[workflowGroup].summary,
        rowCount: groupedRows.length,
        rowIds: groupedRows.map((row) => row.surfaceId),
        anchorIds: groupedRows.map((row) => row.anchor.anchorId),
        localOnly: true,
        informationalOnly: true,
        nonCertifying: true,
      } satisfies ReviewSurfaceWorkflowGroupView;
    })
    .filter((group): group is ReviewSurfaceWorkflowGroupView => group !== null)
    .sort((left, right) => left.order - right.order);
}

function buildDeferredBoundaryNotes(
  rows: ReviewSurfaceIndexRowView[],
  workflowGroups: ReviewSurfaceWorkflowGroupView[],
): ReviewSurfaceDeferredBoundaryNoteView[] {
  return workflowGroups.map((group) => {
    const groupRows = rows.filter((row) => row.workflowGroup === group.workflowGroup);
    const stageRange =
      groupRows.length === 1
        ? `Stage ${groupRows[0].stageNumber}`
        : `Stages ${groupRows[0].stageNumber}-${groupRows[groupRows.length - 1].stageNumber}`;

    return {
      noteId: `review-surface-boundary:${group.workflowGroup}`,
      label: `${group.label} boundaries`,
      summary:
        `${stageRange} remain local, informational, and non-actionable; saved navigation state, exports, command execution, ownership, signoff, and production handoff stay out of scope.`,
      sourceSurfaceIds: group.rowIds,
      sourceAnchorIds: group.anchorIds,
      actionability: "deferred_non_actionable",
      nonActionable: true,
      informationalOnly: true,
      nonCertifying: true,
    };
  });
}

function buildCounts(
  rows: ReviewSurfaceIndexRowView[],
  workflowGroups: ReviewSurfaceWorkflowGroupView[],
  deferredBoundaryNotes: ReviewSurfaceDeferredBoundaryNoteView[],
): ReviewSurfaceIndexView["summary"]["counts"] {
  const sourceSchemaCount = new Set(rows.map((row) => row.sourceSchema)).size;
  const sourceCountMetricCount = rows.reduce(
    (total, row) => total + row.sourceCounts.length,
    0,
  );

  return {
    totalSurfaceCount: rows.length,
    workflowGroupCount: workflowGroups.length,
    localAnchorCount: rows.length,
    sourceSchemaCount,
    sourceCountMetricCount,
    deferredBoundaryNoteCount: deferredBoundaryNotes.length,
    decisionSurfaceCount: rows.filter((row) => row.workflowGroup === "decision").length,
    actionSurfaceCount: rows.filter((row) => row.workflowGroup === "action").length,
    readinessSurfaceCount: rows.filter((row) => row.workflowGroup === "readiness").length,
    evidenceSurfaceCount: rows.filter((row) => row.workflowGroup === "evidence").length,
    proofSurfaceCount: rows.filter((row) => row.workflowGroup === "proof").length,
    navigatorSurfaceCount: rows.filter((row) => row.workflowGroup === "navigator").length,
    reconciliationSurfaceCount: rows.filter((row) => row.workflowGroup === "reconciliation").length,
  };
}

function countEntries(
  sourcePath: string,
  entries: Array<[string, number]>,
): ReviewSurfaceIndexSourceCountView[] {
  return entries.map(([label, value]) => ({
    label,
    value,
    sourcePath,
  }));
}

function localStatusLabel(status: ReplayPlaybackView["localStatus"]): string {
  switch (status) {
    case "fixture":
      return "Fixture mode";
    case "local-live":
      return "Local live mode";
  }
}
