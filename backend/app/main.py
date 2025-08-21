
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
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import traceback
from datetime import datetime, timezone

# Import your router
from app.routes.blog import router as blog_router

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Blog Generator API",
    description="AI-powered blog generation service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ Unhandled exception: {str(exc)}")
    logger.error(f"❌ Request URL: {request.url}")
    logger.error(f"❌ Request method: {request.method}")
    logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "details": "An unexpected error occurred",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    
    # Log request details
    logger.info(f"📥 {request.method} {request.url}")
    
    # Get request body for POST requests
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
        if body:
            try:
                body_str = body.decode('utf-8')
                logger.info(f"📝 Request body: {body_str[:500]}...")
            except:
                logger.info("📝 Request body: [binary data]")
    
    response = await call_next(request)
    
    # Log response details
    process_time = (datetime.now() - start_time).total_seconds()
    logger.info(f"📤 Response: {response.status_code} - {process_time:.3f}s")
    
    return response

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Blog Generator API is running",
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "blog-generator-api"
    }

# Include blog routes
app.include_router(blog_router, prefix="/api", tags=["blogs"])

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting Blog Generator API server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )