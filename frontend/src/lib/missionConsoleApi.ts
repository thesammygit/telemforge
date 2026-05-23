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
