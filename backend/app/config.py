from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "dev"
    DATABASE_URL: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
    
    @property
    def database_url(self) -> str:
        if self.APP_ENV == "prod" and self.DATABASE_URL:
            return self.DATABASE_URL
        # Development mode - SQLite
        return "sqlite:///./promptcodegen.db"

settings = Settings()