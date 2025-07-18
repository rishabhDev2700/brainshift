import { GoalForm } from '@/components/forms/goal-form'
import { dataService } from '@/services/api-service';
import type { GoalSchema } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

export default function GoalFormPage() {
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
    const id = Number(useParams().id);

    return (
        <div>
            <GoalForm id={id} fetchGoals={fetchGoals} goals={goals} />
        </div>
    )
}
