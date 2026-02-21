"""认证相关 API"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse, AuthResponse,
    APIResponse
)
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import get_settings
from app.api.deps import get_current_user

router = APIRouter()
settings = get_settings()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="邮箱已被注册",
        )

    # 验证密码长度
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="密码至少需要 8 个字符",
        )

    # 验证姓名长度
    if not (1 <= len(user_data.full_name) <= 255):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="姓名长度必须在 1-255 个字符之间",
        )

    # 创建新用户
    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 生成 Token
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return APIResponse(
        success=True,
        data={
            "access_token": access_token,
            "user": UserResponse.model_validate(new_user).model_dump()
        }
    )


@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    # 查找用户
    user = db.query(User).filter(User.email == credentials.email).first()

    # 验证用户和密码
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
        )

    # 生成 Token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return APIResponse(
        success=True,
        data={
            "access_token": access_token,
            "user": UserResponse.model_validate(user).model_dump()
        }
    )


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return APIResponse(
        success=True,
        data=UserResponse.model_validate(current_user).model_dump()
    )
