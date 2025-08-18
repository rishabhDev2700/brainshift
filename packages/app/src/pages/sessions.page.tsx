
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionItem } from "@/components/session-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessions } from "../hooks/useSessions";
import { SessionView } from "@/components/session-view";

function SessionsPage() {
    const [filter, setFilter] = useState<'ALL' | "COMPLETED" | "CANCELLED">('ALL');
    const { data: sessions, isLoading, isError, error } = useSessions();

    const filteredSessions = useMemo(() => {
        if (filter === 'ALL') {
            return sessions || [];
        }
        return (sessions || []).filter(s => {
            if (filter === "COMPLETED") return s.completed;
            if (filter === "CANCELLED") return s.isCancelled;
            return true;
        });
    }, [sessions, filter]);

    if (isError) {
        return <div className="p-4 md:p-8">Error: {error?.message}</div>;
    }

    return (
        <div className="container mx-auto px-0 md:px-8 py-4 md:py-8 space-y-8">
            <SessionView />

            <div className="px-0 sm:p-4 sm:border sm:rounded-lg sm:shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-4 sm:px-0">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-0">Session History</h3>
                    <Select onValueChange={(value: "ALL" | "COMPLETED" | "CANCELLED") => setFilter(value)} defaultValue="ALL">
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                        ))
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <SessionItem
                                key={session.id}
                                session={session}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 px-4 sm:px-0">No sessions found for this filter.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default SessionsPage;
