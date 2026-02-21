#!/bin/bash
# 运行测试脚本

cd "$(dirname "$0")"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 虚拟环境不存在，请先运行 start.sh"
    exit 1
fi

# 激活虚拟环境
source venv/bin/activate

# 安装测试依赖（如果尚未安装）
echo "📦 检查测试依赖..."
pip install pytest pytest-asyncio pytest-cov httpx -q

# 运行测试
echo ""
echo "🧪 运行测试..."
echo ""

pytest tests/ -v --cov=app --cov-report=html --cov-report=term-missing

echo ""
echo "✅ 测试完成！"
echo "📊 覆盖率报告: htmlcov/index.html"
