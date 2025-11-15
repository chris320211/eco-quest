import reflex as rx
from app.states.dashboard_state import LogActivityState


def _form_input(
    label: str,
    name: str,
    value: rx.Var,
    on_change: rx.event.EventHandler,
    placeholder: str,
    type: str = "text",
) -> rx.Component:
    """A styled form input component."""
    return rx.el.div(
        rx.el.label(label, class_name="block text-sm font-medium text-gray-700 mb-1"),
        rx.el.input(
            name=name,
            type=type,
            on_change=on_change,
            placeholder=placeholder,
            class_name="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition shadow-sm",
            default_value=value,
        ),
        class_name="w-full",
    )


def _form_select(
    label: str,
    name: str,
    value: rx.Var,
    on_change: rx.event.EventHandler,
    options: list[tuple[str, str]],
) -> rx.Component:
    """A styled form select component."""
    return rx.el.div(
        rx.el.label(label, class_name="block text-sm font-medium text-gray-700 mb-1"),
        rx.el.select(
            rx.foreach(
                options, lambda option: rx.el.option(option[0], value=option[1])
            ),
            name=name,
            value=value,
            on_change=on_change,
            class_name="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition shadow-sm bg-white",
        ),
        class_name="w-full",
    )


def travel_form() -> rx.Component:
    return rx.el.div(
        _form_select(
            "Type",
            "travel_type",
            LogActivityState.travel_type,
            LogActivityState.set_travel_type,
            [
                ("Car", "car"),
                ("Flight", "flight"),
                ("Public Transport", "public_transport"),
            ],
        ),
        _form_input(
            "Distance (km)",
            "distance",
            LogActivityState.distance,
            LogActivityState.set_distance,
            "e.g., 50",
        ),
        _form_input(
            "Duration (hours)",
            "duration",
            LogActivityState.duration,
            LogActivityState.set_duration,
            "e.g., 1.5",
        ),
        class_name="flex flex-col gap-4",
    )


def purchase_form() -> rx.Component:
    return rx.el.div(
        _form_select(
            "Category",
            "purchase_category",
            LogActivityState.purchase_category,
            LogActivityState.set_purchase_category,
            [
                ("Electronics", "electronics"),
                ("Clothing", "clothing"),
                ("Food", "food"),
            ],
        ),
        _form_input(
            "Item Name",
            "item_name",
            LogActivityState.item_name,
            LogActivityState.set_item_name,
            "e.g., Laptop",
        ),
        _form_input(
            "Quantity",
            "quantity",
            LogActivityState.quantity,
            LogActivityState.set_quantity,
            "e.g., 1",
        ),
        class_name="flex flex-col gap-4",
    )


def energy_form() -> rx.Component:
    return rx.el.div(
        _form_select(
            "Type",
            "energy_type",
            LogActivityState.energy_type,
            LogActivityState.set_energy_type,
            [
                ("Electricity", "electricity"),
                ("Heating", "heating"),
                ("Water", "water"),
            ],
        ),
        _form_input(
            "Consumption (kWh/liters)",
            "consumption",
            LogActivityState.consumption,
            LogActivityState.set_consumption,
            "e.g., 150",
        ),
        class_name="flex flex-col gap-4",
    )


def activity_type_selector() -> rx.Component:
    """Selector for different activity types with icons."""
    activity_types = [
        {"name": "Travel", "icon": "car"},
        {"name": "Purchase", "icon": "shopping-cart"},
        {"name": "Energy", "icon": "bolt"},
    ]

    def selector_button(activity: dict):
        is_selected = LogActivityState.selected_activity == activity["name"]
        return rx.el.button(
            rx.icon(activity["icon"], size=24),
            rx.el.span(activity["name"]),
            on_click=lambda: LogActivityState.select_activity(activity["name"]),
            class_name=rx.cond(
                is_selected,
                "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-violet-600 bg-violet-50 text-violet-700 font-semibold w-full h-28 transition",
                "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 w-full h-28 transition",
            ),
        )

    return rx.el.div(
        rx.foreach(activity_types, selector_button), class_name="grid grid-cols-3 gap-4"
    )