from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import GeneratedContent, ApprovalLog
from app.services.social_service import auto_post_content
from app.schemas.schemas import ContentUpdate

router = APIRouter(prefix="/content", tags=["Content"])


@router.get("/")
def list_content(status: str | None = None, db: Session = Depends(get_db)):
    query = db.query(GeneratedContent).order_by(
        GeneratedContent.created_at.desc()
    )

    if status:
        query = query.filter(GeneratedContent.status == status)

    return query.limit(100).all()


@router.get("/pending")
def pending_content(db: Session = Depends(get_db)):
    return (
        db.query(GeneratedContent)
        .filter(GeneratedContent.status == "pending")
        .order_by(GeneratedContent.created_at.desc())
        .all()
    )


@router.get("/public")
def public_blogs(db: Session = Depends(get_db)):
    return (
        db.query(GeneratedContent)
        .filter(GeneratedContent.status == "posted")
        .order_by(GeneratedContent.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/public/{content_id}")
def public_blog_detail(content_id: int, db: Session = Depends(get_db)):
    blog = (
        db.query(GeneratedContent)
        .filter(
            GeneratedContent.id == content_id,
            GeneratedContent.status == "posted",
        )
        .first()
    )

    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    return blog


@router.post("/{content_id}/accept")
def accept_content(content_id: int, db: Session = Depends(get_db)):
    content = (
        db.query(GeneratedContent)
        .filter(
            GeneratedContent.id == content_id,
            GeneratedContent.status == "pending",
        )
        .first()
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Pending content not found"
        )

    try:
        db.add(
            ApprovalLog(
                entity_type="content",
                entity_id=content.id,
                action="approved",
                user_id=None,
            )
        )

        db.commit()

        auto_post_content(db, content.id)

        content = (
            db.query(GeneratedContent)
            .filter(GeneratedContent.id == content_id)
            .first()
        )

        content.status = "posted"
        db.commit()

        return {
            "success": True,
            "message": "Blog posted and published on public site",
        }

    except Exception as e:
        db.rollback()

        content = (
            db.query(GeneratedContent)
            .filter(GeneratedContent.id == content_id)
            .first()
        )

        if content:
            content.status = "failed"
            db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Posting failed: {str(e)}"
        )


@router.post("/{content_id}/reject")
def reject_content(content_id: int, db: Session = Depends(get_db)):
    content = (
        db.query(GeneratedContent)
        .filter(
            GeneratedContent.id == content_id,
            GeneratedContent.status == "pending",
        )
        .first()
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Pending content not found"
        )

    content.status = "rejected"

    db.add(
        ApprovalLog(
            entity_type="content",
            entity_id=content.id,
            action="rejected",
            user_id=None,
        )
    )

    db.commit()

    return {
        "success": True,
        "message": "Selected blog rejected successfully",
    }


@router.get("/{content_id}")
def get_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(GeneratedContent).filter(GeneratedContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@router.put("/{content_id}")
def update_content(content_id: int, payload: ContentUpdate, db: Session = Depends(get_db)):
    content = db.query(GeneratedContent).filter(GeneratedContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(content, field, value)

    db.commit()
    db.refresh(content)
    return content