import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { TaskSchema } from '@/types'
import TaskCard from "@/components/task-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function TasksPage() {
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState < "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED"|"ALL" >();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const response = await dataService.getTasks();
            console.log(response)
            setTasks(response ?? []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false)
        }
    };

    const filteredTasks = useMemo(() => {
        if (filter === 'ALL') {
            return tasks;
        }
        return tasks.filter(t => t.status === filter);
    }, [tasks, filter]);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Your Tasks</h2>
                <div className="flex gap-4 items-center">
                    <Select onValueChange={(value: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED" | "ALL") => setFilter(value)} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="NOT STARTED">Not Started</SelectItem>
                            <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link to="/dashboard/tasks/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? <Loader2 color='green' className='animate-spin fixed top-1/2 left-1/2 scale-200' /> : filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} refresh={fetchTasks} />
                    ))
                ) : (
                    <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
                )}
            </div>
        </div>
    )
}

export default TasksPage