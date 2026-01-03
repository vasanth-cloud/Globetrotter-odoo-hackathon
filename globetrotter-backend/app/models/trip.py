from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Trip(Base):
    __tablename__ = "trips"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    cover_photo = Column(String, nullable=True)
    is_public = Column(Integer, default=0)  # 0=private, 1=public
    public_url = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="trips")
    itinerary_stops = relationship("ItineraryStop", back_populates="trip", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="trip", cascade="all, delete-orphan")
