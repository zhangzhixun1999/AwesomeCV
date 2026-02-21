"""简历模块测试"""
import pytest
from fastapi.testclient import TestClient


class TestCreateResume:
    """创建简历测试"""

    def test_create_resume_success(self, client: TestClient, test_user_headers, test_resume_data):
        """测试成功创建简历"""
        response = client.post(
            "/api/resumes",
            json=test_resume_data,
            headers=test_user_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == test_resume_data["title"]
        assert data["data"]["template_id"] == test_resume_data["template_id"]
        assert data["data"]["content"]["personalInfo"]["name"] == "林徐坤"
        assert "id" in data["data"]
        assert "created_at" in data["data"]

    def test_create_resume_unauthorized(self, client: TestClient, test_resume_data):
        """测试未认证创建简历"""
        response = client.post("/api/resumes", json=test_resume_data)

        assert response.status_code == 401

    def test_create_resume_invalid_data(self, client: TestClient, test_user_headers):
        """测试无效数据"""
        response = client.post(
            "/api/resumes",
            json={"title": ""},  # 缺少必填字段
            headers=test_user_headers
        )

        assert response.status_code == 422


class TestGetResumes:
    """获取简历列表测试"""

    def test_get_resumes_empty(self, client: TestClient, test_user_headers):
        """测试获取空列表"""
        response = client.get("/api/resumes", headers=test_user_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []

    def test_get_resumes_with_data(self, client: TestClient, test_user_headers, test_resume):
        """测试获取简历列表"""
        response = client.get("/api/resumes", headers=test_user_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["title"] == test_resume["title"]

    def test_get_resumes_unauthorized(self, client: TestClient):
        """测试未认证获取列表"""
        response = client.get("/api/resumes")

        assert response.status_code == 401


class TestGetResumeDetail:
    """获取简历详情测试"""

    def test_get_resume_success(self, client: TestClient, test_user_headers, test_resume):
        """测试成功获取简历详情"""
        resume_id = test_resume["id"]
        response = client.get(f"/api/resumes/{resume_id}", headers=test_user_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == resume_id
        assert data["data"]["content"]["personalInfo"]["name"] == "林徐坤"

    def test_get_resume_not_found(self, client: TestClient, test_user_headers):
        """测试获取不存在的简历"""
        response = client.get("/api/resumes/99999", headers=test_user_headers)

        assert response.status_code == 404

    def test_get_resume_unauthorized(self, client: TestClient, test_resume):
        """测试未认证获取详情"""
        resume_id = test_resume["id"]
        response = client.get(f"/api/resumes/{resume_id}")

        assert response.status_code == 401


class TestUpdateResume:
    """更新简历测试"""

    def test_update_resume_success(self, client: TestClient, test_user_headers, test_resume):
        """测试成功更新简历"""
        resume_id = test_resume["id"]
        updated_data = {
            **test_resume,
            "title": "更新后的简历",
            "content": {
                "personalInfo": {"name": "林徐坤"},
                "summary": "",
                "workExperience": [],
                "education": [],
                "skills": [],
                "projects": []
            }
        }

        response = client.put(
            f"/api/resumes/{resume_id}",
            json=updated_data,
            headers=test_user_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == "更新后的简历"

    def test_update_resume_not_found(self, client: TestClient, test_user_headers, test_resume_data):
        """测试更新不存在的简历"""
        response = client.put(
            "/api/resumes/99999",
            json=test_resume_data,
            headers=test_user_headers
        )

        assert response.status_code == 404


class TestDeleteResume:
    """删除简历测试"""

    def test_delete_resume_success(self, client: TestClient, test_user_headers, test_resume):
        """测试成功删除简历"""
        resume_id = test_resume["id"]
        response = client.delete(f"/api/resumes/{resume_id}", headers=test_user_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] is None

        # 验证简历已删除
        get_response = client.get(f"/api/resumes/{resume_id}", headers=test_user_headers)
        assert get_response.status_code == 404

    def test_delete_resume_not_found(self, client: TestClient, test_user_headers):
        """测试删除不存在的简历"""
        response = client.delete("/api/resumes/99999", headers=test_user_headers)

        assert response.status_code == 404


class TestDuplicateResume:
    """复制简历测试"""

    def test_duplicate_resume_success(self, client: TestClient, test_user_headers, test_resume):
        """测试成功复制简历"""
        resume_id = test_resume["id"]

        response = client.post(
            f"/api/resumes/{resume_id}/duplicate",
            json={"title": "简历副本"},
            headers=test_user_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == "简历副本"
        assert data["data"]["id"] != resume_id  # 新简历 ID 不同

        # 验证原简历仍然存在
        get_response = client.get(f"/api/resumes/{resume_id}", headers=test_user_headers)
        assert get_response.status_code == 200

    def test_duplicate_resume_default_title(self, client: TestClient, test_user_headers, test_resume):
        """测试复制简历使用默认标题"""
        resume_id = test_resume["id"]

        response = client.post(
            f"/api/resumes/{resume_id}/duplicate",
            json={},  # 不提供标题
            headers=test_user_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert "副本" in data["data"]["title"]

    def test_duplicate_resume_not_found(self, client: TestClient, test_user_headers):
        """测试复制不存在的简历"""
        response = client.post(
            "/api/resumes/99999/duplicate",
            json={},
            headers=test_user_headers
        )

        assert response.status_code == 404


class TestResumePermissions:
    """简历权限测试"""

    def test_user_cannot_access_other_resume(self, client: TestClient):
        """测试用户无法访问其他用户的简历"""
        # 创建用户1并登录
        user1_data = {"email": "user1@example.com", "password": "password123", "full_name": "用户1"}
        client.post("/api/auth/register", json=user1_data)
        login1 = client.post("/api/auth/login", json={"email": user1_data["email"], "password": user1_data["password"]})
        token1 = login1.json()["data"]["access_token"]

        # 创建简历
        resume_response = client.post(
            "/api/resumes",
            json={
                "title": "用户1的简历",
                "template_id": "modern",
                "content": {"personalInfo": {}, "workExperience": [], "education": [], "skills": [], "projects": []}
            },
            headers={"Authorization": f"Bearer {token1}"}
        )
        resume_id = resume_response.json()["data"]["id"]

        # 创建用户2并尝试访问用户1的简历
        user2_data = {"email": "user2@example.com", "password": "password123", "full_name": "用户2"}
        client.post("/api/auth/register", json=user2_data)
        login2 = client.post("/api/auth/login", json={"email": user2_data["email"], "password": user2_data["password"]})
        token2 = login2.json()["data"]["access_token"]

        # 用户2尝试获取用户1的简历
        response = client.get(
            f"/api/resumes/{resume_id}",
            headers={"Authorization": f"Bearer {token2}"}
        )

        assert response.status_code == 403  # 禁止访问

    def test_user_cannot_delete_other_resume(self, client: TestClient):
        """测试用户无法删除其他用户的简历"""
        # 创建用户1并登录
        user1_data = {"email": "user1@example.com", "password": "password123", "full_name": "用户1"}
        client.post("/api/auth/register", json=user1_data)
        login1 = client.post("/api/auth/login", json={"email": user1_data["email"], "password": user1_data["password"]})
        token1 = login1.json()["data"]["access_token"]

        # 创建简历
        resume_response = client.post(
            "/api/resumes",
            json={
                "title": "用户1的简历",
                "template_id": "modern",
                "content": {"personalInfo": {}, "workExperience": [], "education": [], "skills": [], "projects": []}
            },
            headers={"Authorization": f"Bearer {token1}"}
        )
        resume_id = resume_response.json()["data"]["id"]

        # 创建用户2并尝试删除用户1的简历
        user2_data = {"email": "user2@example.com", "password": "password123", "full_name": "用户2"}
        client.post("/api/auth/register", json=user2_data)
        login2 = client.post("/api/auth/login", json={"email": user2_data["email"], "password": user2_data["password"]})
        token2 = login2.json()["data"]["access_token"]

        # 用户2尝试删除用户1的简历
        response = client.delete(
            f"/api/resumes/{resume_id}",
            headers={"Authorization": f"Bearer {token2}"}
        )

        assert response.status_code == 403  # 禁止访问
