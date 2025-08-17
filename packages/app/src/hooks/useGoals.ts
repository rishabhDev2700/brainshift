import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { GoalSchema } from '@/types';

export const useGoals = () => {
  return useQuery<GoalSchema[], Error>({
    queryKey: ['goals'],
    queryFn: dataService.getGoals,
  });
};

export const useGoalById = (id: number) => {
  return useQuery<GoalSchema, Error>({
    queryKey: ['goals', id],
    queryFn: () => dataService.getGoalById(id),
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, GoalSchema>({
    mutationFn: dataService.addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; goal: GoalSchema }>({
    mutationFn: ({ id, goal }) => dataService.updateGoal(id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (id) => dataService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
