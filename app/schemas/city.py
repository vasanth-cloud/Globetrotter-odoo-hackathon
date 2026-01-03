from pydantic import BaseModel
from typing import Optional

class CityBase(BaseModel):
    name: str
    country: str
    region: Optional[str] = None

class CityCreate(CityBase):
    cost_index: Optional[float] = 100.0
    popularity: Optional[int] = 0
    description: Optional[str] = None
    image_url: Optional[str] = None

