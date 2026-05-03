# Contract Tests

Stage 02 starts lightweight schema and fixture validation here.

Current test module:

- `test_telemetry_contracts.py`: validates the Stage 02 telemetry schema module and JSON fixtures.

Run the contract test with:

```text
python -m unittest tests/contracts/test_telemetry_contracts.py
```

The tests intentionally stay small: they parse the fixtures, confirm starter subsystem coverage, verify nominal and degraded snapshots use the same channel IDs, check degraded alerts, and confirm fault/replay payloads reference known telemetry channels.
