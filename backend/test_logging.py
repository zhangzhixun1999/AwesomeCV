#!/usr/bin/env python3
"""日志功能测试脚本"""
import os
import sys
import time
import requests
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

BASE_URL = "http://localhost:8000"


def print_section(title):
    """打印分节标题"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def test_logging():
    """测试日志功能"""

    print_section("日志功能测试")

    # 1. 检查后端是否运行
    print("\n1️⃣  检查后端服务状态...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ 后端服务正常运行")
        else:
            print("   ❌ 后端服务状态异常")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ 无法连接到后端服务: {e}")
        print("   💡 请先启动后端: cd backend && python -m uvicorn app.main:app --reload")
        return False

    # 2. 注册测试用户
    print("\n2️⃣  注册测试用户...")
    test_user = {
        "email": f"test_{int(time.time())}@example.com",
        "password": "test123456",
        "full_name": "测试用户"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=test_user)
        if response.status_code == 201:
            print(f"   ✅ 用户注册成功: {test_user['email']}")
            token = response.json()["data"]["access_token"]
        else:
            print(f"   ⚠️  注册失败，尝试使用已有用户登录")
            # 尝试登录已有用户
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "test@example.com",
                "password": "password123"
            })
            if response.status_code == 200:
                token = response.json()["data"]["access_token"]
                print("   ✅ 登录成功")
            else:
                print("   ❌ 登录失败")
                return False
    except Exception as e:
        print(f"   ❌ 注册/登录失败: {e}")
        return False

    headers = {"Authorization": f"Bearer {token}"}

    # 3. 创建简历（应该产生日志）
    print("\n3️⃣  创建简历...")
    resume_data = {
        "title": "测试简历 - 验证日志功能",
        "template_id": "modern",
        "content": {
            "personalInfo": {
                "name": "林徐坤",
                "title": "算法工程师",
                "email": "test@example.com",
                "phone": "+86 138-0000-0000",
                "location": "杭州市"
            },
            "summary": "测试日志功能",
            "workExperience": [],
            "education": [],
            "skills": ["Python", "FastAPI"],
            "projects": []
        }
    }

    try:
        response = requests.post(f"{BASE_URL}/api/resumes", json=resume_data, headers=headers)
        if response.status_code == 201:
            resume_id = response.json()["data"]["id"]
            print(f"   ✅ 简历创建成功: ID={resume_id}")
        else:
            print(f"   ❌ 创建失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ 创建简历失败: {e}")
        return False

    # 4. 获取简历列表（应该产生日志）
    print("\n4️⃣  获取简历列表...")
    try:
        response = requests.get(f"{BASE_URL}/api/resumes", headers=headers)
        if response.status_code == 200:
            count = len(response.json()["data"])
            print(f"   ✅ 获取成功: 共 {count} 个简历")
        else:
            print(f"   ❌ 获取失败: {response.status_code}")
    except Exception as e:
        print(f"   ❌ 获取简历列表失败: {e}")

    # 5. 更新简历（应该产生日志）
    print("\n5️⃣  更新简历...")
    resume_data["title"] = "测试简历 - 已更新（验证日志）"
    try:
        response = requests.put(f"{BASE_URL}/api/resumes/{resume_id}", json=resume_data, headers=headers)
        if response.status_code == 200:
            print(f"   ✅ 更新成功")
        else:
            print(f"   ❌ 更新失败: {response.status_code}")
    except Exception as e:
        print(f"   ❌ 更新简历失败: {e}")

    # 6. 复制简历（应该产生日志）
    print("\n6️⃣  复制简历...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/resumes/{resume_id}/duplicate",
            json={"title": "测试简历 - 副本"},
            headers=headers
        )
        if response.status_code == 201:
            new_id = response.json()["data"]["id"]
            print(f"   ✅ 复制成功: 新ID={new_id}")
        else:
            print(f"   ❌ 复制失败: {response.status_code}")
    except Exception as e:
        print(f"   ❌ 复制简历失败: {e}")

    # 7. 删除简历（应该产生日志）
    print("\n7️⃣  删除简历...")
    try:
        response = requests.delete(f"{BASE_URL}/api/resumes/{resume_id}", headers=headers)
        if response.status_code == 200:
            print(f"   ✅ 删除成功")
        else:
            print(f"   ❌ 删除失败: {response.status_code}")
    except Exception as e:
        print(f"   ❌ 删除简历失败: {e}")

    # 8. 检查日志文件
    print_section("检查日志文件")

    log_dir = Path(__file__).parent / "logs"
    if not log_dir.exists():
        print("   ❌ 日志目录不存在")
        return False

    # 获取今天的日期
    from datetime import datetime
    today = datetime.now().strftime("%Y%m%d")

    log_files = [
        log_dir / f"app_{today}.log",
        log_dir / f"error_{today}.log"
    ]

    for log_file in log_files:
        if log_file.exists():
            size = log_file.stat().st_size
            print(f"   ✅ {log_file.name}: {size} 字节")

            # 读取最后几行
            with open(log_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                if lines:
                    print(f"\n   📝 {log_file.name} 最后5行:")
                    for line in lines[-5:]:
                        print(f"      {line.strip()}")
        else:
            print(f"   ⚠️  {log_file.name} 不存在")

    print("\n" + "=" * 60)
    print("  ✅ 日志功能测试完成！")
    print("=" * 60)

    return True


if __name__ == "__main__":
    try:
        success = test_logging()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  测试被中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ 测试过程中出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
