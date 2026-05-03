# Stage 09 Realtime Baseline Summary

Generated at: `2026-05-03T20:53:19Z`

Runtime direction: Rust data plane direction, not a whole-project rewrite. Python/FastAPI remains the measured control-plane baseline for this report.

## Workload

- Scenario: `nominal-orbit-daylight`
- Channels: `10`
- Samples per channel: `10`
- Sample window: `2026-05-03T16:00:00Z` to `2026-05-03T16:00:09Z`
- Telemetry rows written: `100`

## Metrics

- Aggregate sample rate: `10.0 Hz`
- Per-channel sample rate: `1.0 Hz`
- P95 alert latency: `2.565 ms`
- P95 replay query latency: `2.971 ms`
- Dropped events: `0`

## Target Results

| Metric | Observed | Target | Result |
| --- | ---: | ---: | --- |
| Channel count | 10 channels | >= 100 channels | MISS |
| Per-channel sample rate | 1.0 Hz | >= 10 Hz | MISS |
| Aggregate sample rate | 10.0 Hz | >= 1000 Hz | MISS |
| P95 alert latency | 2.565 ms | <= 50 ms | PASS |
| P95 replay query latency | 2.971 ms | <= 500 ms | PASS |
| Dropped events | 0 events | <= 0 events | PASS |

Missed targets: `channel_count, per_channel_sample_rate_hz, aggregate_sample_rate_hz`.

A future Rust data-plane candidate should emit the same JSON report shape and this summary before replacing a Python hot path.
