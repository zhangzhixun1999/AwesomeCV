"""API 基础测试"""


def test_root(client):
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Resume Builder API"


def test_health_check(client):
    """测试健康检查"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_api_docs(client):
    """测试 API 文档可访问"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_redoc(client):
    """测试 ReDoc 可访问"""
    response = client.get("/redoc")
    assert response.status_code == 200
