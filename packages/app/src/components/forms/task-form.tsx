import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SubtaskSchema } from "@/types";
import { localDateTimeToUTC } from "@/lib/utils";
import { Loader2Icon, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubtaskForm } from "./subtask-form";
import { SubtaskCard } from "@/components/subtask-card";
import { useTaskById, useAddTask, useUpdateTask } from "../../hooks/useTasks";
import { useGoals } from "../../hooks/useGoals";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const { data: task, isLoading: taskLoading, isError: taskError } = useTaskById(id!);
    const { data: goals, isLoading: goalsLoading, isError: goalsError } = useGoals();
    const addTaskMutation = useAddTask();
    const updateTaskMutation = useUpdateTask();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        getValues
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
        if (id && task) {
            const currentTitle = getValues().title;
            const currentDescription = getValues().description;

            if (currentTitle !== task.title || currentDescription !== task.description) {
                reset({
                    ...task,
                    deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
                });
            }
        }
    }, [id, task, reset, getValues]);

    const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                updateTaskMutation.mutate({ id, data: { ...data, deadline: utcDeadline.toISOString(), goalId: data.goalId === -1 ? undefined : data.goalId } }, {
                    onSuccess: () => {
                        toast.success("Task updated successfully!");
                        navigate('/dashboard/tasks');
                    },
                    onError: (error) => {
                        console.error("Error updating task:", error);
                        toast.error("Failed to update task.");
                    }
                });
            } else {
                addTaskMutation.mutate({ ...data, deadline: utcDeadline.toISOString(), goalId: data.goalId === -1 ? undefined : data.goalId }, {
                    onSuccess: () => {
                        toast.success("Task created successfully!");
                        navigate('/dashboard/tasks');
                    },
                    onError: (error) => {
                        console.error("Error creating task:", error);
                        toast.error("Failed to create task.");
                    }
                });
            }
        } catch (error) {
            console.error("Error saving task:", error);
            toast.error("Failed to save task. Please try again.");
        }
    };

    const loading = taskLoading || goalsLoading || addTaskMutation.isPending || updateTaskMutation.isPending;

    if (taskError || goalsError) {
        return <div>Error loading data.</div>;
    }

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
                                        {goalsLoading ? (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                        ) : goals?.map(g => <SelectItem key={g.id} value={g.id!.toString()}>{g.title}</SelectItem>)}
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
            </form>

            {id ? (
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
                                <SubtaskForm taskId={id} onSubtaskCreated={() => {
                                    queryClient.invalidateQueries({ queryKey: ['subtasks'] });
                                    queryClient.invalidateQueries({ queryKey: ['tasks'] });
                                }} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-4">
                        {task?.subtasks?.map((subtask: SubtaskSchema) => (
                            <SubtaskCard key={subtask.id} subtask={subtask} taskId={id!} />
                        ))}
                    </div>
                </div>
            ) : ""}
        </div>
    )
}