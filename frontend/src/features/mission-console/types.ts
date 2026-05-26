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

export interface MissionConsoleView {
  mission: MissionOverviewView;
  stream: LiveTelemetryConnectionView;
  subsystems: SubsystemSummaryView[];
  selectedSubsystem: SubsystemSummaryView;
  trends: TrendView[];
  alerts: AlertRecord[];
  incident: IncidentStoryView;
  replay?: ReplayInspectionView;
  runbook?: ScenarioRunbookPlaybackView;
  incidentReviewPacket?: IncidentReviewPacketView;
}
