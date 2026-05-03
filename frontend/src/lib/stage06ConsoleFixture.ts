import type { Stage05ConsoleFixture } from "../features/mission-console/types.ts";
import { stage05ConsoleFixture } from "./stage05ConsoleFixture.ts";

export const stage06ConsoleFixture: Stage05ConsoleFixture = {
  ...stage05ConsoleFixture,
  source: {
    ...stage05ConsoleFixture.source,
    snapshot: "Stage 06 manual fault overlay",
  },
  description:
    "Manual avionics overheat incident showing deterministic telemetry impact, threshold alerting, and the causal event chain.",
  alerts: [
    {
      alertId: "alert-stage06-thermal-avionics",
      channelId: "thermal.avionics_temp",
      severity: "critical",
      state: "active",
      message:
        "Avionics Bay Temperature is 61.8 degC, above warning high limit 55.0 degC after manual avionics overheat fault.",
      recommendedAction:
        "Reduce payload duty cycle and watch thermal recovery before clearing the fault.",
      observedValue: 61.8,
      threshold: {
        operator: ">",
        value: 55,
        unit: "degC",
      },
      relatedFaultId: "fault-stage06-thermal-avionics",
    },
    ...stage05ConsoleFixture.alerts.filter(
      (alert) => alert.channelId !== "thermal.avionics_temp",
    ),
  ],
  faults: [
    {
      faultId: "fault-stage06-thermal-avionics",
      faultType: "thermal_avionics_overheat",
      subsystem: "thermal",
      status: "active",
      requestedAt: "2026-04-30T19:15:00Z",
      targetChannelIds: ["thermal.avionics_temp"],
      summary:
        "Operator injected a manual avionics overheat fault that forced avionics bay temperature above the warning high limit.",
    },
  ],
  events: [
    {
      eventId: "event-stage06-00-fault-injected",
      eventType: "fault.injected",
      timestamp: "2026-04-30T19:15:00Z",
      message: "Fault injected: manual avionics overheat fault.",
      relatedFaultId: "fault-stage06-thermal-avionics",
    },
    {
      eventId: "event-stage06-01-telemetry-affected",
      eventType: "telemetry.affected",
      timestamp: "2026-04-30T19:15:01Z",
      message: "Telemetry affected: thermal.avionics_temp forced to 61.8 degC.",
      relatedFaultId: "fault-stage06-thermal-avionics",
      channelId: "thermal.avionics_temp",
    },
    {
      eventId: "event-stage06-02-alert-raised",
      eventType: "alert.raised",
      timestamp: "2026-04-30T19:15:02Z",
      message: "Alert raised for thermal.avionics_temp: critical.",
      relatedFaultId: "fault-stage06-thermal-avionics",
      channelId: "thermal.avionics_temp",
      severity: "critical",
    },
  ],
};
