"""用户相关的 Schema"""
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Generic, TypeVar, Optional


class UserBase(BaseModel):
    """用户基础 Schema"""
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """用户创建 Schema"""
    password: str


class UserLogin(BaseModel):
    """用户登录 Schema"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """用户响应 Schema"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    """认证响应 Schema"""
    access_token: str
    user: UserResponse


T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """统一 API 响应格式"""
    success: bool
    data: Optional[T] = None
    error: Optional[dict] = None
