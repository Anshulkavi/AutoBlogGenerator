from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()

# ✅ Helper to ensure consistent JSON errors
def error_response(message: str, details: str = "", status_code: int = 500):
    return JSONResponse(
        status_code=status_code,
        content={
            "error": message,
            "details": details
        }
    )

# -------------------- Generate + Save Blog --------------------
@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    try:
        # Validate input
        if not req.topic or not req.topic.strip():
            return error_response("Topic is required", status_code=400)
        
        # 🧠 Generate blog
        blog = await generate_blog(req.topic.strip())
        
        # Validate blog generation result
        if not blog or not isinstance(blog, dict):
            return error_response("Blog generation failed - invalid response")
        
        if not blog.get("title") or not blog.get("content"):
            return error_response("Blog generation failed - missing title or content")

        # ⏳ Prepare blog document
        blog_data = {
            "title": blog["title"],
            "content": blog["content"],
            "topic": req.topic.strip(),
            "created_at": datetime.now(timezone.utc)
        }

        # 💾 Store in MongoDB
        result = await blogs_collection.insert_one(blog_data)

        # 🆔 Add inserted ID to response
        blog_data["_id"] = str(result.inserted_id)

        return JSONResponse(content=blog_data)

    except Exception as e:
        print(f"❌ Error while generating/saving blog: {str(e)}")
        return error_response("Failed to generate and save blog", str(e))

# -------------------- Get Blog by ID --------------------
@router.get("/blog/{id}")
async def get_blog_by_id(id: str):
    try:
        # Validate ObjectId format
        try:
            object_id = ObjectId(id)
        except InvalidId:
            return error_response("Invalid blog ID format", status_code=400)
        
        blog = await blogs_collection.find_one({"_id": object_id})
        if not blog:
            return error_response("Blog not found", status_code=404)
        
        # Convert ObjectId to string for JSON serialization
        blog["_id"] = str(blog["_id"])
        return JSONResponse(content=blog)

    except Exception as e:
        print(f"❌ Error while fetching blog: {str(e)}")
        return error_response("Failed to fetch blog", str(e))

# -------------------- Get All Blogs --------------------
@router.get("/blogs")
async def get_all_blogs():
    try:
        blogs = await blogs_collection.find().sort("created_at", -1).to_list(100)
        
        # Convert ObjectIds to strings
        for blog in blogs:
            blog["_id"] = str(blog["_id"])
        
        return JSONResponse(content={"blogs": blogs})

    except Exception as e:
        print(f"❌ Error while fetching blogs: {str(e)}")
        return error_response("Failed to fetch blogs", str(e))

# -------------------- Generate Blog (No Save) --------------------
@router.post("/generate")
async def generate_blog_endpoint(req: BlogRequest):
    try:
        # Validate input
        if not req.topic or not req.topic.strip():
            return error_response("Topic is required", status_code=400)
        
        blog = await generate_blog(req.topic.strip())
        
        # Validate blog generation result
        if not blog or not isinstance(blog, dict):
            return error_response("Blog generation failed - invalid response")
        
        if not blog.get("title") or not blog.get("content"):
            return error_response("Blog generation failed - missing title or content")
        
        return JSONResponse(content=blog)
        
    except Exception as e:
        print(f"❌ Error while generating blog: {str(e)}")
        return error_response("Failed to generate blog", str(e))

# -------------------- Delete Blog --------------------
@router.delete("/blog/{id}")
async def delete_blog(id: str):
    try:
        # Validate ObjectId format
        try:
            object_id = ObjectId(id)
        except InvalidId:
            return error_response("Invalid blog ID format", status_code=400)
        
        result = await blogs_collection.delete_one({"_id": object_id})
        
        if result.deleted_count == 0:
            return error_response("Blog not found", status_code=404)
        
        return JSONResponse(content={"message": "Blog deleted successfully"})

    except Exception as e:
        print(f"❌ Error while deleting blog: {str(e)}")
        return error_response("Failed to delete blog", str(e))