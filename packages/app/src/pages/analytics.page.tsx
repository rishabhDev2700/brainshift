import { StatCard } from "@/components/dashboard/stat-card";
import { TasksChart } from "@/components/dashboard/tasks-chart";
import { TimeChart } from "@/components/dashboard/time-chart";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsDashboard } from "../hooks/useAnalytics";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

function Analytics() {
    const [date, setDate] = useState<DateRange>({
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
    });
    const [appliedDateRange, setAppliedDateRange] = useState<DateRange>(date);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const { data: analyticsData, isLoading, isError, error } = useAnalyticsDashboard(
        appliedDateRange.from?.toISOString(),
        appliedDateRange.to?.toISOString()
    );

    useEffect(() => {
        setAppliedDateRange(date);
    }, []);

    const handleApplyDateRange = () => {
        setAppliedDateRange(date);
        setIsPopoverOpen(false);
    };

    if (isLoading) {
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

    if (isError) {
        return <div className="p-4 md:p-8">Error: {error?.message}</div>;
    }

    // Provide default empty arrays if data is null/undefined to prevent errors
    const tasksPerDay = analyticsData?.tasksPerDay || [];
    const timeSpentOverview = analyticsData?.timeSpentOverview || [];
    const totalGoalsAchieved = analyticsData?.totalGoalsAchieved || 0;
    const totalGoals = analyticsData?.totalGoals || 0;
    const totalTasksCompleted = analyticsData?.totalTasksCompleted || 0;
    const totalTimeSpent = analyticsData?.totalTimeSpent || 0;


    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">User Analytics</h2>
                <div className="grid gap-2">
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-xs md:w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>{format(date.from, "LLL dd, y")}
                                            {" - "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                                required
                            />
                            <div className="p-2">
                                <Button onClick={handleApplyDateRange} className="w-full">Apply</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-full max-w-screen content-center">
                <StatCard title="Tasks Completed" value={totalTasksCompleted.toString()} />
                <StatCard title="Time Spent" value={`${(totalTimeSpent / 60).toFixed(1)} hours`} />
                <StatCard title="Goals Achieved" value={`${totalGoalsAchieved}/${totalGoals}`} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
                <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Tasks Completed per day</h3>
                    <TasksChart data={tasksPerDay} />
                </div>
                <div className="p-4 border rounded-lg shadow-sm overflow-x-auto">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Time Spent Overview</h3>
                    <TimeChart data={timeSpentOverview} />
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Goals Progress</h3>
                <GoalsProgress achieved={totalGoalsAchieved} total={totalGoals} />
            </div>
        </div>
    );
}

export default Analytics;
