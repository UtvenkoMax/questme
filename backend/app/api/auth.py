"""
QuestMe API — Auth Endpoints
JWT-based authentication with password hashing.
"""

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings
from app.models.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserProfile,
    UserProfileResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory store (replace with DB in production)
_users_db: dict[str, dict] = {}


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


@router.post("/register", response_model=UserProfileResponse)
async def register(request: UserRegisterRequest):
    """Register a new user."""
    email = request.email.strip().lower()

    if email in _users_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Користувач з таким email вже існує.",
        )

    hashed_password = pwd_context.hash(request.password)

    profile = UserProfile(
        name=request.name.strip(),
        email=email,
        created_at=datetime.now(timezone.utc),
    )

    _users_db[email] = {
        "profile": profile,
        "password_hash": hashed_password,
    }

    token = create_access_token({"sub": profile.id, "email": email})

    return UserProfileResponse(token=token, user=profile)


@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest):
    """Login with email and password."""
    email = request.email.strip().lower()
    user = _users_db.get(email)

    if not user or not pwd_context.verify(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невірний email або пароль.",
        )

    settings = get_settings()
    token = create_access_token({"sub": user["profile"].id, "email": email})

    return TokenResponse(
        token=token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    """Get user profile by ID."""
    for user_data in _users_db.values():
        if user_data["profile"].id == user_id:
            return user_data["profile"]

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Профіль не знайдено.",
    )
