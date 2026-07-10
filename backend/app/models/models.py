from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("admin", "reviewer", name="user_roles"), default="admin", nullable=False)
    is_active = Column(Boolean, default=True)

class RSSFeed(Base, TimestampMixin):
    __tablename__ = "rss_feeds"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    source = Column(String(160), nullable=False)
    city = Column(String(80), index=True)
    category = Column(String(80), index=True)
    summary = Column(Text)
    link = Column(String(700), unique=True, nullable=False)
    image = Column(String(700))
    published_date = Column(String(120))
    status = Column(Enum("fetched", "generated", "duplicate", name="feed_status"), default="fetched")
    important = Column(Boolean, default=False)

class BrandSetting(Base, TimestampMixin):
    __tablename__ = "brand_settings"
    id = Column(Integer, primary_key=True)
    brand_name = Column(String(120), default="European Dream Travel")
    primary_color = Column(String(20), default="#0F5F64")
    secondary_color = Column(String(20), default="#D96B32")
    font_style = Column(String(120), default="Inter")
    tone_of_voice = Column(String(255), default="premium, inspirational, modern travel brochure style")
    cta_format = Column(String(255), default="Plan your next European escape today")
    social_style = Column(String(255), default="short, visual, engaging and travel-friendly")

class GeneratedContent(Base, TimestampMixin):
    __tablename__ = "generated_contents"
    id = Column(Integer, primary_key=True)
    feed_id = Column(Integer, ForeignKey("rss_feeds.id"), nullable=False)
    blog_title = Column(String(255))
    slug = Column(String(255))
    meta_description = Column(String(300))
    article = Column(Text)
    instagram_caption = Column(Text)
    facebook_post = Column(Text)
    linkedin_post = Column(Text)
    hashtags = Column(Text)
    image_prompt = Column(Text)
    cta = Column(String(255))
    status = Column(
        Enum("pending", "rejected", "posted", "failed", name="content_status"),
        default="pending"
    )
    feed = relationship("RSSFeed")

class SocialPost(Base, TimestampMixin):
    __tablename__ = "social_posts"
    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey("generated_contents.id"), nullable=False)
    platform = Column(Enum("instagram", "facebook", "linkedin", name="platforms"), nullable=False)
    body = Column(Text)
    mode = Column(Enum("mock", "api", name="post_modes"), default="mock")
    status = Column(Enum("posted", "failed", name="post_status"), default="posted")
    post_url = Column(String(700))
    error_log = Column(Text)
    api_response = Column(JSON)
    content = relationship("GeneratedContent")

class ApprovalLog(Base, TimestampMixin):
    __tablename__ = "approval_logs"
    id = Column(Integer, primary_key=True)
    entity_type = Column(String(80))
    entity_id = Column(Integer)
    action = Column(String(80))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    note = Column(Text)

class ItineraryDay(Base, TimestampMixin):
    __tablename__ = "itinerary_days"
    id = Column(Integer, primary_key=True)
    day_label = Column(String(40), nullable=False)          # "Day 1–2"
    destination = Column(String(120), nullable=False)       # "Amsterdam"
    activities = Column(JSON, default=list)                 # ["Canal Tour", "Van Gogh"]
    color_class = Column(String(60), default="dest-amsterdam")  # CSS class
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)