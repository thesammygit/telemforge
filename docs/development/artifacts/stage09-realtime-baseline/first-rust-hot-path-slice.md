# Stage 09 First Rust Hot-Path Slice

This note constrains the first Rust data-plane experiment to one measurable
hot path. It is not approval for a whole-project rewrite, and it does not
replace the current Python/FastAPI control plane.

## Candidate

The first Rust candidate should own stream fanout for the existing live
telemetry contract:

- accept a deterministic ordered telemetry sample stream;
- preserve monotonic `stream_sequence` values for every emitted message;
- serve one local websocket client with bounded queue behavior;
- emit `stream.backpressure` messages when a queue limit is reached;
- report `dropped_event_count` through the same metric binding used by the
  Stage 09 baseline report.

This candidate is deliberately narrower than telemetry ingest, replay indexing,
and alert/anomaly evaluation. Those paths stay behind the existing
Python/FastAPI baseline until their own benchmark evidence exists.

## Stable Inputs

The Rust slice must use the same stable workload identity as the public
baseline:

- benchmark scenario and seed from `stage09-baseline-report.json`;
- telemetry catalog hash from `input_provenance`;
- live stream envelope from `stage09-live-telemetry-contract.json`;
- candidate comparison gates from `stage09-candidate-report-contract.json`.

Changing any of those inputs creates a new workload version and cannot be
compared directly against the current baseline fingerprint.

## Required Evidence

A candidate report is reviewable only when it includes:

- the Stage 09 baseline report schema or an explicitly versioned compatible
  schema;
- `metrics.dropped_event_count`;
- `target_results.checks.dropped_event_count`;
- the same resource envelope: serial local run, no paid services, no external
  network, and no worker fanout beyond the local resource guard;
- live evidence for connection acceptance, startup snapshot delivery,
  monotonic sequence values, reconnect resume, backpressure reporting, and
  dropped-event accounting from stream messages.

The existing compatibility validator remains the public gate before any Rust
timing result is compared with the Python/FastAPI baseline.

## Non-Goals

- no API rewrite;
- no storage rewrite;
- no frontend rewrite;
- no unbounded load test;
- no replacement of replay, alert, or anomaly paths in the first slice.

Rust is tracked here as the future data-plane direction for a measured hot
path, not as a whole-project rewrite.
