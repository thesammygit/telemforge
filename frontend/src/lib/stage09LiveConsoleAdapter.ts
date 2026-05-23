import {
  buildFixtureStreamConnection,
  selectedStage05ChannelIds,
} from "../features/mission-console/consoleViewModel.ts";
import type {
  AlertRecord,
  LiveTelemetryConnectionState,
  LiveTelemetryConnectionView,
  Stage05ConsoleFixture,
  TelemetryPoint,
  TelemetryStatus,
  TrendSample,
} from "../features/mission-console/types.ts";

export interface Stage09LiveConsoleState {
  fixture: Stage05ConsoleFixture;
  connection: LiveTelemetryConnectionView;
}

type Stage09LiveMessage = {
  type?: string;
  session_id?: string;
  sequence?: number;
  emitted_at?: string;
  payload?: unknown;
};

const telemetryStatuses = new Set<TelemetryStatus>([
  "nominal",
  "warning",
  "critical",
  "offline",
]);
const telemetryQualities = new Set(["valid", "suspect", "missing"]);

export function createStage09LiveConsoleState(
  fixture: Stage05ConsoleFixture,
): Stage09LiveConsoleState {
  const clonedFixture = cloneFixture(fixture);
  return {
    fixture: clonedFixture,
    connection: buildFixtureStreamConnection(clonedFixture),
  };
}

export function setStage09LiveConsoleConnection(
  state: Stage09LiveConsoleState,
  connectionState: LiveTelemetryConnectionState,
  detail?: string,
): Stage09LiveConsoleState {
  return {
    ...state,
    connection: buildConnectionView({
      connectionState,
      detail,
      fixture: state.fixture,
      previous: state.connection,
    }),
  };
}

export function applyStage09LiveConsoleMessage(
  state: Stage09LiveConsoleState,
  rawMessage: unknown,
): Stage09LiveConsoleState {
  if (!isRecord(rawMessage)) {
    return state;
  }

  const message = rawMessage as Stage09LiveMessage;
  const sequence = Number(message.sequence);
  const lastSequence = state.connection.lastSequence ?? 0;
  if (!Number.isInteger(sequence) || sequence <= lastSequence) {
    return state;
  }

  if (message.type === "stream.snapshot") {
    return applySnapshotMessage(state, message, sequence);
  }
  if (message.type === "telemetry.sample") {
    return applyTelemetrySampleMessage(state, message, sequence);
  }
  if (message.type === "stream.backpressure") {
    return applyBackpressureMessage(state, message, sequence);
  }
  if (message.type === "stream.heartbeat") {
    return {
      ...state,
      connection: buildConnectionView({
        connectionState: "live",
        fixture: state.fixture,
        lastSequence: sequence,
        previous: state.connection,
      }),
    };
  }

  return state;
}

function applySnapshotMessage(
  state: Stage09LiveConsoleState,
  message: Stage09LiveMessage,
  sequence: number,
): Stage09LiveConsoleState {
  const payload = isRecord(message.payload) ? message.payload : {};
  const latestPoints = arrayFrom(payload.latest_points)
    .map(normalizeTelemetryPoint)
    .filter((point): point is TelemetryPoint => point !== null);
  const alerts = mergeAlerts(
    state.fixture.alerts,
    arrayFrom(payload.active_alerts)
      .map(normalizeAlert)
      .filter((alert): alert is AlertRecord => alert !== null),
  );

  const updatedFixture = {
    ...state.fixture,
    source: {
      ...state.fixture.source,
      snapshot: "Stage 09 live websocket",
    },
    capturedAt: latestTimestamp(latestPoints) ?? message.emitted_at ?? state.fixture.capturedAt,
    points: mergeTelemetryPoints(state.fixture.points, latestPoints, state.fixture),
    alerts,
    trends: appendTrendSamples(state.fixture.trends, latestPoints),
  };

  return {
    fixture: updatedFixture,
    connection: buildConnectionView({
      connectionState: "live",
      fixture: updatedFixture,
      lastSequence: sequence,
      previous: state.connection,
    }),
  };
}

function applyTelemetrySampleMessage(
  state: Stage09LiveConsoleState,
  message: Stage09LiveMessage,
  sequence: number,
): Stage09LiveConsoleState {
  const point = normalizeTelemetryPoint(message.payload);
  if (!point) {
    return setStage09LiveConsoleConnection(
      {
        ...state,
        connection: {
          ...state.connection,
          lastSequence: sequence,
        },
      },
      "degraded",
      `Ignored malformed telemetry sample at sequence ${sequence}`,
    );
  }

  const updatedFixture = {
    ...state.fixture,
    source: {
      ...state.fixture.source,
      snapshot: "Stage 09 live websocket",
    },
    capturedAt: point.timestamp,
    points: mergeTelemetryPoints(state.fixture.points, [point], state.fixture),
    trends: appendTrendSamples(state.fixture.trends, [point]),
  };

  return {
    fixture: updatedFixture,
    connection: buildConnectionView({
      connectionState: "live",
      fixture: updatedFixture,
      lastSequence: sequence,
      previous: state.connection,
    }),
  };
}

function applyBackpressureMessage(
  state: Stage09LiveConsoleState,
  message: Stage09LiveMessage,
  sequence: number,
): Stage09LiveConsoleState {
  const payload = isRecord(message.payload) ? message.payload : {};
  const droppedEventCount = numberFrom(payload.dropped_event_count);
  const clientQueueDepth = numberFrom(payload.client_queue_depth);
  const policy =
    typeof payload.policy === "string" ? payload.policy : "backpressure";
  const detail =
    droppedEventCount === undefined
      ? `${policy} reported by local websocket`
      : `${droppedEventCount} dropped events reported by ${policy}`;

  return {
    ...state,
    connection: buildConnectionView({
      clientQueueDepth,
      connectionState: "degraded",
      detail,
      droppedEventCount,
      fixture: state.fixture,
      lastSequence: sequence,
      previous: state.connection,
    }),
  };
}

function buildConnectionView({
  clientQueueDepth,
  connectionState,
  detail,
  droppedEventCount,
  fixture,
  lastSequence,
  previous,
}: {
  clientQueueDepth?: number;
  connectionState: LiveTelemetryConnectionState;
  detail?: string;
  droppedEventCount?: number;
  fixture: Stage05ConsoleFixture;
  lastSequence?: number;
  previous?: LiveTelemetryConnectionView;
}): LiveTelemetryConnectionView {
  if (connectionState === "fixture") {
    return buildFixtureStreamConnection(fixture);
  }

  const labels: Record<Exclude<LiveTelemetryConnectionState, "fixture">, string> = {
    closed: "Fixture fallback active",
    connecting: "Stage 09 live websocket",
    degraded: "Live stream degraded",
    live: "Stage 09 live websocket",
  };
  const details: Record<Exclude<LiveTelemetryConnectionState, "fixture">, string> = {
    closed: "Local websocket closed",
    connecting: "Connecting to local session stream",
    degraded: "Backpressure reported by local session stream",
    live: "Local session stream active",
  };

  return {
    state: connectionState,
    label: labels[connectionState],
    detail: detail ?? details[connectionState],
    lastSequence: lastSequence ?? previous?.lastSequence,
    droppedEventCount: droppedEventCount ?? previous?.droppedEventCount,
    clientQueueDepth: clientQueueDepth ?? previous?.clientQueueDepth,
  };
}

function mergeTelemetryPoints(
  currentPoints: TelemetryPoint[],
  updates: TelemetryPoint[],
  fixture: Stage05ConsoleFixture,
): TelemetryPoint[] {
  const knownChannelIds = new Set(fixture.channels.map((channel) => channel.channelId));
  const updatesByChannelId = new Map(
    updates
      .filter((point) => knownChannelIds.has(point.channelId))
      .map((point) => [point.channelId, point]),
  );
  const merged = currentPoints.map((point) => updatesByChannelId.get(point.channelId) ?? point);
  const currentChannelIds = new Set(merged.map((point) => point.channelId));

  for (const point of updatesByChannelId.values()) {
    if (!currentChannelIds.has(point.channelId)) {
      merged.push(point);
    }
  }

  return merged;
}

function mergeAlerts(
  currentAlerts: AlertRecord[],
  updates: AlertRecord[],
): AlertRecord[] {
  const updatesByAlertId = new Map(updates.map((alert) => [alert.alertId, alert]));
  const preservedAlerts = currentAlerts.filter((alert) => {
    const incoming = updatesByAlertId.get(alert.alertId);
    if (incoming) {
      return false;
    }
    return alert.state !== "active";
  });

  return [...preservedAlerts, ...updates].sort(
    (left, right) =>
      left.timestamp.localeCompare(right.timestamp) ||
      left.alertId.localeCompare(right.alertId),
  );
}

function appendTrendSamples(
  currentTrends: TrendSample[],
  points: TelemetryPoint[],
): TrendSample[] {
  const selectedChannelIds = new Set(selectedStage05ChannelIds);
  let nextTrends = currentTrends;

  for (const point of points) {
    if (!selectedChannelIds.has(point.channelId)) {
      continue;
    }
    if (
      nextTrends.some(
        (sample) =>
          sample.channelId === point.channelId && sample.timestamp === point.timestamp,
      )
    ) {
      continue;
    }

    const channelSamples = nextTrends.filter(
      (sample) => sample.channelId === point.channelId,
    );
    const latestSample = channelSamples.at(-1);
    const nextSample: TrendSample = {
      timestamp: point.timestamp,
      sample: (latestSample?.sample ?? -1) + 1,
      elapsedSeconds: (latestSample?.elapsedSeconds ?? -10) + 10,
      channelId: point.channelId,
      value: point.value,
      status: point.status,
    };
    nextTrends = [...nextTrends, nextSample];
  }

  return nextTrends;
}

function normalizeTelemetryPoint(payload: unknown): TelemetryPoint | null {
  if (!isRecord(payload)) {
    return null;
  }

  const channelId = stringFrom(payload.channel_id);
  const timestamp = stringFrom(payload.timestamp);
  const value = numberFrom(payload.value);
  const unit = stringFrom(payload.unit);
  const status = telemetryStatusFrom(payload.status);
  const quality = stringFrom(payload.quality);
  if (
    !channelId ||
    !timestamp ||
    value === undefined ||
    !unit ||
    !status ||
    !quality ||
    !telemetryQualities.has(quality)
  ) {
    return null;
  }

  return {
    channelId,
    timestamp,
    value,
    unit,
    status,
    quality: quality as TelemetryPoint["quality"],
  };
}

function normalizeAlert(payload: unknown): AlertRecord | null {
  if (!isRecord(payload)) {
    return null;
  }

  const alertId = stringFrom(payload.alert_id);
  const channelId = stringFrom(payload.channel_id);
  const severity = stringFrom(payload.severity);
  const state = stringFrom(payload.state);
  const message = stringFrom(payload.message);
  const recommendedAction = stringFrom(payload.recommended_action);
  if (
    !alertId ||
    !channelId ||
    !["info", "warning", "critical"].includes(severity ?? "") ||
    !["active", "acknowledged", "resolved"].includes(state ?? "") ||
    !message ||
    !recommendedAction
  ) {
    return null;
  }

  return {
    alertId,
    channelId,
    severity: severity as AlertRecord["severity"],
    state: state as AlertRecord["state"],
    message,
    recommendedAction,
    observedValue: numberFrom(payload.observed_value),
    threshold: isRecord(payload.threshold)
      ? {
          operator: stringFrom(payload.threshold.operator) ?? "",
          value: numberFrom(payload.threshold.value) ?? 0,
          unit: stringFrom(payload.threshold.unit) ?? "",
        }
      : undefined,
    acknowledgedAt: stringFrom(payload.acknowledged_at),
    acknowledgedBy: stringFrom(payload.acknowledged_by),
    operatorNote: stringFrom(payload.operator_note),
  };
}

function latestTimestamp(points: TelemetryPoint[]): string | null {
  return (
    points
      .map((point) => point.timestamp)
      .sort((left, right) => right.localeCompare(left))[0] ?? null
  );
}

function telemetryStatusFrom(value: unknown): TelemetryStatus | null {
  return typeof value === "string" && telemetryStatuses.has(value as TelemetryStatus)
    ? (value as TelemetryStatus)
    : null;
}

function numberFrom(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function stringFrom(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function arrayFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneFixture(fixture: Stage05ConsoleFixture): Stage05ConsoleFixture {
  return {
    ...fixture,
    source: { ...fixture.source },
    channels: fixture.channels.map((channel) => ({
      ...channel,
      nominalRange: { ...channel.nominalRange },
      warningRange: { ...channel.warningRange },
      criticalRange: { ...channel.criticalRange },
    })),
    points: fixture.points.map((point) => ({ ...point })),
    alerts: fixture.alerts.map((alert) => ({
      ...alert,
      threshold: alert.threshold ? { ...alert.threshold } : undefined,
    })),
    faults: fixture.faults?.map((fault) => ({
      ...fault,
      targetChannelIds: [...fault.targetChannelIds],
    })),
    events: fixture.events?.map((event) => ({ ...event })),
    replay: fixture.replay
      ? {
          ...fixture.replay,
          window: { ...fixture.replay.window },
          markers: fixture.replay.markers.map((marker) => ({ ...marker })),
          anomalies: fixture.replay.anomalies.map((anomaly) => ({ ...anomaly })),
          summary: {
            ...fixture.replay.summary,
            affectedChannelIds: [...fixture.replay.summary.affectedChannelIds],
          },
        }
      : undefined,
    trends: fixture.trends.map((sample) => ({ ...sample })),
  };
}
