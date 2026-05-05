# Stage 09 Realtime Baseline Summary

Generated at: `2026-05-05T10:44:08Z`

Runtime direction: Rust data plane direction, not a whole-project rewrite. Python/FastAPI remains the measured control-plane baseline for this report.

## Workload

- Scenario: `nominal-orbit-daylight`
- Channels: `10`
- Samples per channel: `10`
- Sample window: `2026-05-03T16:00:00Z` to `2026-05-03T16:00:09Z`
- Telemetry rows written: `100`

## Execution Profile

- Process model: `single-process in-process FastAPI TestClient`
- Client count: `1`
- Resource scope: `bounded local smoke, no worker fan-out`
- Deferred paths: `websocket stream fanout, client reconnect behavior, backpressure under multi-client load`

## Resource Guard

- Worker processes: `1`
- Max expected runtime: `30 seconds`
- Max expected memory: `512 MB`
- Uses network: `False`
- Uses paid services: `False`

## Runtime Observation

- Duration: `48.489 ms`
- Max expected runtime: `30 seconds`
- Within expected runtime: `True`
- Worker processes observed: `1`

## Timing Source Profile

- Duration clock: `time.perf_counter_ns monotonic process clock`
- Report timestamp clock: `datetime.now(timezone.utc)`
- Synthetic sample clock: `deterministic benchmark start_at plus fixed step_seconds`
- Comparison rule: `Compare duration and latency values only as run-specific metrics; synthetic benchmark timestamps are deterministic workload inputs.`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Measurement Boundary

- Baseline claim: `bounded Python/FastAPI control-plane comparison baseline`
- Measured now: `simulation write through the FastAPI control plane, manual fault alert evaluation, bounded replay query, dropped-event accounting from bounded replay coverage`
- Not measured yet: `websocket stream fanout, client reconnect resume, backpressure behavior under slow-client queues, multi-client delivery`
- Future evidence required: `A Rust data-plane candidate must emit a compatible benchmark report and separately prove any websocket, reconnect, or backpressure claim before replacing a Python hot path.`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Stream Contract Profile

- Contract artifact: `docs/development/artifacts/stage09-realtime-baseline/stage09-live-telemetry-contract.json`
- Implementation status: `contract_only_no_runtime_fanout`
- Endpoint: `websocket /sessions/{session_id}/telemetry/live`
- Required live evidence before runtime claim: `websocket connection acceptance for an existing session, startup snapshot emitted before incremental telemetry samples, monotonic per-session stream sequence values, after_sequence reconnect resume behavior, drop_oldest_and_report backpressure behavior, dropped_event_count reported from stream.backpressure payloads`
- Required baseline metrics: `telemetry_sample_rate_hz, p95_alert_latency_ms, p95_replay_query_latency_ms, dropped_event_count`
- Current evidence: `The current benchmark measures control-plane simulation, alert, replay, and dropped-event accounting only.`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Verification Contract

- Command: `python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json --summary-output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md`
- Required outputs: `docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json, docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md`
- Required report fields: `schema, execution_profile, resource_guard, runtime_observation, timing_source_profile, benchmark_contract, verification_contract, measurement_boundary, stream_contract_profile, determinism_profile, latency_budget_profile, alert_latency_profile, replay_query_profile, dropped_event_profile, rerun_evidence_profile, run_variant_policy, input_provenance, stable_report_fingerprint, metrics.telemetry_sample_rate_hz, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, metrics.dropped_event_count, target_profile, target_results.checks, baseline_verdict, next_hot_path_profile, runtime_boundary`
- Allowed run-variant fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed, latency_budget_profile.observed_p95_ms.alert_evaluation, latency_budget_profile.observed_p95_ms.bounded_replay_query, alert_latency_profile.observed_p95_ms, runtime_observation.duration_ms, runtime_observation.within_expected_runtime`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Determinism Profile

- Workload identity: `nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s`
- Stable inputs: `scenario, seed, start_at, channel_count, samples_per_channel, step_seconds`
- Run-variant fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed`
- Comparison rule: `Only compare runtime implementations when workload_identity and stable_inputs match; treat latency observations as run-specific.`

## Latency Budget Profile

- Alert p95 budget: `50 ms`
- Alert p95 remaining budget: `47.597 ms`
- Replay p95 budget: `500 ms`
- Replay p95 remaining budget: `497.114 ms`
- Comparison rule: `Only compare latency headroom when determinism_profile.workload_identity matches; treat observed p95 values as run-specific.`

## Alert Latency Profile

- Endpoint: `/sessions/{session_id}/faults`
- Trigger source: `manual fault POST requests through FastAPI TestClient`
- Fault types: `comms_downlink_fade, thermal_avionics_overheat`
- Latency iterations: `5`
- Latency method: `nearest-rank p95 over manual fault POST requests`
- Observed p95: `2.403 ms`
- Comparison rule: `Only compare alert hot-path candidates when the fault mix, iteration count, and determinism_profile.workload_identity match.`
- Rust scope: `data-plane alert-evaluation candidate only; not a whole-project rewrite`

## Replay Query Profile

- Endpoint: `/sessions/{session_id}/replay`
- Window: `2026-05-03T16:00:00Z` to `2026-05-03T16:00:16Z` (`16 seconds`)
- Requested limit: `500`
- Returned samples: `107`
- Markers: `29`
- Anomalies: `7`
- Latency iterations: `5`
- Comparison rule: `Only compare replay-index candidates when the window, requested limit, and determinism_profile.workload_identity match.`
- Rust scope: `data-plane replay-index candidate only; not a whole-project rewrite`

## Dropped Event Profile

- Accounting source: `max(expected_telemetry_rows - replay_sample_count, 0)`
- Expected telemetry rows: `107`
- Replay sample count: `107`
- Dropped event count: `0`
- Stream claim status: `control_plane_replay_accounting_only`
- Comparison rule: `Future websocket or Rust data-plane stream candidates must report dropped_event_count from stream.backpressure payloads without removing this bounded replay accounting field.`
- Rust scope: `data-plane stream candidate only; not a whole-project rewrite`

## Rerun Evidence Profile

- Command: `python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json --summary-output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md`
- Required outputs: `docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json, docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md`
- Resource envelope: `1 worker, 30 seconds, 512 MB, network=False, paid_services=False`
- Comparable identity: `nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s`
- Required before metric comparison: `rerun command completed successfully, JSON report and Markdown summary were regenerated together, resource envelope stayed within the local automation guard, stable report fingerprint matched or a versioned workload change was documented`
- Candidate scope: `Python/FastAPI baseline refresh or narrow Rust data-plane hot path; not a whole-project rewrite`

## Input Provenance

- Telemetry catalog: `fixtures/telemetry/channels.json`
- Catalog schema: `telemforge.telemetry.channels.v1`
- Catalog channels: `10`
- Catalog SHA-256: `fe0a09191f4b04677025887035ad0156627ef73bf6cca5692c8eb775f6dc3daf`

## Run Variant Policy

- Stable identity fields: `schema, stage, execution_profile.process_model, execution_profile.client_count, resource_guard.worker_processes, resource_guard.uses_network, resource_guard.uses_paid_services, determinism_profile.workload_identity, determinism_profile.stable_inputs, input_provenance.telemetry_catalog_sha256, rerun_evidence_profile.command, rerun_evidence_profile.required_outputs, rerun_evidence_profile.resource_envelope, timing_source_profile, workload.scenario, workload.samples_per_channel, workload.step_seconds, targets, runtime_boundary`
- Allowed variant fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed, latency_budget_profile.observed_p95_ms.alert_evaluation, latency_budget_profile.observed_p95_ms.bounded_replay_query, latency_budget_profile.remaining_budget_ms.alert_evaluation, latency_budget_profile.remaining_budget_ms.bounded_replay_query, alert_latency_profile.observed_p95_ms, runtime_observation.duration_ms, runtime_observation.within_expected_runtime`
- Comparison gate: `Do not compare runtime candidates unless stable_identity_fields match or the candidate explicitly documents a versioned workload change.`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Stable Report Fingerprint

- Schema: `telemforge.stage09_stable_report_fingerprint.v1`
- Digest algorithm: `sha256`
- Digest SHA-256: `10a54ffffda715b07e7b2a543c209ea0db3c906cca0569edbd69496799536609`
- Stable identity fields: `schema, stage, execution_profile.process_model, execution_profile.client_count, resource_guard.worker_processes, resource_guard.uses_network, resource_guard.uses_paid_services, determinism_profile.workload_identity, determinism_profile.stable_inputs, input_provenance.telemetry_catalog_sha256, rerun_evidence_profile.command, rerun_evidence_profile.required_outputs, rerun_evidence_profile.resource_envelope, timing_source_profile, workload.scenario, workload.samples_per_channel, workload.step_seconds, targets, runtime_boundary`
- Excluded run-variant fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed, latency_budget_profile.observed_p95_ms.alert_evaluation, latency_budget_profile.observed_p95_ms.bounded_replay_query, latency_budget_profile.remaining_budget_ms.alert_evaluation, latency_budget_profile.remaining_budget_ms.bounded_replay_query, alert_latency_profile.observed_p95_ms, runtime_observation.duration_ms, runtime_observation.within_expected_runtime`
- Comparison rule: `Compare timing metrics only after digest_sha256 matches or a versioned workload change is documented.`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Target Profile

- Schema: `telemforge.stage09_target_profile.v1`
- Baseline status: `comparison_baseline_not_realtime_claim`
- Source: `ADR-009 initial benchmark hypotheses`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`
- Workload hypothesis: `100 channels at 10 Hz per channel (1000 Hz aggregate), single local client smoke before multi-client fanout`
- Report bindings: `workload.channel_count, workload.per_channel_sample_rate_hz, metrics.telemetry_sample_rate_hz, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, metrics.dropped_event_count`
- Promotion rule: `A future runtime candidate must preserve these report bindings and emit target_results.checks before replacing a Python hot path.`

## Comparison Profile

- Stable fields: `schema, stage, health_stage, execution_profile.process_model, execution_profile.client_count, execution_profile.resource_scope, execution_profile.load_shape, resource_guard.worker_processes, resource_guard.uses_network, resource_guard.uses_paid_services, benchmark_contract, verification_contract, measurement_boundary, timing_source_profile, stream_contract_profile, rerun_evidence_profile, run_variant_policy, stable_report_fingerprint, determinism_profile.workload_identity, determinism_profile.stable_inputs, latency_budget_profile.budgets, alert_latency_profile.endpoint_path, alert_latency_profile.trigger_source, alert_latency_profile.latency_method, replay_query_profile.window, replay_query_profile.requested_limit, dropped_event_profile.accounting_source, dropped_event_profile.comparison_rule, input_provenance.telemetry_catalog_sha256, workload.scenario, workload.sample_window, workload.samples_per_channel, workload.step_seconds, targets, target_profile, baseline_verdict, next_hot_path_profile, runtime_boundary`
- Run-specific fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed, latency_budget_profile.observed_p95_ms.alert_evaluation, latency_budget_profile.observed_p95_ms.bounded_replay_query, alert_latency_profile.observed_p95_ms, runtime_observation.duration_ms, runtime_observation.within_expected_runtime`
- Compatibility requirements: `Use the same workload scenario, seed, sample count, and step interval.; Keep execution_profile and resource_guard visible in every report.; Report dropped_event_count explicitly for stream/backpressure comparisons.; Keep determinism_profile.workload_identity unchanged for comparable runs.; Preserve the benchmark metric names before replacing any Python control-plane hot path with a Rust data-plane candidate.; Preserve latency_budget_profile fields so alert and replay headroom remain visible across runtime candidates.; Preserve input_provenance.telemetry_catalog_sha256 so runtime candidates do not compare against a different channel catalog.; Preserve verification_contract.command and required_report_fields so reruns regenerate both public baseline artifacts together.; Preserve rerun_evidence_profile fields so baseline refreshes and Rust candidates prove the same command, outputs, and resource envelope before metrics are compared.`

## Metrics

- Aggregate sample rate: `10.0 Hz`
- Per-channel sample rate: `1.0 Hz`
- P95 alert latency: `2.403 ms`
- P95 replay query latency: `2.886 ms`
- Dropped events: `0`

## Target Results

| Metric | Observed | Target | Gap | Result |
| --- | ---: | ---: | ---: | --- |
| Channel count | 10 channels | >= 100 channels | 90 channels | MISS |
| Per-channel sample rate | 1.0 Hz | >= 10 Hz | 9.0 Hz | MISS |
| Aggregate sample rate | 10.0 Hz | >= 1000 Hz | 990.0 Hz | MISS |
| P95 alert latency | 2.403 ms | <= 50 ms | 0 ms | PASS |
| P95 replay query latency | 2.886 ms | <= 500 ms | 0 ms | PASS |
| Dropped events | 0 events | <= 0 events | 0 events | PASS |

Missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`.

## Baseline Verdict

- Status: `baseline_only_targets_not_met`
- Summary: `Current Python/FastAPI baseline is suitable for comparison, not production realtime claims.`
- Passed targets: `p95_alert_latency_ms, p95_replay_query_latency_ms, dropped_event_count`
- Missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`
- Next comparable candidate: `narrow Rust data-plane hot path using the same benchmark_contract, execution_profile, and resource_guard fields`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

## Next Hot Path Profile

- Selected candidate: `rust_stream_fanout_sample_rate_spike`
- Addresses missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`
- Candidate scope: `stream fanout and sample-rate throughput behind the live telemetry contract; Python/FastAPI remains the control plane`
- Must preserve contracts: `docs/development/artifacts/stage09-realtime-baseline/stage09-live-telemetry-contract.json, docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json, execution_profile, resource_guard, benchmark_contract`
- Promotion signal: `A comparable candidate report improves at least one missed throughput target without regressing dropped_event_count.`
- Forbidden scope: `whole-project rewrite, Python control-plane replacement, unbounded local load test, multi-worker fanout outside the local resource guard`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

A future Rust data-plane candidate should emit the same JSON report shape, including gap-to-target values, before replacing a Python hot path.
