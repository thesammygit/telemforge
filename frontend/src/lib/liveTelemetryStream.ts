export interface LiveTelemetryConfig {
  apiBaseUrl: string;
  sessionId: string;
}

export interface LiveTelemetryHandlers {
  onClose?: () => void;
  onError?: () => void;
  onMessage: (message: unknown) => void;
  onOpen?: () => void;
}

interface BrowserWebSocket {
  onclose: (() => void) | null;
  onerror: (() => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onopen: (() => void) | null;
  close: () => void;
}

type WebSocketFactory = new (url: string) => BrowserWebSocket;

const localHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function readLiveTelemetryConfig(
  env: Record<string, string | undefined>,
): LiveTelemetryConfig | null {
  const rawApiBaseUrl = env.VITE_TELEMFORGE_API_BASE_URL?.trim();
  const sessionId = env.VITE_TELEMFORGE_LIVE_SESSION_ID?.trim();
  if (!rawApiBaseUrl || !sessionId) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(rawApiBaseUrl);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return null;
  }
  if (!localHostnames.has(parsed.hostname)) {
    return null;
  }

  return {
    apiBaseUrl: parsed.origin,
    sessionId,
  };
}

export function buildLiveTelemetryUrl(
  config: LiveTelemetryConfig,
  afterSequence?: number,
): string {
  const base = new URL(config.apiBaseUrl);
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  const sessionPath = encodeURIComponent(config.sessionId);
  const url = new URL(
    `/sessions/${sessionPath}/telemetry/live`,
    `${base.protocol}//${base.host}`,
  );

  if (typeof afterSequence === "number" && afterSequence >= 0) {
    url.searchParams.set("after_sequence", String(Math.floor(afterSequence)));
  }

  return url.toString();
}

export function openLiveTelemetryStream(
  config: LiveTelemetryConfig,
  handlers: LiveTelemetryHandlers,
  WebSocketCtor: WebSocketFactory = globalThis.WebSocket as WebSocketFactory,
): { close: () => void } {
  const websocket = new WebSocketCtor(buildLiveTelemetryUrl(config));

  websocket.onopen = () => handlers.onOpen?.();
  websocket.onclose = () => handlers.onClose?.();
  websocket.onerror = () => handlers.onError?.();
  websocket.onmessage = (event) => {
    try {
      handlers.onMessage(JSON.parse(event.data));
    } catch {
      handlers.onError?.();
    }
  };

  return {
    close: () => websocket.close(),
  };
}
