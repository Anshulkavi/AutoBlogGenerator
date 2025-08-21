
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.routes.blog import router as blog_router
# from app.routes.history import router as history_router

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 👈 for testing, allow all. Use frontend origin in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(blog_router, prefix="/api")
# app.include_router(history_router, prefix="/api")

# main.py or wherever you initialize your FastAPI app
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import logging
# import traceback
# from datetime import datetime, timezone

# # Import your router
# from app.routes.blog import router as blog_router

# # Set up logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Blog Generator API",
#     description="AI-powered blog generation service",
#     version="1.0.0"
# )

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend domains
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Global exception handler
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     logger.error(f"❌ Unhandled exception: {str(exc)}")
#     logger.error(f"❌ Request URL: {request.url}")
#     logger.error(f"❌ Request method: {request.method}")
#     logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
#     return JSONResponse(
#         status_code=500,
#         content={
#             "error": "Internal server error",
#             "details": "An unexpected error occurred",
#             "timestamp": datetime.now(timezone.utc).isoformat()
#         }
#     )

# # Request logging middleware
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     start_time = datetime.now()
    
#     # Log request details
#     logger.info(f"📥 {request.method} {request.url}")
    
#     # Get request body for POST requests
#     if request.method in ["POST", "PUT", "PATCH"]:
#         body = await request.body()
#         if body:
#             try:
#                 body_str = body.decode('utf-8')
#                 logger.info(f"📝 Request body: {body_str[:500]}...")
#             except:
#                 logger.info("📝 Request body: [binary data]")
    
#     response = await call_next(request)
    
#     # Log response details
#     process_time = (datetime.now() - start_time).total_seconds()
#     logger.info(f"📤 Response: {response.status_code} - {process_time:.3f}s")
    
#     return response

# # Health check endpoint
# @app.get("/")
# async def root():
#     return {
#         "message": "Blog Generator API is running",
#         "status": "healthy",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "version": "1.0.0"
#     }

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "service": "blog-generator-api"
#     }

# # Include blog routes
# app.include_router(blog_router, prefix="/api", tags=["blogs"])

# if __name__ == "__main__":
#     import uvicorn
#     logger.info("🚀 Starting Blog Generator API server...")
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import traceback
import sys
import json
from datetime import datetime, timezone

# Import your router
from app.routes.blog import router as blog_router

# Set up comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Blog Generator API",
    description="AI-powered blog generation service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enhanced CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global exception handler with detailed logging
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ GLOBAL EXCEPTION HANDLER TRIGGERED")
    logger.error(f"❌ Exception type: {type(exc)}")
    logger.error(f"❌ Exception message: {str(exc)}")
    logger.error(f"❌ Request URL: {request.url}")
    logger.error(f"❌ Request method: {request.method}")
    logger.error(f"❌ Request headers: {dict(request.headers)}")
    
    # Try to get request body
    try:
        body = await request.body()
        if body:
            logger.error(f"❌ Request body: {body.decode('utf-8')}")
    except Exception as body_error:
        logger.error(f"❌ Could not read request body: {body_error}")
    
    logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
    error_response = {
        "error": "Internal server error",
        "details": str(exc),
        "error_type": str(type(exc)),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "path": str(request.url.path),
        "method": request.method
    }
    
    logger.error(f"📤 Global handler returning: {error_response}")
    
    return JSONResponse(
        status_code=500,
        content=error_response
    )

# Enhanced request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    
    # Log comprehensive request details
    logger.info(f"📥 === NEW REQUEST ===")
    logger.info(f"📥 {request.method} {request.url}")
    logger.info(f"📥 Headers: {dict(request.headers)}")
    logger.info(f"📥 Query params: {dict(request.query_params)}")
    logger.info(f"📥 Path params: {request.path_params}")
    logger.info(f"📥 Client: {request.client}")
    
    # Get request body for POST/PUT/PATCH requests
    body_logged = False
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            # Read body without consuming it
            body = await request.body()
            if body:
                try:
                    body_str = body.decode('utf-8')
                    logger.info(f"📝 Request body: {body_str}")
                    
                    # Try to parse as JSON for better logging
                    try:
                        body_json = json.loads(body_str)
                        logger.info(f"📝 Parsed JSON: {body_json}")
                    except:
                        logger.info(f"📝 Body is not valid JSON")
                    
                    body_logged = True
                except UnicodeDecodeError:
                    logger.info("📝 Request body: [binary data]")
                    body_logged = True
        except Exception as body_error:
            logger.error(f"❌ Error reading request body: {body_error}")
    
    if not body_logged and request.method in ["POST", "PUT", "PATCH"]:
        logger.info("📝 No request body")
    
    # Process request
    logger.info("⏳ Processing request...")
    
    try:
        response = await call_next(request)
        
        # Log response details
        process_time = (datetime.now() - start_time).total_seconds()
        logger.info(f"📤 Response status: {response.status_code}")
        logger.info(f"📤 Response headers: {dict(response.headers)}")
        logger.info(f"📤 Process time: {process_time:.3f}s")
        
        # Log response body for debugging (be careful with large responses)
        if hasattr(response, 'body'):
            try:
                # This is tricky with StreamingResponse, so we'll skip for now
                logger.info(f"📤 Response has body attribute")
            except:
                pass
        
        logger.info(f"✅ Request completed successfully in {process_time:.3f}s")
        
        return response
        
    except Exception as e:
        process_time = (datetime.now() - start_time).total_seconds()
        logger.error(f"❌ Request processing failed after {process_time:.3f}s")
        logger.error(f"❌ Middleware error: {str(e)}")
        logger.error(f"❌ Middleware traceback: {traceback.format_exc()}")
        
        # Return error response
        return JSONResponse(
            status_code=500,
            content={
                "error": "Request processing failed",
                "details": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

# Enhanced health check endpoint
@app.get("/")
async def root():
    logger.info("🏠 Root endpoint called")
    
    response_data = {
        "message": "Blog Generator API is running",
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "blog_generation": "/api/generate_blog",
            "test": "/api/test",
            "debug": "/api/debug_generate"
        }
    }
    
    logger.info(f"✅ Root returning: {response_data}")
    return response_data

@app.get("/health")
async def health_check():
    logger.info("🏥 Main health check called")
    
    import os
    import sys
    
    health_data = {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "blog-generator-api",
        "version": "1.0.0",
        "python_version": sys.version,
        "environment_check": {
            "GOOGLE_API_KEY": "✅ Set" if os.getenv("GOOGLE_API_KEY") else "❌ Missing",
            "MONGODB_URL": "✅ Set" if os.getenv("MONGODB_URL") else "❌ Missing"
        }
    }
    
    logger.info(f"✅ Main health check returning: {health_data}")
    return health_data

# Add a simple ping endpoint
@app.get("/ping")
async def ping():
    logger.info("🏓 Ping endpoint called")
    return {"message": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include blog routes with proper error handling
try:
    logger.info("📂 Including blog router...")
    app.include_router(blog_router, prefix="/api", tags=["blogs"])
    logger.info("✅ Blog router included successfully")
except Exception as router_error:
    logger.error(f"❌ Failed to include blog router: {router_error}")
    logger.error(f"❌ Router traceback: {traceback.format_exc()}")

# Add startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 === APPLICATION STARTUP ===")
    logger.info("🚀 Blog Generator API is starting...")
    
    # Check environment variables
    import os
    logger.info(f"🔍 Environment check:")
    logger.info(f"   GOOGLE_API_KEY: {'✅ Set' if os.getenv('GOOGLE_API_KEY') else '❌ Missing'}")
    logger.info(f"   MONGODB_URL: {'✅ Set' if os.getenv('MONGODB_URL') else '❌ Missing'}")
    
    # Test database connection if possible
    try:
        from app.database.mongo import blogs_collection
        if blogs_collection is not None:
            logger.info("✅ Database connection available")
        else:
            logger.warning("⚠️ Database connection not available")
    except Exception as db_error:
        logger.error(f"❌ Database connection test failed: {db_error}")
    
    logger.info("✅ Application startup completed")

# Add shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 === APPLICATION SHUTDOWN ===")
    logger.info("🛑 Blog Generator API is shutting down...")

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting Blog Generator API server directly...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )