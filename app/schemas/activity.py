from pydantic import BaseModel
from typing import Optional

class ActivityBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None

class ActivityCreate(ActivityBase):
    estimated_cost: Optional[float] = 0.0
    duration_hours: Optional[float] = 1.0
    image_url: Optional[str] = None

