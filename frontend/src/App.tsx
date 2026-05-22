import { useEffect, useMemo, useState } from "react";

import { MissionConsole } from "./features/mission-console/MissionConsole.tsx";
import { buildMissionConsoleView } from "./features/mission-console/consoleViewModel.ts";
import { readLiveTelemetryConfig, openLiveTelemetryStream } from "./lib/liveTelemetryStream.ts";
import { stage07ConsoleFixture } from "./lib/stage07ConsoleFixture.ts";
import {
  applyStage09LiveConsoleMessage,
  createStage09LiveConsoleState,
  setStage09LiveConsoleConnection,
} from "./lib/stage09LiveConsoleAdapter.ts";

export default function App() {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState("thermal");
  const [liveConsole, setLiveConsole] = useState(() =>
    createStage09LiveConsoleState(stage07ConsoleFixture),
  );
  const liveConfig = useMemo(
    () => readLiveTelemetryConfig(import.meta.env),
    [],
  );

  useEffect(() => {
    if (!liveConfig) {
      setLiveConsole(createStage09LiveConsoleState(stage07ConsoleFixture));
      return;
    }

    let closedByCleanup = false;
    setLiveConsole((state) =>
      setStage09LiveConsoleConnection(state, "connecting"),
    );

    let stream: { close: () => void } | null = null;
    try {
      stream = openLiveTelemetryStream(liveConfig, {
        onClose: () => {
          if (!closedByCleanup) {
            setLiveConsole(
              setStage09LiveConsoleConnection(
                createStage09LiveConsoleState(stage07ConsoleFixture),
                "closed",
              ),
            );
          }
        },
        onError: () =>
          setLiveConsole(
            setStage09LiveConsoleConnection(
              createStage09LiveConsoleState(stage07ConsoleFixture),
              "degraded",
              "Local websocket error; fixture fallback remains available",
            ),
          ),
        onMessage: (message) =>
          setLiveConsole((state) =>
            applyStage09LiveConsoleMessage(state, message),
          ),
      });
    } catch {
      setLiveConsole(
        setStage09LiveConsoleConnection(
          createStage09LiveConsoleState(stage07ConsoleFixture),
          "closed",
          "Local websocket unavailable; fixture fallback remains active",
        ),
      );
    }

    return () => {
      closedByCleanup = true;
      stream?.close();
    };
  }, [liveConfig]);

  const consoleView = useMemo(
    () =>
      buildMissionConsoleView(
        liveConsole.fixture,
        selectedSubsystemId,
        liveConsole.connection,
      ),
    [liveConsole, selectedSubsystemId],
  );

  return (
    <MissionConsole
      view={consoleView}
      onSelectSubsystem={setSelectedSubsystemId}
    />
  );
}
