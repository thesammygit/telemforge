import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildReplayInspectionView,
  buildMissionConsoleView,
  formatTelemetryValue,
  selectedStage05ChannelIds,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage05ConsoleFixture } from "../../frontend/src/lib/stage05ConsoleFixture.ts";
import { stage06ConsoleFixture } from "../../frontend/src/lib/stage06ConsoleFixture.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView summarizes degraded mission health", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture);

  assert.equal(view.mission.spacecraftId, "tf-sat-01");
  assert.equal(view.mission.scenario, "degraded-eclipse-thermal-comms");
  assert.equal(view.mission.healthState, "critical");
  assert.deepEqual(view.mission.statusCounts, {
    nominal: 1,
    warning: 7,
    critical: 2,
    offline: 0,
  });
  assert.equal(view.mission.activeAlertCount, 3);
});

test("buildMissionConsoleView ranks subsystem status by worst channel", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture, "thermal");

  assert.deepEqual(
    view.subsystems.map((subsystem) => [
      subsystem.id,
      subsystem.status,
      subsystem.channelCount,
    ]),
    [
      ["thermal", "critical", 2],
      ["comms", "critical", 2],
      ["eps", "warning", 2],
      ["adcs", "warning", 2],
      ["payload", "warning", 1],
      ["prop", "nominal", 1],
    ],
  );
  assert.equal(view.selectedSubsystem.id, "thermal");
  assert.equal(
    view.selectedSubsystem.channels[0].channelId,
    "thermal.avionics_temp",
  );
  assert.equal(view.selectedSubsystem.channels[0].formattedValue, "62.8 degC");
});

test("formatTelemetryValue respects channel precision and units", () => {
  assert.equal(formatTelemetryValue(25.4, "V", 2), "25.40 V");
  assert.equal(formatTelemetryValue(3460, "rpm", 0), "3460 rpm");
  assert.equal(formatTelemetryValue(0.33, "deg", 3), "0.330 deg");
});

test("buildMissionConsoleView exposes deterministic trend summaries", () => {
  const view = buildMissionConsoleView(stage05ConsoleFixture, "thermal");
  const avionics = view.trends.find(
    (trend) => trend.channelId === "thermal.avionics_temp",
  );

  assert.ok(avionics);
  assert.equal(avionics.name, "Avionics Bay Temperature");
  assert.equal(avionics.unit, "degC");
  assert.equal(avionics.direction, "rising");
  assert.equal(avionics.samples.length, 12);
  assert.equal(avionics.firstValue, 24.7);
  assert.equal(avionics.lastValue, 62.8);
  assert.equal(avionics.minimum, 24.7);
  assert.equal(avionics.maximum, 62.8);
  assert.ok(avionics.svgPath.startsWith("M "));
});

test("Stage 05 fixture keeps trend channels intentionally small", () => {
  assert.deepEqual(selectedStage05ChannelIds, [
    "eps.battery_voltage",
    "thermal.avionics_temp",
    "comms.downlink_snr_db",
    "comms.packet_error_rate_pct",
  ]);
});

test("Stage 05 frontend fixture matches source snapshot and trend artifacts", () => {
  const snapshot = JSON.parse(
    readFileSync(
      resolve(repoRoot, "fixtures/telemetry/degraded_snapshot.json"),
      "utf8",
    ),
  );
  const trendRows = readCsv(
    resolve(
      repoRoot,
      "docs/development/artifacts/stage03-simulation/degraded-eclipse-thermal-comms.csv",
    ),
  );

  assert.deepEqual(
    stage05ConsoleFixture.points.map((point) => ({
      channel_id: point.channelId,
      value: point.value,
      status: point.status,
    })),
    snapshot.points.map(
      (point: { channel_id: string; value: number; status: string }) => ({
        channel_id: point.channel_id,
        value: point.value,
        status: point.status,
      }),
    ),
  );

  const selectedTrendRows = trendRows
    .filter((row) => selectedStage05ChannelIds.includes(row.channel_id))
    .sort(
      (left, right) =>
        selectedStage05ChannelIds.indexOf(left.channel_id) -
          selectedStage05ChannelIds.indexOf(right.channel_id) ||
        Number(left.sample) - Number(right.sample),
    )
    .map((row) => ({
      channelId: row.channel_id,
      sample: Number(row.sample),
      value: Number(row.value),
      status: row.status,
    }));

  assert.deepEqual(
    stage05ConsoleFixture.trends.map((sample) => ({
      channelId: sample.channelId,
      sample: sample.sample,
      value: sample.value,
      status: sample.status,
    })),
    selectedTrendRows,
  );
});

test("buildMissionConsoleView exposes the Stage 06 incident timeline", () => {
  const view = buildMissionConsoleView(stage06ConsoleFixture, "thermal");

  assert.equal(view.mission.activeFaultCount, 1);
  assert.equal(view.incident.activeFaults[0].faultType, "thermal_avionics_overheat");
  assert.equal(view.incident.timeline.length, 3);
  assert.deepEqual(
    view.incident.timeline.map((event) => event.eventType),
    ["fault.injected", "telemetry.affected", "alert.raised"],
  );
  assert.equal(view.incident.timeline[1].channelId, "thermal.avionics_temp");
  assert.equal(view.incident.timeline[2].severity, "critical");
  assert.equal(
    view.alerts.find((alert) => alert.alertId === "alert-stage06-thermal-avionics")?.relatedFaultId,
    "fault-stage06-thermal-avionics",
  );
});

test("buildReplayInspectionView summarizes Stage 07 markers and anomalies", () => {
  assert.ok(stage07ConsoleFixture.replay);

  const replay = buildReplayInspectionView(stage07ConsoleFixture.replay);

  assert.equal(
    replay.windowLabel,
    "2026-04-30T19:14:50Z to 2026-04-30T19:15:10Z",
  );
  assert.equal(replay.markerCount, 5);
  assert.deepEqual(
    replay.timelineMarkers.map((marker) => marker.kind),
    ["fault", "event", "event", "event", "alert"],
  );
  assert.equal(replay.topAnomalies[0].channelId, "thermal.avionics_temp");
  assert.equal(replay.topAnomalies[0].severity, "critical");
  assert.equal(replay.topAnomalies[0].scoreLabel, "100%");
  assert.ok(
    replay.topAnomalies[0].reason.includes("warning high limit 55.0 degC"),
  );
});

test("buildMissionConsoleView includes Stage 07 replay overlay data when provided", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");

  assert.ok(view.replay);
  assert.equal(view.replay.markerCount, 5);
  assert.equal(view.replay.topAnomalies[0].channelName, "Avionics Bay Temperature");
});

test("buildMissionConsoleView surfaces acknowledged alerts and lifecycle history", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:10:00Z",
  );
  const view = buildMissionConsoleView(acknowledgedFixture, "thermal");

  assert.equal(view.mission.activeAlertCount, 2);
  assert.equal(view.mission.acknowledgedAlertCount, 1);
  assert.equal(
    view.alerts.find(
      (alert) => alert.alertId === "alert-stage06-thermal-avionics",
    )?.state,
    "acknowledged",
  );
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.acknowledged");
  assert.ok(view.replay);
  assert.equal(view.replay?.markerCount, 6);
  assert.equal(view.replay?.timelineMarkers.at(-1)?.markerType, "alert.acknowledged");
});

test("buildMissionConsoleView surfaces resolved alerts and lifecycle history", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:10:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-23T04:12:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");

  assert.equal(view.mission.activeAlertCount, 2);
  assert.equal(view.mission.acknowledgedAlertCount, 0);
  assert.equal(view.mission.resolvedAlertCount, 1);
  assert.equal(
    view.alerts.find(
      (alert) => alert.alertId === "alert-stage06-thermal-avionics",
    )?.state,
    "resolved",
  );
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.resolved");
  assert.ok(view.replay);
  assert.equal(view.replay?.markerCount, 7);
  assert.equal(view.replay?.timelineMarkers.at(-1)?.markerType, "alert.resolved");
});

test("buildMissionConsoleView exposes the selected Stage 11 runbook playback state", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");

  assert.ok(view.runbook);
  assert.equal(view.runbook.selectedRunbookId, "thermal-alert-response-local");
  assert.equal(view.runbook.steps.length, 5);
  assert.equal(view.runbook.currentStepId, "acknowledge-alert");
  assert.equal(view.runbook.nextAction?.kind, "acknowledge_alert");
});

test("buildMissionConsoleView exposes the Stage 12 incident review packet", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:30:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-26T04:32:00Z",
  );
  const view = buildMissionConsoleView(resolvedFixture, "thermal");

  assert.ok(view.incidentReviewPacket);
  assert.equal(view.incidentReviewPacket.readiness.status, "ready");
  assert.equal(view.incidentReviewPacket.eventHistory.relatedEventCount, 5);
  assert.equal(view.incidentReviewPacket.replayEvidence.relatedMarkerCount, 7);
});

function readCsv(path: string): Array<Record<string, string>> {
  const [headerLine, ...lines] = readFileSync(path, "utf8").trim().split("\n");
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    );
  });
}
