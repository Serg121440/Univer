from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str = ""


class CourseOut(BaseModel):
    id: int
    title: str
    description: str | None = None

    class Config:
        from_attributes = True


class ModuleCreate(BaseModel):
    course_id: int
    title: str
    description: str = ""
    order: int = 1


class ModuleOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: str | None = None
    order: int
    is_locked: int

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    module_id: int
    title: str
    description: str = ""
    drive_file_id: str | None = None
    lesson_type: str = "video"
    order: int = 1


class LessonOut(BaseModel):
    id: int
    module_id: int
    title: str
    description: str | None = None
    drive_file_id: str | None = None
    lesson_type: str
    order: int

    class Config:
        from_attributes = True
