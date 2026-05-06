# Contract Tests

Stage 02 starts lightweight schema and fixture validation here.

Current test module:

- `test_telemetry_contracts.py`: validates the Stage 02 telemetry schema module and JSON fixtures.
- `test_stage09_live_telemetry_contract.py`: validates the Stage 09
  websocket/live telemetry contract artifact against the channel catalog and
  existing realtime baseline report shape.
- `test_stage09_runtime_stream_evidence_checklist.py`: validates the Stage 09
  runtime-stream evidence checklist validator and its committed JSON summary.

Run the contract test with:

```text
python -m unittest tests/contracts/test_telemetry_contracts.py
python -m unittest tests/contracts/test_stage09_live_telemetry_contract.py
PYTHONPATH=. python tests/contracts/test_stage09_runtime_stream_evidence_checklist.py
```

The tests intentionally stay small: they parse the fixtures, confirm starter subsystem coverage, verify nominal and degraded snapshots use the same channel IDs, check degraded alerts, confirm fault/replay payloads reference known telemetry channels, and keep the Stage 09 live-stream contract bounded before runtime fanout exists.
