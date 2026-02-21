# PowerShell 启动脚本

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 检查虚拟环境
if (-not (Test-Path "venv")) {
    Write-Host "📦 创建虚拟环境..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ 虚拟环境创建完成" -ForegroundColor Green
}

# 激活虚拟环境
Write-Host "激活虚拟环境..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# 检查是否需要安装依赖
try {
    python -c "import fastapi" 2>$null
    Write-Host "✅ 依赖已安装，跳过" -ForegroundColor Green
} catch {
    Write-Host "📦 安装依赖..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
}

# 初始化数据库（如果不存在）
if (-not (Test-Path "resume.db")) {
    Write-Host "🗄️  初始化数据库..." -ForegroundColor Yellow
    python database\init_db.py
}

# 启动服务器
Write-Host ""
Write-Host "🚀 启动服务器..." -ForegroundColor Green
Write-Host "📍 API 文档: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
uvicorn app.main:app --reload --port 8000
