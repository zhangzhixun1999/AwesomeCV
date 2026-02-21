@echo off
REM Windows 测试脚本

cd /d "%~dp0"

REM 检查虚拟环境
if not exist "venv" (
    echo ❌ 虚拟环境不存在，请先运行 start.bat
    exit /b 1
)

REM 激活虚拟环境
call venv\Scripts\activate.bat

REM 安装测试依赖
echo 📦 检查测试依赖...
pip install pytest pytest-asyncio pytest-cov httpx -q

REM 运行测试
echo.
echo 🧪 运行测试...
echo.

pytest tests/ -v --cov=app --cov-report=html --cov-report=term-missing

echo.
echo ✅ 测试完成！
echo 📊 覆盖率报告: htmlcov\index.html
