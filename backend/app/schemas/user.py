from pydantic import BaseModel, EmailStr, Field
from typing import Literal

Role = Literal["student", "teacher", "admin"]


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    # bcrypt only uses the first 72 bytes, so reject longer secrets outright.
    password: str = Field(min_length=8, max_length=72)
    role: Role = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
