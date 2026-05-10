# Stage 09 Realtime Target Contract

This artifact binds the Stage 09 benchmark command/report scaffold to the four
headline realtime metrics that future Python/FastAPI refreshes or narrow Rust
data-plane candidates must preserve before metric comparison:

- telemetry sample rate
- p95 alert latency
- p95 replay query latency
- dropped-event count

Generate the contract with:

```text
python3 scripts/summarize_stage09_realtime_target_contract.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract.json
```

Validate the checked-in contract against the current public baseline with:

```text
python3 scripts/validate_stage09_realtime_target_contract.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-contract-validation.json
```

Bind the checked-in contract to the baseline command-evidence scaffold with:

```text
python3 scripts/summarize_stage09_realtime_target_command_binding.py --output docs/development/artifacts/stage09-realtime-target-contract/stage09-realtime-target-command-binding.json
```

The contract and command-binding artifacts are review evidence only. They do
not rerun the benchmark, claim websocket runtime fanout, or approve Rust as a
whole-project rewrite.
