# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from app.database.mongo import users_collection

from services.auth import (
    UserCreate, UserLogin,
    create_user, authenticate_user,
    create_access_token, create_refresh_token,
    verify_token, get_user_by_id,
    get_current_active_user, security
)

router = APIRouter()

# --- Pydantic model for profile update ---
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)

# ---------------- REGISTER ----------------
@router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    try:
        user = await create_user(user_data)
        access_token = create_access_token(data={"sub": str(user["_id"])})
        refresh_token = create_refresh_token(data={"sub": str(user["_id"])})
        return {
            "message": "User registered successfully",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "full_name": user["full_name"],
                "is_active": user["is_active"],
                "created_at": user["created_at"]
            },
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# ---------------- LOGIN ----------------
@router.post("/auth/login", response_model=dict)
async def login(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.get("is_active", False):
        raise HTTPException(status_code=400, detail="Inactive user account")

    access_token = create_access_token(data={"sub": str(user["_id"])})
    refresh_token = create_refresh_token(data={"sub": str(user["_id"])})

    return {
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "is_active": user["is_active"]
        },
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    }

# ---------------- REFRESH TOKEN ----------------
@router.post("/auth/refresh", response_model=dict)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=401, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"}
    )
    token = credentials.credentials
    payload = verify_token(token, "refresh")
    if not payload or "sub" not in payload:
        raise credentials_exception

    user = await get_user_by_id(payload["sub"])
    if not user or not user.get("is_active", False):
        raise credentials_exception

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------- CURRENT USER ----------------
@router.get("/auth/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    return {
        "user": {
            "id": str(current_user["_id"]),
            "email": current_user["email"],
            "full_name": current_user["full_name"],
            "is_active": current_user["is_active"],
            "created_at": current_user["created_at"]
        }
    }

# ---------------- LOGOUT ----------------
@router.post("/auth/logout", response_model=dict)
async def logout(current_user: dict = Depends(get_current_active_user)):
    # Placeholder: implement JWT blacklist if needed
    return {"message": "Logged out successfully"}

# ---------------- UPDATE PROFILE ----------------
@router.put("/auth/profile", response_model=dict)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    update_data = {k: v for k, v in profile_data.dict(exclude_none=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes made")

    updated_user = await get_user_by_id(str(current_user["_id"]))
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": str(updated_user["_id"]),
            "email": updated_user["email"],
            "full_name": updated_user["full_name"],
            "is_active": updated_user["is_active"],
            "created_at": updated_user["created_at"]
        }
    }

# ---------------- DELETE ACCOUNT ----------------
@router.delete("/auth/account", response_model=dict)
async def delete_account(current_user: dict = Depends(get_current_active_user)):
    update_data = {
        "is_active": False,
        "deleted_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to deactivate account")
    return {"message": "Account deactivated successfully"}
