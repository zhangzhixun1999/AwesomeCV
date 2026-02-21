"""简历相关 API"""
import json
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ResumeListItem,
    ResumeDuplicate,
)
from app.schemas.user import APIResponse
from app.api.deps import get_current_user, get_resume_by_id_for_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("")
def get_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """获取用户的所有简历"""
    logger.info(f"获取用户简历列表: user_id={current_user.id}, email={current_user.email}")
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
        .all()
    )
    # 解析 content JSON 字符串
    result = []
    for resume in resumes:
        content = json.loads(resume.content)
        result.append({
            "id": resume.id,
            "title": resume.title,
            "template_id": resume.template_id,
            "content": content,
            "created_at": resume.created_at.isoformat(),
            "updated_at": resume.updated_at.isoformat(),
        })
    logger.info(f"成功获取用户简历列表: user_id={current_user.id}, count={len(result)}")
    return APIResponse(
        success=True,
        data=result
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """创建新简历"""
    logger.info(f"创建简历: user_id={current_user.id}, title={resume_data.title}, template={resume_data.template_id}")
    try:
        new_resume = Resume(
            user_id=current_user.id,
            title=resume_data.title,
            template_id=resume_data.template_id,
            content=resume_data.content.model_dump_json(),
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        logger.info(f"简历创建成功: resume_id={new_resume.id}, user_id={current_user.id}")

        return APIResponse(
            success=True,
            data={
                "id": new_resume.id,
                "user_id": new_resume.user_id,
                "title": new_resume.title,
                "template_id": new_resume.template_id,
                "content": resume_data.content.model_dump(),
                "created_at": new_resume.created_at.isoformat(),
                "updated_at": new_resume.updated_at.isoformat(),
            }
        )
    except Exception as e:
        logger.error(f"创建简历失败: user_id={current_user.id}, title={resume_data.title}, error={str(e)}", exc_info=True)
        raise


@router.get("/{resume_id}")
def get_resume(
    resume: Resume = Depends(get_resume_by_id_for_user),
):
    """获取简历详情"""
    content = json.loads(resume.content)
    return APIResponse(
        success=True,
        data={
            "id": resume.id,
            "user_id": resume.user_id,
            "title": resume.title,
            "template_id": resume.template_id,
            "content": content,
            "created_at": resume.created_at.isoformat(),
            "updated_at": resume.updated_at.isoformat(),
        }
    )


@router.put("/{resume_id}")
def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """更新简历"""
    logger.info(f"更新简历: resume_id={resume_id}, user_id={current_user.id}, title={resume_data.title}")
    try:
        # 获取并验证权限
        resume = get_resume_by_id_for_user(resume_id, db, current_user)

        # 更新字段
        resume.title = resume_data.title
        resume.template_id = resume_data.template_id
        resume.content = resume_data.content.model_dump_json()

        db.commit()
        db.refresh(resume)

        logger.info(f"简历更新成功: resume_id={resume_id}, user_id={current_user.id}")

        return APIResponse(
            success=True,
            data={
                "id": resume.id,
                "user_id": resume.user_id,
                "title": resume.title,
                "template_id": resume.template_id,
                "content": resume_data.content.model_dump(),
                "created_at": resume.created_at.isoformat(),
                "updated_at": resume.updated_at.isoformat(),
            }
        )
    except Exception as e:
        logger.error(f"更新简历失败: resume_id={resume_id}, user_id={current_user.id}, error={str(e)}", exc_info=True)
        raise


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """删除简历"""
    logger.info(f"删除简历: resume_id={resume_id}, user_id={current_user.id}")
    try:
        # 获取并验证权限
        resume = get_resume_by_id_for_user(resume_id, db, current_user)

        title = resume.title  # 保存标题用于日志
        db.delete(resume)
        db.commit()

        logger.info(f"简历删除成功: resume_id={resume_id}, user_id={current_user.id}, title={title}")

        return APIResponse(success=True, data=None)
    except Exception as e:
        logger.error(f"删除简历失败: resume_id={resume_id}, user_id={current_user.id}, error={str(e)}", exc_info=True)
        raise


@router.post("/{resume_id}/duplicate", status_code=status.HTTP_201_CREATED)
def duplicate_resume(
    resume_id: int,
    duplicate_data: ResumeDuplicate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """复制简历"""
    logger.info(f"复制简历: resume_id={resume_id}, user_id={current_user.id}")
    try:
        # 获取原简历
        original_resume = get_resume_by_id_for_user(resume_id, db, current_user)

        # 确定新标题
        new_title = duplicate_data.title if duplicate_data.title else f"{original_resume.title} (副本)"

        # 创建新简历
        new_resume = Resume(
            user_id=current_user.id,
            title=new_title,
            template_id=original_resume.template_id,
            content=original_resume.content,
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        logger.info(f"简历复制成功: original_id={resume_id}, new_id={new_resume.id}, user_id={current_user.id}, title={new_title}")

        content = json.loads(new_resume.content)
        return APIResponse(
            success=True,
            data={
                "id": new_resume.id,
                "user_id": new_resume.user_id,
                "title": new_resume.title,
                "template_id": new_resume.template_id,
                "content": content,
                "created_at": new_resume.created_at.isoformat(),
                "updated_at": new_resume.updated_at.isoformat(),
            }
        )
    except Exception as e:
        logger.error(f"复制简历失败: resume_id={resume_id}, user_id={current_user.id}, error={str(e)}", exc_info=True)
        raise
