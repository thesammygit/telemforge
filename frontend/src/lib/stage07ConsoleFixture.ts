import type { Stage05ConsoleFixture } from "../features/mission-console/types.ts";
import { stage06ConsoleFixture } from "./stage06ConsoleFixture.ts";

export const stage07ConsoleFixture: Stage05ConsoleFixture = {
  ...stage06ConsoleFixture,
  source: {
    ...stage06ConsoleFixture.source,
    snapshot: "Stage 07 replay/anomaly fixture",
  },
  description:
    "Incident replay window with timeline markers and an explainable anomaly overlay for avionics overheat review.",
  replay: {
    schema: "telemforge.replay_window.v1",
    sessionId: "tf-session-stage07-review",
    spacecraftId: "tf-sat-01",
    window: {
      startAt: "2026-04-30T19:14:50Z",
      endAt: "2026-04-30T19:15:10Z",
      sampleLimit: 100,
    },
    markers: [
      {
        markerId: "marker-fault-fault-stage06-thermal-avionics",
        kind: "fault",
        markerType: "fault.active",
        timestamp: "2026-04-30T19:15:00Z",
        label: "thermal_avionics_overheat",
        message:
          "Manual heater runaway drill drove avionics bay temperature above the warning high limit.",
        severity: "critical",
        relatedFaultId: "fault-stage06-thermal-avionics",
        channelId: "thermal.avionics_temp",
      },
      {
        markerId: "marker-event-event-stage06-00-fault-injected",
        kind: "event",
        markerType: "fault.injected",
        timestamp: "2026-04-30T19:15:00Z",
        label: "fault.injected",
        message: "Fault injected: manual avionics overheat fault.",
        severity: "info",
        relatedFaultId: "fault-stage06-thermal-avionics",
      },
      {
        markerId: "marker-event-event-stage06-01-telemetry-affected",
        kind: "event",
        markerType: "telemetry.affected",
        timestamp: "2026-04-30T19:15:01Z",
        label: "telemetry.affected",
        message: "Telemetry affected: thermal.avionics_temp forced to 61.8 degC.",
        severity: "info",
        relatedFaultId: "fault-stage06-thermal-avionics",
        channelId: "thermal.avionics_temp",
      },
      {
        markerId: "marker-event-event-stage06-02-alert-raised",
        kind: "event",
        markerType: "alert.raised",
        timestamp: "2026-04-30T19:15:02Z",
        label: "alert.raised",
        message: "Alert raised for thermal.avionics_temp: critical.",
        severity: "critical",
        relatedFaultId: "fault-stage06-thermal-avionics",
        channelId: "thermal.avionics_temp",
        alertId: "alert-stage06-thermal-avionics",
      },
      {
        markerId: "marker-alert-alert-stage06-thermal-avionics",
        kind: "alert",
        markerType: "alert.active",
        timestamp: "2026-04-30T19:15:02Z",
        label: "critical alert",
        message:
          "Avionics Bay Temperature is 61.8 degC, above warning high limit 55.0 degC after manual avionics overheat fault.",
        severity: "critical",
        relatedFaultId: "fault-stage06-thermal-avionics",
        channelId: "thermal.avionics_temp",
        alertId: "alert-stage06-thermal-avionics",
      },
    ],
    anomalies: [
      {
        anomalyId: "anomaly-20260430t191500z-thermal-avionics-temp",
        timestamp: "2026-04-30T19:15:00Z",
        channelId: "thermal.avionics_temp",
        channelName: "Avionics Bay Temperature",
        subsystem: "thermal",
        severity: "critical",
        score: 1,
        observedValue: 61.8,
        unit: "degC",
        reason:
          "Avionics Bay Temperature observed 61.8 degC, outside nominal range 18.0 to 42.0 degC and above warning high limit 55.0 degC.",
      },
    ],
    summary: {
      sampleCount: 31,
      markerCount: 5,
      anomalyCount: 1,
      affectedChannelIds: ["thermal.avionics_temp"],
    },
  },
};
