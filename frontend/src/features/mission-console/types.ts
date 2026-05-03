export type TelemetryStatus = "nominal" | "warning" | "critical" | "offline";
export type TrendDirection = "rising" | "falling" | "flat";
export type IncidentEventType = "fault.injected" | "telemetry.affected" | "alert.raised";
export type ReplayMarkerKind = "fault" | "event" | "alert";

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
  severity?: "info" | "warning" | "critical";
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

export interface MissionConsoleView {
  mission: MissionOverviewView;
  subsystems: SubsystemSummaryView[];
  selectedSubsystem: SubsystemSummaryView;
  trends: TrendView[];
  alerts: AlertRecord[];
  incident: IncidentStoryView;
  replay?: ReplayInspectionView;
}
