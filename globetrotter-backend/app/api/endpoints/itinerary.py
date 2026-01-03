from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.trip import Trip
from app.models.itinerary_stop import ItineraryStop, ItineraryActivity
from app.models.user import User
from app.schemas.itinerary import (
    ItineraryStopCreate,
    ItineraryStop as ItineraryStopSchema,
    ItineraryActivityCreate
)
from app.core.deps import get_current_user

router = APIRouter()

@router.post("/{trip_id}/stops", response_model=ItineraryStopSchema)
def add_stop_to_trip(
    trip_id: int,
    stop: ItineraryStopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify trip belongs to user
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get max order index
    max_order = db.query(ItineraryStop).filter(ItineraryStop.trip_id == trip_id).count()
    
    db_stop = ItineraryStop(
        trip_id=trip_id,
        city_id=stop.city_id,
        arrival_date=stop.arrival_date,
        departure_date=stop.departure_date,
        notes=stop.notes,
        order_index=max_order
    )
    db.add(db_stop)
    db.commit()
    db.refresh(db_stop)
    return db_stop

@router.get("/{trip_id}/stops", response_model=List[ItineraryStopSchema])
def get_trip_stops(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify trip belongs to user
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    stops = db.query(ItineraryStop).filter(ItineraryStop.trip_id == trip_id).order_by(ItineraryStop.order_index).all()
    return stops

@router.post("/stops/{stop_id}/activities")
def add_activity_to_stop(
    stop_id: int,
    activity: ItineraryActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify stop exists and belongs to user's trip
    stop = db.query(ItineraryStop).filter(ItineraryStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    trip = db.query(Trip).filter(Trip.id == stop.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    db_activity = ItineraryActivity(
        stop_id=stop_id,
        activity_id=activity.activity_id,
        scheduled_time=activity.scheduled_time,
        notes=activity.notes
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/stops/{stop_id}")
def delete_stop(
    stop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stop = db.query(ItineraryStop).filter(ItineraryStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    trip = db.query(Trip).filter(Trip.id == stop.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    db.delete(stop)
    db.commit()
    return {"message": "Stop deleted successfully"}
