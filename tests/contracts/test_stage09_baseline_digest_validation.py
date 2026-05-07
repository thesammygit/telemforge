import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.validate_stage09_baseline_digest_index import (
    validate_stage09_baseline_digest_index,
)


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_ROOT = (
    ROOT / "docs" / "development" / "artifacts" / "stage09-realtime-baseline"
)
DIGEST_INDEX_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-index.json"
DIGEST_VALIDATION_PATH = ARTIFACT_ROOT / "stage09-baseline-digest-validation.json"


class Stage09BaselineDigestValidationTest(unittest.TestCase):
    def test_digest_validation_accepts_current_public_index(self) -> None:
        summary = validate_stage09_baseline_digest_index()

        self.assertEqual(
            summary["schema"],
            "telemforge.stage09_baseline_digest_validation.v1",
        )
        self.assertEqual(summary["status"], "passed")
        self.assertGreaterEqual(summary["source_artifact_count"], 20)
        self.assertEqual(
            summary["runtime_claims"]["stream_runtime_claim_status"],
            "contract_only_blocked",
        )
        self.assertFalse(summary["runtime_claims"]["candidate_can_be_promoted"])
        self.assertFalse(summary["public_repo_safety"]["includes_docs_automation"])
        self.assertIn("not a whole-project rewrite", summary["rust_scope"])
        self.assertIn(
            "digest_index_matches_current_public_artifacts",
            summary["verified_gates"],
        )

    def test_public_digest_validation_artifact_matches_current_result(self) -> None:
        summary = validate_stage09_baseline_digest_index()
        artifact = json.loads(DIGEST_VALIDATION_PATH.read_text(encoding="utf-8"))

        self.assertEqual(artifact, summary)
        self.assertFalse(artifact["public_repo_safety"]["uses_private_runtime_state"])

    def test_cli_writes_digest_validation_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_path = Path(tmpdir) / "digest-validation.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_digest_index.py",
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

    def test_rejects_stale_digest_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            stale_path = Path(tmpdir) / "stale-digest-index.json"
            payload = json.loads(DIGEST_INDEX_PATH.read_text(encoding="utf-8"))
            payload["aggregate_digest"]["digest_sha256"] = "0" * 64
            stale_path.write_text(json.dumps(payload), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_digest_index.py",
                    "--digest-index",
                    str(stale_path),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("digest_index.aggregate_digest", completed.stderr)

    def test_rejects_docs_automation_source_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            unsafe_path = Path(tmpdir) / "unsafe-digest-index.json"
            payload = json.loads(DIGEST_INDEX_PATH.read_text(encoding="utf-8"))
            payload["source_artifacts"][0]["path"] = "docs/automation/control.md"
            unsafe_path.write_text(json.dumps(payload), encoding="utf-8")

            completed = subprocess.run(
                [
                    sys.executable,
                    "scripts/validate_stage09_baseline_digest_index.py",
                    "--digest-index",
                    str(unsafe_path),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("docs/automation", completed.stderr)


if __name__ == "__main__":
    unittest.main()
