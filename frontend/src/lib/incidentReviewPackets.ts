import type {
  AlertRecord,
  EventLogEntry,
  IncidentReviewPacketView,
  ReplayMarker,
  ScenarioRunbookDefinition,
  Stage05ConsoleFixture,
} from "../features/mission-console/types.ts";
import {
  buildScenarioRunbookPlayback,
  localScenarioRunbooks,
} from "./scenarioRunbooks.ts";

const requiredEventTypes = [
  "alert.raised",
  "alert.acknowledged",
  "alert.resolved",
];
const requiredReplayMarkerTypes = [
  "alert.raised",
  "alert.acknowledged",
  "alert.resolved",
];

export function buildIncidentReviewPacket(
  fixture: Stage05ConsoleFixture,
  selectedRunbookId = localScenarioRunbooks[0].runbookId,
): IncidentReviewPacketView {
  const runbook =
    localScenarioRunbooks.find((candidate) => candidate.runbookId === selectedRunbookId) ??
    localScenarioRunbooks[0];
  const playback = buildScenarioRunbookPlayback(fixture, runbook.runbookId);
  const targetAlert = findTargetAlert(fixture.alerts, runbook);
  const relatedEvents = relatedLifecycleEvents(fixture.events ?? [], runbook, targetAlert);
  const relatedMarkers = relatedReplayMarkers(
    fixture.replay?.markers ?? [],
    runbook,
    targetAlert,
  );
  const evidenceGaps = buildEvidenceGaps(targetAlert, relatedEvents, relatedMarkers);

  return {
    schema: "telemforge.incident_review_packet.v1",
    packetId: `incident-review:${fixture.spacecraftId}:${runbook.runbookId}`,
    title: `${runbook.title} Incident Review`,
    runbook: {
      runbookId: runbook.runbookId,
      scenario: runbook.scenario,
      mode: runbook.mode,
      targetAlertId: runbook.targetAlertId,
      targetChannelId: runbook.targetChannelId,
      targetFaultId: runbook.targetFaultId,
    },
    readiness: {
      status: readinessStatus(targetAlert, evidenceGaps),
      completedStepCount: playback.completedStepIds.length,
      totalStepCount: runbook.steps.length,
      unresolvedGapCount: evidenceGaps.length,
    },
    alertLifecycle: buildAlertLifecycle(targetAlert, runbook),
    operatorActions: buildOperatorActions(relatedEvents),
    eventHistory: {
      relatedEventCount: relatedEvents.length,
      eventTypes: uniqueSorted(relatedEvents.map((event) => event.eventType)),
      latestEventAt: relatedEvents.at(-1)?.timestamp ?? null,
    },
    replayEvidence: {
      sampleCount: fixture.replay?.summary.sampleCount ?? 0,
      anomalyCount: fixture.replay?.summary.anomalyCount ?? 0,
      relatedMarkerCount: relatedMarkers.length,
      markerTypes: uniqueSorted(relatedMarkers.map((marker) => marker.markerType)),
      affectedChannelIds: fixture.replay?.summary.affectedChannelIds ?? [],
    },
    evidenceGaps,
    sourceRefs: [
      {
        label: "Fixture/runbook playback",
        path: "frontend/src/lib/scenarioRunbooks.ts",
      },
      {
        label: "Operator lifecycle actions",
        path: "frontend/src/lib/operatorWorkflow.ts",
      },
      {
        label: "Replay fixture evidence",
        path: "frontend/src/lib/stage07ConsoleFixture.ts",
      },
    ],
    deferredFeatures: [...runbook.deferredFeatures],
  };
}

function findTargetAlert(
  alerts: AlertRecord[],
  runbook: ScenarioRunbookDefinition,
): AlertRecord | undefined {
  return (
    alerts.find((alert) => alert.alertId === runbook.targetAlertId) ??
    alerts.find((alert) => alert.channelId === runbook.targetChannelId)
  );
}

function relatedLifecycleEvents(
  events: EventLogEntry[],
  runbook: ScenarioRunbookDefinition,
  targetAlert: AlertRecord | undefined,
): EventLogEntry[] {
  return events
    .filter(
      (event) =>
        event.alertId === targetAlert?.alertId ||
        event.channelId === runbook.targetChannelId ||
        event.relatedFaultId === runbook.targetFaultId,
    )
    .sort(
      (left, right) =>
        left.timestamp.localeCompare(right.timestamp) ||
        left.eventId.localeCompare(right.eventId),
    );
}

function relatedReplayMarkers(
  markers: ReplayMarker[],
  runbook: ScenarioRunbookDefinition,
  targetAlert: AlertRecord | undefined,
): ReplayMarker[] {
  return markers
    .filter(
      (marker) =>
        marker.alertId === targetAlert?.alertId ||
        marker.channelId === runbook.targetChannelId ||
        marker.relatedFaultId === runbook.targetFaultId,
    )
    .sort(
      (left, right) =>
        left.timestamp.localeCompare(right.timestamp) ||
        left.kind.localeCompare(right.kind) ||
        left.markerId.localeCompare(right.markerId),
    );
}

function buildEvidenceGaps(
  targetAlert: AlertRecord | undefined,
  relatedEvents: EventLogEntry[],
  relatedMarkers: ReplayMarker[],
): IncidentReviewPacketView["evidenceGaps"] {
  if (!targetAlert) {
    return [
      {
        gapId: "target-alert-missing",
        summary: "The runbook target alert is not present in the local evidence.",
      },
    ];
  }

  const eventTypes = new Set(relatedEvents.map((event) => event.eventType));
  const markerTypes = new Set(relatedMarkers.map((marker) => marker.markerType));
  const gaps: IncidentReviewPacketView["evidenceGaps"] = [];

  if (targetAlert.state === "active") {
    gaps.push({
      gapId: "alert-not-acknowledged",
      summary: "The target alert has not been acknowledged.",
    });
  }
  if (targetAlert.state !== "resolved") {
    gaps.push({
      gapId: "alert-not-resolved",
      summary: "The target alert has not been resolved.",
    });
  }
  if (requiredEventTypes.some((eventType) => !eventTypes.has(eventType))) {
    gaps.push({
      gapId: "event-history-incomplete",
      summary: "Raised, acknowledged, and resolved events are not all present.",
    });
  }
  if (requiredReplayMarkerTypes.some((markerType) => !markerTypes.has(markerType))) {
    gaps.push({
      gapId: "replay-evidence-incomplete",
      summary: "Replay markers do not yet cover the full alert lifecycle.",
    });
  }
  return gaps;
}

function readinessStatus(
  targetAlert: AlertRecord | undefined,
  evidenceGaps: IncidentReviewPacketView["evidenceGaps"],
): IncidentReviewPacketView["readiness"]["status"] {
  if (!targetAlert) {
    return "blocked";
  }
  return evidenceGaps.length ? "in_progress" : "ready";
}

function buildAlertLifecycle(
  targetAlert: AlertRecord | undefined,
  runbook: ScenarioRunbookDefinition,
): IncidentReviewPacketView["alertLifecycle"] {
  if (!targetAlert) {
    return {
      targetAlertId: runbook.targetAlertId,
      channelId: runbook.targetChannelId,
      state: "missing",
      severity: null,
    };
  }
  return {
    targetAlertId: targetAlert.alertId,
    channelId: targetAlert.channelId,
    state: targetAlert.state,
    severity: targetAlert.severity,
    acknowledgedAt: targetAlert.acknowledgedAt,
    acknowledgedBy: targetAlert.acknowledgedBy,
    resolvedAt: targetAlert.resolvedAt,
    resolvedBy: targetAlert.resolvedBy,
  };
}

function buildOperatorActions(
  relatedEvents: EventLogEntry[],
): IncidentReviewPacketView["operatorActions"] {
  const eventsByType = new Map(
    relatedEvents.map((event) => [event.eventType, event]),
  );
  return [
    buildOperatorAction("acknowledge_alert", eventsByType.get("alert.acknowledged")),
    buildOperatorAction("resolve_alert", eventsByType.get("alert.resolved")),
  ];
}

function buildOperatorAction(
  actionKind: "acknowledge_alert" | "resolve_alert",
  event: EventLogEntry | undefined,
): IncidentReviewPacketView["operatorActions"][number] {
  if (!event) {
    return {
      actionKind,
      status: "pending",
      timestamp: null,
      actor: null,
      sourceEventId: null,
    };
  }
  return {
    actionKind,
    status: "complete",
    timestamp: event.timestamp,
    actor:
      actionKind === "acknowledge_alert"
        ? event.acknowledgedBy ?? null
        : event.resolvedBy ?? null,
    sourceEventId: event.eventId,
  };
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}
