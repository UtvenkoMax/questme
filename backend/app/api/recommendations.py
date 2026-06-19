"""
QuestMe API — ML Recommendations (Mock)
Content-based + collaborative filtering stub.
"""

from fastapi import APIRouter
from app.models.schemas import RecommendationRequest, RecommendationResponse, QuestResponse, Coordinate, QuestReward, QuestStep

router = APIRouter(prefix="/recommendations", tags=["ml"])

# Category → accent color mapping
CATEGORY_COLORS = {
    "Історія": "#206C5C", "Природа": "#2F6FED",
    "Розваги": "#B56B10", "Фітнес": "#BD3D3D",
    "Їжа": "#8B5CF6", "Фото": "#0891B2",
}

# ML-generated quest templates (mock)
_generated_quests = [
    QuestResponse(
        id="ml-1", title="Графіті-тур Подолом",
        description="Знайдіть 5 найвідоміших муралів на Подолі та зробіть фото.",
        category="Фото", difficulty="Легко", distance="1.8 км", duration="1.5 год",
        location="Поділ, Київ",
        coordinate=Coordinate(latitude=50.4615, longitude=30.5165),
        steps=[
            QuestStep(title="Мурал #1", description="Знайдіть мурал біля Контрактової площі."),
            QuestStep(title="Мурал #2", description="Рухайтесь вгору по Андріївському."),
        ],
        reward=QuestReward(xp=120, badge="Вуличний фотограф"),
        accent_color="#0891B2", participants=340, rating=4.7,
    ),
    QuestResponse(
        id="ml-2", title="Гастро-квест: Вареники",
        description="Знайдіть найкращі вареники у трьох закладах центру.",
        category="Їжа", difficulty="Легко", distance="2 км", duration="2 год",
        location="Центр Києва",
        coordinate=Coordinate(latitude=50.4501, longitude=30.5234),
        steps=[
            QuestStep(title="Заклад 1", description="Спробуйте вареники з вишнями."),
            QuestStep(title="Заклад 2", description="Порівняйте з варениками з картоплею."),
        ],
        reward=QuestReward(xp=100, badge="Гурман"),
        accent_color="#8B5CF6", participants=567, rating=4.9,
    ),
    QuestResponse(
        id="ml-3", title="Біг по набережній",
        description="5 км маршрут вздовж Дніпра з контрольними точками.",
        category="Фітнес", difficulty="Середньо", distance="5 км", duration="40 хв",
        location="Набережна, Київ",
        coordinate=Coordinate(latitude=50.4422, longitude=30.5287),
        steps=[
            QuestStep(title="Старт", description="Почніть біля пішохідного мосту."),
            QuestStep(title="Контрольна точка", description="Відмітьтесь на 2.5 км."),
        ],
        reward=QuestReward(xp=200, badge="Бігун"),
        accent_color="#BD3D3D", participants=189, rating=4.5,
    ),
]


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Return ML-powered quest recommendations (mock implementation)."""
    interests = set(request.interests) if request.interests else {"city", "history"}

    # Simple content-based filtering by interest → category mapping
    interest_to_category = {
        "city": "Історія", "history": "Історія", "nature": "Природа",
        "fitness": "Фітнес", "food": "Їжа", "photo": "Фото",
    }
    target_categories = {interest_to_category.get(i, "Розваги") for i in interests}

    recommended = [q for q in _generated_quests if q.category in target_categories]
    if not recommended:
        recommended = _generated_quests[:request.limit]

    reasons = {
        "Фото": "Ви цікавитесь фотографією",
        "Їжа": "На основі ваших гастрономічних вподобань",
        "Фітнес": "Для вашого активного способу життя",
        "Історія": "На основі інтересу до історії",
    }
    reason = next((reasons[c] for c in target_categories if c in reasons), "На основі ваших інтересів")

    return RecommendationResponse(quests=recommended[:request.limit], reason=reason)
