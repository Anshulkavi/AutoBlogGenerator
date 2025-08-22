# backend/app/database/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("❌ MONGO_URL not found in .env file")

client = AsyncIOMotorClient(MONGO_URL, tls=True)
db = client.blogDB  # This is your database name in Atlas
blogs_collection = db.blogs  # This is your collection
jobs_collection = db.jobs # ✅ ADD THIS LINE
