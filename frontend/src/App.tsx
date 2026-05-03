import { useMemo, useState } from "react";

import { MissionConsole } from "./features/mission-console/MissionConsole.tsx";
import { buildMissionConsoleView } from "./features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "./lib/stage07ConsoleFixture.ts";

export default function App() {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState("thermal");
  const consoleView = useMemo(
    () => buildMissionConsoleView(stage07ConsoleFixture, selectedSubsystemId),
    [selectedSubsystemId],
  );

  return (
    <MissionConsole
      view={consoleView}
      onSelectSubsystem={setSelectedSubsystemId}
    />
  );
}
