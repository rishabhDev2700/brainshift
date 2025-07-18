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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { EventForm } from "@/components/forms/event-form";
import { Calendar } from "@/components/ui/calendar"

interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    eventType: "Meeting" | "Social" | "Gym" | "Work" | "Other";
    relatedGoalId?: number;
}

function CalendarPage() {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
        fetchEvents()
    })
    async function fetchEvents() {
        const res = await dataService.getEvents()
        setEvents(res?.data.events)
    }
    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-800"><PlusIcon className="mr-2 h-4 w-4" />New Event</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>"Fill in the details for your new calendar event.
                            </DialogDescription>
                        </DialogHeader>
                        {/* <EventForm /> */}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <Calendar
                        showOutsideDays
                        animate
                        mode="single"
                        selected={selected}
                        onSelect={setSelected}
                        footer={
                            selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                        }
                        classNames={{
                            today: `text-emerald-600 rounded-full text-white`,
                            chevron: `fill-emerald-600`,
                            selected: "hover:bg-emerald-600 bg-emerald-800 border-emerald-600"
                        }}
                    />

                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Events for {selected?.toLocaleDateString() || 'Selected Date'}</h3>
                    <div className="space-y-4">
                        {events ? events.map(event => (
                            <Card key={event.id}>
                                <CardHeader>
                                    <CardTitle>{event.title}</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {event.startTime && <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                        {event.endTime && <span> - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                        {event.eventType && <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">{event.eventType}</span>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    {event.description && <p>{event.description}</p>}
                                    <div className="space-x-2">
                                        <Button variant="outline" size="sm" >
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : "Nothing to show"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage