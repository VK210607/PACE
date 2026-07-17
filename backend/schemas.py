from pydantic import BaseModel
from typing import Optional
from enum import Enum


class LoginPayload(BaseModel):
    student_id: str
    password: str

class Response(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    user_id: str
    