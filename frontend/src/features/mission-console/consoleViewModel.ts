import type {
  ChannelDetailView,
  EventLogEntry,
  FaultRecord,
  IncidentStoryView,
  LiveTelemetryConnectionView,
  MissionConsoleView,
  ReplayInspectionView,
  ReplayPayload,
  Stage05ConsoleFixture,
  SubsystemSummaryView,
  TelemetryChannel,
  TelemetryPoint,
  TelemetryStatus,
  TrendDirection,
  TrendSample,
  TrendView,
  ValueRange,
} from "./types.ts";
import { buildScenarioRunbookPlayback } from "../../lib/scenarioRunbooks.ts";

const statusRank: Record<TelemetryStatus, number> = {
  nominal: 0,
  warning: 1,
  critical: 2,
  offline: 3,
};

const emptyStatusCounts = (): Record<TelemetryStatus, number> => ({
  nominal: 0,
  warning: 0,
  critical: 0,
  offline: 0,
});

const subsystemPriority = ["thermal", "comms", "eps", "adcs", "payload", "prop"];

export const selectedStage05ChannelIds = [
  "eps.battery_voltage",
  "thermal.avionics_temp",
  "comms.downlink_snr_db",
  "comms.packet_error_rate_pct",
];

export function buildMissionConsoleView(
  fixture: Stage05ConsoleFixture,
  selectedSubsystemId = "thermal",
  stream = buildFixtureStreamConnection(fixture),
  selectedRunbookId?: string,
): MissionConsoleView {
  const channelsById = new Map(
    fixture.channels.map((channel) => [channel.channelId, channel]),
  );
  const pointsByChannelId = new Map(
    fixture.points.map((point) => [point.channelId, point]),
  );
  const missionCounts = countStatuses(fixture.points);
  const subsystems = buildSubsystems(fixture, channelsById);
  const activeFaults = (fixture.faults ?? []).filter(
    (fault) => fault.status === "active",
  );
  const activeAlerts = fixture.alerts.filter((alert) => alert.state === "active");
  const acknowledgedAlerts = fixture.alerts.filter(
    (alert) => alert.state === "acknowledged",
  );
  const resolvedAlerts = fixture.alerts.filter((alert) => alert.state === "resolved");
  const selectedSubsystem =
    subsystems.find((subsystem) => subsystem.id === selectedSubsystemId) ??
    subsystems[0];

  return {
    mission: {
      spacecraftId: fixture.spacecraftId,
      scenario: fixture.scenario,
      capturedAt: fixture.capturedAt,
      description: fixture.description,
      healthState: worstStatus(fixture.points.map((point) => point.status)),
      statusCounts: missionCounts,
      activeAlertCount: activeAlerts.length,
      acknowledgedAlertCount: acknowledgedAlerts.length,
      resolvedAlertCount: resolvedAlerts.length,
      activeFaultCount: activeFaults.length,
      sourceLabel: stream.label,
    },
    stream,
    subsystems,
    selectedSubsystem,
    trends: selectedStage05ChannelIds.map((channelId) =>
      buildTrend(channelId, fixture.trends, channelsById, pointsByChannelId),
    ),
    alerts: fixture.alerts,
    incident: buildIncidentStory(activeFaults, fixture.events ?? []),
    replay: fixture.replay
      ? buildReplayInspectionView(fixture.replay)
      : undefined,
    runbook: buildScenarioRunbookPlayback(fixture, selectedRunbookId),
  };
}

export function buildFixtureStreamConnection(
  fixture: Stage05ConsoleFixture,
): LiveTelemetryConnectionView {
  return {
    state: "fixture",
    label: fixture.source.snapshot,
    detail: "Fixture review mode",
  };
}

export function buildReplayInspectionView(
  replay: ReplayPayload,
): ReplayInspectionView {
  const timelineMarkers = [...replay.markers].sort(
    (left, right) =>
      left.timestamp.localeCompare(right.timestamp) ||
      markerKindRank(left.kind) - markerKindRank(right.kind) ||
      left.markerId.localeCompare(right.markerId),
  );
  const topAnomalies = [...replay.anomalies]
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.timestamp.localeCompare(left.timestamp) ||
        left.channelId.localeCompare(right.channelId),
    )
    .map((anomaly) => ({
      ...anomaly,
      scoreLabel: `${Math.round(anomaly.score * 100)}%`,
    }));

  return {
    windowLabel: `${replay.window.startAt} to ${replay.window.endAt}`,
    markerCount: replay.summary.markerCount,
    anomalyCount: replay.summary.anomalyCount,
    sampleCount: replay.summary.sampleCount,
    affectedChannelIds: replay.summary.affectedChannelIds,
    timelineMarkers,
    topAnomalies,
  };
}

export function formatTelemetryValue(
  value: number,
  unit: string,
  precision: number,
): string {
  return `${value.toFixed(precision)} ${unit}`;
}

function buildSubsystems(
  fixture: Stage05ConsoleFixture,
  channelsById: Map<string, TelemetryChannel>,
): SubsystemSummaryView[] {
  const grouped = new Map<string, ChannelDetailView[]>();

  for (const point of fixture.points) {
    const channel = channelsById.get(point.channelId);
    if (!channel) {
      continue;
    }

    const channelView = buildChannelDetail(channel, point);
    const channels = grouped.get(channel.subsystem) ?? [];
    channels.push(channelView);
    grouped.set(channel.subsystem, channels);
  }

  return Array.from(grouped.entries())
    .map(([id, channels]) => {
      const statusCounts = countStatuses(channels);
      return {
        id,
        label: subsystemLabel(id),
        status: worstStatus(channels.map((channel) => channel.status)),
        channelCount: channels.length,
        statusCounts,
        channels: channels.sort(
          (left, right) =>
            statusRank[right.status] - statusRank[left.status] ||
            left.name.localeCompare(right.name),
        ),
      };
    })
    .sort(
      (left, right) =>
        statusRank[right.status] - statusRank[left.status] ||
        subsystemSortIndex(left.id) - subsystemSortIndex(right.id),
    );
}

function buildChannelDetail(
  channel: TelemetryChannel,
  point: TelemetryPoint,
): ChannelDetailView {
  return {
    channelId: channel.channelId,
    name: channel.name,
    subsystem: channel.subsystem,
    value: point.value,
    formattedValue: formatTelemetryValue(
      point.value,
      point.unit,
      channel.precision,
    ),
    unit: point.unit,
    status: point.status,
    quality: point.quality,
    description: channel.description,
    nominalRangeLabel: rangeLabel(channel.nominalRange, point.unit),
    warningRangeLabel: rangeLabel(channel.warningRange, point.unit),
  };
}

function buildTrend(
  channelId: string,
  trends: TrendSample[],
  channelsById: Map<string, TelemetryChannel>,
  pointsByChannelId: Map<string, TelemetryPoint>,
): TrendView {
  const samples = trends
    .filter((sample) => sample.channelId === channelId)
    .sort((left, right) => left.sample - right.sample);
  const channel = channelsById.get(channelId);
  const point = pointsByChannelId.get(channelId);

  if (!samples.length || !channel || !point) {
    throw new Error(`Stage 05 trend is missing channel data: ${channelId}`);
  }

  const values = samples.map((sample) => sample.value);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];

  return {
    channelId,
    name: channel.name,
    unit: channel.unit,
    status: point.status,
    direction: trendDirection(firstValue, lastValue),
    firstValue,
    lastValue,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    samples,
    svgPath: buildSparklinePath(values),
  };
}

function buildIncidentStory(
  activeFaults: FaultRecord[],
  events: EventLogEntry[],
): IncidentStoryView {
  const timeline = [...events].sort(
    (left, right) =>
      left.timestamp.localeCompare(right.timestamp) ||
      left.eventId.localeCompare(right.eventId),
  );

  return {
    activeFaults,
    timeline,
    latestEventAt: timeline.at(-1)?.timestamp ?? null,
  };
}

function countStatuses(
  items: Array<{ status: TelemetryStatus }>,
): Record<TelemetryStatus, number> {
  const counts = emptyStatusCounts();
  for (const item of items) {
    counts[item.status] += 1;
  }
  return counts;
}

function worstStatus(statuses: TelemetryStatus[]): TelemetryStatus {
  return statuses.reduce<TelemetryStatus>(
    (worst, status) => (statusRank[status] > statusRank[worst] ? status : worst),
    "nominal",
  );
}

function trendDirection(first: number, last: number): TrendDirection {
  if (last > first) {
    return "rising";
  }
  if (last < first) {
    return "falling";
  }
  return "flat";
}

function rangeLabel(range: ValueRange, unit: string): string {
  return `${range.min} to ${range.max} ${unit}`;
}

function subsystemLabel(subsystemId: string): string {
  const labels: Record<string, string> = {
    adcs: "ADCS",
    comms: "Comms",
    eps: "EPS",
    payload: "Payload",
    prop: "Propulsion",
    thermal: "Thermal",
  };
  return labels[subsystemId] ?? subsystemId.toUpperCase();
}

function subsystemSortIndex(subsystemId: string): number {
  const index = subsystemPriority.indexOf(subsystemId);
  return index === -1 ? subsystemPriority.length : index;
}

function markerKindRank(kind: string): number {
  if (kind === "fault") {
    return 0;
  }
  if (kind === "event") {
    return 1;
  }
  if (kind === "alert") {
    return 2;
  }
  return 9;
}

function buildSparklinePath(values: number[]): string {
  if (values.length === 1) {
    return "M 0 28";
  }

  const width = 220;
  const height = 68;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = maximum - minimum || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minimum) / span) * height;
      const command = index === 0 ? "M" : "L";
      return `${command} ${roundForPath(x)} ${roundForPath(y)}`;
    })
    .join(" ");
}

function roundForPath(value: number): string {
  return Number(value.toFixed(2)).toString();
}
