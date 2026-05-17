from fastapi import FastAPI
from app.api.routes import auth, courses, health
from app.api.routes.homework import router as homework_router
from app.core.database import Base, engine
from app.models import entities  # noqa: F401

app = FastAPI(title="Marketplace LMS 2026 API", version="0.2.0")

Base.metadata.create_all(bind=engine)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(homework_router, tags=["homework"])
