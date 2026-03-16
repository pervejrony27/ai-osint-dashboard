from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "OSINT Dashboard"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API Keys (all optional — free fallbacks used when missing)
    SHODAN_API_KEY: Optional[str] = None
    HIBP_API_KEY: Optional[str] = None
    SECURITYTRAILS_API_KEY: Optional[str] = None
    HUNTER_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    # Rate limiting
    SCAN_TIMEOUT: int = 30
    MAX_PORTS_TO_SCAN: int = 100

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()