# # Replace your current blog route with this enhanced version
# from fastapi import APIRouter, HTTPException
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.services.blog_generator import generate_blog
# from app.database.mongo import blogs_collection
# from datetime import datetime, timezone
# from bson import ObjectId
# import traceback
# import logging
# import sys

# # Set up logging with more detailed configuration
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.StreamHandler(sys.stdout),
#         logging.StreamHandler(sys.stderr)
#     ]
# )
# logger = logging.getLogger(__name__)

# router = APIRouter()

# @router.post("/generate_blog")
# async def generate_blog_route(req: BlogRequest):
#     """Generate and save blog with comprehensive error handling and detailed logging"""
    
#     # Ensure we ALWAYS return a JSON response
#     try:
#         # Log the incoming request with full details
#         logger.info(f"🚀 Blog generation request received")
#         logger.info(f"📝 Request topic: '{req.topic}'")
#         logger.info(f"📝 Request type: {type(req)}")
#         logger.info(f"📝 Request dict: {req.dict() if hasattr(req, 'dict') else 'No dict method'}")
        
#         # Validate input
#         if not req or not hasattr(req, 'topic'):
#             logger.error("❌ Invalid request object")
#             return JSONResponse(
#                 status_code=400,
#                 content={
#                     "error": "Invalid request", 
#                     "details": "Request missing topic field",
#                     "timestamp": datetime.now(timezone.utc).isoformat()
#                 }
#             )
        
#         if not req.topic or not req.topic.strip():
#             logger.error("❌ Empty topic provided")
#             return JSONResponse(
#                 status_code=400,
#                 content={
#                     "error": "Topic is required", 
#                     "details": "Topic cannot be empty",
#                     "timestamp": datetime.now(timezone.utc).isoformat()
#                 }
#             )
        
#         topic = req.topic.strip()
#         logger.info(f"📝 Processing topic: '{topic}' (length: {len(topic)})")
        
#         # Step 1: Generate blog content with detailed logging
#         logger.info("🤖 Starting AI blog generation...")
#         blog = None
        
#         try:
#             logger.info("🔄 Calling generate_blog function...")
#             blog = await generate_blog(topic)
#             logger.info(f"✅ AI generation completed. Result type: {type(blog)}")
#             logger.info(f"📊 Blog keys: {list(blog.keys()) if isinstance(blog, dict) else 'Not a dict'}")
            
#         except Exception as ai_error:
#             logger.error(f"❌ AI generation failed: {str(ai_error)}")
#             logger.error(f"❌ AI error type: {type(ai_error)}")
#             logger.error(f"❌ AI error traceback: {traceback.format_exc()}")
            
#             # Create fallback response
#             fallback_blog = {
#                 "title": f"Guide to {topic.title()}",
#                 "content": f"""# {topic.title()}

# This is a comprehensive guide about {topic}. We're currently experiencing technical difficulties with our AI service, but here's a basic outline to get you started.

# ## Introduction
# {topic} is an important topic worth exploring in today's rapidly changing world.

# ## Key Points
# - Understanding the fundamentals of {topic}
# - Practical applications and real-world examples
# - Getting started with {topic}
# - Best practices and tips

# ## Benefits of Learning About {topic}
# Learning about {topic} can provide valuable insights and help you stay informed about current trends and developments.

# ## Conclusion
# This covers the fundamentals of {topic}. For more detailed information, consider researching from additional sources and expert opinions.""",
#                 "topic": topic,
#                 "_id": "fallback-" + str(int(datetime.now().timestamp())),
#                 "created_at": datetime.now(timezone.utc).isoformat(),
#                 "note": "Generated as fallback due to AI service error"
#             }
            
#             logger.info("✅ Returning fallback blog response")
#             return JSONResponse(
#                 status_code=200,
#                 content=fallback_blog
#             )
        
#         # Validate blog content
#         if not blog:
#             logger.error("❌ Blog is None or empty")
#             raise Exception("Blog generation returned None")
        
#         if not isinstance(blog, dict):
#             logger.error(f"❌ Invalid blog type: {type(blog)}, content: {str(blog)[:200]}")
#             raise Exception(f"Invalid blog data structure: expected dict, got {type(blog)}")
        
#         if not blog.get("title"):
#             logger.error(f"❌ Missing title in blog. Keys: {list(blog.keys())}")
#             raise Exception("Blog missing title")
            
#         if not blog.get("content"):
#             logger.error(f"❌ Missing content in blog. Keys: {list(blog.keys())}")
#             raise Exception("Blog missing content")
        
#         logger.info(f"✅ Blog validation passed. Title: '{blog['title'][:50]}...', Content length: {len(blog['content'])}")
        
#         # Step 2: Prepare for database
#         blog_data = {
#             "title": str(blog["title"]).strip(),
#             "content": str(blog["content"]).strip(),
#             "topic": topic,
#             "created_at": datetime.now(timezone.utc)
#         }
        
#         logger.info("💾 Attempting to save to database...")
        
#         # Step 3: Save to database with error handling
#         try:
#             if blogs_collection is None:
#                 logger.warning("⚠️ Database collection is None, skipping save")
#                 blog_data["_id"] = "no-db-" + str(int(datetime.now().timestamp()))
#                 blog_data["note"] = "Database not available"
#             else:
#                 result = await blogs_collection.insert_one(blog_data)
#                 blog_data["_id"] = str(result.inserted_id)
#                 logger.info(f"✅ Saved to database with ID: {result.inserted_id}")
                
#         except Exception as db_error:
#             logger.error(f"❌ Database save failed: {str(db_error)}")
#             logger.error(f"❌ Database error traceback: {traceback.format_exc()}")
#             # Still return the blog even if DB save fails
#             blog_data["_id"] = "temp-" + str(int(datetime.now().timestamp()))
#             blog_data["note"] = "Generated successfully but not saved to database"
        
#         # Convert datetime to string for JSON serialization
#         blog_data["created_at"] = blog_data["created_at"].isoformat()
        
#         # Step 4: Return success response
#         logger.info("✅ Blog generation completed successfully")
#         logger.info(f"📤 Returning response with keys: {list(blog_data.keys())}")
        
#         response = JSONResponse(
#             status_code=200,
#             content=blog_data
#         )
#         logger.info("✅ JSONResponse created successfully")
#         return response
        
#     except Exception as e:
#         # Catch any unhandled errors
#         error_msg = str(e)
#         logger.error(f"❌ CRITICAL: Unhandled error in generate_blog_route: {error_msg}")
#         logger.error(f"❌ Error type: {type(e)}")
#         logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        
#         # ALWAYS return a JSON response, never let it be empty
#         error_response = {
#             "error": "Blog generation failed",
#             "details": error_msg,
#             "error_type": str(type(e)),
#             "timestamp": datetime.now(timezone.utc).isoformat(),
#             "debug_info": "Check server logs for full traceback"
#         }
        
#         logger.error(f"📤 Returning error response: {error_response}")
        
#         return JSONResponse(
#             status_code=500,
#             content=error_response
#         )

# # Add a simple test endpoint with detailed logging
# @router.get("/test")
# async def test_endpoint():
#     """Test endpoint to verify basic functionality"""
#     logger.info("🧪 Test endpoint called")
    
#     try:
#         response_data = {
#             "message": "Backend is working perfectly",
#             "timestamp": datetime.now(timezone.utc).isoformat(),
#             "status": "ok",
#             "test_number": 12345
#         }
        
#         logger.info(f"✅ Test endpoint returning: {response_data}")
#         return JSONResponse(content=response_data)
        
#     except Exception as e:
#         logger.error(f"❌ Test endpoint error: {str(e)}")
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": "Test endpoint failed",
#                 "details": str(e),
#                 "timestamp": datetime.now(timezone.utc).isoformat()
#             }
#         )

# # Add health check with detailed system info
# @router.get("/health")
# async def health_check():
#     """Health check endpoint with detailed system information"""
#     logger.info("🏥 Health check called")
    
#     try:
#         import os
#         import sys
        
#         health_data = {
#             "status": "healthy",
#             "timestamp": datetime.now(timezone.utc).isoformat(),
#             "service": "blog-generator",
#             "python_version": sys.version,
#             "environment": {
#                 "GOOGLE_API_KEY": "Set" if os.getenv("GOOGLE_API_KEY") else "Missing",
#                 "MONGODB_URL": "Set" if os.getenv("MONGODB_URL") else "Missing"
#             }
#         }
        
#         logger.info(f"✅ Health check returning: {health_data}")
#         return JSONResponse(content=health_data)
        
#     except Exception as e:
#         logger.error(f"❌ Health check error: {str(e)}")
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "status": "unhealthy",
#                 "error": str(e),
#                 "timestamp": datetime.now(timezone.utc).isoformat()
#             }
#         )

# # Add a debug endpoint to test blog generation without database
# @router.post("/debug_generate")
# async def debug_generate(req: BlogRequest):
#     """Debug endpoint to test blog generation without database operations"""
#     logger.info(f"🐛 Debug generate called with topic: '{req.topic}'")
    
#     try:
#         if not req.topic or not req.topic.strip():
#             return JSONResponse(
#                 status_code=400,
#                 content={"error": "Topic required", "timestamp": datetime.now(timezone.utc).isoformat()}
#             )
        
#         topic = req.topic.strip()
#         logger.info(f"🤖 Generating blog for debug: '{topic}'")
        
#         # Try to generate blog
#         blog = await generate_blog(topic)
        
#         # Return without saving to database
#         result = {
#             "title": blog.get("title", "No title"),
#             "content": blog.get("content", "No content"),
#             "topic": topic,
#             "_id": "debug-" + str(int(datetime.now().timestamp())),
#             "created_at": datetime.now(timezone.utc).isoformat(),
#             "debug": True
#         }
        
#         logger.info("✅ Debug generation successful")
#         return JSONResponse(content=result)
        
#     except Exception as e:
#         logger.error(f"❌ Debug generate error: {str(e)}")
#         logger.error(f"❌ Debug traceback: {traceback.format_exc()}")
        
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": "Debug generation failed",
#                 "details": str(e),
#                 "timestamp": datetime.now(timezone.utc).isoformat()
#             }
#         )

# DIAGNOSTIC VERSION - Replace your blog route temporarily with this
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from datetime import datetime, timezone
import traceback
import logging
import sys
import json
import os

# Set up logging to console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate_blog")
async def generate_blog_route(request: Request, req: BlogRequest):
    """PRODUCTION VERSION: Generate blog using actual AI service with enhanced error catching."""
    
    logger.info("🚀 === PRODUCTION BLOG GENERATION STARTED ===")
    logger.info(f"🚀 Timestamp: {datetime.now().isoformat()}")

    try:
        # Log request details
        logger.info(f"📝 Request topic: {req.topic}")
        
        # Validate topic
        topic = req.topic.strip() if req.topic else None
        if not topic:
            logger.error("❌ No topic provided")
            raise HTTPException(
                status_code=400, 
                detail="Topic is required and cannot be empty"
            )
        
        logger.info(f"✅ Topic validated: '{topic}'")
        
        # --- Enhanced Logging Step 1 ---
        logger.info("!!!!!!!!!! STEP 1: ABOUT TO CALL THE AI GENERATOR !!!!!!!!!!")
        
        # Call the actual blog generator service
        blog_data = await generate_blog(topic)
        
        # --- Enhanced Logging Step 2 ---
        logger.info("!!!!!!!!!! STEP 2: AI GENERATOR FINISHED SUCCESSFULLY !!!!!!!!!!")
        
        # Validate the generated data
        if not blog_data or not isinstance(blog_data, dict):
            logger.error("❌ Blog generator returned invalid data")
            raise HTTPException(
                status_code=500,
                detail="Blog generation service returned invalid data"
            )
        
        if not blog_data.get("title") or not blog_data.get("content"):
            logger.error(f"❌ Generated blog missing required fields: {list(blog_data.keys())}")
            raise HTTPException(
                status_code=500,
                detail="Generated blog is missing title or content"
            )
        
        # Optional: Save to database
        blog_id = None
        try:
            from app.database.mongo import blogs_collection
            blog_doc = {
                "topic": topic,
                "title": blog_data["title"],
                "content": blog_data["content"],
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            result = blogs_collection.insert_one(blog_doc)
            blog_id = str(result.inserted_id)
            logger.info(f"✅ Blog saved to database with ID: {blog_id}")
        except Exception as db_error:
            logger.warning(f"⚠️ Failed to save to database: {db_error}")
        
        # Prepare response
        response_data = {
            "title": blog_data["title"],
            "content": blog_data["content"],
            "topic": topic,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "_id": blog_id,
            "success": True,
            "generation_method": "ai"
        }
        
        logger.info("✅ Blog generated successfully!")
        logger.info(f"📄 Title: '{blog_data['title']}'")
        logger.info(f"📄 Content length: {len(blog_data.get('content', ''))} characters")
        logger.info("🚀 === PRODUCTION BLOG GENERATION COMPLETED ===")
        
        return JSONResponse(
            status_code=200,
            content=response_data
        )
        
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to let FastAPI handle them
        raise http_exc
        
    except Exception as e:
        # --- Enhanced Error Catching Block ---
        # This block will now catch ANY other error and log it loudly
        error_message = f"!!!!!!!!!! A CRITICAL ERROR WAS CAUGHT !!!!!!!!!! TYPE: {type(e).__name__}, MESSAGE: {str(e)}"
        logger.error("=" * 80)
        logger.error(error_message)
        logger.error("FULL TRACEBACK BELOW:")
        logger.error(traceback.format_exc()) # This line is very important
        logger.error("=" * 80)
        
        # It will also return a proper error response to the frontend
        return JSONResponse(
            status_code=500,
            content={
                "error": "A critical server error was caught and logged.",
                "error_type": type(e).__name__,
                "error_message": str(e)
            }
        )

# ==============================================================================
# All other diagnostic and test endpoints remain the same
# ==============================================================================

@router.post("/generate_blog_diagnostic")
async def generate_blog_diagnostic_route(request: Request, req: BlogRequest):
    """DIAGNOSTIC VERSION: For testing purposes only"""
    
    logger.info("🧪 DIAGNOSTIC: Blog generation request started")
    
    try:
        topic = getattr(req, 'topic', None)
        if not topic:
            return JSONResponse(
                status_code=400,
                content={"error": "No topic provided", "diagnostic": True}
            )
        
        diagnostic_response = {
            "diagnostic": True,
            "message": "This is a diagnostic response - use /generate_blog for real generation",
            "topic": topic,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "note": "Switch to production endpoint for actual AI-generated content",
            "production_endpoint": "/api/generate_blog",
        }
        
        logger.info("🧪 DIAGNOSTIC: Returning diagnostic response")
        return JSONResponse(content=diagnostic_response)
        
    except Exception as e:
        logger.error(f"❌ DIAGNOSTIC ERROR: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "diagnostic_error": True,
                "error_message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

@router.post("/test_blog_generator")
async def test_blog_generator_route():
    """Test the blog generator service directly"""
    
    logger.info("🧪 Testing blog generator service...")
    
    try:
        test_topic = "artificial intelligence"
        logger.info(f"🧪 Testing with topic: '{test_topic}'")
        
        result = await generate_blog(test_topic)
        
        logger.info("✅ Blog generator test successful!")
        return JSONResponse(
            content={
                "test_successful": True,
                "topic": test_topic,
                "has_title": bool(result.get("title")),
                "has_content": bool(result.get("content")),
                "content_length": len(result.get("content", "")),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Blog generator test failed: {str(e)}")
        logger.error(traceback.format_exc())
        
        return JSONResponse(
            status_code=500,
            content={
                "test_successful": False,
                "error": str(e),
                "error_type": str(type(e).__name__),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

@router.get("/production_health")
async def production_health():
    """Production health check - tests all components"""
    
    logger.info("🏥 Production health check started")
    
    health_data = {
        "status": "checking",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "blog-generator-production",
        "components": {}
    }
    
    # Test environment variables
    health_data["components"]["google_api_key"] = "✅ Set" if os.getenv("GOOGLE_API_KEY") else "❌ Missing"
    health_data["components"]["mongodb_url"] = "✅ Set" if os.getenv("MONGODB_URL") else "❌ Missing (optional)"
    
    critical_components = ["google_api_key"]
    all_critical_ok = all(
        health_data["components"].get(comp, "").startswith("✅") 
        for comp in critical_components
    )
    
    health_data["status"] = "healthy" if all_critical_ok else "unhealthy"
    status_code = 200 if all_critical_ok else 503
    
    logger.info(f"🏥 Production health check completed: {health_data['status']}")
    
    return JSONResponse(
        status_code=status_code,
        content=health_data
    )

@router.get("/simple_test")
def simple_test():
    """Ultra simple test endpoint"""
    return {
        "message": "Simple test works", 
        "production_ready": True,
        "timestamp": datetime.now().isoformat()
    }