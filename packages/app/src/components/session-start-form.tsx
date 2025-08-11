import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { dataService } from "@/services/api-service";
import type { TaskSchema, SessionSchema, SubtaskSchema } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const sessionFormSchema = z.object({
    targetType: z.enum(["task", "subtask"]),
    targetId: z.number().optional(),
    subtaskId: z.number().optional(), // New field for subtask ID
    sessionType: z.enum(["pomodoro", "manual"]),
    duration: z.number().optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionStartFormProps {
    onSessionStart: (session: SessionSchema) => void;
    isActionLoading: boolean;
}

export function SessionStartForm({ onSessionStart }: SessionStartFormProps) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskSchema[]>([]);
    const [subtasks, setSubtasks] = useState<SubtaskSchema[]>([]); // New state for subtasks
    const [selectedTargetType, setSelectedTargetType] = useState<"task" | "subtask">("task");
    const [_, setSelectedSessionType] = useState<"pomodoro" | "manual">("manual");
    const { register, handleSubmit, control, formState: { errors } } = useForm<SessionFormData>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            targetType: "task",
            sessionType: "manual",
        },
    });

    useEffect(() => {
        fetchTasks();
        fetchSubtasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await dataService.getTasks();
            setTasks(fetchedTasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchSubtasks = async () => {
        try {
            const fetchedSubtasks = await dataService.getAllSubtasksForUser();
            setSubtasks(fetchedSubtasks || []);
        } catch (error) {
            console.error("Error fetching subtasks:", error);
        }
    };

    const onSubmit = async (data: SessionFormData) => {
        try {
            const newSession: SessionSchema = {
                targetType: data.targetType,
                targetId: data.targetType === "task" ? data.targetId : data.subtaskId, // Use subtaskId if targetType is subtask
                startTime: new Date().toISOString(),
                isPomodoro: data.sessionType === "pomodoro",
                completed: false,
                duration: data.sessionType === "pomodoro" ? data.duration : undefined, // Duration only for pomodoro
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

            {selectedTargetType === "subtask" && (
                <div>
                    <Label htmlFor="subtaskId">Select Subtask</Label>
                    <Controller
                        name="subtaskId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subtask" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subtasks.map(subtask => (
                                        <SelectItem key={subtask.id} value={subtask.id?.toString() || ""}>
                                            {subtask.title} (Task: {tasks.find(t => t.subtasks?.some(s => s.id === subtask.id))?.title})
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
        </form>)
}
