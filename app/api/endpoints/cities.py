from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.city import City
from app.schemas.city import City as CitySchema, CityCreate

router = APIRouter()

@router.post("/", response_model=CitySchema)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    db_city = City(**city.dict())
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

@router.get("/", response_model=List[CitySchema])
def search_cities(q: str = "", country: str = "", db: Session = Depends(get_db)):
    query = db.query(City)
    if q:
        query = query.filter(City.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    cities = query.limit(50).all()
    return cities

@router.get("/{city_id}", response_model=CitySchema)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city
