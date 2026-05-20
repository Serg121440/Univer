from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth, courses, health, tools, sync
from app.api.routes.homework import router as homework_router
from app.core.database import Base, engine
from app.models import entities  # noqa: F401
from app.api.deps import limiter

app = FastAPI(title="Marketplace LMS 2026 API", version="0.2.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3004", "http://localhost:3005"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(homework_router, tags=["homework"])
app.include_router(tools.router, tags=["tools"])
app.include_router(sync.router, tags=["sync"])
