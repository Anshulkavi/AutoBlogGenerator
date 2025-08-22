# from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.services.blog_generator import generate_blog
# from app.database.mongo import blogs_collection, jobs_collection # ✅ IMPORT jobs_collection
# from datetime import datetime, timezone
# import traceback
# import logging
# import uuid
# from bson import json_util
# import json

# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)
# router = APIRouter()

# # --- The actual background task ---
# async def run_blog_generation_in_background(job_id: str, topic: str):
#     """This function runs in the background, generates the blog, stores the result, and updates the database."""
#     logger.info(f"BACKGROUND JOB {job_id}: Starting generation for topic '{topic}'")
#     try:
#         # Generate the blog content
#         blog_data = await generate_blog(topic)
        
#         # Save the generated blog to the 'blogs' collection
#         if blog_data and blog_data.get("title") and blog_data.get("content"):
#             blog_doc = {
#                 "topic": topic,
#                 "title": blog_data["title"],
#                 "content": blog_data["content"],
#                 "created_at": datetime.now(timezone.utc),
#             }
#             insert_result = await blogs_collection.insert_one(blog_doc)
#             blog_id = str(insert_result.inserted_id)
#             blog_data["_id"] = blog_id
#             logger.info(f"BACKGROUND JOB {job_id}: Blog saved to DB with ID: {blog_id}")

#         # ✅ Update the job status to 'complete' in the database
#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {"status": "complete", "result": blog_data, "updated_at": datetime.now(timezone.utc)}}
#         )
#         logger.info(f"BACKGROUND JOB {job_id}: Generation complete.")
        
#     except Exception as e:
#         logger.error(f"BACKGROUND JOB {job_id}: Generation failed. Error: {e}")
#         logger.error(traceback.format_exc())
        
#         # ✅ Update the job status to 'failed' in the database
#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {"status": "failed", "error": str(e), "updated_at": datetime.now(timezone.utc)}}
#         )

# # --- API Endpoint to START the generation ---
# @router.post("/generate_blog")
# async def start_generation_route(req: BlogRequest, background_tasks: BackgroundTasks):
#     """Starts the blog generation and saves the job to the database."""
#     if not req.topic or not req.topic.strip():
#         raise HTTPException(status_code=400, detail="Topic is required.")

#     job_id = str(uuid.uuid4())
#     topic = req.topic.strip()
    
#     # ✅ Create a job document in the database
#     job_doc = {
#         "_id": job_id,
#         "topic": topic,
#         "status": "pending",
#         "created_at": datetime.now(timezone.utc),
#         "updated_at": datetime.now(timezone.utc)
#     }
#     await jobs_collection.insert_one(job_doc)
    
#     background_tasks.add_task(run_blog_generation_in_background, job_id, topic)
    
#     logger.info(f"Job started and saved to DB with ID: {job_id}")
#     return JSONResponse(
#         status_code=202,
#         content={"message": "Blog generation started.", "job_id": job_id}
#     )

# # --- API Endpoint to CHECK the status/result ---
# @router.get("/generate_blog/status/{job_id}")
# async def get_status_route(job_id: str):
#     job = await jobs_collection.find_one({"_id": job_id})
    
#     if not job:
#         raise HTTPException(status_code=404, detail="Job ID not found.")

#     # Convert BSON to JSON-serializable dict
#     job_json = json.loads(json_util.dumps(job))
    
#     return JSONResponse(content=job_json)

# from fastapi import APIRouter, HTTPException, BackgroundTasks
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.services.blog_generator import generate_blog
# from app.database.mongo import blogs_collection, jobs_collection
# from datetime import datetime, timezone
# import uuid
# from bson import json_util
# import json

# router = APIRouter()

# # --- Background task ---
# async def run_blog_generation_in_background(job_id: str, topic: str):
#     """Generate blog content and update the job status in the database."""
#     try:
#         blog_data = await generate_blog(topic)

#         if blog_data and blog_data.get("title") and blog_data.get("content"):
#             blog_doc = {
#                 "topic": topic,
#                 "title": blog_data["title"],
#                 "content": blog_data["content"],
#                 "created_at": datetime.now(timezone.utc),
#             }
#             insert_result = await blogs_collection.insert_one(blog_doc)
#             blog_data["_id"] = str(insert_result.inserted_id)

#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {"status": "complete", "result": blog_data, "updated_at": datetime.now(timezone.utc)}}
#         )

#     except Exception as e:
#         await jobs_collection.update_one(
#             {"_id": job_id},
#             {"$set": {"status": "failed", "error": str(e), "updated_at": datetime.now(timezone.utc)}}
#         )

# # --- API endpoint to start generation ---
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
#         "created_at": datetime.now(timezone.utc),
#         "updated_at": datetime.now(timezone.utc)
#     }
#     await jobs_collection.insert_one(job_doc)

#     background_tasks.add_task(run_blog_generation_in_background, job_id, topic)

#     return JSONResponse(
#         status_code=202,
#         content={"message": "Blog generation started.", "job_id": job_id}
#     )

# # --- API endpoint to check job status ---
# @router.get("/generate_blog/status/{job_id}")
# async def get_status_route(job_id: str):
#     job = await jobs_collection.find_one({"_id": job_id})
#     if not job:
#         raise HTTPException(status_code=404, detail="Job ID not found.")

#     # Convert BSON to JSON-serializable dict
#     job_json = json.loads(json_util.dumps(job))
#     return JSONResponse(content=job_json)

from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.models.blog_entry import BlogEntry
from app.database.mongo import blogs_collection, jobs_collection
from app.services.blog_generator import generate_blog
from datetime import datetime, timezone
from bson import ObjectId
import uuid

router = APIRouter()

# --- Background task ---
async def run_blog_generation_in_background(job_id: str, topic: str):
    try:
        blog_data = await generate_blog(topic)

        blog_entry = None
        if blog_data and blog_data.get("title") and blog_data.get("content"):
            blog_doc = {
                "topic": topic,
                "title": blog_data["title"],
                "content": blog_data["content"],
                "created_at": datetime.now(timezone.utc),
            }
            insert_result = await blogs_collection.insert_one(blog_doc)
            blog_entry = {
                "id": str(insert_result.inserted_id),
                "topic": blog_doc["topic"],
                "title": blog_doc["title"],
                "content": blog_doc["content"],
                "created_at": blog_doc["created_at"].isoformat(),
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

# --- Helper to serialize datetime and job ---
def serialize_job(job: dict) -> dict:
    data = {
        "job_id": str(job["_id"]),
        "topic": job["topic"],
        "status": job["status"],
        "error": job.get("error"),
        "created_at": job.get("created_at").isoformat() if job.get("created_at") else None,
        "updated_at": job.get("updated_at").isoformat() if job.get("updated_at") else None,
        "result": job.get("result")
    }
    return data

# --- Start blog generation ---
@router.post("/generate_blog")
async def start_generation_route(req: BlogRequest, background_tasks: BackgroundTasks):
    if not req.topic or not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required.")

    job_id = str(uuid.uuid4())
    topic = req.topic.strip()

    job_doc = {
        "_id": job_id,
        "topic": topic,
        "status": "pending",
        "result": None,
        "error": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await jobs_collection.insert_one(job_doc)
    background_tasks.add_task(run_blog_generation_in_background, job_id, topic)

    return {"message": "Blog generation started.", "job_id": job_id}

# --- Check job status (with full blog if ready) ---
@router.get("/generate_blog/status/{job_id}")
async def get_status_route(job_id: str):
    job = await jobs_collection.find_one({"_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job ID not found.")

    return serialize_job(job)

