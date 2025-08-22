# import os
# from datetime import datetime
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder

# # Import application routers
# from app.routes import blog, history

# app = FastAPI(
#     title="Blog Generator API",
#     description="An API to generate blogs using AI and manage them with background tasks.",
#     version="3.0.0"
# )

# # --- Middleware ---
# origins = [
#     "https://autobloggenerator.onrender.com",
#     "http://localhost:5173",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Routers ---
# app.include_router(blog.router, prefix="/api", tags=["Blog Generation"])
# app.include_router(history.router, prefix="/api", tags=["Blog History"])

# # --- Root Endpoint ---
# @app.get("/")
# async def root():
#     return {
#         "message": "Blog Generator API is online and healthy",
#         "status": "ok",
#         "timestamp": datetime.now().isoformat()
#     }

# # --- Startup Event ---
# @app.on_event("startup")
# async def startup_event():
#     if not os.getenv("GOOGLE_API_KEY"):
#         print("⚠️ GOOGLE_API_KEY environment variable is MISSING.")
#     if not os.getenv("MONGO_URL"):
#         print("⚠️ MONGO_URL environment variable is MISSING.")

# # --- Global Error Handler ---
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     return JSONResponse(
#         status_code=500,
#         content=jsonable_encoder({
#             "error": "Internal server error. Please try again later."
#         }),
#         headers={"Access-Control-Allow-Origin": "*"}
#     )

# main.py
import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

# Import application routers
from app.routes import blog, history, user_auth_routes

app = FastAPI(
    title="Blog Generator API with Authentication",
    description="An API to generate blogs using AI and manage them with JWT authentication.",
    version="3.1.0"
)

# --- Middleware ---
origins = [
    "https://autobloggenerator.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",  # Add for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(user_auth_routes.router, prefix="/api", tags=["Authentication"])
app.include_router(blog.router, prefix="/api", tags=["Blog Generation"])
app.include_router(history.router, prefix="/api", tags=["Blog History"])

# --- Root Endpoint ---
@app.get("/")
async def root():
    return {
        "message": "Blog Generator API with Authentication is online and healthy",
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "3.1.0",
        "features": ["JWT Authentication", "Blog Generation", "History Management"]
    }

# --- Health Check ---
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": {
            "google_api_configured": bool(os.getenv("GOOGLE_API_KEY")),
            "mongo_configured": bool(os.getenv("MONGO_URL")),
            "jwt_configured": bool(os.getenv("JWT_SECRET_KEY"))
        }
    }

# --- Startup Event ---
@app.on_event("startup")
async def startup_event():
    missing_vars = []
    
    if not os.getenv("GOOGLE_API_KEY"):
        missing_vars.append("GOOGLE_API_KEY")
    if not os.getenv("MONGO_URL"):
        missing_vars.append("MONGO_URL")
    if not os.getenv("JWT_SECRET_KEY"):
        missing_vars.append("JWT_SECRET_KEY")
    
    if missing_vars:
        print(f"⚠️ Missing environment variables: {', '.join(missing_vars)}")
    else:
        print("✅ All required environment variables are configured")

# --- Global Error Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=jsonable_encoder({
            "error": "Internal server error. Please try again later.",
            "timestamp": datetime.now().isoformat()
        }),
        headers={"Access-Control-Allow-Origin": "*"}
    )