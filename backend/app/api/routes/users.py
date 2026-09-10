from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import RoleChecker, get_current_user
from app.core.database import get_db
from app.models.entities import User
from app.schemas.user import RoleUpdate, UserOut

router = APIRouter(prefix="/users")

require_admin = RoleChecker(["admin"])


@router.get("/me", response_model=UserOut)
def read_current_user(user: User = Depends(get_current_user)) -> User:
    return user


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)) -> list[User]:
    return db.query(User).order_by(User.id.asc()).all()


@router.patch("/{user_id}/role", response_model=UserOut)
def set_user_role(
    user_id: int,
    payload: RoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        # Demoting yourself could leave the platform without any administrator.
        raise HTTPException(status_code=400, detail="Нельзя менять собственную роль")

    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user
