from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import blog

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 for testing, allow all. Use your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],  # 👈 allows POST, GET, OPTIONS etc.
    allow_headers=["*"],
)

app.include_router(blog.router, prefix="/api")