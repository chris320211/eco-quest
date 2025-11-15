import reflex as rx
from typing import TypedDict, Literal, Optional
import datetime
import logging
from app.states.base_state import BaseState, Activity, ActivityType


class DashboardState(BaseState):
    search_query: str = ""
    filter_type: str = ""
    filter_date_start: str = ""
    filter_date_end: str = ""

    @rx.var
    def user_activities(self) -> list[Activity]:
        """Get activities for the current user."""
        return sorted(
            [act for act in self.activities if act["user"] == self.current_user],
            key=lambda x: x["timestamp"],
            reverse=True,
        )

    @rx.var
    def filtered_activities(self) -> list[Activity]:
        """Apply filters and search to user activities."""
        activities = self.user_activities
        if self.filter_type:
            activities = [act for act in activities if act["type"] == self.filter_type]
        if self.filter_date_start:
            activities = [
                act for act in activities if act["timestamp"] >= self.filter_date_start
            ]
        if self.filter_date_end:
            activities = [
                act
                for act in activities
                if act["timestamp"] <= f"{self.filter_date_end}T23:59:59"
            ]
        if self.search_query:
            query = self.search_query.lower()
            activities = [
                act
                for act in activities
                if query in act["subtype"].lower()
                or any((query in str(v).lower() for v in act["details"].values()))
            ]
        return activities

    @rx.var
    def total_carbon_footprint(self) -> float:
        return sum((act["carbon_footprint"] for act in self.user_activities))

    @rx.var
    def recent_activities(self) -> list[Activity]:
        return self.user_activities[:5]

    @rx.event
    def clear_filters(self):
        self.search_query = ""
        self.filter_type = ""
        self.filter_date_start = ""
        self.filter_date_end = ""


class LogActivityState(DashboardState):
    """State for logging new activities."""

    selected_activity: str = "Travel"
    form_error: str = ""
    is_loading: bool = False
    travel_type: str = "car"
    distance: str = ""
    duration: str = ""
    purchase_category: str = "electronics"
    item_name: str = ""
    quantity: str = "1"
    energy_type: str = "electricity"
    consumption: str = ""

    def _reset_forms(self):
        self.distance = ""
        self.duration = ""
        self.item_name = ""
        self.quantity = "1"
        self.consumption = ""
        self.form_error = ""

    @rx.event
    def select_activity(self, activity_type: str):
        self.selected_activity = activity_type
        self._reset_forms()

    @rx.event
    def log_activity(self):
        """Event handler to log the selected activity."""
        self.is_loading = True
        self.form_error = ""
        yield
        activity_type = self.selected_activity
        subtype = ""
        details = {}
        impacts = {}
        try:
            if activity_type == "Travel":
                if not self.distance or not self.duration:
                    self.form_error = "Distance and Duration are required."
                    self.is_loading = False
                    return
                dist = float(self.distance)
                subtype = self.travel_type
                details = {"distance": self.distance, "duration": self.duration}
                impacts = {"carbon": dist * 0.21, "water": 0, "plastic": 0}
            elif activity_type == "Purchase":
                if not self.item_name or not self.quantity:
                    self.form_error = "Item Name and Quantity are required."
                    self.is_loading = False
                    return
                qty = float(self.quantity)
                subtype = self.purchase_category
                details = {"item_name": self.item_name, "quantity": self.quantity}
                impacts = {
                    "carbon": qty * 5.5,
                    "plastic": qty * 25.0,
                    "water": qty * 10.0,
                }
            elif activity_type == "Energy":
                if not self.consumption:
                    self.form_error = "Consumption is required."
                    self.is_loading = False
                    return
                cons = float(self.consumption)
                subtype = self.energy_type
                details = {"consumption": self.consumption}
                if self.energy_type == "electricity":
                    impacts = {"carbon": cons * 0.82, "water": cons * 0.1, "plastic": 0}
                else:
                    impacts = {"carbon": cons * 0.5, "water": cons * 1, "plastic": 0}
            else:
                self.form_error = "Invalid activity type selected."
                self.is_loading = False
                return
            new_activity = Activity(
                id=len(self.activities) + 1,
                user=self.current_user,
                type=activity_type,
                subtype=subtype,
                details=details,
                timestamp=datetime.datetime.now().isoformat(),
                carbon_footprint=impacts.get("carbon", 0.0),
                plastic_waste=impacts.get("plastic", 0.0),
                water_usage=impacts.get("water", 0.0),
            )
            self.activities.append(new_activity)
            self._reset_forms()
            self.is_loading = False
            yield rx.toast.success("Activity logged successfully!")
            yield rx.redirect("/dashboard")
        except ValueError as e:
            logging.exception(f"Error: {e}")
            self.form_error = "Please enter valid numbers for all fields."
            self.is_loading = False
            return