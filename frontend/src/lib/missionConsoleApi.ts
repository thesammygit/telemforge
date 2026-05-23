import type { LiveTelemetryConfig } from "./liveTelemetryStream.ts";

export async function acknowledgeAlertOnServer(
  config: LiveTelemetryConfig,
  alertId: string,
  acknowledgedAt: string,
  acknowledgedBy: string,
  operatorNote: string,
): Promise<void> {
  const response = await fetch(
    `${config.apiBaseUrl}/sessions/${encodeURIComponent(config.sessionId)}/alerts/${encodeURIComponent(alertId)}/acknowledge`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acknowledged_at: acknowledgedAt,
        acknowledged_by: acknowledgedBy,
        operator_note: operatorNote,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to acknowledge alert: ${response.status}`);
  }
}

export async function resolveAlertOnServer(
  config: LiveTelemetryConfig,
  alertId: string,
  resolvedAt: string,
  resolvedBy: string,
  resolutionNote: string,
): Promise<void> {
  const response = await fetch(
    `${config.apiBaseUrl}/sessions/${encodeURIComponent(config.sessionId)}/alerts/${encodeURIComponent(alertId)}/resolve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resolved_at: resolvedAt,
        resolved_by: resolvedBy,
        resolution_note: resolutionNote,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to resolve alert: ${response.status}`);
  }
}
