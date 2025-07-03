from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogEntry(BaseModel):
    topic: str
    title: str
    content: str
    created_at: Optional[datetime] = None
