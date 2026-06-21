"""
QuestMe Backend — Pydantic Models / Schemas
"""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID, uuid4


# ─── Auth ───────────────────────────────────────────────

class AuthProvider(str, Enum):
    backend = "backend"
    local = "local"


class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8)


class UserLoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    expires_in: int


class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    auth_provider: AuthProvider = AuthProvider.backend
    avatar_url: str | None = None
    xp: int = 0
    level: int = 1
    quests_completed: int = 0
    badges: list[str] = []


class UserProfileResponse(BaseModel):
    token: str | None = None
    user: UserProfile


# ─── Quests ─────────────────────────────────────────────

class Difficulty(str, Enum):
    easy = "Легко"
    medium = "Середньо"
    hard = "Складно"


class Coordinate(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class QuestStep(BaseModel):
    title: str
    description: str = ""
    checkpoint: Coordinate | None = None
    verification_type: str = "geofence"


class QuestReward(BaseModel):
    xp: int = Field(gt=0)
    badge: str | None = None


class TeamMember(BaseModel):
    name: str
    status: str = "ready"  # ready | walking | arrived


class QuestCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    description: str = ""
    category: str = "Загальне"
    difficulty: Difficulty = Difficulty.easy
    coordinate: Coordinate | None = None
    steps: list[QuestStep] = []
    reward: QuestReward = QuestReward(xp=50)
    is_team_quest: bool = False
    max_team_size: int = 4
    geofence_radius_meters: int = 100
    recommended_gear: list[str] = []


class QuestResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    description: str
    category: str
    difficulty: Difficulty
    distance: str = "0 м"
    duration: str = "30 хв"
    location: str = ""
    coordinate: Coordinate | None = None
    route: list[Coordinate] = []
    steps: list[QuestStep] = []
    reward: QuestReward
    accent_color: str = "#0066CC"
    geofence_radius_meters: int = 100
    is_new: bool = True
    is_team_quest: bool = False
    participants: int = 0
    rating: float = 0
    recommended_gear: list[str] = []
    team: list[TeamMember] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    creator_id: str | None = None


class QuestListResponse(BaseModel):
    data: list[QuestResponse]
    total: int
    page: int = 1
    has_more: bool = False


# ─── Achievements ───────────────────────────────────────

class Achievement(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked: bool = False
    unlocked_at: datetime | None = None


# ─── Leaderboard ────────────────────────────────────────

class LeaderboardEntry(BaseModel):
    user_id: str
    name: str
    avatar_url: str | None = None
    xp: int
    level: int
    rank: int
    quests_completed: int


# ─── Recommendations ────────────────────────────────────

class RecommendationRequest(BaseModel):
    user_id: str
    interests: list[str] = []
    latitude: float | None = None
    longitude: float | None = None
    limit: int = 10


class RecommendationResponse(BaseModel):
    quests: list[QuestResponse]
    reason: str = "На основі ваших інтересів"
