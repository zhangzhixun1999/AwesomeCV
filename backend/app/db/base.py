"""SQLAlchemy Base"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from app.core.config import get_settings

settings = get_settings()

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite 需要
)

# 声明基类
Base = declarative_base()
