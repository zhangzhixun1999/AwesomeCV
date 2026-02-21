"""应用配置"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os


class Settings(BaseSettings):
    """应用配置"""

    # 环境配置
    ENVIRONMENT: str = "development"

    # 数据库
    DATABASE_URL: str = "sqlite:///./resume.db"

    # JWT
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 小时

    # CORS
    FRONTEND_URL: str = "http://localhost:5175"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 开发环境使用默认密钥
        if self.ENVIRONMENT == "development" and not self.SECRET_KEY:
            self.SECRET_KEY = "dev-secret-key-local-only"
        # 生产环境必须有 SECRET_KEY
        elif self.ENVIRONMENT == "production" and not self.SECRET_KEY:
            raise ValueError("SECRET_KEY 环境变量在 production 环境是必需的")


@lru_cache()
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()
