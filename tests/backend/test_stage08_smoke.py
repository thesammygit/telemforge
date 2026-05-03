import tempfile
import unittest
import json
import subprocess
import sys
from pathlib import Path

from scripts.smoke_stage08 import run_stage08_smoke


class Stage08SmokeTest(unittest.TestCase):
    def test_smoke_workflow_exercises_core_backend_paths(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = Path(tmpdir) / "stage08-smoke.sqlite"

            summary = run_stage08_smoke(database_path=database_path)

            self.assertTrue(database_path.exists())
            self.assertEqual(summary["health"]["status"], "ok")
            self.assertEqual(summary["health"]["stage"], "08-hardening-docker-and-release")
            self.assertTrue(summary["session_id"].startswith("tf-session-"))
            self.assertEqual(summary["simulation"]["scenario"], "nominal-orbit-daylight")
            self.assertEqual(summary["simulation"]["row_count"], 20)
            self.assertEqual(summary["fault"]["fault_type"], "thermal_avionics_overheat")
            self.assertEqual(summary["fault"]["status"], "active")
            self.assertGreaterEqual(summary["telemetry_sample_count"], 1)
            self.assertEqual(summary["alert_count"], 1)
            self.assertEqual(summary["event_count"], 3)
            self.assertEqual(summary["replay"]["summary"]["fault_count"], 1)
            self.assertEqual(summary["replay"]["summary"]["anomaly_count"], 1)
            self.assertEqual(summary["anomalies"]["summary"]["anomaly_count"], 1)
            self.assertEqual(
                summary["anomalies"]["summary"]["affected_channel_ids"],
                ["thermal.avionics_temp"],
            )

    def test_smoke_script_runs_directly_from_repo_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = Path(tmpdir) / "stage08-smoke-cli.sqlite"

            result = subprocess.run(
                [
                    sys.executable,
                    "scripts/smoke_stage08.py",
                    "--database",
                    str(database_path),
                ],
                check=False,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            summary = json.loads(result.stdout)
            self.assertEqual(summary["schema"], "telemforge.stage08_smoke.v1")
            self.assertEqual(summary["health"]["stage"], "08-hardening-docker-and-release")
            self.assertTrue(database_path.exists())

    def test_smoke_script_default_database_is_repeatable(self) -> None:
        repo_root = Path.cwd()
        created_paths: list[Path] = []
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                for _ in range(2):
                    result = subprocess.run(
                        [sys.executable, str(repo_root / "scripts/smoke_stage08.py")],
                        cwd=tmpdir,
                        check=False,
                        capture_output=True,
                        text=True,
                    )

                    self.assertEqual(result.returncode, 0, result.stderr)
                    summary = json.loads(result.stdout)
                    self.assertEqual(summary["schema"], "telemforge.stage08_smoke.v1")
                    created_paths.append(Path(summary["database_path"]))
        finally:
            for path in created_paths:
                path.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()
