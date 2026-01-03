from pydantic import BaseModel
from typing import Optional

class BudgetCreate(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class BudgetUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None

class Budget(BaseModel):
    id: int
    trip_id: int
    category: str
    amount: float
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

