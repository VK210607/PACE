from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Replace with your actual local PostgreSQL credentials
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Vijaykiran@localhost:5432/PACE"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()