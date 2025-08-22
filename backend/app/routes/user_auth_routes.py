# backend/app/routes/user_auth_routes.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from bson import ObjectId

from app.models.user import UserCreate, UserLogin, ProfileUpdate
from app.services.user_auth_service import (
    create_user, authenticate_user,
    create_access_token, create_refresh_token,
    verify_token, get_user_by_id,
    get_current_active_user, security
)
from app.database.mongo import users_collection

router = APIRouter()

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
            "tokens": {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="Registration failed")

# --- LOGIN ---
@router.post("/auth/login", response_model=dict)
async def login(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user["_id"]})
    refresh_token = create_refresh_token(data={"sub": user["_id"]})
    return {"message": "Login successful", "user": user, "tokens": {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}}

# --- PROFILE ---
@router.get("/auth/me", response_model=dict)
async def me(current_user: dict = Depends(get_current_active_user)):
    return current_user

@router.put("/auth/profile", response_model=dict)
async def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_active_user)):
    update_data = {k: v for k, v in profile_data.dict(exclude_none=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc)
    await users_collection.update_one({"_id": ObjectId(current_user["_id"])}, {"$set": update_data})
    updated_user = await get_user_by_id(current_user["_id"])
    return {"message": "Profile updated successfully", "user": updated_user}

@router.delete("/auth/account", response_model=dict)
async def delete_account(current_user: dict = Depends(get_current_active_user)):
    update_data = {"is_active": False, "deleted_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc)}
    await users_collection.update_one({"_id": ObjectId(current_user["_id"])}, {"$set": update_data})
    return {"message": "Account deactivated successfully"}
