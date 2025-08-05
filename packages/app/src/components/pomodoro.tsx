import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PomodoroProps {
    mode: 'pomodoro' | 'manual';
    workDuration?: number;
    breakDuration?: number;
    onComplete?: (sessionId: number, duration?: number) => void;
    onCancel?: (sessionId: number) => void;
    sessionId: number;
    initialTime?: number;
    isResumed?: boolean;
}

export function Pomodoro({ mode, workDuration = 25, breakDuration = 5, onComplete, onCancel, sessionId, initialTime, isResumed }: PomodoroProps) {
    const [time, setTime] = useState(initialTime || (mode === 'pomodoro' ? workDuration * 60 : 0));
    const [isRunning, setIsRunning] = useState(isResumed || false);
    const [isWorkTime, setIsWorkTime] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (isRunning) {
            if (mode === 'pomodoro') {
                if (time > 0) {
                    timer = setInterval(() => {
                        setTime((prevTime) => prevTime - 1);
                    }, 1000);
                } else {
                    if (isWorkTime) {
                        toast.info("Work session complete!");
                        setIsRunning(false);
                        if (onComplete) onComplete(sessionId);
                    } else {
                        toast.success("Break complete! Ready for next work session.");
                        setIsWorkTime(true);
                        setTime(workDuration * 60);
                    }
                }
            } else {
                timer = setInterval(() => {
                    setTime((prevTime) => prevTime + 1);
                }, 1000);
            }
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning, time, isWorkTime, workDuration, breakDuration, sessionId, onComplete, mode]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        if (mode === 'pomodoro') {
            setIsWorkTime(true);
            setTime(workDuration * 60);
        } else {
            setTime(0);
        }
        toast.info(`Timer reset.`);
    };

    const handleComplete = () => {
        setIsRunning(false);
        toast.success("Session completed manually.");
        if (onComplete) {
            if (mode === 'manual') {
                onComplete(sessionId, time);
            } else {
                onComplete(sessionId);
            }
        }
    };

    const handleCancel = () => {
        setIsRunning(false);
        toast.warning("Session cancelled.");
        if (onCancel) onCancel(sessionId);
    };

    return (
        <TooltipProvider>
            <Card className="w-full max-w-xs mx-auto text-center p-4">
                <CardHeader className="p-0">
                    <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-300">
                        {mode === 'pomodoro' ? (isWorkTime ? "Work Time" : "Break Time") : "Manual Timer"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    <div className="relative w-48 h-48 mx-auto">
                        {mode === 'pomodoro' && (
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-300"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-emerald-600 transition-all duration-1000 ease-linear"
                                    strokeWidth="5"
                                    strokeDasharray={2 * Math.PI * 40}
                                    strokeDashoffset={(2 * Math.PI * 40) - (time / (isWorkTime ? workDuration * 60 : breakDuration * 60)) * (2 * Math.PI * 40)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-emerald-600 tracking-tight">
                            {formatTime(time)}
                        </div>
                    </div>
                    <div className="flex justify-center space-x-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handlePlayPause} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
                                    {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isRunning ? "Pause" : "Play"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleReset} size="icon" variant="outline">
                                    <RotateCcw className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleComplete} size="icon" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                    <CheckCircle className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Complete</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleCancel} size="icon" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                    <XCircle className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cancel</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
