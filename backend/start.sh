#!/bin/bash
# 启动开发服务器

cd "$(dirname "$0")"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
    echo "✅ 虚拟环境创建完成"
fi

# 激活虚拟环境
source venv/bin/activate

# 检查是否需要安装依赖（通过检查 fastapi 是否存在）
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 安装依赖..."
    pip install -r requirements.txt
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装，跳过"
fi

# 初始化数据库（如果不存在）
if [ ! -f "resume.db" ]; then
    echo "🗄️  初始化数据库..."
    python database/init_db.py
fi

# 启动服务器
echo ""
echo "🚀 启动服务器..."
echo "📍 API 文档: http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --port 8000
