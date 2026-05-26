from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class HomeworkStatus(str, Enum):
    pending = "pending"
    reviewing = "reviewing"
    approved = "approved"
    rejected = "rejected"


class HomeworkCreate(BaseModel):
    lesson_id: int


class HomeworkReview(BaseModel):
    status: HomeworkStatus
    teacher_comment: str = ""
    grade: float | None = None


class HomeworkOut(BaseModel):
    id: int
    student_id: int
    lesson_id: int
    status: str
    teacher_comment: str | None = None
    grade: float | None = None
    submitted_at: datetime

    class Config:
        from_attributes = True
