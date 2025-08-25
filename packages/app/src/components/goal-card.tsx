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
        <Card key={goal.id} className="flex flex-col w-full h-80 p-5 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-emerald-600/20 rounded-lg shadow-lg">
            <CardHeader className="pb-3 px-0 pt-0">
                <CardTitle className="text-xl font-bold leading-tight text-emerald-600 dark:text-emerald-400">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-3 px-0">
                <div className="flex-grow">
                    {goal.description && <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1 h-10 line-clamp-2">{goal.description}</CardDescription>}
                </div>
                <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-emerald-600/20">
                    <Badge className={`px-2.5 py-1 rounded-full text-xs font-medium ${goal.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                        goal.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : goal.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}>
                        {goal.status}
                    </Badge>
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row mt-auto space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-emerald-600/20">
                    <Link to={`/dashboard/goals/${goal.id}`} className="flex-grow">
                        <Button variant="outline" className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-400">
                            View Details
                        </Button>
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"><Trash2Icon className="w-5 h-5" /></Button></DialogTrigger>
                        <DialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-emerald-600/20">
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