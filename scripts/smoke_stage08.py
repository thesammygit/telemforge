"""Bounded Stage 08 backend smoke workflow.

The smoke path uses FastAPI's in-process TestClient and a caller-selected SQLite
database path so it can run without starting a server or container.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.main import create_app


SMOKE_START_AT = "2026-04-30T21:00:00Z"
SMOKE_FAULT_AT = "2026-04-30T21:00:20Z"
SMOKE_END_AT = "2026-04-30T21:00:30Z"


def run_stage08_smoke(database_path: Path | str | None = None) -> dict[str, Any]:
    """Exercise the current local backend workflow with tiny deterministic data."""

    resolved_database_path = Path(database_path) if database_path is not None else _temp_database_path()
    client = TestClient(create_app(database_path=resolved_database_path))

    health = _expect_json(client.get("/health"), 200, "health check")
    session = _expect_json(
        client.post(
            "/sessions",
            json={"spacecraft_id": "tf-sat-01", "name": "Stage 08 smoke"},
        ),
        201,
        "session creation",
    )
    simulation = _expect_json(
        client.post(
            f"/sessions/{session['session_id']}/simulations",
            json={
                "scenario": "nominal-orbit-daylight",
                "start_at": SMOKE_START_AT,
                "samples": 2,
                "step_seconds": 10,
                "seed": 8080,
            },
        ),
        201,
        "simulation run",
    )
    incident = _expect_json(
        client.post(
            f"/sessions/{session['session_id']}/faults",
            json={
                "fault_type": "thermal_avionics_overheat",
                "requested_at": SMOKE_FAULT_AT,
                "operator_note": "Stage 08 smoke workflow",
            },
        ),
        201,
        "manual fault injection",
    )
    telemetry = _expect_json(
        client.get(
            f"/sessions/{session['session_id']}/telemetry",
            params={"channel_id": "thermal.avionics_temp"},
        ),
        200,
        "telemetry query",
    )
    alerts = _expect_json(
        client.get(f"/sessions/{session['session_id']}/alerts"),
        200,
        "alert query",
    )
    events = _expect_json(
        client.get(f"/sessions/{session['session_id']}/events"),
        200,
        "event query",
    )
    replay = _expect_json(
        client.get(
            f"/sessions/{session['session_id']}/replay",
            params={
                "start_at": SMOKE_START_AT,
                "end_at": SMOKE_END_AT,
                "limit": 100,
            },
        ),
        200,
        "replay query",
    )
    anomalies = _expect_json(
        client.get(
            f"/sessions/{session['session_id']}/anomalies",
            params={
                "start_at": SMOKE_START_AT,
                "end_at": SMOKE_END_AT,
                "limit": 100,
            },
        ),
        200,
        "anomaly query",
    )

    return {
        "schema": "telemforge.stage08_smoke.v1",
        "database_path": str(resolved_database_path),
        "health": health,
        "session_id": session["session_id"],
        "simulation": {
            "run_id": simulation["run_id"],
            "scenario": simulation["scenario"],
            "row_count": simulation["row_count"],
            "samples": simulation["samples"],
        },
        "fault": {
            "fault_id": incident["fault"]["fault_id"],
            "fault_type": incident["fault"]["fault_type"],
            "status": incident["fault"]["status"],
        },
        "telemetry_sample_count": len(telemetry["telemetry"]),
        "alert_count": len(alerts["alerts"]),
        "event_count": len(events["events"]),
        "replay": {
            "schema": replay["schema"],
            "summary": replay["summary"],
        },
        "anomalies": {
            "schema": anomalies["schema"],
            "summary": anomalies["summary"],
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the bounded Stage 08 smoke workflow.")
    parser.add_argument(
        "--database",
        default=None,
        help="Optional SQLite database path for the smoke run. Omit for a fresh temp database.",
    )
    args = parser.parse_args()

    summary = run_stage08_smoke(
        database_path=Path(args.database) if args.database is not None else None
    )
    print(json.dumps(summary, indent=2, sort_keys=True))


def _expect_json(response: Any, status_code: int, action: str) -> dict[str, Any]:
    if response.status_code != status_code:
        raise RuntimeError(
            f"Stage 08 smoke {action} failed: "
            f"expected HTTP {status_code}, got HTTP {response.status_code}: {response.text}"
        )
    body = response.json()
    if not isinstance(body, dict):
        raise RuntimeError(f"Stage 08 smoke {action} returned a non-object response")
    return body


def _temp_database_path() -> Path:
    file_descriptor, path = tempfile.mkstemp(
        prefix="telemforge-stage08-smoke-",
        suffix=".sqlite",
    )
    os.close(file_descriptor)
    return Path(path)


if __name__ == "__main__":
    main()
