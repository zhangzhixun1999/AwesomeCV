"""测试夹具和配置"""
import os
import tempfile
from typing import Generator
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.config import get_settings

# 创建临时测试数据库
TEST_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="function")
def test_engine():
    """创建测试数据库引擎"""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    # 清理测试数据库文件
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture(scope="function")
def test_db(test_engine) -> Generator[Session, None, None]:
    """创建测试数据库会话"""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(test_db: Session):
    """创建测试客户端"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """测试用户数据"""
    return {
        "email": "test@example.com",
        "password": "password123",
        "full_name": "测试用户"
    }


@pytest.fixture
def test_user_headers(client, test_user_data):
    """获取带认证的请求头"""
    # 注册用户
    response = client.post("/api/auth/register", json=test_user_data)
    data = response.json()
    token = data["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_resume_data():
    """测试简历数据"""
    return {
        "title": "算法工程师简历",
        "template_id": "modern",
        "content": {
            "personalInfo": {
                "name": "林徐坤",
                "title": "算法工程师",
                "email": "linxukun@example.com",
                "phone": "+86 138-0000-0001",
                "location": "杭州市余杭区"
            },
            "summary": "阿里巴巴P7算法工程师，专注于大模型研究和应用...",
            "workExperience": [],
            "education": [],
            "skills": ["Python", "PyTorch", "深度学习"],
            "projects": []
        }
    }


@pytest.fixture
def test_resume(client, test_user_headers, test_resume_data):
    """创建测试简历并返回"""
    response = client.post(
        "/api/resumes",
        json=test_resume_data,
        headers=test_user_headers
    )
    return response.json()["data"]
