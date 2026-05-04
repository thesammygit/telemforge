# Stage 09 Realtime Baseline Summary

Generated at: `2026-05-04T06:03:32Z`

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

## Determinism Profile

- Workload identity: `nominal-orbit-daylight:seed-9090:channels-10:samples-10:step-1s`
- Stable inputs: `scenario, seed, start_at, channel_count, samples_per_channel, step_seconds`
- Run-variant fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed`
- Comparison rule: `Only compare runtime implementations when workload_identity and stable_inputs match; treat latency observations as run-specific.`

## Latency Budget Profile

- Alert p95 budget: `50 ms`
- Alert p95 remaining budget: `47.186 ms`
- Replay p95 budget: `500 ms`
- Replay p95 remaining budget: `496.775 ms`
- Comparison rule: `Only compare latency headroom when determinism_profile.workload_identity matches; treat observed p95 values as run-specific.`

## Input Provenance

- Telemetry catalog: `fixtures/telemetry/channels.json`
- Catalog schema: `telemforge.telemetry.channels.v1`
- Catalog channels: `10`
- Catalog SHA-256: `fe0a09191f4b04677025887035ad0156627ef73bf6cca5692c8eb775f6dc3daf`

## Comparison Profile

- Stable fields: `schema, stage, health_stage, execution_profile.process_model, execution_profile.client_count, execution_profile.resource_scope, execution_profile.load_shape, resource_guard.worker_processes, resource_guard.uses_network, resource_guard.uses_paid_services, benchmark_contract, determinism_profile.workload_identity, determinism_profile.stable_inputs, latency_budget_profile.budgets, input_provenance.telemetry_catalog_sha256, workload.scenario, workload.sample_window, workload.samples_per_channel, workload.step_seconds, targets, baseline_verdict, runtime_boundary`
- Run-specific fields: `generated_at, metrics.p95_alert_latency_ms, metrics.p95_replay_query_latency_ms, target_results.checks.p95_alert_latency_ms.observed, target_results.checks.p95_replay_query_latency_ms.observed, latency_budget_profile.observed_p95_ms.alert_evaluation, latency_budget_profile.observed_p95_ms.bounded_replay_query`
- Compatibility requirements: `Use the same workload scenario, seed, sample count, and step interval.; Keep execution_profile and resource_guard visible in every report.; Report dropped_event_count explicitly for stream/backpressure comparisons.; Keep determinism_profile.workload_identity unchanged for comparable runs.; Preserve the benchmark metric names before replacing any Python control-plane hot path with a Rust data-plane candidate.; Preserve latency_budget_profile fields so alert and replay headroom remain visible across runtime candidates.; Preserve input_provenance.telemetry_catalog_sha256 so runtime candidates do not compare against a different channel catalog.`

## Metrics

- Aggregate sample rate: `10.0 Hz`
- Per-channel sample rate: `1.0 Hz`
- P95 alert latency: `2.814 ms`
- P95 replay query latency: `3.225 ms`
- Dropped events: `0`

## Target Results

| Metric | Observed | Target | Gap | Result |
| --- | ---: | ---: | ---: | --- |
| Channel count | 10 channels | >= 100 channels | 90 channels | MISS |
| Per-channel sample rate | 1.0 Hz | >= 10 Hz | 9.0 Hz | MISS |
| Aggregate sample rate | 10.0 Hz | >= 1000 Hz | 990.0 Hz | MISS |
| P95 alert latency | 2.814 ms | <= 50 ms | 0 ms | PASS |
| P95 replay query latency | 3.225 ms | <= 500 ms | 0 ms | PASS |
| Dropped events | 0 events | <= 0 events | 0 events | PASS |

Missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`.

## Baseline Verdict

- Status: `baseline_only_targets_not_met`
- Summary: `Current Python/FastAPI baseline is suitable for comparison, not production realtime claims.`
- Passed targets: `p95_alert_latency_ms, p95_replay_query_latency_ms, dropped_event_count`
- Missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`
- Next comparable candidate: `narrow Rust data-plane hot path using the same benchmark_contract, execution_profile, and resource_guard fields`
- Rust scope: `data-plane candidate only; not a whole-project rewrite`

A future Rust data-plane candidate should emit the same JSON report shape, including gap-to-target values, before replacing a Python hot path.
