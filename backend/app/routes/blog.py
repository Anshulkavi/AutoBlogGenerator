# Replace your current blog route with this enhanced version
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection
from datetime import datetime, timezone
from bson import ObjectId
import traceback
import logging
import sys

# Set up logging with more detailed configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate_blog")
async def generate_blog_route(req: BlogRequest):
    """Generate and save blog with comprehensive error handling and detailed logging"""
    
    # Ensure we ALWAYS return a JSON response
    try:
        # Log the incoming request with full details
        logger.info(f"🚀 Blog generation request received")
        logger.info(f"📝 Request topic: '{req.topic}'")
        logger.info(f"📝 Request type: {type(req)}")
        logger.info(f"📝 Request dict: {req.dict() if hasattr(req, 'dict') else 'No dict method'}")
        
        # Validate input
        if not req or not hasattr(req, 'topic'):
            logger.error("❌ Invalid request object")
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Invalid request", 
                    "details": "Request missing topic field",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )
        
        if not req.topic or not req.topic.strip():
            logger.error("❌ Empty topic provided")
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Topic is required", 
                    "details": "Topic cannot be empty",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )
        
        topic = req.topic.strip()
        logger.info(f"📝 Processing topic: '{topic}' (length: {len(topic)})")
        
        # Step 1: Generate blog content with detailed logging
        logger.info("🤖 Starting AI blog generation...")
        blog = None
        
        try:
            logger.info("🔄 Calling generate_blog function...")
            blog = await generate_blog(topic)
            logger.info(f"✅ AI generation completed. Result type: {type(blog)}")
            logger.info(f"📊 Blog keys: {list(blog.keys()) if isinstance(blog, dict) else 'Not a dict'}")
            
        except Exception as ai_error:
            logger.error(f"❌ AI generation failed: {str(ai_error)}")
            logger.error(f"❌ AI error type: {type(ai_error)}")
            logger.error(f"❌ AI error traceback: {traceback.format_exc()}")
            
            # Create fallback response
            fallback_blog = {
                "title": f"Guide to {topic.title()}",
                "content": f"""# {topic.title()}

This is a comprehensive guide about {topic}. We're currently experiencing technical difficulties with our AI service, but here's a basic outline to get you started.

## Introduction
{topic} is an important topic worth exploring in today's rapidly changing world.

## Key Points
- Understanding the fundamentals of {topic}
- Practical applications and real-world examples
- Getting started with {topic}
- Best practices and tips

## Benefits of Learning About {topic}
Learning about {topic} can provide valuable insights and help you stay informed about current trends and developments.

## Conclusion
This covers the fundamentals of {topic}. For more detailed information, consider researching from additional sources and expert opinions.""",
                "topic": topic,
                "_id": "fallback-" + str(int(datetime.now().timestamp())),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "note": "Generated as fallback due to AI service error"
            }
            
            logger.info("✅ Returning fallback blog response")
            return JSONResponse(
                status_code=200,
                content=fallback_blog
            )
        
        # Validate blog content
        if not blog:
            logger.error("❌ Blog is None or empty")
            raise Exception("Blog generation returned None")
        
        if not isinstance(blog, dict):
            logger.error(f"❌ Invalid blog type: {type(blog)}, content: {str(blog)[:200]}")
            raise Exception(f"Invalid blog data structure: expected dict, got {type(blog)}")
        
        if not blog.get("title"):
            logger.error(f"❌ Missing title in blog. Keys: {list(blog.keys())}")
            raise Exception("Blog missing title")
            
        if not blog.get("content"):
            logger.error(f"❌ Missing content in blog. Keys: {list(blog.keys())}")
            raise Exception("Blog missing content")
        
        logger.info(f"✅ Blog validation passed. Title: '{blog['title'][:50]}...', Content length: {len(blog['content'])}")
        
        # Step 2: Prepare for database
        blog_data = {
            "title": str(blog["title"]).strip(),
            "content": str(blog["content"]).strip(),
            "topic": topic,
            "created_at": datetime.now(timezone.utc)
        }
        
        logger.info("💾 Attempting to save to database...")
        
        # Step 3: Save to database with error handling
        try:
            if blogs_collection is None:
                logger.warning("⚠️ Database collection is None, skipping save")
                blog_data["_id"] = "no-db-" + str(int(datetime.now().timestamp()))
                blog_data["note"] = "Database not available"
            else:
                result = await blogs_collection.insert_one(blog_data)
                blog_data["_id"] = str(result.inserted_id)
                logger.info(f"✅ Saved to database with ID: {result.inserted_id}")
                
        except Exception as db_error:
            logger.error(f"❌ Database save failed: {str(db_error)}")
            logger.error(f"❌ Database error traceback: {traceback.format_exc()}")
            # Still return the blog even if DB save fails
            blog_data["_id"] = "temp-" + str(int(datetime.now().timestamp()))
            blog_data["note"] = "Generated successfully but not saved to database"
        
        # Convert datetime to string for JSON serialization
        blog_data["created_at"] = blog_data["created_at"].isoformat()
        
        # Step 4: Return success response
        logger.info("✅ Blog generation completed successfully")
        logger.info(f"📤 Returning response with keys: {list(blog_data.keys())}")
        
        response = JSONResponse(
            status_code=200,
            content=blog_data
        )
        logger.info("✅ JSONResponse created successfully")
        return response
        
    except Exception as e:
        # Catch any unhandled errors
        error_msg = str(e)
        logger.error(f"❌ CRITICAL: Unhandled error in generate_blog_route: {error_msg}")
        logger.error(f"❌ Error type: {type(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        
        # ALWAYS return a JSON response, never let it be empty
        error_response = {
            "error": "Blog generation failed",
            "details": error_msg,
            "error_type": str(type(e)),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "debug_info": "Check server logs for full traceback"
        }
        
        logger.error(f"📤 Returning error response: {error_response}")
        
        return JSONResponse(
            status_code=500,
            content=error_response
        )

# Add a simple test endpoint with detailed logging
@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify basic functionality"""
    logger.info("🧪 Test endpoint called")
    
    try:
        response_data = {
            "message": "Backend is working perfectly",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "ok",
            "test_number": 12345
        }
        
        logger.info(f"✅ Test endpoint returning: {response_data}")
        return JSONResponse(content=response_data)
        
    except Exception as e:
        logger.error(f"❌ Test endpoint error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Test endpoint failed",
                "details": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

# Add health check with detailed system info
@router.get("/health")
async def health_check():
    """Health check endpoint with detailed system information"""
    logger.info("🏥 Health check called")
    
    try:
        import os
        import sys
        
        health_data = {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "service": "blog-generator",
            "python_version": sys.version,
            "environment": {
                "GOOGLE_API_KEY": "Set" if os.getenv("GOOGLE_API_KEY") else "Missing",
                "MONGODB_URL": "Set" if os.getenv("MONGODB_URL") else "Missing"
            }
        }
        
        logger.info(f"✅ Health check returning: {health_data}")
        return JSONResponse(content=health_data)
        
    except Exception as e:
        logger.error(f"❌ Health check error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

# Add a debug endpoint to test blog generation without database
@router.post("/debug_generate")
async def debug_generate(req: BlogRequest):
    """Debug endpoint to test blog generation without database operations"""
    logger.info(f"🐛 Debug generate called with topic: '{req.topic}'")
    
    try:
        if not req.topic or not req.topic.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Topic required", "timestamp": datetime.now(timezone.utc).isoformat()}
            )
        
        topic = req.topic.strip()
        logger.info(f"🤖 Generating blog for debug: '{topic}'")
        
        # Try to generate blog
        blog = await generate_blog(topic)
        
        # Return without saving to database
        result = {
            "title": blog.get("title", "No title"),
            "content": blog.get("content", "No content"),
            "topic": topic,
            "_id": "debug-" + str(int(datetime.now().timestamp())),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "debug": True
        }
        
        logger.info("✅ Debug generation successful")
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"❌ Debug generate error: {str(e)}")
        logger.error(f"❌ Debug traceback: {traceback.format_exc()}")
        
        return JSONResponse(
            status_code=500,
            content={
                "error": "Debug generation failed",
                "details": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )