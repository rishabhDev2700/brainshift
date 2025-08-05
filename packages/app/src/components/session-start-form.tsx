import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { dataService } from "@/services/api-service";
import type { TaskSchema, SessionSchema } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "./ui/input";

const sessionFormSchema = z.object({
    targetType: z.enum(["task", "subtask"]),
    targetId: z.number().optional(),
    sessionType: z.enum(["pomodoro", "manual"]),
    duration: z.number().optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionStartFormProps {
    onSessionStart: (session: SessionSchema) => void;
    isActionLoading: boolean;
}

export function SessionStartForm({ onSessionStart, isActionLoading }: SessionStartFormProps) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [selectedTargetType, setSelectedTargetType] = useState<"task" | "subtask">("task");
    const [selectedSessionType, setSelectedSessionType] = useState<"pomodoro" | "manual">("manual");
    const { register, handleSubmit, formState: { errors } } = useForm<SessionFormData>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            targetType: "task",
            sessionType: "manual",
        },
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await dataService.getTasks();
            setTasks(fetchedTasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const onSubmit = async (data: SessionFormData) => {
        try {
            const newSession: SessionSchema = {
                targetType: data.targetType,
                targetId: data.targetId,
                startTime: new Date().toISOString(),
                isPomodoro: data.sessionType === "pomodoro",
                completed: false,
                duration: data.sessionType === "manual" ? data.duration : undefined,
            };
            const response = await dataService.addSession(newSession);
            if (response) {
                toast.success("Session started successfully!");
                onSessionStart(response.data); 
                navigate("/dashboard/sessions");
            }
        } catch (error) {
            console.error("Error starting session:", error);
            toast.error("Failed to start session.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="targetType">Session Type</Label>
                <Select onValueChange={(value: "task" | "subtask") => setSelectedTargetType(value)} defaultValue="task">
                    <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="subtask">Subtask</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="sessionType">Session Mode</Label>
                <Select onValueChange={(value: "pomodoro" | "manual") => setSelectedSessionType(value)} defaultValue="manual">
                    <SelectTrigger>
                        <SelectValue placeholder="Select session mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="manual">Manual Timer</SelectItem>
                        <SelectItem value="pomodoro">Pomodoro</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedSessionType === "pomodoro" && (
                <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" type="number" {...register("duration", { valueAsNumber: true })} placeholder="e.g., 25" />
                </div>
            )}

            {selectedTargetType === "task" && (
                <div>
                    <Label htmlFor="targetId">Select Task</Label>
                    <Select {...register("targetId", { valueAsNumber: true })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                            {tasks.map(task => (
                                <SelectItem key={task.id} value={task.id?.toString() || ""}>
                                    {task.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.targetId && <p className="text-red-500 text-sm">{errors.targetId.message}</p>}
                </div>
            )}


            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-800" disabled={isActionLoading}>Start Session</Button>
        </form>
    );
}
