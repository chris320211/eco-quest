import reflex as rx
from app.states.base_state import BaseState
from app.states.auth_state import AuthState
from app.states.dashboard_state import DashboardState, LogActivityState
from app.states.progress_state import ProgressState
from app.states.gamification_state import GamificationState
from app.components.sidebar import page_layout, require_auth
from app.components.forms import (
    travel_form,
    purchase_form,
    energy_form,
    activity_type_selector,
)
from app.components.charts import carbon_trend_chart, activity_pie_chart


def auth_form_field(
    label: str, name: str, placeholder: str, type: str = "text"
) -> rx.Component:
    return rx.el.div(
        rx.el.label(label, class_name="block text-sm font-medium text-gray-700"),
        rx.el.input(
            name=name,
            placeholder=placeholder,
            type=type,
            class_name="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm",
            required=True,
        ),
    )


def auth_page(title: str, submit_handler: rx.event.EventHandler) -> rx.Component:
    return rx.el.main(
        rx.el.div(
            rx.el.div(
                rx.el.div(
                    rx.icon("leaf", class_name="h-10 w-10 text-violet-600"),
                    rx.el.h1("EcoQuest", class_name="text-3xl font-bold text-gray-800"),
                    class_name="flex items-center gap-3 justify-center mb-6",
                ),
                rx.el.h2(
                    title, class_name="text-center text-2xl font-bold text-gray-900"
                ),
                rx.el.p(
                    rx.cond(
                        title == "Sign in to your account",
                        "Or ",
                        "Already have an account? ",
                    ),
                    rx.el.a(
                        rx.cond(
                            title == "Sign in to your account",
                            "create a new account",
                            "sign in",
                        ),
                        href=rx.cond(
                            title == "Sign in to your account", "/register", "/"
                        ),
                        class_name="font-medium text-violet-600 hover:text-violet-500",
                    ),
                    class_name="mt-2 text-center text-sm text-gray-600",
                ),
                rx.el.form(
                    rx.el.div(
                        auth_form_field("Username", "username", "Enter your username"),
                        auth_form_field(
                            "Password", "password", "Enter your password", "password"
                        ),
                        class_name="space-y-6",
                    ),
                    rx.cond(
                        AuthState.error_message != "",
                        rx.el.div(
                            rx.icon("badge_alert", size=16, class_name="mr-2"),
                            AuthState.error_message,
                            class_name="mt-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md",
                        ),
                        None,
                    ),
                    rx.el.div(
                        rx.el.button(
                            rx.cond(
                                AuthState.is_loading,
                                rx.el.div(
                                    class_name="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                ),
                                rx.cond(
                                    title == "Sign in to your account",
                                    "Sign In",
                                    "Create Account",
                                ),
                            ),
                            type="submit",
                            class_name="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-300",
                            disabled=AuthState.is_loading,
                        ),
                        class_name="pt-6",
                    ),
                    on_submit=submit_handler,
                    reset_on_submit=True,
                    class_name="mt-8 space-y-6",
                ),
                class_name="w-full max-w-md space-y-8",
            ),
            class_name="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50",
        ),
        class_name="font-['Raleway']",
    )


def index() -> rx.Component:
    """The login page."""
    return auth_page("Sign in to your account", AuthState.handle_login)


def register() -> rx.Component:
    """The registration page."""
    return auth_page("Create a new account", AuthState.handle_registration)


@require_auth
def dashboard() -> rx.Component:
    """The main dashboard page."""

    def metric_card(title: str, value: rx.Var, icon: str) -> rx.Component:
        return rx.el.div(
            rx.el.div(
                rx.icon(icon, size=24, class_name="text-gray-500"),
                class_name="p-3 bg-gray-100 rounded-lg",
            ),
            rx.el.div(
                rx.el.h3(title, class_name="text-sm font-medium text-gray-500"),
                rx.el.p(value, class_name="text-2xl font-bold text-gray-900"),
            ),
            class_name="flex items-center gap-4 p-6 bg-white rounded-xl border",
        )

    def activity_history_item(activity: rx.Var) -> rx.Component:
        icon_map = {"Travel": "car", "Purchase": "shopping-cart", "Energy": "bolt"}
        return rx.el.div(
            rx.el.div(
                rx.icon(
                    icon_map.get(activity["type"], "activity"),
                    class_name="text-violet-600",
                ),
                class_name="p-3 bg-violet-100 rounded-full",
            ),
            rx.el.div(
                rx.el.p(
                    rx.el.span(activity["type"], class_name="font-semibold"),
                    f" - {str(activity['subtype']).capitalize()}",
                    class_name="text-sm text-gray-800",
                ),
                rx.el.p(
                    str(activity["timestamp"]).split("T")[0],
                    class_name="text-xs text-gray-500",
                ),
                class_name="flex-grow",
            ),
            rx.el.div(
                rx.el.p(
                    f"-{str(activity['carbon_footprint'])} kg CO2",
                    class_name="text-sm font-semibold text-red-500",
                ),
                rx.el.p(
                    f"{str(activity['plastic_waste'])}g plastic",
                    class_name="text-xs text-gray-400",
                ),
                class_name="text-right",
            ),
            class_name="flex items-center gap-4 p-4 border-b w-full",
        )

    return page_layout(
        rx.el.div(
            rx.el.div(
                rx.el.h1(
                    f"Welcome back, {DashboardState.current_user}!",
                    class_name="text-3xl font-bold text-gray-900",
                ),
                rx.el.p(
                    "Here's a summary of your sustainability efforts.",
                    class_name="text-gray-500 mt-1",
                ),
                class_name="mb-8",
            ),
            rx.el.div(
                metric_card(
                    "Total Carbon Footprint",
                    f"{DashboardState.total_carbon_footprint.to_string()} kg CO2",
                    "footprints",
                ),
                metric_card(
                    "Activities Logged",
                    DashboardState.user_activities.length(),
                    "list-checks",
                ),
                metric_card(
                    "Achievements Unlocked",
                    GamificationState.unlocked_achievements_count,
                    "award",
                ),
                class_name="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
            ),
            rx.el.div(
                rx.el.h2(
                    "Recent Activities",
                    class_name="text-xl font-bold text-gray-900 mb-4",
                ),
                rx.el.div(
                    rx.cond(
                        DashboardState.recent_activities.length() > 0,
                        rx.foreach(
                            DashboardState.recent_activities, activity_history_item
                        ),
                        rx.el.div(
                            rx.el.p("No activities logged yet."),
                            rx.el.a(
                                "Log your first activity!",
                                href="/log-activity",
                                class_name="text-violet-600 font-semibold",
                            ),
                            class_name="text-center p-8 text-gray-500 bg-white rounded-lg border",
                        ),
                    ),
                    class_name="bg-white rounded-xl border",
                ),
            ),
            class_name="p-8",
        )
    )


@require_auth
def log_activity() -> rx.Component:
    """Page for logging new activities."""
    return page_layout(
        rx.el.div(
            rx.el.div(
                rx.el.h1(
                    "Log New Activity", class_name="text-3xl font-bold text-gray-900"
                ),
                rx.el.p(
                    "Select an activity type to log your impact.",
                    class_name="text-gray-500 mt-1",
                ),
                class_name="mb-8",
            ),
            rx.el.div(
                activity_type_selector(),
                rx.el.div(
                    rx.el.h3(
                        f"Log {LogActivityState.selected_activity}",
                        class_name="text-lg font-semibold text-gray-800 mb-4",
                    ),
                    rx.match(
                        LogActivityState.selected_activity,
                        ("Travel", travel_form()),
                        ("Purchase", purchase_form()),
                        ("Energy", energy_form()),
                        rx.el.p("Select an activity type above."),
                    ),
                    rx.cond(
                        LogActivityState.form_error != "",
                        rx.el.div(
                            rx.icon("badge_alert", size=16, class_name="mr-2"),
                            LogActivityState.form_error,
                            class_name="mt-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md",
                        ),
                        None,
                    ),
                    rx.el.button(
                        rx.cond(
                            LogActivityState.is_loading,
                            rx.el.div(
                                class_name="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                            ),
                            "Log Activity",
                        ),
                        on_click=LogActivityState.log_activity,
                        disabled=LogActivityState.is_loading,
                        class_name="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400",
                    ),
                    class_name="mt-8 bg-white p-8 rounded-xl border",
                ),
                class_name="grid grid-cols-1 gap-8",
            ),
            class_name="p-8 max-w-2xl mx-auto",
        )
    )


@require_auth
def progress() -> rx.Component:
    """Page for viewing progress and stats."""

    def time_period_selector() -> rx.Component:
        periods = ["Week", "Month", "Year", "All"]
        return rx.el.div(
            rx.foreach(
                periods,
                lambda p: rx.el.button(
                    p,
                    on_click=ProgressState.set_time_period(p),
                    class_name=rx.cond(
                        ProgressState.time_period == p,
                        "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-md shadow-sm",
                        "px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50",
                    ),
                ),
            ),
            class_name="flex items-center gap-2 mb-8",
        )

    def impact_metric_card(
        title: str, value: rx.Var, unit: str, icon: str, color: str
    ) -> rx.Component:
        return rx.el.div(
            rx.el.div(
                rx.icon(icon, size=24, class_name=f"text-{color}-600"),
                class_name=f"p-3 bg-{color}-100 rounded-lg",
            ),
            rx.el.div(
                rx.el.h3(title, class_name="text-sm font-medium text-gray-500"),
                rx.el.p(
                    f"{value} {unit}", class_name="text-2xl font-bold text-gray-900"
                ),
            ),
            class_name="flex items-center gap-4 p-6 bg-white rounded-xl border",
        )

    def pie_chart_legend_item(item: rx.Var) -> rx.Component:
        return rx.el.div(
            rx.el.div(
                class_name=f"w-3 h-3 rounded-sm",
                style={"background-color": item["fill"]},
            ),
            rx.el.p(item["name"], class_name="text-sm text-gray-600"),
            rx.el.p(item["value"], class_name="text-sm font-bold text-gray-800"),
            class_name="flex items-center gap-2 justify-between",
        )

    return page_layout(
        rx.el.div(
            rx.el.h1(
                "Your Progress", class_name="text-3xl font-bold text-gray-900 mb-2"
            ),
            rx.el.p(
                "Track your environmental impact over time.",
                class_name="text-gray-500 mb-8",
            ),
            time_period_selector(),
            rx.el.div(
                impact_metric_card(
                    "Carbon Footprint",
                    ProgressState.period_totals["carbon_footprint"].to_string(),
                    "kg CO2",
                    "footprints",
                    "red",
                ),
                impact_metric_card(
                    "Plastic Waste",
                    ProgressState.period_totals["plastic_waste"].to_string(),
                    "g",
                    "recycle",
                    "blue",
                ),
                impact_metric_card(
                    "Water Usage",
                    ProgressState.period_totals["water_usage"].to_string(),
                    "L",
                    "droplets",
                    "sky",
                ),
                class_name="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
            ),
            rx.el.div(
                rx.el.div(
                    rx.el.h2(
                        "Carbon Footprint Trend",
                        class_name="text-xl font-bold text-gray-900 mb-4",
                    ),
                    rx.cond(
                        ProgressState.carbon_trend_data.length() > 0,
                        carbon_trend_chart(),
                        rx.el.div(
                            "No data for this period.",
                            class_name="flex items-center justify-center h-full text-gray-500",
                        ),
                    ),
                    class_name="p-6 bg-white rounded-xl border col-span-2",
                ),
                rx.el.div(
                    rx.el.h2(
                        "Activity Breakdown",
                        class_name="text-xl font-bold text-gray-900 mb-4",
                    ),
                    rx.cond(
                        ProgressState.activity_type_breakdown.length() > 0,
                        rx.el.div(
                            activity_pie_chart(),
                            rx.el.div(
                                rx.foreach(
                                    ProgressState.activity_type_breakdown,
                                    pie_chart_legend_item,
                                ),
                                class_name="flex flex-col gap-2 mt-4",
                            ),
                            class_name="flex flex-col justify-center h-full",
                        ),
                        rx.el.div(
                            "No activities logged for this period.",
                            class_name="flex items-center justify-center h-full text-gray-500",
                        ),
                    ),
                    class_name="p-6 bg-white rounded-xl border",
                ),
                class_name="grid grid-cols-1 lg:grid-cols-3 gap-6",
            ),
            class_name="p-8",
        )
    )


@require_auth
def achievements() -> rx.Component:
    """Page for viewing achievements and progress."""

    def achievement_card(achievement: rx.Var) -> rx.Component:
        unlocked = achievement["unlocked"]
        return rx.el.div(
            rx.el.div(
                rx.el.div(
                    rx.icon(
                        achievement["icon"],
                        size=28,
                        class_name=rx.cond(unlocked, "text-amber-500", "text-gray-400"),
                    ),
                    class_name=rx.cond(
                        unlocked,
                        "p-4 bg-amber-100 rounded-lg",
                        "p-4 bg-gray-100 rounded-lg",
                    ),
                ),
                rx.el.div(
                    rx.el.h3(
                        achievement["name"], class_name="font-semibold text-gray-800"
                    ),
                    rx.el.p(
                        achievement["description"], class_name="text-sm text-gray-500"
                    ),
                    class_name="flex-grow",
                ),
                class_name="flex items-center gap-4",
            ),
            rx.cond(
                ~unlocked,
                rx.el.div(
                    rx.el.div(
                        rx.el.div(
                            class_name="bg-violet-600 h-2 rounded-full",
                            style={"width": str(achievement["progress"]) + "%"},
                        ),
                        class_name="w-full bg-gray-200 rounded-full h-2",
                    ),
                    rx.el.p(
                        f"{achievement['current']}/{achievement['goal']}",
                        class_name="text-xs font-medium text-gray-600 mt-1 text-right",
                    ),
                    class_name="mt-4",
                ),
                None,
            ),
            class_name="p-6 bg-white rounded-xl border flex flex-col justify-between",
        )

    return page_layout(
        rx.el.div(
            rx.el.h1(
                "Achievements", class_name="text-3xl font-bold text-gray-900 mb-2"
            ),
            rx.el.p(
                f"You've unlocked {GamificationState.unlocked_achievements_count} of {GamificationState.achievements_progress.length()} achievements.",
                class_name="text-gray-500 mb-8",
            ),
            rx.el.div(
                rx.foreach(GamificationState.achievements_progress, achievement_card),
                class_name="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            ),
            class_name="p-8",
        )
    )


@require_auth
def suggestions() -> rx.Component:
    """Page displaying sustainability suggestions."""

    def suggestion_card(suggestion: rx.Var) -> rx.Component:
        return rx.el.div(
            rx.el.div(
                rx.icon(suggestion["icon"], class_name="text-violet-600"),
                class_name="p-3 bg-violet-100 rounded-lg",
            ),
            rx.el.div(
                rx.el.h3(suggestion["title"], class_name="font-semibold text-gray-800"),
                rx.el.p(suggestion["description"], class_name="text-sm text-gray-500"),
            ),
            class_name="flex items-start gap-4 p-6 bg-white rounded-xl border",
        )

    return page_layout(
        rx.el.div(
            rx.el.h1("Suggestions", class_name="text-3xl font-bold text-gray-900"),
            rx.el.p(
                "Discover new ways to reduce your environmental impact.",
                class_name="text-gray-500 mt-2 mb-8",
            ),
            rx.el.div(
                rx.icon("info", class_name="mr-2 text-blue-500"),
                rx.el.p(
                    "Personalized AI suggestions are coming soon! This feature requires additional setup.",
                    class_name="text-sm text-blue-700",
                ),
                class_name="bg-blue-50 border border-blue-200 p-4 rounded-md mb-8 flex items-center",
            ),
            rx.el.div(
                rx.foreach(GamificationState.suggestions, suggestion_card),
                class_name="grid grid-cols-1 md:grid-cols-2 gap-6",
            ),
            class_name="p-8",
        )
    )


app = rx.App(
    theme=rx.theme(appearance="light"),
    head_components=[
        rx.el.link(rel="preconnect", href="https://fonts.googleapis.com"),
        rx.el.link(rel="preconnect", href="https://fonts.gstatic.com", cross_origin=""),
        rx.el.link(
            href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap",
            rel="stylesheet",
        ),
    ],
)
app.add_page(index, route="/")
app.add_page(register, route="/register")
app.add_page(dashboard, route="/dashboard")
app.add_page(log_activity, route="/log-activity")
app.add_page(progress, route="/progress")
app.add_page(achievements, route="/achievements")
app.add_page(suggestions, route="/suggestions")