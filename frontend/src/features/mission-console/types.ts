export type TelemetryStatus = "nominal" | "warning" | "critical" | "offline";
export type TrendDirection = "rising" | "falling" | "flat";
export type IncidentEventType =
  | "fault.injected"
  | "telemetry.affected"
  | "alert.raised"
  | "alert.acknowledged"
  | "alert.resolved";
export type ReplayMarkerKind = "fault" | "event" | "alert";
export type LiveTelemetryConnectionState =
  | "fixture"
  | "connecting"
  | "live"
  | "degraded"
  | "closed";

export interface ValueRange {
  min: number;
  max: number;
}

export interface TelemetryChannel {
  channelId: string;
  name: string;
  subsystem: string;
  unit: string;
  precision: number;
  description: string;
  nominalRange: ValueRange;
  warningRange: ValueRange;
  criticalRange: ValueRange;
}

export interface TelemetryPoint {
  channelId: string;
  timestamp: string;
  value: number;
  unit: string;
  status: TelemetryStatus;
  quality: "valid" | "suspect" | "missing";
}

export interface AlertRecord {
  alertId: string;
  channelId: string;
  severity: "info" | "warning" | "critical";
  state: "active" | "acknowledged" | "resolved";
  message: string;
  recommendedAction: string;
  observedValue?: number;
  threshold?: {
    operator: string;
    value: number;
    unit: string;
  };
  relatedFaultId?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  operatorNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface FaultRecord {
  faultId: string;
  faultType: string;
  subsystem: string;
  status: "active" | "cleared";
  requestedAt: string;
  targetChannelIds: string[];
  summary: string;
}

export interface EventLogEntry {
  eventId: string;
  eventType: IncidentEventType;
  timestamp: string;
  message: string;
  relatedFaultId?: string;
  channelId?: string;
  alertId?: string;
  severity?: "info" | "warning" | "critical";
  acknowledgedBy?: string;
  resolvedBy?: string;
  operatorNote?: string;
  resolutionNote?: string;
}

export interface TrendSample {
  timestamp: string;
  sample: number;
  elapsedSeconds: number;
  channelId: string;
  value: number;
  status: TelemetryStatus;
}

export interface Stage05ConsoleFixture {
  source: {
    snapshot: string;
    trends: string;
    channels: string;
  };
  spacecraftId: string;
  scenario: string;
  capturedAt: string;
  description: string;
  channels: TelemetryChannel[];
  points: TelemetryPoint[];
  alerts: AlertRecord[];
  faults?: FaultRecord[];
  events?: EventLogEntry[];
  replay?: ReplayPayload;
  trends: TrendSample[];
}

export interface MissionOverviewView {
  spacecraftId: string;
  scenario: string;
  capturedAt: string;
  description: string;
  healthState: TelemetryStatus;
  statusCounts: Record<TelemetryStatus, number>;
  activeAlertCount: number;
  acknowledgedAlertCount: number;
  resolvedAlertCount: number;
  activeFaultCount: number;
  sourceLabel: string;
}

export interface ChannelDetailView {
  channelId: string;
  name: string;
  subsystem: string;
  value: number;
  formattedValue: string;
  unit: string;
  status: TelemetryStatus;
  quality: string;
  description: string;
  nominalRangeLabel: string;
  warningRangeLabel: string;
}

export interface SubsystemSummaryView {
  id: string;
  label: string;
  status: TelemetryStatus;
  channelCount: number;
  statusCounts: Record<TelemetryStatus, number>;
  channels: ChannelDetailView[];
}

export interface TrendView {
  channelId: string;
  name: string;
  unit: string;
  status: TelemetryStatus;
  direction: TrendDirection;
  firstValue: number;
  lastValue: number;
  minimum: number;
  maximum: number;
  samples: TrendSample[];
  svgPath: string;
}

export interface IncidentStoryView {
  activeFaults: FaultRecord[];
  timeline: EventLogEntry[];
  latestEventAt: string | null;
}

export interface ReplayMarker {
  markerId: string;
  kind: ReplayMarkerKind;
  markerType: string;
  timestamp: string;
  label: string;
  message: string;
  severity: "info" | "warning" | "critical";
  relatedFaultId?: string;
  channelId?: string;
  alertId?: string;
}

export interface AnomalyRecord {
  anomalyId: string;
  timestamp: string;
  channelId: string;
  channelName: string;
  subsystem: string;
  severity: "warning" | "critical";
  score: number;
  observedValue: number;
  unit: string;
  reason: string;
}

export interface ReplayPayload {
  schema: "telemforge.replay_window.v1";
  sessionId: string;
  spacecraftId: string;
  window: {
    startAt: string;
    endAt: string;
    sampleLimit: number;
  };
  markers: ReplayMarker[];
  anomalies: AnomalyRecord[];
  summary: {
    sampleCount: number;
    markerCount: number;
    anomalyCount: number;
    affectedChannelIds: string[];
  };
}

export interface LiveTelemetryConnectionView {
  state: LiveTelemetryConnectionState;
  label: string;
  detail: string;
  lastSequence?: number;
  droppedEventCount?: number;
  clientQueueDepth?: number;
}

export interface AnomalyOverlayView extends AnomalyRecord {
  scoreLabel: string;
}

export interface ReplayInspectionView {
  windowLabel: string;
  markerCount: number;
  anomalyCount: number;
  sampleCount: number;
  affectedChannelIds: string[];
  timelineMarkers: ReplayMarker[];
  topAnomalies: AnomalyOverlayView[];
}

export interface ReplayPlaybackFrameView {
  frameId: string;
  frameIndex: number;
  timestamp: string;
  marker: {
    markerId: string;
    kind: ReplayMarkerKind;
    markerType: string;
    label: string;
    message: string;
    severity: ReplayMarker["severity"];
    channelId?: string;
    alertId?: string;
    relatedFaultId?: string;
  };
  anomalyContext: {
    anomalyId: string;
    timestamp: string;
    channelId: string;
    channelName: string;
    severity: AnomalyRecord["severity"];
    scoreLabel: string;
    observedValueLabel: string;
    reason: string;
  } | null;
  runbookTarget: {
    runbookId: string;
    stepId: string;
    title: string;
    evidenceTarget: string;
    stepStatus: ScenarioRunbookStepStatus;
  } | null;
  packetReference: {
    packetId: string;
    readinessStatus: IncidentReviewPacketView["readiness"]["status"];
    relatedMarkerCount: number;
  } | null;
  exportReference: {
    exportId: string;
    schema: IncidentReviewExportPayload["schema"];
  } | null;
}

export interface ReplayPlaybackView {
  schema: "telemforge.replay_playback.v1";
  version: 1;
  contractLabel: "local deterministic replay playback";
  localStatus: "fixture" | "local-live";
  selectedTimestamp: string;
  frameIndex: number;
  totalFrameCount: number;
  currentFrame: ReplayPlaybackFrameView;
  frames: ReplayPlaybackFrameView[];
  scopeNotes: string[];
}

export type ReviewDecisionStatus = "ready" | "follow_up" | "deferred";

export interface ReviewDecisionEvidenceRef {
  label: string;
  target: string;
  source:
    | "playback_frame"
    | "runbook"
    | "incident_packet"
    | "evidence_export"
    | "scope_boundary";
  frameId?: string;
  markerId?: string;
  path?: string;
}

export interface ReviewDecisionView {
  decisionId: string;
  status: ReviewDecisionStatus;
  label: string;
  summary: string;
  supportingEvidence: ReviewDecisionEvidenceRef[];
  relatedPlaybackFrameId: string;
  followUpReason: string | null;
  localOnlyScopeNotes: string[];
}

export interface ReviewHandoffChecklistItem {
  itemId: string;
  label: string;
  status: ReviewDecisionStatus;
  evidenceTarget: string;
  summary: string;
}

export interface ReviewDecisionRegisterView {
  schema: "telemforge.review_decision_register.v1";
  version: 1;
  contractLabel: "local deterministic review decision register";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: {
    totalDecisionCount: number;
    readyCount: number;
    followUpCount: number;
    deferredCount: number;
  };
  decisions: ReviewDecisionView[];
  handoffChecklist: ReviewHandoffChecklistItem[];
  scopeNotes: string[];
}

export interface ReviewBriefingBoardDecisionView {
  decisionId: string;
  status: ReviewDecisionStatus;
  label: string;
  summary: string;
  relatedPlaybackFrameId: string;
  followUpReason: string | null;
}

export interface ReviewBriefingBoardGroupView {
  status: ReviewDecisionStatus;
  label: string;
  summary: string;
  decisionCount: number;
  decisions: ReviewBriefingBoardDecisionView[];
}

export interface ReviewBriefingBoardEvidenceRowView {
  rowId: string;
  decisionId: string;
  decisionLabel: string;
  decisionStatus: ReviewDecisionStatus;
  evidenceLabel: string;
  target: string;
  source: ReviewDecisionEvidenceRef["source"];
  frameId?: string;
  markerId?: string;
  path?: string;
  reviewNote: string;
}

export interface ReviewBriefingBoardFollowUpActionView {
  actionId: string;
  label: string;
  summary: string;
  decisionIds: string[];
  evidenceTargets: string[];
}

export interface ReviewBriefingBoardView {
  schema: "telemforge.review_briefing_board.v1";
  version: 1;
  contractLabel: "local deterministic review briefing board";
  localStatus: ReplayPlaybackView["localStatus"];
  readinessStatus: "ready_for_handoff" | "needs_follow_up";
  summary: {
    totalDecisionCount: number;
    readyCount: number;
    followUpCount: number;
    deferredCount: number;
    groupCount: number;
    evidenceRowCount: number;
    followUpActionCount: number;
  };
  groupedDecisionSummaries: ReviewBriefingBoardGroupView[];
  evidenceDrilldownRows: ReviewBriefingBoardEvidenceRowView[];
  followUpActions: ReviewBriefingBoardFollowUpActionView[];
  localOnlyScopeNotes: string[];
}

export type ReviewActionPriority = "p0" | "p1" | "p2";

export type ReviewActionBlockerCategory =
  | "local_follow_up"
  | "local_evidence_gap"
  | "deferred_production_scope";

export type ReviewActionQueueReadinessVerdict =
  | "blocked_by_local_follow_up"
  | "deferred_production_scope_only"
  | "ready_for_local_handoff";

export interface ReviewActionQueueActionView {
  actionId: string;
  label: string;
  summary: string;
  priority: ReviewActionPriority;
  blockerCategory: ReviewActionBlockerCategory;
  blocking: boolean;
  decisionIds: string[];
  evidenceTargets: string[];
  nextLocalStep: string;
  readinessImpact: string;
}

export interface ReviewActionQueueView {
  schema: "telemforge.review_action_queue.v1";
  version: 1;
  contractLabel: "local deterministic review action queue";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewActionQueueReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalActionCount: number;
      blockingActionCount: number;
      deferredProductionActionCount: number;
    };
  };
  actions: ReviewActionQueueActionView[];
  deferredScopeNotes: string[];
  humanTestGateSummary: string;
}

export interface ReviewActionWalkthroughRunbookTargetView {
  stepId: string;
  title: string;
  evidenceTarget: string;
  stepStatus: ScenarioRunbookStepStatus;
}

export interface ReviewActionWalkthroughPacketReferenceView {
  packetId: string;
  readinessStatus: IncidentReviewPacketView["readiness"]["status"];
  relatedMarkerCount: number;
}

export interface ReviewActionWalkthroughExportReferenceView {
  exportId: string;
  schema: IncidentReviewExportPayload["schema"];
}

export interface ReviewActionWalkthroughEvidencePathRowView {
  rowId: string;
  target: string;
  label: string;
  status: "available" | "missing";
  evidenceRows: ReviewBriefingBoardEvidenceRowView[];
  replayFrameIds: string[];
  runbookTargets: ReviewActionWalkthroughRunbookTargetView[];
  packetReferences: ReviewActionWalkthroughPacketReferenceView[];
  exportReferences: ReviewActionWalkthroughExportReferenceView[];
  sourcePaths: string[];
}

export interface ReviewActionWalkthroughMissingTargetView {
  target: string;
  label: string;
  reason: string;
  expectedHints: string[];
}

export interface ReviewActionWalkthroughCoverageView {
  totalTargetCount: number;
  resolvedTargetCount: number;
  missingTargetCount: number;
  evidenceRowCount: number;
  replayFrameCount: number;
  runbookTargetCount: number;
  packetReferenceCount: number;
  exportReferenceCount: number;
  sourcePathCount: number;
}

export interface ReviewActionWalkthroughView {
  schema: "telemforge.review_action_walkthrough.v1";
  version: 1;
  contractLabel: "local deterministic action evidence walkthrough";
  localStatus: ReplayPlaybackView["localStatus"];
  actions: ReviewActionQueueActionView[];
  selectedActionId: string;
  selectedAction: ReviewActionQueueActionView;
  coverage: ReviewActionWalkthroughCoverageView;
  evidencePathRows: ReviewActionWalkthroughEvidencePathRowView[];
  missingTargetRecords: ReviewActionWalkthroughMissingTargetView[];
  nextLocalStep: string;
  deferredProductionBoundaryNotes: string[];
}

export type ReviewHandoffRehearsalReadinessVerdict =
  | "blocked_by_local_follow_up"
  | "deferred_production_scope_only"
  | "ready_for_local_handoff_rehearsal";

export type ReviewHandoffRehearsalMissingTargetStatus =
  | "all_targets_resolved"
  | "missing_targets";

export interface ReviewHandoffRehearsalStepView {
  stepId: string;
  stepNumber: number;
  actionId: string;
  actionLabel: string;
  actionSummary: string;
  priority: ReviewActionPriority;
  blockerCategory: ReviewActionBlockerCategory;
  blocking: boolean;
  checkpointCounts: ReviewActionWalkthroughCoverageView;
  missingTargetStatus: ReviewHandoffRehearsalMissingTargetStatus;
  missingTargets: ReviewActionWalkthroughMissingTargetView[];
  reviewerPrompt: string;
  expectedLocalOutcome: string;
  nextLocalStep: string;
  sourceEvidenceReferences: string[];
}

export interface ReviewHandoffRehearsalBlockerView {
  blockerId: string;
  actionId: string;
  label: string;
  reason: string;
  nextLocalStep: string;
}

export interface ReviewHandoffRehearsalView {
  schema: "telemforge.review_handoff_rehearsal.v1";
  version: 1;
  contractLabel: "local deterministic review handoff rehearsal";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewHandoffRehearsalReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalStepCount: number;
      blockingStepCount: number;
      missingTargetStepCount: number;
      deferredProductionStepCount: number;
      resolvedCheckpointCount: number;
      missingCheckpointCount: number;
    };
  };
  steps: ReviewHandoffRehearsalStepView[];
  unresolvedLocalBlockers: ReviewHandoffRehearsalBlockerView[];
  deferredProductionNotes: string[];
  nextLocalPrompt: string;
  sourceEvidenceReferences: string[];
}

export type ReviewHandoffCoverageMatrixReadinessVerdict =
  | "blocked_by_local_follow_up"
  | "deferred_production_scope_only"
  | "ready_for_local_review";

export type ReviewHandoffCoverageMatrixBlockerStatus =
  | "blocked"
  | "deferred"
  | "clear";

export interface ReviewHandoffCoverageSourceBucketView {
  bucketId: string;
  label: string;
  count: number;
  summary: string;
}

export interface ReviewHandoffCoverageMatrixRowView {
  rowId: string;
  rowNumber: number;
  actionId: string;
  rehearsalStepId: string;
  rehearsalStepLabel: string;
  readinessVerdict: ReviewHandoffCoverageMatrixReadinessVerdict;
  readinessLabel: string;
  blockerStatus: ReviewHandoffCoverageMatrixBlockerStatus;
  blockerSummary: string;
  targetCoverageCounts: ReviewActionWalkthroughCoverageView;
  sourceCoverageBuckets: ReviewHandoffCoverageSourceBucketView[];
  nextLocalStep: string;
  sourceEvidenceReferences: string[];
}

export interface ReviewHandoffCoverageCommandView {
  commandId: string;
  command: string;
  label: string;
  purpose: string;
}

export interface ReviewHandoffCoverageMatrixView {
  schema: "telemforge.review_handoff_coverage_matrix.v1";
  version: 1;
  contractLabel: "local deterministic review coverage matrix";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewHandoffCoverageMatrixReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalRowCount: number;
      blockingRowCount: number;
      missingTargetRowCount: number;
      deferredProductionRowCount: number;
      resolvedTargetCount: number;
      missingTargetCount: number;
      sourceEvidenceReferenceCount: number;
    };
  };
  rows: ReviewHandoffCoverageMatrixRowView[];
  localVerificationCommands: ReviewHandoffCoverageCommandView[];
  unresolvedLocalBlockers: ReviewHandoffRehearsalBlockerView[];
  deferredProductionNotes: string[];
  nextLocalPrompt: string;
  sourceEvidenceReferences: string[];
}

export type ReviewGapTriageCategory =
  | "missing_target"
  | "local_blocker"
  | "ready_local_review"
  | "deferred_production";

export type ReviewGapTriagePriority = "p0" | "p1" | "p2";

export type ReviewGapTriageReadinessVerdict =
  | "local_blockers_ranked"
  | "deferred_production_only"
  | "ready_for_next_local_pass";

export type ReviewGapTriageActionability =
  | "local_actionable"
  | "deferred_non_actionable";

export interface ReviewGapTriageProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source: "stage20_triage" | "stage19_matrix";
}

export interface ReviewGapTriageNextPassItemView {
  itemId: string;
  rank: number;
  priority: ReviewGapTriagePriority;
  category: ReviewGapTriageCategory;
  actionability: ReviewGapTriageActionability;
  label: string;
  summary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  blockerStatus: ReviewHandoffCoverageMatrixBlockerStatus;
  blockerSummary: string;
  sourceBuckets: ReviewHandoffCoverageSourceBucketView[];
  proofCommandReferences: ReviewGapTriageProofCommandReferenceView[];
  nextLocalStep: string;
}

export interface ReviewGapTriageGroupView {
  groupId: string;
  category: ReviewGapTriageCategory;
  label: string;
  summary: string;
  priority: ReviewGapTriagePriority;
  itemCount: number;
  items: ReviewGapTriageNextPassItemView[];
}

export interface ReviewGapTriageLocalBlockerSummaryView {
  blockerId: string;
  category: "missing_target" | "local_blocker";
  label: string;
  reason: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  nextLocalStep: string;
}

export interface ReviewGapTriageDeferredBoundaryView {
  boundaryId: string;
  label: string;
  summary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  deferredNotes: string[];
  actionability: "deferred_non_actionable";
}

export interface ReviewGapTriageView {
  schema: "telemforge.review_gap_triage.v1";
  version: 1;
  contractLabel: "local deterministic review gap triage";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewGapTriageReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalItemCount: number;
      localBlockerItemCount: number;
      missingTargetItemCount: number;
      deferredProductionItemCount: number;
      sourceMatrixRowCount: number;
      proofCommandCount: number;
    };
  };
  groups: ReviewGapTriageGroupView[];
  nextPassItems: ReviewGapTriageNextPassItemView[];
  localBlockerSummaries: ReviewGapTriageLocalBlockerSummaryView[];
  deferredProductionBoundaries: ReviewGapTriageDeferredBoundaryView[];
  proofCommandReferences: ReviewGapTriageProofCommandReferenceView[];
  staticProofChecklistSummary: string;
  sourceMatrixRows: ReviewHandoffCoverageMatrixRowView[];
  sourceEvidenceReferences: string[];
}

export type ReviewGapResolutionReadinessVerdict =
  | "local_resolution_targets_ready"
  | "deferred_production_only"
  | "ready_for_next_local_review";

export type ReviewGapResolutionEvidenceTargetStatus =
  | "needs_static_local_proof"
  | "deferred_production_boundary"
  | "static_proof_ready";

export interface ReviewGapResolutionProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source: "stage21_resolution" | ReviewGapTriageProofCommandReferenceView["source"];
}

export interface ReviewGapResolutionEvidenceTargetChecklistRowView {
  targetRowId: string;
  triageItemId: string;
  label: string;
  status: ReviewGapResolutionEvidenceTargetStatus;
  actionability: ReviewGapTriageActionability;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  sourceBucketLabels: string[];
  proofCommandIds: string[];
  nextStaticLocalProofStep: string;
}

export interface ReviewGapResolutionPlaybookRowView {
  resolutionId: string;
  rank: number;
  priority: ReviewGapTriagePriority;
  category: ReviewGapTriageCategory;
  actionability: ReviewGapTriageActionability;
  label: string;
  summary: string;
  blockerSummary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  sourceBuckets: ReviewHandoffCoverageSourceBucketView[];
  proofCommandReferences: ReviewGapResolutionProofCommandReferenceView[];
  evidenceTargetChecklistRows: ReviewGapResolutionEvidenceTargetChecklistRowView[];
  nextStaticLocalProofStep: string;
}

export interface ReviewGapResolutionLocalSummaryView {
  summaryId: string;
  actionableRowCount: number;
  topLocalBlockerLabel: string | null;
  nextStaticLocalProofStep: string;
}

export interface ReviewGapResolutionDeferredBoundaryNoteView {
  boundaryId: string;
  label: string;
  summary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  deferredNotes: string[];
  actionability: "deferred_non_actionable";
}

export interface ReviewGapResolutionView {
  schema: "telemforge.review_gap_resolution.v1";
  version: 1;
  contractLabel: "local deterministic review gap resolution";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewGapResolutionReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalResolutionRowCount: number;
      localActionableRowCount: number;
      deferredProductionRowCount: number;
      evidenceTargetChecklistRowCount: number;
      proofCommandReferenceCount: number;
      sourceMatrixRowCount: number;
    };
  };
  resolutionRows: ReviewGapResolutionPlaybookRowView[];
  evidenceTargetChecklistRows: ReviewGapResolutionEvidenceTargetChecklistRowView[];
  proofCommandReferences: ReviewGapResolutionProofCommandReferenceView[];
  localResolutionSummary: ReviewGapResolutionLocalSummaryView;
  deferredBoundaryNotes: ReviewGapResolutionDeferredBoundaryNoteView[];
  staticProofChecklistSummary: string;
  sourceTriageItems: ReviewGapTriageNextPassItemView[];
  sourceEvidenceReferences: string[];
}

export type ReviewPassReadinessVerdict =
  | "local_proof_targets_pending"
  | "deferred_production_only"
  | "ready_for_local_review_pass";

export type ReviewPassReadinessRowStatus =
  | "needs_local_proof"
  | "static_proof_ready"
  | "deferred_production_boundary";

export type ReviewPassChecklistItemStatus =
  | "local_proof_required"
  | "static_reference_ready"
  | "deferred_non_actionable";

export interface ReviewPassProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source:
    | "stage22_readiness"
    | ReviewGapResolutionProofCommandReferenceView["source"];
}

export interface ReviewPassReadinessRowView {
  readinessRowId: string;
  sourceResolutionId: string;
  rank: number;
  priority: ReviewGapTriagePriority;
  status: ReviewPassReadinessRowStatus;
  actionability: ReviewGapTriageActionability;
  label: string;
  summary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBuckets: ReviewHandoffCoverageSourceBucketView[];
  proofCommandReferences: ReviewPassProofCommandReferenceView[];
  nextStaticReviewPassStep: string;
}

export interface ReviewPassEvidenceMapRowView {
  mapRowId: string;
  readinessRowId: string;
  sourceResolutionId: string;
  evidenceTargetId: string;
  label: string;
  status: ReviewPassReadinessRowStatus;
  actionability: ReviewGapTriageActionability;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  sourceBucketLabels: string[];
  proofCommandIds: string[];
  nextStaticReviewPassStep: string;
}

export interface ReviewPassChecklistItemView {
  itemId: string;
  label: string;
  status: ReviewPassChecklistItemStatus;
  sourceReadinessRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  nextStaticReviewPassStep: string;
}

export interface ReviewPassDeferredBoundaryNoteView {
  boundaryId: string;
  label: string;
  summary: string;
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  deferredNotes: string[];
  actionability: "deferred_non_actionable";
}

export interface ReviewPassReadinessView {
  schema: "telemforge.review_pass_readiness.v1";
  version: 1;
  contractLabel: "local deterministic review-pass readiness";
  localStatus: ReplayPlaybackView["localStatus"];
  readiness: {
    verdict: ReviewPassReadinessVerdict;
    label: string;
    summary: string;
    counts: {
      totalReadinessRowCount: number;
      localActionableRowCount: number;
      localProofTargetCount: number;
      staticProofReadyRowCount: number;
      deferredProductionRowCount: number;
      evidenceMapRowCount: number;
      proofCommandReferenceCount: number;
      sourceResolutionRowCount: number;
      sourceMatrixRowCount: number;
    };
  };
  readinessRows: ReviewPassReadinessRowView[];
  evidenceMapRows: ReviewPassEvidenceMapRowView[];
  staticReviewPassChecklist: ReviewPassChecklistItemView[];
  proofCommandReferences: ReviewPassProofCommandReferenceView[];
  deferredBoundaryNotes: ReviewPassDeferredBoundaryNoteView[];
  staticEvidenceMapSummary: string;
  sourceResolutionRows: ReviewGapResolutionPlaybookRowView[];
  sourceEvidenceTargetChecklistRows: ReviewGapResolutionEvidenceTargetChecklistRowView[];
  sourceEvidenceReferences: string[];
}

export type ReviewPassOutcomeVerdict =
  | "local_proof_gaps_remaining"
  | "local_pass_candidate"
  | "deferred_production_scope_only";

export type ReviewPassOutcomeBucket =
  | "ready_local_evidence"
  | "local_proof_gap"
  | "deferred_production_scope";

export type ReviewPassOutcomeRowStatus =
  | "ready_local_evidence"
  | "unresolved_local_proof_gap"
  | "deferred_production_scope";

export interface ReviewPassOutcomeProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source: "stage23_outcome" | ReviewPassProofCommandReferenceView["source"];
}

export interface ReviewPassOutcomeSummaryView {
  outcomeId: "candidate-local-review-pass";
  verdict: ReviewPassOutcomeVerdict;
  label: string;
  summary: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalOutcomeRowCount: number;
    readyLocalEvidenceRowCount: number;
    unresolvedLocalProofGapCount: number;
    deferredProductionScopeRowCount: number;
    sourceReadinessRowCount: number;
    evidenceTargetCount: number;
    proofCommandReferenceCount: number;
  };
}

export interface ReviewPassOutcomeRowView {
  outcomeRowId: string;
  rank: number;
  status: ReviewPassOutcomeRowStatus;
  outcomeBucket: ReviewPassOutcomeBucket;
  label: string;
  summary: string;
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBuckets: ReviewHandoffCoverageSourceBucketView[];
  proofCommandReferences: ReviewPassOutcomeProofCommandReferenceView[];
  nextStaticLocalReviewStep: string;
}

export interface ReviewPassLocalProofGapRowView {
  gapRowId: string;
  sourceReadinessRowId: string;
  label: string;
  summary: string;
  evidenceTargetIds: string[];
  sourceMatrixRowIds: string[];
  proofCommandIds: string[];
  nextStaticLocalReviewStep: string;
}

export interface ReviewPassDeferredScopeLedgerRowView {
  ledgerRowId: string;
  label: string;
  summary: string;
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBucketLabels: string[];
  proofCommandIds: string[];
  actionability: "deferred_non_actionable";
  nextStaticLocalReviewStep: string;
}

export interface ReviewPassStaticVerdictNoteView {
  noteId: string;
  label: string;
  summary: string;
}

export interface ReviewPassOutcomeView {
  schema: "telemforge.review_pass_outcome.v1";
  version: 1;
  contractLabel: "local deterministic review-pass outcome board";
  localStatus: ReplayPlaybackView["localStatus"];
  candidateOutcome: ReviewPassOutcomeSummaryView;
  outcomeRows: ReviewPassOutcomeRowView[];
  localProofGapRows: ReviewPassLocalProofGapRowView[];
  deferredScopeLedgerRows: ReviewPassDeferredScopeLedgerRowView[];
  staticVerdictNotes: ReviewPassStaticVerdictNoteView[];
  proofCommandReferences: ReviewPassOutcomeProofCommandReferenceView[];
  sourceReadiness: ReviewPassReadinessView;
  sourceEvidenceMapRows: ReviewPassEvidenceMapRowView[];
}

export type ReviewEvidenceTraceSegmentKind =
  | "outcome"
  | "readiness"
  | "resolution"
  | "coverage"
  | "proof"
  | "deferred_scope";

export type ReviewEvidenceTraceSourceReferenceKind =
  | "outcome"
  | "readiness"
  | "resolution"
  | "coverage"
  | "action"
  | "evidence_target"
  | "source_bucket";

export interface ReviewEvidenceTraceProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source:
    | "stage24_trace"
    | ReviewPassOutcomeProofCommandReferenceView["source"];
}

export interface ReviewEvidenceTraceSourceReferenceGroupView {
  groupId: string;
  sourceKind: ReviewEvidenceTraceSourceReferenceKind;
  label: string;
  sourceIds: string[];
}

export interface ReviewEvidenceTraceSegmentView {
  segmentId: string;
  segmentKind: ReviewEvidenceTraceSegmentKind;
  label: string;
  summary: string;
  sourceReferenceGroupIds: string[];
  proofCommandIds: string[];
  nextStaticLocalReviewStep?: string;
}

export interface ReviewEvidenceTraceRowView {
  traceRowId: string;
  rank: number;
  status: ReviewPassOutcomeRowStatus;
  outcomeBucket: ReviewPassOutcomeBucket;
  label: string;
  summary: string;
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBucketLabels: string[];
  sourceReferenceGroups: ReviewEvidenceTraceSourceReferenceGroupView[];
  proofCommandReferences: ReviewEvidenceTraceProofCommandReferenceView[];
  traceSegments: ReviewEvidenceTraceSegmentView[];
  nextStaticLocalReviewStep: string;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewEvidenceTraceDeferredBoundaryNoteView {
  noteId: string;
  label: string;
  summary: string;
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nextStaticLocalReviewStep: string;
}

export interface ReviewEvidenceTraceSummaryView {
  traceId: "candidate-local-review-evidence-trace";
  label: string;
  summary: string;
  defaultTraceRowId: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalTraceRowCount: number;
    unresolvedLocalProofGapCount: number;
    readyLocalEvidenceRowCount: number;
    deferredProductionScopeRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    evidenceTargetCount: number;
    proofCommandReferenceCount: number;
  };
}

export interface ReviewEvidenceTraceView {
  schema: "telemforge.review_evidence_trace.v1";
  version: 1;
  contractLabel: "local deterministic review evidence trace navigator";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewEvidenceTraceSummaryView;
  traceRows: ReviewEvidenceTraceRowView[];
  selectedTraceRow: ReviewEvidenceTraceRowView;
  proofCommandReferences: ReviewEvidenceTraceProofCommandReferenceView[];
  deferredBoundaryNotes: ReviewEvidenceTraceDeferredBoundaryNoteView[];
  staticProofChecklistSummary: string;
  sourceOutcome: ReviewPassOutcomeView;
}

export type ReviewEvidenceCoverageRowStatus = ReviewPassOutcomeRowStatus;

export type ReviewEvidenceCoveragePriority = "p0" | "p1" | "p2";

export type ReviewEvidenceCoverageActionability =
  | "local_review_required"
  | "local_evidence_ready"
  | "deferred_non_actionable";

export interface ReviewEvidenceCoverageProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source:
    | "stage25_coverage"
    | ReviewEvidenceTraceProofCommandReferenceView["source"];
}

export interface ReviewEvidenceCoverageStaticReviewStepView {
  stepId: string;
  label: string;
  summary: string;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  repoRelativeReference: string;
  nonExecutable: true;
}

export interface ReviewEvidenceCoverageRowView {
  coverageRowId: string;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  rank: number;
  status: ReviewEvidenceCoverageRowStatus;
  actionability: ReviewEvidenceCoverageActionability;
  label: string;
  summary: string;
  sourceBucketLabels: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  nextStaticReviewSteps: ReviewEvidenceCoverageStaticReviewStepView[];
  deferredBoundaryNotes: string[];
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewEvidenceCoverageGroupView {
  groupId: string;
  status: ReviewEvidenceCoverageRowStatus;
  proofBucketLabel: string;
  summary: string;
  priority: ReviewEvidenceCoveragePriority;
  rowCount: number;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  nextStaticReviewStepIds: string[];
  rows: ReviewEvidenceCoverageRowView[];
}

export interface ReviewEvidenceCoverageBucketRowView {
  bucketRowId: string;
  status: ReviewEvidenceCoverageRowStatus;
  sourceBucketLabel: string;
  proofBucketLabel: string;
  rowCount: number;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  nextStaticReviewStepIds: string[];
}

export interface ReviewEvidenceCoverageDeferredBoundaryRollupView {
  boundaryId: string;
  label: string;
  summary: string;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nextStaticLocalReviewStep: string;
  nonActionable: true;
}

export interface ReviewEvidenceCoverageSummaryView {
  coverageId: "candidate-local-review-evidence-coverage";
  label: string;
  summary: string;
  defaultCoverageRowId: string;
  defaultCoverageGroupId: string;
  defaultProofBucketLabel: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalCoverageRowCount: number;
    unresolvedLocalProofGapCount: number;
    readyLocalEvidenceRowCount: number;
    deferredProductionScopeRowCount: number;
    sourceTraceRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    evidenceTargetCount: number;
    sourceBucketLabelCount: number;
    proofBucketCount: number;
    proofCommandReferenceCount: number;
    staticReviewStepCount: number;
    bucketRowCount: number;
    deferredBoundaryNoteCount: number;
  };
}

export interface ReviewEvidenceCoverageView {
  schema: "telemforge.review_evidence_coverage.v1";
  version: 1;
  contractLabel: "local deterministic review evidence coverage map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewEvidenceCoverageSummaryView;
  coverageRows: ReviewEvidenceCoverageRowView[];
  coverageGroups: ReviewEvidenceCoverageGroupView[];
  bucketRows: ReviewEvidenceCoverageBucketRowView[];
  staticReviewSteps: ReviewEvidenceCoverageStaticReviewStepView[];
  deferredBoundaryRollups: ReviewEvidenceCoverageDeferredBoundaryRollupView[];
  proofCommandReferences: ReviewEvidenceCoverageProofCommandReferenceView[];
  staticProofChecklistSummary: string;
  sourceTrace: ReviewEvidenceTraceView;
}

export type ReviewProofPriorityPriority = ReviewEvidenceCoveragePriority;

export type ReviewProofPriorityRowStatus = ReviewEvidenceCoverageRowStatus;

export type ReviewProofPriorityActionability =
  ReviewEvidenceCoverageActionability;

export interface ReviewProofPriorityProofCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  source:
    | "stage26_priority"
    | ReviewEvidenceCoverageProofCommandReferenceView["source"];
}

export interface ReviewProofPrioritySourceCoverageReferenceView {
  coverageRowId: string;
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBucketLabels: string[];
}

export interface ReviewProofPriorityReasonView {
  reasonId: string;
  label: string;
  summary: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  staticReviewStepIds: string[];
}

export interface ReviewProofPriorityRowView {
  priorityRowId: string;
  rank: number;
  priority: ReviewProofPriorityPriority;
  status: ReviewProofPriorityRowStatus;
  actionability: ReviewProofPriorityActionability;
  label: string;
  summary: string;
  rankingSummary: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  sourceBucketLabels: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticReviewStepIds: string[];
  staticReviewSteps: ReviewEvidenceCoverageStaticReviewStepView[];
  rankingReasons: ReviewProofPriorityReasonView[];
  sourceCoverageReferences: ReviewProofPrioritySourceCoverageReferenceView[];
  deferredBoundaryNotes: string[];
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofPriorityStaticCheckReferenceView {
  checkId: string;
  proofCommandId: string;
  label: string;
  command: string;
  purpose: string;
  repoRelativeReference: string;
  source:
    | ReviewProofPriorityProofCommandReferenceView["source"]
    | "unknown_static_reference";
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  staticReviewStepIds: string[];
  localOnly: true;
  staticOnly: true;
  nonExecutable: true;
}

export interface ReviewProofPriorityStaticRadarGroupView {
  radarGroupId: string;
  priorityRowId: string;
  proofBucketLabel: string;
  label: string;
  summary: string;
  priority: ReviewProofPriorityPriority;
  status: ReviewProofPriorityRowStatus;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  staticReviewStepIds: string[];
  checks: ReviewProofPriorityStaticCheckReferenceView[];
  localOnly: true;
  staticOnly: true;
  nonExecutable: true;
}

export interface ReviewProofPriorityDeferredBoundaryContextView {
  boundaryId: string;
  label: string;
  summary: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  nonCertifying: true;
}

export interface ReviewProofPrioritySummaryView {
  priorityId: "candidate-local-review-proof-priority";
  label: string;
  summary: string;
  defaultPriorityRowId: string;
  defaultStaticRadarGroupId: string;
  defaultProofBucketLabel: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalPriorityRowCount: number;
    unresolvedLocalProofGapCount: number;
    readyLocalEvidenceRowCount: number;
    deferredProductionScopeRowCount: number;
    sourceCoverageRowCount: number;
    sourceTraceRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    sourceActionCount: number;
    evidenceTargetCount: number;
    proofBucketCount: number;
    proofCommandReferenceCount: number;
    staticRadarGroupCount: number;
    staticCheckReferenceCount: number;
    deferredBoundaryContextCount: number;
  };
}

export interface ReviewProofPriorityView {
  schema: "telemforge.review_proof_priority.v1";
  version: 1;
  contractLabel: "local deterministic review proof priority radar";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewProofPrioritySummaryView;
  priorityRows: ReviewProofPriorityRowView[];
  defaultPriorityRow: ReviewProofPriorityRowView;
  staticCheckRadarGroups: ReviewProofPriorityStaticRadarGroupView[];
  deferredBoundaryContexts: ReviewProofPriorityDeferredBoundaryContextView[];
  proofCommandReferences: ReviewProofPriorityProofCommandReferenceView[];
  staticCheckRadarSummary: string;
  sourceCoverage: ReviewEvidenceCoverageView;
}

export type ReviewProofPacketSectionKind =
  | "source_evidence_chain"
  | "expected_local_observations"
  | "static_human_gate"
  | "deferred_boundary_context";

export type ReviewProofPacketObservationKind =
  | "source_chain_visible"
  | "priority_reason_visible"
  | "static_reference_visible"
  | "deferred_boundary_visible";

export type ReviewProofPacketHumanGateStepKind =
  | "inspect_source_chain"
  | "compare_expected_observations"
  | "confirm_non_executing_gate";

export interface ReviewProofPacketEvidenceChainView {
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticReviewStepIds: string[];
}

export interface ReviewProofPacketSectionView {
  sectionId: string;
  kind: ReviewProofPacketSectionKind;
  label: string;
  summary: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  evidenceTargetIds: string[];
  localOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofPacketExpectedObservationView {
  observationId: string;
  kind: ReviewProofPacketObservationKind;
  label: string;
  summary: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  staticReviewStepIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofPacketStaticCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  repoRelativeReference: string;
  source:
    | "stage27_proof_packet"
    | ReviewProofPriorityProofCommandReferenceView["source"]
    | "unknown_static_reference";
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  staticReviewStepIds: string[];
  localOnly: true;
  staticOnly: true;
  nonExecutable: true;
}

export interface ReviewProofPacketHumanGateStepView {
  gateStepId: string;
  kind: ReviewProofPacketHumanGateStepKind;
  label: string;
  summary: string;
  repoRelativeReference: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  expectedObservationIds: string[];
  localOnly: true;
  sourceBacked: true;
  staticOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofPacketDeferredBoundaryContextView {
  boundaryId: string;
  label: string;
  summary: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  nonCertifying: true;
}

export interface ReviewProofPacketRowView {
  packetId: string;
  rank: number;
  priority: ReviewProofPriorityPriority;
  status: ReviewProofPriorityRowStatus;
  actionability: ReviewProofPriorityActionability;
  label: string;
  summary: string;
  sourcePriorityRowId: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticReviewStepIds: string[];
  sourceEvidenceChain: ReviewProofPacketEvidenceChainView;
  sections: ReviewProofPacketSectionView[];
  expectedObservations: ReviewProofPacketExpectedObservationView[];
  staticHumanGateSteps: ReviewProofPacketHumanGateStepView[];
  staticCommandReferences: ReviewProofPacketStaticCommandReferenceView[];
  deferredBoundaryContext: ReviewProofPacketDeferredBoundaryContextView[];
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofPacketSummaryView {
  packetSetId: "candidate-local-review-proof-packet";
  label: string;
  summary: string;
  defaultPacketId: string;
  defaultPriorityRowId: string;
  defaultCoverageRowId: string;
  defaultHumanGateStepId: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalPacketCount: number;
    unresolvedLocalProofGapPacketCount: number;
    readyLocalEvidencePacketCount: number;
    deferredProductionScopePacketCount: number;
    sourcePriorityRowCount: number;
    sourceCoverageRowCount: number;
    sourceTraceRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    sourceActionCount: number;
    evidenceTargetCount: number;
    proofBucketCount: number;
    packetSectionCount: number;
    expectedObservationCount: number;
    staticHumanGateStepCount: number;
    staticCommandReferenceCount: number;
    deferredBoundaryContextCount: number;
  };
}

export interface ReviewProofPacketView {
  schema: "telemforge.review_proof_packet.v1";
  version: 1;
  contractLabel: "local deterministic review proof packet and static human test gate";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewProofPacketSummaryView;
  packets: ReviewProofPacketRowView[];
  defaultPacket: ReviewProofPacketRowView;
  deferredBoundaryContexts: ReviewProofPacketDeferredBoundaryContextView[];
  proofCommandReferences: ReviewProofPacketStaticCommandReferenceView[];
  staticHumanGateSummary: string;
  sourcePriority: ReviewProofPriorityView;
}

export type ReviewProofNavigatorLaneKind =
  | "local_proof_gap"
  | "ready_local_evidence"
  | "deferred_production_scope";

export type ReviewProofNavigatorPromptKind = "inspect_static_source_crosswalk";

export interface ReviewProofNavigatorRowView {
  navigatorRowId: string;
  rank: number;
  laneKind: ReviewProofNavigatorLaneKind;
  laneLabel: string;
  laneSummary: string;
  packetId: string;
  packetRank: number;
  packetStatus: ReviewProofPriorityRowStatus;
  priority: ReviewProofPriorityPriority;
  actionability: ReviewProofPriorityActionability;
  label: string;
  summary: string;
  sourcePriorityRowId: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticHumanGateStepIds: string[];
  sourceStaticReviewStepIds: string[];
  deferredBoundaryMarkerIds: string[];
  defaultRow: boolean;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofNavigatorLaneView {
  laneId: string;
  laneKind: ReviewProofNavigatorLaneKind;
  order: number;
  label: string;
  summary: string;
  rowCount: number;
  navigatorRowIds: string[];
  firstNavigatorRowId: string | null;
  localOnly: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofNavigatorSourceCrosswalkRowView {
  crosswalkRowId: string;
  navigatorRowId: string;
  packetId: string;
  label: string;
  summary: string;
  laneKind: ReviewProofNavigatorLaneKind;
  packetStatus: ReviewProofPriorityRowStatus;
  sourcePriorityRowId: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticHumanGateStepIds: string[];
  sourceStaticReviewStepIds: string[];
  repoRelativeReferences: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofNavigatorStaticInspectionPromptView {
  promptId: string;
  kind: ReviewProofNavigatorPromptKind;
  label: string;
  summary: string;
  navigatorRowIds: string[];
  packetIds: string[];
  repoRelativeReferences: string[];
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  evidenceTargetIds: string[];
  proofCommandIds: string[];
  staticHumanGateStepIds: string[];
  localOnly: true;
  sourceBacked: true;
  staticOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofNavigatorStaticCommandReferenceView
  extends ReviewHandoffCoverageCommandView {
  repoRelativeReference: string;
  source: "stage28_navigator" | ReviewProofPacketStaticCommandReferenceView["source"];
  navigatorRowIds: string[];
  packetIds: string[];
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  staticHumanGateStepIds: string[];
  localOnly: true;
  staticOnly: true;
  nonExecutable: true;
}

export interface ReviewProofNavigatorDeferredBoundaryMarkerView {
  markerId: string;
  navigatorRowId: string;
  packetId: string;
  label: string;
  summary: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  nonCertifying: true;
}

export interface ReviewProofNavigatorSummaryView {
  navigatorId: "candidate-local-review-proof-navigator";
  label: string;
  summary: string;
  defaultNavigatorRowId: string;
  defaultPacketId: string;
  defaultLaneId: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalNavigatorRowCount: number;
    localProofGapNavigatorRowCount: number;
    readyLocalEvidenceNavigatorRowCount: number;
    deferredProductionNavigatorRowCount: number;
    reviewLaneCount: number;
    sourceCrosswalkRowCount: number;
    staticInspectionPromptCount: number;
    staticCommandReferenceCount: number;
    deferredBoundaryMarkerCount: number;
    sourcePriorityRowCount: number;
    sourceCoverageRowCount: number;
    sourceTraceRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    sourceActionCount: number;
    evidenceTargetCount: number;
    proofBucketCount: number;
    staticHumanGateStepCount: number;
  };
}

export interface ReviewProofNavigatorView {
  schema: "telemforge.review_proof_navigator.v1";
  version: 1;
  contractLabel: "local deterministic review proof navigator and source crosswalk";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewProofNavigatorSummaryView;
  navigatorRows: ReviewProofNavigatorRowView[];
  defaultNavigatorRow: ReviewProofNavigatorRowView;
  reviewLanes: ReviewProofNavigatorLaneView[];
  sourceCrosswalkRows: ReviewProofNavigatorSourceCrosswalkRowView[];
  staticInspectionPrompts: ReviewProofNavigatorStaticInspectionPromptView[];
  staticCommandReferences: ReviewProofNavigatorStaticCommandReferenceView[];
  deferredBoundaryMarkers: ReviewProofNavigatorDeferredBoundaryMarkerView[];
  staticNavigatorSummary: string;
  sourceProofPacket: ReviewProofPacketView;
}

export type ReviewProofReconciliationBucketKind =
  | "complete_local_chain"
  | "local_inspection_gap"
  | "deferred_production_boundary";

export type ReviewProofReconciliationSegmentKind =
  | "proof_packet"
  | "priority"
  | "coverage"
  | "trace"
  | "outcome"
  | "readiness"
  | "resolution"
  | "matrix"
  | "action"
  | "evidence_target"
  | "proof_command"
  | "static_human_gate"
  | "static_inspection_prompt"
  | "deferred_boundary";

export type ReviewProofReconciliationReferenceKind =
  | "stage29_reconciliation_source"
  | "source_crosswalk"
  | "static_inspection_prompt"
  | "static_command_reference";

export interface ReviewProofReconciliationSegmentSummaryView {
  segmentId: string;
  reconciliationRowId: string;
  navigatorRowId: string;
  kind: ReviewProofReconciliationSegmentKind;
  label: string;
  sourceIds: string[];
  complete: boolean;
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofReconciliationRowView {
  reconciliationRowId: string;
  navigatorRowId: string;
  sourceCrosswalkRowId: string | null;
  rank: number;
  bucketKind: ReviewProofReconciliationBucketKind;
  bucketLabel: string;
  bucketSummary: string;
  packetId: string;
  laneKind: ReviewProofNavigatorLaneKind;
  packetStatus: ReviewProofPriorityRowStatus;
  priority: ReviewProofPriorityPriority;
  actionability: ReviewProofPriorityActionability;
  label: string;
  summary: string;
  sourcePriorityRowId: string;
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  sourceReadinessRowIds: string[];
  sourceResolutionIds: string[];
  sourceMatrixRowIds: string[];
  sourceActionIds: string[];
  evidenceTargetIds: string[];
  proofBucketLabels: string[];
  proofCommandIds: string[];
  staticHumanGateStepIds: string[];
  sourceStaticReviewStepIds: string[];
  staticInspectionPromptIds: string[];
  deferredBoundaryMarkerIds: string[];
  sourceChainSegments: ReviewProofReconciliationSegmentSummaryView[];
  defaultRow: boolean;
  localChainComplete: boolean;
  localInspectionRequired: boolean;
  deferredProductionBoundary: boolean;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofReconciliationBucketView {
  bucketId: string;
  bucketKind: ReviewProofReconciliationBucketKind;
  order: number;
  label: string;
  summary: string;
  rowCount: number;
  reconciliationRowIds: string[];
  firstReconciliationRowId: string | null;
  localOnly: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofReconciliationStaticReferenceView {
  referenceId: string;
  kind: ReviewProofReconciliationReferenceKind;
  label: string;
  summary: string;
  repoRelativeReference: string;
  reconciliationRowIds: string[];
  navigatorRowIds: string[];
  packetIds: string[];
  proofCommandIds: string[];
  staticHumanGateStepIds: string[];
  staticInspectionPromptIds: string[];
  localOnly: true;
  sourceBacked: true;
  staticOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewProofReconciliationDeferredBoundaryNoteView {
  noteId: string;
  markerId: string;
  reconciliationRowId: string;
  navigatorRowId: string;
  packetId: string;
  label: string;
  summary: string;
  sourcePriorityRowIds: string[];
  sourceCoverageRowIds: string[];
  sourceTraceRowIds: string[];
  sourceOutcomeRowIds: string[];
  evidenceTargetIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewProofReconciliationSummaryView {
  reconciliationId: "candidate-local-review-proof-reconciliation";
  label: string;
  summary: string;
  defaultReconciliationRowId: string;
  defaultNavigatorRowId: string;
  defaultPacketId: string;
  defaultBucketId: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalReconciliationRowCount: number;
    completeLocalChainRowCount: number;
    localInspectionGapRowCount: number;
    deferredProductionBoundaryRowCount: number;
    sourceChainSegmentCount: number;
    consistencyBucketCount: number;
    staticReviewReferenceCount: number;
    staticInspectionPromptCount: number;
    proofCommandReferenceCount: number;
    deferredBoundaryNoteCount: number;
    sourcePriorityRowCount: number;
    sourceCoverageRowCount: number;
    sourceTraceRowCount: number;
    sourceOutcomeRowCount: number;
    sourceReadinessRowCount: number;
    sourceResolutionRowCount: number;
    sourceMatrixRowCount: number;
    sourceActionCount: number;
    evidenceTargetCount: number;
    proofBucketCount: number;
    staticHumanGateStepCount: number;
  };
}

export interface ReviewProofReconciliationView {
  schema: "telemforge.review_proof_reconciliation.v1";
  version: 1;
  contractLabel: "local deterministic review proof-chain reconciliation map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewProofReconciliationSummaryView;
  reconciliationRows: ReviewProofReconciliationRowView[];
  defaultReconciliationRow: ReviewProofReconciliationRowView;
  consistencyBuckets: ReviewProofReconciliationBucketView[];
  sourceChainSegments: ReviewProofReconciliationSegmentSummaryView[];
  staticReviewReferences: ReviewProofReconciliationStaticReferenceView[];
  deferredBoundaryNotes: ReviewProofReconciliationDeferredBoundaryNoteView[];
  staticReconciliationSummary: string;
  sourceNavigator: ReviewProofNavigatorView;
}

export type ReviewSurfaceWorkflowGroupKind =
  | "decision"
  | "action"
  | "readiness"
  | "evidence"
  | "proof"
  | "navigator"
  | "reconciliation";

export interface ReviewSurfaceAnchorReferenceView {
  anchorId: string;
  href: `#${string}`;
  label: string;
  resolvesTo: "mission_console_section";
  localOnly: true;
  routeFree: true;
}

export interface ReviewSurfaceIndexSourceCountView {
  label: string;
  value: number;
  sourcePath: string;
}

export interface ReviewSurfaceIndexRowView {
  surfaceId: string;
  stageNumber: number;
  localOrder: number;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  label: string;
  summary: string;
  sourceSchema: string;
  sourceContractLabel: string;
  localStatus: ReplayPlaybackView["localStatus"];
  localStatusLabel: string;
  statusLabel: string;
  anchor: ReviewSurfaceAnchorReferenceView;
  sourceLabels: string[];
  sourceCounts: ReviewSurfaceIndexSourceCountView[];
  sourceSurfaceId: string;
  deferredBoundaryCount: number;
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewSurfaceWorkflowGroupView {
  groupId: string;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  order: number;
  label: string;
  summary: string;
  rowCount: number;
  rowIds: string[];
  anchorIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewSurfaceDeferredBoundaryNoteView {
  noteId: string;
  label: string;
  summary: string;
  sourceSurfaceIds: string[];
  sourceAnchorIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  informationalOnly: true;
  nonCertifying: true;
}

export interface ReviewSurfaceIndexSummaryView {
  indexId: "candidate-local-review-surface-index";
  label: string;
  summary: string;
  defaultSurfaceId: string;
  defaultAnchorId: string;
  informationalOnly: true;
  nonCertifying: true;
  counts: {
    totalSurfaceCount: number;
    workflowGroupCount: number;
    localAnchorCount: number;
    sourceSchemaCount: number;
    sourceCountMetricCount: number;
    deferredBoundaryNoteCount: number;
    decisionSurfaceCount: number;
    actionSurfaceCount: number;
    readinessSurfaceCount: number;
    evidenceSurfaceCount: number;
    proofSurfaceCount: number;
    navigatorSurfaceCount: number;
    reconciliationSurfaceCount: number;
  };
}

export interface ReviewSurfaceIndexView {
  schema: "telemforge.review_surface_index.v1";
  version: 1;
  contractLabel: "local deterministic review surface index and navigation map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewSurfaceIndexSummaryView;
  rows: ReviewSurfaceIndexRowView[];
  workflowGroups: ReviewSurfaceWorkflowGroupView[];
  anchorReferences: ReviewSurfaceAnchorReferenceView[];
  deferredBoundaryNotes: ReviewSurfaceDeferredBoundaryNoteView[];
  staticBoundarySummary: string;
  sourceReconciliation: ReviewProofReconciliationView;
}

export interface ReviewWalkthroughLocalCountSummaryView {
  stepCount: number;
  anchorCount: number;
  sourceSchemaCount: number;
  sourceCountMetricCount: number;
  deferredBoundaryCount: number;
}

export interface ReviewWalkthroughStepView {
  stepId: string;
  stepNumber: number;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  label: string;
  summary: string;
  sourceSurfaceId: string;
  sourceStageNumber: number;
  sourceSchema: string;
  sourceContractLabel: string;
  localStatusLabel: string;
  statusLabel: string;
  anchor: ReviewSurfaceAnchorReferenceView;
  usefulCounts: ReviewSurfaceIndexSourceCountView[];
  sourceLabels: string[];
  staticInspectionPrompt: string;
  expectedObservation: string;
  deferredBoundaryCount: number;
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewWalkthroughPromptGroupView {
  promptGroupId: string;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  order: number;
  label: string;
  summary: string;
  staticInspectionPrompt: string;
  expectedObservation: string;
  stepIds: string[];
  anchorIds: string[];
  localCounts: ReviewWalkthroughLocalCountSummaryView;
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewWalkthroughDeferredBoundaryNoteView {
  noteId: string;
  label: string;
  summary: string;
  sourceStepIds: string[];
  sourceSurfaceIds: string[];
  sourceAnchorIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewWalkthroughSummaryView {
  walkthroughId: "candidate-local-review-walkthrough-path";
  label: string;
  summary: string;
  defaultStepId: string;
  defaultAnchorId: string;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  counts: {
    totalStepCount: number;
    promptGroupCount: number;
    localAnchorCount: number;
    sourceSchemaCount: number;
    sourceCountMetricCount: number;
    deferredBoundaryNoteCount: number;
    localOnlyStepCount: number;
  };
}

export interface ReviewWalkthroughPathView {
  schema: "telemforge.review_walkthrough_path.v1";
  version: 1;
  contractLabel: "local deterministic review walkthrough path and static prompt deck";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewWalkthroughSummaryView;
  steps: ReviewWalkthroughStepView[];
  promptGroups: ReviewWalkthroughPromptGroupView[];
  anchorReferences: ReviewSurfaceAnchorReferenceView[];
  deferredBoundaryNotes: ReviewWalkthroughDeferredBoundaryNoteView[];
  staticBoundarySummary: string;
  sourceSurfaceIndex: ReviewSurfaceIndexView;
}

export type ReviewObservationAttentionKind =
  | "source_alignment"
  | "anchor_resolution"
  | "count_signal"
  | "deferred_boundary";

export interface ReviewObservationSourceReferenceView {
  sourceReferenceId: string;
  sourceStepId: string;
  sourceSurfaceId: string;
  sourceStageNumber: number;
  sourceSchema: string;
  sourceContractLabel: string;
  sourceLabels: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewObservationAnchorReferenceView {
  anchorReferenceId: string;
  sourceStepId: string;
  anchorId: string;
  href: string;
  label: string;
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
}

export interface ReviewObservationCountSignalView {
  signalId: string;
  sourceStepId: string;
  sourceSurfaceId: string;
  label: string;
  value: number;
  sourcePath: string;
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewObservationDeferredBoundarySummaryView {
  summaryId: string;
  sourceNoteId: string;
  label: string;
  summary: string;
  sourceStepIds: string[];
  sourceSurfaceIds: string[];
  sourceAnchorIds: string[];
  actionability: "deferred_non_actionable";
  nonActionable: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
}

export interface ReviewObservationRowView {
  observationRowId: string;
  observationNumber: number;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  label: string;
  summary: string;
  sourceStepId: string;
  sourceSurfaceId: string;
  sourceStageNumber: number;
  sourceSchema: string;
  sourceContractLabel: string;
  localStatusLabel: string;
  statusLabel: string;
  anchor: ReviewSurfaceAnchorReferenceView;
  sourceReferenceId: string;
  countSignalIds: string[];
  deferredBoundarySummaryIds: string[];
  sourceLabels: string[];
  staticInspectionPrompt: string;
  staticExpectedObservation: string;
  attentionKinds: ReviewObservationAttentionKind[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationAttentionGroupView {
  attentionGroupId: string;
  kind: ReviewObservationAttentionKind;
  order: number;
  label: string;
  summary: string;
  observationRowIds: string[];
  anchorIds: string[];
  countSignalIds: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationSummaryView {
  lensId: "candidate-local-review-observation-lens";
  label: string;
  summary: string;
  defaultObservationRowId: string;
  defaultAnchorId: string;
  defaultAttentionGroupId: string;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    totalObservationRowCount: number;
    attentionGroupCount: number;
    localAnchorCount: number;
    sourceReferenceCount: number;
    countSignalCount: number;
    deferredBoundarySummaryCount: number;
    staticExpectedObservationCount: number;
    localOnlyObservationCount: number;
  };
}

export interface ReviewObservationLensView {
  schema: "telemforge.review_observation_lens.v1";
  version: 1;
  contractLabel: "local deterministic review observation lens and static attention map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationSummaryView;
  observationRows: ReviewObservationRowView[];
  attentionGroups: ReviewObservationAttentionGroupView[];
  sourceReferences: ReviewObservationSourceReferenceView[];
  anchorReferences: ReviewObservationAnchorReferenceView[];
  countSignals: ReviewObservationCountSignalView[];
  deferredBoundarySummaries: ReviewObservationDeferredBoundarySummaryView[];
  staticAttentionSummary: string;
  sourceWalkthroughPath: ReviewWalkthroughPathView;
}

export type ReviewObservationBlindSpotKind =
  | "absent_saved_review_state"
  | "absent_identity_or_signoff"
  | "absent_execution_or_scoring"
  | "deferred_production_boundary";

export interface ReviewObservationCoveragePhaseRowView {
  phaseRowId: string;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  order: number;
  label: string;
  summary: string;
  observationRowIds: string[];
  sourceStageNumbers: number[];
  anchorIds: string[];
  attentionKinds: ReviewObservationAttentionKind[];
  countSignalIds: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCoverageSourceStageRowView {
  sourceStageRowId: string;
  sourceStageNumber: number;
  label: string;
  observationRowIds: string[];
  workflowGroups: ReviewSurfaceWorkflowGroupKind[];
  sourceSchemas: string[];
  sourceContractLabels: string[];
  anchorIds: string[];
  countSignalIds: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCoverageAttentionRowView {
  attentionCoverageRowId: string;
  sourceAttentionGroupId: string;
  kind: ReviewObservationAttentionKind;
  order: number;
  label: string;
  summary: string;
  observationRowIds: string[];
  anchorIds: string[];
  countSignalIds: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCoverageAnchorSummaryView {
  totalAnchorCount: number;
  coveredObservationRowCount: number;
  localHrefCount: number;
  anchorIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
}

export interface ReviewObservationCoverageCountSignalSummaryView {
  totalSignalCount: number;
  coveredObservationRowCount: number;
  sourcePaths: string[];
  signalIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCoverageDeferredBoundarySummaryView {
  totalBoundaryCount: number;
  affectedObservationRowIds: string[];
  sourceAnchorIds: string[];
  summaryIds: string[];
  informationalOnly: true;
  nonActionable: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCoverageBlindSpotRowView {
  blindSpotRowId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  sourceDeferredBoundarySummaryIds: string[];
  staticReviewContext: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationCoverageSummaryView {
  coverageId: "candidate-local-review-observation-coverage";
  label: string;
  summary: string;
  defaultPhaseRowId: string;
  defaultSourceStageRowId: string;
  defaultAttentionCoverageRowId: string;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    phaseCoverageRowCount: number;
    sourceStageCoverageRowCount: number;
    attentionCoverageRowCount: number;
    localAnchorCount: number;
    countSignalCount: number;
    deferredBoundaryCount: number;
    blindSpotRowCount: number;
    localOnlyCoverageRowCount: number;
  };
}

export interface ReviewObservationCoverageView {
  schema: "telemforge.review_observation_coverage.v1";
  version: 1;
  contractLabel: "local deterministic observation coverage matrix and static blind-spot map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationCoverageSummaryView;
  phaseCoverageRows: ReviewObservationCoveragePhaseRowView[];
  sourceStageCoverageRows: ReviewObservationCoverageSourceStageRowView[];
  attentionCoverageRows: ReviewObservationCoverageAttentionRowView[];
  anchorCoverage: ReviewObservationCoverageAnchorSummaryView;
  countSignalCoverage: ReviewObservationCoverageCountSignalSummaryView;
  deferredBoundaryCoverage: ReviewObservationCoverageDeferredBoundarySummaryView;
  blindSpotRows: ReviewObservationCoverageBlindSpotRowView[];
  staticCoverageSummary: string;
  sourceObservationLens: ReviewObservationLensView;
}

export interface ReviewObservationCitationCountSignalView {
  citationId: string;
  sourceSignalId: string;
  sourceObservationRowId: string;
  sourceStepId: string;
  sourceSurfaceId: string;
  label: string;
  value: number;
  sourcePath: string;
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCitationDeferredBoundaryView {
  citationId: string;
  sourceSummaryId: string;
  sourceObservationRowIds: string[];
  label: string;
  summaryReference: string;
  sourceAnchorIds: string[];
  nonActionable: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCitationRowView {
  citationRowId: string;
  sourceObservationRowId: string;
  sourceCoveragePhaseRowId: string;
  sourceCoverageStageRowId: string;
  observationNumber: number;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  sourceStageNumber: number;
  label: string;
  sourceSchema: string;
  sourceContractLabel: string;
  sourceReferenceId: string;
  localAnchor: {
    anchorId: string;
    href: string;
    label: string;
    inPageOnly: true;
  };
  countSignalCitationIds: string[];
  countSignalSourcePaths: string[];
  deferredBoundaryCitationIds: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCitationPhaseGroupView {
  phaseCitationGroupId: string;
  sourceCoveragePhaseRowId: string;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  order: number;
  label: string;
  citationRowIds: string[];
  sourceStageNumbers: number[];
  anchorIds: string[];
  countSignalCitationIds: string[];
  deferredBoundaryCitationIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCitationAnchorGroupView {
  anchorCitationGroupId: string;
  anchorId: string;
  href: string;
  label: string;
  citationRowIds: string[];
  sourceStageNumbers: number[];
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
}

export interface ReviewObservationCitationSourceMapRowView {
  sourceMapRowId: string;
  sourceCoverageStageRowId: string;
  sourceStageNumber: number;
  label: string;
  workflowGroups: ReviewSurfaceWorkflowGroupKind[];
  sourceSchemas: string[];
  sourceContractLabels: string[];
  citationRowIds: string[];
  anchorHrefs: string[];
  countSignalSourcePaths: string[];
  deferredBoundarySummaryIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationCitationBlindSpotNoteView {
  citationNoteId: string;
  sourceBlindSpotRowId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  sourceDeferredBoundarySummaryIds: string[];
  staticReviewContext: true;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationCitationSummaryView {
  citationTrailId: "candidate-local-review-observation-citation-trail";
  label: string;
  summary: string;
  defaultCitationRowId: string;
  defaultSourceMapRowId: string;
  defaultPhaseCitationGroupId: string;
  informationalOnly: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    citationRowCount: number;
    sourceMapRowCount: number;
    phaseCitationGroupCount: number;
    anchorCitationGroupCount: number;
    countSignalCitationCount: number;
    deferredBoundaryCitationCount: number;
    blindSpotCitationNoteCount: number;
  };
}

export interface ReviewObservationCitationTrailView {
  schema: "telemforge.review_observation_citations.v1";
  version: 1;
  contractLabel: "local deterministic observation citation trail and source map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationCitationSummaryView;
  citationRows: ReviewObservationCitationRowView[];
  sourceMapRows: ReviewObservationCitationSourceMapRowView[];
  phaseCitationGroups: ReviewObservationCitationPhaseGroupView[];
  anchorCitationGroups: ReviewObservationCitationAnchorGroupView[];
  countSignalCitations: ReviewObservationCitationCountSignalView[];
  deferredBoundaryCitations: ReviewObservationCitationDeferredBoundaryView[];
  blindSpotCitationNotes: ReviewObservationCitationBlindSpotNoteView[];
  staticCitationSummary: string;
  sourceObservationCoverage: ReviewObservationCoverageView;
}

export interface ReviewObservationBoundaryLedgerRowView {
  boundaryRowId: string;
  sourceBoundaryCitationId: string;
  sourceSummaryId: string;
  label: string;
  sourceSummary: string;
  sourceAnchorIds: string[];
  sourceAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedCitationRowIds: string[];
  relatedSourceStageNumbers: number[];
  staticNonGoalNoteIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationBoundaryObservationGroupView {
  observationGroupId: string;
  sourceCitationRowId: string;
  sourceObservationRowId: string;
  observationNumber: number;
  label: string;
  workflowGroup: ReviewSurfaceWorkflowGroupKind;
  sourceStageNumber: number;
  localAnchor: {
    anchorId: string;
    href: string;
    label: string;
    inPageOnly: true;
  };
  boundaryRowIds: string[];
  sourceSummaryIds: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationBoundaryAnchorGroupView {
  anchorGroupId: string;
  sourceAnchorCitationGroupId: string;
  anchorId: string;
  href: string;
  label: string;
  boundaryRowIds: string[];
  relatedObservationRowIds: string[];
  relatedSourceStageNumbers: number[];
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
}

export interface ReviewObservationBoundarySourceStageGroupView {
  sourceStageGroupId: string;
  sourceMapRowId: string;
  sourceStageNumber: number;
  label: string;
  sourceSchemas: string[];
  sourceContractLabels: string[];
  boundaryRowIds: string[];
  relatedObservationRowIds: string[];
  anchorHrefs: string[];
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationBoundaryStaticNonGoalNoteView {
  nonGoalNoteId: string;
  sourceBlindSpotCitationNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  relatedBoundaryRowIds: string[];
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  staticReviewContext: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationBoundaryLedgerSummaryView {
  ledgerId: "candidate-local-review-observation-boundary-ledger";
  label: string;
  summary: string;
  defaultBoundaryRowId: string;
  defaultObservationReferenceGroupId: string;
  defaultAnchorReferenceGroupId: string;
  defaultSourceStageBoundaryGroupId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    boundaryRowCount: number;
    observationReferenceGroupCount: number;
    anchorReferenceGroupCount: number;
    sourceStageBoundaryGroupCount: number;
    staticNonGoalNoteCount: number;
    sourceCitationRowCount: number;
  };
}

export interface ReviewObservationBoundaryLedgerView {
  schema: "telemforge.review_observation_boundary_ledger.v1";
  version: 1;
  contractLabel: "local deterministic deferred-boundary ledger and static non-goal map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationBoundaryLedgerSummaryView;
  boundaryRows: ReviewObservationBoundaryLedgerRowView[];
  observationReferenceGroups: ReviewObservationBoundaryObservationGroupView[];
  anchorReferenceGroups: ReviewObservationBoundaryAnchorGroupView[];
  sourceStageBoundaryGroups: ReviewObservationBoundarySourceStageGroupView[];
  staticNonGoalNotes: ReviewObservationBoundaryStaticNonGoalNoteView[];
  staticBoundarySummary: string;
  sourceObservationCitations: ReviewObservationCitationTrailView;
}

export interface ReviewObservationBoundaryWalkthroughStaticContextView {
  nonGoalNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  staticReviewContext: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationBoundaryWalkthroughStepView {
  stepId: string;
  stepNumber: number;
  sourceBoundaryRowId: string;
  sourceBoundaryCitationId: string;
  sourceSummaryId: string;
  label: string;
  sourceSummary: string;
  sourceAnchorIds: string[];
  sourceAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedCitationRowIds: string[];
  relatedSourceStageNumbers: number[];
  staticNonGoalNoteIds: string[];
  sourcePathGroupIds: string[];
  staticGuardrailGroupIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationBoundarySourcePathGroupView {
  sourcePathGroupId: string;
  sourceStageGroupId: string;
  sourceMapRowId: string;
  sourceStageNumber: number;
  label: string;
  sourceSchemas: string[];
  sourceContractLabels: string[];
  boundaryRowIds: string[];
  boundaryStepIds: string[];
  relatedObservationRowIds: string[];
  anchorHrefs: string[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationBoundaryStaticGuardrailGroupView {
  guardrailGroupId: string;
  sourceNonGoalNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  boundaryRowIds: string[];
  boundaryStepIds: string[];
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  localOnly: true;
  staticReviewContext: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationBoundaryWalkthroughDefaultFocusView {
  walkthroughId: "candidate-local-review-observation-boundary-walkthrough";
  label: string;
  summary: string;
  defaultStepId: string;
  sourceBoundaryRowId: string;
  sourceSummaryId: string;
  sourceAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedSourceStageNumbers: number[];
  staticNonGoalNoteIds: string[];
  localOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationBoundaryWalkthroughSummaryView {
  walkthroughId: "candidate-local-review-observation-boundary-walkthrough";
  label: string;
  summary: string;
  defaultStepId: string;
  defaultSourcePathGroupId: string;
  defaultStaticGuardrailGroupId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    boundaryStepCount: number;
    sourcePathGroupCount: number;
    staticGuardrailGroupCount: number;
    sourceLedgerBoundaryRowCount: number;
    sourceLedgerObservationReferenceGroupCount: number;
    sourceLedgerAnchorReferenceGroupCount: number;
  };
}

export interface ReviewObservationBoundaryWalkthroughView {
  schema: "telemforge.review_observation_boundary_walkthrough.v1";
  version: 1;
  contractLabel: "local deterministic boundary walkthrough and static source path";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationBoundaryWalkthroughSummaryView;
  defaultFocus: ReviewObservationBoundaryWalkthroughDefaultFocusView;
  steps: ReviewObservationBoundaryWalkthroughStepView[];
  sourcePathGroups: ReviewObservationBoundarySourcePathGroupView[];
  staticGuardrailGroups: ReviewObservationBoundaryStaticGuardrailGroupView[];
  staticWalkthroughSummary: string;
  sourceObservationBoundaryLedger: ReviewObservationBoundaryLedgerView;
}

export interface ReviewObservationStorylinePriorSurfaceReferenceView {
  referenceId: string;
  sourceStageNumber: number;
  surfaceId:
    | "review-observation-citations"
    | "review-observation-boundary-ledger"
    | "review-observation-boundary-walkthrough";
  label: string;
  anchorHref: string;
  sourceIds: string[];
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationStorylineSegmentView {
  segmentId: string;
  segmentNumber: number;
  sourceStepId: string;
  sourceBoundaryRowId: string;
  sourceBoundaryCitationId: string;
  sourceSummaryId: string;
  label: string;
  sourceSummary: string;
  sourceAnchorIds: string[];
  sourceAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedCitationRowIds: string[];
  relatedSourceStageNumbers: number[];
  staticNonGoalNoteIds: string[];
  sourcePathGroupIds: string[];
  sourceStageEvidenceGroupIds: string[];
  staticGuardrailGroupIds: string[];
  staticGuardrailReferenceIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  priorSurfaceReferences: ReviewObservationStorylinePriorSurfaceReferenceView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationStorylineSourceStageEvidenceGroupView {
  evidenceGroupId: string;
  sourcePathGroupId: string;
  sourceStageGroupId: string;
  sourceMapRowId: string;
  sourceStageNumber: number;
  label: string;
  sourceSchemas: string[];
  sourceContractLabels: string[];
  sourceBoundaryRowIds: string[];
  sourceStepIds: string[];
  segmentIds: string[];
  relatedObservationRowIds: string[];
  sourceAnchorHrefs: string[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationStorylineStaticGuardrailReferenceView {
  guardrailReferenceId: string;
  sourceGuardrailGroupId: string;
  sourceNonGoalNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  sourceBoundaryRowIds: string[];
  sourceStepIds: string[];
  segmentIds: string[];
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  localOnly: true;
  staticReviewContext: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationStorylineDefaultOpeningView {
  storylineId: "candidate-local-review-observation-storyline";
  label: string;
  summary: string;
  defaultOpeningSegmentId: string;
  sourceStepId: string;
  sourceBoundaryRowId: string;
  sourceSummaryId: string;
  sourceAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedSourceStageNumbers: number[];
  staticGuardrailReferenceIds: string[];
  priorSurfaceReferences: ReviewObservationStorylinePriorSurfaceReferenceView[];
  localOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationStorylineSummaryView {
  storylineId: "candidate-local-review-observation-storyline";
  label: string;
  summary: string;
  defaultOpeningSegmentId: string;
  defaultSourceStageEvidenceGroupId: string;
  defaultStaticGuardrailReferenceId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    storylineSegmentCount: number;
    sourceStageEvidenceGroupCount: number;
    staticGuardrailReferenceCount: number;
    priorSurfaceReferenceCount: number;
    sourceWalkthroughStepCount: number;
    sourceBoundaryLedgerRowCount: number;
  };
}

export interface ReviewObservationStorylineView {
  schema: "telemforge.review_observation_storyline.v1";
  version: 1;
  contractLabel: "local deterministic observation storyline and static evidence path";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationStorylineSummaryView;
  defaultOpening: ReviewObservationStorylineDefaultOpeningView;
  segments: ReviewObservationStorylineSegmentView[];
  sourceStageEvidenceGroups: ReviewObservationStorylineSourceStageEvidenceGroupView[];
  staticGuardrailReferences: ReviewObservationStorylineStaticGuardrailReferenceView[];
  staticStorylineSummary: string;
  sourceObservationBoundaryWalkthrough: ReviewObservationBoundaryWalkthroughView;
}

export interface ReviewObservationHandoffDeckCardView {
  cardId: string;
  cardNumber: number;
  sourceSegmentId: string;
  sourceStepId: string;
  sourceBoundaryRowId: string;
  sourceBoundaryCitationId: string;
  sourceSummaryId: string;
  label: string;
  sourceSummary: string;
  localAnchorIds: string[];
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedCitationRowIds: string[];
  relatedSourceStageNumbers: number[];
  sourceStageEvidenceGroupIds: string[];
  sourceStagePromptIds: string[];
  guardrailReminderIds: string[];
  priorSurfacePromptIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDeckReviewPathCheckpointView {
  checkpointId: string;
  cardId: string;
  sourceSegmentId: string;
  label: string;
  summary: string;
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  sourceStagePromptIds: string[];
  guardrailReminderIds: string[];
  priorSurfacePromptIds: string[];
  manualReviewOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDeckSourceStagePromptView {
  promptId: string;
  sourceStageEvidenceGroupId: string;
  sourcePathGroupId: string;
  sourceStageGroupId: string;
  sourceMapRowId: string;
  sourceStageNumber: number;
  label: string;
  prompt: string;
  sourceSchemas: string[];
  sourceContractLabels: string[];
  segmentIds: string[];
  relatedObservationRowIds: string[];
  sourceAnchorHrefs: string[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffDeckGuardrailReminderView {
  reminderId: string;
  sourceGuardrailReferenceId: string;
  sourceNonGoalNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  reminder: string;
  sourceObservationRowIds: string[];
  sourceAnchorIds: string[];
  segmentIds: string[];
  localOnly: true;
  staticReviewContext: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDeckPriorSurfacePromptView {
  promptId: string;
  sourcePriorSurfaceReferenceId: string;
  sourceSegmentId: string;
  sourceStageNumber: number;
  surfaceId: ReviewObservationStorylinePriorSurfaceReferenceView["surfaceId"];
  label: string;
  anchorHref: string;
  sourceIds: string[];
  prompt: string;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffDeckDefaultReviewContextView {
  defaultReviewContextId: "candidate-local-review-observation-handoff-deck-default";
  label: string;
  summary: string;
  defaultHandoffCardId: string;
  sourceOpeningSegmentId: string;
  sourceStepId: string;
  sourceBoundaryRowId: string;
  sourceSummaryId: string;
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedSourceStageNumbers: number[];
  localOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffDeckSummaryView {
  deckId: "candidate-local-review-observation-handoff-deck";
  label: string;
  summary: string;
  defaultHandoffCardId: string;
  defaultReviewContextId: "candidate-local-review-observation-handoff-deck-default";
  defaultSourceStagePromptId: string;
  defaultGuardrailReminderId: string;
  defaultPriorSurfacePromptId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    handoffCardCount: number;
    reviewPathCheckpointCount: number;
    sourceStagePromptCount: number;
    guardrailReminderCount: number;
    priorSurfacePromptCount: number;
    sourceStorylineSegmentCount: number;
    sourceStageEvidenceGroupCount: number;
  };
}

export interface ReviewObservationHandoffDeckView {
  schema: "telemforge.review_observation_handoff_deck.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff deck and static review path";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffDeckSummaryView;
  defaultReviewContext: ReviewObservationHandoffDeckDefaultReviewContextView;
  cards: ReviewObservationHandoffDeckCardView[];
  reviewPathCheckpoints: ReviewObservationHandoffDeckReviewPathCheckpointView[];
  sourceStagePrompts: ReviewObservationHandoffDeckSourceStagePromptView[];
  guardrailReminders: ReviewObservationHandoffDeckGuardrailReminderView[];
  priorSurfacePrompts: ReviewObservationHandoffDeckPriorSurfacePromptView[];
  staticHandoffSummary: string;
  sourceObservationStoryline: ReviewObservationStorylineView;
}

export interface ReviewObservationHandoffCoverageSourceSummaryCoverageView {
  sourceSummaryId: string;
  sourceHandoffCardId: string;
  label: string;
  sourceSummary: string;
  coverageLabel: string;
  coveredByLocalCard: true;
  localOnly: true;
  sourceBacked: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffCoverageRowView {
  coverageRowId: string;
  rowNumber: number;
  sourceHandoffCardId: string;
  sourceSegmentId: string;
  label: string;
  sourceSummaryCoverage: ReviewObservationHandoffCoverageSourceSummaryCoverageView;
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  sourceStagePromptIds: string[];
  guardrailReminderIds: string[];
  priorSurfacePromptIds: string[];
  staticGapNoteIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffCoverageStaticGapNoteView {
  gapNoteId: string;
  coverageRowId: string;
  sourceHandoffCardId: string;
  label: string;
  summary: string;
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  sourceStagePromptIds: string[];
  guardrailReminderIds: string[];
  priorSurfacePromptIds: string[];
  explanatoryOnly: true;
  notAReadinessScore: true;
  notACertification: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffCoverageSourceCoverageGroupView {
  sourceCoverageGroupId: string;
  sourceStagePromptId: string;
  sourceStageNumber: number;
  label: string;
  summary: string;
  sourceAnchorHrefs: string[];
  coverageRowIds: string[];
  relatedObservationRowIds: string[];
  sourceSchemas: string[];
  sourceContractLabels: string[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
}

export interface ReviewObservationHandoffCoverageDeferredScopeReminderView {
  reminderId: string;
  sourceNonGoalNoteId: string;
  kind: ReviewObservationBlindSpotKind;
  label: string;
  summary: string;
  coverageRowIds: string[];
  sourceHandoffCardIds: string[];
  relatedObservationRowIds: string[];
  localAnchorHrefs: string[];
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffCoverageSummaryView {
  coverageId: "candidate-local-review-observation-handoff-coverage";
  label: string;
  summary: string;
  defaultCoverageRowId: string;
  defaultStaticGapNoteId: string;
  defaultSourceCoverageGroupId: string;
  defaultDeferredScopeReminderId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    coverageRowCount: number;
    staticGapNoteCount: number;
    sourceCoverageGroupCount: number;
    deferredScopeReminderCount: number;
    sourceHandoffCardCount: number;
    sourceStagePromptCount: number;
    guardrailReminderCount: number;
    priorSurfacePromptCount: number;
  };
}

export interface ReviewObservationHandoffCoverageView {
  schema: "telemforge.review_observation_handoff_coverage.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff coverage and static gap map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffCoverageSummaryView;
  defaultCoverageRow: ReviewObservationHandoffCoverageRowView;
  coverageRows: ReviewObservationHandoffCoverageRowView[];
  staticGapNotes: ReviewObservationHandoffCoverageStaticGapNoteView[];
  sourceCoverageGroups: ReviewObservationHandoffCoverageSourceCoverageGroupView[];
  deferredScopeReminders: ReviewObservationHandoffCoverageDeferredScopeReminderView[];
  staticCoverageSummary: string;
  sourceObservationHandoffDeck: ReviewObservationHandoffDeckView;
}

export interface ReviewObservationHandoffQuestionsSourceSummaryReferenceView {
  sourceSummaryId: string;
  sourceHandoffCardId: string;
  sourceCoverageRowId: string;
  label: string;
  sourceSummary: string;
  coverageLabel: string;
}

export interface ReviewObservationHandoffQuestionsPromptGroupView {
  promptGroupId: string;
  groupNumber: number;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  label: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHrefs: string[];
  relatedObservationRowIds: string[];
  relatedCoverageRowIds: string[];
  relatedGapNoteIds: string[];
  relatedDeferredScopeIds: string[];
  reviewQuestionIds: string[];
  evidencePromptIds: string[];
  gapPromptIds: string[];
  deferredScopePromptIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffQuestionView {
  questionId: string;
  promptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  label: string;
  question: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHrefs: string[];
  relatedCoverageRowIds: string[];
  relatedGapNoteIds: string[];
  relatedDeferredScopeIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffEvidencePromptView {
  promptId: string;
  promptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  label: string;
  prompt: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHrefs: string[];
  relatedCoverageRowIds: string[];
  relatedGapNoteIds: string[];
  relatedDeferredScopeIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffGapPromptView {
  promptId: string;
  promptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceGapNoteId: string;
  label: string;
  prompt: string;
  localAnchorHrefs: string[];
  relatedCoverageRowIds: string[];
  relatedGapNoteIds: string[];
  relatedDeferredScopeIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDeferredScopePromptView {
  promptId: string;
  promptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceDeferredScopeId: string;
  label: string;
  prompt: string;
  localAnchorHrefs: string[];
  relatedCoverageRowIds: string[];
  relatedGapNoteIds: string[];
  relatedDeferredScopeIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffQuestionsSummaryView {
  promptRailId: "candidate-local-review-observation-handoff-questions";
  label: string;
  summary: string;
  defaultPromptGroupId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    promptGroupCount: number;
    reviewQuestionCount: number;
    evidencePromptCount: number;
    gapPromptCount: number;
    deferredScopePromptCount: number;
    sourceCoverageRowCount: number;
    sourceStaticGapNoteCount: number;
    sourceCoverageGroupCount: number;
    sourceDeferredScopeReminderCount: number;
  };
}

export interface ReviewObservationHandoffQuestionsView {
  schema: "telemforge.review_observation_handoff_questions.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff questions and static prompt rail";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffQuestionsSummaryView;
  defaultPromptGroup: ReviewObservationHandoffQuestionsPromptGroupView;
  promptGroups: ReviewObservationHandoffQuestionsPromptGroupView[];
  reviewQuestions: ReviewObservationHandoffQuestionView[];
  evidencePrompts: ReviewObservationHandoffEvidencePromptView[];
  gapPrompts: ReviewObservationHandoffGapPromptView[];
  deferredScopePrompts: ReviewObservationHandoffDeferredScopePromptView[];
  staticPromptRailSummary: string;
  sourceObservationHandoffCoverage: ReviewObservationHandoffCoverageView;
}

export interface ReviewObservationHandoffAgendaSectionView {
  sectionId: string;
  sectionNumber: number;
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  label: string;
  goal: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHrefs: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  facilitationPromptIds: string[];
  evidenceStopIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffAgendaFacilitationPromptView {
  promptId: string;
  sectionId: string;
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceReviewQuestionId: string;
  label: string;
  prompt: string;
  localAnchorHrefs: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffAgendaEvidenceStopView {
  stopId: string;
  sectionId: string;
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceEvidencePromptId: string;
  label: string;
  summary: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHrefs: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffAgendaGapDiscussionPointView {
  pointId: string;
  sectionId: string;
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceGapPromptId: string;
  label: string;
  discussionPoint: string;
  localAnchorHrefs: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffAgendaDeferredScopeReminderView {
  reminderId: string;
  sectionId: string;
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceDeferredScopePromptId: string;
  label: string;
  reminder: string;
  localAnchorHrefs: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  explanatoryOnly: true;
  localOnly: true;
  inPageOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffAgendaSummaryView {
  agendaId: "candidate-local-review-observation-handoff-agenda";
  label: string;
  summary: string;
  defaultAgendaSectionId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    agendaSectionCount: number;
    facilitationPromptCount: number;
    evidenceStopCount: number;
    gapDiscussionPointCount: number;
    deferredScopeReminderCount: number;
    sourcePromptGroupCount: number;
    sourceReviewQuestionCount: number;
    sourceEvidencePromptCount: number;
    sourceGapPromptCount: number;
    sourceDeferredScopePromptCount: number;
  };
}

export interface ReviewObservationHandoffAgendaView {
  schema: "telemforge.review_observation_handoff_agenda.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff agenda and static facilitation guide";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffAgendaSummaryView;
  defaultAgendaSection: ReviewObservationHandoffAgendaSectionView;
  sections: ReviewObservationHandoffAgendaSectionView[];
  facilitationPrompts: ReviewObservationHandoffAgendaFacilitationPromptView[];
  evidenceStops: ReviewObservationHandoffAgendaEvidenceStopView[];
  gapDiscussionPoints: ReviewObservationHandoffAgendaGapDiscussionPointView[];
  deferredScopeReminders: ReviewObservationHandoffAgendaDeferredScopeReminderView[];
  staticFacilitationGuideSummary: string;
  sourceObservationHandoffQuestions: ReviewObservationHandoffQuestionsView;
}

export type ReviewObservationHandoffPathSourceKind =
  | "agenda_section"
  | "prompt_group"
  | "coverage_row"
  | "handoff_card";

export interface ReviewObservationHandoffPathStaticNonGoalFlagsView {
  noSavedPathProgress: true;
  noSavedAgendaProgress: true;
  noSavedQuestionAnswers: true;
  noSavedSelections: true;
  noRouteChanges: true;
  noCommandExecution: true;
  noExports: true;
  noSignoff: true;
  noOwnerAssignment: true;
  noScoring: true;
  noCertification: true;
}

export interface ReviewObservationHandoffPathSourceReferenceView {
  referenceId: string;
  sourceKind: ReviewObservationHandoffPathSourceKind;
  sourceId: string;
  label: string;
}

export interface ReviewObservationHandoffPathStepView {
  pathStepId: string;
  stepNumber: number;
  label: string;
  summary: string;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  relatedReviewQuestionIds: string[];
  relatedEvidencePromptIds: string[];
  relatedGapPromptIds: string[];
  relatedDeferredScopePromptIds: string[];
  relatedFacilitationPromptIds: string[];
  relatedEvidenceStopIds: string[];
  relatedGapDiscussionPointIds: string[];
  relatedDeferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticReviewPrompt: string;
  staticNonGoalFlags: ReviewObservationHandoffPathStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffPathAnchorMapEntryView {
  anchorEntryId: string;
  sourcePathStepId: string;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  anchorOrder: number;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  relatedFacilitationPromptIds: string[];
  relatedEvidenceStopIds: string[];
  relatedGapDiscussionPointIds: string[];
  relatedDeferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffPathStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffPathSummaryView {
  pathId: "candidate-local-review-observation-handoff-path";
  label: string;
  summary: string;
  defaultPathStepId: string;
  defaultAnchorTargetId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    pathStepCount: number;
    anchorMapEntryCount: number;
    sourceAgendaSectionCount: number;
    sourceFacilitationPromptCount: number;
    sourceEvidenceStopCount: number;
    sourceGapDiscussionPointCount: number;
    sourceDeferredScopeReminderCount: number;
    localOnlyPathStepCount: number;
  };
}

export interface ReviewObservationHandoffPathView {
  schema: "telemforge.review_observation_handoff_path.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff path and static anchor map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffPathSummaryView;
  defaultPathStep: ReviewObservationHandoffPathStepView;
  pathSteps: ReviewObservationHandoffPathStepView[];
  anchorMapEntries: ReviewObservationHandoffPathAnchorMapEntryView[];
  staticAnchorMapSummary: string;
  sourceObservationHandoffAgenda: ReviewObservationHandoffAgendaView;
}

export interface ReviewObservationHandoffDryRunStaticNonGoalFlagsView {
  noSavedDryRunProgress: true;
  noSavedRehearsalSessions: true;
  noSavedPathProgress: true;
  noSavedAgendaProgress: true;
  noSavedQuestionAnswers: true;
  noSavedSelections: true;
  noRouteChanges: true;
  noCommandExecution: true;
  noExports: true;
  noSignoff: true;
  noOwnerAssignment: true;
  noScoring: true;
  noCertification: true;
  noMeetingWorkflow: true;
}

export interface ReviewObservationHandoffDryRunCueView {
  cueId: string;
  cueNumber: number;
  label: string;
  summary: string;
  dryRunPrompt: string;
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  facilitationPromptIds: string[];
  reviewQuestionIds: string[];
  evidencePromptIds: string[];
  gapPromptIds: string[];
  deferredScopePromptIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffDryRunStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDryRunCueAnchorCoverageEntryView {
  cueAnchorCoverageEntryId: string;
  coverageOrder: number;
  sourceCueId: string;
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorEntryId: string;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceHandoffCardId: string;
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceAnchorOrder: number;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffDryRunStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDryRunSummaryView {
  dryRunId: "candidate-local-review-observation-handoff-dry-run";
  label: string;
  summary: string;
  defaultCueId: string;
  defaultAnchorTargetId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    dryRunCueCount: number;
    cueAnchorCoverageEntryCount: number;
    sourcePathStepCount: number;
    sourceAnchorMapEntryCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyCueCount: number;
  };
}

export interface ReviewObservationHandoffDryRunView {
  schema: "telemforge.review_observation_handoff_dry_run.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff dry-run cue sheet";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffDryRunSummaryView;
  defaultCue: ReviewObservationHandoffDryRunCueView;
  cues: ReviewObservationHandoffDryRunCueView[];
  cueAnchorCoverageEntries: ReviewObservationHandoffDryRunCueAnchorCoverageEntryView[];
  staticDryRunSummary: string;
  sourceObservationHandoffPath: ReviewObservationHandoffPathView;
}

export interface ReviewObservationHandoffDebriefStaticNonGoalFlagsView {
  noSavedDebriefNotes: true;
  noSavedFollowUpProgress: true;
  noSavedFollowUpOwnership: true;
  noSavedDryRunProgress: true;
  noSavedRehearsalSessions: true;
  noSavedPathProgress: true;
  noSavedAgendaProgress: true;
  noSavedQuestionAnswers: true;
  noSavedSelections: true;
  noPersistence: true;
  noRouteChanges: true;
  noCommandExecution: true;
  noExports: true;
  noSignoff: true;
  noOwnerAssignment: true;
  noScoring: true;
  noCertification: true;
  noMeetingWorkflow: true;
  noExternalTicketing: true;
  noHandoffPackageGeneration: true;
}

export interface ReviewObservationHandoffDebriefPromptView {
  debriefPromptId: string;
  promptNumber: number;
  label: string;
  summary: string;
  debriefPrompt: string;
  sourceCueId: string;
  sourceCueIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  facilitationPromptIds: string[];
  reviewQuestionIds: string[];
  evidencePromptIds: string[];
  gapPromptIds: string[];
  deferredScopePromptIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffDebriefStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDebriefFollowUpMapEntryView {
  followUpMapEntryId: string;
  followUpOrder: number;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffDebriefStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDebriefSummaryView {
  debriefId: "candidate-local-review-observation-handoff-debrief";
  label: string;
  summary: string;
  defaultDebriefPromptId: string;
  defaultCueId: string;
  defaultAnchorTargetId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    debriefPromptCount: number;
    followUpMapEntryCount: number;
    sourceCueCount: number;
    sourceCueAnchorCoverageEntryCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyDebriefPromptCount: number;
  };
}

export interface ReviewObservationHandoffDebriefView {
  schema: "telemforge.review_observation_handoff_debrief.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff debrief and static follow-up map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffDebriefSummaryView;
  defaultDebriefPrompt: ReviewObservationHandoffDebriefPromptView;
  debriefPrompts: ReviewObservationHandoffDebriefPromptView[];
  followUpMapEntries: ReviewObservationHandoffDebriefFollowUpMapEntryView[];
  staticDebriefSummary: string;
  sourceObservationHandoffDryRun: ReviewObservationHandoffDryRunView;
}

export interface ReviewObservationHandoffContinuityStaticNonGoalFlagsView {
  noSavedDebriefNotes: true;
  noSavedReviewerProgress: true;
  noSavedContinuityProgress: true;
  noSavedFollowUpProgress: true;
  noSavedFollowUpOwnership: true;
  noSavedDryRunProgress: true;
  noSavedRehearsalSessions: true;
  noSavedPathProgress: true;
  noSavedAgendaProgress: true;
  noSavedQuestionAnswers: true;
  noSavedSelections: true;
  noPersistence: true;
  noRouteChanges: true;
  noCommandExecution: true;
  noExports: true;
  noSignoff: true;
  noAuditRetention: true;
  noOwnerAssignment: true;
  noScoring: true;
  noCertification: true;
  noMeetingWorkflow: true;
  noExternalTicketing: true;
  noHandoffPackageGeneration: true;
  noTaskLaunchers: true;
  noRunnableChecklists: true;
}

export interface ReviewObservationHandoffContinuityCardView {
  continuityCardId: string;
  cardNumber: number;
  label: string;
  summary: string;
  continuityPrompt: string;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffContinuityStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffContinuityNextPassMapEntryView {
  nextPassMapEntryId: string;
  nextPassOrder: number;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryId: string;
  sourceFollowUpMapEntryIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffContinuityStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffContinuitySummaryView {
  continuityId: "candidate-local-review-observation-handoff-continuity";
  label: string;
  summary: string;
  defaultContinuityCardId: string;
  defaultDebriefPromptId: string;
  defaultCueId: string;
  defaultAnchorTargetId: string;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    continuityCardCount: number;
    nextPassMapEntryCount: number;
    sourceDebriefPromptCount: number;
    sourceFollowUpMapEntryCount: number;
    sourceCueCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyContinuityCardCount: number;
  };
}

export interface ReviewObservationHandoffContinuityView {
  schema: "telemforge.review_observation_handoff_continuity.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff continuity snapshot and static next-pass map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffContinuitySummaryView;
  defaultContinuityCard: ReviewObservationHandoffContinuityCardView;
  continuityCards: ReviewObservationHandoffContinuityCardView[];
  nextPassMapEntries: ReviewObservationHandoffContinuityNextPassMapEntryView[];
  staticContinuitySummary: string;
  sourceObservationHandoffDebrief: ReviewObservationHandoffDebriefView;
}

export interface ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView {
  noSavedDriftState: true;
  noSavedReviewSessions: true;
  noSavedReviewerProgress: true;
  noSavedDebriefNotes: true;
  noSavedContinuityProgress: true;
  noSavedFollowUpProgress: true;
  noSavedFollowUpOwnership: true;
  noSavedDryRunProgress: true;
  noSavedRehearsalSessions: true;
  noSavedPathProgress: true;
  noSavedAgendaProgress: true;
  noSavedQuestionAnswers: true;
  noSavedSelections: true;
  noPersistence: true;
  noLocalStorage: true;
  noRouteChanges: true;
  noCommandExecution: true;
  noExports: true;
  noSignoff: true;
  noAuditRetention: true;
  noOwnerAssignment: true;
  noScoring: true;
  noCertification: true;
  noMeetingWorkflow: true;
  noExternalTicketing: true;
  noReportAuthoring: true;
  noHandoffPackageGeneration: true;
  noTaskLaunchers: true;
  noRunnableChecklists: true;
}

export interface ReviewObservationHandoffDriftGuardRowView {
  driftGuardRowId: string;
  rowNumber: number;
  label: string;
  summary: string;
  guardPrompt: string;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView {
  staticRegressionMapEntryId: string;
  regressionOrder: number;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryId: string;
  sourceFollowUpMapEntryIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffDriftGuardSummaryView {
  driftGuardId: "candidate-local-review-observation-handoff-drift-guard";
  label: string;
  summary: string;
  defaultContinuityContext: {
    defaultContinuityCardId: string;
    defaultDebriefPromptId: string;
    defaultCueId: string;
    defaultAnchorTargetId: string;
    sourceContinuitySummary: string;
  };
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    driftGuardRowCount: number;
    staticRegressionMapEntryCount: number;
    sourceContinuityCardCount: number;
    sourceNextPassMapEntryCount: number;
    sourceCueCount: number;
    sourceDebriefPromptCount: number;
    sourceFollowUpMapEntryCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyDriftGuardRowCount: number;
  };
}

export interface ReviewObservationHandoffDriftGuardView {
  schema: "telemforge.review_observation_handoff_drift_guard.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff drift guard and static regression map";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffDriftGuardSummaryView;
  defaultDriftGuardRow: ReviewObservationHandoffDriftGuardRowView;
  driftGuardRows: ReviewObservationHandoffDriftGuardRowView[];
  staticRegressionMapEntries: ReviewObservationHandoffDriftGuardStaticRegressionMapEntryView[];
  staticDriftGuardSummary: string;
  sourceObservationHandoffContinuity: ReviewObservationHandoffContinuityView;
}

export interface ReviewObservationHandoffCalibrationStaticNonGoalFlagsView
  extends ReviewObservationHandoffDriftGuardStaticNonGoalFlagsView {
  noSavedCalibrationNotes: true;
  noSavedCalibrationState: true;
}

export interface ReviewObservationHandoffCalibrationCardView {
  calibrationCardId: string;
  cardNumber: number;
  label: string;
  summary: string;
  calibrationPrompt: string;
  sourceDriftGuardRowId: string;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffCalibrationStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffCalibrationStaticAlignmentNoteView {
  staticAlignmentNoteId: string;
  alignmentOrder: number;
  sourceStaticRegressionMapEntryId: string;
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryId: string;
  sourceFollowUpMapEntryIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffCalibrationStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffCalibrationSummaryView {
  calibrationId: "candidate-local-review-observation-handoff-calibration";
  label: string;
  summary: string;
  defaultDriftGuardContext: {
    defaultDriftGuardRowId: string;
    defaultCueId: string;
    defaultDebriefPromptId: string;
    defaultAnchorTargetId: string;
    sourceDriftGuardSummary: string;
    sourceContinuitySummary: string;
  };
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    calibrationCardCount: number;
    staticAlignmentNoteCount: number;
    sourceDriftGuardRowCount: number;
    sourceStaticRegressionMapEntryCount: number;
    sourceCueCount: number;
    sourceDebriefPromptCount: number;
    sourceFollowUpMapEntryCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyCalibrationCardCount: number;
  };
}

export interface ReviewObservationHandoffCalibrationView {
  schema: "telemforge.review_observation_handoff_calibration.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff calibration board and static alignment notes";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffCalibrationSummaryView;
  defaultCalibrationCard: ReviewObservationHandoffCalibrationCardView;
  calibrationCards: ReviewObservationHandoffCalibrationCardView[];
  staticAlignmentNotes: ReviewObservationHandoffCalibrationStaticAlignmentNoteView[];
  staticCalibrationSummary: string;
  sourceObservationHandoffDriftGuard: ReviewObservationHandoffDriftGuardView;
}

export interface ReviewObservationHandoffSynthesisStaticNonGoalFlagsView
  extends ReviewObservationHandoffCalibrationStaticNonGoalFlagsView {
  noSavedSynthesisState: true;
}

export interface ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView {
  referenceId: string;
  sourceKind:
    | ReviewObservationHandoffPathSourceKind
    | "calibration_card"
    | "alignment_note";
  sourceId: string;
  label: string;
  localAnchorHref?: string;
  anchorTargetId?: string;
}

export interface ReviewObservationHandoffSynthesisRowView {
  synthesisRowId: string;
  rowNumber: number;
  label: string;
  summary: string;
  relayThreadNote: string;
  sourceCalibrationCardId: string;
  sourceCalibrationCardIds: string[];
  sourceAlignmentNoteIds: string[];
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  sourceCrosswalkReferences: ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffSynthesisStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffSynthesisStaticRelayNoteEntryView {
  staticRelayNoteEntryId: string;
  relayOrder: number;
  sourceAlignmentNoteId: string;
  sourceAlignmentNoteIds: string[];
  sourceCalibrationCardIds: string[];
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryId: string;
  sourceFollowUpMapEntryIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceCrosswalkReferences: ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView[];
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffSynthesisStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffSynthesisSummaryView {
  synthesisId: "candidate-local-review-observation-handoff-synthesis";
  label: string;
  summary: string;
  defaultCalibrationContext: {
    defaultCalibrationCardId: string;
    defaultDriftGuardRowId: string;
    defaultCueId: string;
    defaultDebriefPromptId: string;
    defaultAnchorTargetId: string;
    sourceCalibrationSummary: string;
    sourceDriftGuardSummary: string;
  };
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    synthesisRowCount: number;
    staticRelayNoteCount: number;
    sourceCalibrationCardCount: number;
    sourceAlignmentNoteCount: number;
    sourceCueCount: number;
    sourceDebriefPromptCount: number;
    sourceFollowUpMapEntryCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlySynthesisRowCount: number;
  };
}

export interface ReviewObservationHandoffSynthesisView {
  schema: "telemforge.review_observation_handoff_synthesis.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff synthesis map and static relay notes";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffSynthesisSummaryView;
  defaultSynthesisRow: ReviewObservationHandoffSynthesisRowView;
  synthesisRows: ReviewObservationHandoffSynthesisRowView[];
  staticRelayNotes: ReviewObservationHandoffSynthesisStaticRelayNoteEntryView[];
  staticSynthesisSummary: string;
  sourceObservationHandoffCalibration: ReviewObservationHandoffCalibrationView;
}

export interface ReviewObservationHandoffRelayTrailStaticNonGoalFlagsView
  extends ReviewObservationHandoffSynthesisStaticNonGoalFlagsView {
  noSavedReviewerNotes: true;
  noSavedRelayProgress: true;
  noSavedInspectionState: true;
}

export interface ReviewObservationHandoffRelayTrailSourceInspectionReferenceView {
  referenceId: string;
  sourceKind:
    | ReviewObservationHandoffSynthesisSourceCrosswalkReferenceView["sourceKind"]
    | "synthesis_row"
    | "static_relay_note";
  sourceId: string;
  label: string;
  localAnchorHref?: string;
  anchorTargetId?: string;
}

export interface ReviewObservationHandoffRelayTrailStepView {
  relayStepId: string;
  stepNumber: number;
  label: string;
  summary: string;
  inspectionNote: string;
  sourceSynthesisRowId: string;
  sourceSynthesisRowIds: string[];
  sourceCalibrationCardId: string;
  sourceCalibrationCardIds: string[];
  sourceAlignmentNoteIds: string[];
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceReferences: ReviewObservationHandoffPathSourceReferenceView[];
  sourceInspectionReferences: ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[];
  localAnchorHrefs: string[];
  anchorTargetIds: string[];
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalContexts: ReviewObservationBoundaryWalkthroughStaticContextView[];
  staticNonGoalFlags: ReviewObservationHandoffRelayTrailStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView {
  staticInspectionNoteEntryId: string;
  inspectionOrder: number;
  sourceRelayNoteId: string;
  sourceRelayNoteIds: string[];
  sourceAlignmentNoteId: string;
  sourceAlignmentNoteIds: string[];
  matchedSourceSynthesisRowIds: string[];
  sourceCalibrationCardIds: string[];
  sourceCueId: string;
  sourceCueIds: string[];
  sourceDebriefPromptId: string;
  sourceDebriefPromptIds: string[];
  sourceFollowUpMapEntryId: string;
  sourceFollowUpMapEntryIds: string[];
  sourceAnchorCoverageEntryId: string;
  sourceAnchorCoverageEntryIds: string[];
  sourcePathStepId: string;
  sourcePathStepIds: string[];
  sourceAnchorOrder: number;
  sourceAnchorTargetIds: string[];
  sourceAgendaSectionId: string;
  sourceAgendaSectionIds: string[];
  sourcePromptGroupId: string;
  sourcePromptGroupIds: string[];
  sourceCoverageRowId: string;
  sourceCoverageRowIds: string[];
  sourceHandoffCardId: string;
  sourceHandoffCardIds: string[];
  sourceSummaryReference: ReviewObservationHandoffQuestionsSourceSummaryReferenceView;
  sourceInspectionReferences: ReviewObservationHandoffRelayTrailSourceInspectionReferenceView[];
  localAnchorHref: string;
  anchorTargetId: string;
  label: string;
  summary: string;
  evidenceCallbackIds: string[];
  gapDiscussionPointIds: string[];
  deferredScopeReminderIds: string[];
  staticNonGoalFlags: ReviewObservationHandoffRelayTrailStaticNonGoalFlagsView;
  localOnly: true;
  sourceBacked: true;
  inPageOnly: true;
  explanatoryOnly: true;
  staticOnly: true;
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  notATask: true;
  notATicket: true;
  notAChecklist: true;
  notOwnerAssigned: true;
}

export interface ReviewObservationHandoffRelayTrailSummaryView {
  relayTrailId: "candidate-local-review-observation-handoff-relay-trail";
  label: string;
  summary: string;
  defaultSynthesisContext: {
    defaultSynthesisRowId: string;
    defaultCalibrationCardId: string;
    defaultDriftGuardRowId: string;
    defaultCueId: string;
    defaultDebriefPromptId: string;
    defaultAnchorTargetId: string;
    sourceSynthesisSummary: string;
    sourceCalibrationSummary: string;
    sourceDriftGuardSummary: string;
  };
  informationalOnly: true;
  nonActionable: true;
  nonPersistent: true;
  nonExecutable: true;
  nonRouting: true;
  nonCertifying: true;
  nonRanking: true;
  counts: {
    relayStepCount: number;
    staticInspectionNoteCount: number;
    sourceSynthesisRowCount: number;
    sourceStaticRelayNoteCount: number;
    sourceCalibrationCardCount: number;
    sourceAlignmentNoteCount: number;
    sourceCueCount: number;
    sourceDebriefPromptCount: number;
    sourceFollowUpMapEntryCount: number;
    sourcePathStepCount: number;
    sourceAgendaSectionCount: number;
    sourcePromptGroupCount: number;
    sourceCoverageRowCount: number;
    sourceHandoffCardCount: number;
    localOnlyRelayStepCount: number;
  };
}

export interface ReviewObservationHandoffRelayTrailView {
  schema: "telemforge.review_observation_handoff_relay_trail.v1";
  version: 1;
  contractLabel: "local deterministic observation handoff relay trail and static inspection notes";
  localStatus: ReplayPlaybackView["localStatus"];
  summary: ReviewObservationHandoffRelayTrailSummaryView;
  defaultRelayStep: ReviewObservationHandoffRelayTrailStepView;
  relaySteps: ReviewObservationHandoffRelayTrailStepView[];
  staticInspectionNotes: ReviewObservationHandoffRelayTrailStaticInspectionNoteEntryView[];
  staticRelayTrailSummary: string;
  sourceObservationHandoffSynthesis: ReviewObservationHandoffSynthesisView;
}

export type ScenarioRunbookStepActionKind =
  | "inspect_alert"
  | "acknowledge_alert"
  | "resolve_alert"
  | "inspect_timeline"
  | "inspect_replay";

export type ScenarioRunbookStepStatus = "complete" | "current" | "pending";

export interface ScenarioRunbookStepDefinition {
  stepId: string;
  title: string;
  actionKind: ScenarioRunbookStepActionKind;
  evidenceTarget: string;
  summary: string;
}

export interface ScenarioRunbookDefinition {
  runbookId: string;
  title: string;
  scenario: string;
  mode: "fixture-first";
  supportedModes: Array<"fixture" | "local-live">;
  targetAlertId: string;
  targetChannelId: string;
  targetFaultId: string;
  summary: string;
  steps: ScenarioRunbookStepDefinition[];
  deferredFeatures: string[];
}

export interface ScenarioRunbookStepView extends ScenarioRunbookStepDefinition {
  status: ScenarioRunbookStepStatus;
}

export interface ScenarioRunbookEvidenceLink {
  stepId: string;
  label: string;
  target: string;
  state: "available" | "pending";
}

export type ScenarioRunbookNextAction =
  | {
      kind: "acknowledge_alert";
      alertId: string;
      label: string;
    }
  | {
      kind: "resolve_alert";
      alertId: string;
      label: string;
    }
  | {
      kind: "inspect_timeline" | "inspect_replay" | "playback_complete";
      label: string;
    };

export interface ScenarioRunbookPlaybackView {
  availableRunbooks: Array<{
    runbookId: string;
    title: string;
    mode: string;
  }>;
  selectedRunbookId: string;
  title: string;
  scenario: string;
  mode: string;
  summary: string;
  targetAlertId: string | null;
  currentStepId: string;
  completedStepIds: string[];
  steps: ScenarioRunbookStepView[];
  evidenceLinks: ScenarioRunbookEvidenceLink[];
  nextAction: ScenarioRunbookNextAction | null;
}

export interface IncidentReviewPacketView {
  schema: "telemforge.incident_review_packet.v1";
  packetId: string;
  title: string;
  runbook: {
    runbookId: string;
    scenario: string;
    mode: string;
    targetAlertId: string;
    targetChannelId: string;
    targetFaultId: string;
  };
  readiness: {
    status: "ready" | "in_progress" | "blocked";
    completedStepCount: number;
    totalStepCount: number;
    unresolvedGapCount: number;
  };
  alertLifecycle: {
    targetAlertId: string;
    channelId: string;
    state: AlertRecord["state"] | "missing";
    severity: AlertRecord["severity"] | null;
    acknowledgedAt?: string;
    acknowledgedBy?: string;
    resolvedAt?: string;
    resolvedBy?: string;
  };
  operatorActions: Array<{
    actionKind: "acknowledge_alert" | "resolve_alert";
    status: "complete" | "pending";
    timestamp: string | null;
    actor: string | null;
    sourceEventId: string | null;
  }>;
  eventHistory: {
    relatedEventCount: number;
    eventTypes: string[];
    latestEventAt: string | null;
  };
  replayEvidence: {
    sampleCount: number;
    anomalyCount: number;
    relatedMarkerCount: number;
    markerTypes: string[];
    affectedChannelIds: string[];
  };
  evidenceGaps: Array<{
    gapId: string;
    summary: string;
  }>;
  sourceRefs: Array<{
    label: string;
    path: string;
  }>;
  deferredFeatures: string[];
}

export interface IncidentReviewExportPayload {
  schema: "telemforge.incident_review_export.v1";
  version: 1;
  exportId: string;
  packetIdentity: {
    packetId: string;
    spacecraftId: string;
    runbookId: string;
    runbookTitle: string;
    scenario: string;
  };
  readiness: IncidentReviewPacketView["readiness"];
  alertLifecycle: IncidentReviewPacketView["alertLifecycle"];
  operatorActions: {
    completeCount: number;
    pendingCount: number;
    actions: IncidentReviewPacketView["operatorActions"];
  };
  eventHistory: IncidentReviewPacketView["eventHistory"];
  replayEvidence: IncidentReviewPacketView["replayEvidence"];
  sourceRefs: IncidentReviewPacketView["sourceRefs"];
  deferredFeatures: string[];
  unresolvedGaps: IncidentReviewPacketView["evidenceGaps"];
  scopeNotes: string[];
}

export interface MissionConsoleView {
  mission: MissionOverviewView;
  stream: LiveTelemetryConnectionView;
  subsystems: SubsystemSummaryView[];
  selectedSubsystem: SubsystemSummaryView;
  trends: TrendView[];
  alerts: AlertRecord[];
  incident: IncidentStoryView;
  replay?: ReplayInspectionView;
  replayPlayback?: ReplayPlaybackView;
  reviewDecisionRegister?: ReviewDecisionRegisterView;
  reviewBriefingBoard?: ReviewBriefingBoardView;
  reviewActionQueue?: ReviewActionQueueView;
  reviewActionWalkthrough?: ReviewActionWalkthroughView;
  reviewHandoffRehearsal?: ReviewHandoffRehearsalView;
  reviewHandoffCoverageMatrix?: ReviewHandoffCoverageMatrixView;
  reviewGapTriage?: ReviewGapTriageView;
  reviewGapResolution?: ReviewGapResolutionView;
  reviewPassReadiness?: ReviewPassReadinessView;
  reviewPassOutcome?: ReviewPassOutcomeView;
  reviewEvidenceTrace?: ReviewEvidenceTraceView;
  reviewEvidenceCoverage?: ReviewEvidenceCoverageView;
  reviewProofPriority?: ReviewProofPriorityView;
  reviewProofPacket?: ReviewProofPacketView;
  reviewProofNavigator?: ReviewProofNavigatorView;
  reviewProofReconciliation?: ReviewProofReconciliationView;
  reviewSurfaceIndex?: ReviewSurfaceIndexView;
  reviewWalkthroughPath?: ReviewWalkthroughPathView;
  reviewObservationLens?: ReviewObservationLensView;
  reviewObservationCoverage?: ReviewObservationCoverageView;
  reviewObservationCitations?: ReviewObservationCitationTrailView;
  reviewObservationBoundaryLedger?: ReviewObservationBoundaryLedgerView;
  reviewObservationBoundaryWalkthrough?: ReviewObservationBoundaryWalkthroughView;
  reviewObservationStoryline?: ReviewObservationStorylineView;
  reviewObservationHandoffDeck?: ReviewObservationHandoffDeckView;
  reviewObservationHandoffCoverage?: ReviewObservationHandoffCoverageView;
  reviewObservationHandoffQuestions?: ReviewObservationHandoffQuestionsView;
  reviewObservationHandoffAgenda?: ReviewObservationHandoffAgendaView;
  reviewObservationHandoffPath?: ReviewObservationHandoffPathView;
  reviewObservationHandoffDryRun?: ReviewObservationHandoffDryRunView;
  reviewObservationHandoffDebrief?: ReviewObservationHandoffDebriefView;
  reviewObservationHandoffContinuity?: ReviewObservationHandoffContinuityView;
  reviewObservationHandoffDriftGuard?: ReviewObservationHandoffDriftGuardView;
  reviewObservationHandoffCalibration?: ReviewObservationHandoffCalibrationView;
  reviewObservationHandoffSynthesis?: ReviewObservationHandoffSynthesisView;
  reviewObservationHandoffRelayTrail?: ReviewObservationHandoffRelayTrailView;
  runbook?: ScenarioRunbookPlaybackView;
  incidentReviewPacket?: IncidentReviewPacketView;
  incidentReviewExport?: IncidentReviewExportPayload;
}
