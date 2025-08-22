# #backend/app/main.py
# from fastapi import FastAPI, Request, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import logging
# import traceback
# import sys
# import json
# import os
# from datetime import datetime, timezone
# from app.routes import blog, history

# # Set up comprehensive logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.StreamHandler(sys.stdout),
#         logging.StreamHandler(sys.stderr)
#     ]
# )
# logger = logging.getLogger(__name__)

# # Print startup message
# print("=" * 80)
# print("🚀 ENHANCED BLOG GENERATOR API STARTING")
# print(f"🚀 Timestamp: {datetime.now().isoformat()}")
# print("=" * 80)

# app = FastAPI(
#     title="Enhanced Blog Generator API",
#     description="AI-powered blog generation service with comprehensive error handling",
#     version="2.0.0",
#     docs_url="/docs",
#     redoc_url="/redoc"
# )

# # Enhanced CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Configure properly for production
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["*"],
# )

# # Enhanced request logging middleware
# @app.middleware("http")
# async def enhanced_request_logging(request: Request, call_next):
#     start_time = datetime.now()
#     request_id = f"req_{int(start_time.timestamp() * 1000)}"
    
#     # Log comprehensive request details
#     logger.info(f"📥 [{request_id}] === NEW REQUEST ===")
#     logger.info(f"📥 [{request_id}] {request.method} {request.url}")
#     logger.info(f"📥 [{request_id}] Client: {request.client}")
#     logger.info(f"📥 [{request_id}] Headers: {dict(request.headers)}")
#     logger.info(f"📥 [{request_id}] Query params: {dict(request.query_params)}")
    
#     # Log request body for POST/PUT/PATCH
#     body_logged = False
#     if request.method in ["POST", "PUT", "PATCH"]:
#         try:
#             body = await request.body()
#             if body:
#                 try:
#                     body_str = body.decode('utf-8')
#                     logger.info(f"📝 [{request_id}] Request body: {body_str}")
                    
#                     # Try to parse JSON
#                     try:
#                         body_json = json.loads(body_str)
#                         logger.info(f"📝 [{request_id}] Parsed JSON: {body_json}")
#                     except:
#                         logger.info(f"📝 [{request_id}] Body is not JSON")
                    
#                     body_logged = True
#                 except UnicodeDecodeError:
#                     logger.info(f"📝 [{request_id}] Request body: [binary data]")
#                     body_logged = True
#         except Exception as body_error:
#             logger.error(f"❌ [{request_id}] Error reading body: {body_error}")
    
#     logger.info(f"⏳ [{request_id}] Processing request...")
    
#     try:
#         response = await call_next(request)
        
#         # Log response details
#         process_time = (datetime.now() - start_time).total_seconds()
#         logger.info(f"📤 [{request_id}] Response: {response.status_code}")
#         logger.info(f"📤 [{request_id}] Headers: {dict(response.headers)}")
#         logger.info(f"📤 [{request_id}] Time: {process_time:.3f}s")
#         logger.info(f"✅ [{request_id}] Request completed successfully")
        
#         return response
        
#     except Exception as e:
#         process_time = (datetime.now() - start_time).total_seconds()
#         logger.error(f"❌ [{request_id}] Middleware error after {process_time:.3f}s")
#         logger.error(f"❌ [{request_id}] Error: {str(e)}")
#         logger.error(f"❌ [{request_id}] Traceback: {traceback.format_exc()}")
        
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": "Request processing failed",
#                 "details": str(e),
#                 "request_id": request_id,
#                 "timestamp": datetime.now(timezone.utc).isoformat()
#             }
#         )

# # Global exception handler
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     error_id = f"err_{int(datetime.now().timestamp() * 1000)}"
    
#     logger.error(f"❌ [{error_id}] === GLOBAL EXCEPTION HANDLER ===")
#     logger.error(f"❌ [{error_id}] Exception type: {type(exc)}")
#     logger.error(f"❌ [{error_id}] Exception message: {str(exc)}")
#     logger.error(f"❌ [{error_id}] Request: {request.method} {request.url}")
#     logger.error(f"❌ [{error_id}] Headers: {dict(request.headers)}")
    
#     # Try to get request body
#     try:
#         body = await request.body()
#         if body:
#             logger.error(f"❌ [{error_id}] Body: {body.decode('utf-8')}")
#     except:
#         logger.error(f"❌ [{error_id}] Could not read request body")
    
#     logger.error(f"❌ [{error_id}] Traceback: {traceback.format_exc()}")
    
#     error_response = {
#         "error": "Internal server error",
#         "details": str(exc),
#         "error_type": str(type(exc)),
#         "error_id": error_id,
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "path": str(request.url.path),
#         "method": request.method
#     }
    
#     logger.error(f"📤 [{error_id}] Returning error response")
    
#     return JSONResponse(
#         status_code=500,
#         content=error_response
#     )

# # Root endpoint
# @app.get("/")
# async def root():
#     logger.info("🏠 Root endpoint called")
    
#     response_data = {
#         "message": "Enhanced Blog Generator API",
#         "status": "healthy",
#         "version": "2.0.0",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "endpoints": {
#             "health": "/health",
#             "docs": "/docs",
#             "blog_generation": "/api/generate_blog",
#             "debug_generation": "/api/debug_generate",
#             "test": "/api/test",
#             "diagnostics": "/api/diagnostic_health"
#         }
#     }
    
#     logger.info("✅ Root endpoint successful")
#     return response_data

# # Health check
# @app.get("/health")
# async def health_check():
#     logger.info("🏥 Health check called")
    
#     # Check environment variables
#     env_status = {
#         "GOOGLE_API_KEY": "✅ Set" if os.getenv("GOOGLE_API_KEY") else "❌ Missing",
#         "MONGO_URL": "✅ Set" if os.getenv("MONGO_URL") else "❌ Missing"
#     }
    
#     # Check imports
#     import_status = {}
#     try:
#         from app.models.blog_request import BlogRequest
#         import_status["blog_request"] = "✅ OK"
#     except Exception as e:
#         import_status["blog_request"] = f"❌ {str(e)}"
    
#     try:
#         from app.services.blog_generator import generate_blog
#         import_status["blog_generator"] = "✅ OK"
#     except Exception as e:
#         import_status["blog_generator"] = f"❌ {str(e)}"
    
#     try:
#         from app.database.mongo import blogs_collection
#         import_status["mongo"] = "✅ OK"
#     except Exception as e:
#         import_status["mongo"] = f"❌ {str(e)}"
    
#     health_data = {
#         "status": "healthy",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "service": "enhanced-blog-generator-api",
#         "version": "2.0.0",
#         "python_version": sys.version,
#         "environment": env_status,
#         "imports": import_status,
#         "working_directory": os.getcwd()
#     }
    
#     logger.info("✅ Health check completed")
#     return health_data

# # Simple test endpoints
# @app.get("/ping")
# async def ping():
#     logger.info("🏓 Ping called")
#     return {
#         "message": "pong",
#         "timestamp": datetime.now(timezone.utc).isoformat()
#     }

# @app.get("/test")
# def simple_test():
#     logger.info("🧪 Simple test called")
#     return {
#         "message": "Simple test successful",
#         "timestamp": datetime.now().isoformat(),
#         "test_number": 12345
#     }

# @app.post("/echo")
# async def echo(request: Request):
#     """Echo endpoint to test request/response handling"""
#     logger.info("🔄 Echo endpoint called")
    
#     body = await request.body()
    
#     try:
#         json_data = json.loads(body.decode('utf-8')) if body else None
#     except:
#         json_data = None
    
#     echo_response = {
#         "message": "Echo successful",
#         "method": request.method,
#         "url": str(request.url),
#         "headers": dict(request.headers),
#         "raw_body": body.decode('utf-8') if body else None,
#         "parsed_json": json_data,
#         "timestamp": datetime.now(timezone.utc).isoformat()
#     }
    
#     logger.info("✅ Echo completed")
#     return echo_response

# # Import and include blog routes
# logger.info("📂 Importing blog router...")
# try:
#     from app.routes.blog import router as blog_router
#     logger.info("✅ Blog router imported successfully")
    
#     app.include_router(blog_router, prefix="/api", tags=["blogs"])
#     logger.info("✅ Blog router included successfully")
    
# except Exception as router_error:
#     logger.error(f"❌ Failed to import/include blog router: {router_error}")
#     logger.error(f"❌ Router traceback: {traceback.format_exc()}")
    
#     # Create fallback endpoints
#     @app.post("/api/generate_blog")
#     async def fallback_generate_blog(request: Request):
#         logger.error("🔄 Using fallback blog endpoint due to router import failure")
        
#         try:
#             body = await request.body()
#             json_data = json.loads(body.decode('utf-8')) if body else {}
#             topic = json_data.get('topic', 'Unknown topic')
#         except:
#             topic = "Unknown topic"
        
#         return JSONResponse(
#             status_code=503,
#             content={
#                 "error": "Blog router not available",
#                 "details": str(router_error),
#                 "topic": topic,
#                 "timestamp": datetime.now(timezone.utc).isoformat(),
#                 "fallback": True
#             }
#         )

# # Startup event
# @app.on_event("startup")
# async def startup_event():
#     logger.info("🚀 === APPLICATION STARTUP ===")
#     logger.info("🚀 Enhanced Blog Generator API starting...")
    
#     # Environment check
#     logger.info("🔍 Environment variables:")
#     for key in ["GOOGLE_API_KEY", "MONGO_URL"]:
#         value = os.getenv(key)
#         if value:
#             logger.info(f"   {key}: ✅ Set ({len(value)} chars)")
#         else:
#             logger.warning(f"   {key}: ❌ Missing")
    
#     # Test database connection
#     try:
#         from app.database.mongo import blogs_collection
#         if blogs_collection is not None:
#             logger.info("✅ Database connection available")
#         else:
#             logger.warning("⚠️ Database connection is None")
#     except Exception as db_error:
#         logger.error(f"❌ Database connection test failed: {db_error}")
    
#     logger.info("✅ Application startup completed")

# # Shutdown event
# @app.on_event("shutdown")
# async def shutdown_event():
#     logger.info("🛑 === APPLICATION SHUTDOWN ===")
#     logger.info("🛑 Enhanced Blog Generator API shutting down...")

# if __name__ == "__main__":
#     import uvicorn
#     logger.info("🚀 Starting Enhanced Blog Generator API server...")
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info",
#         access_log=True
#     )

import logging
import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your application's routers
from app.routes import blog, history

# --- Basic Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Blog Generator API",
    description="An API to generate blogs using AI and manage them with background tasks.",
    version="3.0.0"
)

# --- Middleware ---
# This allows your frontend to communicate with your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with your frontend's specific URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# --- Routers ---
# This connects your endpoint files (blog.py, history.py) to the main app
app.include_router(blog.router, prefix="/api", tags=["Blog Generation"])
app.include_router(history.router, prefix="/api", tags=["Blog History"])

# --- Root Endpoint ---
@app.get("/")
async def root():
    """A simple endpoint to confirm that the API is running."""
    return {
        "message": "Blog Generator API is online and healthy",
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

# --- Startup Event ---
@app.on_event("startup")
async def startup_event():
    """This code runs once when the application starts up."""
    logger.info("🚀 API has started successfully.")
    # A quick check to ensure environment variables are loaded
    if not os.getenv("GOOGLE_API_KEY"):
        logger.warning("⚠️ GOOGLE_API_KEY environment variable is MISSING.")
    if not os.getenv("MONGO_URL"):
        logger.warning("⚠️ MONGO_URL environment variable is MISSING.")