from fastapi import APIRouter, HTTPException
from app.database.mongo import blogs_collection
from bson import ObjectId
from typing import List

router = APIRouter()

@router.get("/history")
async def get_blog_history():
    """Fetches a list of the 50 most recent blog posts."""
    try:
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
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@router.get("/blog/{blog_id}")
async def get_blog_by_id(blog_id: str):
    """Fetches a single, complete blog post by its ID."""
    try:
        obj_id = ObjectId(blog_id)
        blog = await blogs_collection.find_one({"_id": obj_id})
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Convert ObjectId to string for the JSON response
        blog["_id"] = str(blog["_id"])
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog: {e}")