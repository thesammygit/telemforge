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
  runbook?: ScenarioRunbookPlaybackView;
  incidentReviewPacket?: IncidentReviewPacketView;
  incidentReviewExport?: IncidentReviewExportPayload;
}
