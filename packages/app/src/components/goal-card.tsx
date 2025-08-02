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
import { dataService } from "@/services/api-service"
import { Badge } from "./ui/badge"

function GoalCard({ goal, refresh }: { goal: GoalSchema, refresh: () => Promise<void> }) {

    async function handleDelete(id: number | undefined) {
        if (id) {
            await dataService.deleteGoal(id)
            refresh()
        }
    }
    return (
        <Card key={goal.id} className="flex flex-col w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{goal.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-center mb-4">
                    <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${goal.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                        goal.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : goal.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                        }`}>
                        {goal.status}
                    </Badge>
                    <span className="text-sm text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex mt-auto space-x-2">
                    <Link to={`/dashboard/goals/${goal.id}`} className="flex-grow">
                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                            View Details
                        </Button>
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="destructive">Delete</Button></DialogTrigger>
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
                                <Button variant="destructive" onClick={async() => handleDelete(goal.id)}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default GoalCard
