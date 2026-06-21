"""
QuestMe API — Quest CRUD Endpoints
"""

from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Query, status
from math import radians, sin, cos, sqrt, atan2

from app.models.schemas import (
    QuestCreate, QuestResponse, QuestListResponse,
    Coordinate, QuestStep, QuestReward,
)

router = APIRouter(prefix="/quests", tags=["quests"])


def haversine(a: Coordinate, b: Coordinate) -> float:
    R = 6371000
    lat1, lat2 = radians(a.latitude), radians(b.latitude)
    dlat = radians(b.latitude - a.latitude)
    dlng = radians(b.longitude - a.longitude)
    h = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
    return R * 2 * atan2(sqrt(h), sqrt(1 - h))


_quests_db: list[QuestResponse] = [
    QuestResponse(
        id="q-1", title="Таємниці Старого Міста",
        description="Маршрут історичними вулицями.", category="Історія",
        difficulty="Середньо", distance="1.2 км", duration="2 год",
        location="Поділ, Київ",
        coordinate=Coordinate(latitude=50.4592, longitude=30.5179),
        steps=[QuestStep(title="Старт", description="Знайдіть підказку.")],
        reward=QuestReward(xp=180, badge="Міський детектив"),
        accent_color="#206C5C", is_team_quest=True, participants=1247, rating=4.8,
    ),
    QuestResponse(
        id="q-2", title="Парковий Квест",
        description="Легка прогулянка парком.", category="Природа",
        difficulty="Легко", distance="500 м", duration="1 год",
        location="Парк Шевченка",
        coordinate=Coordinate(latitude=50.4418, longitude=30.5169),
        steps=[QuestStep(title="Вхід", description="Check-in.")],
        reward=QuestReward(xp=90, badge="Парк-скаут"),
        accent_color="#2F6FED", participants=892, rating=4.6,
    ),
]


@router.get("/", response_model=QuestListResponse)
async def list_quests(
    category: str | None = None,
    difficulty: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    result = list(_quests_db)
    if category:
        result = [q for q in result if q.category.lower() == category.lower()]
    if difficulty:
        result = [q for q in result if q.difficulty.value == difficulty]
    total = len(result)
    start = (page - 1) * limit
    result = result[start : start + limit]
    return QuestListResponse(data=result, total=total, page=page, has_more=start + limit < total)


@router.get("/{quest_id}", response_model=QuestResponse)
async def get_quest(quest_id: str):
    for quest in _quests_db:
        if quest.id == quest_id:
            return quest
    raise HTTPException(status_code=404, detail="Квест не знайдено.")


@router.post("/", response_model=QuestResponse, status_code=201)
async def create_quest(request: QuestCreate):
    quest = QuestResponse(
        id=str(uuid4()), title=request.title.strip(),
        description=request.description, category=request.category,
        difficulty=request.difficulty, reward=request.reward,
        steps=request.steps, is_team_quest=request.is_team_quest,
        created_at=datetime.now(timezone.utc),
    )
    _quests_db.insert(0, quest)
    return quest


@router.get("/nearby/", response_model=QuestListResponse)
async def nearby_quests(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(5, gt=0),
):
    user = Coordinate(latitude=lat, longitude=lng)
    nearby = [q for q in _quests_db if q.coordinate and haversine(user, q.coordinate) <= radius_km * 1000]
    nearby.sort(key=lambda q: haversine(user, q.coordinate) if q.coordinate else 0)
    return QuestListResponse(data=nearby, total=len(nearby))
