import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { GoalIcon, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { dataService } from "@/services/api-service.ts";
import { useNavigate } from "react-router-dom";
import type { GoalSchema } from "@/types";
import { localDateTimeToUTC } from "@/lib/utils";



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
        const res = await dataService.getGoals();
        setGoals(res)
    }

    const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                await dataService.updateTask(id, { ...data,deadline:utcDeadline.toISOString() });
            } else {
                await dataService.addTask(data);
            }
            navigate('/dashboard/tasks');
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };


    const [newGoal, setNewGoal] = useState("");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="lg:grid grid-cols-2 grid-rows-3 items-baseline gap-12">
            <div>
                <div>
                    <Label htmlFor="title" className="my-2 font-semibold text-xl">Title</Label>
                    <Input id="title" type="text" {...register("title")} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div className="mt-4">
                    <Label htmlFor="description" className="my-2 font-semibold text-xl">Description</Label>
                    <Textarea id="description" {...register("description")} />
                </div>
                <div className="mt-4">
                    <Label htmlFor="status" className="my-2 font-semibold text-xl">Status</Label>
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
                                    <SelectItem value="cANCELLED">cANCELLED</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>

            </div>
            <div>
                <div>
                    <Label className="my-2 font-semibold text-xl">Task Deadline</Label>
                    <Input type="datetime-local" {...register("deadline")} />
                    {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                </div>
                <div className="mt-4">
                    <Label className="font-semibold text-xl">Associated Goals</Label>
                    <div className="p-2">
                        {goals?.map((field) => (
                            <div key={field.id} className="flex justify-between p-2">
                                <div className="flex items-center gap-x-2">
                                    <GoalIcon />
                                    <h3>{field.title}</h3>
                                </div>
                                {/* <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}>
                                    <Trash color="red" />
                                </Button> */}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add a new goal" />
                        <Button type="button" variant="outline" onClick={() => {
                            if (newGoal) {
                                setNewGoal("");
                            }
                        }}><Plus /><span>Add Goal</span></Button>
                    </div>
                    <div className="mt-4">
                        <Label className="font-semibold text-xl">Estimated Time</Label>
                        <Input type="number" placeholder="In Minutes" />
                    </div>
                </div>

            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-800">
                Save
            </Button>
        </form>
    )
}
