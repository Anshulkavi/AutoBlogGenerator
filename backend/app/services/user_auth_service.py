# from datetime import datetime, timedelta, timezone
# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from app.database.mongo import users_collection, str_id
# from app.models.user import UserCreate, UserInDB
# from bson import ObjectId
# import os

# # --- Config ---
# SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# security = HTTPBearer()

# # --- Password utils ---
# def get_password_hash(password: str):
#     return pwd_context.hash(password)

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# # --- Create user ---
# async def create_user(user: UserCreate, is_admin: bool = False):
#     existing = await users_collection.find_one({"email": user.email})
#     if existing:
#         raise ValueError("Email already registered")

#     hashed_pw = get_password_hash(user.password)
#     user_doc = {
#         "email": user.email,
#         "password": hashed_pw,
#         "full_name": user.full_name,
#         "is_admin": is_admin,
#         "is_active": True,
#         "created_at": datetime.utcnow(),
#     }
#     result = await users_collection.insert_one(user_doc)
#     new_user = await users_collection.find_one({"_id": result.inserted_id})
#     return str_id(new_user)

# # --- Auth helpers (login etc.) ---
# async def authenticate_user(email: str, password: str):
#     user = await users_collection.find_one({"email": email})
#     if not user or not verify_password(password, user["password"]):
#         return None
#     return str_id(user)

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def create_refresh_token(data: dict):
#     expire = datetime.utcnow() + timedelta(days=7)
#     to_encode = data.copy()
#     to_encode.update({"exp": expire, "type": "refresh"})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def verify_token(token: str, expected_type: str = "access"):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         if expected_type == "refresh" and payload.get("type") != "refresh":
#             return None
#         return payload
#     except JWTError:
#         return None

# async def get_user_by_id(user_id: str):
#     user = await users_collection.find_one({"_id": ObjectId(user_id)})
#     return str_id(user) if user else None

# async def get_current_active_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     token = credentials.credentials
#     payload = verify_token(token)
#     if not payload or "sub" not in payload:
#         raise HTTPException(status_code=401, detail="Invalid token")
#     user = await get_user_by_id(payload["sub"])
#     if not user or not user.get("is_active", False):
#         raise HTTPException(status_code=401, detail="Inactive user")
#     return user

# async def get_current_admin_user(current_user: dict = Depends(get_current_active_user)):
#     if not current_user.get("is_admin", False):
#         raise HTTPException(status_code=403, detail="Admins only")
#     return current_user

from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.database.mongo import users_collection, str_id
from app.models.user import UserCreate
from bson import ObjectId
from typing import Optional
import os

# --- Config ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# --- Password utils ---
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- Create user ---
async def create_user(user: UserCreate, is_admin: bool = False):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise ValueError("Email already registered")

    hashed_pw = get_password_hash(user.password)
    user_doc = {
        "email": user.email,
        "password": hashed_pw,
        "full_name": user.full_name,
        "is_admin": is_admin,
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    result = await users_collection.insert_one(user_doc)
    new_user = await users_collection.find_one({"_id": result.inserted_id})
    return str_id(new_user)

# --- Auth helpers ---
async def authenticate_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return None
    return str_id(user)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, expected_type: str = "access"):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if expected_type == "refresh" and payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None

async def get_user_by_id(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return str_id(user) if user else None

async def get_current_active_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await get_user_by_id(payload["sub"])
    if not user or not user.get("is_active", False):
        raise HTTPException(status_code=401, detail="Inactive user")
    return user

async def get_current_admin_user(current_user: dict = Depends(get_current_active_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

# --- NEW: Optional User Auth ---
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
):
    if credentials is None:
        return None
    token = credentials.credentials
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        return None
    user = await get_user_by_id(payload["sub"])
    return user

# --- NEW: Dummy Rate Limiter ---
class DummyRateLimiter:
    async def is_allowed(self, user_id: str) -> bool:
        return True

rate_limiter = DummyRateLimiter()
