import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { GoalSchema } from "@/types"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "./ui/badge"
import { CalendarIcon, Trash2Icon } from "lucide-react"
import { useDeleteGoal } from "../hooks/useGoals";
import { toast } from "sonner";

function GoalCard({ goal }: { goal: GoalSchema }) {
    const deleteGoalMutation = useDeleteGoal();

    async function handleDelete(id: number | undefined) {
        if (id) {
            deleteGoalMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Goal deleted successfully!");
                },
                onError: (error) => {
                    console.error("Error deleting goal:", error);
                    toast.error("Failed to delete goal.");
                }
            });
        }
    }
    return (
        <Card key={goal.id} className="flex flex-col w-full h-full p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="pb-3 px-0 pt-0">
                <CardTitle className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100">{goal.title}</CardTitle>
                {goal.description && <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{goal.description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-3 px-0">
                <div className="flex items-center justify-between text-sm mb-4">
                    <Badge className={`px-2.5 py-1 rounded-full text-xs font-medium ${goal.status === "NOT STARTED" ? "bg-gray-100 text-gray-700" :
                        goal.status === "IN PROGRESS" ? "bg-blue-100 text-blue-700" : goal.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {goal.status}
                    </Badge>
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row mt-auto space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link to={`/dashboard/goals/${goal.id}`} className="flex-grow">
                        <Button variant="outline" className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-400">
                            View Details
                        </Button>
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"><Trash2Icon className="w-5 h-5" /></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your goal
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={() => handleDelete(goal.id)}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default GoalCard
