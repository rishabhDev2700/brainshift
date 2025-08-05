import { useState, useEffect, useCallback, useMemo } from "react";
import { dataService } from "@/services/api-service";
import type { SessionSchema } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionItem } from "@/components/session-item";
import { PlusCircle, Loader2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SessionStartForm } from "@/components/session-start-form";
import { Pomodoro } from "@/components/pomodoro";


function SessionsPage() {
    const [sessions, setSessions] = useState<SessionSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [activeSession, setActiveSession] = useState<SessionSchema | null>(null);
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [filter, setFilter] = useState<'ALL' | "COMPLETED" | "CANCELLED">('ALL');

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedSessions = await dataService.getSessions();
            setSessions(fetchedSessions);
            const currentActiveSession = fetchedSessions.find(
                (session) => !session.completed && !session.isCancelled
            );
            setActiveSession(currentActiveSession || null);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    useEffect(() => {
        if (activeSession) {
            setShowPomodoro(true);
        }
    }, [activeSession]);

    const handleComplete = useCallback(async (id: number) => {
        setIsActionLoading(true);
        try {
            await dataService.completeSession(id, true);
            fetchSessions();
            setActiveSession(null);
        } catch (error) {
            console.error("Error completing session:", error);
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchSessions]);

    const handleCancel = useCallback(async (id: number) => {
        setIsActionLoading(true);
        try {
            await dataService.cancelSession(id);
            fetchSessions();
        } catch (error) {
            console.error("Error cancelling session:", error);
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchSessions]);

    const filteredSessions = useMemo(() => {
        if (filter === 'ALL') {
            return sessions;
        }
        return sessions.filter(s => {
            if (filter === "COMPLETED") return s.completed;
            if (filter === "CANCELLED") return s.isCancelled;
            return true;
        });
    }, [sessions, filter]);


    return (
        <div className="container mx-auto px-0 md:px-8 py-4 md:py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 px-4 md:px-0">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-4 md:mb-0">Your Sessions</h2>
                <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                    {!activeSession && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={isActionLoading}>
                                    {isActionLoading ? <Loader2Icon className="animate-spin" /> : <><PlusCircle className="mr-2 h-4 w-4" /> Start New Session</>}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Start New Session</DialogTitle>
                                </DialogHeader>
                                <SessionStartForm onSessionStart={(session) => {
                                    setActiveSession(session);
                                    fetchSessions();
                                }} isActionLoading={isActionLoading} />
                            </DialogContent>
                        </Dialog>
                    )}
                    {activeSession && (
                        <Button onClick={() => setShowPomodoro(!showPomodoro)} className="bg-blue-600 hover:bg-blue-700" disabled={isActionLoading}>
                            {isActionLoading ? <Loader2Icon className="animate-spin" /> : (showPomodoro ? "Hide Timer" : "Show Timer")}
                        </Button>
                    )}
                </div>
            </div>

            {activeSession && (
                <div className="p-4 border rounded-lg shadow-sm mb-8 mx-4 md:mx-0">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Active Session</h3>
                    <Pomodoro
                        sessionId={activeSession.id!}
                        mode={activeSession.isPomodoro ? 'pomodoro' : 'manual'}
                        workDuration={activeSession.duration}
                        initialTime={activeSession.isPomodoro ? (activeSession.duration ? activeSession.duration * 60 - Math.floor((new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000) : undefined) : (Math.floor((new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000))}
                        isResumed={true}
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                    />
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
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                        ))
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                handleComplete={handleComplete}
                                handleCancel={handleCancel}
                                isActionLoading={isActionLoading}
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
