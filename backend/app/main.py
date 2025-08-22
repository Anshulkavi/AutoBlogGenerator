import logging
import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# Import your application's routers
from app.routes import blog, history

# --- Basic Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Blog Generator API",
    description="An API to generate blogs using AI and manage them with background tasks.",
    version="3.0.0"
)

# --- Middleware ---
origins = [
    "https://autobloggenerator.onrender.com",  # frontend deployed
    "http://localhost:5173",                   # local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # must exactly match frontend URL
    allow_credentials=True,
    allow_methods=["*"],          # allow GET, POST, PUT, PATCH, DELETE, OPTIONS
    allow_headers=["*"],          # allow all headers
)

# --- Routers ---
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
    if not os.getenv("GOOGLE_API_KEY"):
        logger.warning("⚠️ GOOGLE_API_KEY environment variable is MISSING.")
    if not os.getenv("MONGO_URL"):
        logger.warning("⚠️ MONGO_URL environment variable is MISSING.")

# --- Error Handler (for unexpected crashes) ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=jsonable_encoder({
            "error": "Internal server error. Please try again later.",
            "detail": str(exc)  # optional: remove in prod
        }),
        headers={"Access-Control-Allow-Origin": "*"}  # 🔑 add CORS header fallback
    )