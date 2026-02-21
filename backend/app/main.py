"""FastAPI 主应用"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app.core.config import get_settings
from app.core.logging import setup_logging, get_logger
from app.routes import auth, resumes, templates
from app.db.base import engine, Base

settings = get_settings()

# 初始化日志系统
setup_logging(settings.ENVIRONMENT)
logger = get_logger(__name__)

# 创建 FastAPI 应用
app = FastAPI(
    title="Resume Builder API",
    description="简历生成器后端 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    # 自动创建数据库表
    logger.info("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    logger.info("数据库表创建完成")

    # 创建测试账号（如果不存在）
    from app.db.session import SessionLocal
    from app.models.user import User
    import bcrypt

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if not existing_user:
            test_user = User(
                email="test@example.com",
                password_hash=bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode(),
                full_name="测试用户"
            )
            db.add(test_user)
            db.commit()
            logger.info("测试账号创建成功: test@example.com / password123")
        else:
            logger.info("测试账号已存在")
    finally:
        db.close()

    logger.info("=" * 50)
    logger.info("Resume Builder API 启动中...")
    logger.info(f"环境: {settings.ENVIRONMENT}")
    logger.info(f"数据库: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    logger.info(f"前端URL: {settings.FRONTEND_URL}")
    logger.info("=" * 50)


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    logger.info("Resume Builder API 正在关闭...")
    logger.info("=" * 50)


# HTTPException 异常处理器
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTP 异常处理"""
    error_codes = {
        400: "VALIDATION_ERROR",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        500: "INTERNAL_ERROR",
    }
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": error_codes.get(exc.status_code, "ERROR"),
                "message": exc.detail
            }
        }
    )


# 统一异常处理器
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": str(exc)}}
    )


# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5175",
        "https://awesome-cv-iota.vercel.app",  # Vercel production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["简历"])
app.include_router(templates.router, prefix="/api/templates", tags=["模板"])


@app.get("/")
def root():
    """根路径"""
    return {
        "message": "Resume Builder API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """健康检查"""
    return {"status": "ok"}
