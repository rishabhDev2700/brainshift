import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SessionSchema } from "@/types";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface SessionItemProps {
    session: SessionSchema;
    isActionLoading: boolean;
}

export function SessionItem({ session }: SessionItemProps) {
    const getStatusBadge = () => {
        if (session.completed) {
            return <Badge className="bg-green-800 text-white hover:bg-green-700">Completed</Badge>;
        }
        if (session.isCancelled) {
            return <Badge className="bg-red-800 text-white hover:bg-red-700">Cancelled</Badge>;
        }
        return <Badge className="bg-blue-800 text-white hover:bg-blue700">In Progress</Badge>;
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
                </div>
            </CardContent>
        </Card>
    );
}
