import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { dataService } from "@/services/api-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react"
import { localDateTimeToUTC } from "@/lib/utils"

const goalFormSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Name is required"),
    description: z.string(),
    parentId: z.number().optional(),
    type: z.enum(["SHORT", "LONG"]),
    status: z.enum(["NOT STARTED", "IN PROGRESS", "COMPLETED", "CANCELLED"]),
    priority: z.number(),
    deadline: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
    fetchGoals: () => void;
    goals: any[];
    id?: number;
}

export function GoalForm({ fetchGoals, goals, id }: GoalFormProps) {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<GoalFormData>({
        resolver: zodResolver(goalFormSchema),
        defaultValues: {
            type: "SHORT",
            status: "NOT STARTED",
        }
    });

    useEffect(() => {
        if (id) {
            dataService.getGoalById(id).then(g => {
                
                reset({
                    id: g.id,
                    title: g.title,
                    description: g.description,
                    status: g.status,
                    priority: g.priority,
                    deadline: g.deadline,
                    parentId: g.parentId,
                })
            })
       } 
    },[])
    const onSubmit: SubmitHandler<GoalFormData> = async (data) => {
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                await dataService.updateGoal(id, {...data,deadline:utcDeadline.toISOString()});
            } else {
                await dataService.addGoal(data);
            }
            reset();  
            fetchGoals();
        } catch (error) {
            console.error("Error saving goal:", error);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid md:grid-cols-2 gap-x-8">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
            </div>
            <div>
                <Label htmlFor="parentId">Parent Goal</Label>
                <Controller
                    name="parentId"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                        <Select onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent goal" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.isArray(goals) ? goals.map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>) : "No Goal"}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="type">Type</Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} defaultValue="SHORT">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SHORT">Short Term</SelectItem>
                                <SelectItem value="LONG">Long Term</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} defaultValue="Not Started">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NOT STARTED">Not Started</SelectItem>
                                <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="priority">Priority</Label>
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={field.value?.toString()} defaultValue="0">
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
            <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="datetime-local" {...register("deadline")} />
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-800">Create Goal</Button>
        </form>
    );
}
