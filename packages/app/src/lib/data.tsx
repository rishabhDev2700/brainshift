export type AppRoute = {
    url: string,
    text: string
}


export const appRoutes: AppRoute[] = [
    { url: "/dashboard", text: "Home" },
    { url: "/dashboard/myday", text: "My Day" },
    { url: "/dashboard/tasks", text: "Tasks" },
    { url: "/dashboard/goals", text: "Goals" },
    { url: "/dashboard/calendar", text: "Calendar" },
    { url: "/dashboard/sessions", text: "Sessions" },
]