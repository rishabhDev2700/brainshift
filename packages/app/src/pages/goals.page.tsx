import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { GoalSchema } from '@/types'


function GoalsPage() {
    const [goals, setGoals] = useState<GoalSchema[]>([]);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await dataService.getGoals();
            setGoals(response);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };


    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Your Goals</h2>
                <Link to="/dashboard/goals/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(goals) ? (
                    goals.map(goal => (
                        <Card key={goal.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{goal.title}</CardTitle>
                                <CardDescription>{goal.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end">
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${goal.status === "NOT STARTED" ? "bg-gray-200 text-gray-800" :
                                        goal.status === "IN PROGRESS" ? "bg-blue-200 text-blue-800" : goal.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-amber-200 text-red-80"
                                        }`}>
                                        {goal.status}
                                    </span>
                                    <span className="text-sm text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex mt-4 space-x-2">
                                    <Link to={`/dashboard/goals/${goal.id}`} className="flex-grow">
                                        <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                                            View Details
                                        </Button>
                                    </Link>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3">No Goals found. Add a new goal to get started!</p>
                )}
            </div>
        </div>
    )
}

export default GoalsPage