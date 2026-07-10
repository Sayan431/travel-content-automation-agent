from pydantic import BaseModel, EmailStr
from pydantic import ConfigDict
from typing import Optional, Any, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "reviewer"

class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "reviewer"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    class Config: from_attributes = True

class UserPatch(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str

class FeedOut(BaseModel):
    id: int
    title: str
    source: str
    city: Optional[str]
    category: Optional[str]
    summary: Optional[str]
    link: str
    image: Optional[str]
    published_date: Optional[str]
    status: str
    important: bool
    created_at: Optional[datetime] = None
    class Config: from_attributes = True

class FeedUpdate(BaseModel):
    summary: Optional[str] = None
    status: Optional[str] = None
    important: Optional[bool] = None

class BrandIn(BaseModel):
    brand_name: str
    primary_color: str
    secondary_color: str
    font_style: str
    tone_of_voice: str
    cta_format: str
    social_style: str

class ContentUpdate(BaseModel):
    blog_title: Optional[str] = None
    slug: Optional[str] = None
    meta_description: Optional[str] = None
    article: Optional[str] = None
    instagram_caption: Optional[str] = None
    facebook_post: Optional[str] = None
    linkedin_post: Optional[str] = None
    hashtags: Optional[str] = None
    image_prompt: Optional[str] = None
    cta: Optional[str] = None
    status: Optional[str] = None

class SocialPostIn(BaseModel):
    content_id: int
    platform: str
    body: str
    mode: str = "manual"

class ItineraryDayIn(BaseModel):
    day_label: str
    destination: str
    activities: List[str] = []
    color_class: str = "dest-amsterdam"
    sort_order: int = 0
    is_active: bool = True

class ItineraryDayOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    day_label: str
    destination: str
    activities: Optional[List[str]] = []
    color_class: str
    sort_order: int
    is_active: bool
