
from datetime import datetime, timedelta
import jose

from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException,status
from pydantic import BaseModel
from requests import Session
import schemas,tables
from database import engine
from database import get_db


app=FastAPI()

tables.Base.metadata.create_all(bind=engine)

SECRET_KEY = "U1gb3otAP33+ChEliTDTYikpsiKw46T8sOTFKXczk6s="
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jose.jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def setup_cors():
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        allow_credentials=True
    )

@app.post('/api/auth/login', response_model=schemas.Response)
def login_page(payload: schemas.LoginPayload,db: Session = Depends(get_db),status_code=status.HTTP_200_OK):
    credentials = db.query(tables.User).filter(tables.User.student_id == payload.student_id, tables.User.password == payload.password).first()
    if credentials:
        token=create_access_token(data={"sub": credentials.student_id})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": credentials.role,
            "full_name": credentials.name,
            "department": credentials.dept,
            "year": credentials.year,
            "user_id": credentials.id
        }
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
