from datetime import datetime, timedelta
from jose import jwt,JWTError
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from requests import Session
import schemas,tables
from database import engine
from database import get_db
from passlib.context import CryptContext

app=FastAPI()

tables.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "r3G7ECaFcMXEISc5QYe/X5hyP4nH9Tyz18yBxZjazRY="
ALGORITHM = 'HS256'
EXPIRATION_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def setup_cors():
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        allow_credentials=True
    )

@app.post('/api/auth/login', response_model=schemas.Response,status_code=status.HTTP_200_OK)
def login_page(payload: schemas.LoginPayload,db: Session = Depends(get_db)):
    credentials = db.query(tables.User).filter(tables.User.student_id == payload.student_id).first()
    if credentials and verify_password(payload.password, credentials.password):
        token=create_access_token(data={"sub": credentials.student_id})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": credentials.role,
            "full_name": credentials.full_name,
            "department": credentials.dept,
            "year": credentials.year,
            "user_id": str(credentials.id)
        }
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

@app.post('/api/auth/signup', response_model=schemas.Response,status_code=status.HTTP_201_CREATED)
def signup_page(payload:schemas.SignupPayload,db:Session=Depends(get_db)):
    user = db.query(tables.User).filter(tables.User.student_id == payload.student_id).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    new_user = tables.User(
        student_id=payload.student_id,
        password=get_password_hash(payload.password),
        role=payload.role,
        full_name=payload.full_name,
        dept=payload.department,
        year=str(payload.year) if payload.year is not None else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token=create_access_token(data={"sub": new_user.student_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role,
        "full_name": new_user.full_name,
        "department": new_user.dept,
        "year": int(new_user.year) if new_user.year is not None else None,
        "user_id": str(new_user.id)
    }

@app.post('/api/admin/create-event', response_model=schemas.EventPayload, status_code=status.HTTP_201_CREATED)
def create_event(payload: schemas.EventPayload, db: Session = Depends(get_db)):
    new_event = tables.Events(
        title=payload.title,
        event_date=payload.event_date,
        category=payload.category,
        description=payload.description,
        target_year=payload.target_year,
        target_dept=payload.target_dept
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@app.get('/api/events/feed', response_model=list[schemas.EventPayload], status_code=status.HTTP_200_OK)
def get_events(db: Session = Depends(get_db)):
    events = db.query(tables.Events).all()
    return events