import { Home, CheckSquare, Target, Calendar, PlayCircle, BarChart2, Users, MessageSquare, Settings } from "lucide-react";
import React from "react";

export type AppRoute = {
    url: string,
    text: string,
    icon: React.ElementType
}


export const appRoutes: AppRoute[] = [
    { url: "/dashboard", text: "Home", icon: Home },
    { url: "/dashboard/tasks", text: "Tasks", icon: CheckSquare },
    { url: "/dashboard/goals", text: "Goals", icon: Target },
    { url: "/dashboard/calendar", text: "Calendar", icon: Calendar },
    { url: "/dashboard/sessions", text: "Sessions", icon: PlayCircle },
    { url: "/dashboard/analytics", text: "Analytics", icon: BarChart2 },
    { url: "/dashboard/friends", text: "Friends", icon: Users },
    { url: "/dashboard/feedback", text: "Feedback", icon: MessageSquare },
    { url: "/dashboard/settings", text: "Settings", icon: Settings },
]