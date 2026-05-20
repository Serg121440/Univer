from pydantic import BaseModel
from datetime import datetime


class HomeworkCreate(BaseModel):
    student_id: int
    lesson_id: int


class HomeworkReview(BaseModel):
    status: str
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
