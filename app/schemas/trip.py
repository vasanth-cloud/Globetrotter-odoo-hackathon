from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class TripCreate(TripBase):
    cover_photo: Optional[str] = None

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cover_photo: Optional[str] = None
    is_public: Optional[int] = None

class Trip(TripBase):
    id: int
    user_id: int
    cover_photo: Optional[str] = None
    is_public: int
    public_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
