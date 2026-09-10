import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth, courses, health, tools, sync, users
from app.api.routes.homework import router as homework_router
from app.core.database import Base, engine
from app.models import entities  # noqa: F401

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Marketplace LMS 2026 API", version="0.3.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, tags=["users"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(homework_router, tags=["homework"])
app.include_router(tools.router, tags=["tools"])
app.include_router(sync.router, tags=["sync"])
