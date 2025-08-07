import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { TaskSchema } from '@/types'
import TaskCard from "@/components/task-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function TasksPage() {
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<"NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED" | "ALL">("ALL");

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
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-4 md:mb-0">Your Tasks</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <Select onValueChange={(value: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED" | "ALL") => setFilter(value)} defaultValue="ALL">
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All</SelectItem>
                            <SelectItem value="NOT STARTED">Not Started</SelectItem>
                            <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link to="/dashboard/tasks/new" className="w-full md:w-auto">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[125px] w-full rounded-xl" />
                    ))
                ) : filteredTasks.length > 0 ? (
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