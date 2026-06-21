"""
QuestMe FastAPI Backend — Configuration

All services run in-memory by default for development.
No external DB or Redis required to start.
Set environment variables to connect to real services.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "QuestMe API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Auth
    secret_key: str = "questme-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Database (optional — runs in-memory if not set)
    database_url: str = ""

    # Redis (optional — runs without cache if not set)
    redis_url: str = ""

    # ML
    ml_model_path: str = "./ml_models"
    openai_api_key: str = ""

    # Storage
    media_upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    # CORS — allow all Expo dev ports
    cors_origins: list[str] = [
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:19000",
        "http://localhost:3000",
    ]

    model_config = {"env_file": ".env", "env_prefix": "QUESTME_"}

    @property
    def use_database(self) -> bool:
        return bool(self.database_url)

    @property
    def use_redis(self) -> bool:
        return bool(self.redis_url)


@lru_cache
def get_settings() -> Settings:
    return Settings()
