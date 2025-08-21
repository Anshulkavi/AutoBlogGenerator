from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
import traceback
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# ✅ Helper to ensure consistent JSON errors
def error_response(message: str, details: str = "", status_code: int = 500):
    error_data = {
        "error": message,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    logger.error(f"Error Response: {error_data}")
    return JSONResponse(
        status_code=status_code,
        content=error_data
    )

# ✅ Test endpoint to verify API is working
@router.get("/health")
async def health_check():
    return JSONResponse(content={
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "message": "Blog API is running"
    })

# -------------------- Generate + Save Blog --------------------
@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    logger.info(f"🚀 Starting blog generation for topic: {req.topic}")
    
    try:
        # Validate input
        if not req.topic or not req.topic.strip():
            logger.warning("❌ Empty topic provided")
            return error_response("Topic is required and cannot be empty", status_code=400)
        
        topic = req.topic.strip()
        logger.info(f"📝 Processing topic: '{topic}'")
        
        # 🧠 Generate blog
        logger.info("🤖 Calling AI to generate blog content...")
        blog = await generate_blog(topic)
        logger.info(f"✅ Blog generated successfully. Title: {blog.get('title', 'No title')[:50]}...")
        
        # Validate blog generation result
        if not blog or not isinstance(blog, dict):
            logger.error("❌ Blog generation returned invalid data structure")
            return error_response("Blog generation failed - invalid response from AI")
        
        if not blog.get("title") or not blog.get("content"):
            logger.error(f"❌ Blog missing required fields. Keys: {list(blog.keys())}")
            return error_response("Blog generation failed - missing title or content")

        # ⏳ Prepare blog document
        blog_data = {
            "title": str(blog["title"]).strip(),
            "content": str(blog["content"]).strip(),
            "topic": topic,
            "created_at": datetime.now(timezone.utc)
        }
        
        logger.info("💾 Saving blog to MongoDB...")

        # 💾 Store in MongoDB
        try:
            result = await blogs_collection.insert_one(blog_data)
            logger.info(f"✅ Blog saved with ID: {result.inserted_id}")
        except Exception as db_error:
            logger.error(f"❌ Database error: {str(db_error)}")
            return error_response("Failed to save blog to database", str(db_error))

        # 🆔 Add inserted ID to response
        blog_data["_id"] = str(result.inserted_id)
        blog_data["created_at"] = blog_data["created_at"].isoformat()

        logger.info("✅ Blog generation and save completed successfully")
        return JSONResponse(content=blog_data)

    except Exception as e:
        logger.error(f"❌ Unexpected error in generate_blog_route: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        return error_response("Failed to generate and save blog", str(e))

# -------------------- Get Blog by ID --------------------
@router.get("/blog/{id}")
async def get_blog_by_id(id: str):
    logger.info(f"📖 Fetching blog with ID: {id}")
    
    try:
        # Validate ObjectId format
        try:
            object_id = ObjectId(id)
        except InvalidId:
            logger.warning(f"❌ Invalid ObjectId format: {id}")
            return error_response("Invalid blog ID format", status_code=400)
        
        blog = await blogs_collection.find_one({"_id": object_id})
        if not blog:
            logger.info(f"❌ Blog not found with ID: {id}")
            return error_response("Blog not found", status_code=404)
        
        # Convert ObjectId to string for JSON serialization
        blog["_id"] = str(blog["_id"])
        if "created_at" in blog and hasattr(blog["created_at"], "isoformat"):
            blog["created_at"] = blog["created_at"].isoformat()
        
        logger.info(f"✅ Blog retrieved successfully: {blog.get('title', 'No title')[:50]}...")
        return JSONResponse(content=blog)

    except Exception as e:
        logger.error(f"❌ Error in get_blog_by_id: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        return error_response("Failed to fetch blog", str(e))

# -------------------- Get All Blogs --------------------
@router.get("/blogs")
async def get_all_blogs():
    logger.info("📚 Fetching all blogs")
    
    try:
        blogs = await blogs_collection.find().sort("created_at", -1).to_list(100)
        logger.info(f"✅ Found {len(blogs)} blogs")
        
        # Convert ObjectIds and dates to strings
        for blog in blogs:
            blog["_id"] = str(blog["_id"])
            if "created_at" in blog and hasattr(blog["created_at"], "isoformat"):
                blog["created_at"] = blog["created_at"].isoformat()
        
        return JSONResponse(content={"blogs": blogs, "count": len(blogs)})

    except Exception as e:
        logger.error(f"❌ Error in get_all_blogs: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        return error_response("Failed to fetch blogs", str(e))

# -------------------- Generate Blog (No Save) --------------------
@router.post("/generate")
async def generate_blog_endpoint(req: BlogRequest):
    logger.info(f"🚀 Generating blog without saving for topic: {req.topic}")
    
    try:
        # Validate input
        if not req.topic or not req.topic.strip():
            logger.warning("❌ Empty topic provided")
            return error_response("Topic is required and cannot be empty", status_code=400)
        
        topic = req.topic.strip()
        logger.info(f"📝 Processing topic: '{topic}'")
        
        # Generate blog
        logger.info("🤖 Calling AI to generate blog content...")
        blog = await generate_blog(topic)
        logger.info(f"✅ Blog generated successfully. Title: {blog.get('title', 'No title')[:50]}...")
        
        # Validate blog generation result
        if not blog or not isinstance(blog, dict):
            logger.error("❌ Blog generation returned invalid data structure")
            return error_response("Blog generation failed - invalid response from AI")
        
        if not blog.get("title") or not blog.get("content"):
            logger.error(f"❌ Blog missing required fields. Keys: {list(blog.keys())}")
            return error_response("Blog generation failed - missing title or content")
        
        # Add metadata
        response_data = {
            "title": str(blog["title"]).strip(),
            "content": str(blog["content"]).strip(),
            "topic": topic,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
        logger.info("✅ Blog generation completed successfully")
        return JSONResponse(content=response_data)
        
    except Exception as e:
        logger.error(f"❌ Unexpected error in generate_blog_endpoint: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        return error_response("Failed to generate blog", str(e))

# -------------------- Delete Blog --------------------
@router.delete("/blog/{id}")
async def delete_blog(id: str):
    logger.info(f"🗑️ Deleting blog with ID: {id}")
    
    try:
        # Validate ObjectId format
        try:
            object_id = ObjectId(id)
        except InvalidId:
            logger.warning(f"❌ Invalid ObjectId format: {id}")
            return error_response("Invalid blog ID format", status_code=400)
        
        result = await blogs_collection.delete_one({"_id": object_id})
        
        if result.deleted_count == 0:
            logger.info(f"❌ Blog not found for deletion: {id}")
            return error_response("Blog not found", status_code=404)
        
        logger.info(f"✅ Blog deleted successfully: {id}")
        return JSONResponse(content={
            "message": "Blog deleted successfully",
            "deleted_id": id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    except Exception as e:
        logger.error(f"❌ Error in delete_blog: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        return error_response("Failed to delete blog", str(e))