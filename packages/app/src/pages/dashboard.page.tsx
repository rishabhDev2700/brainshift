import { StatCard } from "@/components/dashboard/stat-card";
import { TasksChart } from "@/components/dashboard/tasks-chart";
import { TimeChart } from "@/components/dashboard/time-chart";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { useState, useEffect } from "react";
import { dataService } from "@/services/api-service";
import { Skeleton } from "@/components/ui/skeleton";

function Dashboard() {
    const [analyticsData, setAnalyticsData] = useState({
        totalTasksCompleted: 0,
        totalTimeSpent: 0,
        totalGoalsAchieved: 0,
        totalGoals: 0,
        tasksPerDay: [],
        timeSpentOverview: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                const data = await dataService.getAnalyticsDashboard();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 space-y-8">
                <Skeleton className="h-8 w-1/3 mb-8" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-full max-w-screen content-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
                    <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                    <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-[200px] w-full" />
                    </div>
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-[100px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-full max-w-screen content-center">
                <StatCard title="Tasks Completed" value={analyticsData.totalTasksCompleted.toString()} />
                <StatCard title="Time Spent" value={`${(analyticsData.totalTimeSpent / 60).toFixed(1)} hours`} />
                <StatCard title="Goals Achieved" value={`${analyticsData.totalGoalsAchieved}/${analyticsData.totalGoals}`} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
                <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Tasks Completed per day</h3>
                    <TasksChart data={analyticsData.tasksPerDay} />
                </div>
                <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Time Spent Overview</h3>
                    <TimeChart data={analyticsData.timeSpentOverview} />
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Goals Progress</h3>
                <GoalsProgress achieved={analyticsData.totalGoalsAchieved} total={analyticsData.totalGoals} />
            </div>
        </div>
    );
}

export default Dashboard;
