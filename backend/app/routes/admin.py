from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database.mongo import users_collection, str_id
from app.models.user import UserCreate
from app.services.user_auth_service import create_user, get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ✅ Register Admin
@router.post("/register")
async def register_admin(user: UserCreate):
    admin = await create_user(user, is_admin=True)
    return {"message": "Admin registered successfully", "user": admin}

# ✅ List all users
@router.get("/users")
async def list_users(current_admin: dict = Depends(get_current_admin_user)):
    users = []
    async for u in users_collection.find({}):
        users.append(str_id(u))
    return {"users": users}

# ✅ Promote user to admin
@router.put("/promote/{user_id}")
async def promote_user(user_id: str, current_admin: dict = Depends(get_current_admin_user)):
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"is_admin": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User promoted to admin"}
