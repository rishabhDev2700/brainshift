import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { TaskSchema } from '@/types'


function TasksPage() {
    const [tasks, setTasks] = useState<TaskSchema[]>([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await dataService.getTasks();
            console.log(response)
            setTasks(response??[]);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await dataService.deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Your Tasks</h2>
                <Link to="/dashboard/tasks/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <Card key={task.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end">
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                                        task.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : task.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                                        }`}>
                                        {task.status}
                                    </span>
                                    <span className="text-sm text-gray-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex mt-4 space-x-2">
                                    <Link to={`/dashboard/tasks/${task.id}`} className="flex-grow">
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" onClick={() => handleDeleteTask(task.id as number)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
                )}
            </div>
        </div>
    )
}

export default TasksPage