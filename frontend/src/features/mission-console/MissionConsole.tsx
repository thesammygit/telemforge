import { TrendSparkline } from "./TrendSparkline.tsx";
import type { MissionConsoleView, TelemetryStatus } from "./types.ts";

interface MissionConsoleProps {
  view: MissionConsoleView;
  onSelectSubsystem: (subsystemId: string) => void;
  onSelectRunbook: (runbookId: string) => void;
  onSelectReplayFrame: (frameId: string) => void;
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
