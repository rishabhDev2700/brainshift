import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useGoals } from '../hooks/useGoals';
import { useEventsByDate } from '../hooks/useEvents';
import { useAddSession } from '../hooks/useSessions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function Dashboard() {
    const todayISO = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();
    const { mutateAsync: createSession } = useAddSession();
    const [isCreatingSession, setIsCreatingSession] = useState(false);

    const handleQuickSessionStart = async () => {
        setIsCreatingSession(true);
        try {
            const newSession = await createSession({
                targetType: "task",
                startTime: new Date().toISOString(),
                isCancelled: false,
                isPomodoro: false,
                completed: false,
            });
            toast.success("Quick session started!", { description: "Your session is now active." });
            navigate(`/dashboard/sessions/${newSession.id}`);
        } catch (error) {
            toast.error("Failed to start quick session.");
            console.error("Error starting quick session:", error);
        } finally {
            setIsCreatingSession(false);
        }
    };

    const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useTasks();
    const { data: goals, isLoading: goalsLoading, isError: goalsError } = useGoals();
    const { data: events, isLoading: eventsLoading, isError: eventsError } = useEventsByDate(todayISO);

    const isLoading = tasksLoading || goalsLoading || eventsLoading;
    const isError = tasksError || goalsError || eventsError;

    // Data filtering - directly using data from hooks
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);

    const tasksDueToday = tasks?.filter(task => {
        const deadline = new Date(task.deadline);
        return task.status !== "COMPLETED" && deadline.toDateString() === todayDate.toDateString();
    }) || [];

    const tasksDueSoon = tasks?.filter(task => {
        const deadline = new Date(task.deadline);
        return task.status !== "COMPLETED" && deadline > todayDate && deadline <= tomorrowDate;
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) || [];

    const achievableGoals = goals?.filter(goal => {
        return goal.status === "IN PROGRESS" && tasks?.some(task => task.status !== "COMPLETED" && task.description?.includes(goal.title.split(' ')[0]));
    }) || [];

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <Skeleton className="h-10 w-48" />
                    <div className="flex flex-wrap justify-end gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <section>
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (isError) {
        return <div className="p-4 md:p-8">Error loading dashboard data.</div>;
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className=" mb-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="flex flex-wrap gap-4 w-full">
                    <Button onClick={handleQuickSessionStart} disabled={isCreatingSession} className="bg-emerald-600 hover:bg-emerald-700">
                        {isCreatingSession ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        Quick Start Session
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link to="/dashboard/goals/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Goal
                        </Link>
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link to="/dashboard/tasks/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Link>
                    </Button>

                </div>
            </div>

            <section>
                <h3 className="text-lg md:text-2xl font-semibold mb-4">Today's Events</h3>
                {events && events.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map(event => (
                            <Card key={event.id}>
                                <CardHeader>
                                    <CardTitle>{event.title}</CardTitle>
                                    <CardDescription className='text-xs md:text-md'>{event.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{new Date(event.date).toLocaleTimeString()}</span>
                                    </div>
                                    <Link to={`/dashboard/calendar/${event.id}`} className="mt-4 block">
                                        <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                                            View Event
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs md:text-md">No events scheduled for today.</p>
                )}
            </section>

            <section>
                <h3 className="text-lg md:text-2xl font-semibold mb-4">Tasks Due Today</h3>
                {tasksDueToday.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasksDueToday.map(task => (
                            <Card key={task.id}>
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                    <CardDescription className='text-xs md:text-md'>{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                                            task.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : task.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className="text-sm text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/dashboard/tasks/${task.id}`} className="mt-4 block">
                                        <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                                            View Task
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs md:text-md">No tasks due today. Great job!</p>
                )}
            </section>

            <section>
                <h3 className="text-lg md:text-2xl font-semibold mb-4">Tasks Due Soon</h3>
                {tasksDueSoon.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasksDueSoon.map(task => (
                            <Card key={task.id}>
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                    <CardDescription className='text-xs md:text-md'>{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                                            task.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : task.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className="text-sm text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/dashboard/tasks/${task.id}`} className="mt-4 block">
                                        <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                                            View Task
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs md:text-md">No tasks due soon. Great job!</p>
                )}
            </section>

            <section>
                <h3 className="text-lg md:text-2xl font-semibold mb-4">Achievable Goals</h3>
                {achievableGoals.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {achievableGoals.map(goal => (
                            <Card key={goal.id}>
                                <CardHeader>
                                    <CardTitle>{goal.title}</CardTitle>
                                    {goal.description && <CardDescription className='text-xs md:text-md'>{goal.description}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${goal.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                                        goal.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : goal.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"}
                                        `}>
                                        {goal.status}
                                    </span>
                                    <Link to="/dashboard/goals" className="mt-4 block">
                                        <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                                            View Goal
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs md:text-md">No goals identified as quickly achievable.</p>
                )}
            </section>
        </div>
    );
}

export default Dashboard;