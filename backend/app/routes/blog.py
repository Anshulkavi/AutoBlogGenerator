# #routes/blog.py
# from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
# from fastapi.responses import JSONResponse
# from app.models.blog_request import BlogRequest
# from app.services.blog_generator import generate_blog
# from datetime import datetime, timezone
# import traceback
# import logging
# import sys
# import uuid

# # --- Setup for Background Jobs ---
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[logging.StreamHandler(sys.stdout)])
# logger = logging.getLogger(__name__)
# router = APIRouter()

# # A simple in-memory dictionary to store job statuses and results.
# # In a real production app, you would use a database like Redis for this.
# jobs = {}

# # --- The actual background task ---
# async def run_blog_generation_in_background(job_id: str, topic: str):
#     """This function runs in the background, generates the blog, and stores the result."""
#     logger.info(f"BACKGROUND JOB {job_id}: Starting generation for topic '{topic}'")
#     try:
#         # This is the slow part that runs separately
#         result = await generate_blog(topic)
#         jobs[job_id] = {"status": "complete", "result": result}
#         logger.info(f"BACKGROUND JOB {job_id}: Generation complete.")
#     except Exception as e:
#         logger.error(f"BACKGROUND JOB {job_id}: Generation failed. Error: {e}")
#         logger.error(traceback.format_exc())
#         jobs[job_id] = {"status": "failed", "error": str(e)}

# # --- API Endpoint to START the generation ---
# @router.post("/generate_blog")
# async def start_generation_route(req: BlogRequest, background_tasks: BackgroundTasks):
#     """
#     Starts the blog generation in the background and immediately returns a job ID.
#     This endpoint will now respond very quickly.
#     """
#     if not req.topic or not req.topic.strip():
#         raise HTTPException(status_code=400, detail="Topic is required.")

#     job_id = str(uuid.uuid4())
#     topic = req.topic.strip()
    
#     # Store the initial job status
#     jobs[job_id] = {"status": "pending"}
    
#     # Add the slow task to run in the background
#     background_tasks.add_task(run_blog_generation_in_background, job_id, topic)
    
#     logger.info(f"Job started with ID: {job_id} for topic: '{topic}'")
    
#     # Immediately return the job ID
#     return JSONResponse(
#         status_code=202,  # 202 Accepted: The request has been accepted for processing
#         content={"message": "Blog generation started.", "job_id": job_id}
#     )

# # --- API Endpoint to CHECK the status/result ---
# @router.get("/generate_blog/status/{job_id}")
# async def get_status_route(job_id: str):
#     """
#     Checks the status of a background job. The frontend will call this repeatedly.
#     """
#     job = jobs.get(job_id)
    
#     if not job:
#         raise HTTPException(status_code=404, detail="Job ID not found.")
    
#     logger.info(f"Status check for job ID {job_id}: {job['status']}")
#     return JSONResponse(content=job)

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from app.models.blog_request import BlogRequest
from app.services.blog_generator import generate_blog
from app.database.mongo import blogs_collection # ✅ IMPORTED
from datetime import datetime, timezone
import traceback
import logging
import uuid

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
router = APIRouter()

jobs = {}

# --- The actual background task ---
async def run_blog_generation_in_background(job_id: str, topic: str):
    """This function runs in the background, generates the blog, and stores the result."""
    logger.info(f"BACKGROUND JOB {job_id}: Starting generation for topic '{topic}'")
    try:
        # Generate the blog content
        blog_data = await generate_blog(topic)
        
        # ✅ --- ADDED DATABASE SAVING LOGIC ---
        if blog_data and blog_data.get("title") and blog_data.get("content"):
            blog_doc = {
                "topic": topic,
                "title": blog_data["title"],
                "content": blog_data["content"],
                "created_at": datetime.now(timezone.utc),
            }
            insert_result = await blogs_collection.insert_one(blog_doc)
            blog_id = str(insert_result.inserted_id)
            logger.info(f"BACKGROUND JOB {job_id}: Blog saved to DB with ID: {blog_id}")
            
            # Add the new ID to the result
            blog_data["_id"] = blog_id
        # --- END OF ADDED LOGIC ---

        jobs[job_id] = {"status": "complete", "result": blog_data}
        logger.info(f"BACKGROUND JOB {job_id}: Generation complete.")
    except Exception as e:
        logger.error(f"BACKGROUND JOB {job_id}: Generation failed. Error: {e}")
        logger.error(traceback.format_exc())
        jobs[job_id] = {"status": "failed", "error": str(e)}

# --- API Endpoint to START the generation ---
@router.post("/generate_blog")
async def start_generation_route(req: BlogRequest, background_tasks: BackgroundTasks):
    """Starts the blog generation and returns a job ID."""
    if not req.topic or not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required.")

    job_id = str(uuid.uuid4())
    topic = req.topic.strip()
    jobs[job_id] = {"status": "pending"}
    
    background_tasks.add_task(run_blog_generation_in_background, job_id, topic)
    
    logger.info(f"Job started with ID: {job_id} for topic: '{topic}'")
    return JSONResponse(
        status_code=202,
        content={"message": "Blog generation started.", "job_id": job_id}
    )

# --- API Endpoint to CHECK the status/result ---
@router.get("/generate_blog/status/{job_id}")
async def get_status_route(job_id: str):
    """Checks the status of a background job."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job ID not found.")
    
    logger.info(f"Status check for job ID {job_id}: {job['status']}")
    return JSONResponse(content=job)