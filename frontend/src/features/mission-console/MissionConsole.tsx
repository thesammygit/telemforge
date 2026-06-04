import { TrendSparkline } from "./TrendSparkline.tsx";
import type { MissionConsoleView, TelemetryStatus } from "./types.ts";

interface MissionConsoleProps {
  view: MissionConsoleView;
  onSelectSubsystem: (subsystemId: string) => void;
  onSelectRunbook: (runbookId: string) => void;
  onSelectReplayFrame: (frameId: string) => void;
  onSelectReviewAction: (actionId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

const statusOrder: TelemetryStatus[] = [
  "critical",
  "warning",
  "nominal",
  "offline",
];

export function MissionConsole({
  view,
  onSelectSubsystem,
  onSelectRunbook,
  onSelectReplayFrame,
  onSelectReviewAction,
  onAcknowledgeAlert,
  onResolveAlert,
}: MissionConsoleProps) {
  const activeAlerts = view.alerts.filter((alert) => alert.state === "active");
  const acknowledgedAlerts = view.alerts.filter(
    (alert) => alert.state === "acknowledged",
  );
  const resolvedAlerts = view.alerts.filter((alert) => alert.state === "resolved");
  const playback = view.replayPlayback;
  const currentPlaybackFrame = playback?.currentFrame;

  return (
    <main className="console-shell">
      <header className="console-header">
        <div>
          <p className="console-kicker">
            {view.stream.state === "fixture"
              ? "TelemForge Stage 07"
              : "TelemForge Stage 09"}
          </p>
          <h1>Replay And Anomaly Layer</h1>
          <p>{view.mission.description}</p>
        </div>
        <div className="header-state-stack">
          <div className={`mission-state status-${view.mission.healthState}`}>
            <span>{view.mission.healthState}</span>
            <strong>{view.mission.spacecraftId}</strong>
          </div>
          <div className={`stream-state stream-${view.stream.state}`}>
            <span>{view.stream.state}</span>
            <strong>{view.stream.label}</strong>
            <small>{view.stream.detail}</small>
          </div>
        </div>
      </header>

      <section className="overview-band" aria-label="Mission overview">
        <div>
          <span className="metric-label">Scenario</span>
          <strong>{view.mission.scenario}</strong>
        </div>
        <div>
          <span className="metric-label">Captured</span>
          <strong>{view.mission.capturedAt}</strong>
        </div>
        <div>
          <span className="metric-label">Active alerts</span>
          <strong>{view.mission.activeAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Acknowledged alerts</span>
          <strong>{view.mission.acknowledgedAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Resolved alerts</span>
          <strong>{view.mission.resolvedAlertCount}</strong>
        </div>
        <div>
          <span className="metric-label">Active faults</span>
          <strong>{view.mission.activeFaultCount}</strong>
        </div>
        <div>
          <span className="metric-label">Telemetry source</span>
          <strong>{view.mission.sourceLabel}</strong>
        </div>
      </section>

      <section className="status-counts" aria-label="Telemetry status counts">
        {statusOrder.map((status) => (
          <div key={status} className="status-count">
            <span className={`status-dot status-${status}`} />
            <span>{status}</span>
            <strong>{view.mission.statusCounts[status]}</strong>
          </div>
        ))}
      </section>

      {view.runbook ? (
        <section className="runbook-section" aria-label="Guided scenario runbook">
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 11 guided playback</span>
              <h2>{view.runbook.title}</h2>
            </div>
            <span className="event-time">{view.runbook.mode}</span>
          </div>
          <div className="runbook-layout">
            <div className="runbook-selector" aria-label="Scenario runbooks">
              {view.runbook.availableRunbooks.map((runbook) => (
                <button
                  key={runbook.runbookId}
                  className={
                    runbook.runbookId === view.runbook.selectedRunbookId
                      ? "runbook-choice selected"
                      : "runbook-choice"
                  }
                  type="button"
                  onClick={() => onSelectRunbook(runbook.runbookId)}
                >
                  <span>{runbook.mode}</span>
                  <strong>{runbook.title}</strong>
                </button>
              ))}
            </div>
            <div className="runbook-progress">
              <div className="runbook-next-action">
                <span className="metric-label">Next action</span>
                <strong>{view.runbook.nextAction?.label ?? "No action available"}</strong>
              </div>
              <div className="runbook-step-list">
                {view.runbook.steps.map((step, index) => (
                  <article
                    key={step.stepId}
                    className={`runbook-step runbook-step-${step.status}`}
                  >
                    <span className="runbook-step-index">{index + 1}</span>
                    <div>
                      <span className="event-type">{step.status}</span>
                      <h3>{step.title}</h3>
                      <p>{step.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="runbook-evidence">
                {view.runbook.evidenceLinks.map((link) => (
                  <a
                    key={link.target}
                    className={`runbook-evidence-link evidence-${link.state}`}
                    href={`#${link.target}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {view.incidentReviewPacket ? (
        <section
          className="incident-packet-section"
          aria-label="Incident review packet"
        >
          <a id="incident-review-packet" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 12 incident packet</span>
              <h2>{view.incidentReviewPacket.title}</h2>
            </div>
            <span
              className={`status-chip packet-status-${view.incidentReviewPacket.readiness.status}`}
            >
              {view.incidentReviewPacket.readiness.status.replace("_", " ")}
            </span>
          </div>
          <div className="packet-summary-grid">
            <div>
              <span className="metric-label">Runbook steps</span>
              <strong>
                {view.incidentReviewPacket.readiness.completedStepCount}/
                {view.incidentReviewPacket.readiness.totalStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Alert state</span>
              <strong>{view.incidentReviewPacket.alertLifecycle.state}</strong>
            </div>
            <div>
              <span className="metric-label">Related events</span>
              <strong>{view.incidentReviewPacket.eventHistory.relatedEventCount}</strong>
            </div>
            <div>
              <span className="metric-label">Replay markers</span>
              <strong>
                {view.incidentReviewPacket.replayEvidence.relatedMarkerCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Evidence gaps</span>
              <strong>
                {view.incidentReviewPacket.readiness.unresolvedGapCount}
              </strong>
            </div>
          </div>
          <div className="packet-detail-grid">
            <div className="packet-panel">
              <span className="metric-label">Operator actions</span>
              {view.incidentReviewPacket.operatorActions.map((action) => (
                <article key={action.actionKind} className="packet-action-row">
                  <span className={`status-dot packet-action-${action.status}`} />
                  <div>
                    <strong>{action.actionKind.replace("_", " ")}</strong>
                    <p>
                      {action.status === "complete"
                        ? `${action.actor ?? "operator"} at ${action.timestamp}`
                        : "Pending local operator action"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="packet-panel">
              <span className="metric-label">Replay evidence</span>
              <p className="packet-marker-types">
                {view.incidentReviewPacket.replayEvidence.markerTypes.join(", ") ||
                  "No related markers"}
              </p>
              <p className="packet-meta-line">
                {view.incidentReviewPacket.replayEvidence.sampleCount} samples,{" "}
                {view.incidentReviewPacket.replayEvidence.anomalyCount} anomalies
              </p>
            </div>
            <div className="packet-panel">
              <span className="metric-label">Unresolved gaps</span>
              {view.incidentReviewPacket.evidenceGaps.length ? (
                <ul className="packet-gap-list">
                  {view.incidentReviewPacket.evidenceGaps.map((gap) => (
                    <li key={gap.gapId}>{gap.summary}</li>
                  ))}
                </ul>
              ) : (
                <p className="packet-meta-line">No unresolved evidence gaps.</p>
              )}
            </div>
          </div>
          {view.incidentReviewExport ? (
            <div className="packet-export-panel">
              <div>
                <span className="metric-label">Local evidence export</span>
                <strong>{view.incidentReviewExport.exportId}</strong>
                <p className="packet-meta-line">
                  {view.incidentReviewExport.schema}
                </p>
              </div>
              <div className="packet-export-facts">
                <span>
                  {view.incidentReviewExport.operatorActions.completeCount} actions
                </span>
                <span>{view.incidentReviewExport.sourceRefs.length} sources</span>
                <span>
                  {view.incidentReviewExport.deferredFeatures.length} deferred
                </span>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {playback && currentPlaybackFrame ? (
        <section
          className="replay-playback-section"
          aria-label="Replay playback timeline"
        >
          <a id="replay-playback-timeline" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 13 playback</span>
              <h2>Local replay timeline</h2>
            </div>
            <span className={`status-chip playback-status-${playback.localStatus}`}>
              {playback.localStatus}
            </span>
          </div>
          <div className="playback-contract-row">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{playback.schema}</strong>
            </div>
            <div>
              <span className="metric-label">Selected timestamp</span>
              <strong>{playback.selectedTimestamp}</strong>
            </div>
            <div>
              <span className="metric-label">Frame</span>
              <strong>
                {playback.frameIndex}/{playback.totalFrameCount}
              </strong>
            </div>
          </div>
          <div className="playback-frame-strip" aria-label="Replay frames">
            {playback.frames.map((frame) => (
              <button
                key={frame.frameId}
                className={
                  frame.frameId === currentPlaybackFrame.frameId
                    ? "playback-frame-button selected"
                    : "playback-frame-button"
                }
                type="button"
                aria-pressed={frame.frameId === currentPlaybackFrame.frameId}
                onClick={() => onSelectReplayFrame(frame.frameId)}
              >
                <span>Frame {frame.frameIndex}</span>
                <strong>{frame.marker.markerType}</strong>
                <small>{frame.timestamp}</small>
              </button>
            ))}
          </div>
          <div className="playback-current-frame">
            <article className="playback-marker-panel">
              <div className="playback-marker-heading">
                <span
                  className={`status-dot status-${currentPlaybackFrame.marker.severity}`}
                />
                <div>
                  <span className="event-type">
                    {currentPlaybackFrame.marker.markerType}
                  </span>
                  <h3>{currentPlaybackFrame.marker.label}</h3>
                </div>
              </div>
              <p>{currentPlaybackFrame.marker.message}</p>
              {currentPlaybackFrame.marker.channelId ? (
                <strong>{currentPlaybackFrame.marker.channelId}</strong>
              ) : null}
            </article>
            <div className="playback-context-grid">
              <div className="playback-context-panel">
                <span className="metric-label">Related anomaly</span>
                {currentPlaybackFrame.anomalyContext ? (
                  <>
                    <strong>
                      {currentPlaybackFrame.anomalyContext.channelName}
                    </strong>
                    <p>
                      {currentPlaybackFrame.anomalyContext.observedValueLabel} /{" "}
                      {currentPlaybackFrame.anomalyContext.scoreLabel}
                    </p>
                    <p>{currentPlaybackFrame.anomalyContext.reason}</p>
                  </>
                ) : (
                  <p>No related anomaly context for this frame.</p>
                )}
              </div>
              <div className="playback-context-panel">
                <span className="metric-label">Runbook target</span>
                {currentPlaybackFrame.runbookTarget ? (
                  <>
                    <a href={`#${currentPlaybackFrame.runbookTarget.evidenceTarget}`}>
                      {currentPlaybackFrame.runbookTarget.title}
                    </a>
                    <p>
                      {currentPlaybackFrame.runbookTarget.stepStatus} /{" "}
                      {currentPlaybackFrame.runbookTarget.evidenceTarget}
                    </p>
                  </>
                ) : (
                  <p>No runbook target is available.</p>
                )}
              </div>
              <div className="playback-context-panel">
                <span className="metric-label">Packet/export reference</span>
                {currentPlaybackFrame.packetReference ? (
                  <>
                    <strong>
                      {currentPlaybackFrame.packetReference.readinessStatus.replace(
                        "_",
                        " ",
                      )}
                    </strong>
                    <p>{currentPlaybackFrame.packetReference.packetId}</p>
                    {currentPlaybackFrame.exportReference ? (
                      <p>{currentPlaybackFrame.exportReference.exportId}</p>
                    ) : null}
                  </>
                ) : (
                  <p>No packet reference is available.</p>
                )}
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {playback.scopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewDecisionRegister ? (
        <section
          className="review-decision-section"
          aria-label="Review decision register"
        >
          <a id="review-decision-register" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 14 review decisions</span>
              <h2>Decision register and handoff checklist</h2>
            </div>
            <span
              className={`status-chip playback-status-${view.reviewDecisionRegister.localStatus}`}
            >
              {view.reviewDecisionRegister.localStatus}
            </span>
          </div>
          <div className="decision-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewDecisionRegister.schema}</strong>
            </div>
            <div>
              <span className="metric-label">Ready</span>
              <strong>{view.reviewDecisionRegister.summary.readyCount}</strong>
            </div>
            <div>
              <span className="metric-label">Follow-up</span>
              <strong>{view.reviewDecisionRegister.summary.followUpCount}</strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>{view.reviewDecisionRegister.summary.deferredCount}</strong>
            </div>
          </div>
          <div className="decision-register-layout">
            <div className="decision-list">
              {view.reviewDecisionRegister.decisions.map((decision) => (
                <article
                  key={decision.decisionId}
                  className={`decision-row decision-${decision.status}`}
                >
                  <div className="decision-row-heading">
                    <span className={`status-chip decision-status-${decision.status}`}>
                      {decision.status.replace("_", " ")}
                    </span>
                    <div>
                      <span className="event-type">{decision.decisionId}</span>
                      <h3>{decision.label}</h3>
                    </div>
                  </div>
                  <p>{decision.summary}</p>
                  {decision.followUpReason ? (
                    <p className="decision-follow-up">{decision.followUpReason}</p>
                  ) : null}
                  <div className="decision-evidence-list">
                    {decision.supportingEvidence.map((evidence) => (
                      <a
                        key={`${decision.decisionId}:${evidence.label}`}
                        href={`#${evidence.target}`}
                      >
                        {evidence.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="handoff-checklist">
              <span className="metric-label">Handoff checklist</span>
              {view.reviewDecisionRegister.handoffChecklist.map((item) => (
                <a
                  key={item.itemId}
                  className={`handoff-item handoff-${item.status}`}
                  href={`#${item.evidenceTarget}`}
                >
                  <span className={`status-dot decision-status-${item.status}`} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewDecisionRegister.scopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewBriefingBoard ? (
        <section
          className="review-briefing-section"
          aria-label="Review briefing board"
        >
          <a id="review-briefing-board" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 15 briefing board</span>
              <h2>Review briefing board and evidence drilldown</h2>
            </div>
            <span
              className={`status-chip briefing-status-${view.reviewBriefingBoard.readinessStatus}`}
            >
              {view.reviewBriefingBoard.readinessStatus.replace(/_/g, " ")}
            </span>
          </div>
          <div className="briefing-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewBriefingBoard.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Ready</span>
              <strong>{view.reviewBriefingBoard.summary.readyCount}</strong>
            </div>
            <div>
              <span className="metric-label">Follow-up</span>
              <strong>{view.reviewBriefingBoard.summary.followUpCount}</strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>{view.reviewBriefingBoard.summary.deferredCount}</strong>
            </div>
          </div>
          <div className="briefing-board-layout">
            <div className="briefing-group-list">
              {view.reviewBriefingBoard.groupedDecisionSummaries.map((group) => (
                <article
                  key={group.status}
                  className={`briefing-group briefing-group-${group.status}`}
                >
                  <div className="briefing-group-heading">
                    <div>
                      <span className={`status-chip decision-status-${group.status}`}>
                        {group.status.replace("_", " ")}
                      </span>
                      <h3>{group.label}</h3>
                    </div>
                    <strong>{group.decisionCount}</strong>
                  </div>
                  <p>{group.summary}</p>
                  <div className="briefing-decision-list">
                    {group.decisions.map((decision) => (
                      <article
                        key={decision.decisionId}
                        className="briefing-decision-card"
                      >
                        <div className="briefing-decision-heading">
                          <span className="event-type">{decision.decisionId}</span>
                          <strong>{decision.label}</strong>
                        </div>
                        <p>{decision.summary}</p>
                        <p className="briefing-decision-frame">
                          Playback frame {decision.relatedPlaybackFrameId}
                        </p>
                        {decision.followUpReason ? (
                          <p className="briefing-decision-follow-up">
                            {decision.followUpReason}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="briefing-sidebar">
              <div className="briefing-panel">
                <span className="metric-label">Follow-up actions</span>
                {view.reviewBriefingBoard.followUpActions.length ? (
                  <div className="briefing-follow-up-list">
                    {view.reviewBriefingBoard.followUpActions.map((action) => (
                      <article key={action.actionId} className="briefing-follow-up-item">
                        <strong>{action.label}</strong>
                        <p>{action.summary}</p>
                        <div className="briefing-follow-up-meta">
                          <span>{action.decisionIds.join(", ")}</span>
                          <span>{action.evidenceTargets.join(", ")}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No follow-up actions remain.</p>
                )}
              </div>
              <div className="briefing-panel">
                <span className="metric-label">Evidence drilldown</span>
                <div className="briefing-evidence-list">
                  {view.reviewBriefingBoard.evidenceDrilldownRows.map((row) => (
                    <article
                      key={row.rowId}
                      className={`briefing-evidence-row evidence-${row.decisionStatus}`}
                    >
                      <span
                        className={`status-chip decision-status-${row.decisionStatus}`}
                      >
                        {row.decisionStatus.replace(/_/g, " ")}
                      </span>
                      <div>
                        <div className="briefing-evidence-heading">
                          <strong>{row.evidenceLabel}</strong>
                          <span>{row.source.replace(/_/g, " ")}</span>
                        </div>
                        <p>{row.decisionLabel}</p>
                        <p>{row.reviewNote}</p>
                        <div className="briefing-evidence-meta">
                          <span>{row.target}</span>
                          {row.frameId ? <span>{row.frameId}</span> : null}
                          {row.path ? <span>{row.path}</span> : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewBriefingBoard.localOnlyScopeNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      ) : null}

      {view.reviewActionQueue ? (
        <section
          className="review-action-section"
          aria-label="Review action queue and handoff readiness"
        >
          <a id="review-action-queue" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 16 action queue</span>
              <h2>Review action queue and handoff readiness</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewActionQueue.readiness.verdict}`}
            >
              {view.reviewActionQueue.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="action-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewActionQueue.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Actions</span>
              <strong>
                {view.reviewActionQueue.readiness.counts.totalActionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Blocking</span>
              <strong>
                {view.reviewActionQueue.readiness.counts.blockingActionCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred scope</span>
              <strong>
                {
                  view.reviewActionQueue.readiness.counts
                    .deferredProductionActionCount
                }
              </strong>
            </div>
          </div>
          <div className="action-queue-layout">
            <div className="action-queue-list">
              {view.reviewActionQueue.actions.map((action) => (
                <article
                  key={action.actionId}
                  className={`action-queue-item action-priority-${action.priority} action-category-${action.blockerCategory}`}
                >
                  <div className="action-queue-heading">
                    <span
                      className={`status-chip action-priority-chip-${action.priority}`}
                    >
                      {action.priority.toUpperCase()}
                    </span>
                    <div>
                      <span className="event-type">
                        {action.blockerCategory.replace(/_/g, " ")}
                      </span>
                      <h3>{action.label}</h3>
                    </div>
                  </div>
                  <p>{action.summary}</p>
                  <p className="action-next-step">{action.nextLocalStep}</p>
                  <p className="action-readiness-impact">
                    {action.readinessImpact}
                  </p>
                  <div className="action-evidence-list">
                    {action.evidenceTargets.map((target) => (
                      <a key={`${action.actionId}:${target}`} href={`#${target}`}>
                        {target}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="handoff-readiness-panel">
              <span className="metric-label">Handoff readiness</span>
              <strong>{view.reviewActionQueue.readiness.label}</strong>
              <p>{view.reviewActionQueue.readiness.summary}</p>
              <div className="readiness-count-strip">
                <span>
                  {view.reviewActionQueue.readiness.counts.blockingActionCount}{" "}
                  blockers
                </span>
                <span>
                  {
                    view.reviewActionQueue.readiness.counts
                      .deferredProductionActionCount
                  }{" "}
                  deferred
                </span>
              </div>
              <p className="human-test-gate">
                {view.reviewActionQueue.humanTestGateSummary}
              </p>
              <div className="deferred-scope-list">
                {view.reviewActionQueue.deferredScopeNotes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewActionWalkthrough ? (
        <section
          className="review-walkthrough-section"
          aria-label="Action evidence walkthrough"
        >
          <a id="review-action-walkthrough" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 17 action walkthrough</span>
              <h2>Selected action evidence path</h2>
            </div>
            <span
              className={`status-chip action-status-${
                view.reviewActionWalkthrough.selectedAction.blocking
                  ? "blocked_by_local_follow_up"
                  : "deferred_production_scope_only"
              }`}
            >
              {view.reviewActionWalkthrough.selectedAction.blocking
                ? "blocked by local follow up"
                : "deferred production scope only"}
            </span>
          </div>
          <div className="walkthrough-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewActionWalkthrough.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Selected action</span>
              <strong>{view.reviewActionWalkthrough.selectedAction.label}</strong>
            </div>
            <div>
              <span className="metric-label">Targets</span>
              <strong>{view.reviewActionWalkthrough.coverage.totalTargetCount}</strong>
            </div>
            <div>
              <span className="metric-label">Missing</span>
              <strong>
                {view.reviewActionWalkthrough.coverage.missingTargetCount}
              </strong>
            </div>
          </div>
          <div className="walkthrough-layout">
            <div className="walkthrough-selector" aria-label="Action selector">
              {view.reviewActionWalkthrough.actions.map((action) => (
                <button
                  key={action.actionId}
                  className={
                    action.actionId === view.reviewActionWalkthrough?.selectedActionId
                      ? "walkthrough-choice selected"
                      : "walkthrough-choice"
                  }
                  type="button"
                  onClick={() => onSelectReviewAction(action.actionId)}
                >
                  <span className={`status-chip action-priority-chip-${action.priority}`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <strong>{action.label}</strong>
                  <p>{action.summary}</p>
                  <div className="walkthrough-choice-meta">
                    <span>{action.evidenceTargets.length} targets</span>
                    <span>
                      {action.blocking ? "blocking" : "deferred production"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="walkthrough-details">
              <article className="walkthrough-action-card">
                <div className="walkthrough-action-heading">
                  <div>
                    <span className="event-type">
                      {view.reviewActionWalkthrough.selectedAction.blockerCategory.replace(
                        /_/g,
                        " ",
                      )}
                    </span>
                    <h3>{view.reviewActionWalkthrough.selectedAction.label}</h3>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {view.reviewActionWalkthrough.selectedActionId}
                  </span>
                </div>
                <p>{view.reviewActionWalkthrough.selectedAction.summary}</p>
                <p className="action-next-step">
                  {view.reviewActionWalkthrough.nextLocalStep}
                </p>
                <p className="action-readiness-impact">
                  {view.reviewActionWalkthrough.selectedAction.readinessImpact}
                </p>
                <div className="decision-evidence-list">
                  {view.reviewActionWalkthrough.selectedAction.decisionIds.map(
                    (decisionId) => (
                      <span key={decisionId}>{decisionId}</span>
                    ),
                  )}
                  {view.reviewActionWalkthrough.selectedAction.evidenceTargets.map(
                    (target) => (
                      <a key={target} href={`#${target}`}>
                        {target}
                      </a>
                    ),
                  )}
                </div>
              </article>
              <div className="walkthrough-path-list">
                {view.reviewActionWalkthrough.evidencePathRows.map((row) => (
                  <article
                    key={row.rowId}
                    className={`walkthrough-path-row walkthrough-path-${row.status}`}
                  >
                    <div className="walkthrough-path-heading">
                      <span
                        className={`status-chip decision-status-${
                          row.status === "available" ? "ready" : "follow_up"
                        }`}
                      >
                        {row.status}
                      </span>
                      <div>
                        <span className="event-type">{row.target}</span>
                        <h3>{row.label}</h3>
                      </div>
                    </div>
                    <p>
                      {row.evidenceRows.length} briefing rows,{" "}
                      {row.replayFrameIds.length} replay frames,{" "}
                      {row.runbookTargets.length} runbook targets.
                    </p>
                    <div className="walkthrough-reference-strip">
                      {row.replayFrameIds.map((frameId) => (
                        <span key={`${row.rowId}:${frameId}`}>{frameId}</span>
                      ))}
                      {row.runbookTargets.map((target) => (
                        <span key={`${row.rowId}:${target.stepId}`}>
                          {target.stepId}
                        </span>
                      ))}
                      {row.packetReferences.map((reference) => (
                        <span key={`${row.rowId}:${reference.packetId}`}>
                          {reference.packetId}
                        </span>
                      ))}
                      {row.exportReferences.map((reference) => (
                        <span key={`${row.rowId}:${reference.exportId}`}>
                          {reference.exportId}
                        </span>
                      ))}
                      {row.sourcePaths.map((path) => (
                        <span key={`${row.rowId}:${path}`}>{path}</span>
                      ))}
                    </div>
                    <div className="walkthrough-evidence-list">
                      {row.evidenceRows.map((evidence) => (
                        <article
                          key={evidence.rowId}
                          className="briefing-evidence-row"
                        >
                          <span
                            className={`status-chip decision-status-${evidence.decisionStatus}`}
                          >
                            {evidence.decisionStatus.replace(/_/g, " ")}
                          </span>
                          <div>
                            <div className="briefing-evidence-heading">
                              <strong>{evidence.evidenceLabel}</strong>
                              <span>{evidence.source.replace(/_/g, " ")}</span>
                            </div>
                            <p>{evidence.reviewNote}</p>
                            <div className="briefing-evidence-meta">
                              <span>{evidence.decisionLabel}</span>
                              <span>{evidence.target}</span>
                              {evidence.frameId ? <span>{evidence.frameId}</span> : null}
                              {evidence.path ? <span>{evidence.path}</span> : null}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="walkthrough-missing-panel">
                <span className="metric-label">Missing targets</span>
                {view.reviewActionWalkthrough.missingTargetRecords.length ? (
                  <div className="walkthrough-missing-list">
                    {view.reviewActionWalkthrough.missingTargetRecords.map((record) => (
                      <article key={record.target} className="walkthrough-missing-row">
                        <strong>{record.label}</strong>
                        <p>{record.reason}</p>
                        <div className="briefing-evidence-meta">
                          {record.expectedHints.map((hint) => (
                            <span key={`${record.target}:${hint}`}>{hint}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">
                    All selected action targets resolved to local evidence.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="playback-scope-notes">
            {view.reviewActionWalkthrough.deferredProductionBoundaryNotes.map(
              (note) => (
                <span key={note}>{note}</span>
              ),
            )}
          </div>
        </section>
      ) : null}

      {view.reviewHandoffRehearsal ? (
        <section
          className="review-handoff-section"
          aria-label="Local review handoff rehearsal"
        >
          <a id="review-handoff-rehearsal" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 18 handoff rehearsal</span>
              <h2>Local review rehearsal script</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewHandoffRehearsal.readiness.verdict}`}
            >
              {view.reviewHandoffRehearsal.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="handoff-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewHandoffRehearsal.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Steps</span>
              <strong>
                {view.reviewHandoffRehearsal.readiness.counts.totalStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Local blockers</span>
              <strong>
                {view.reviewHandoffRehearsal.readiness.counts.blockingStepCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Missing targets</span>
              <strong>
                {
                  view.reviewHandoffRehearsal.readiness.counts
                    .missingCheckpointCount
                }
              </strong>
            </div>
          </div>
          <div className="handoff-rehearsal-layout">
            <div className="handoff-step-list">
              {view.reviewHandoffRehearsal.steps.map((step) => (
                <article
                  key={step.stepId}
                  className={`handoff-step handoff-step-${step.missingTargetStatus}`}
                >
                  <div className="handoff-step-heading">
                    <span
                      className={`status-chip action-priority-chip-${step.priority}`}
                    >
                      Step {step.stepNumber}
                    </span>
                    <div>
                      <span className="event-type">
                        {step.blockerCategory.replace(/_/g, " ")}
                      </span>
                      <h3>{step.actionLabel}</h3>
                    </div>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {step.actionId}
                  </span>
                  <p>{step.reviewerPrompt}</p>
                  <p className="action-readiness-impact">
                    {step.expectedLocalOutcome}
                  </p>
                  <p className="action-next-step">{step.nextLocalStep}</p>
                  <div className="handoff-checkpoint-strip">
                    <span>
                      {step.checkpointCounts.resolvedTargetCount} resolved
                    </span>
                    <span>{step.checkpointCounts.missingTargetCount} missing</span>
                    <span>{step.checkpointCounts.replayFrameCount} frames</span>
                    <span>
                      {step.checkpointCounts.runbookTargetCount} runbook targets
                    </span>
                    <span>{step.checkpointCounts.sourcePathCount} sources</span>
                  </div>
                  {step.missingTargets.length ? (
                    <div className="handoff-missing-targets">
                      {step.missingTargets.map((target) => (
                        <article key={`${step.stepId}:${target.target}`}>
                          <strong>{target.label}</strong>
                          <p>{target.reason}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                  <div className="handoff-source-list">
                    {step.sourceEvidenceReferences.map((source) => (
                      <span key={`${step.stepId}:${source}`}>{source}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="handoff-readiness-panel rehearsal-readiness-panel">
              <span className="metric-label">Rehearsal readiness</span>
              <strong>{view.reviewHandoffRehearsal.readiness.label}</strong>
              <p>{view.reviewHandoffRehearsal.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewHandoffRehearsal.nextLocalPrompt}
              </p>
              {view.reviewHandoffRehearsal.unresolvedLocalBlockers.length ? (
                <div className="handoff-blocker-list">
                  {view.reviewHandoffRehearsal.unresolvedLocalBlockers.map(
                    (blocker) => (
                      <article key={blocker.blockerId}>
                        <strong>{blocker.label}</strong>
                        <p>{blocker.reason}</p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <p className="empty-state">No local rehearsal blockers remain.</p>
              )}
              <div className="deferred-scope-list">
                {view.reviewHandoffRehearsal.deferredProductionNotes.map(
                  (note) => (
                    <span key={note}>{note}</span>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewHandoffCoverageMatrix ? (
        <section
          className="review-coverage-section"
          aria-label="Local review coverage matrix"
        >
          <a id="review-coverage-matrix" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 19 coverage matrix</span>
              <h2>Local review coverage matrix</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewHandoffCoverageMatrix.readiness.verdict}`}
            >
              {view.reviewHandoffCoverageMatrix.readiness.verdict.replace(
                /_/g,
                " ",
              )}
            </span>
          </div>
          <div className="coverage-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewHandoffCoverageMatrix.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.totalRowCount}</strong>
            </div>
            <div>
              <span className="metric-label">Blocking rows</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.blockingRowCount}</strong>
            </div>
            <div>
              <span className="metric-label">Missing targets</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.counts.missingTargetCount}</strong>
            </div>
            <div>
              <span className="metric-label">Source refs</span>
              <strong>
                {
                  view.reviewHandoffCoverageMatrix.readiness.counts
                    .sourceEvidenceReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="coverage-matrix-layout">
            <div className="coverage-row-list">
              {view.reviewHandoffCoverageMatrix.rows.map((row) => (
                <article
                  key={row.rowId}
                  className={`coverage-row coverage-row-${row.blockerStatus}`}
                >
                  <div className="coverage-row-heading">
                    <span
                      className={`status-chip action-status-${row.readinessVerdict}`}
                    >
                      Row {row.rowNumber}
                    </span>
                    <div>
                      <span className="event-type">
                        {row.blockerStatus.replace(/_/g, " ")}
                      </span>
                      <h3>{row.rehearsalStepLabel}</h3>
                    </div>
                  </div>
                  <span className="walkthrough-selected-action-id">
                    {row.actionId}
                  </span>
                  <p>{row.blockerSummary}</p>
                  <p className="action-readiness-impact">{row.nextLocalStep}</p>
                  <div className="coverage-checkpoint-strip">
                    <span>
                      {row.targetCoverageCounts.resolvedTargetCount} resolved
                    </span>
                    <span>{row.targetCoverageCounts.missingTargetCount} missing</span>
                    <span>{row.targetCoverageCounts.replayFrameCount} frames</span>
                    <span>
                      {row.targetCoverageCounts.runbookTargetCount} runbook targets
                    </span>
                    <span>{row.targetCoverageCounts.packetReferenceCount} packet refs</span>
                    <span>
                      {row.targetCoverageCounts.exportReferenceCount} export refs
                    </span>
                    <span>{row.targetCoverageCounts.sourcePathCount} source paths</span>
                  </div>
                  <div className="coverage-source-buckets">
                    {row.sourceCoverageBuckets.map((bucket) => (
                      <span key={`${row.rowId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="handoff-source-list">
                    {row.sourceEvidenceReferences.map((source) => (
                      <span key={`${row.rowId}:${source}`}>{source}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="coverage-readiness-panel rehearsal-readiness-panel">
              <span className="metric-label">Matrix readiness</span>
              <strong>{view.reviewHandoffCoverageMatrix.readiness.label}</strong>
              <p>{view.reviewHandoffCoverageMatrix.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewHandoffCoverageMatrix.nextLocalPrompt}
              </p>
              <div className="coverage-command-list">
                {view.reviewHandoffCoverageMatrix.localVerificationCommands.map(
                  (command) => (
                    <article
                      key={command.commandId}
                      className="coverage-command-row"
                    >
                      <strong>{command.label}</strong>
                      <code>{command.command}</code>
                      <p>{command.purpose}</p>
                    </article>
                  ),
                )}
              </div>
              {view.reviewHandoffCoverageMatrix.unresolvedLocalBlockers.length ? (
                <div className="coverage-blocker-list">
                  {view.reviewHandoffCoverageMatrix.unresolvedLocalBlockers.map(
                    (blocker) => (
                      <article key={blocker.blockerId}>
                        <strong>{blocker.label}</strong>
                        <p>{blocker.reason}</p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <p className="empty-state">No local coverage blockers remain.</p>
              )}
              <div className="deferred-scope-list">
                {view.reviewHandoffCoverageMatrix.deferredProductionNotes.map(
                  (note) => (
                    <span key={note}>{note}</span>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewGapTriage ? (
        <section
          className="review-gap-section"
          aria-label="Local review gap triage"
        >
          <a id="review-gap-triage" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 20 gap triage</span>
              <h2>Next local review pass</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewGapTriage.readiness.verdict}`}
            >
              {view.reviewGapTriage.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewGapTriage.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Items</span>
              <strong>{view.reviewGapTriage.readiness.counts.totalItemCount}</strong>
            </div>
            <div>
              <span className="metric-label">Local blockers</span>
              <strong>
                {view.reviewGapTriage.readiness.counts.localBlockerItemCount}
              </strong>
            </div>
            <div>
              <span className="metric-label">Deferred</span>
              <strong>
                {
                  view.reviewGapTriage.readiness.counts
                    .deferredProductionItemCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Proof refs</span>
              <strong>
                {view.reviewGapTriage.readiness.counts.proofCommandCount}
              </strong>
            </div>
          </div>
          <div className="gap-triage-layout">
            <div className="gap-group-list">
              {view.reviewGapTriage.groups.map((group) => (
                <article
                  key={group.groupId}
                  className={`gap-group gap-group-${group.category}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span
                        className={`status-chip action-priority-chip-${group.priority}`}
                      >
                        {group.priority.toUpperCase()}
                      </span>
                      <h3>{group.label}</h3>
                    </div>
                    <strong>{group.itemCount}</strong>
                  </div>
                  <p>{group.summary}</p>
                  <div className="gap-item-list">
                    {group.items.map((item) => (
                      <article
                        key={item.itemId}
                        className={`gap-item gap-item-${item.category}`}
                      >
                        <div className="gap-item-heading">
                          <span className="gap-rank">#{item.rank}</span>
                          <div>
                            <span className="event-type">
                              {item.category.replace(/_/g, " ")}
                            </span>
                            <h4>{item.label}</h4>
                          </div>
                        </div>
                        <p>{item.summary}</p>
                        <p className="action-next-step">{item.nextLocalStep}</p>
                        <div className="gap-reference-strip">
                          {item.sourceMatrixRowIds.map((rowId) => (
                            <span key={`${item.itemId}:${rowId}`}>{rowId}</span>
                          ))}
                          {item.sourceActionIds.map((actionId) => (
                            <span key={`${item.itemId}:${actionId}`}>
                              {actionId}
                            </span>
                          ))}
                        </div>
                        <div className="gap-bucket-strip">
                          {item.sourceBuckets.map((bucket) => (
                            <span key={`${item.itemId}:${bucket.bucketId}`}>
                              {bucket.label}: {bucket.count}
                            </span>
                          ))}
                        </div>
                        <div className="gap-proof-strip">
                          {item.proofCommandReferences.map((command) => (
                            <span key={`${item.itemId}:${command.commandId}`}>
                              {command.label}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="gap-proof-panel">
              <span className="metric-label">Next-pass readiness</span>
              <strong>{view.reviewGapTriage.readiness.label}</strong>
              <p>{view.reviewGapTriage.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewGapTriage.staticProofChecklistSummary}
              </p>
              <div className="coverage-command-list">
                {view.reviewGapTriage.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
              {view.reviewGapTriage.localBlockerSummaries.length ? (
                <div className="gap-blocker-list">
                  {view.reviewGapTriage.localBlockerSummaries.map((blocker) => (
                    <article key={blocker.blockerId}>
                      <strong>{blocker.label}</strong>
                      <p>{blocker.reason}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No local triage blockers remain.</p>
              )}
              <div className="gap-deferred-list">
                {view.reviewGapTriage.deferredProductionBoundaries.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {view.reviewGapResolution ? (
        <section
          className="review-gap-section"
          aria-label="Local review gap resolution"
        >
          <a id="review-gap-resolution" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Stage 21 gap resolution</span>
              <h2>Resolution proof checklist</h2>
            </div>
            <span
              className={`status-chip action-status-${view.reviewGapResolution.readiness.verdict}`}
            >
              {view.reviewGapResolution.readiness.verdict.replace(/_/g, " ")}
            </span>
          </div>
          <div className="gap-summary-grid">
            <div>
              <span className="metric-label">Contract</span>
              <strong>{view.reviewGapResolution.contractLabel}</strong>
            </div>
            <div>
              <span className="metric-label">Rows</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .totalResolutionRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Local targets</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .localActionableRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Checklist</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .evidenceTargetChecklistRowCount
                }
              </strong>
            </div>
            <div>
              <span className="metric-label">Proof refs</span>
              <strong>
                {
                  view.reviewGapResolution.readiness.counts
                    .proofCommandReferenceCount
                }
              </strong>
            </div>
          </div>
          <div className="gap-triage-layout gap-resolution-layout">
            <div className="gap-group-list">
              {view.reviewGapResolution.resolutionRows.map((row) => (
                <article
                  key={row.resolutionId}
                  className={`gap-group gap-group-${row.category}`}
                >
                  <div className="gap-group-heading">
                    <div>
                      <span
                        className={`status-chip action-priority-chip-${row.priority}`}
                      >
                        {row.priority.toUpperCase()}
                      </span>
                      <h3>{row.label}</h3>
                    </div>
                    <strong>#{row.rank}</strong>
                  </div>
                  <p>{row.summary}</p>
                  <p className="action-next-step">
                    {row.nextStaticLocalProofStep}
                  </p>
                  <div className="gap-reference-strip">
                    {row.sourceMatrixRowIds.map((rowId) => (
                      <span key={`${row.resolutionId}:${rowId}`}>{rowId}</span>
                    ))}
                    {row.sourceActionIds.map((actionId) => (
                      <span key={`${row.resolutionId}:${actionId}`}>
                        {actionId}
                      </span>
                    ))}
                  </div>
                  <div className="gap-bucket-strip">
                    {row.sourceBuckets.map((bucket) => (
                      <span key={`${row.resolutionId}:${bucket.bucketId}`}>
                        {bucket.label}: {bucket.count}
                      </span>
                    ))}
                  </div>
                  <div className="resolution-target-list">
                    {row.evidenceTargetChecklistRows.map((target) => (
                      <article
                        key={target.targetRowId}
                        className={`resolution-target-row resolution-target-${target.status}`}
                      >
                        <div>
                          <span className="event-type">
                            {target.status.replace(/_/g, " ")}
                          </span>
                          <strong>{target.label}</strong>
                        </div>
                        <p>{target.nextStaticLocalProofStep}</p>
                      </article>
                    ))}
                  </div>
                  <div className="gap-proof-strip">
                    {row.proofCommandReferences.map((command) => (
                      <span key={`${row.resolutionId}:${command.commandId}`}>
                        {command.label}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <aside className="gap-proof-panel">
              <span className="metric-label">Resolution readiness</span>
              <strong>{view.reviewGapResolution.readiness.label}</strong>
              <p>{view.reviewGapResolution.readiness.summary}</p>
              <p className="human-test-gate">
                {view.reviewGapResolution.staticProofChecklistSummary}
              </p>
              <div className="resolution-summary-card">
                <span className="metric-label">Top local blocker</span>
                <strong>
                  {view.reviewGapResolution.localResolutionSummary
                    .topLocalBlockerLabel ?? "No local blockers"}
                </strong>
                <p>
                  {
                    view.reviewGapResolution.localResolutionSummary
                      .nextStaticLocalProofStep
                  }
                </p>
              </div>
              <div className="coverage-command-list">
                {view.reviewGapResolution.proofCommandReferences.map((command) => (
                  <article key={command.commandId} className="coverage-command-row">
                    <strong>{command.label}</strong>
                    <code>{command.command}</code>
                    <p>{command.purpose}</p>
                  </article>
                ))}
              </div>
              <div className="gap-deferred-list">
                {view.reviewGapResolution.deferredBoundaryNotes.map(
                  (boundary) => (
                    <article key={boundary.boundaryId}>
                      <strong>{boundary.label}</strong>
                      <p>{boundary.summary}</p>
                    </article>
                  ),
                )}
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="incident-section" aria-label="Fault incident timeline">
        <a id="fault-incident-timeline" className="section-anchor" />
        <div className="section-heading">
          <div>
            <span className="metric-label">Manual Stage 07 incident</span>
            <h2>Fault-to-alert chain</h2>
          </div>
          {view.incident.latestEventAt ? (
            <span className="event-time">{view.incident.latestEventAt}</span>
          ) : null}
        </div>
        <div className="active-faults">
          {view.incident.activeFaults.map((fault) => (
            <article key={fault.faultId} className="fault-row">
              <span
                className={`status-chip status-${
                  fault.status === "active" ? "critical" : "nominal"
                }`}
              >
                {fault.status}
              </span>
              <div>
                <h3>{fault.faultType}</h3>
                <p>{fault.summary}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="event-timeline">
          {view.incident.timeline.map((event) => (
            <article key={event.eventId} className="event-row">
              <span className={`status-dot status-${event.severity ?? "info"}`} />
              <div>
                <span className="event-type">{event.eventType}</span>
                <p>{event.message}</p>
                {event.channelId ? <strong>{event.channelId}</strong> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {view.replay ? (
        <section className="replay-section" aria-label="Replay anomaly inspection">
          <a id="replay-anomaly-inspection" className="section-anchor" />
          <div className="section-heading">
            <div>
              <span className="metric-label">Replay inspection window</span>
              <h2>Timeline markers and anomalies</h2>
            </div>
            <span className="event-time">{view.replay.windowLabel}</span>
          </div>
          <div className="replay-summary">
            <div>
              <span className="metric-label">Samples</span>
              <strong>{view.replay.sampleCount}</strong>
            </div>
            <div>
              <span className="metric-label">Markers</span>
              <strong>{view.replay.markerCount}</strong>
            </div>
            <div>
              <span className="metric-label">Anomalies</span>
              <strong>{view.replay.anomalyCount}</strong>
            </div>
          </div>
          <div className="replay-grid">
            <div className="replay-marker-list">
              {view.replay.timelineMarkers.map((marker) => (
                <article key={marker.markerId} className="event-row">
                  <span className={`status-dot status-${marker.severity}`} />
                  <div>
                    <span className="event-type">{marker.markerType}</span>
                    <p>{marker.message}</p>
                    {marker.channelId ? <strong>{marker.channelId}</strong> : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="anomaly-list">
              {view.replay.topAnomalies.map((anomaly) => (
                <article key={anomaly.anomalyId} className="anomaly-row">
                  <div>
                    <span className="channel-id">{anomaly.channelId}</span>
                    <h3>{anomaly.channelName}</h3>
                    <p>{anomaly.reason}</p>
                  </div>
                  <span className={`score-pill status-${anomaly.severity}`}>
                    {anomaly.scoreLabel}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="console-grid">
        <aside className="subsystem-rail" aria-label="Subsystem selector">
          {view.subsystems.map((subsystem) => (
            <button
              key={subsystem.id}
              className={
                subsystem.id === view.selectedSubsystem.id
                  ? "subsystem-button selected"
                  : "subsystem-button"
              }
              type="button"
              onClick={() => onSelectSubsystem(subsystem.id)}
            >
              <span>
                <span className={`status-dot status-${subsystem.status}`} />
                {subsystem.label}
              </span>
              <strong>{subsystem.channelCount}</strong>
            </button>
          ))}
        </aside>

        <section className="detail-panel" aria-label="Selected subsystem details">
          <div className="section-heading">
            <div>
              <span className="metric-label">Selected subsystem</span>
              <h2>{view.selectedSubsystem.label}</h2>
            </div>
            <span
              className={`status-chip status-${view.selectedSubsystem.status}`}
            >
              {view.selectedSubsystem.status}
            </span>
          </div>

          <div className="channel-list">
            {view.selectedSubsystem.channels.map((channel) => (
              <article key={channel.channelId} className="channel-row">
                <div>
                  <span className="channel-id">{channel.channelId}</span>
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </div>
                <div className="channel-readout">
                  <strong>{channel.formattedValue}</strong>
                  <span className={`status-chip status-${channel.status}`}>
                    {channel.status}
                  </span>
                  <span>Nominal {channel.nominalRangeLabel}</span>
                  <span>Warning {channel.warningRangeLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="trend-section" aria-label="Selected telemetry trends">
        <div className="section-heading">
          <div>
            <span className="metric-label">Deterministic Stage 03 trend window</span>
            <h2>Selected telemetry trends</h2>
          </div>
        </div>
        <div className="trend-grid">
          {view.trends.map((trend) => (
            <article key={trend.channelId} className="trend-panel">
              <div className="trend-heading">
                <div>
                  <span className="channel-id">{trend.channelId}</span>
                  <h3>{trend.name}</h3>
                </div>
                <span className={`status-chip status-${trend.status}`}>
                  {trend.status}
                </span>
              </div>
              <TrendSparkline trend={trend} />
              <div className="trend-stats">
                <span>
                  first <strong>{trend.firstValue}</strong>
                </span>
                <span>
                  last <strong>{trend.lastValue}</strong>
                </span>
                <span>
                  min <strong>{trend.minimum}</strong>
                </span>
                <span>
                  max <strong>{trend.maximum}</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="alerts-section" aria-label="Alert lifecycle">
        <a id="alert-lifecycle" className="section-anchor" />
        <div className="section-heading">
          <div>
            <span className="metric-label">Threshold-first alert records</span>
            <h2>Alert lifecycle</h2>
          </div>
        </div>
        <div className="alert-groups">
          <div className="alert-group">
            <h3>Active alerts</h3>
            <div className="alert-list">
              {activeAlerts.length ? (
                activeAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.recommendedAction}
                      </p>
                    </div>
                    <button
                      className="alert-action"
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.alertId)}
                    >
                      Acknowledge
                    </button>
                  </article>
                ))
              ) : (
                <p className="empty-state">No active alerts remain.</p>
              )}
            </div>
          </div>
          <div className="alert-group">
            <h3>Acknowledged alerts</h3>
            <div className="alert-list">
              {acknowledgedAlerts.length ? (
                acknowledgedAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.operatorNote}
                      </p>
                      <p className="acknowledgement-meta">
                        Acknowledged by {alert.acknowledgedBy ?? "operator"} at{" "}
                        {alert.acknowledgedAt}
                      </p>
                    </div>
                    <button
                      className="alert-action"
                      type="button"
                      onClick={() => onResolveAlert(alert.alertId)}
                    >
                      Resolve
                    </button>
                  </article>
                ))
              ) : (
                <p className="empty-state">
                  Acknowledged alerts will remain visible here.
                </p>
              )}
            </div>
          </div>
          <div className="alert-group">
            <h3>Resolved alerts</h3>
            <div className="alert-list">
              {resolvedAlerts.length ? (
                resolvedAlerts.map((alert) => (
                  <article key={alert.alertId} className="alert-row">
                    <span className={`status-chip status-${alert.severity}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <h4>{alert.channelId}</h4>
                      <p>{alert.message}</p>
                      <p className="recommended-action">
                        {alert.resolutionNote}
                      </p>
                      <p className="acknowledgement-meta">
                        Resolved by {alert.resolvedBy ?? "operator"} at{" "}
                        {alert.resolvedAt}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">
                  Resolved alerts will remain visible here.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
