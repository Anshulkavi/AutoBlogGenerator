from fastapi import APIRouter, HTTPException
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog

router = APIRouter()

@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    try:
        # 🔠 Generate blog content
        blog = generate_blog(req.topic)

        # ✅ Return full blog with image
        return {
               "title": blog["title"],
               "content": blog["content"],
               "topic": req.topic  # 🟢 Add this line
            } 


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
