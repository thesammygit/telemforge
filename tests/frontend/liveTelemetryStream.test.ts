import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLiveTelemetryUrl,
  openLiveTelemetryStream,
  readLiveTelemetryConfig,
} from "../../frontend/src/lib/liveTelemetryStream.ts";

test("readLiveTelemetryConfig falls back to fixtures without explicit local config", () => {
  assert.equal(readLiveTelemetryConfig({}), null);
  assert.equal(
    readLiveTelemetryConfig({
      VITE_TELEMFORGE_API_BASE_URL: "https://api.example.com",
      VITE_TELEMFORGE_LIVE_SESSION_ID: "session-stage09",
    }),
    null,
  );
  assert.deepEqual(
    readLiveTelemetryConfig({
      VITE_TELEMFORGE_API_BASE_URL: "http://127.0.0.1:8000",
      VITE_TELEMFORGE_LIVE_SESSION_ID: "session-stage09",
    }),
    {
      apiBaseUrl: "http://127.0.0.1:8000",
      sessionId: "session-stage09",
    },
  );
});

test("buildLiveTelemetryUrl targets the Stage 09 backend websocket path", () => {
  const url = buildLiveTelemetryUrl({
    apiBaseUrl: "http://localhost:8000",
    sessionId: "session with/slash",
  });

  assert.equal(
    url,
    "ws://localhost:8000/sessions/session%20with%2Fslash/telemetry/live",
  );
  assert.equal(
    buildLiveTelemetryUrl(
      {
        apiBaseUrl: "https://127.0.0.1:8443",
        sessionId: "session-stage09",
      },
      7,
    ),
    "wss://127.0.0.1:8443/sessions/session-stage09/telemetry/live?after_sequence=7",
  );
});

test("openLiveTelemetryStream parses websocket messages and reports lifecycle", () => {
  const messages: unknown[] = [];
  const lifecycle: string[] = [];

  class FakeWebSocket {
    static instance: FakeWebSocket | null = null;

    onclose: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onmessage: ((event: { data: string }) => void) | null = null;
    onopen: (() => void) | null = null;
    url: string;

    constructor(url: string) {
      this.url = url;
      FakeWebSocket.instance = this;
    }

    close() {
      this.onclose?.();
    }
  }

  const stream = openLiveTelemetryStream(
    {
      apiBaseUrl: "http://127.0.0.1:8000",
      sessionId: "session-stage09",
    },
    {
      onClose: () => lifecycle.push("closed"),
      onError: () => lifecycle.push("error"),
      onMessage: (message) => messages.push(message),
      onOpen: () => lifecycle.push("open"),
    },
    FakeWebSocket,
  );

  assert.equal(
    FakeWebSocket.instance?.url,
    "ws://127.0.0.1:8000/sessions/session-stage09/telemetry/live",
  );

  FakeWebSocket.instance?.onopen?.();
  FakeWebSocket.instance?.onmessage?.({
    data: JSON.stringify({
      type: "stream.snapshot",
      session_id: "session-stage09",
      sequence: 1,
      emitted_at: "2026-05-22T04:00:00Z",
      payload: { latest_points: [], active_alerts: [] },
    }),
  });
  stream.close();

  assert.deepEqual(lifecycle, ["open", "closed"]);
  assert.deepEqual(messages, [
    {
      type: "stream.snapshot",
      session_id: "session-stage09",
      sequence: 1,
      emitted_at: "2026-05-22T04:00:00Z",
      payload: { latest_points: [], active_alerts: [] },
    },
  ]);
});
