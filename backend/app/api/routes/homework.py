from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import RoleChecker, get_current_user
from app.models.entities import Homework, Lesson, User
from app.schemas.homework import HomeworkCreate, HomeworkReview, HomeworkOut

router = APIRouter(prefix="/homework")


@router.get("", response_model=list[HomeworkOut], dependencies=[Depends(RoleChecker(["admin", "teacher"]))])
def list_homework(db: Session = Depends(get_db)) -> list[Homework]:
    return db.query(Homework).order_by(Homework.id.desc()).all()


@router.get("/me", response_model=list[HomeworkOut])
def list_my_homework(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[Homework]:
    return db.query(Homework).filter(Homework.student_id == current_user.id).order_by(Homework.id.desc()).all()


@router.post("")
def submit_homework(payload: HomeworkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> dict:
    # IDOR Fix: Force student_id to be the current authenticated user's ID
    if not db.get(Lesson, payload.lesson_id):
        raise HTTPException(status_code=404, detail="Lesson not found")

    hw = Homework(student_id=current_user.id, lesson_id=payload.lesson_id, status="reviewing")
    db.add(hw)
    db.commit()
    db.refresh(hw)
    return {"id": hw.id, "status": hw.status}


@router.patch("/{homework_id}", dependencies=[Depends(RoleChecker(["admin", "teacher"]))])
def review_homework(homework_id: int, payload: HomeworkReview, db: Session = Depends(get_db)) -> dict:
    hw = db.get(Homework, homework_id)
    if not hw:
        raise HTTPException(status_code=404, detail="Homework not found")

    hw.status = payload.status
    hw.teacher_comment = payload.teacher_comment
    hw.grade = payload.grade
    db.commit()
    return {"id": hw.id, "status": hw.status, "grade": hw.grade}
