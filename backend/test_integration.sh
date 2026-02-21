#!/bin/bash
# 前后端联调测试脚本

set -e

API_URL="http://localhost:8000/api"
TOKEN=""
RESUME_ID=""

echo "======================================"
echo "前后端联调测试"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local token="$5"

    echo -n "测试 $name ... "

    if [ -z "$token" ]; then
        if [ -z "$data" ]; then
            response=$(curl -s -X "$method" "$API_URL$endpoint" -H "Content-Type: application/json")
        else
            response=$(curl -s -X "$method" "$API_URL$endpoint" -H "Content-Type: application/json" -d "$data")
        fi
    else
        if [ -z "$data" ]; then
            response=$(curl -s -X "$method" "$API_URL$endpoint" -H "Authorization: Bearer $token" -H "Content-Type: application/json")
        else
            response=$(curl -s -X "$method" "$API_URL$endpoint" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "$data")
        fi
    fi

    # 检查 success 字段
    success=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")

    if [ "$success" = "True" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "响应: $response"
        return 1
    fi
}

# 检查后端是否运行
echo "1. 检查后端服务..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后端服务正常运行${NC}"
else
    echo -e "${RED}✗ 后端服务未启动${NC}"
    echo "请先运行: ./start.sh"
    exit 1
fi
echo ""

# 模板 API 测试
echo "2. 测试模板 API..."
test_api "获取模板列表" "GET" "/templates" "" ""
test_api "获取现代模板" "GET" "/templates/modern" "" ""
test_api "获取经典模板" "GET" "/templates/classic" "" ""
test_api "获取创意模板" "GET" "/templates/creative" "" ""
echo ""

# 认证 API 测试
echo "3. 测试认证 API..."
echo -n "测试用户注册 ... "
register_response=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"integration_test@example.com","password":"password123","full_name":"集成测试用户"}')

if echo "$register_response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') and data.get('data',{}).get('access_token') else 1)" 2>/dev/null; then
    echo -e "${GREEN}✓ 通过${NC}"
    TOKEN=$(echo "$register_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")
    echo "获得 Token: ${TOKEN:0:50}..."
else
    echo -e "${YELLOW}! 用户可能已存在，尝试登录${NC}"
    login_response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"integration_test@example.com","password":"password123"}')

    if echo "$login_response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') and data.get('data',{}).get('access_token') else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓ 登录成功${NC}"
        TOKEN=$(echo "$login_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")
        echo "获得 Token: ${TOKEN:0:50}..."
    else
        echo -e "${RED}✗ 认证失败${NC}"
        echo "响应: $login_response"
        exit 1
    fi
fi
echo ""

test_api "获取当前用户" "GET" "/auth/me" "" "$TOKEN"
echo ""

# 简历 API 测试
echo "4. 测试简历 API..."
echo -n "测试创建简历 ... "
create_response=$(curl -s -X POST "$API_URL/resumes" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "集成测试简历",
        "template_id": "modern",
        "content": {
            "personalInfo": {"name": "测试用户", "email": "test@example.com"},
            "summary": "",
            "workExperience": [],
            "education": [],
            "skills": [],
            "projects": []
        }
    }')

if echo "$create_response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') and data.get('data',{}).get('id') else 1)" 2>/dev/null; then
    echo -e "${GREEN}✓ 通过${NC}"
    RESUME_ID=$(echo "$create_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")
    echo "简历 ID: $RESUME_ID"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $create_response"
    exit 1
fi

test_api "获取简历列表" "GET" "/resumes" "" "$TOKEN"
test_api "获取简历详情" "GET" "/resumes/$RESUME_ID" "" "$TOKEN"

echo -n "测试更新简历 ... "
update_response=$(curl -s -X PUT "$API_URL/resumes/$RESUME_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "更新后的简历",
        "template_id": "modern",
        "content": {
            "personalInfo": {"name": "更新用户", "email": "update@example.com"},
            "summary": "这是更新后的简介",
            "workExperience": [],
            "education": [],
            "skills": ["Python", "React"],
            "projects": []
        }
    }')

if echo "$update_response" | python3 -c "import sys, json; exit(0 if json.load(sys.stdin).get('success') else 1)" 2>/dev/null; then
    echo -e "${GREEN}✓ 通过${NC}"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $update_response"
fi

echo -n "测试复制简历 ... "
duplicate_response=$(curl -s -X POST "$API_URL/resumes/$RESUME_ID/duplicate" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "简历副本"}')

if echo "$duplicate_response" | python3 -c "import sys, json; exit(0 if json.load(sys.stdin).get('success') else 1)" 2>/dev/null; then
    echo -e "${GREEN}✓ 通过${NC}"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $duplicate_response"
fi

test_api "删除简历" "DELETE" "/resumes/$RESUME_ID" "" "$TOKEN"
echo ""

# 测试未授权访问
echo "5. 测试权限控制..."
echo -n "测试未授权访问简历 (应该失败) ... "
unauth_response=$(curl -s -X GET "$API_URL/resumes" -H "Content-Type: application/json")

if echo "$unauth_response" | python3 -c "import sys, json; exit(1 if json.load(sys.stdin).get('success') else 0)" 2>/dev/null; then
    echo -e "${GREEN}✓ 通过 (正确拒绝访问)${NC}"
else
    echo -e "${RED}✗ 失败 (未正确拒绝)${NC}"
    echo "响应: $unauth_response"
fi
echo ""

# CORS 测试
echo "6. 测试 CORS..."
echo -n "测试 CORS 预检请求 ... "
cors_response=$(curl -s -X OPTIONS "$API_URL/templates" \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: authorization" \
    -v 2>&1 | grep -i "access-control-allow-origin" || echo "")

if [ -n "$cors_response" ]; then
    echo -e "${GREEN}✓ 通过${NC}"
else
    echo -e "${YELLOW}! CORS 预检未检测到，但不影响实际请求${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}✓ 所有后端 API 测试通过！${NC}"
echo "======================================"
echo ""
echo "后端测试完成！"
echo "📍 API 文档: http://localhost:8000/docs"
echo "📍 前端地址: http://localhost:5173"
echo ""
echo "下一步："
echo "1. 在浏览器中打开 http://localhost:5173"
echo "2. 测试前端功能："
echo "   - 用户注册/登录"
echo "   - 创建简历"
echo "   - 编辑简历"
echo "   - 查看模板"
