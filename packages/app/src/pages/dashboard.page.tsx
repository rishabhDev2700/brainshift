import { StatCard } from "@/components/dashboard/stat-card";
import { TasksChart } from "@/components/dashboard/tasks-chart";
import { TimeChart } from "@/components/dashboard/time-chart";
import { GoalsProgress } from "@/components/dashboard/goals-progress";

function Dashboard() {
    const tasksCompleted = 124;
    const timeSpent = 124;
    const goalsAchieved = 7;
    const totalGoals = 10;

    const chartData = [
        { date: "2025-07-01", tasks: 1 },
        { date: "2025-07-02", tasks: 2 },
        { date: "2025-07-03", tasks: 5 },
        { date: "2025-07-04", tasks: 10 },
        { date: "2025-07-05", tasks: 2 },
        { date: "2025-07-06", tasks: 0 },
        { date: "2025-07-07", tasks: 4 },
        { date: "2025-07-08", tasks: 4 },
        { date: "2025-07-09", tasks: 6 },
        { date: "2025-07-10", tasks: 1 },
        { date: "2025-07-11", tasks: 1 },
        { date: "2025-07-12", tasks: 0 },
        { date: "2025-07-13", tasks: 2 },
        { date: "2025-07-14", tasks: 6 },
        { date: "2025-07-15", tasks: 10 },
    ];

    const timeData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Tasks Completed" value={tasksCompleted.toString()} />
                <StatCard title="Time Spent" value={`${timeSpent} hours`} />
                <StatCard title="Goals Achieved" value={`${goalsAchieved}/${totalGoals}`} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Tasks Completed per day</h3>
                    <TasksChart data={chartData} />
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Time Spent Overview</h3>
                    <TimeChart data={timeData} />
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Goals Progress</h3>
                <GoalsProgress achieved={goalsAchieved} total={totalGoals} />
            </div>
        </div>
    );
}

export default Dashboard;
