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
defines the websocket/live telemetry envelope, reconnect token, per-connection
backpressure policy, dropped-event reporting shape, bounded two-client fanout
proof, and deterministic contract validation vectors.

The live contract validator command:

```text
python3 scripts/validate_stage09_live_telemetry_contract.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-live-contract-validation-summary.json
```

checks the contract-only websocket envelope, reconnect vector, backpressure
vector, baseline metric binding, runtime evidence gate, and public proof paths.
It does not open a websocket, claim runtime fanout, or approve a Rust
whole-project rewrite.

The first runtime websocket probe artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-first-snapshot.json`
records the narrow acceptance proof for
`python3 -m unittest discover -s tests/backend -p 'test_stage09_live_stream.py'`.
That probe proves only existing-session connection acceptance, a first
`stream.snapshot` envelope, and a first per-session sequence value of `1`.
Reconnect resume, backpressure, dropped-event stream reporting, sustained
fanout, and Rust promotion claims remain blocked until later Stage 09 runtime
probes land.

The follow-on runtime websocket probe artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-monotonic-sequence.json`
records the next narrow acceptance proof for the same focused backend test. It
proves a same-session `telemetry.sample` arrives after the startup snapshot
with a strictly greater stream `sequence` value while reconnect resume,
backpressure, dropped-event stream reporting, sustained fanout, and Rust
promotion claims remain blocked.

The reconnect-resume runtime websocket probe artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-reconnect-resume.json`
records the next narrow acceptance proof for the same focused backend test. It
proves reconnecting with `after_sequence=1` resumes with a contract-compatible
`telemetry.sample` whose per-session stream `sequence` is greater than the
requested value, and that reconnecting outside the retained window falls back
to `stream.snapshot` before follow-on delivery. Backpressure, dropped-event
stream reporting, sustained fanout, and Rust promotion claims remain blocked.

The backpressure and dropped-event runtime websocket probe artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-backpressure-dropped-events.json`
records the follow-on bounded slow-client proof for the same focused backend
test. It proves the single-client runtime path emits `stream.backpressure` with
`drop_oldest_and_report`, the contract queue depth of `250`, a positive
`dropped_event_count` sourced from queued telemetry rows, and monotonic
delivered stream `sequence` values.

The bounded fanout runtime websocket probe artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-bounded-fanout-smoke.json`
records the two-client proof for the focused backend test. It proves two
simultaneous clients on one session each receive independent per-connection
`stream.snapshot`, `stream.backpressure`, and retained `telemetry.sample`
messages without shared queue state or dropped-event leakage. Sustained
multi-client load, candidate promotion readiness, and Rust replacement claims
remain blocked until target evidence improves.

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
the baseline verdict, target pass/miss status, stable fingerprint, bounded
runtime stream proof status, and next narrow Rust data-plane candidate. It does
not rerun the benchmark, claim sustained websocket fanout, or approve a Rust
whole-project rewrite.

The candidate promotion-readiness command:

```text
python3 scripts/check_stage09_candidate_promotion_readiness.py --candidate-report docs/development/artifacts/stage09-realtime-baseline/stage09-rust-stream-fanout-sample-rate-report.json --sustained-load-evidence docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-sustained-load.json --output docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-promotion-readiness.json
```

combines the readiness summary, target-gap summary, and runtime stream evidence
checklist with the explicit Rust candidate report and sustained-load websocket
evidence into a deterministic gate. The checked-in artifact now marks the
target-scale candidate ready for Stage 09 review because target metrics pass,
bounded runtime stream proof remains verified, sustained-load evidence is
present, and Rust remains scoped to the data plane.

The candidate metric-delta command:

```text
python3 scripts/compare_stage09_candidate_metrics.py --candidate-report docs/development/artifacts/stage09-realtime-baseline/stage09-rust-stream-fanout-sample-rate-report.json --promotion-readiness docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-promotion-readiness.json --output docs/development/artifacts/stage09-realtime-baseline/stage09-candidate-metric-delta.json
```

compares a candidate report's target-result metrics against the public
baseline. The checked-in artifact now compares the target-scale Rust stream
fanout report against the Python/FastAPI baseline: channel count,
per-channel sample rate, and aggregate sample rate are newly passing, while
promotion readiness is now true for Stage 09 review because the sustained-load
websocket smoke binds the target-scale candidate to bounded live runtime
evidence.

The target-scale bounded Rust stream fanout/sample-rate candidate command:

```text
python3 scripts/run_stage09_rust_stream_fanout_candidate.py --target-scale --output docs/development/artifacts/stage09-realtime-baseline/stage09-rust-stream-fanout-sample-rate-report.json
```

runs the standard-library-only Rust spike under
`rust/stage09_stream_fanout_sample_rate/` and writes a Stage 09-compatible
candidate report. The candidate records a versioned workload change from the
Python/FastAPI baseline, reaches 100 channels, 10 Hz per channel, 1000 Hz
aggregate sample rate, and zero dropped events inside the bounded local
resource envelope. It is still a deterministic smoke, not a production fanout
claim; promotion depends on the separate sustained-load runtime evidence that
binds the target-scale candidate to live websocket behavior.

The bounded sustained-load websocket smoke command:

```text
python3 scripts/run_stage09_live_stream_sustained_load_smoke.py --candidate-report docs/development/artifacts/stage09-realtime-baseline/stage09-rust-stream-fanout-sample-rate-report.json --output docs/development/artifacts/stage09-realtime-baseline/stage09-live-stream-sustained-load.json
```

opens four simultaneous FastAPI `TestClient` websocket connections in one
process, reads twelve ordered stream messages per client, records per-client
backpressure/drop accounting, and binds the result to the checked-in
target-scale Rust candidate report by repo-relative path and SHA-256. This is a
bounded local proof under the 30 second / 512 MB / no-network resource guard. It
is not a broad load test, production fanout claim, or Python control-plane
replacement.

The live-console stream binding artifact
`docs/development/artifacts/stage09-realtime-baseline/stage09-live-console-stream-binding.json`
records the bounded frontend handoff from the existing websocket contract into
the operator mission console. The binding is enabled only by explicit local
`VITE_TELEMFORGE_API_BASE_URL` and `VITE_TELEMFORGE_LIVE_SESSION_ID`
configuration, keeps the Stage 07 fixture-backed review path as the default
fallback, consumes `stream.snapshot`, `telemetry.sample`, and
`stream.backpressure` without changing backend envelope semantics, and does not
claim production fanout, live operations, or Rust replacement.

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
`docs/automation`, preserves bounded runtime stream proof status, and keeps Rust
scoped to a future data-plane candidate rather than a whole-project rewrite.

The baseline closeout-gate command:

```text
python3 scripts/check_stage09_baseline_closeout_gate.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-closeout-gate.json
```

combines digest validation, the baseline evidence index, runtime-stream evidence
validation, and promotion readiness into one deterministic closeout verdict. It
now records `ready_for_stage09_review` when the target-scale candidate metrics,
runtime-stream proof, sustained-load evidence, public path safety, and Rust
data-plane scope all pass. It still does not claim production fanout or approve
a whole-project rewrite.

The baseline closeout-summary command:

```text
python3 scripts/summarize_stage09_baseline_closeout.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-closeout-summary.md
```

renders the closeout gate into a human-readable report with the verified
baseline digest, passed metrics, runtime claims, promotion readiness, local
resource envelope, and Rust data-plane-only scope. It does not rerun the
benchmark, claim production websocket fanout, or approve a Rust whole-project
rewrite.

The target-result artifact-gate command:

```text
python3 scripts/check_stage09_target_result_artifact_gate.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-target-result-artifact-gate.json
```

cross-checks each headline metric across the baseline report, metric index,
target-gap summary, target-result binding gate, and closeout gate. It does not
rerun the benchmark, claim websocket runtime fanout, or approve a Rust
whole-project rewrite.

The baseline acceptance-matrix command:

```text
python3 scripts/summarize_stage09_baseline_acceptance_matrix.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-acceptance-matrix.json
```

condenses the benchmark command/report, headline target bindings, live stream
contract, runtime-stream evidence blocker, Rust data-plane boundary, and public
repo hygiene into one deterministic review artifact. It does not rerun the
benchmark, claim websocket runtime fanout, or approve a Rust whole-project
rewrite.

The baseline review-packet command:

```text
python3 scripts/summarize_stage09_baseline_review_packet.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-review-packet.json
```

ties the acceptance matrix, closeout gate, command evidence, stable fingerprint,
runtime blocker, and next narrow Rust data-plane candidate into one public-safe
handoff artifact. It does not rerun the benchmark, claim websocket runtime
fanout, or approve a Rust whole-project rewrite.

The baseline review-packet validation command:

```text
python3 scripts/validate_stage09_baseline_review_packet.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-review-packet-validation.json
```

checks that the checked-in review packet still matches the current acceptance
matrix, closeout gate, command evidence, public path hygiene, blocked runtime
claims, and Rust data-plane-only scope. It does not rerun the benchmark, claim
websocket runtime fanout, or approve a Rust whole-project rewrite.

The baseline handoff-gate command:

```text
python3 scripts/check_stage09_baseline_handoff_gate.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-handoff-gate.json
```

ties the public review packet, review-packet validation, refresh check, and
command evidence into one deterministic review signal. It keeps the
Python/FastAPI baseline ready for review while blocking promotion until target
evidence improves, and it preserves Rust as a future data-plane candidate rather
than a whole-project rewrite.

The baseline handoff-summary command:

```text
python3 scripts/summarize_stage09_baseline_handoff.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-handoff-summary.md
```

renders the handoff gate into a human-readable report with the review verdict,
stable fingerprint, passed/missed metrics, runtime promotion blocker, required
next evidence, local resource envelope, and Rust data-plane-only scope. It does
not rerun the benchmark, claim websocket runtime fanout, or approve a Rust
whole-project rewrite.

The baseline artifact-index command:

```text
python3 scripts/summarize_stage09_baseline_artifact_index.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-artifact-index.json
```

checks that the public Stage 09 baseline README still indexes every checked-in
artifact in the baseline bundle, records each artifact hash, binds the
benchmark scaffold to the command-evidence resource envelope, excludes
`docs/automation`, and preserves the blocked runtime-stream claim and Rust
data-plane-only scope. It does not rerun the benchmark, claim websocket runtime
fanout, or approve a Rust whole-project rewrite.

The baseline command-matrix command:

```text
python3 scripts/summarize_stage09_baseline_command_matrix.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-command-matrix.json
```

binds the safe Stage 09 benchmark command to its report outputs and key
validation commands. It checks headline metric bindings, public repo-relative
outputs, the single-worker/no-network resource envelope, blocked runtime stream
claims, and Rust data-plane-only scope without rerunning the benchmark,
claiming websocket runtime fanout, or approving a Rust whole-project rewrite.

The baseline command-matrix validation command:

```text
python3 scripts/validate_stage09_baseline_command_matrix.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-baseline-command-matrix-validation.json
```

recomputes the command matrix from current public Stage 09 sources and checks
that the committed matrix still matches byte-for-byte, then leaves a public
validation summary artifact. It uses repo-relative public artifact outputs,
excludes `docs/automation`, keeps sustained runtime stream claims target-gated,
and keeps Rust scoped to a future data-plane candidate rather than a
whole-project rewrite.

The artifact-index command-evidence binding command:

```text
python3 scripts/summarize_stage09_artifact_index_command_evidence_binding.py --output docs/development/artifacts/stage09-baseline-command-evidence-binding/stage09-baseline-artifact-index-command-evidence-binding.json
```

checks that the public Stage 09 baseline artifact index and command-evidence
scaffold still describe the same bounded benchmark command, required outputs,
resource envelope, bounded runtime-stream proof status, and Rust data-plane-only
scope. It does not rerun the benchmark, claim websocket runtime fanout, or
approve a Rust whole-project rewrite.

The realtime target-contract command:

```text
python3 scripts/summarize_stage09_realtime_target_contract.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract.json
```

binds the safe benchmark command/report scaffold to the four headline Stage 09
metrics: telemetry sample rate, p95 alert latency, p95 replay query latency,
and dropped-event count. It keeps promotion blocked on target evidence, requires
public repo-relative paths, and preserves Rust as a future data-plane candidate
rather than a whole-project rewrite.

The realtime target-contract validation command:

```text
python3 scripts/validate_stage09_realtime_target_contract.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract-validation.json
```

recomputes the target contract from the current public baseline and checks that
the checked-in artifact still matches byte-for-byte, pins the four headline
metric bindings, excludes `docs/automation`, keeps runtime stream claims
blocked, and keeps Rust scoped to a future data-plane candidate rather than a
whole-project rewrite.

The realtime target-command binding command:

```text
python3 scripts/summarize_stage09_realtime_target_command_binding.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-command-binding.json
```

checks that the realtime target contract and baseline command-evidence artifact
still describe the same bounded benchmark command, required report outputs,
resource envelope, four headline metrics, blocked runtime-stream claim, and
Rust data-plane-only scope. It does not rerun the benchmark, claim websocket
runtime fanout, or approve a Rust whole-project rewrite.

The runtime-stream proof-artifact gate command:

```text
python3 scripts/check_stage09_runtime_stream_proof_artifacts.py --output docs/development/artifacts/stage09-realtime-baseline/stage09-runtime-stream-proof-artifact-gate.json
```

checks that the live telemetry contract and runtime-stream evidence checklist
still point at existing public, repo-relative proof artifacts and writes the
reviewable gate artifact before websocket fanout, reconnect, backpressure,
stream dropped-event reporting, or a narrow Rust stream candidate can be
claimed. It does not open a websocket, rerun the benchmark, or approve a Rust
whole-project rewrite.

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
