import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { dataService } from "@/services/api-service.ts";
import { localDateTimeToUTC } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import type { SubtaskSchema } from "@/types";

const subtaskSchema = z.object({
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
});

type SubtaskFormValues = z.infer<typeof subtaskSchema>;

interface EditSubtaskFormProps {
    subtask: SubtaskSchema;
    onSubtaskUpdated: () => void;
}

export function EditSubtaskForm({ subtask, onSubtaskUpdated }: EditSubtaskFormProps) {
    if (!subtask) return null;

    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SubtaskFormValues>({
        defaultValues: {
            ...subtask,
            deadline: subtask.deadline ? new Date(subtask.deadline).toISOString().slice(0, 16) : '',
        }
    });

    const [error, setError] = useState<string | null>(null)

    const onSubmit: SubmitHandler<SubtaskFormValues> = async (data) => {
        setLoading(true)
        setError(null)
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            await dataService.updateSubtask(subtask.taskId!, subtask.id!, { ...data, deadline: utcDeadline.toISOString() });
            onSubtaskUpdated();
        } catch (error) {
            console.error("Error saving subtask:", error);
            setError("Failed to save subtask. Please try again.")
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <form key={subtask.id} onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div>
                <Label htmlFor="title" className="mb-2">Title</Label>
                <Input id="title" type="text" {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
                <Label htmlFor="description" className="mb-2">Description</Label>
                <Textarea id="description" {...register("description")} />
            </div>
            <div>
                <Label htmlFor="status" className="mb-2">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
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
            <div>
                <Label className="mb-2">Task Deadline</Label>
                <Input type="datetime-local" {...register("deadline")} />
                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
            </div>
            <div>
                <Label className="my-2" htmlFor="priority">Priority</Label>
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} defaultValue={field.value?.toString()}>
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
            <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-400">{loading ? <Loader2Icon className="animate-spin" /> : "Save Subtask"}</Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    )
}
