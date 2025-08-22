# backend/app/services/auth.py
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from bson import ObjectId
from app.database.mongo import users_collection
from app.models.user import UserCreate, UserLogin

# --- JWT config ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# --- Password hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Utils ---
async def create_user(user_data: UserCreate) -> dict:
    """Create a new user in DB."""
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        raise ValueError("User already exists")
    
    hashed_password = pwd_context.hash(user_data.password)
    user_doc = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "password": hashed_password,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)
    return user_doc

async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Authenticate user with email & password."""
    user = await users_collection.find_one({"email": email})
    if not user:
        return None
    if not pwd_context.verify(password, user["password"]):
        return None
    user["_id"] = str(user["_id"])
    return user

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, token_type: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != token_type:
            return None
        return payload
    except JWTError:
        return None

async def get_user_by_id(user_id: str) -> Optional[dict]:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
    return user
