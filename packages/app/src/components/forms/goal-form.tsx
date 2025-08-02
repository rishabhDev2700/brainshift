import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { dataService } from "@/services/api-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react"
import { localDateTimeToUTC, utcToLocalDateTime } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
const goalFormSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Name is required"),
    description: z.string(),
    parentId: z.union([z.number(), z.undefined()]).optional(),
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
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<GoalFormData>({
        resolver: zodResolver(goalFormSchema),
        defaultValues: {
            type: "SHORT",
            status: "NOT STARTED",
            deadline: utcToLocalDateTime(new Date().toUTCString())
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
                    deadline: utcToLocalDateTime(g.deadline),
                    parentId: g.parentId === undefined ? -1 : g.parentId,
                })
            })
        }
    }, [])
    const onSubmit: SubmitHandler<GoalFormData> = async (data) => {
        console.log(data)
        setLoading(true)
        const utcDeadline = localDateTimeToUTC(data.deadline);
        try {
            if (id) {
                await dataService.updateGoal(id, { ...data, deadline: utcDeadline.toISOString(), parentId: data.parentId === -1 ? undefined : data.parentId });
            } else {
                await dataService.addGoal({ ...data, deadline: utcDeadline.toISOString(), parentId: data.parentId === -1 ? undefined : data.parentId });
            }
            fetchGoals();
            setLoading(false)
            toast.success("Goal Saved")
        } catch (error) {
            console.error("Error saving goal:", error);
            toast.error("Unable to save")
        }
    };
    return (
        <>
            <h1 className="text-emerald-600 font-semibold text-xl md:text-3xl mb-4">{id ? "Edit Goal" : "New Goal"}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid md:grid-cols-2 gap-x-8">
                <div>
                    <Label className="mb-2" htmlFor="name">Name</Label>
                    <Input id="name" {...register("title")} placeholder="Title of your Goal" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div>
                    <Label className="mb-2" htmlFor="description">Description</Label>
                    <Textarea rows={12} placeholder="Describe your goal here" id="description" {...register("description")} />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="parentId">Parent Goal</Label>
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
                                    <SelectItem key={-1} value="-1">None</SelectItem>
                                    {Array.isArray(goals) ? goals.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.title}</SelectItem>) : "No Goal"}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="type">Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                    <Label className="mb-2" htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
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
                    <Label className="mb-2" htmlFor="priority">Priority</Label>
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
                <div>
                    <Label className="mb-2" htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="datetime-local" {...register("deadline")} />
                </div>
                <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-400 md:mt-5">{loading ? <Loader2 className="animate-spin" /> : (id ? "Save" : "Create Goal")}</Button>
            </form>
        </>
    );
}
