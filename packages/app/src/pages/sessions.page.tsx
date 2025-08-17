import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionItem } from "@/components/session-item";
import { PlusCircle, Loader2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SessionStartForm } from "@/components/forms/session-start-form";
import { ActiveSessionTimer } from "@/components/active-session-timer";
import { useSessions, useCompleteSession, useCancelSession } from "../hooks/useSessions";
import { useQueryClient } from "@tanstack/react-query";

function SessionsPage() {
    const [filter, setFilter] = useState<'ALL' | "COMPLETED" | "CANCELLED">('ALL');
    const queryClient = useQueryClient();

    const { data: sessions, isLoading, isError, error } = useSessions();
    const completeSessionMutation = useCompleteSession();
    const cancelSessionMutation = useCancelSession();

    const activeSession = sessions?.find((session) => !session.completed && !session.isCancelled);

    const handleComplete = useCallback((id: number) => {
        completeSessionMutation.mutate({ id, completed: true });
    }, [completeSessionMutation]);

    const handleCancel = useCallback((id: number) => {
        cancelSessionMutation.mutate(id);
    }, [cancelSessionMutation]);

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

    const isActionLoading = completeSessionMutation.isPending || cancelSessionMutation.isPending;

    return (
        <div className="container mx-auto px-0 md:px-8 py-4 md:py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 px-4 md:px-0">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-4 md:mb-0">Your Sessions</h2>
                <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                    {!activeSession && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-800 text-white hover:bg-emerald-600" disabled={isActionLoading}>
                                    {isActionLoading ? <Loader2Icon className="animate-spin" /> : <><PlusCircle className="mr-2 h-4 w-4" /> Start New Session</>}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Start New Session</DialogTitle>
                                </DialogHeader>
                                <SessionStartForm onSessionStart={() => {
                                    queryClient.invalidateQueries({ queryKey: ['sessions'] });
                                }} />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {activeSession && (
                <div className="p-4 border rounded-lg shadow-sm mb-8 mx-4 md:mx-0">
                    <ActiveSessionTimer
                        session={activeSession}
                        onComplete={handleComplete}
                    />
                    <div className="flex gap-4 mt-4">
                        <Button onClick={() => handleComplete(activeSession.id!)} className="bg-green-600 hover:bg-green-700" disabled={isActionLoading}>
                            Mark as Complete
                        </Button>
                        <Button onClick={() => handleCancel(activeSession.id!)} className="bg-red-600 hover:bg-red-700" disabled={isActionLoading}>
                            Cancel Session
                        </Button>
                    </div>
                </div>
            )}

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