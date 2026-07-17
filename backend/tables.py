from database import Base
from sqlalchemy import Column, Integer, String
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False,default=generate_uuid)
    student_id = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    name= Column(String, nullable=False)
    dept= Column(String, nullable=True) 
    year= Column(String, nullable=True)

