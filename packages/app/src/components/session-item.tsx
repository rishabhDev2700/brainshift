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
            return <Badge variant="default" className="bg-green-500 text-white">Completed</Badge>;
        }
        if (session.isCancelled) {
            return <Badge variant="destructive">Cancelled</Badge>;
        }
        return <Badge variant="secondary">In Progress</Badge>;
    };

    return (
        <Card className="w-full">
            <CardContent className="p-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{new Date(session.startTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4" />
                                <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                                {session.duration && <span>- {session.duration} min</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {getStatusBadge()}
                    {!session.completed && !session.isCancelled && !session.endTime && (
                        <TooltipProvider>
                            <div className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => handleComplete(session.id!)} variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" disabled={isActionLoading}>
                                            <CheckIcon className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Complete</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => handleCancel(session.id!)} variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" disabled={isActionLoading}>
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
