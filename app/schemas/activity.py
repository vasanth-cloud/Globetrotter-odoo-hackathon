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

class Activity(ActivityBase):
    id: int
    estimated_cost: float
    duration_hours: float
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True
