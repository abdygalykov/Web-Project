from .models import Category


DEFAULT_CATEGORIES = [
    {'name': 'Salary', 'type': 'income', 'icon': '💰', 'color': '#22c55e'},
    {'name': 'Freelance', 'type': 'income', 'icon': '💻', 'color': '#06b6d4'},
    {'name': 'Investments', 'type': 'income', 'icon': '📈', 'color': '#8b5cf6'},
    {'name': 'Gifts', 'type': 'income', 'icon': '🎁', 'color': '#f59e0b'},
    {'name': 'Products', 'type': 'expense', 'icon': '🛒', 'color': '#ef4444'},
    {'name': 'Transport', 'type': 'expense', 'icon': '🚗', 'color': '#f97316'},
    {'name': 'Entertainment', 'type': 'expense', 'icon': '🎬', 'color': '#ec4899'},
    {'name': 'Utility bills', 'type': 'expense', 'icon': '🏠', 'color': '#64748b'},
    {'name': 'Health', 'type': 'expense', 'icon': '💊', 'color': '#14b8a6'},
    {'name': 'Clothes', 'type': 'expense', 'icon': '👕', 'color': '#a855f7'},
    {'name': 'Education', 'type': 'expense', 'icon': '📚', 'color': '#3b82f6'},
    {'name': 'Restaurants', 'type': 'expense', 'icon': '🍽️', 'color': '#e11d48'},
]


def ensure_default_categories() -> None:
    for category in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(
            name=category['name'],
            is_default=True,
            defaults=category,
        )
