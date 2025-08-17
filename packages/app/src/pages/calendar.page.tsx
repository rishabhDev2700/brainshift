import { useState, useEffect } from "react";
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
import EventCard from "@/components/event-card";
import { useSearchParams } from "react-router-dom";
import { useEventsByDate } from "../hooks/useEvents";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";


function CalendarPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [date, setDate] = useState<Date | undefined>(() => {
        const dateParam = searchParams.get("date");
        return dateParam ? new Date(`${dateParam}T00:00:00.000Z`) : new Date();
    });

    const queryClient = useQueryClient();

    const { data: events, isLoading, isError, error } = useEventsByDate(date?.toISOString().split('T')[0] || '');

    useEffect(() => {
        if (date) {
            const dateString = date.toISOString().split('T')[0];
            setSearchParams({ date: dateString });
        }
    }, [date, setSearchParams]);

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <Skeleton className="h-64 w-full mb-4" />
                    </div>
                    <div className="mt-4">
                        <Skeleton className="h-8 w-64 mb-4" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="p-4 md:p-8">Error: {error?.message}</div>;
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
                        <EventForm onEventSaved={() => {
                            queryClient.invalidateQueries({ queryKey: ['events'] });
                            if (date) {
                                queryClient.invalidateQueries({ queryKey: ['events', date.toISOString().split('T')[0]] });
                            }
                        }} />
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
                        timeZone="UTC"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-4">Events for {date?.toLocaleDateString() || 'Selected Date'}</h3>
                    <div className="space-y-4">
                        {Array.isArray(events) && events.map(event => (
                            <EventCard key={event.id} event={event} onEventDeleted={() => {
                                queryClient.invalidateQueries({ queryKey: ['events'] });
                                if (date) {
                                    queryClient.invalidateQueries({ queryKey: ['events', date.toISOString().split('T')[0]] });
                                }
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage