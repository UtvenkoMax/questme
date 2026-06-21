"""
QuestMe — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api import auth, quests, recommendations, shorts

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="QuestMe — urban quest platform API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(quests.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(shorts.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version}
