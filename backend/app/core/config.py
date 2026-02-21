"""应用配置"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置"""

    # 环境配置
    ENVIRONMENT: str = "development"

    # 数据库
    DATABASE_URL: str = "sqlite:///./resume.db"

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 小时

    # CORS
    FRONTEND_URL: str = "http://localhost:5175"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()
