import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { localDateTimeToUTC, utcToLocalDateTime } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useEventById, useAddEvent, useUpdateEvent } from "../../hooks/useEvents";

const eventFormSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Name is required"),
    description: z.string(),
    date: z.string(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
    onEventSaved: () => void;
    id?: number;
}

export function EventForm({ onEventSaved, id }: EventFormProps) {
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            date: utcToLocalDateTime(new Date().toUTCString())
        }
    });

    const { data: event, isLoading: eventLoading } = useEventById(id!);
    const addEventMutation = useAddEvent();
    const updateEventMutation = useUpdateEvent();

    useEffect(() => {
        if (id && event) {
            const currentTitle = getValues().title;
            const currentDescription = getValues().description;

            if (currentTitle !== event.title || currentDescription !== event.description) {
                reset({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    date: utcToLocalDateTime(event.date),
                })
            }
        }
    }, [id, event, reset, getValues])

    const onSubmit: SubmitHandler<EventFormData> = async (data) => {
        console.log(data)
        const utcDate = localDateTimeToUTC(data.date);
        try {
            if (id) {
                updateEventMutation.mutate({ id, data: { ...data, date: utcDate.toISOString() } }, {
                    onSuccess: () => {
                        toast.success("Event Saved");
                        onEventSaved();
                    },
                    onError: (err) => {
                        console.error("Error saving event:", err);
                        toast.error("Unable to save");
                    }
                });
            } else {
                addEventMutation.mutate({ ...data, date: utcDate.toISOString() }, {
                    onSuccess: () => {
                        toast.success("Event Saved");
                        onEventSaved();
                    },
                    onError: (err) => {
                        console.error("Error saving event:", err);
                        toast.error("Unable to save");
                    }
                });
            }
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("Unable to save")
        }
    };

    const loading = eventLoading || addEventMutation.isPending || updateEventMutation.isPending;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label className="mb-2" htmlFor="name">Name</Label>
                    <Input id="name" {...register("title")} placeholder="Title of your Event" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div>
                    <Label className="mb-2" htmlFor="description">Description</Label>
                    <Textarea rows={4} placeholder="Describe your event here" id="description" {...register("description")} />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="date">Date</Label>
                    <Input id="date" type="datetime-local" {...register("date")} />
                </div>
                <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-400 md:mt-5">{loading ? <Loader2 className="animate-spin" /> : (id ? "Save" : "Create Event")}</Button>
            </form>
        </>
    );
}
