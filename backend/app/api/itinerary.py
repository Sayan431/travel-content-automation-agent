from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.deps import require_admin
from app.models.models import ItineraryDay
from app.schemas.schemas import ItineraryDayIn, ItineraryDayOut

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])

# ── Default seed data ──────────────────────────────────────────
DEFAULT_DAYS = [
    {"day_label": "Day 1–2", "destination": "Amsterdam",    "color_class": "dest-amsterdam",    "sort_order": 1, "activities": ["Arrival & Canal Tour", "Van Gogh Museum", "Jordaan District Walk"]},
    {"day_label": "Day 3",   "destination": "Keukenhof",    "color_class": "dest-keukenhof",    "sort_order": 2, "activities": ["Tulip Gardens", "Flower Exhibitions", "Dutch Countryside"]},
    {"day_label": "Day 4",   "destination": "Giethoorn",    "color_class": "dest-giethoorn",    "sort_order": 3, "activities": ["Village Boat Tour", "Traditional Architecture", "Local Lunch"]},
    {"day_label": "Day 5",   "destination": "Scheveningen", "color_class": "dest-scheveningen", "sort_order": 4, "activities": ["Beach & Pier", "Seafood Dining", "Coastal Views"]},
    {"day_label": "Day 6–8", "destination": "Paris",        "color_class": "dest-paris",        "sort_order": 5, "activities": ["Eiffel Tower Visit", "Louvre Museum", "Champs-Élysées & Seine Cruise"]},
    {"day_label": "Day 9",   "destination": "Mini Europe",  "color_class": "dest-mini",         "sort_order": 6, "activities": ["Brussels City Tour", "Mini Europe Park", "Belgian Chocolates"]},
    {"day_label": "Day 10",  "destination": "Departure",    "color_class": "dest-depart",       "sort_order": 7, "activities": ["Last-minute Shopping", "Airport Transfer"]},
]


def seed_if_empty(db: Session):
    """Seed default itinerary days if table is empty."""
    if db.query(ItineraryDay).count() == 0:
        for d in DEFAULT_DAYS:
            db.add(ItineraryDay(**d))
        db.commit()


def _normalise(day: ItineraryDay) -> ItineraryDay:
    """Ensure activities is always a list, never None."""
    if day.activities is None:
        day.activities = []
    return day


# ── Public endpoint ────────────────────────────────────────────

@router.get("/", response_model=List[ItineraryDayOut])
def get_itinerary(db: Session = Depends(get_db)):
    """Returns all active itinerary days, ordered by sort_order. Seeds defaults on first call."""
    seed_if_empty(db)
    days = (
        db.query(ItineraryDay)
        .filter(ItineraryDay.is_active == True)
        .order_by(ItineraryDay.sort_order)
        .all()
    )
    return [_normalise(d) for d in days]


# ── Admin endpoints ────────────────────────────────────────────

@router.get("/all", response_model=List[ItineraryDayOut])
def get_all_itinerary(db: Session = Depends(get_db), _=Depends(require_admin)):
    """Admin: returns ALL days (including inactive), ordered by sort_order."""
    seed_if_empty(db)
    days = db.query(ItineraryDay).order_by(ItineraryDay.sort_order).all()
    return [_normalise(d) for d in days]


@router.post("/", response_model=ItineraryDayOut)
def create_day(payload: ItineraryDayIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    day = ItineraryDay(**payload.model_dump())
    db.add(day)
    db.commit()
    db.refresh(day)
    return day


@router.put("/{day_id}", response_model=ItineraryDayOut)
def update_day(day_id: int, payload: ItineraryDayIn, db: Session = Depends(get_db), _=Depends(require_admin)):
    day = db.query(ItineraryDay).filter(ItineraryDay.id == day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    for k, v in payload.model_dump().items():
        setattr(day, k, v)
    db.commit()
    db.refresh(day)
    return day


@router.delete("/{day_id}")
def delete_day(day_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    day = db.query(ItineraryDay).filter(ItineraryDay.id == day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    db.delete(day)
    db.commit()
    return {"success": True, "message": "Day deleted"}


@router.patch("/{day_id}/toggle")
def toggle_active(day_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    day = db.query(ItineraryDay).filter(ItineraryDay.id == day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    day.is_active = not day.is_active
    db.commit()
    db.refresh(day)
    return {"id": day.id, "is_active": day.is_active}
