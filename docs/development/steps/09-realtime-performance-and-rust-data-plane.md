# Stage 09: Realtime Performance And Rust Data Plane

## Goal

Move TelemForge from reviewable local sandbox toward credible realtime mission
telemetry behavior without prematurely rewriting the whole project.

The stage should produce live streaming and measurable performance evidence.
It should also define the boundary where Rust becomes the intended data-plane
runtime for safety-critical and latency-sensitive telemetry work.

## Decisions To Make

### Streaming Boundary

Option A: add websocket streaming directly in FastAPI

- fastest path to an operator-visible live console
- good for proving product behavior
- may not be the final realtime execution model

Option B: introduce a Rust streaming service immediately

- closer to the serious-runtime direction
- too much coupling before the stream contract and UI behavior are proven

Recommended: start with `Option A`, but define interfaces so the stream source
can later move behind a Rust data-plane boundary.

### Benchmark Strategy

Option A: benchmark only after Rust exists

- delays measurement
- encourages language-first architecture decisions

Option B: benchmark the current Python path first

- creates a baseline
- makes Rust migration evidence-driven

Recommended: `Option B`.

### Rust Migration Boundary

Option A: rewrite the API, storage, and UI integration around Rust

- broad rewrite with high review cost
- risks losing product momentum

Option B: move narrow hot paths to Rust behind stable contracts

- keeps the control plane stable
- gives Rust ownership of telemetry ingest, replay indexing, stream fanout, and
  alert/anomaly evaluation only when needed

Recommended: `Option B`.

## Work Items

- add a websocket telemetry stream for the current simulation/session model
- add reconnect and backpressure behavior that a human can inspect
- add a small load/smoke benchmark for telemetry channel count and sample rate
- measure p95 alert-evaluation latency
- measure bounded replay query latency
- record dropped-event count during a single-client local streaming smoke
- document the Rust data-plane boundary before writing Rust code
- only add a Rust crate after the benchmark envelope and boundary are explicit

## Human Test Gate

A reviewer should be able to:

- start the local backend and frontend
- watch telemetry update live in the console
- run one benchmark command
- read a short report with channel count, sample rate, p95 alert latency, replay
  query latency, dropped-event count, and execution profile
- see which path remains Python control plane and which path is a Rust
  data-plane candidate

Current baseline command:

```text
python3 scripts/benchmark_stage09_realtime.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json --summary-output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-summary.md
```

The generated JSON report and Markdown summary are a Python/FastAPI
control-plane baseline. They keep Rust tracked as the future data-plane
direction for hot paths, not as a whole-project rewrite.

The companion contract artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-telemetry-contract.json`
defines the websocket/live telemetry envelope, reconnect token, backpressure
policy, and dropped-event reporting shape before runtime fanout is implemented.

## Test Preference

Favor:

- small benchmark commands with deterministic synthetic data
- websocket contract tests
- reconnect/backpressure behavior tests
- replay and alert latency checks with bounded windows

Avoid:

- broad rewrites before a benchmark exists
- heavy local load tests that violate the local resource guard
- adding Rust for non-hot-path code just for language consistency

## AI Teaching Agenda

- explain data plane vs control plane
- explain why Rust improves safety and concurrency for hot paths
- explain why benchmarks come before migration
- compare the measured Python baseline against the proposed Rust boundary

## Exit Criteria

- a live stream is visible or testable locally
- benchmark output exists and is documented
- initial realtime targets are explicit
- the Rust migration boundary is documented
- the next stage can either improve the Python baseline or implement one narrow
  Rust hot-path spike with a clear measurement target
