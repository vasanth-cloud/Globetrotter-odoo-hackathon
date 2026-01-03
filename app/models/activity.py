from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)  # sightseeing, food, adventure, etc.
    description = Column(Text, nullable=True)
    estimated_cost = Column(Float, default=0.0)
    duration_hours = Column(Float, default=1.0)
    image_url = Column(String, nullable=True)
    
    # Relationships
    itinerary_activities = relationship("ItineraryActivity", back_populates="activity")
