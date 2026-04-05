from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "telemforge-api-template"}


@router.get("/meta")
def meta() -> dict[str, list[dict[str, str]] | str]:
    return {
        "project": "TelemForge",
        "capabilities": [
            {
                "name": "simulation",
                "description": "Advance subsystem state and mission mode over time.",
            },
            {
                "name": "telemetry",
                "description": "Publish channelized telemetry and alert events.",
            },
            {
                "name": "replay-and-anomaly",
                "description": "Review prior runs and surface anomaly indicators.",
            },
        ],
    }

