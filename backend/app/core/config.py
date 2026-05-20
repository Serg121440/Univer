from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_env: str = os.getenv("APP_ENV", "dev")
    secret_key: str = os.getenv("SECRET_KEY", "change-me")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30  # Shortened for security
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./lms.db")


settings = Settings()
