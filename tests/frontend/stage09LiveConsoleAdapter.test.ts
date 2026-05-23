import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMissionConsoleView,
} from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import {
  applyStage09LiveConsoleMessage,
  createStage09LiveConsoleState,
  setStage09LiveConsoleConnection,
} from "../../frontend/src/lib/stage09LiveConsoleAdapter.ts";
import {
  acknowledgeAlertInFixture,
  resolveAlertInFixture,
} from "../../frontend/src/lib/operatorWorkflow.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

test("createStage09LiveConsoleState keeps the fixture-backed console fallback", () => {
  const state = createStage09LiveConsoleState(stage07ConsoleFixture);
  const view = buildMissionConsoleView(
    state.fixture,
    "thermal",
    state.connection,
  );

  assert.equal(view.stream.state, "fixture");
  assert.equal(view.mission.sourceLabel, "Stage 07 replay/anomaly fixture");
  assert.equal(view.selectedSubsystem.channels[0].formattedValue, "62.8 degC");
  assert.ok(view.replay);
});

test("stream.snapshot updates mission overview and selected channel readouts", () => {
  const state = applyStage09LiveConsoleMessage(
    setStage09LiveConsoleConnection(
      createStage09LiveConsoleState(stage07ConsoleFixture),
      "connecting",
    ),
    {
      type: "stream.snapshot",
      session_id: "session-stage09",
      sequence: 1,
      emitted_at: "2026-05-22T04:00:00Z",
      payload: {
        latest_points: [
          {
            channel_id: "eps.battery_voltage",
            timestamp: "2026-05-22T04:00:00Z",
            value: 29.82,
            unit: "V",
            status: "nominal",
            quality: "valid",
          },
          {
            channel_id: "comms.downlink_snr_db",
            timestamp: "2026-05-22T04:00:00Z",
            value: 4.4,
            unit: "dB",
            status: "critical",
            quality: "suspect",
          },
        ],
        active_alerts: [
          {
            alert_id: "alert-live-comms",
            channel_id: "comms.downlink_snr_db",
            severity: "critical",
            state: "active",
            message: "Downlink margin is critical.",
            recommended_action: "Switch to low-rate telemetry.",
          },
        ],
      },
    },
  );

  const view = buildMissionConsoleView(state.fixture, "eps", state.connection);
  const battery = view.selectedSubsystem.channels.find(
    (channel) => channel.channelId === "eps.battery_voltage",
  );

  assert.equal(view.stream.state, "live");
  assert.equal(view.stream.lastSequence, 1);
  assert.equal(view.mission.capturedAt, "2026-05-22T04:00:00Z");
  assert.equal(view.mission.activeAlertCount, 1);
  assert.equal(battery?.formattedValue, "29.82 V");
  assert.equal(battery?.status, "nominal");
});

test("stream.snapshot preserves acknowledged alerts while refreshing active alerts", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-22T04:00:00Z",
  );
  const state = applyStage09LiveConsoleMessage(
    setStage09LiveConsoleConnection(
      createStage09LiveConsoleState(acknowledgedFixture),
      "connecting",
    ),
    {
      type: "stream.snapshot",
      session_id: "session-stage09",
      sequence: 1,
      emitted_at: "2026-05-22T04:00:00Z",
      payload: {
        latest_points: [],
        active_alerts: [],
      },
    },
  );

  const view = buildMissionConsoleView(state.fixture, "thermal", state.connection);

  assert.equal(view.mission.activeAlertCount, 0);
  assert.equal(view.mission.acknowledgedAlertCount, 1);
  assert.equal(view.alerts[0].state, "acknowledged");
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.acknowledged");
});

test("stream.snapshot preserves resolved alerts while refreshing active alerts", () => {
  const acknowledgedFixture = acknowledgeAlertInFixture(
    stage07ConsoleFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-22T04:00:00Z",
  );
  const resolvedFixture = resolveAlertInFixture(
    acknowledgedFixture,
    "alert-stage06-thermal-avionics",
    "2026-05-22T04:05:00Z",
  );
  const state = applyStage09LiveConsoleMessage(
    setStage09LiveConsoleConnection(
      createStage09LiveConsoleState(resolvedFixture),
      "connecting",
    ),
    {
      type: "stream.snapshot",
      session_id: "session-stage09",
      sequence: 1,
      emitted_at: "2026-05-22T04:06:00Z",
      payload: {
        latest_points: [],
        active_alerts: [],
      },
    },
  );

  const view = buildMissionConsoleView(state.fixture, "thermal", state.connection);

  assert.equal(view.mission.activeAlertCount, 0);
  assert.equal(view.mission.acknowledgedAlertCount, 0);
  assert.equal(view.mission.resolvedAlertCount, 1);
  assert.equal(view.alerts[0].state, "resolved");
  assert.equal(view.incident.timeline.at(-1)?.eventType, "alert.resolved");
});

test("telemetry.sample appends ordered trend samples and ignores duplicates", () => {
  const first = applyStage09LiveConsoleMessage(
    createStage09LiveConsoleState(stage07ConsoleFixture),
    {
      type: "telemetry.sample",
      session_id: "session-stage09",
      sequence: 2,
      emitted_at: "2026-05-22T04:00:01Z",
      payload: {
        channel_id: "eps.battery_voltage",
        timestamp: "2026-05-22T04:00:01Z",
        value: 30.12,
        unit: "V",
        status: "nominal",
        quality: "valid",
        sequence: 32,
      },
    },
  );
  const duplicate = applyStage09LiveConsoleMessage(first, {
    type: "telemetry.sample",
    session_id: "session-stage09",
    sequence: 2,
    emitted_at: "2026-05-22T04:00:02Z",
    payload: {
      channel_id: "eps.battery_voltage",
      timestamp: "2026-05-22T04:00:02Z",
      value: 1,
      unit: "V",
      status: "critical",
      quality: "suspect",
      sequence: 33,
    },
  });

  const view = buildMissionConsoleView(duplicate.fixture, "eps", duplicate.connection);
  const trend = view.trends.find(
    (candidate) => candidate.channelId === "eps.battery_voltage",
  );
  const battery = view.selectedSubsystem.channels.find(
    (channel) => channel.channelId === "eps.battery_voltage",
  );

  assert.equal(view.stream.lastSequence, 2);
  assert.equal(battery?.formattedValue, "30.12 V");
  assert.equal(trend?.samples.at(-1)?.timestamp, "2026-05-22T04:00:01Z");
  assert.equal(trend?.lastValue, 30.12);
});

test("stream.backpressure marks the live stream degraded without corrupting values", () => {
  const live = applyStage09LiveConsoleMessage(
    createStage09LiveConsoleState(stage07ConsoleFixture),
    {
      type: "telemetry.sample",
      session_id: "session-stage09",
      sequence: 3,
      emitted_at: "2026-05-22T04:00:03Z",
      payload: {
        channel_id: "comms.packet_error_rate_pct",
        timestamp: "2026-05-22T04:00:03Z",
        value: 0.22,
        unit: "pct",
        status: "nominal",
        quality: "valid",
        sequence: 12,
      },
    },
  );
  const degraded = applyStage09LiveConsoleMessage(live, {
    type: "stream.backpressure",
    session_id: "session-stage09",
    sequence: 4,
    emitted_at: "2026-05-22T04:00:04Z",
    payload: {
      policy: "drop_oldest_and_report",
      queue_scope: "per_connection",
      client_queue_depth: 250,
      dropped_event_count: 17,
    },
  });

  const view = buildMissionConsoleView(
    degraded.fixture,
    "comms",
    degraded.connection,
  );
  const packetErrors = view.selectedSubsystem.channels.find(
    (channel) => channel.channelId === "comms.packet_error_rate_pct",
  );

  assert.equal(view.stream.state, "degraded");
  assert.equal(view.stream.droppedEventCount, 17);
  assert.match(view.stream.detail, /17 dropped/);
  assert.equal(packetErrors?.formattedValue, "0.22 pct");
});
