"""Generate a human-readable Stage 09 baseline closeout summary.

This command reads the committed closeout gate and emits a deterministic
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

from scripts.check_stage09_baseline_closeout_gate import (
    check_stage09_baseline_closeout_gate,
)


ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DEFAULT_CLOSEOUT_GATE_PATH = ARTIFACT_ROOT / "stage09-baseline-closeout-gate.json"


class BaselineCloseoutSummaryError(Exception):
    """Raised when the closeout summary cannot be generated safely."""


def summarize_stage09_baseline_closeout(
    closeout_gate_path: Path | str = DEFAULT_CLOSEOUT_GATE_PATH,
) -> str:
    """Build a deterministic Markdown summary from the public closeout gate."""

    closeout_gate_path = Path(closeout_gate_path)
    closeout_gate = _read_json(closeout_gate_path)
    expected_closeout_gate = check_stage09_baseline_closeout_gate()

    errors: list[str] = []
    if closeout_gate != expected_closeout_gate:
        errors.append(
            "closeout gate artifact drifted from current source artifacts; "
            "rerun scripts/check_stage09_baseline_closeout_gate.py first"
        )

    _expect_equal(
        closeout_gate.get("schema"),
        "telemforge.stage09_baseline_closeout_gate.v1",
        "closeout_gate.schema",
        errors,
    )
    _expect_equal(
        closeout_gate.get("status"),
        "ready_for_stage09_review",
        "closeout_gate.status",
        errors,
    )
    _expect_equal(
        closeout_gate.get("runtime_claims", {}).get("stream_runtime_claim_status"),
        "runtime_verified_bounded_fanout",
        "runtime stream claim status",
        errors,
    )
    _expect_equal(
        closeout_gate.get("runtime_claims", {}).get("candidate_can_be_promoted"),
        True,
        "candidate_can_be_promoted",
        errors,
    )
    _expect_equal(
        closeout_gate.get("public_repo_safety", {}).get("includes_docs_automation"),
        False,
        "public_repo_safety.includes_docs_automation",
        errors,
    )

    rust_scope = str(closeout_gate.get("rust_scope", ""))
    if "not a whole-project rewrite" not in rust_scope:
        errors.append("closeout gate must keep Rust scoped away from a rewrite")

    if errors:
        raise BaselineCloseoutSummaryError("\n".join(errors))

    return _render_markdown(closeout_gate, _display_path(closeout_gate_path))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Summarize the Stage 09 realtime baseline closeout gate."
    )
    parser.add_argument(
        "--closeout-gate",
        default=str(DEFAULT_CLOSEOUT_GATE_PATH.relative_to(ROOT)),
        help="Stage 09 baseline closeout-gate JSON path.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Optional Markdown closeout-summary path to write after validation passes.",
    )
    args = parser.parse_args()

    try:
        summary = summarize_stage09_baseline_closeout(args.closeout_gate)
    except (OSError, json.JSONDecodeError, BaselineCloseoutSummaryError) as error:
        print(f"Stage 09 baseline closeout summary failed:\n{error}", file=sys.stderr)
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
        raise BaselineCloseoutSummaryError(f"{_display_path(path)} must be a JSON object")
    return data


def _render_markdown(closeout_gate: dict[str, Any], closeout_gate_path: str) -> str:
    aggregate_digest = closeout_gate.get("aggregate_digest", {})
    stable_fingerprint = closeout_gate.get("stable_fingerprint", {})
    runtime_claims = closeout_gate.get("runtime_claims", {})
    public_repo_safety = closeout_gate.get("public_repo_safety", {})
    resource_envelope = closeout_gate.get("resource_envelope", {})

    lines = [
        "# Stage 09 Baseline Closeout Summary",
        "",
        f"Status: `{closeout_gate['status']}`",
        f"Verdict: `{closeout_gate['closeout_verdict']}`",
        "",
        "## Source",
        "",
        f"- Closeout gate: `{closeout_gate_path}`",
        f"- Aggregate digest: `{aggregate_digest.get('digest_sha256')}`",
        f"- Stable fingerprint: `{stable_fingerprint.get('digest_sha256')}`",
        "",
        "## Metrics",
        "",
        "| Result | Metrics |",
        "| --- | --- |",
        f"| Passed | {_format_values(closeout_gate.get('passed_metrics', []))} |",
        f"| Missed | {_format_values(closeout_gate.get('missed_metrics', []))} |",
        "",
        "## Runtime Claims",
        "",
        (
            "- Stream runtime claim: "
            f"`{runtime_claims.get('stream_runtime_claim_status')}`"
        ),
        (
            "- Candidate can be promoted: "
            f"`{str(runtime_claims.get('candidate_can_be_promoted')).lower()}`"
        ),
        (
            "- Missing runtime probe evidence count: "
            f"`{closeout_gate.get('missing_runtime_probe_evidence_count')}`"
        ),
        "",
        "## Required Next Evidence",
        "",
    ]
    required_next_evidence = closeout_gate.get("required_next_evidence", [])
    if required_next_evidence:
        lines.extend(f"- `{evidence}`" for evidence in required_next_evidence)
    else:
        lines.append("- `none`")
    lines.extend(
        [
            "",
            "## Scope",
            "",
            (
                "The closeout binds the target-scale Rust stream candidate to "
                "bounded Python/FastAPI websocket runtime evidence. It does "
                "not claim broad production load behavior or replace the "
                "Python control plane."
            ),
            "",
            (
                "Rust remains scoped to a data-plane candidate; this closeout "
                "does not approve a whole-project rewrite."
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
