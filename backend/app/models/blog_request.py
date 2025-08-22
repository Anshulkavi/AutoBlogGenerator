#models/blog_request.py
from pydantic import BaseModel

class BlogRequest(BaseModel):
    topic: str