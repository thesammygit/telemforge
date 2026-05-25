import type {
  AlertRecord,
  EventLogEntry,
  ReplayMarker,
  ScenarioRunbookDefinition,
  ScenarioRunbookEvidenceLink,
  ScenarioRunbookNextAction,
  ScenarioRunbookPlaybackView,
  ScenarioRunbookStepDefinition,
  Stage05ConsoleFixture,
} from "../features/mission-console/types.ts";

const thermalAlertRunbookSteps: ScenarioRunbookStepDefinition[] = [
  {
    stepId: "triage-alert",
    title: "Triage thermal alert",
    actionKind: "inspect_alert",
    evidenceTarget: "alert-lifecycle",
    summary: "Confirm the active thermal alert and recommended action.",
  },
  {
    stepId: "acknowledge-alert",
    title: "Acknowledge alert",
    actionKind: "acknowledge_alert",
    evidenceTarget: "alert-lifecycle",
    summary: "Move the local alert from active to acknowledged.",
  },
  {
    stepId: "resolve-alert",
    title: "Resolve alert",
    actionKind: "resolve_alert",
    evidenceTarget: "alert-lifecycle",
    summary: "Complete the local alert resolution lifecycle.",
  },
  {
    stepId: "review-event-history",
    title: "Review event history",
    actionKind: "inspect_timeline",
    evidenceTarget: "fault-incident-timeline",
    summary: "Confirm raised, acknowledged, and resolved events.",
  },
  {
    stepId: "inspect-replay-evidence",
    title: "Inspect replay evidence",
    actionKind: "inspect_replay",
    evidenceTarget: "replay-anomaly-inspection",
    summary: "Confirm replay markers capture the completed lifecycle.",
  },
];

export const localScenarioRunbooks: ScenarioRunbookDefinition[] = [
  {
    runbookId: "thermal-alert-response-local",
    title: "Thermal Alert Response",
    scenario: "thermal-alert-response",
    mode: "fixture-first",
    supportedModes: ["fixture", "local-live"],
    targetAlertId: "alert-stage06-thermal-avionics",
    targetChannelId: "thermal.avionics_temp",
    targetFaultId: "fault-stage06-thermal-avionics",
    summary:
      "Guides a reviewer through the local avionics overheat alert lifecycle from triage to replay evidence.",
    steps: thermalAlertRunbookSteps,
    deferredFeatures: [
      "production authentication and multi-operator identity",
      "cloud-backed runbook persistence",
      "free-form runbook authoring",
      "incident report export",
    ],
  },
];

export function buildScenarioRunbookPlayback(
  fixture: Stage05ConsoleFixture,
  selectedRunbookId = localScenarioRunbooks[0].runbookId,
): ScenarioRunbookPlaybackView {
  const runbook =
    localScenarioRunbooks.find((candidate) => candidate.runbookId === selectedRunbookId) ??
    localScenarioRunbooks[0];
  const targetAlert = findTargetAlert(fixture.alerts, runbook);
  const completedStepIds = buildCompletedStepIds(fixture, runbook, targetAlert);
  const currentStepId = selectCurrentStepId(runbook.steps, completedStepIds);
  const completed = new Set(completedStepIds);

  return {
    availableRunbooks: localScenarioRunbooks.map((candidate) => ({
      runbookId: candidate.runbookId,
      title: candidate.title,
      mode: candidate.mode,
    })),
    selectedRunbookId: runbook.runbookId,
    title: runbook.title,
    scenario: runbook.scenario,
    mode: runbook.mode,
    summary: runbook.summary,
    targetAlertId: targetAlert?.alertId ?? null,
    currentStepId,
    completedStepIds,
    steps: runbook.steps.map((step) => ({
      ...step,
      status: completed.has(step.stepId)
        ? "complete"
        : step.stepId === currentStepId
          ? "current"
          : "pending",
    })),
    evidenceLinks: buildEvidenceLinks(fixture, runbook),
    nextAction: buildNextAction(currentStepId, targetAlert, completedStepIds),
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

function buildCompletedStepIds(
  fixture: Stage05ConsoleFixture,
  runbook: ScenarioRunbookDefinition,
  targetAlert: AlertRecord | undefined,
): string[] {
  const completed = new Set<string>();
  const relatedEvents = relatedLifecycleEvents(fixture.events ?? [], runbook, targetAlert);
  const relatedMarkers = relatedReplayMarkers(
    fixture.replay?.markers ?? [],
    runbook,
    targetAlert,
  );

  if (targetAlert) {
    completed.add("triage-alert");
  }
  if (
    targetAlert &&
    targetAlert.state !== "active" &&
    hasEventType(relatedEvents, "alert.acknowledged")
  ) {
    completed.add("acknowledge-alert");
  }
  if (
    targetAlert?.state === "resolved" &&
    hasEventType(relatedEvents, "alert.resolved")
  ) {
    completed.add("resolve-alert");
  }
  if (
    hasEventType(relatedEvents, "alert.raised") &&
    hasEventType(relatedEvents, "alert.acknowledged") &&
    hasEventType(relatedEvents, "alert.resolved")
  ) {
    completed.add("review-event-history");
  }
  if (
    hasMarkerType(relatedMarkers, "alert.active") &&
    hasMarkerType(relatedMarkers, "alert.acknowledged") &&
    hasMarkerType(relatedMarkers, "alert.resolved")
  ) {
    completed.add("inspect-replay-evidence");
  }

  return runbook.steps
    .map((step) => step.stepId)
    .filter((stepId) => completed.has(stepId));
}

function relatedLifecycleEvents(
  events: EventLogEntry[],
  runbook: ScenarioRunbookDefinition,
  targetAlert: AlertRecord | undefined,
): EventLogEntry[] {
  return events.filter(
    (event) =>
      event.alertId === targetAlert?.alertId ||
      event.channelId === runbook.targetChannelId ||
      event.relatedFaultId === runbook.targetFaultId,
  );
}

function relatedReplayMarkers(
  markers: ReplayMarker[],
  runbook: ScenarioRunbookDefinition,
  targetAlert: AlertRecord | undefined,
): ReplayMarker[] {
  return markers.filter(
    (marker) =>
      marker.alertId === targetAlert?.alertId ||
      marker.channelId === runbook.targetChannelId ||
      marker.relatedFaultId === runbook.targetFaultId,
  );
}

function hasEventType(events: EventLogEntry[], eventType: string): boolean {
  return events.some((event) => event.eventType === eventType);
}

function hasMarkerType(markers: ReplayMarker[], markerType: string): boolean {
  return markers.some((marker) => marker.markerType === markerType);
}

function selectCurrentStepId(
  steps: ScenarioRunbookStepDefinition[],
  completedStepIds: string[],
): string {
  const completed = new Set(completedStepIds);
  const firstIncomplete = steps.find((step) => !completed.has(step.stepId));
  return firstIncomplete?.stepId ?? steps.at(-1)?.stepId ?? "";
}

function buildEvidenceLinks(
  fixture: Stage05ConsoleFixture,
  runbook: ScenarioRunbookDefinition,
): ScenarioRunbookEvidenceLink[] {
  const targets = new Map<string, ScenarioRunbookEvidenceLink>();
  for (const step of runbook.steps) {
    targets.set(step.evidenceTarget, {
      stepId: step.stepId,
      label: evidenceLabel(step.evidenceTarget),
      target: step.evidenceTarget,
      state: isEvidenceAvailable(step.evidenceTarget, fixture)
        ? "available"
        : "pending",
    });
  }
  return Array.from(targets.values());
}

function evidenceLabel(target: string): string {
  const labels: Record<string, string> = {
    "alert-lifecycle": "Alert lifecycle",
    "fault-incident-timeline": "Event history",
    "replay-anomaly-inspection": "Replay evidence",
  };
  return labels[target] ?? target;
}

function isEvidenceAvailable(target: string, fixture: Stage05ConsoleFixture): boolean {
  if (target === "alert-lifecycle") {
    return fixture.alerts.length > 0;
  }
  if (target === "fault-incident-timeline") {
    return Boolean(fixture.events?.length);
  }
  if (target === "replay-anomaly-inspection") {
    return Boolean(fixture.replay?.markers.length);
  }
  return false;
}

function buildNextAction(
  currentStepId: string,
  targetAlert: AlertRecord | undefined,
  completedStepIds: string[],
): ScenarioRunbookNextAction | null {
  if (currentStepId === "acknowledge-alert" && targetAlert) {
    return {
      kind: "acknowledge_alert",
      alertId: targetAlert.alertId,
      label: "Acknowledge thermal alert",
    };
  }
  if (currentStepId === "resolve-alert" && targetAlert) {
    return {
      kind: "resolve_alert",
      alertId: targetAlert.alertId,
      label: "Resolve thermal alert",
    };
  }
  if (currentStepId === "review-event-history") {
    return {
      kind: "inspect_timeline",
      label: "Review event history",
    };
  }
  if (
    currentStepId === "inspect-replay-evidence" &&
    completedStepIds.includes("inspect-replay-evidence")
  ) {
    return {
      kind: "playback_complete",
      label: "Runbook playback complete",
    };
  }
  if (currentStepId === "inspect-replay-evidence") {
    return {
      kind: "inspect_replay",
      label: "Inspect replay evidence",
    };
  }
  return null;
}
