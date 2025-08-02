import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { dataService } from "@/services/api-service";
import { useEffect, useState } from "react"
import { localDateTimeToUTC, utcToLocalDateTime } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const eventFormSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Name is required"),
    description: z.string(),
    date: z.string(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
    fetchEvents: () => void;
    id?: number;
}

export function EventForm({ fetchEvents, id }: EventFormProps) {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            date: utcToLocalDateTime(new Date().toUTCString())
        }
    });

    useEffect(() => {
        if (id) {
            dataService.getEventById(id).then(g => {
                reset({
                    id: g.id,
                    title: g.title,
                    description: g.description,
                    date: utcToLocalDateTime(g.date),
                })
            })
        }
    }, [])
    const onSubmit: SubmitHandler<EventFormData> = async (data) => {
        console.log(data)
        setLoading(true)
        const utcDate = localDateTimeToUTC(data.date);
        try {
            if (id) {
                await dataService.updateEvent(id, { ...data, date: utcDate.toISOString() });
            } else {
                await dataService.addEvent({ ...data, date: utcDate.toISOString() });
            }
            fetchEvents();
            setLoading(false)
            toast.success("Event Saved")
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("Unable to save")
        }
    };
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
