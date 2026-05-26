from pydantic import BaseModel, EmailStr
from typing import Literal

Role = Literal["student", "teacher", "admin"]


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
