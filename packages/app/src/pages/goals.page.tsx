import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { GoalSchema } from '@/types'
import GoalCard from '@/components/goal-card'
import GoalsGraph from '@/components/goals-graph';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


function GoalsPage() {
    const [goals, setGoals] = useState<GoalSchema[]>([]);
    const [loading, setLoading] = useState<Boolean>(true)
    const [graphToggle, setGraphToggle] = useState<boolean>(false)
    useEffect(() => {
        fetchGoals();

    }, []);

    const fetchGoals = async () => {
        setLoading(true)
        try {
            const response = await dataService.getGoals();
            setGoals(response);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="space-y-8">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Your Goals</h2>
                    <Link to="/dashboard/goals/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
                        </Button>
                    </Link>
                </div>
                <Button className='mt-4' variant="outline" onClick={() => setGraphToggle(!graphToggle)}>Toggle {graphToggle ? "List" : "Graph"}</Button>
            </div>
            {graphToggle ? <GoalsGraph goals={goals} /> : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="flex flex-col w-full h-full p-5 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                                <CardHeader className="pb-3 px-0 pt-0">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-between pt-3 px-0">
                                    <div className="flex items-center justify-between text-sm mb-4">
                                        <Skeleton className="h-5 w-1/4 rounded-full" />
                                        <Skeleton className="h-5 w-1/3" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row mt-auto space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-10 rounded-md" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : Array.isArray(goals) ?
                        goals.map(goal => (
                            <GoalCard key={goal.id} goal={goal} refresh={fetchGoals} />
                        ))
                        : (
                            <p className="text-gray-500 col-span-3">No Goals found. Add a new goal to get started!</p>
                        )}
                </div>)}
        </div>
    )
}

export default GoalsPage