"""简历相关的 Schema"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List


class ResumeContent(BaseModel):
    """简历内容 Schema"""
    personalInfo: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    workExperience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None


class ResumeBase(BaseModel):
    """简历基础 Schema"""
    title: str
    template_id: str
    content: ResumeContent


class ResumeCreate(ResumeBase):
    """简历创建 Schema"""
    pass


class ResumeUpdate(ResumeBase):
    """简历更新 Schema"""
    pass


class ResumeResponse(ResumeBase):
    """简历响应 Schema"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResumeListItem(BaseModel):
    """简历列表项 Schema"""
    id: int
    title: str
    template_id: str
    content: ResumeContent
    created_at: datetime
    updated_at: datetime


class ResumeDuplicate(BaseModel):
    """简历复制 Schema"""
    title: Optional[str] = None
