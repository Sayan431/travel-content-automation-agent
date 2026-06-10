from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.models import *
from app.api import auth, feeds, content, brand, analytics
from app.scheduler.jobs import start_scheduler
from app.core.security import hash_password
from app.models.models import User, BrandSetting

app = FastAPI(title="Travel Content Automation Agent")
print("MAIN.PY LOADED")

origins = [x.strip() for x in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api")
app.include_router(feeds.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(brand.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@example.com").first():
            db.add(
                User(
                    name="Admin",
                    email="admin@example.com",
                    password_hash=hash_password("admin123"),
                    role="admin",
                )
            )

        if not db.query(BrandSetting).first():
            db.add(BrandSetting())

        db.commit()
    finally:
        db.close()

    start_scheduler()


@app.get("/")
def root():
    return {"message": "Travel Content Automation Agent API is running"}



@app.get("/debug")
def debug():
    return {
        "cors_origins": settings.CORS_ORIGINS
    }