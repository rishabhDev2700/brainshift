import { useEffect } from "react";
import { dataService } from "@/services/api-service";
import "react-day-picker/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD format
    startTime?: string; // ISO datetime string
    endTime?: string; // ISO datetime string
    eventType: "Meeting" | "Social" | "Gym" | "Work" | "Other";
    relatedGoalId?: number;
}


const eventFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid start time format (YYYY-MM-DDTHH:MM expected)").optional().or(z.literal("")),
    endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid end time format (YYYY-MM-DDTHH:MM expected)").optional().or(z.literal("")),
    eventType: z.enum(["Meeting", "Social", "Gym", "Work", "Other"]),
    relatedGoalId: z.number().optional().nullable(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export function EventForm() {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            eventType: "Meeting", // Default value
        }
    });
    const { id } = useParams()
    console.log(id)

    useEffect(() => {
        if (editingEvent) {
            setValue('title', editingEvent.title);
            setValue('description', editingEvent.description || '');
            setValue('date', editingEvent.date);
            setValue('startTime', editingEvent.startTime ? new Date(editingEvent.startTime).toISOString().slice(0, 16) : '');
            setValue('endTime', editingEvent.endTime ? new Date(editingEvent.endTime).toISOString().slice(0, 16) : '');
            setValue('eventType', editingEvent.eventType);
            setValue('relatedGoalId', editingEvent.relatedGoalId ?? null);
        } else {
            reset({
                date: new Date().toISOString().split('T')[0],
                eventType: "Meeting",
                title: "",
                description: "",
                startTime: "",
                endTime: "",
                relatedGoalId: null,
            });
        }
    })
    const onSubmit: SubmitHandler<EventFormData> = async (data) => {

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
            </div>
            <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="datetime-local" {...register("startTime")} />
                    {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
                </div>
                <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="datetime-local" {...register("endTime")} />
                    {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Controller
                    name="eventType"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Meeting">Meeting</SelectItem>
                                <SelectItem value="Social">Social</SelectItem>
                                <SelectItem value="Gym">GymItem</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType.message}</p>}
            </div>
            <div>
                <Label htmlFor="relatedGoalId">Related Goal (Optional)</Label>
                <Controller
                    name="relatedGoalId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value === "" ? null : Number(value))} value={field.value === undefined || field.value === null ? "" : String(field.value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {/* {goals.map(goal => (
                                    <SelectItem key={goal.id} value={String(goal.id)}>{goal.name}</SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.relatedGoalId && <p className="text-red-500 text-sm">{errors.relatedGoalId.message}</p>}
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-800">{editingEvent ? "Update Event" : "Create Event"}</Button>
        </form>
    );
}
