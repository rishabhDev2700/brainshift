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
import type { GoalSchema } from "@/types";
import { localDateTimeToUTC } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";



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
    goalId: z.number(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    id?: number;
}


export function TaskForm({ id }: TaskFormProps) {
    const navigate = useNavigate();
    const [goals, setGoals] = useState<GoalSchema[]>()
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
            dataService.getTaskById(id).then(response => {
                const task = response;
                if (task) {
                    reset({
                        ...task,
                        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
                    });
                }
            }).catch(error => {
                console.error("Error fetching task:", error);
            });
        }
    }, [id, reset]);
    async function fetchGoals() {
        setLoading(true)
        const res = await dataService.getGoals();
        setGoals(res)
        setLoading(false)
    }

    const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
        console.log("Submitting form")
        setLoading(true)
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                await dataService.updateTask(id, { ...data, deadline: utcDeadline.toISOString(), goalId: data.goalId });
            } else {
                await dataService.addTask(data);
            }
            navigate('/dashboard/tasks');
        } catch (error) {
            console.error("Error saving task:", error);
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 grid-rows-3 items-baseline gap-12">
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
                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value !== undefined ? String(field.value) : undefined}>
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

                    <div className="mt-4">
                        <Label className="mb-2">Estimated Time</Label>
                        <Input type="number" placeholder="In Minutes" />
                    </div>
                </div>

            </div>
            <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-400 md:mt-5">{loading ? <Loader2Icon className="animate-spin" /> : (id ? "Save" : "Create Task")}</Button>

        </form>
    )
}
