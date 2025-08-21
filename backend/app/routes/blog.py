# Replace your current blog route with this version
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId
import traceback
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    """Generate and save blog with comprehensive error handling"""
    
    # Log the incoming request
    logger.info(f"🚀 Blog generation request received: {req.topic}")
    
    try:
        # Validate input
        if not req.topic or not req.topic.strip():
            logger.error("❌ Empty topic provided")
            return JSONResponse(
                status_code=400,
                content={"error": "Topic is required", "details": "Topic cannot be empty"}
            )
        
        topic = req.topic.strip()
        logger.info(f"📝 Processing topic: '{topic}'")
        
        # Step 1: Generate blog content
        logger.info("🤖 Starting AI blog generation...")
        try:
            blog = await generate_blog(topic)
            logger.info("✅ AI generation completed")
        except Exception as ai_error:
            logger.error(f"❌ AI generation failed: {str(ai_error)}")
            logger.error(f"❌ AI error traceback: {traceback.format_exc()}")
            
            # Return fallback response instead of empty
            return JSONResponse(content={
                "title": f"Guide to {topic.title()}",
                "content": f"# {topic.title()}\n\nThis is a comprehensive guide about {topic}. We're currently experiencing technical difficulties with our AI service, but here's a basic outline to get you started.\n\n## Introduction\n{topic} is an important topic worth exploring.\n\n## Key Points\n- Understanding the basics\n- Practical applications\n- Getting started\n\n## Conclusion\nThis covers the fundamentals of {topic}.",
                "topic": topic,
                "_id": "fallback-" + str(int(datetime.now().timestamp())),
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Validate blog content
        if not blog or not isinstance(blog, dict):
            logger.error("❌ Invalid blog structure returned")
            raise Exception("Invalid blog data structure")
        
        if not blog.get("title") or not blog.get("content"):
            logger.error(f"❌ Missing required fields in blog: {list(blog.keys())}")
            raise Exception("Blog missing title or content")
        
        # Step 2: Prepare for database
        blog_data = {
            "title": str(blog["title"]).strip(),
            "content": str(blog["content"]).strip(),
            "topic": topic,
            "created_at": datetime.now(timezone.utc)
        }
        
        logger.info("💾 Saving to database...")
        
        # Step 3: Save to database
        try:
            result = await blogs_collection.insert_one(blog_data)
            blog_data["_id"] = str(result.inserted_id)
            blog_data["created_at"] = blog_data["created_at"].isoformat()
            logger.info(f"✅ Saved to database with ID: {result.inserted_id}")
        except Exception as db_error:
            logger.error(f"❌ Database save failed: {str(db_error)}")
            # Still return the blog even if DB save fails
            blog_data["_id"] = "temp-" + str(int(datetime.now().timestamp()))
            blog_data["created_at"] = datetime.now(timezone.utc).isoformat()
            blog_data["note"] = "Generated successfully but not saved to database"
        
        # Step 4: Return success response
        logger.info("✅ Blog generation completed successfully")
        return JSONResponse(content=blog_data)
        
    except Exception as e:
        # Catch any unhandled errors
        error_msg = str(e)
        logger.error(f"❌ Unhandled error in generate_blog_route: {error_msg}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        
        # Always return a JSON response, never empty
        return JSONResponse(
            status_code=500,
            content={
                "error": "Blog generation failed",
                "details": error_msg,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

# Add a simple test endpoint
@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify basic functionality"""
    return JSONResponse(content={
        "message": "Backend is working",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "ok"
    })

# Add health check
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(content={
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "blog-generator"
    })