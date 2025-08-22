# backend/app/routes/user_auth_routes.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import logging

from app.models.user import UserCreate, UserLogin, ProfileUpdate
from app.services.user_auth_service import (
    create_user, authenticate_user,
    create_access_token, create_refresh_token,
    verify_token, get_user_by_id,
    get_current_active_user, security, ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.database.mongo import users_collection

router = APIRouter()
logger = logging.getLogger(__name__)

# --- REGISTER ---
@router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    try:
        user = await create_user(user_data)
        access_token = create_access_token(data={"sub": user["_id"]})
        refresh_token = create_refresh_token(data={"sub": user["_id"]})
        return {
            "message": "User registered successfully",
            "user": user,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception("Registration failed: %s", e)
        raise HTTPException(status_code=500, detail="Registration failed")

# --- LOGIN ---
@router.post("/auth/login", response_model=dict)
async def login(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user["_id"]})
    refresh_token = create_refresh_token(data={"sub": user["_id"]})

    return {
        "message": "Login successful",
        "user": user,
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    }

# --- PROFILE ---
@router.get("/auth/me", response_model=dict)
async def me(current_user: dict = Depends(get_current_active_user)):
    return current_user

@router.put("/auth/profile", response_model=dict)
async def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_active_user)):
    update_data = {k: v for k, v in profile_data.dict(exclude_none=True).items()}

    # Prevent critical field changes (optional)
    restricted = {"email", "password"}
    for field in restricted:
        if field in update_data:
            raise HTTPException(status_code=400, detail=f"Cannot update {field} here")

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    update_data["updated_at"] = datetime.now(timezone.utc)
    await users_collection.update_one({"_id": ObjectId(current_user["_id"])}, {"$set": update_data})

    updated_user = await get_user_by_id(current_user["_id"])
    return {"message": "Profile updated successfully", "user": updated_user}

@router.delete("/auth/account", response_model=dict)
async def delete_account(current_user: dict = Depends(get_current_active_user)):
    update_data = {
        "is_active": False,
        "deleted_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await users_collection.update_one({"_id": ObjectId(current_user["_id"])}, {"$set": update_data})
    return {"message": "Account deactivated successfully"}

# --- REFRESH TOKEN ---
@router.post("/auth/refresh", response_model=dict)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token, "refresh")
    
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user = await get_user_by_id(payload["sub"])
    if not user or not user.get("is_active", False):
        raise HTTPException(status_code=401, detail="Inactive user")
    
    new_access_token = create_access_token(data={"sub": user["_id"]})
    new_refresh_token = create_refresh_token(data={"sub": user["_id"]})
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

# --- LOGOUT ---
@router.post("/auth/logout", response_model=dict)
async def logout(current_user: dict = Depends(get_current_active_user)):
    # TODO: Blacklist the access token in DB/Redis
    return {"message": "Logged out successfully"}
