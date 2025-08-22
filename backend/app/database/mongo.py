# # backend/app/database/mongo.py
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# from dotenv import load_dotenv

# load_dotenv()
# MONGO_URL = os.getenv("MONGO_URL")

# if not MONGO_URL:
#     raise ValueError("❌ MONGO_URL not found in .env file")

# client = AsyncIOMotorClient(MONGO_URL, tls=True)
# db = client.blogDB  # This is your database name in Atlas
# blogs_collection = db.blogs  # This is your collection
# jobs_collection = db.jobs # ✅ ADD THIS LINE

# backend/app/database/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("❌ MONGO_URL not found in .env file")

# --- MongoDB Client ---
client = AsyncIOMotorClient(MONGO_URL, tls=True)
db = client.blogDB  # Your database name

# --- Collections ---
blogs_collection = db.blogs
jobs_collection = db.jobs
users_collection = db.users  # ✅ Add this for auth
history_collection = db.history  # Optional: store blog history

# --- Optional helper function for ObjectId conversion ---
from bson import ObjectId

def str_id(obj):
    """Convert ObjectId to string for JSON serialization."""
    if "_id" in obj:
        obj["_id"] = str(obj["_id"])
    return obj
