from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class City(Base):
    __tablename__ = "cities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False)
    region = Column(String, nullable=True)
    cost_index = Column(Float, default=100.0)  # Relative cost, 100 = average
    popularity = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    
    # Relationships
    itinerary_stops = relationship("ItineraryStop", back_populates="city")
