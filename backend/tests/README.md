# 后端单元测试

## 测试框架

- **pytest**: 测试运行器
- **pytest-cov**: 代码覆盖率
- **httpx**: HTTP 测试客户端（FastAPI TestClient 基于 httpx）

## 测试结构

```
tests/
├── conftest.py          # 测试夹具和配置
├── test_auth.py         # 认证模块测试
├── test_resumes.py      # 简历模块测试
└── test_api.py          # API 基础测试
```

## 运行测试

### 方式 1：使用测试脚本（推荐）

```bash
# Linux / macOS
./run_tests.sh

# Windows CMD
run_tests.bat

# Windows PowerShell
.\run_tests.bat
```

### 方式 2：手动运行

```bash
# 激活虚拟环境
source venv/bin/activate

# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_auth.py

# 运行特定测试
pytest tests/test_auth.py::TestUserRegister::test_register_success

# 详细输出
pytest -v

# 生成覆盖率报告
pytest --cov=app --cov-report=html
```

## 测试覆盖

### 认证模块 (test_auth.py)

- ✅ 用户注册成功
- ✅ 重复邮箱注册
- ✅ 密码过短验证
- ✅ 无效邮箱验证
- ✅ 空姓名验证
- ✅ 用户登录成功
- ✅ 错误邮箱登录
- ✅ 错误密码登录
- ✅ 获取当前用户
- ✅ Token 验证
- ✅ 密码哈希存储

### 简历模块 (test_resumes.py)

- ✅ 创建简历
- ✅ 获取简历列表
- ✅ 获取简历详情
- ✅ 更新简历
- ✅ 删除简历
- ✅ 复制简历
- ✅ 权限控制（用户无法访问/删除他人简历）
- ✅ 未认证访问控制

### API 基础 (test_api.py)

- ✅ 根路径
- ✅ 健康检查
- ✅ API 文档

## 测试夹具

### client
测试客户端，自动管理数据库会话。

### test_db
测试数据库会话，每个测试函数独立。

### test_user_data
测试用户数据：
```python
{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "测试用户"
}
```

### test_user_headers
带认证的请求头：
```python
{
    "Authorization": "Bearer {token}"
}
```

### test_resume_data
测试简历数据（完整结构）。

### test_resume
已创建的测试简历。

## 覆盖率目标

- **目标**: >80%
- **当前**: 运行测试后查看

覆盖率报告位置：`htmlcov/index.html`

## 注意事项

1. **数据库隔离**: 每个测试函数使用独立的临时数据库
2. **自动清理**: 测试结束后自动删除测试数据
3. **并行安全**: 测试设计为可并行运行

## 添加新测试

```python
# tests/test_example.py
def test_example_feature(client, test_user_headers):
    """测试示例功能"""
    response = client.get("/api/some-endpoint", headers=test_user_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
```
