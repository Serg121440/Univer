from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import Course, Module, Lesson
from app.schemas.course import (
    CourseCreate,
    CourseOut,
    ModuleCreate,
    ModuleOut,
    LessonCreate,
    LessonOut,
)

router = APIRouter()


@router.get("", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db)) -> list[Course]:
    return db.query(Course).order_by(Course.id.asc()).all()


@router.post("", response_model=CourseOut)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)) -> Course:
    course = Course(title=payload.title, description=payload.description)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/modules", response_model=list[ModuleOut])
def list_modules(db: Session = Depends(get_db)) -> list[Module]:
    return db.query(Module).order_by(Module.course_id.asc(), Module.order.asc()).all()


@router.post("/modules", response_model=ModuleOut)
def create_module(payload: ModuleCreate, db: Session = Depends(get_db)) -> Module:
    course = db.get(Course, payload.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    module = Module(
        course_id=payload.course_id,
        title=payload.title,
        description=payload.description,
        order=payload.order,
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.get("/lessons", response_model=list[LessonOut])
def list_lessons(db: Session = Depends(get_db)) -> list[Lesson]:
    return db.query(Lesson).order_by(Lesson.module_id.asc(), Lesson.order.asc()).all()


@router.post("/lessons", response_model=LessonOut)
def create_lesson(payload: LessonCreate, db: Session = Depends(get_db)) -> Lesson:
    module = db.get(Module, payload.module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    lesson = Lesson(**payload.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson
