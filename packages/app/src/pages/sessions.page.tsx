import { useState, useEffect } from "react";
import { dataService } from "@/services/api-service";
import type { SessionSchema } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SessionStartForm } from "@/components/session-start-form";
import { Pomodoro } from "@/components/pomodoro";

function SessionsPage() {
    const [sessions, setSessions] = useState<SessionSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPomodoro, setShowPomodoro] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const fetchedSessions = await dataService.getSessions();
            setSessions(fetchedSessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await dataService.completeSession(id, true);
            fetchSessions();
        } catch (error) {
            console.error("Error completing session:", error);
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await dataService.cancelSession(id);
            fetchSessions();
        } catch (error) {
            console.error("Error cancelling session:", error);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Your Sessions</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Start New Session
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Start New Session</DialogTitle>
                        </DialogHeader>
                        <SessionStartForm onSessionStart={fetchSessions} />
                    </DialogContent>
                </Dialog>
                <Button onClick={() => setShowPomodoro(!showPomodoro)} className="bg-blue-600 hover:bg-blue-700 ml-2">
                    {showPomodoro ? "Hide Pomodoro" : "Show Pomodoro"}
                </Button>
            </div>

            {showPomodoro && (
                <div className="flex justify-center">
                    <Pomodoro />
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p>Loading sessions...</p>
                ) : sessions.length > 0 ? (
                    sessions.map((session) => (
                        <Card key={session.id}>
                            <CardHeader>
                                <CardTitle>Session ID: {session.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Type: {session.targetType}</p>
                                <p>Target ID: {session.targetId}</p>
                                <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
                                {session.endTime && <p>End Time: {new Date(session.endTime).toLocaleString()}</p>}
                                {session.duration && <p>Duration: {session.duration} minutes</p>}
                                <p>Status: {session.completed ? "Completed" : session.isCancelled ? "Cancelled" : "In Progress"}</p>
                                <div className="flex space-x-2 mt-4">
                                    {!session.completed && !session.isCancelled && (
                                        <Button onClick={() => handleComplete(session.id!)} variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Complete</Button>
                                    )}
                                    {!session.completed && !session.isCancelled && (
                                        <Button onClick={() => handleCancel(session.id!)} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Cancel</Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500">No sessions found. Start a new session to get started!</p>
                )}
            </div>
        </div>
    );
}

export default SessionsPage;
