from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.database import get_db
from app.models.trip import Trip
from app.models.budget import Budget
from app.models.user import User
from app.schemas.budget import BudgetCreate, Budget as BudgetSchema, BudgetSummary
from app.core.deps import get_current_user

router = APIRouter()

@router.post("/{trip_id}", response_model=BudgetSchema)
def add_budget(
    trip_id: int,
    budget: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify trip belongs to user
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db_budget = Budget(
        trip_id=trip_id,
        category=budget.category,
        amount=budget.amount,
        description=budget.description
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.get("/{trip_id}", response_model=List[BudgetSchema])
def get_trip_budget(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    budgets = db.query(Budget).filter(Budget.trip_id == trip_id).all()
    return budgets

@router.get("/{trip_id}/summary", response_model=BudgetSummary)
def get_budget_summary(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    budgets = db.query(Budget).filter(Budget.trip_id == trip_id).all()
    
    summary = {
        "total_budget": sum(b.amount for b in budgets),
        "transport": sum(b.amount for b in budgets if b.category == "transport"),
        "stay": sum(b.amount for b in budgets if b.category == "stay"),
        "activities": sum(b.amount for b in budgets if b.category == "activities"),
        "meals": sum(b.amount for b in budgets if b.category == "meals"),
        "other": sum(b.amount for b in budgets if b.category not in ["transport", "stay", "activities", "meals"])
    }
    
    return summary
