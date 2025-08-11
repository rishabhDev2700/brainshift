import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SessionSchema } from "@/types";
import { CalendarIcon, CheckIcon, ClockIcon, XIcon } from "lucide-react";

interface SessionItemProps {
    session: SessionSchema;
    handleComplete: (id: number, duration?: number) => Promise<void>;
    handleCancel: (id: number) => Promise<void>;
    isActionLoading: boolean;
}

export function SessionItem({ session, handleComplete, handleCancel, isActionLoading }: SessionItemProps) {
    const getStatusBadge = () => {
        if (session.completed) {
            return <Badge className="bg-green-500 text-white hover:bg-green-500">Completed</Badge>;
        }
        if (session.isCancelled) {
            return <Badge className="bg-red-500 text-white hover:bg-red-500">Cancelled</Badge>;
        }
        return <Badge className="bg-blue-500 text-white hover:bg-blue-500">In Progress</Badge>;
    };

    const startTime = new Date(session.startTime);
    const endTime = session.endTime ? new Date(session.endTime) : null;

    return (
        <Card className="w-full p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{startTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <ClockIcon className="h-4 w-4" />
                        <span>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {endTime && ` - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            {session.duration && ` (${session.duration} min)`}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {getStatusBadge()}
                    {!session.completed && !session.isCancelled && !session.endTime && (
                        <TooltipProvider>
                            <div className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => handleComplete(session.id!)} variant="ghost" size="icon" className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900" disabled={isActionLoading}>
                                            <CheckIcon className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Complete</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => handleCancel(session.id!)} variant="ghost" size="icon" className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900" disabled={isActionLoading}>
                                            <XIcon className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cancel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
