import reflex as rx
from app.states.progress_state import ProgressState

TOOLTIP_PROPS = {
    "content_style": {
        "background": "white",
        "border_color": "#E8E8E8",
        "border_radius": "0.75rem",
        "font_family": "Raleway, sans-serif",
        "font_size": "0.875rem",
    },
    "item_style": {"padding": "2px 5px"},
    "label_style": {"color": "#333", "font_weight": "600"},
}


def carbon_trend_chart() -> rx.Component:
    return rx.recharts.area_chart(
        rx.recharts.cartesian_grid(stroke_dasharray="3 3", class_name="text-gray-300"),
        rx.recharts.graphing_tooltip(**TOOLTIP_PROPS),
        rx.recharts.x_axis(data_key="date", class_name="text-xs"),
        rx.recharts.y_axis(class_name="text-xs"),
        rx.recharts.area(
            type_="monotone",
            data_key="Carbon Footprint",
            stroke="#8B5CF6",
            fill="#8B5CF6",
            fill_opacity=0.2,
            stroke_width=2,
        ),
        data=ProgressState.carbon_trend_data,
        height=300,
        class_name="font-['Raleway']",
    )


def activity_pie_chart() -> rx.Component:
    return rx.recharts.pie_chart(
        rx.recharts.graphing_tooltip(**TOOLTIP_PROPS),
        rx.recharts.pie(
            rx.foreach(
                ProgressState.activity_type_breakdown,
                lambda item: rx.recharts.cell(fill=item["fill"]),
            ),
            data=ProgressState.activity_type_breakdown,
            data_key="value",
            name_key="name",
            cx="50%",
            cy="50%",
            inner_radius=60,
            outer_radius=80,
            padding_angle=5,
            stroke="#FFFFFF",
            stroke_width=2,
        ),
        height=300,
        class_name="font-['Raleway']",
    )