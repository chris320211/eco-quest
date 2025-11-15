import reflex as rx
from app.states.base_state import BaseState
from app.states.gamification_state import GamificationState


def nav_item(label: str, icon: str, href: str, active: rx.Var[bool]) -> rx.Component:
    """A navigation item for the sidebar."""
    return rx.el.a(
        rx.el.div(
            rx.icon(icon, size=20, class_name="transition-colors"),
            rx.el.span(label, class_name="font-medium text-sm"),
            class_name=rx.cond(
                active,
                "flex items-center gap-3 rounded-lg px-3 py-2 text-violet-600 bg-violet-50 transition-all",
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all",
            ),
        ),
        href=href,
    )


def sidebar() -> rx.Component:
    """The sidebar component for navigation."""
    nav_items = [
        {"label": "Dashboard", "icon": "layout-dashboard", "href": "/dashboard"},
        {"label": "Log Activity", "icon": "plus-circle", "href": "/log-activity"},
        {"label": "Progress", "icon": "line-chart", "href": "/progress"},
        {"label": "Achievements", "icon": "award", "href": "/achievements"},
        {"label": "Suggestions", "icon": "lightbulb", "href": "/suggestions"},
    ]
    return rx.el.aside(
        rx.el.div(
            rx.el.div(
                rx.icon("leaf", class_name="h-8 w-8 text-violet-600"),
                rx.el.h1("EcoQuest", class_name="text-2xl font-bold text-gray-800"),
                class_name="flex items-center gap-3 px-4",
            ),
            class_name="flex items-center h-16 border-b",
        ),
        rx.el.nav(
            rx.foreach(
                nav_items,
                lambda item: nav_item(
                    item["label"],
                    item["icon"],
                    item["href"],
                    item["href"].endswith(BaseState.active_page),
                ),
            ),
            class_name="flex-1 overflow-auto py-4 px-4 flex flex-col gap-1",
        ),
        rx.el.div(
            rx.el.div(
                rx.el.div(
                    rx.image(
                        src=f"https://api.dicebear.com/9.x/initials/svg?seed={BaseState.current_user}",
                        class_name="h-10 w-10 rounded-full",
                    ),
                    rx.el.div(
                        rx.el.p(
                            BaseState.current_user, class_name="font-semibold text-sm"
                        ),
                        rx.el.div(
                            rx.el.div(
                                f"Level {GamificationState.level_data['level']}",
                                class_name="text-xs font-bold text-white bg-violet-600 px-2 py-0.5 rounded-full",
                            ),
                            class_name="flex items-center gap-1",
                        ),
                        class_name="flex flex-col",
                    ),
                    class_name="flex items-center gap-3",
                ),
                rx.el.button(
                    rx.icon("log-out", size=18),
                    on_click=BaseState.logout,
                    class_name="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800",
                ),
                class_name="flex items-center justify-between",
            ),
            class_name="mt-auto p-4 border-t",
        ),
        class_name="hidden md:flex flex-col w-64 border-r bg-white h-screen",
    )


def page_layout(main_content: rx.Component) -> rx.Component:
    """A layout that includes the sidebar and main content area."""
    return rx.el.div(
        sidebar(),
        rx.el.main(main_content, class_name="flex-1 overflow-y-auto bg-gray-50/50"),
        class_name="flex min-h-screen w-full font-['Raleway']",
    )


def require_auth(page_fn):
    """Decorator to require authentication for a page."""

    def guarded_page():
        return rx.cond(
            BaseState.is_hydrated,
            rx.cond(
                BaseState.is_authenticated,
                page_fn(),
                rx.el.div(
                    rx.el.div(
                        class_name="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"
                    ),
                    on_mount=rx.redirect("/"),
                    class_name="flex items-center justify-center h-screen",
                ),
            ),
            rx.el.div(
                rx.el.div(
                    class_name="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"
                ),
                class_name="flex items-center justify-center h-screen",
            ),
        )

    return guarded_page