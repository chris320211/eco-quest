import reflex as rx
from app.states.dashboard_state import DashboardState, Activity
import datetime
from typing import Literal
from collections import defaultdict

TimePeriod = Literal["Week", "Month", "Year", "All"]


class ProgressState(DashboardState):
    time_period: TimePeriod = "Month"

    def _get_time_range(self) -> tuple[datetime.datetime, datetime.datetime]:
        today = datetime.date.today()
        if self.time_period == "Week":
            start_date = today - datetime.timedelta(days=today.weekday())
            end_date = start_date + datetime.timedelta(days=6)
        elif self.time_period == "Month":
            start_date = today.replace(day=1)
            next_month = start_date.replace(day=28) + datetime.timedelta(days=4)
            end_date = next_month - datetime.timedelta(days=next_month.day)
        elif self.time_period == "Year":
            start_date = today.replace(month=1, day=1)
            end_date = today.replace(month=12, day=31)
        else:
            return (datetime.datetime.min, datetime.datetime.max)
        return (
            datetime.datetime.combine(start_date, datetime.time.min),
            datetime.datetime.combine(end_date, datetime.time.max),
        )

    @rx.var
    def filtered_activities_by_period(self) -> list[Activity]:
        start_dt, end_dt = self._get_time_range()
        if self.time_period == "All":
            return self.user_activities
        return [
            act
            for act in self.user_activities
            if start_dt <= datetime.datetime.fromisoformat(act["timestamp"]) <= end_dt
        ]

    @rx.var
    def period_totals(self) -> dict[str, float]:
        totals = defaultdict(float)
        for act in self.filtered_activities_by_period:
            totals["carbon_footprint"] += act["carbon_footprint"]
            totals["plastic_waste"] += act["plastic_waste"]
            totals["water_usage"] += act["water_usage"]
        return {
            "carbon_footprint": round(totals["carbon_footprint"], 2),
            "plastic_waste": round(totals["plastic_waste"], 2),
            "water_usage": round(totals["water_usage"], 2),
        }

    @rx.var
    def activity_type_breakdown(self) -> list[dict]:
        breakdown = defaultdict(float)
        for act in self.filtered_activities_by_period:
            breakdown[act["type"]] += 1
        total_activities = sum(breakdown.values())
        if not total_activities:
            return []
        return [
            {
                "name": type,
                "value": count,
                "fill": {
                    "Travel": "#8B5CF6",
                    "Purchase": "#3B82F6",
                    "Energy": "#F59E0B",
                }.get(type, "#9CA3AF"),
            }
            for type, count in breakdown.items()
        ]

    @rx.var
    def carbon_trend_data(self) -> list[dict]:
        data = defaultdict(float)
        activities = self.filtered_activities_by_period
        if not activities:
            return []
        if self.time_period == "Week" or self.time_period == "Month":
            for act in activities:
                date_str = datetime.datetime.fromisoformat(act["timestamp"]).strftime(
                    "%Y-%m-%d"
                )
                data[date_str] += act["carbon_footprint"]
            start_dt, end_dt = self._get_time_range()
            current_date = start_dt.date()
            while current_date <= end_dt.date():
                date_str = current_date.strftime("%Y-%m-%d")
                if date_str not in data:
                    data[date_str] = 0
                current_date += datetime.timedelta(days=1)
            sorted_data = sorted(data.items())
            return [
                {"date": item[0][-5:], "Carbon Footprint": round(item[1], 2)}
                for item in sorted_data
            ]
        elif self.time_period == "Year":
            for act in activities:
                month_str = datetime.datetime.fromisoformat(act["timestamp"]).strftime(
                    "%Y-%m"
                )
                data[month_str] += act["carbon_footprint"]
            for i in range(1, 13):
                month_key = f"{datetime.date.today().year}-{i:02d}"
                if month_key not in data:
                    data[month_key] = 0
            sorted_data = sorted(data.items())
            return [
                {
                    "date": datetime.datetime.strptime(item[0], "%Y-%m").strftime("%b"),
                    "Carbon Footprint": round(item[1], 2),
                }
                for item in sorted_data
            ]
        return []

    @rx.event
    def set_time_period(self, period: TimePeriod):
        self.time_period = period