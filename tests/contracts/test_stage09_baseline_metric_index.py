import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.summarize_stage09_baseline_metric_index import (
    summarize_stage09_baseline_metric_index,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
MANIFEST_PATH = ARTIFACT_ROOT / "stage09-baseline-verification-manifest.json"
METRIC_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-metric-index.json"


class Stage09BaselineMetricIndexTest(unittest.TestCase):
    def test_metric_index_accepts_current_public_artifacts(self) -> None:
        index = summarize_stage09_baseline_metric_index(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
        )

        self.assertEqual(
            index["schema"],
            "telemforge.stage09_baseline_metric_index.v1",
        )
        self.assertEqual(index["status"], "baseline_metric_index_ready")
        self.assertEqual(index["target_counts"]["total"], 6)
        self.assertEqual(index["target_counts"]["passed"], 3)
        self.assertEqual(index["target_counts"]["missed"], 3)
        self.assertEqual(
            index["headline_metric_order"],
            [
                "channel_count",
                "per_channel_sample_rate_hz",
                "aggregate_sample_rate_hz",
                "p95_alert_latency_ms",
                "p95_replay_query_latency_ms",
                "dropped_event_count",
            ],
        )
        self.assertEqual(
            index["runtime_stream_claim_status"],
            "contract_only_blocked",
        )
        self.assertEqual(
            index["next_comparable_candidate"],
            "rust_stream_fanout_sample_rate_spike",
        )
        self.assertIn("not a whole-project rewrite", index["rust_scope"])
        self.assertFalse(index["public_repo_safety"]["includes_docs_automation"])

    def test_public_metric_index_artifact_matches_current_result(self) -> None:
        index = summarize_stage09_baseline_metric_index(
            report_path=REPORT_PATH,
            manifest_path=MANIFEST_PATH,
        )
        artifact = json.loads(METRIC_INDEX_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, index)
        self.assertFalse(
            any(
                "docs/automation" in value
                for value in artifact.values()
                if isinstance(value, str)
            )
        )

    def test_cli_writes_metric_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "metric-index.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_metric_index.py",
                    "--output",
                    str(output_path),
                ],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )

            stdout_payload = json.loads(completed.stdout)
            output_payload = json.loads(output_path.read_text(encoding="utf-8"))

        self.assertEqual(output_payload, stdout_payload)
        self.assertEqual(output_payload["status"], "baseline_metric_index_ready")

    def test_rejects_metric_binding_drift(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        report["metrics"]["p95_alert_latency_ms"] = 999

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report = Path(tmpdir) / "bad-report.json"
            bad_report.write_text(json.dumps(report), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/summarize_stage09_baseline_metric_index.py",
                    "--report",
                    str(bad_report),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn(
            "p95_alert_latency_ms observed value does not match",
            completed.stderr,
        )


if __name__ == "__main__":
    unittest.main()
