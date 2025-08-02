import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { dataService } from '@/services/api-service'
import type { GoalSchema } from '@/types'
import GoalCard from '@/components/goal-card'


function GoalsPage() {
    const [goals, setGoals] = useState<GoalSchema[]>([]);
    const [loading, setLoading] = useState<Boolean>(true)
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
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Your Goals</h2>
                <Link to="/dashboard/goals/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? <Loader2 color='green' className='animate-spin fixed top-1/2 left-1/2 scale-200' /> : Array.isArray(goals) ?
                    goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} refresh={fetchGoals} />
                    ))
                    : (
                        <p className="text-gray-500 col-span-3">No Goals found. Add a new goal to get started!</p>
                    )}
            </div>
        </div>
    )
}

export default GoalsPage