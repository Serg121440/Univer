from pydantic import BaseModel


class HomeworkCreate(BaseModel):
    student_id: int
    lesson_id: int


class HomeworkReview(BaseModel):
    status: str
    teacher_comment: str = ""
    grade: float | None = None
