"""认证模块测试"""
import pytest
from fastapi.testclient import TestClient


class TestUserRegister:
    """用户注册测试"""

    def test_register_success(self, client: TestClient, test_user_data):
        """测试成功注册"""
        response = client.post("/api/auth/register", json=test_user_data)

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["user"]["email"] == test_user_data["email"]
        assert data["data"]["user"]["full_name"] == test_user_data["full_name"]
        assert "id" in data["data"]["user"]
        assert "created_at" in data["data"]["user"]

    def test_register_duplicate_email(self, client: TestClient, test_user_data):
        """测试重复邮箱注册"""
        # 第一次注册
        client.post("/api/auth/register", json=test_user_data)

        # 第二次注册（相同邮箱）
        response = client.post("/api/auth/register", json=test_user_data)

        assert response.status_code == 409
        data = response.json()
        assert data["success"] is False
        assert "邮箱已被注册" in data["error"]["message"]

    def test_register_short_password(self, client: TestClient):
        """测试密码过短"""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "short",
            "full_name": "测试用户"
        })

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False

    def test_register_invalid_email(self, client: TestClient):
        """测试无效邮箱"""
        response = client.post("/api/auth/register", json={
            "email": "invalid-email",
            "password": "password123",
            "full_name": "测试用户"
        })

        assert response.status_code == 422  # Pydantic 验证错误

    def test_register_empty_name(self, client: TestClient):
        """测试空姓名"""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": ""
        })

        assert response.status_code == 400


class TestUserLogin:
    """用户登录测试"""

    def test_login_success(self, client: TestClient, test_user_data):
        """测试成功登录"""
        # 先注册
        client.post("/api/auth/register", json=test_user_data)

        # 再登录
        response = client.post("/api/auth/login", json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["user"]["email"] == test_user_data["email"]

    def test_login_wrong_email(self, client: TestClient):
        """测试错误邮箱"""
        response = client.post("/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "password123"
        })

        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False

    def test_login_wrong_password(self, client: TestClient, test_user_data):
        """测试错误密码"""
        # 先注册
        client.post("/api/auth/register", json=test_user_data)

        # 用错误密码登录
        response = client.post("/api/auth/login", json={
            "email": test_user_data["email"],
            "password": "wrongpassword"
        })

        assert response.status_code == 401

    def test_login_missing_fields(self, client: TestClient):
        """测试缺少字段"""
        response = client.post("/api/auth/login", json={
            "email": "test@example.com"
        })

        assert response.status_code == 422


class TestGetCurrentUser:
    """获取当前用户测试"""

    def test_get_me_success(self, client: TestClient, test_user_headers):
        """测试成功获取当前用户"""
        response = client.get("/api/auth/me", headers=test_user_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == "test@example.com"

    def test_get_me_no_token(self, client: TestClient):
        """测试无 Token"""
        response = client.get("/api/auth/me")

        assert response.status_code == 401  # 无 Bearer token

    def test_get_me_invalid_token(self, client: TestClient):
        """测试无效 Token"""
        response = client.get("/api/auth/me", headers={
            "Authorization": "Bearer invalid_token"
        })

        assert response.status_code == 401


class TestPasswordSecurity:
    """密码安全测试"""

    def test_password_hashing(self, client: TestClient, test_user_data, test_db):
        """测试密码哈希存储"""
        from app.models.user import User

        # 注册用户
        client.post("/api/auth/register", json=test_user_data)

        # 从数据库获取用户
        user = test_db.query(User).filter(User.email == test_user_data["email"]).first()

        # 验证密码已哈希
        assert user.password_hash != test_user_data["password"]
        assert user.password_hash.startswith("$2b$")  # bcrypt 哈希

    def test_token_structure(self, client: TestClient, test_user_data):
        """测试 JWT Token 结构"""
        response = client.post("/api/auth/register", json=test_user_data)
        token = response.json()["data"]["access_token"]

        # JWT 格式：header.payload.signature
        parts = token.split(".")
        assert len(parts) == 3
