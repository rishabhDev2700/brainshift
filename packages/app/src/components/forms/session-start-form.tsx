import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { SessionSchema } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTasks } from "../../hooks/useTasks";
import { useAllSubtasksForUser } from "../../hooks/useSubtasks";
import { useAddSession } from "../../hooks/useSessions";
import { Loader2Icon } from "lucide-react";

const sessionFormSchema = z.object({
    targetType: z.enum(["task", "subtask"]),
    targetId: z.number().optional(),
    subtaskId: z.number().optional(), // New field for subtask ID
    sessionType: z.enum(["pomodoro", "manual"]),
    duration: z.number().optional(),
}).refine(data => {
    if (data.sessionType === 'pomodoro') {
        return data.duration !== undefined && data.duration > 0;
    }
    return true;
}, {
    message: 'Duration is required for Pomodoro sessions',
    path: ['duration'],
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionStartFormProps {
    onSessionStart: (session: SessionSchema) => void;
}

export function SessionStartForm({ onSessionStart }: SessionStartFormProps) {
    const navigate = useNavigate();
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: subtasks, isLoading: subtasksLoading } = useAllSubtasksForUser();
    const addSessionMutation = useAddSession();

    const [selectedTargetType, setSelectedTargetType] = useState<"task" | "subtask">("task");
    const [selectedSessionType, setSelectedSessionType] = useState<"pomodoro" | "manual">("manual");
    const { register, handleSubmit, control, formState: { errors } } = useForm<SessionFormData>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            targetType: "task",
            sessionType: "manual",
        },
    });

    const onSubmit = async (data: SessionFormData) => {
        console.log("Form data:", data);
        const newSession: Partial<SessionSchema> = {
            targetType: data.targetType,
            targetId: data.targetId,
            startTime: new Date().toISOString(),
            isPomodoro: data.sessionType === "pomodoro",
            completed: false,
            duration: data.sessionType === "pomodoro" ? data.duration : undefined,
        };
        console.log("Payload to API:", newSession);
        addSessionMutation.mutate(newSession as SessionSchema, {
            onSuccess: (response) => {
                toast.success("Session started successfully!");
                onSessionStart(response.data);
                navigate("/dashboard/sessions");
            },
            onError: (error) => {
                console.error("Error starting session:", error);
                toast.error("Failed to start session.");
            }
        });
    };

    const isSubmitting = addSessionMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label className="mb-2" htmlFor="targetType">Session Type</Label>
                <Controller
                    name="targetType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value: "task" | "subtask") => {
                            field.onChange(value);
                            setSelectedTargetType(value);
                        }} defaultValue="task">
                            <SelectTrigger>
                                <SelectValue placeholder="Select session type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="task">Task</SelectItem>
                                <SelectItem value="subtask">Subtask</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {selectedTargetType === "task" ? (
                <div>
                    <Label className="mb-2" htmlFor="targetId">Select Task</Label>
                    <Select {...register("targetId", { valueAsNumber: true })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            {tasksLoading ? (
                                <SelectItem value="loading" disabled>Loading tasks...</SelectItem>
                            ) : tasks?.map(task => (
                                <SelectItem key={task.id} value={task.id?.toString() || ""}>
                                    {task.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.targetId && <p className="text-red-500 text-sm">{errors.targetId.message}</p>}
                </div>
            ) : (
                <div>
                    <Label className="mb-2" htmlFor="subtaskId">Select Subtask</Label>
                    <Controller
                        name="targetId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subtask" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">None</SelectItem>
                                    {subtasksLoading ? (
                                        <SelectItem value="loading" disabled>Loading subtasks...</SelectItem>
                                    ) : subtasks?.map(subtask => (
                                        <SelectItem key={subtask.id} value={subtask.id?.toString() || ""}>
                                            {subtask.title} (Task: {tasks?.find(t => t.subtasks?.some(s => s.id === subtask.id))?.title})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.subtaskId && <p className="text-red-500 text-sm">{errors.subtaskId.message}</p>}
                </div>
            )}

            <div>
                <Label className="mb-2" htmlFor="sessionType">Session Mode</Label>
                <Controller
                    name="sessionType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value: "pomodoro" | "manual") => {
                            field.onChange(value);
                            setSelectedSessionType(value);
                        }} defaultValue="manual">
                            <SelectTrigger>
                                <SelectValue placeholder="Select session mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manual">Manual Timer</SelectItem>
                                <SelectItem value="pomodoro">Pomodoro</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {selectedSessionType === "pomodoro" && (
                <div>
                    <Label className="mb-2" htmlFor="duration">Duration (minutes)</Label>
                    <input
                        type="number"
                        {...register("duration", { valueAsNumber: true })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                </div>
            )}

            <Button type="submit" className="w-full p-2 bg-indigo-500 hover:bg-indigo-800 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Start Session"}
            </Button>
        </form>)
}
