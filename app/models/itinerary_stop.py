#app/models/itinerary_stop.py


from sqlalchemy import Column, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class ItineraryStop(Base):
    __tablename__ = "itinerary_stops"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    arrival_date = Column(DateTime, nullable=False)
    departure_date = Column(DateTime, nullable=False)
    order_index = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    
    # Relationships
    trip = relationship("Trip", back_populates="itinerary_stops")
    city = relationship("City", back_populates="itinerary_stops")
    activities = relationship("ItineraryActivity", back_populates="stop", cascade="all, delete-orphan")


class ItineraryActivity(Base):
    __tablename__ = "itinerary_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("itinerary_stops.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    scheduled_time = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    stop = relationship("ItineraryStop", back_populates="activities")
    activity = relationship("Activity", back_populates="itinerary_activities")