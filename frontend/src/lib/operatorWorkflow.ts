import type {
  AlertRecord,
  EventLogEntry,
  ReplayMarker,
  Stage05ConsoleFixture,
} from "../features/mission-console/types.ts";

export function acknowledgeAlertInFixture(
  fixture: Stage05ConsoleFixture,
  alertId: string,
  acknowledgedAt: string,
  acknowledgedBy = "local operator",
  operatorNote = "Acknowledged from the mission console",
): Stage05ConsoleFixture {
  const alertIndex = fixture.alerts.findIndex((alert) => alert.alertId === alertId);
  if (alertIndex === -1) {
    return fixture;
  }

  const currentAlert = fixture.alerts[alertIndex];
  if (currentAlert.state !== "active") {
    return fixture;
  }

  const updatedAlert: AlertRecord = {
    ...currentAlert,
    state: "acknowledged",
    acknowledgedAt,
    acknowledgedBy,
    operatorNote,
  };
  const updatedEvent = buildAcknowledgementEvent(
    updatedAlert,
    acknowledgedAt,
    acknowledgedBy,
    operatorNote,
  );

  return {
    ...fixture,
    alerts: fixture.alerts.map((alert) =>
      alert.alertId === alertId ? updatedAlert : { ...alert },
    ),
    events: [...(fixture.events ?? []).map((event) => ({ ...event })), updatedEvent],
    replay: fixture.replay
      ? {
          ...fixture.replay,
          window: { ...fixture.replay.window },
          markers: [...fixture.replay.markers.map((marker) => ({ ...marker })), buildAcknowledgementMarker(updatedAlert, acknowledgedAt, acknowledgedBy, operatorNote)],
          anomalies: fixture.replay.anomalies.map((anomaly) => ({ ...anomaly })),
          summary: {
            ...fixture.replay.summary,
            affectedChannelIds: [...fixture.replay.summary.affectedChannelIds],
            markerCount: fixture.replay.summary.markerCount + 1,
          },
        }
      : undefined,
  };
}

export function resolveAlertInFixture(
  fixture: Stage05ConsoleFixture,
  alertId: string,
  resolvedAt: string,
  resolvedBy = "local operator",
  resolutionNote = "Resolved from the mission console",
): Stage05ConsoleFixture {
  const alertIndex = fixture.alerts.findIndex((alert) => alert.alertId === alertId);
  if (alertIndex === -1) {
    return fixture;
  }

  const currentAlert = fixture.alerts[alertIndex];
  if (currentAlert.state !== "acknowledged") {
    return fixture;
  }

  const updatedAlert: AlertRecord = {
    ...currentAlert,
    state: "resolved",
    resolvedAt,
    resolvedBy,
    resolutionNote,
  };
  const updatedEvent = buildResolutionEvent(
    updatedAlert,
    resolvedAt,
    resolvedBy,
    resolutionNote,
  );

  return {
    ...fixture,
    alerts: fixture.alerts.map((alert) =>
      alert.alertId === alertId ? updatedAlert : { ...alert },
    ),
    events: [...(fixture.events ?? []).map((event) => ({ ...event })), updatedEvent],
    replay: fixture.replay
      ? {
          ...fixture.replay,
          window: { ...fixture.replay.window },
          markers: [
            ...fixture.replay.markers.map((marker) => ({ ...marker })),
            buildResolutionMarker(updatedAlert, resolvedAt, resolvedBy, resolutionNote),
          ],
          anomalies: fixture.replay.anomalies.map((anomaly) => ({ ...anomaly })),
          summary: {
            ...fixture.replay.summary,
            affectedChannelIds: [...fixture.replay.summary.affectedChannelIds],
            markerCount: fixture.replay.summary.markerCount + 1,
          },
        }
      : undefined,
  };
}

function buildAcknowledgementEvent(
  alert: AlertRecord,
  acknowledgedAt: string,
  acknowledgedBy: string,
  operatorNote: string,
): EventLogEntry {
  return {
    eventId: `event-alert-ack-${slug(alert.alertId)}-${slug(acknowledgedAt)}`,
    eventType: "alert.acknowledged",
    timestamp: acknowledgedAt,
    message: `Alert acknowledged: ${alert.channelId} by ${acknowledgedBy}.`,
    relatedFaultId: alert.relatedFaultId,
    channelId: alert.channelId,
    alertId: alert.alertId,
    severity: alert.severity,
    acknowledgedBy,
    operatorNote,
  };
}

function buildAcknowledgementMarker(
  alert: AlertRecord,
  acknowledgedAt: string,
  acknowledgedBy: string,
  operatorNote: string,
): ReplayMarker {
  return {
    markerId: `marker-alert-${slug(alert.alertId)}-${slug(acknowledgedAt)}`,
    kind: "alert",
    markerType: "alert.acknowledged",
    timestamp: acknowledgedAt,
    label: "acknowledged alert",
    message: `Alert acknowledged: ${alert.channelId} by ${acknowledgedBy}. ${
      operatorNote ? operatorNote : ""
    }`.trim(),
    severity: alert.severity,
    relatedFaultId: alert.relatedFaultId,
    channelId: alert.channelId,
    alertId: alert.alertId,
  };
}

function buildResolutionEvent(
  alert: AlertRecord,
  resolvedAt: string,
  resolvedBy: string,
  resolutionNote: string,
): EventLogEntry {
  return {
    eventId: `event-alert-resolved-${slug(alert.alertId)}-${slug(resolvedAt)}`,
    eventType: "alert.resolved",
    timestamp: resolvedAt,
    message: `Alert resolved: ${alert.channelId} by ${resolvedBy}.`,
    relatedFaultId: alert.relatedFaultId,
    channelId: alert.channelId,
    alertId: alert.alertId,
    severity: alert.severity,
    resolvedBy,
    resolutionNote,
  };
}

function buildResolutionMarker(
  alert: AlertRecord,
  resolvedAt: string,
  resolvedBy: string,
  resolutionNote: string,
): ReplayMarker {
  return {
    markerId: `marker-alert-resolved-${slug(alert.alertId)}-${slug(resolvedAt)}`,
    kind: "alert",
    markerType: "alert.resolved",
    timestamp: resolvedAt,
    label: "resolved alert",
    message: `Alert resolved: ${alert.channelId} by ${resolvedBy}. ${
      resolutionNote ? resolutionNote : ""
    }`.trim(),
    severity: alert.severity,
    relatedFaultId: alert.relatedFaultId,
    channelId: alert.channelId,
    alertId: alert.alertId,
  };
}

function slug(value: string): string {
  return value.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}
