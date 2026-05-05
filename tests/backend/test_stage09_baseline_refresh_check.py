import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.check_stage09_baseline_refresh import check_stage09_baseline_refresh


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
REPORT_PATH = ARTIFACT_ROOT / "stage09-baseline-report.json"
REPORT_DISPLAY_PATH = (
    "docs/development/artifacts/stage09-realtime-baseline/"
    "stage09-baseline-report.json"
)


class Stage09BaselineRefreshCheckTest(unittest.TestCase):
    def test_refresh_check_matches_public_stable_fingerprint(self) -> None:
        result = check_stage09_baseline_refresh(
            report_path=REPORT_PATH,
            alert_iterations=1,
            replay_iterations=1,
        )

        self.assertEqual(
            result["schema"],
            "telemforge.stage09_baseline_refresh_check.v1",
        )
        self.assertEqual(result["status"], "passed")
        self.assertEqual(
            result["report_path"],
            REPORT_DISPLAY_PATH,
        )
        self.assertIn(
            "fresh_run_stable_fingerprint_matches",
            result["verified_gates"],
        )
        self.assertIn(
            "runtime_stream_claim_remains_blocked",
            result["verified_gates"],
        )
        self.assertEqual(
            result["runtime_evidence_gate_status"],
            "contract_only_blocked",
        )
        self.assertIn("not a whole-project rewrite", result["rust_scope"])
        self.assertFalse(result["resource_envelope"]["uses_network"])
        self.assertFalse(result["resource_envelope"]["uses_paid_services"])

    def test_cli_writes_refresh_check_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "stage09-refresh-check.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_baseline_refresh.py",
                    "--alert-iterations",
                    "1",
                    "--replay-iterations",
                    "1",
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
        self.assertEqual(output_payload["status"], "passed")
        self.assertIn(
            "resource_envelope_preserved",
            output_payload["verified_gates"],
        )

    def test_refresh_check_rejects_changed_stable_digest(self) -> None:
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        report["stable_report_fingerprint"]["digest_sha256"] = "bad-digest"

        with tempfile.TemporaryDirectory() as tmpdir:
            bad_report_path = Path(tmpdir) / "bad-report.json"
            bad_report_path.write_text(json.dumps(report), encoding="utf-8")
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/check_stage09_baseline_refresh.py",
                    "--report",
                    str(bad_report_path),
                    "--alert-iterations",
                    "1",
                    "--replay-iterations",
                    "1",
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("stable_report_fingerprint.digest_sha256", completed.stderr)


if __name__ == "__main__":
    unittest.main()
