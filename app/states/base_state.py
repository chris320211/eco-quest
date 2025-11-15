import reflex as rx
from typing import TypedDict, Literal

ActivityType = Literal["Travel", "Purchase", "Energy"]
AchievementCategory = Literal[
    "Getting Started", "Consistency", "Impact Reduction", "Activity Mastery"
]
SuggestionCategory = Literal["Travel", "Home", "Lifestyle"]


class User(TypedDict):
    username: str
    password_hash: str


class Activity(TypedDict):
    id: int
    user: str
    type: ActivityType
    subtype: str
    details: dict
    timestamp: str
    carbon_footprint: float
    plastic_waste: float
    water_usage: float


class Achievement(TypedDict):
    id: str
    name: str
    description: str
    icon: str
    category: AchievementCategory
    goal: int
    unlocked_date: str | None


class Suggestion(TypedDict):
    title: str
    description: str
    icon: str
    category: SuggestionCategory


class BaseState(rx.State):
    """The base state for the app."""

    users: list[User] = []
    current_user: str = ""
    activities: list[Activity] = []

    @rx.var
    def is_authenticated(self) -> bool:
        return self.current_user != ""

    @rx.var
    def active_page(self) -> str:
        return self.router.page.path.strip("/")

    def _get_user(self, username: str) -> User | None:
        return next((user for user in self.users if user["username"] == username), None)

    @rx.event
    async def logout(self):
        """Log out the user."""
        self.current_user = ""
        return rx.redirect("/")