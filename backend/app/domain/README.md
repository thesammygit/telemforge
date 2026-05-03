# Backend Domain

This directory holds backend domain behavior that can run without FastAPI, storage, websocket streaming, or frontend code.

Stage 03 adds `telemetry_simulation.py`, a deterministic telemetry spike that consumes the Stage 02 channel catalog and produces small nominal/degraded time-series artifacts for human inspection.

Stage 06 adds `incidents.py`, a deterministic manual-fault domain slice. It supports one thermal fault and one comms fault, generates affected telemetry rows, evaluates threshold-first alerts, and emits event-log entries without FastAPI, storage, websocket streaming, replay, or anomaly dependencies.

Stage 07 adds `replay.py`, a deterministic incident-review slice. It assembles bounded replay payloads from stored telemetry, faults, alerts, and events, then derives explainable nominal-envelope anomaly records without background workers, heavy ML, websocket streaming, or new persistence tables.
