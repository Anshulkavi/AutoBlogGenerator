from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from bson import ObjectId
from app.database.mongo import users_collection
from app.models.user import UserCreate, UserLogin
from collections import defaultdict
import asyncio

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Create user ---
async def create_user(user_data: UserCreate) -> dict:
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

# --- Authenticate ---
async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = await users_collection.find_one({"email": email})
    if not user:
        return None
    if not pwd_context.verify(password, user["password"]):
        return None
    user["_id"] = str(user["_id"])
    return user

# --- JWT tokens ---
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

# --- Get user by ID ---
async def get_user_by_id(user_id: str) -> Optional[dict]:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
    return user

# --- Dependencies for routes ---
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_active_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token, "access")
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await get_user_by_id(payload["sub"])
    if not user or not user.get("is_active", False):
        raise HTTPException(status_code=401, detail="Inactive user")
    return user

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = verify_token(token, "access")
        if not payload or "sub" not in payload:
            return None
        user = await get_user_by_id(payload["sub"])
        if not user or not user.get("is_active", False):
            return None
        return user
    except Exception:
        return None

class EnhancedRateLimiter:
    def __init__(self):
        self.user_requests = defaultdict(list)
        self.cleanup_task = None
    
    async def is_allowed(self, user_id: str, limit: int = 5, window: int = 60) -> bool:
        now = datetime.now(timezone.utc).timestamp()
        user_requests = self.user_requests[user_id]
        
        # Remove old requests
        self.user_requests[user_id] = [
            req_time for req_time in user_requests if now - req_time < window
        ]
        
        if len(self.user_requests[user_id]) >= limit:
            return False
        
        self.user_requests[user_id].append(now)
        return True


# --- Token blacklisting ---
class TokenBlacklist:
    def __init__(self):
        self.blacklisted_tokens = set()
    
    def add_token(self, token: str):
        self.blacklisted_tokens.add(token)
    
    def is_blacklisted(self, token: str) -> bool:
        return token in self.blacklisted_tokens


token_blacklist = TokenBlacklist()

# ✅ ADD THIS
rate_limiter = EnhancedRateLimiter()
