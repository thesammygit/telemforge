# Stage 09 Baseline Command Evidence Binding

This artifact verifies that the public Stage 09 baseline artifact index and the
command-evidence scaffold still describe the same bounded benchmark command,
required report outputs, local resource envelope, blocked runtime stream claim,
and Rust data-plane-only scope.

It is intentionally separate from the baseline bundle digest chain. It does not
rerun the benchmark, open a websocket, claim runtime fanout, or approve a Rust
whole-project rewrite.

## Inspect

```text
python3 scripts/summarize_stage09_artifact_index_command_evidence_binding.py --output docs/development/artifacts/stage09-baseline-command-evidence-binding/stage09-baseline-artifact-index-command-evidence-binding.json
python3 -m unittest tests/contracts/test_stage09_artifact_index_command_evidence_binding.py
```
