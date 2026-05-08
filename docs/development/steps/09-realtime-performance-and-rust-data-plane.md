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
policy, dropped-event reporting shape, and deterministic contract validation
vectors before runtime fanout is implemented.

The live contract validator command:

```text
python3 scripts/validate_stage09_live_telemetry_contract.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-live-contract-validation-summary.json
```

checks the contract-only websocket envelope, reconnect vector, backpressure
vector, baseline metric binding, runtime evidence gate, and public proof paths.
It does not open a websocket, claim runtime fanout, or approve a Rust
whole-project rewrite.

The boundary note
`docs/development/artifacts/stage09-realtime-baseline/rust-data-plane-boundary.md`
keeps the first Rust spike constrained to one measured data-plane hot path and
requires a compatible benchmark report before any Python path is replaced.

The compatibility validator command:

```text
python3 scripts/validate_stage09_realtime_report.py --report docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json --contract docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-report-contract.json
```

checks the report/contract gates for required fields, metric bindings, resource
envelope, stream-claim evidence, and promotion targets. It is a contract
validator only; it does not add runtime websocket fanout or approve a Rust
whole-project rewrite.

The verification manifest
`docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-verification-manifest.json`
ties the public baseline report, live telemetry contract, candidate report
contract, validation summary, safe commands, resource envelope, and Rust
data-plane-only scope together with repo-relative paths. It is a review aid for
future Python/FastAPI refreshes or narrow Rust hot-path candidates, not runtime
fanout evidence.

The baseline bundle verifier command:

```text
python3 scripts/verify_stage09_baseline_bundle.py
```

checks that the public report, Markdown summary, validation summary, manifest,
resource envelope, repo-relative paths, and Rust data-plane-only scope still
agree. It is a deterministic review gate; it does not run a load test, add
runtime websocket fanout, or approve a Rust whole-project rewrite.

The baseline readiness summary command:

```text
python3 scripts/summarize_stage09_baseline_readiness.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-readiness-summary.json
```

reads the public Stage 09 artifacts and produces a compact review summary with
the baseline verdict, target pass/miss status, stable fingerprint, blocked
runtime stream claim, and next narrow Rust data-plane candidate. It does not
rerun the benchmark, claim websocket fanout, or approve a Rust whole-project
rewrite.

The candidate promotion-readiness command:

```text
python3 scripts/check_stage09_candidate_promotion_readiness.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-promotion-readiness.json
```

combines the readiness summary, target-gap summary, and runtime stream evidence
checklist into a deterministic gate. It keeps the current Python/FastAPI
baseline and future narrow Rust stream candidates blocked from promotion until
runtime probe evidence exists and missed realtime targets are improved or
explicitly versioned.

The candidate metric-delta command:

```text
python3 scripts/compare_stage09_candidate_metrics.py --candidate-report docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-report.json --output docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-metric-delta.json
```

compares a candidate report's target-result metrics against the public
baseline. The checked-in artifact compares the baseline report to itself, so it
records unchanged metrics and preserves the blocked runtime/promotion gates
without rerunning the benchmark, claiming websocket fanout, or approving a Rust
whole-project rewrite.

The input-provenance validation command:

```text
python3 scripts/validate_stage09_input_provenance.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-input-provenance-validation.json
```

checks that the public baseline report is still bound to the checked-in
telemetry catalog hash, byte count, channel count, workload identity, and
stable report fingerprint. It does not rerun the benchmark, claim websocket
runtime fanout, or approve a Rust whole-project rewrite.

The baseline metric-index command:

```text
python3 scripts/summarize_stage09_baseline_metric_index.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-metric-index.json
```

extracts the public baseline's headline channel count, sample-rate, p95 alert
latency, p95 replay latency, and dropped-event metrics with their target
bindings, stable fingerprint, blocked runtime stream claim, and Rust
data-plane-only scope. It does not rerun the benchmark, claim websocket runtime
fanout, or approve a Rust whole-project rewrite.

The baseline evidence-index command:

```text
python3 scripts/summarize_stage09_baseline_evidence_index.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-evidence-index.json
```

joins the metric index, command-evidence validation, readiness summary, and
promotion-readiness gate into one compact public baseline snapshot. It does not
rerun the benchmark, claim websocket runtime fanout, or approve a Rust
whole-project rewrite.

The baseline digest-index command:

```text
python3 scripts/summarize_stage09_baseline_digest_index.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-digest-index.json
```

pins the committed public Stage 09 report, summary, contracts, validation
outputs, gates, and Rust data-plane boundary note by repo-relative path, byte
size, SHA-256, and aggregate digest. It does not rerun the benchmark, claim
websocket runtime fanout, or approve a Rust whole-project rewrite.

The baseline digest-validation command:

```text
python3 scripts/validate_stage09_baseline_digest_index.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-digest-validation.json
```

recomputes the digest index from current public artifact bytes and checks that
the checked-in digest index has not drifted, does not reference
`docs/automation`, keeps runtime stream claims blocked, and keeps Rust scoped to
a future data-plane candidate rather than a whole-project rewrite.

The baseline closeout-gate command:

```text
python3 scripts/check_stage09_baseline_closeout_gate.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-closeout-gate.json
```

combines digest validation, the baseline evidence index, runtime-stream evidence
validation, and promotion readiness into one deterministic closeout verdict. It
keeps the baseline verified but blocked from promotion until runtime stream
probe evidence exists and missed throughput targets improve or are explicitly
versioned.

The baseline refresh check command:

```text
python3 scripts/check_stage09_baseline_refresh.py
```

runs the bounded Python/FastAPI benchmark in a temporary SQLite database and
compares the fresh stable report fingerprint with the committed public baseline
report. It is a refresh gate for comparable benchmark identity; it ignores
run-specific timing variance and does not claim websocket runtime fanout or
approve a Rust whole-project rewrite.

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
