import reflex as rx
from app.states.dashboard_state import DashboardState, Activity
from app.states.base_state import Achievement, Suggestion
from typing import TypedDict
from collections import defaultdict
import datetime

ALL_ACHIEVEMENTS: list[Achievement] = [
    {
        "id": "first_activity",
        "name": "First Step",
        "description": "Log your very first activity.",
        "icon": "footprints",
        "category": "Getting Started",
        "goal": 1,
        "unlocked_date": None,
    },
    {
        "id": "first_week",
        "name": "Consistent Challenger",
        "description": "Log an activity every day for 7 days.",
        "icon": "calendar-days",
        "category": "Consistency",
        "goal": 7,
        "unlocked_date": None,
    },
    {
        "id": "travel_pro",
        "name": "Eco-Traveler",
        "description": "Log 10 travel activities.",
        "icon": "car",
        "category": "Activity Mastery",
        "goal": 10,
        "unlocked_date": None,
    },
    {
        "id": "purchase_pro",
        "name": "Conscious Consumer",
        "description": "Log 10 purchase activities.",
        "icon": "shopping-cart",
        "category": "Activity Mastery",
        "goal": 10,
        "unlocked_date": None,
    },
    {
        "id": "energy_pro",
        "name": "Energy Saver",
        "description": "Log 10 energy activities.",
        "icon": "bolt",
        "category": "Activity Mastery",
        "goal": 10,
        "unlocked_date": None,
    },
    {
        "id": "carbon_cut_100",
        "name": "Carbon Cutter",
        "description": "Reduce your carbon footprint by 100 kg.",
        "icon": "sparkles",
        "category": "Impact Reduction",
        "goal": 100,
        "unlocked_date": None,
    },
]
STATIC_SUGGESTIONS: list[Suggestion] = [
    {
        "title": "Use Public Transport",
        "description": "Opt for buses, trains, or subways to reduce your carbon emissions from personal vehicles.",
        "icon": "bus",
        "category": "Travel",
    },
    {
        "title": "Unplug Electronics",
        "description": "Unplug chargers and appliances when not in use to avoid phantom energy consumption.",
        "icon": "plug-zap",
        "category": "Home",
    },
    {
        "title": "Bring a Reusable Bag",
        "description": "Carry a reusable bag for shopping to reduce plastic waste from single-use bags.",
        "icon": "shopping-bag",
        "category": "Lifestyle",
    },
    {
        "title": "Shorter Showers",
        "description": "Reduce your shower time by just a few minutes to save a significant amount of water and energy.",
        "icon": "shower-head",
        "category": "Home",
    },
    {
        "title": "Bike or Walk",
        "description": "For short distances, choose to bike or walk instead of driving. It's great for you and the planet.",
        "icon": "bike",
        "category": "Travel",
    },
    {
        "title": "Eat Local",
        "description": "Support local farmers and reduce the carbon footprint associated with long-distance food transport.",
        "icon": "carrot",
        "category": "Lifestyle",
    },
]


class LevelInfo(TypedDict):
    level: int
    progress: float
    current_xp: int
    next_level_xp: int


class AchievementProgress(TypedDict):
    id: str
    name: str
    description: str
    icon: str
    category: str
    goal: int
    current: int
    progress: float
    unlocked: bool


class GamificationState(DashboardState):
    """Handles gamification, achievements, and suggestions."""

    @rx.var
    def points(self) -> int:
        """Total points are based on the number of activities logged."""
        return len(self.user_activities)

    @rx.var
    def level_data(self) -> LevelInfo:
        """Calculates the user's current level and progress."""
        xp = self.points
        level = 1
        xp_for_next = 10
        required_xp = 0
        while xp >= xp_for_next:
            level += 1
            required_xp = xp_for_next
            xp_for_next = round(xp_for_next * 1.8)
        xp_in_level = xp - required_xp
        xp_needed_for_level = xp_for_next - required_xp
        progress = (
            xp_in_level / xp_needed_for_level * 100 if xp_needed_for_level > 0 else 0
        )
        return {
            "level": level,
            "progress": round(progress, 2),
            "current_xp": xp_in_level,
            "next_level_xp": xp_needed_for_level,
        }

    @rx.var
    def achievements_progress(self) -> list[AchievementProgress]:
        """Calculate progress for all achievements."""
        progress_list = []
        activities = self.user_activities
        activity_count = len(activities)
        type_counts = defaultdict(int)
        total_carbon = 0
        daily_logs = set()
        for act in activities:
            type_counts[act["type"]] += 1
            total_carbon += act["carbon_footprint"]
            daily_logs.add(datetime.datetime.fromisoformat(act["timestamp"]).date())
        streak = 0
        today = datetime.date.today()
        d = today
        while d in daily_logs:
            streak += 1
            d -= datetime.timedelta(days=1)
        for ach in ALL_ACHIEVEMENTS:
            current_progress = 0
            if ach["id"] == "first_activity":
                current_progress = activity_count
            elif ach["id"] == "first_week":
                current_progress = streak
            elif ach["id"] == "travel_pro":
                current_progress = type_counts.get("Travel", 0)
            elif ach["id"] == "purchase_pro":
                current_progress = type_counts.get("Purchase", 0)
            elif ach["id"] == "energy_pro":
                current_progress = type_counts.get("Energy", 0)
            elif ach["id"] == "carbon_cut_100":
                current_progress = int(total_carbon)
            unlocked = current_progress >= ach["goal"]
            progress_percent = min(current_progress / ach["goal"] * 100, 100)
            progress_list.append(
                {
                    "id": ach["id"],
                    "name": ach["name"],
                    "description": ach["description"],
                    "icon": ach["icon"],
                    "category": ach["category"],
                    "goal": ach["goal"],
                    "current": current_progress,
                    "progress": progress_percent,
                    "unlocked": unlocked,
                }
            )
        return progress_list

    @rx.var
    def unlocked_achievements_count(self) -> int:
        return sum((1 for ach in self.achievements_progress if ach["unlocked"]))

    @rx.var
    def suggestions(self) -> list[Suggestion]:
        return STATIC_SUGGESTIONS