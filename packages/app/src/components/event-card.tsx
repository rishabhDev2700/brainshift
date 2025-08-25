import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EventSchema } from "@/types"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EventForm } from "./forms/event-form"
import { CalendarDays } from "lucide-react";
import { useDeleteEvent } from "../hooks/useEvents";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EventCardProps {
    event: EventSchema;
    onEventDeleted: () => void;
}

function EventCard({ event, onEventDeleted }: EventCardProps) {
    const deleteEventMutation = useDeleteEvent();
    const queryClient = useQueryClient();

    async function handleDelete(id: number | undefined) {
        if (!id) return
        deleteEventMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Event deleted successfully!");
                onEventDeleted();
            },
            onError: (error) => {
                console.error("Error deleting event:", error);
                toast.error("Failed to delete event.");
            }
        });
    }

    return (
        <Card key={event.id} className="flex flex-col p-4 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-emerald-600/20 rounded-lg shadow-lg">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    {event.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-gray-700 dark:text-gray-300">
                {event.description && <p className="mb-3">{event.description}</p>}
                <div className="flex justify-end space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-400">
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-emerald-600/20">
                            <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                                <DialogDescription>
                                    Edit the details for your event.
                                </DialogDescription>
                            </DialogHeader>
                            <EventForm id={event.id} onEventSaved={() => {
                                queryClient.invalidateQueries({ queryKey: ['events'] });
                            }} />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></DialogTrigger>
                        <DialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-emerald-600/20">
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your event.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

export default EventCard;