
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.blog import router as blog_router
from app.routes.history import router as history_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 for testing, allow all. Use frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blog_router, prefix="/api")
app.include_router(history_router, prefix="/api")

