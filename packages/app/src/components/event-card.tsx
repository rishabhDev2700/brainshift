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
import { dataService } from "@/services/api-service"

interface EventCardProps {
    event: EventSchema;
    refreshEvents: () => void;
}

function EventCard({ event, refreshEvents }: EventCardProps) {
    async function handleDelete(id: number) {
        await dataService.deleteEvent(id);
        refreshEvents();
    }

    return (
        <Card key={event.id} className="flex flex-col">
            <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    {event.date && <span>{new Date(event.date).toLocaleDateString()}</span>}
                    {/* {event.startTime && <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    {event.endTime && <span> - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    {event.eventType && <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">{event.eventType}</span>} */}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                {event.description && <p>{event.description}</p>}
                <div className="space-x-2">
                    <Button variant="outline" size="sm" >
                        Edit
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></DialogTrigger>
                        <DialogContent>
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
