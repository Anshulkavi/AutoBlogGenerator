# from fastapi import APIRouter
# from app.database.mongo import db
# from app.models.blog_entry import BlogEntry
# from datetime import datetime

# router = APIRouter()

# @router.post("/history/save")
# async def save_blog(entry: BlogEntry):
#     entry_dict = entry.dict()
#     entry_dict["created_at"] = datetime.utcnow()
#     await db.blogs.insert_one(entry_dict)
#     return {"message": "Blog saved successfully"}

# @router.get("/history")
# async def get_blogs():
#     cursor = db.blogs.find().sort("created_at", -1)
#     blogs = []
#     async for blog in cursor:
#         blog["_id"] = str(blog["_id"])  # Convert ObjectId to string
#         blogs.append(blog)
#     return blogs


# backend/app/routes/history.py

from fastapi import APIRouter, HTTPException
from app.database.mongo import blogs_collection  # ✅ Use shared connection
from bson import ObjectId
from typing import List

router = APIRouter()

@router.get("/history")
async def get_blog_history():
    try:
        # 🧾 Fetch latest 50 blogs sorted by date
        blogs_cursor = blogs_collection.find(
            {},
            {"title": 1, "topic": 1, "created_at": 1}
        ).sort("created_at", -1).limit(50)

        blogs = []
        async for blog in blogs_cursor:
            blogs.append({
                "id": str(blog.get("_id")),
                "title": blog.get("title", "Untitled"),
                "topic": blog.get("topic", "Unknown"),
                "created_at": blog.get("created_at")
            })

        return {"history": blogs}

    except Exception as e:
        print("🔥 Error in /history:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch history")
