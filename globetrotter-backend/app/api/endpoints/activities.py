from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.activity import Activity
from app.schemas.activity import Activity as ActivitySchema, ActivityCreate

router = APIRouter()

@router.post("/", response_model=ActivitySchema)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/", response_model=List[ActivitySchema])
def search_activities(
    q: str = "",
    category: str = "",
    max_cost: float = None,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if q:
        query = query.filter(Activity.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Activity.category == category)
    if max_cost:
        query = query.filter(Activity.estimated_cost <= max_cost)
    activities = query.limit(50).all()
    return activities

@router.get("/{activity_id}", response_model=ActivitySchema)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity
