"""Generate a human-readable Stage 09 baseline handoff summary.

This command reads the committed handoff gate and emits a deterministic
Markdown summary. It does not rerun the benchmark, open a websocket, or approve
Rust as a whole-project rewrite.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.check_stage09_baseline_handoff_gate import (  # noqa: E402
    check_stage09_baseline_handoff_gate,
)


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_HANDOFF_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-handoff-gate.json"


class BaselineHandoffSummaryError(Exception):
    """Raised when the handoff summary cannot be generated safely."""


def summarize_stage09_baseline_handoff(
    handoff_gate_path: Path | str = DEFAULT_HANDOFF_GATE_PATH,
) -> str:
    """Build a deterministic Markdown summary from the public handoff gate."""

    handoff_gate_path = Path(handoff_gate_path)
    handoff_gate = _read_json(handoff_gate_path)
    expected_handoff_gate = check_stage09_baseline_handoff_gate()

    errors: list[str] = []
    if handoff_gate != expected_handoff_gate:
        errors.append(
            "handoff gate artifact drifted from current source artifacts; "
            "rerun scripts/check_stage09_baseline_handoff_gate.py first"
        )

    _expect_equal(
        handoff_gate.get("schema"),
        "telemforge.stage09_baseline_handoff_gate.v1",
        "handoff_gate.schema",
        errors,
    )
    _expect_equal(
        handoff_gate.get("status"),
        "baseline_handoff_ready_runtime_blocked",
        "handoff_gate.status",
        errors,
    )
    _expect_equal(
        handoff_gate.get("runtime_claims", {}).get("stream_runtime_claim_status"),
        "contract_only_blocked",
        "runtime stream claim status",
        errors,
    )
    _expect_equal(
        handoff_gate.get("runtime_claims", {}).get("candidate_can_be_promoted"),
        False,
        "candidate_can_be_promoted",
        errors,
    )
    _expect_equal(
        handoff_gate.get("public_repo_safety", {}).get("includes_docs_automation"),
        False,
        "public_repo_safety.includes_docs_automation",
        errors,
    )

    rust_scope = str(handoff_gate.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("handoff gate must keep Rust scoped away from a rewrite")

    if errors:
        raise BaselineHandoffSummaryError("\n".join(errors))

    return _render_markdown(handoff_gate, _display_path(handoff_gate_path))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 realtime baseline handoff gate."
    )
    parser.add_argument(
        "--handoff-gate",
        default=str(DEFAULT_HANDOFF_GATE_PATH.relative_to(ROOT)),
        help="Stage 09 baseline handoff-gate JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional Markdown handoff-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        summary = summarize_stage09_baseline_handoff(args.handoff_gate)
    except (OSError, json.JSONDecodeError, BaselineHandoffSummaryError) as error:
        print(f"Stage 09 baseline handoff summary failed:\n{error}", file=sys.stderr)
        return 1

    if args.output is not None:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(summary, encoding="utf-8")

    print(summary, end="")
    return 0


def _read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise BaselineHandoffSummaryError(f"{_display_path(path)} must be a JSON object")
    return data


def _render_markdown(handoff_gate: dict[str, Any], handoff_gate_path: str) -> str:
    stable_fingerprint = handoff_gate.get("stable_fingerprint", {})
    runtime_claims = handoff_gate.get("runtime_claims", {})
    public_repo_safety = handoff_gate.get("public_repo_safety", {})
    resource_envelope = handoff_gate.get("resource_envelope", {})

    lines = [
        "# Stage 09 Baseline Handoff Summary",
        "",
        f"Status: `{handoff_gate['status']}`",
        f"Verdict: `{handoff_gate['handoff_verdict']}`",
        "",
        "## Source",
        "",
        f"- Handoff gate: `{handoff_gate_path}`",
        f"- Stable fingerprint: `{stable_fingerprint.get('digest_sha256')}`",
        (
            "- Next comparable candidate: "
            f"`{handoff_gate.get('next_comparable_candidate')}`"
        ),
        "",
        "## Metrics",
        "",
        "| Result | Metrics |",
        "| --- | --- |",
        f"| Passed | {_format_values(handoff_gate.get('passed_metrics', []))} |",
        f"| Missed | {_format_values(handoff_gate.get('missed_metrics', []))} |",
        "",
        "## Runtime Promotion",
        "",
        (
            "- Stream runtime claim: "
            f"`{runtime_claims.get('stream_runtime_claim_status')}`"
        ),
        (
            "- Candidate can be promoted: "
            f"`{str(runtime_claims.get('candidate_can_be_promoted')).lower()}`"
        ),
        "",
        "## Blocking Reasons",
        "",
    ]
    lines.extend(f"- `{reason}`" for reason in handoff_gate.get("blocking_reasons", []))
    lines.extend(["", "## Required Next Evidence", ""])
    lines.extend(
        f"- `{evidence}`"
        for evidence in handoff_gate.get("required_next_evidence", [])
    )
    lines.extend(
        [
            "",
            "## Scope",
            "",
            (
                "The handoff approves the committed Python/FastAPI baseline for "
                "review only. It does not claim websocket runtime fanout, "
                "reconnect behavior, backpressure behavior, stream-based "
                "dropped-event measurement, or candidate promotion."
            ),
            "",
            (
                "Rust remains tracked for future data-plane candidates only; "
                "this handoff does not approve a whole-project rewrite."
            ),
            "",
            "## Safety Envelope",
            "",
            (
                f"- Worker processes: `{resource_envelope.get('worker_processes')}`; "
                f"max runtime: `{resource_envelope.get('max_expected_runtime_seconds')}s`; "
                f"max memory: `{resource_envelope.get('max_expected_memory_mb')}MB`"
            ),
            (
                "- Public path safety: "
                f"`paths_are_repo_relative={str(public_repo_safety.get('paths_are_repo_relative')).lower()}`, "
                f"`includes_docs_automation={str(public_repo_safety.get('includes_docs_automation')).lower()}`"
            ),
            "",
        ]
    )
    return "\n".join(lines)


def _format_values(values: Any) -> str:
    if not isinstance(values, list) or not values:
        return "`none`"
    return ", ".join(f"`{value}`" for value in values)


def _expect_equal(
    actual: Any,
    expected: Any,
    label: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"{label} expected {expected!r}, got {actual!r}")


def _display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


if __name__ == "__main__":
    raise SystemExit(main())
