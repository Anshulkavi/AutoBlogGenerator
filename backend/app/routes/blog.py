from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter()

# ✅ Helper to ensure consistent JSON errors
def error_response(message: str, details: str = ""):
    return JSONResponse(
        status_code=500,
        content={
            "error": message,
            "details": details
        }
    )

# -------------------- Generate + Save Blog --------------------
@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    try:
        # 🧠 Generate blog
        blog = await generate_blog(req.topic)

        # ⏳ Prepare blog document
        blog_data = {
            "title": blog["title"],
            "content": blog["content"],
            "topic": req.topic,
            "created_at": datetime.now(timezone.utc)
        }

        # 💾 Store in MongoDB
        result = await blogs_collection.insert_one(blog_data)

        # 🆔 Add inserted ID to response
        blog_data["_id"] = str(result.inserted_id)

        return JSONResponse(content=blog_data)

    except Exception as e:
        print("❌ Error while generating/saving blog:", str(e))
        return JSONResponse(
           status_code=500,
           content={
              "error": "Failed to generate blog",
              "details": str(e)
           }
        )
# -------------------- Get Blog by ID --------------------
@router.get("/blog/{id}")
async def get_blog_by_id(id: str):
    try:
        blog = await blogs_collection.find_one({"_id": ObjectId(id)})
        if not blog:
            return JSONResponse(
                status_code=404,
                content={"error": "Blog not found"}
            )
        
        blog["_id"] = str(blog["_id"])
        return JSONResponse(content=blog)

    except Exception as e:
        return JSONResponse(
        status_code=500,
        content={
            "error": "Failed to generate blog",
            "details": str(e)
        }
    )
# -------------------- Generate Blog (No Save) --------------------
@router.post("/generate")
async def generate_blog_endpoint(req: BlogRequest):
    try:
        blog = await generate_blog(req.topic)
        return JSONResponse(content=blog)
    except Exception as e:
        print("❌ Error while generating/saving blog:", str(e))
        return JSONResponse(
        status_code=500,
        content={
            "error": "Failed to generate blog",
            "details": str(e)
        }
    )