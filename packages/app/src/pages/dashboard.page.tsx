import { useState, useEffect } from 'react';
import { dataService } from "@/services/api-service.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import type { EventSchema, GoalSchema, TaskSchema } from '@/types';

function Dashboard() {
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [goals, setGoals] = useState<GoalSchema[]>([]);
    const [events, setEvents] = useState<EventSchema[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [tasksResponse, goalsResponse, eventsResponse] = await Promise.all([
                dataService.getTasks(),
                dataService.getGoals(),
                dataService.getEventsByDate(today),
            ]);

            if (Array.isArray(tasksResponse)) {
                setTasks(tasksResponse);
            } else {
                console.error("API response for tasks is not an array:", tasksResponse);
                setTasks([]);
            }

            if (Array.isArray(goalsResponse)) {
                setGoals(goalsResponse);
            } else {
                console.error("API response for goals is not an array:", goalsResponse);
                setGoals([]);
            }

            if (Array.isArray(eventsResponse)) {
                setEvents(eventsResponse);
            } else {
                console.error("API response for events is not an array:", eventsResponse);
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching data for My Day page:", error);
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasksDueToday = tasks.filter(task => {
        const deadline = new Date(task.deadline);
        return task.status !== "COMPLETED" && deadline.toDateString() === today.toDateString();
    });

    const tasksDueSoon = tasks.filter(task => {
        const deadline = new Date(task.deadline);
        return task.status !== "COMPLETED" && deadline > today && deadline <= tomorrow;
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    const achievableGoals = goals.filter(goal => {
        return goal.status === "IN PROGRESS" && tasks.some(task => task.status !== "COMPLETED" && task.description.includes(goal.title.split(' ')[0]));
    });

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex flex-wrap justify-end gap-4">
                    <Button asChild>
                        <Link to="/dashboard/goals/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Goal
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link to="/dashboard/tasks/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link to="/dashboard/sessions/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Session
                        </Link>
                    </Button>
                </div>
            </div>

            <section>
                <h3 className="text-lg md:text-2xl font-semibold mb-4">Today's Events</h3>
                {events.length > 0 ? (
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
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
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
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
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
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
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
                                        goal.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : goal.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                                        }`}>
                                        {goal.status}
                                    </span>
                                    <Link to="/dashboard/goals" className="mt-4 block">
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
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
