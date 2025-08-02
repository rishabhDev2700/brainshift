import { useState, useEffect } from "react";
import { dataService } from "@/services/api-service.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { EventForm } from "@/components/forms/event-form";
import { Calendar } from "@/components/ui/calendar"
import type { EventSchema } from "@/types";
import EventCard from "@/components/event-card";


function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<EventSchema[]>([]);
    useEffect(() => {
        if (date) {
            fetchEventsByDate(date);
        }
    }, [date]);

    async function fetchEventsByDate(date: Date) {
        const res = await dataService.getEventsByDate(date.toISOString().split('T')[0]);
        setEvents(res)
        console.log(res)
    }
    return (
        <div className="p-4 md:p-8 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Calendar</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-800"><PlusIcon className="mr-2 h-4 w-4" />New Event</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>Fill in the details for your new calendar event.
                            </DialogDescription>
                        </DialogHeader>
                        <EventForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="duration-200 w-full mb-4"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-4">Events for {date?.toLocaleDateString() || 'Selected Date'}</h3>
                    <div className="space-y-4">
                        {Array.isArray(events) && events.map(event => (
                            <EventCard key={event.id} event={event} refreshEvents={() => fetchEventsByDate(date!)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage