@echo off
REM Windows 启动脚本

cd /d "%~dp0"

REM 检查虚拟环境
if not exist "venv" (
    echo 📦 创建虚拟环境...
    python -m venv venv
    echo ✅ 虚拟环境创建完成
)

REM 激活虚拟环境
call venv\Scripts\activate.bat

REM 检查是否需要安装依赖
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo 📦 安装依赖...
    pip install -r requirements.txt
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装，跳过
)

REM 初始化数据库（如果不存在）
if not exist "resume.db" (
    echo 🗄️  初始化数据库...
    python database\init_db.py
)

REM 启动服务器
echo.
echo 🚀 启动服务器...
echo 📍 API 文档: http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --port 8000
