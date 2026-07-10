from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import RSSFeed, GeneratedContent
from app.schemas.schemas import FeedOut
from app.agents.rss_agent import fetch_and_store_feeds
from app.agents.content_agent import generate_content_for_feed

router = APIRouter(prefix="/feeds", tags=["Feeds"])


@router.post("/fetch")
def fetch_feeds(db: Session = Depends(get_db)):
    """
    Workflow:
    1. Remove old pending blogs from Content Review.
    2. Fetch RSS articles and store them in rss_feeds table.
    3. Generate AI blogs from fetched feeds.
    4. Generate maximum 10 blogs per fetch.
    """

    errors = []

    # Step 1: reject old pending generated blogs
    old_pending = (
        db.query(GeneratedContent)
        .filter(GeneratedContent.status == "pending")
        .all()
    )

    for item in old_pending:
        item.status = "rejected"

    db.commit()

    # Step 2: fetch RSS feeds
    try:
        print("RSS FETCH STARTED...")
        new_feeds = fetch_and_store_feeds(db)

        if new_feeds is None:
            new_feeds = []

        print(f"RSS FETCH COMPLETED. NEW FEEDS FOUND: {len(new_feeds)}")

    except Exception as e:
        db.rollback()
        print("RSS FETCH ERROR:", str(e))

        return {
            "success": False,
            "new_articles": 0,
            "generated_content": 0,
            "message": "RSS fetch failed.",
            "errors": [
                {
                    "step": "fetch_and_store_feeds",
                    "error": str(e),
                }
            ],
        }

    # Step 3: if no new feed found, return clear message
    if len(new_feeds) == 0:
        total_feeds = db.query(RSSFeed).count()

        return {
            "success": True,
            "new_articles": 0,
            "generated_content": 0,
            "message": f"No new RSS articles found. Total rss_feeds in database: {total_feeds}",
            "errors": [],
        }

    # Step 4: generate maximum 10 AI blogs
    generated_count = 0

    for feed in new_feeds[:10]:
        try:
            existing_content = (
                db.query(GeneratedContent)
                .filter(GeneratedContent.feed_id == feed.id)
                .first()
            )

            if existing_content:
                print(f"Skipping feed {feed.id}, content already exists.")
                continue

            print(f"Generating content for feed ID: {feed.id}")

            generate_content_for_feed(db, feed.id)
            generated_count += 1

        except Exception as e:
            db.rollback()
            print(f"CONTENT GENERATION ERROR FOR FEED {getattr(feed, 'id', None)}:", str(e))

            errors.append(
                {
                    "feed_id": getattr(feed, "id", None),
                    "error": str(e),
                }
            )

    return {
        "success": True,
        "new_articles": len(new_feeds),
        "generated_content": generated_count,
        "message": f"Fetched {len(new_feeds)} new articles and generated {generated_count} AI blogs.",
        "errors": errors,
    }


@router.get("/", response_model=list[FeedOut])
def list_feeds(db: Session = Depends(get_db)):
    return (
        db.query(RSSFeed)
        .order_by(RSSFeed.created_at.desc())
        .limit(100)
        .all()
    )


@router.delete("/{feed_id}")
def delete_feed(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(RSSFeed).filter(RSSFeed.id == feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    db.delete(feed)
    db.commit()
    return {"success": True, "message": "Feed deleted"}


@router.patch("/{feed_id}/important")
def toggle_important(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(RSSFeed).filter(RSSFeed.id == feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    feed.important = not feed.important
    db.commit()
    db.refresh(feed)
    return {"id": feed.id, "important": feed.important}