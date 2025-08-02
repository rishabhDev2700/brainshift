import { useState, useEffect } from 'react';
import { dataService } from "@/services/api-service.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import type { GoalSchema, TaskSchema } from '@/types';



function MyDayPage() {
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [goals, setGoals] = useState<GoalSchema[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksResponse, goalsResponse] = await Promise.all([
                dataService.getTasks(),
                dataService.getGoals(),
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
        } catch (error) {
            console.error("Error fetching data for My Day page:", error);
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasksDueSoon = tasks.filter(task => {
        const deadline = new Date(task.deadline);
        return task.status !== "COMPLETED" && deadline <= tomorrow;
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    const achievableGoals = goals.filter(goal => {
        return goal.status === "IN PROGRESS" && tasks.some(task => task.status !== "COMPLETED" && task.description.includes(goal.title.split(' ')[0]));
    });

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">My Day</h2>

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

export default MyDayPage;
