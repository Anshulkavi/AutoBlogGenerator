# from fastapi import APIRouter, HTTPException
# from app.models.blog_request import BlogRequest
# from app.services.blog_generator import generate_blog

# router = APIRouter()

# @router.post("/generate_blog")
# async def generate_blog_route(req: BlogRequest):
#     try:
#         # 🔠 Generate blog content
#         blog = generate_blog(req.topic)

#         # ✅ Return full blog with image
#         return {
#                "title": blog["title"],
#                "content": blog["content"],
#                "topic": req.topic  # 🟢 Add this line
#             } 


#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# backend/app/routes/blog.py

from fastapi import APIRouter, HTTPException
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter()

@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    try:
        # 🧠 Generate blog from Gemini or any logic
        blog = await generate_blog(req.topic)  # ⛔ If async, add "await"

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

        return blog_data

    except Exception as e:
        print("❌ Error while generating/saving blog:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate blog")

@router.get("/blog/{id}")
async def get_blog_by_id(id: str):
    try:
        blog = await blogs_collection.find_one({"_id": ObjectId(id)})
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        blog["_id"] = str(blog["_id"])
        return blog

    except Exception as e:
        print("❌ Error fetching blog by ID:", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch blog")
