import { GoalForm } from '@/components/forms/goal-form'
import { dataService } from '@/services/api-service';
import type { GoalSchema } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

export default function GoalFormPage() {
    const [goals, setGoals] = useState<GoalSchema[]>([]);
    const id = Number(useParams().id);
    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await dataService.getGoals();
            setGoals(response.filter(g => g.id !== id));
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return (
        <div>
            <GoalForm id={id} fetchGoals={fetchGoals} goals={goals} />
        </div>
    )
}
