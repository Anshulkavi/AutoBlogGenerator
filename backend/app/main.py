
# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from app.routes.blog import router as blog_router
# # from app.routes.history import router as history_router

# # app = FastAPI()

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],  # 👈 for testing, allow all. Use frontend origin in prod
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # app.include_router(blog_router, prefix="/api")
# # app.include_router(history_router, prefix="/api")

# # main.py or wherever you initialize your FastAPI app
# # from fastapi import FastAPI, Request
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import JSONResponse
# # import logging
# # import traceback
# # from datetime import datetime, timezone

# # # Import your router
# # from app.routes.blog import router as blog_router

# # # Set up logging
# # logging.basicConfig(
# #     level=logging.INFO,
# #     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# # )
# # logger = logging.getLogger(__name__)

# # app = FastAPI(
# #     title="Blog Generator API",
# #     description="AI-powered blog generation service",
# #     version="1.0.0"
# # )

# # # CORS middleware
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],  # In production, specify your frontend domains
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Global exception handler
# # @app.exception_handler(Exception)
# # async def global_exception_handler(request: Request, exc: Exception):
# #     logger.error(f"❌ Unhandled exception: {str(exc)}")
# #     logger.error(f"❌ Request URL: {request.url}")
# #     logger.error(f"❌ Request method: {request.method}")
# #     logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
# #     return JSONResponse(
# #         status_code=500,
# #         content={
# #             "error": "Internal server error",
# #             "details": "An unexpected error occurred",
# #             "timestamp": datetime.now(timezone.utc).isoformat()
# #         }
# #     )

# # # Request logging middleware
# # @app.middleware("http")
# # async def log_requests(request: Request, call_next):
# #     start_time = datetime.now()
    
# #     # Log request details
# #     logger.info(f"📥 {request.method} {request.url}")
    
# #     # Get request body for POST requests
# #     if request.method in ["POST", "PUT", "PATCH"]:
# #         body = await request.body()
# #         if body:
# #             try:
# #                 body_str = body.decode('utf-8')
# #                 logger.info(f"📝 Request body: {body_str[:500]}...")
# #             except:
# #                 logger.info("📝 Request body: [binary data]")
    
# #     response = await call_next(request)
    
# #     # Log response details
# #     process_time = (datetime.now() - start_time).total_seconds()
# #     logger.info(f"📤 Response: {response.status_code} - {process_time:.3f}s")
    
# #     return response

# # # Health check endpoint
# # @app.get("/")
# # async def root():
# #     return {
# #         "message": "Blog Generator API is running",
# #         "status": "healthy",
# #         "timestamp": datetime.now(timezone.utc).isoformat(),
# #         "version": "1.0.0"
# #     }

# # @app.get("/health")
# # async def health_check():
# #     return {
# #         "status": "healthy",
# #         "timestamp": datetime.now(timezone.utc).isoformat(),
# #         "service": "blog-generator-api"
# #     }

# # # Include blog routes
# # app.include_router(blog_router, prefix="/api", tags=["blogs"])

# # if __name__ == "__main__":
# #     import uvicorn
# #     logger.info("🚀 Starting Blog Generator API server...")
# #     uvicorn.run(
# #         "main:app",
# #         host="0.0.0.0",
# #         port=8000,
# #         reload=True,
# #         log_level="info"
# #     )

# from fastapi import FastAPI, Request, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import logging
# import traceback
# import sys
# import json
# from datetime import datetime, timezone

# # Import your router
# from app.routes.blog import router as blog_router

# # Set up comprehensive logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.StreamHandler(sys.stdout)
#     ]
# )
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Blog Generator API",
#     description="AI-powered blog generation service",
#     version="1.0.0",
#     docs_url="/docs",
#     redoc_url="/redoc"
# )

# # Enhanced CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend domains
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["*"],
# )

# # Global exception handler with detailed logging
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     logger.error(f"❌ GLOBAL EXCEPTION HANDLER TRIGGERED")
#     logger.error(f"❌ Exception type: {type(exc)}")
#     logger.error(f"❌ Exception message: {str(exc)}")
#     logger.error(f"❌ Request URL: {request.url}")
#     logger.error(f"❌ Request method: {request.method}")
#     logger.error(f"❌ Request headers: {dict(request.headers)}")
    
#     # Try to get request body
#     try:
#         body = await request.body()
#         if body:
#             logger.error(f"❌ Request body: {body.decode('utf-8')}")
#     except Exception as body_error:
#         logger.error(f"❌ Could not read request body: {body_error}")
    
#     logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
#     error_response = {
#         "error": "Internal server error",
#         "details": str(exc),
#         "error_type": str(type(exc)),
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "path": str(request.url.path),
#         "method": request.method
#     }
    
#     logger.error(f"📤 Global handler returning: {error_response}")
    
#     return JSONResponse(
#         status_code=500,
#         content=error_response
#     )

# # Enhanced request logging middleware
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     start_time = datetime.now()
    
#     # Log comprehensive request details
#     logger.info(f"📥 === NEW REQUEST ===")
#     logger.info(f"📥 {request.method} {request.url}")
#     logger.info(f"📥 Headers: {dict(request.headers)}")
#     logger.info(f"📥 Query params: {dict(request.query_params)}")
#     logger.info(f"📥 Path params: {request.path_params}")
#     logger.info(f"📥 Client: {request.client}")
    
#     # Get request body for POST/PUT/PATCH requests
#     body_logged = False
#     if request.method in ["POST", "PUT", "PATCH"]:
#         try:
#             # Read body without consuming it
#             body = await request.body()
#             if body:
#                 try:
#                     body_str = body.decode('utf-8')
#                     logger.info(f"📝 Request body: {body_str}")
                    
#                     # Try to parse as JSON for better logging
#                     try:
#                         body_json = json.loads(body_str)
#                         logger.info(f"📝 Parsed JSON: {body_json}")
#                     except:
#                         logger.info(f"📝 Body is not valid JSON")
                    
#                     body_logged = True
#                 except UnicodeDecodeError:
#                     logger.info("📝 Request body: [binary data]")
#                     body_logged = True
#         except Exception as body_error:
#             logger.error(f"❌ Error reading request body: {body_error}")
    
#     if not body_logged and request.method in ["POST", "PUT", "PATCH"]:
#         logger.info("📝 No request body")
    
#     # Process request
#     logger.info("⏳ Processing request...")
    
#     try:
#         response = await call_next(request)
        
#         # Log response details
#         process_time = (datetime.now() - start_time).total_seconds()
#         logger.info(f"📤 Response status: {response.status_code}")
#         logger.info(f"📤 Response headers: {dict(response.headers)}")
#         logger.info(f"📤 Process time: {process_time:.3f}s")
        
#         # Log response body for debugging (be careful with large responses)
#         if hasattr(response, 'body'):
#             try:
#                 # This is tricky with StreamingResponse, so we'll skip for now
#                 logger.info(f"📤 Response has body attribute")
#             except:
#                 pass
        
#         logger.info(f"✅ Request completed successfully in {process_time:.3f}s")
        
#         return response
        
#     except Exception as e:
#         process_time = (datetime.now() - start_time).total_seconds()
#         logger.error(f"❌ Request processing failed after {process_time:.3f}s")
#         logger.error(f"❌ Middleware error: {str(e)}")
#         logger.error(f"❌ Middleware traceback: {traceback.format_exc()}")
        
#         # Return error response
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": "Request processing failed",
#                 "details": str(e),
#                 "timestamp": datetime.now(timezone.utc).isoformat()
#             }
#         )

# # Enhanced health check endpoint
# @app.get("/")
# async def root():
#     logger.info("🏠 Root endpoint called")
    
#     response_data = {
#         "message": "Blog Generator API is running",
#         "status": "healthy",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "version": "1.0.0",
#         "endpoints": {
#             "health": "/health",
#             "docs": "/docs",
#             "blog_generation": "/api/generate_blog",
#             "test": "/api/test",
#             "debug": "/api/debug_generate"
#         }
#     }
    
#     logger.info(f"✅ Root returning: {response_data}")
#     return response_data

# @app.get("/health")
# async def health_check():
#     logger.info("🏥 Main health check called")
    
#     import os
#     import sys
    
#     health_data = {
#         "status": "healthy",
#         "timestamp": datetime.now(timezone.utc).isoformat(),
#         "service": "blog-generator-api",
#         "version": "1.0.0",
#         "python_version": sys.version,
#         "environment_check": {
#             "GOOGLE_API_KEY": "✅ Set" if os.getenv("GOOGLE_API_KEY") else "❌ Missing",
#             "MONGODB_URL": "✅ Set" if os.getenv("MONGODB_URL") else "❌ Missing"
#         }
#     }
    
#     logger.info(f"✅ Main health check returning: {health_data}")
#     return health_data

# # Add a simple ping endpoint
# @app.get("/ping")
# async def ping():
#     logger.info("🏓 Ping endpoint called")
#     return {"message": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}

# # Include blog routes with proper error handling
# try:
#     logger.info("📂 Including blog router...")
#     app.include_router(blog_router, prefix="/api", tags=["blogs"])
#     logger.info("✅ Blog router included successfully")
# except Exception as router_error:
#     logger.error(f"❌ Failed to include blog router: {router_error}")
#     logger.error(f"❌ Router traceback: {traceback.format_exc()}")

# # Add startup event
# @app.on_event("startup")
# async def startup_event():
#     logger.info("🚀 === APPLICATION STARTUP ===")
#     logger.info("🚀 Blog Generator API is starting...")
    
#     # Check environment variables
#     import os
#     logger.info(f"🔍 Environment check:")
#     logger.info(f"   GOOGLE_API_KEY: {'✅ Set' if os.getenv('GOOGLE_API_KEY') else '❌ Missing'}")
#     logger.info(f"   MONGODB_URL: {'✅ Set' if os.getenv('MONGODB_URL') else '❌ Missing'}")
    
#     # Test database connection if possible
#     try:
#         from app.database.mongo import blogs_collection
#         if blogs_collection is not None:
#             logger.info("✅ Database connection available")
#         else:
#             logger.warning("⚠️ Database connection not available")
#     except Exception as db_error:
#         logger.error(f"❌ Database connection test failed: {db_error}")
    
#     logger.info("✅ Application startup completed")

# # Add shutdown event
# @app.on_event("shutdown")
# async def shutdown_event():
#     logger.info("🛑 === APPLICATION SHUTDOWN ===")
#     logger.info("🛑 Blog Generator API is shutting down...")

# if __name__ == "__main__":
#     import uvicorn
#     logger.info("🚀 Starting Blog Generator API server directly...")
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info",
#         access_log=True
#     )

# DIAGNOSTIC VERSION - Replace your main.py temporarily
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import traceback
import sys
from datetime import datetime, timezone

# Set up console logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Print to console immediately
print("=" * 80)
print("🚀 DIAGNOSTIC MODE: Starting FastAPI application")
print(f"🚀 Timestamp: {datetime.now().isoformat()}")
print("=" * 80)

app = FastAPI(
    title="DIAGNOSTIC Blog Generator API",
    description="Diagnostic version for debugging empty response",
    version="diagnostic-1.0.0"
)

# Simple CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diagnostic middleware to log everything
@app.middleware("http")
async def diagnostic_middleware(request: Request, call_next):
    print(f"\n{'='*60}")
    print(f"📥 DIAGNOSTIC REQUEST: {request.method} {request.url}")
    print(f"📥 Headers: {dict(request.headers)}")
    print(f"📥 Timestamp: {datetime.now().isoformat()}")
    
    # Log request body
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
        print(f"📥 Body: {body}")
    
    try:
        print("⏳ DIAGNOSTIC: Processing request...")
        response = await call_next(request)
        print(f"📤 DIAGNOSTIC RESPONSE: Status {response.status_code}")
        print(f"📤 Response headers: {dict(response.headers)}")
        print(f"{'='*60}\n")
        return response
    except Exception as e:
        print(f"❌ DIAGNOSTIC MIDDLEWARE ERROR: {str(e)}")
        traceback.print_exc()
        print(f"{'='*60}\n")
        return JSONResponse(
            status_code=500,
            content={"diagnostic_middleware_error": str(e)}
        )

# Global exception handler
@app.exception_handler(Exception)
async def diagnostic_exception_handler(request: Request, exc: Exception):
    print(f"\n{'!'*80}")
    print(f"❌ DIAGNOSTIC GLOBAL EXCEPTION HANDLER")
    print(f"❌ Exception: {str(exc)}")
    print(f"❌ Exception type: {type(exc)}")
    print(f"❌ Request: {request.method} {request.url}")
    traceback.print_exc()
    print(f"{'!'*80}\n")
    
    return JSONResponse(
        status_code=500,
        content={
            "diagnostic_global_error": True,
            "error": str(exc),
            "error_type": str(type(exc)),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

# Root endpoint
@app.get("/")
async def diagnostic_root():
    print("🏠 DIAGNOSTIC: Root endpoint called")
    response_data = {
        "diagnostic": True,
        "message": "DIAGNOSTIC MODE: API is running",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    print(f"🏠 DIAGNOSTIC: Returning root data: {response_data}")
    return response_data

# Import and include routes with error handling
try:
    print("📂 DIAGNOSTIC: Attempting to import blog router...")
    from app.routes.blog import router as blog_router
    print("✅ DIAGNOSTIC: Blog router imported successfully")
    
    print("📂 DIAGNOSTIC: Including blog router...")
    app.include_router(blog_router, prefix="/api", tags=["diagnostic-blogs"])
    print("✅ DIAGNOSTIC: Blog router included successfully")
    
except Exception as e:
    print(f"❌ DIAGNOSTIC: Failed to import/include blog router: {str(e)}")
    traceback.print_exc()
    
    # Create a fallback endpoint
    @app.post("/api/generate_blog")
    async def fallback_generate_blog(request: Request):
        print("🔄 DIAGNOSTIC: Using fallback blog endpoint")
        body = await request.body()
        return JSONResponse(content={
            "diagnostic": True,
            "message": "Fallback endpoint - router import failed",
            "received_body": body.decode('utf-8') if body else None,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": str(e)
        })

# Startup event
@app.on_event("startup")
async def diagnostic_startup():
    print("\n" + "="*80)
    print("🚀 DIAGNOSTIC STARTUP EVENT")
    print(f"🚀 Application starting at: {datetime.now().isoformat()}")
    
    # Test environment
    import os
    print(f"🔍 GOOGLE_API_KEY: {'✅ SET' if os.getenv('GOOGLE_API_KEY') else '❌ MISSING'}")
    print(f"🔍 MONGODB_URL: {'✅ SET' if os.getenv('MONGODB_URL') else '❌ MISSING'}")
    
    # Test imports
    try:
        from app.models.blog_request import BlogRequest
        print("✅ BlogRequest import: OK")
    except Exception as e:
        print(f"❌ BlogRequest import: FAILED - {str(e)}")
    
    try:
        from app.services.blog_generator import generate_blog
        print("✅ blog_generator import: OK")
    except Exception as e:
        print(f"❌ blog_generator import: FAILED - {str(e)}")
    
    print("="*80 + "\n")

# Simple test endpoints
@app.get("/test")
def simple_test():
    print("🧪 DIAGNOSTIC: Simple test endpoint")
    return {"diagnostic": True, "test": "working"}

@app.post("/test_post")
async def test_post(request: Request):
    print("🧪 DIAGNOSTIC: Test POST endpoint")
    body = await request.body()
    return {
        "diagnostic": True,
        "received_body": body.decode('utf-8') if body else None,
        "test": "post_working"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 DIAGNOSTIC: Starting server directly...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )