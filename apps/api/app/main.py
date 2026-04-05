from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(
    title="TelemForge API",
    version="0.1.0",
    summary="Template API for synthetic telemetry and mission-operations workflows.",
)

app.include_router(router)

