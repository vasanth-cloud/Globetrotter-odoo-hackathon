from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    category = Column(String, nullable=False)  # transport, stay, activities, meals
    amount = Column(Float, default=0.0)
    description = Column(String, nullable=True)
    
    # Relationships
    trip = relationship("Trip", back_populates="budgets")
