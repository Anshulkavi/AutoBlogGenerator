# from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.models.blog_entry import BlogEntry
# from app.database.mongo import blogs_collection, jobs_collection
# from app.services.blog_generator import generate_blog
# from datetime import datetime, timezone
# from bson import ObjectId
# import uuid

# router = APIRouter()

# # --- Background task ---
# async def run_blog_generation_in_background(job_id: str, topic: str):
#     try:
#         blog_data = await generate_blog(topic)

#         blog_entry = None
#         if blog_data and blog_data.get("title") and blog_data.get("content"):
#             blog_doc = {
#                 "topic": topic,
#                 "title": blog_data["title"],
#                 "content": blog_data["content"],
#                 "created_at": datetime.now(timezone.utc),
#             }
#             insert_result = await blogs_collection.insert_one(blog_doc)
#             blog_entry = {
#                 "id": str(insert_result.inserted_id),
#                 "topic": blog_doc["topic"],
#                 "title": blog_doc["title"],
#                 "content": blog_doc["content"],
#                 "created_at": blog_doc["created_at"].isoformat(),
#             }

#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {
#                 "status": "complete",
#                 "result": blog_entry,
#                 "updated_at": datetime.now(timezone.utc)
#             }}
#         )

#     except Exception as e:
#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {
#                 "status": "failed",
#                 "error": str(e),
#                 "updated_at": datetime.now(timezone.utc)
#             }}
#         )

# # --- Helper to serialize datetime and job ---
# def serialize_job(job: dict) -> dict:
#     data = {
#         "job_id": str(job["_id"]),
#         "topic": job["topic"],
#         "status": job["status"],
#         "error": job.get("error"),
#         "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
#         "updated_at": job.get("updated_at").isoformat() if job.get("updated_at") else None,
#         "result": job.get("result")
#     }
#     return data

# # --- Start blog generation ---
# @router.post("/generate_blog")
# async def start_generation_route(req: BlogRequest, background_tasks: BackgroundTasks):
#     if not req.topic or not req.topic.strip():
#         raise HTTPException(status_code=400, detail="Topic is required.")

#     job_id = str(uuid.uuid4())
#     topic = req.topic.strip()

#     job_doc = {
#         "_id": job_id,
#         "topic": topic,
#         "status": "pending",
#         "result": None,
#         "error": None,
#         "created_at": datetime.now(timezone.utc),
#         "updated_at": datetime.now(timezone.utc)
#     }
#     await jobs_collection.insert_one(job_doc)
#     background_tasks.add_task(run_blog_generation_in_background, job_id, topic)

#     return {"message": "Blog generation started.", "job_id": job_id}

# # --- Check job status (with full blog if ready) ---
# @router.get("/generate_blog/status/{job_id}")
# async def get_status_route(job_id: str):
#     job = await jobs_collection.find_one({"_id": job_id})
#     if not job:
#         raise HTTPException(status_code=404, detail="Job ID not found.")

#     return serialize_job(job)


# # routes/blog.py
# from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Depends
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.models.blog_entry import BlogEntry
# from app.database.mongo import blogs_collection, jobs_collection
# from app.services.blog_generator import generate_blog
# from services.auth import get_current_user_optional, get_current_active_user, check_rate_limit
# from datetime import datetime, timezone
# from bson import ObjectId
# from typing import Optional
# import uuid

# router = APIRouter()

# # --- Background task ---
# async def run_blog_generation_in_background(job_id: str, topic: str, user_id: Optional[str] = None):
#     """Generate blog in background with optional user tracking."""
#     try:
#         blog_data = await generate_blog(topic)

#         blog_entry = None
#         if blog_data and blog_data.get("title") and blog_data.get("content"):
#             blog_doc = {
#                 "topic": topic,
#                 "title": blog_data["title"],
#                 "content": blog_data["content"],
#                 "created_at": datetime.now(timezone.utc),
#                 "user_id": user_id,  # Track which user created this blog
#                 "is_public": user_id is None  # Public if no user (anonymous)
#             }
#             insert_result = await blogs_collection.insert_one(blog_doc)
#             blog_entry = {
#                 "id": str(insert_result.inserted_id),
#                 "topic": blog_doc["topic"],
#                 "title": blog_doc["title"],
#                 "content": blog_doc["content"],
#                 "created_at": blog_doc["created_at"].isoformat(),
#                 "user_id": user_id
#             }

#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {
#                 "status": "complete",
#                 "result": blog_entry,
#                 "updated_at": datetime.now(timezone.utc)
#             }}
#         )

#     except Exception as e:
#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {
#                 "status": "failed",
#                 "error": str(e),
#                 "updated_at": datetime.now(timezone.utc)
#             }}
#         )

# # --- Helper to serialize datetime and job ---
# def serialize_job(job: dict) -> dict:
#     data = {
#         "job_id": str(job["_id"]),
#         "topic": job["topic"],
#         "status": job["status"],
#         "error": job.get("error"),
#         "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
#         "updated_at": job.get("updated_at").isoformat() if job.get("updated_at") else None,
#         "result": job.get("result"),
#         "user_id": job.get("user_id")
#     }
#     return data

# # --- Start blog generation (with optional authentication) ---
# @router.post("/generate_blog")
# async def start_generation_route(
#     req: BlogRequest, 
#     background_tasks: BackgroundTasks,
#     current_user: Optional[dict] = Depends(get_current_user_optional)
# ):
#     """Start blog generation with optional user authentication."""
#     if not req.topic or not req.topic.strip():
#         raise HTTPException(status_code=400, detail="Topic is required.")

#     # Rate limiting for authenticated users
#     if current_user:
#         from services.auth import rate_limiter
#         if not rate_limiter.is_allowed(current_user["_id"]):
#             raise HTTPException(
#                 status_code=429,
#                 detail="Too many requests. Please try again later."
#             )

#     job_id = str(uuid.uuid4())
#     topic = req.topic.strip()
#     user_id = current_user["_id"] if current_user else None

#     job_doc = {
#         "_id": job_id,
#         "topic": topic,
#         "status": "pending",
#         "result": None,
#         "error": None,
#         "created_at": datetime.now(timezone.utc),
#         "updated_at": datetime.now(timezone.utc),
#         "user_id": user_id
#     }
#     await jobs_collection.insert_one(job_doc)
#     background_tasks.add_task(run_blog_generation_in_background, job_id, topic, user_id)

#     response = {
#         "message": "Blog generation started.",
#         "job_id": job_id
#     }
    
#     if current_user:
#         response["user"] = current_user["email"]
    
#     return response

# # --- Check job status (with user verification) ---
# @router.get("/generate_blog/status/{job_id}")
# async def get_status_route(
#     job_id: str,
#     current_user: Optional[dict] = Depends(get_current_user_optional)
# ):
#     """Get job status with optional user verification."""
#     job = await jobs_collection.find_one({"_id": job_id})
#     if not job:
#         raise HTTPException(status_code=404, detail="Job ID not found.")

#     # If user is authenticated, ensure they can only see their own jobs
#     # Unless it's a public job (no user_id)
#     if current_user and job.get("user_id") and job.get("user_id") != current_user["_id"]:
#         raise HTTPException(status_code=403, detail="Access denied to this job.")

#     return serialize_job(job)

# # --- Protected route: Get user's blog generation history ---
# @router.get("/my_blogs")
# async def get_my_blogs(current_user: dict = Depends(get_current_active_user)):
#     """Get authenticated user's blog generation history."""
#     try:
#         # Get user's jobs
#         jobs_cursor = jobs_collection.find(
#             {"user_id": current_user["_id"], "status": "complete"},
#             {"topic": 1, "created_at": 1, "result": 1}
#         ).sort("created_at", -1).limit(50)

#         blogs = []
#         async for job in jobs_cursor:
#             if job.get("result"):
#                 blogs.append({
#                     "id": job["result"].get("id"),
#                     "title": job["result"].get("title", "Untitled"),
#                     "topic": job.get("topic", "Unknown"),
#                     "created_at": job.get("created_at")
#                 })
        
#         return {
#             "user": current_user["email"],
#             "blogs": blogs,
#             "total": len(blogs)
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Failed to fetch user blogs")

# # --- Protected route: Delete user's blog ---
# @router.delete("/blog/{blog_id}")
# async def delete_blog(
#     blog_id: str,
#     current_user: dict = Depends(get_current_active_user)
# ):
#     """Delete a blog (only if owned by the user)."""
#     try:
#         obj_id = ObjectId(blog_id)
#         blog = await blogs_collection.find_one({"_id": obj_id})
        
#         if not blog:
#             raise HTTPException(status_code=404, detail="Blog not found")
        
#         # Check if user owns this blog
#         if blog.get("user_id") != current_user["_id"]:
#             raise HTTPException(status_code=403, detail="Access denied")
        
#         # Delete the blog
#         result = await blogs_collection.delete_one({"_id": obj_id})
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Blog not found")
        
#         return {"message": "Blog deleted successfully"}
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Failed to delete blog")

# # --- Analytics endpoint for authenticated users ---
# @router.get("/analytics")
# async def get_user_analytics(current_user: dict = Depends(get_current_active_user)):
#     """Get analytics for authenticated user."""
#     try:
#         from datetime import timedelta
        
#         # Count total blogs
#         total_blogs = await blogs_collection.count_documents({"user_id": current_user["_id"]})
        
#         # Count blogs in last 30 days
#         thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
#         recent_blogs = await blogs_collection.count_documents({
#             "user_id": current_user["_id"],
#             "created_at": {"$gte": thirty_days_ago}
#         })
        
#         # Get most used topics
#         pipeline = [
#             {"$match": {"user_id": current_user["_id"]}},
#             {"$group": {"_id": "$topic", "count": {"$sum": 1}}},
#             {"$sort": {"count": -1}},
#             {"$limit": 5}
#         ]
        
#         top_topics = []
#         async for doc in blogs_collection.aggregate(pipeline):
#             top_topics.append({
#                 "topic": doc["_id"],
#                 "count": doc["count"]
#             })
        
#         return {
#             "user": current_user["email"],
#             "total_blogs": total_blogs,
#             "recent_blogs": recent_blogs,
#             "top_topics": top_topics,
#             "member_since": current_user["created_at"]
#         }
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Failed to fetch analytics")

# routes/blog.py
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from datetime import datetime, timezone, timedelta
from typing import Optional
import uuid
from bson import ObjectId

from app.database.mongo import blogs_collection, jobs_collection
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.services.user_auth_service import get_current_user_optional, get_current_active_user, rate_limiter

router = APIRouter()

# --- Helper: serialize blog/job ---
def serialize_job(job: dict) -> dict:
    return {
        "job_id": str(job["_id"]),
        "topic": job.get("topic"),
        "status": job.get("status"),
        "error": job.get("error"),
        "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
        "updated_at": job.get("updated_at").isoformat() if job.get("updated_at") else None,
        "result": job.get("result"),
        "user_id": job.get("user_id")
    }

# --- Background Task ---
async def run_blog_generation_in_background(job_id: str, topic: str, user_id: Optional[str] = None):
    try:
        blog_data = await generate_blog(topic)
        blog_entry = None

        if blog_data and blog_data.get("title") and blog_data.get("content"):
            blog_doc = {
                "topic": topic,
                "title": blog_data["title"],
                "content": blog_data["content"],
                "created_at": datetime.now(timezone.utc),
                "user_id": user_id,
                "is_public": user_id is None
            }
            insert_result = await blogs_collection.insert_one(blog_doc)
            blog_entry = {
                "id": str(insert_result.inserted_id),
                "topic": blog_doc["topic"],
                "title": blog_doc["title"],
                "content": blog_doc["content"],
                "created_at": blog_doc["created_at"].isoformat(),
                "user_id": user_id
            }

        await jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {
                "status": "complete",
                "result": blog_entry,
                "updated_at": datetime.now(timezone.utc)
            }}
        )
    except Exception as e:
        await jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {
                "status": "failed",
                "error": str(e),
                "updated_at": datetime.now(timezone.utc)
            }}
        )

# --- Start Blog Generation ---
@router.post("/generate_blog")
async def start_generation_route(
    req: BlogRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    if not req.topic or not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required.")

    # Rate limiting for authenticated users
    if current_user and not rate_limiter.is_allowed(current_user["_id"]):
        raise HTTPException(status_code=429, detail="Too many requests. Try later.")

    job_id = str(uuid.uuid4())
    topic = req.topic.strip()
    user_id = current_user["_id"] if current_user else None

    job_doc = {
        "_id": job_id,
        "topic": topic,
        "status": "pending",
        "result": None,
        "error": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "user_id": user_id
    }
    await jobs_collection.insert_one(job_doc)
    background_tasks.add_task(run_blog_generation_in_background, job_id, topic, user_id)

    response = {"message": "Blog generation started.", "job_id": job_id}
    if current_user:
        response["user"] = current_user["email"]
    return response

# --- Job Status ---
@router.get("/generate_blog/status/{job_id}")
async def get_status_route(job_id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    job = await jobs_collection.find_one({"_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job ID not found.")
    if current_user and job.get("user_id") and job.get("user_id") != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Access denied to this job.")
    return serialize_job(job)

# --- User Blog History ---
@router.get("/my_blogs")
async def get_my_blogs(current_user: dict = Depends(get_current_active_user)):
    blogs_cursor = jobs_collection.find(
        {"user_id": current_user["_id"], "status": "complete"},
        {"topic": 1, "created_at": 1, "result": 1}
    ).sort("created_at", -1).limit(50)

    blogs = []
    async for job in blogs_cursor:
        if job.get("result"):
            blogs.append({
                "id": job["result"].get("id"),
                "title": job["result"].get("title"),
                "topic": job.get("topic"),
                "created_at": job.get("created_at").isoformat()
            })

    return {"user": current_user["email"], "blogs": blogs, "total": len(blogs)}

# --- Delete Blog ---
@router.delete("/blog/{blog_id}")
async def delete_blog(blog_id: str, current_user: dict = Depends(get_current_active_user)):
    try:
        obj_id = ObjectId(blog_id)
        blog = await blogs_collection.find_one({"_id": obj_id})
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        if blog.get("user_id") != current_user["_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        result = await blogs_collection.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog not found")
        return {"message": "Blog deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete blog: {str(e)}")

# --- Analytics ---
@router.get("/analytics")
async def get_user_analytics(current_user: dict = Depends(get_current_active_user)):
    total_blogs = await blogs_collection.count_documents({"user_id": current_user["_id"]})
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    recent_blogs = await blogs_collection.count_documents({
        "user_id": current_user["_id"],
        "created_at": {"$gte": thirty_days_ago}
    })

    pipeline = [
        {"$match": {"user_id": current_user["_id"]}},
        {"$group": {"_id": "$topic", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_topics = []
    async for doc in blogs_collection.aggregate(pipeline):
        top_topics.append({"topic": doc["_id"], "count": doc["count"]})

    return {
        "user": current_user["email"],
        "total_blogs": total_blogs,
        "recent_blogs": recent_blogs,
        "top_topics": top_topics,
        "member_since": current_user["created_at"]
    }
