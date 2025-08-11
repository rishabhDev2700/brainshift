import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { dataService } from "@/services/api-service.ts";
import { useNavigate } from "react-router-dom";
import type { GoalSchema, SubtaskSchema, TaskSchema } from "@/types";
import { localDateTimeToUTC } from "@/lib/utils";
import { Loader2Icon, PlusCircle } from "lucide-react";
import { Dialog, DialogContent,DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubtaskForm } from "./subtask-form";
import { SubtaskCard } from "@/components/subtask-card";

const taskSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    status: z.enum([
        "NOT STARTED",
        "IN PROGRESS",
        "COMPLETED",
        "CANCELLED",]),
    priority: z.number().min(0).max(4),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    goalId: z.union([z.number(), z.undefined()]).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    id?: number;
}

export function TaskForm({ id }: TaskFormProps) {
    const navigate = useNavigate();
    const [goals, setGoals] = useState<GoalSchema[]>()
    const [task, setTask] = useState<TaskSchema | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "NOT STARTED",
            deadline: "",
        },
    });

    useEffect(() => {
        fetchGoals()
        if (id) {
            fetchTask();
        }
    }, [id, reset]);

    async function fetchTask() {
        if (!id) return;
        dataService.getTaskById(id).then(response => {
            const task = response;
            if (task) {
                setTask(task);
                reset({
                    ...task,
                    deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
                });
            }
        }).catch(error => {
            console.error("Error fetching task:", error);
        });
    }

    async function fetchGoals() {
        setLoading(true)
        const res = await dataService.getGoals();
        setGoals(res)
        setLoading(false)
    }

    const [error, setError] = useState<string | null>(null)

    const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
        setLoading(true)
        setError(null)
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                await dataService.updateTask(id, { ...data, deadline: utcDeadline.toISOString(), goalId: data.goalId === -1 ? undefined : data.goalId });
            } else {
                await dataService.addTask({ ...data, deadline: utcDeadline.toISOString(), goalId: data.goalId === -1 ? undefined : data.goalId });
            }
            navigate('/dashboard/tasks');
        } catch (error) {
            console.error("Error saving task:", error);
            setError("Failed to save task. Please try again.")
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 items-baseline gap-6 md:gap-12">
                <div>
                    <div>
                        <Label htmlFor="title" className="mb-2">Title</Label>
                        <Input id="title" type="text" {...register("title")} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="description" className="mb-2">Description</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="status" className="mb-2">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select {...register("status")} onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOT STARTED">To Do</SelectItem>
                                        <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                    </div>
                </div>
                <div>
                    <div>
                        <Label className="mb-2">Task Deadline</Label>
                        <Input type="datetime-local" {...register("deadline")} />
                        {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                    </div>
                    <div className="mt-4">
                        <Label className="mb-2">Associated Goal</Label>
                        <Controller
                            name="goalId"
                            control={control}
                            rules={{}}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={-1} value="-1">None</SelectItem>
                                        {goals ? (
                                            goals.map(g => <SelectItem key={g.id} value={g.id!.toString()}>{g.title}</SelectItem>)
                                        ) : (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <div>
                            <Label className="my-2" htmlFor="priority">Priority</Label>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Low</SelectItem>
                                            <SelectItem value="1">Medium</SelectItem>
                                            <SelectItem value="2">High</SelectItem>
                                            <SelectItem value="3">Very High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                        </div>
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-400 md:mt-5">{loading ? <Loader2Icon className="animate-spin" /> : (id ? "Save" : "Create Task")}</Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            {id && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">Subtasks</h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Subtask</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Subtask</DialogTitle>
                                </DialogHeader>
                                <SubtaskForm taskId={id} onSubtaskCreated={fetchTask} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-4">
                        {task?.subtasks?.map((subtask: SubtaskSchema) => (
                            <SubtaskCard key={subtask.id} subtask={subtask} taskId={id!} fetchTask={fetchTask} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}