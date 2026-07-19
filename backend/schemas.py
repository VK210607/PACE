from pydantic import BaseModel
from typing import Optional,Union
from enum import Enum


class LoginPayload(BaseModel):
    student_id: Union[str,int]
    password: str

class SignupPayload(BaseModel):
    student_id: Union[str,int]
    password: str
    role: str
    full_name: str
    department: Optional[str] = None
    year: Optional[int] = None

class Response(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    user_id: str
    
class EventPayload(BaseModel):
    title: str
    event_date: str
    category: str
    description: Optional[str] = None
    target_year: Optional[int] = None
    target_dept: Optional[str] = 'ALL'


