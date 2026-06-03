import type {
  IncidentReviewExportPayload,
  IncidentReviewPacketView,
  ReplayPlaybackFrameView,
  ReplayPlaybackView,
  ReviewActionQueueActionView,
  ReviewActionQueueView,
  ReviewActionWalkthroughCoverageView,
  ReviewActionWalkthroughEvidencePathRowView,
  ReviewActionWalkthroughExportReferenceView,
  ReviewActionWalkthroughPacketReferenceView,
  ReviewActionWalkthroughRunbookTargetView,
  ReviewActionWalkthroughView,
  ReviewBriefingBoardEvidenceRowView,
  ReviewBriefingBoardView,
  ScenarioRunbookPlaybackView,
} from "../features/mission-console/types.ts";

const sourcePathByKind: Record<string, string> = {
  action_queue: "frontend/src/lib/reviewActionQueue.ts",
  briefing_board: "frontend/src/lib/reviewBriefingBoard.ts",
  incident_packet: "frontend/src/lib/incidentReviewPackets.ts",
  playback_frame: "frontend/src/features/mission-console/consoleViewModel.ts",
  runbook: "frontend/src/lib/scenarioRunbooks.ts",
};

export function buildReviewActionWalkthrough(
  reviewActionQueue: ReviewActionQueueView | undefined,
  reviewBriefingBoard: ReviewBriefingBoardView | undefined,
  replayPlayback: ReplayPlaybackView | undefined,
  runbook: ScenarioRunbookPlaybackView | undefined,
  incidentReviewPacket: IncidentReviewPacketView | undefined,
  incidentReviewExport: IncidentReviewExportPayload | undefined,
  selectedActionId?: string,
): ReviewActionWalkthroughView | undefined {
  if (!reviewActionQueue || !reviewBriefingBoard) {
    return undefined;
  }

  const chosenActionId = selectActionId(
    reviewActionQueue.actions,
    selectedActionId,
  );
  const selectedAction = reviewActionQueue.actions.find(
    (action) => action.actionId === chosenActionId,
  );

  if (!selectedAction) {
    return undefined;
  }

  const evidencePathRows = selectedAction.evidenceTargets.map((target) =>
    buildEvidencePathRow(
      target,
      reviewBriefingBoard,
      replayPlayback,
      runbook,
      incidentReviewPacket,
      incidentReviewExport,
    ),
  );
  const missingTargetRecords = evidencePathRows
    .filter((row) => row.status === "missing")
    .map((row) => ({
      target: row.target,
      label: row.label,
      reason:
        `No local briefing rows, replay frames, runbook targets, or packet/export references resolved for ${row.label}.`,
      expectedHints: buildExpectedHints(row.target),
    }));
  const coverage = buildCoverage(evidencePathRows);

  return {
    schema: "telemforge.review_action_walkthrough.v1",
    version: 1,
    contractLabel: "local deterministic action evidence walkthrough",
    localStatus: reviewActionQueue.localStatus,
    actions: reviewActionQueue.actions,
    selectedActionId: selectedAction.actionId,
    selectedAction,
    coverage,
    evidencePathRows,
    missingTargetRecords,
    nextLocalStep: selectedAction.nextLocalStep,
    deferredProductionBoundaryNotes: unique([
      ...reviewActionQueue.deferredScopeNotes,
      ...reviewBriefingBoard.localOnlyScopeNotes.filter((note) =>
        isDeferredBoundaryNote(note),
      ),
    ]),
  };
}

function buildEvidencePathRow(
  target: string,
  reviewBriefingBoard: ReviewBriefingBoardView,
  replayPlayback: ReplayPlaybackView | undefined,
  runbook: ScenarioRunbookPlaybackView | undefined,
  incidentReviewPacket: IncidentReviewPacketView | undefined,
  incidentReviewExport: IncidentReviewExportPayload | undefined,
): ReviewActionWalkthroughEvidencePathRowView {
  const evidenceRows = reviewBriefingBoard.evidenceDrilldownRows.filter(
    (row) => row.target === target,
  );
  const replayFrames = buildReplayFrames(
    target,
    evidenceRows,
    replayPlayback,
    incidentReviewPacket,
    incidentReviewExport,
  );
  const runbookTargets = buildRunbookTargets(target, replayFrames, runbook);
  const packetReferences = buildPacketReferences(
    replayFrames,
    incidentReviewPacket,
  );
  const exportReferences = buildExportReferences(
    replayFrames,
    incidentReviewExport,
  );
  const sourcePaths = unique([
    ...evidenceRows
      .map((row) => row.path)
      .filter((path): path is string => Boolean(path)),
    ...sourcePathsForEvidenceRows(evidenceRows),
    ...sourcePathsForTarget(target, runbookTargets, packetReferences, exportReferences, replayFrames.length > 0),
  ]);

  return {
    rowId: `walkthrough:${target}`,
    target,
    label: targetLabel(target),
    status:
      evidenceRows.length ||
      runbookTargets.length ||
      replayFrames.length ||
      packetReferences.length ||
      exportReferences.length
        ? "available"
        : "missing",
    evidenceRows,
    replayFrameIds: unique(replayFrames.map((frame) => frame.frameId)),
    runbookTargets,
    packetReferences,
    exportReferences,
    sourcePaths,
  };
}

function buildReplayFrames(
  target: string,
  evidenceRows: ReviewBriefingBoardEvidenceRowView[],
  replayPlayback: ReplayPlaybackView | undefined,
  incidentReviewPacket: IncidentReviewPacketView | undefined,
  incidentReviewExport: IncidentReviewExportPayload | undefined,
): ReplayPlaybackFrameView[] {
  if (!replayPlayback) {
    return [];
  }

  const frameById = new Map(
    replayPlayback.frames.map((frame) => [frame.frameId, frame]),
  );
  const frames = new Map<string, ReplayPlaybackFrameView>();

  for (const row of evidenceRows) {
    if (row.frameId) {
      const frame = frameById.get(row.frameId);
      if (frame) {
        frames.set(frame.frameId, frame);
      }
    }
  }

  for (const frame of replayPlayback.frames) {
    if (frame.runbookTarget?.evidenceTarget === target) {
      frames.set(frame.frameId, frame);
    }
  }

  if (target === "incident-review-packet") {
    if (incidentReviewPacket) {
      for (const frame of replayPlayback.frames) {
        if (frame.packetReference?.packetId === incidentReviewPacket.packetId) {
          frames.set(frame.frameId, frame);
        }
      }
    }
    if (incidentReviewExport) {
      for (const frame of replayPlayback.frames) {
        if (frame.exportReference?.exportId === incidentReviewExport.exportId) {
          frames.set(frame.frameId, frame);
        }
      }
    }
  }

  return Array.from(frames.values());
}

function buildRunbookTargets(
  target: string,
  replayFrames: ReplayPlaybackFrameView[],
  runbook: ScenarioRunbookPlaybackView | undefined,
): ReviewActionWalkthroughRunbookTargetView[] {
  if (!runbook) {
    return replayFrameRunbookTargets(replayFrames);
  }

  const stepById = new Map(runbook.steps.map((step) => [step.stepId, step]));
  const targets = new Map<string, ReviewActionWalkthroughRunbookTargetView>();

  for (const link of runbook.evidenceLinks) {
    if (link.target !== target) {
      continue;
    }
    const step = stepById.get(link.stepId);
    if (!step) {
      continue;
    }
    targets.set(step.stepId, {
      stepId: step.stepId,
      title: step.title,
      evidenceTarget: step.evidenceTarget,
      stepStatus: step.status,
    });
  }

  for (const frame of replayFrames) {
    const frameTarget = frame.runbookTarget;
    if (!frameTarget) {
      continue;
    }
    targets.set(frameTarget.stepId, {
      stepId: frameTarget.stepId,
      title: frameTarget.title,
      evidenceTarget: frameTarget.evidenceTarget,
      stepStatus: frameTarget.stepStatus,
    });
  }

  return Array.from(targets.values());
}

function replayFrameRunbookTargets(
  replayFrames: ReplayPlaybackFrameView[],
): ReviewActionWalkthroughRunbookTargetView[] {
  const targets = new Map<string, ReviewActionWalkthroughRunbookTargetView>();

  for (const frame of replayFrames) {
    const frameTarget = frame.runbookTarget;
    if (!frameTarget) {
      continue;
    }
    targets.set(frameTarget.stepId, {
      stepId: frameTarget.stepId,
      title: frameTarget.title,
      evidenceTarget: frameTarget.evidenceTarget,
      stepStatus: frameTarget.stepStatus,
    });
  }

  return Array.from(targets.values());
}

function buildPacketReferences(
  replayFrames: ReplayPlaybackFrameView[],
  incidentReviewPacket: IncidentReviewPacketView | undefined,
): ReviewActionWalkthroughPacketReferenceView[] {
  if (!incidentReviewPacket) {
    return [];
  }

  const references = new Map<string, ReviewActionWalkthroughPacketReferenceView>();

  for (const frame of replayFrames) {
    const packetReference = frame.packetReference;
    if (!packetReference) {
      continue;
    }
    references.set(packetReference.packetId, {
      packetId: packetReference.packetId,
      readinessStatus: packetReference.readinessStatus,
      relatedMarkerCount: packetReference.relatedMarkerCount,
    });
  }

  return Array.from(references.values());
}

function buildExportReferences(
  replayFrames: ReplayPlaybackFrameView[],
  incidentReviewExport: IncidentReviewExportPayload | undefined,
): ReviewActionWalkthroughExportReferenceView[] {
  if (!incidentReviewExport) {
    return [];
  }

  const references = new Map<string, ReviewActionWalkthroughExportReferenceView>();

  for (const frame of replayFrames) {
    const exportReference = frame.exportReference;
    if (!exportReference) {
      continue;
    }
    references.set(exportReference.exportId, {
      exportId: exportReference.exportId,
      schema: exportReference.schema,
    });
  }

  return Array.from(references.values());
}

function buildCoverage(
  evidencePathRows: ReviewActionWalkthroughEvidencePathRowView[],
): ReviewActionWalkthroughCoverageView {
  const replayFrameIds = unique(
    evidencePathRows.flatMap((row) => row.replayFrameIds),
  );
  const runbookTargetIds = unique(
    evidencePathRows.flatMap((row) => row.runbookTargets.map((target) => target.stepId)),
  );
  const packetReferenceIds = unique(
    evidencePathRows.flatMap((row) => row.packetReferences.map((ref) => ref.packetId)),
  );
  const exportReferenceIds = unique(
    evidencePathRows.flatMap((row) => row.exportReferences.map((ref) => ref.exportId)),
  );
  const sourcePaths = unique(
    evidencePathRows.flatMap((row) => row.sourcePaths),
  );

  return {
    totalTargetCount: evidencePathRows.length,
    resolvedTargetCount: evidencePathRows.filter((row) => row.status === "available").length,
    missingTargetCount: evidencePathRows.filter((row) => row.status === "missing").length,
    evidenceRowCount: evidencePathRows.reduce(
      (count, row) => count + row.evidenceRows.length,
      0,
    ),
    replayFrameCount: replayFrameIds.length,
    runbookTargetCount: runbookTargetIds.length,
    packetReferenceCount: packetReferenceIds.length,
    exportReferenceCount: exportReferenceIds.length,
    sourcePathCount: sourcePaths.length,
  };
}

function sourcePathsForEvidenceRows(
  evidenceRows: ReviewBriefingBoardEvidenceRowView[],
): string[] {
  if (!evidenceRows.length) {
    return [];
  }

  return [
    sourcePathByKind.briefing_board,
    ...evidenceRows.flatMap((row) => {
      const paths: string[] = [];
      if (row.source === "runbook") {
        paths.push(sourcePathByKind.runbook);
      }
      if (row.source === "incident_packet" || row.source === "evidence_export") {
        paths.push(sourcePathByKind.incident_packet);
      }
      if (row.source === "playback_frame") {
        paths.push(sourcePathByKind.playback_frame);
      }
      if (row.source === "scope_boundary") {
        paths.push(sourcePathByKind.action_queue);
      }
      return paths;
    }),
  ];
}

function sourcePathsForTarget(
  target: string,
  runbookTargets: ReviewActionWalkthroughRunbookTargetView[],
  packetReferences: ReviewActionWalkthroughPacketReferenceView[],
  exportReferences: ReviewActionWalkthroughExportReferenceView[],
  hasReplayFrames: boolean,
): string[] {
  const paths = [sourcePathByKind.action_queue];
  if (runbookTargets.length) {
    paths.push(sourcePathByKind.runbook);
  }
  if (packetReferences.length || exportReferences.length) {
    paths.push(sourcePathByKind.incident_packet);
  }
  if (hasReplayFrames) {
    paths.push(sourcePathByKind.playback_frame);
  }
  if (target === "review-decision-register") {
    paths.push("docs/development/steps/14-review-decision-register-and-handoff-checklist.md");
  }
  return paths;
}

function selectActionId(
  actions: ReviewActionQueueActionView[],
  selectedActionId: string | undefined,
): string | undefined {
  if (selectedActionId && actions.some((action) => action.actionId === selectedActionId)) {
    return selectedActionId;
  }

  return actions.find((action) => action.blocking)?.actionId ?? actions[0]?.actionId;
}

function targetLabel(target: string): string {
  const labels: Record<string, string> = {
    "alert-lifecycle": "Alert lifecycle",
    "incident-review-packet": "Incident review packet",
    "replay-anomaly-inspection": "Replay anomaly inspection",
    "replay-playback-timeline": "Replay playback timeline",
    "review-decision-register": "Review decision register",
  };

  return labels[target] ?? target.replace(/-/g, " ");
}

function buildExpectedHints(target: string): string[] {
  if (target === "review-decision-register") {
    return [
      "briefing-board evidence row",
      "review decision register scope boundary",
      "replay frame ids",
      "packet/export references",
    ];
  }

  return [
    "briefing-board evidence rows",
    "replay frame ids",
    "runbook targets",
    "packet/export references",
  ];
}

function isDeferredBoundaryNote(note: string): boolean {
  const lower = note.toLowerCase();
  return (
    lower.includes("production") ||
    lower.includes("saved") ||
    lower.includes("ticket") ||
    lower.includes("cloud") ||
    lower.includes("handoff") ||
    lower.includes("identity") ||
    lower.includes("report")
  );
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
