from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.city import City
from app.schemas.activity import Activity

class ItineraryActivityCreate(BaseModel):
    activity_id: int
    scheduled_time: Optional[datetime] = None
    notes: Optional[str] = None

class ItineraryActivity(BaseModel):
    id: int
    stop_id: int
    activity_id: int
    scheduled_time: Optional[datetime] = None
    notes: Optional[str] = None
    activity: Optional[Activity] = None
    
    class Config:
        from_attributes = True

class ItineraryStopCreate(BaseModel):
    city_id: int
    arrival_date: datetime
    departure_date: datetime
    notes: Optional[str] = None

class ItineraryStopUpdate(BaseModel):
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    order_index: Optional[int] = None
    notes: Optional[str] = None

class ItineraryStop(BaseModel):
    id: int
    trip_id: int
    city_id: int
    arrival_date: datetime
    departure_date: datetime
    order_index: int
    notes: Optional[str] = None
    city: Optional[City] = None
    activities: List[ItineraryActivity] = []
    
    class Config:
        from_attributes = True
