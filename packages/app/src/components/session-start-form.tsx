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

const sessionFormSchema = z.object({
    targetType: z.enum(["task", "subtask"]),
    targetId: z.number().optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionStartFormProps {
    onSessionStart: (session: SessionSchema) => void;
}

export function SessionStartForm({ onSessionStart }: SessionStartFormProps) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [selectedTargetType, setSelectedTargetType] = useState<"task" | "subtask">("task");
    const { register, handleSubmit, formState: { errors } } = useForm<SessionFormData>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            targetType: "task",
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
                isPomodoro: false, // Default to manual session for now
                completed: false,
            };
            const response = await dataService.addSession(newSession);
            if (response) {
                toast.success("Session started successfully!");
                onSessionStart(response.data); // Pass the created session back to the parent
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

            {/* Subtask selection would go here, similar to task selection */}

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-800">Start Session</Button>
        </form>
    );
}
