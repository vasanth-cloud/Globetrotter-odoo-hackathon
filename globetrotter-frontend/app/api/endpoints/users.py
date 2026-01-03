from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema
from app.core.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user(
    full_name: str = None,
    profile_photo: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if full_name:
        current_user.full_name = full_name
    if profile_photo:
        current_user.profile_photo = profile_photo
    
    db.commit()
    db.refresh(current_user)
    return current_user
