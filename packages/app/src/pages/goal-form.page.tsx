import { GoalForm } from '@/components/forms/goal-form'
import { useGoals } from '../hooks/useGoals';
import { useParams } from 'react-router-dom'

export default function GoalFormPage() {
    const id = Number(useParams().id);
    const { data: goals, isLoading: goalsLoading } = useGoals();

    return (
        <div>
            <GoalForm id={id} goals={goals || []} goalsLoading={goalsLoading} />
        </div>
    )
}
