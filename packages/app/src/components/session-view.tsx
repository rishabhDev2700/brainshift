import { useSessions, useAddSession, useCompleteSession, useCancelSession } from "../hooks/useSessions";
import { ActiveSessionTimer } from "./active-session-timer";
import { SessionStartForm } from "./forms/session-start-form";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import type { SessionSchema } from "@/types";
import { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type PomodoroPhase = 'work' | 'break';

export function SessionView() {
    const queryClient = useQueryClient();
    const { data: sessions, isLoading } = useSessions();
    const addSessionMutation = useAddSession();
    const completeSessionMutation = useCompleteSession();
    const cancelSessionMutation = useCancelSession();

    const [timingSession, setTimingSession] = useState<SessionSchema | null>(null);
    const [currentPhase, setCurrentPhase] = useState<PomodoroPhase>('work');
    const [remainingTime, setRemainingTime] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const originalPomodoroSession = useRef<SessionSchema | null>(null);

    const activeSession = sessions?.find((session) => !session.completed && !session.isCancelled);

    useEffect(() => {
        if (activeSession) {
            setTimingSession(activeSession);
            if (activeSession.isPomodoro && !originalPomodoroSession.current) {
                originalPomodoroSession.current = activeSession;
            }
        } else {
            if (currentPhase !== 'break') {
                setTimingSession(null);
                originalPomodoroSession.current = null;
            }
        }
    }, [activeSession, currentPhase]);

    useEffect(() => {
        if (!timingSession) return;

        const isPomodoro = timingSession.isPomodoro && timingSession.duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const start = new Date(timingSession.startTime).getTime();

            if (isPomodoro) {
                const phaseDuration = (currentPhase === 'work' ? originalPomodoroSession.current?.duration! : originalPomodoroSession.current?.breakDuration!) * 60;
                const elapsed = Math.floor((now - start) / 1000);
                const remaining = phaseDuration - elapsed;
                setRemainingTime(remaining);

                if (remaining <= 0) {
                    if (currentPhase === 'work') {
                        toast.info("Work period ended! Time for a break.");
                        if (timingSession.id) {
                            completeSessionMutation.mutate({ id: timingSession.id, completed: true });
                        }
                        setCurrentPhase('break');
                        const breakSession: SessionSchema = {
                            ...originalPomodoroSession.current!,
                            id: 0, // Temporary ID
                            startTime: new Date().toISOString(),
                        };
                        setTimingSession(breakSession);
                    } else { // break ended
                        if (!isTransitioning) {
                            toast.info("Break ended! Starting new work period.");
                            handlePomodoroCycleComplete(originalPomodoroSession.current!);
                            setIsTransitioning(true);
                        }
                    }
                }
            } else { // Manual session
                const elapsed = Math.floor((now - start) / 1000);
                setRemainingTime(elapsed);
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [timingSession, currentPhase, completeSessionMutation, isTransitioning]);

    const handleComplete = useCallback((id: number) => {
        completeSessionMutation.mutate({ id, completed: true });
        setTimingSession(null);
        originalPomodoroSession.current = null;
        setIsTransitioning(false);
    }, [completeSessionMutation]);

    const handleCancel = useCallback((id:number) => {
        if(id) cancelSessionMutation.mutate(id);
        setTimingSession(null);
        originalPomodoroSession.current = null;
        setIsTransitioning(false);
    }, [cancelSessionMutation]);

    const handlePomodoroCycleComplete = useCallback((session: SessionSchema) => {
        const { id, targetId, ...newSessionData } = session;
        addSessionMutation.mutate({
            ...newSessionData,
            targetId: targetId === null ? undefined : targetId,
            duration: originalPomodoroSession.current?.duration,
            breakDuration: originalPomodoroSession.current?.breakDuration,
            startTime: new Date().toISOString(),
            completed: false,
            isCancelled: false,
        }, {
            onSuccess: (newSession) => {
                setCurrentPhase('work');
                setTimingSession(newSession);
                setIsTransitioning(false);
            }
        });
    }, [addSessionMutation]);


    if (isLoading) {
        return <div>Loading Sessions...</div>;
    }

    if (timingSession) {
        return (
            <div className="p-4 border rounded-lg shadow-sm mb-8 mx-4 md:mx-0">
                <ActiveSessionTimer session={timingSession} currentPhase={currentPhase} remainingTime={remainingTime} />
                <div className="flex gap-4 mt-4">
                    <Button onClick={() => handleComplete(timingSession.id!)} className="bg-green-600 hover:bg-green-700" disabled={completeSessionMutation.isPending}>
                        Mark as Complete
                    </Button>
                    <Button onClick={() => handleCancel(timingSession.id!)} className="bg-red-600 hover:bg-red-700" disabled={cancelSessionMutation.isPending}>
                        Cancel Session
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-lg shadow-sm mb-8 mx-4 md:mx-0">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-4 md:mb-0">Start a Session</h2>
            <SessionStartForm onSessionStart={(session) => {
                queryClient.invalidateQueries({ queryKey: ['sessions'] });
                if(session.isPomodoro){
                    originalPomodoroSession.current = session;
                    setCurrentPhase('work');
                }
                setTimingSession(session);
            }} />
        </div>
    );
}