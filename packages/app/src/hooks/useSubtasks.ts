import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { SubtaskSchema } from '@/types';

export const useAllSubtasksForUser = () => {
  return useQuery<SubtaskSchema[], Error>({
    queryKey: ['subtasks'],
    queryFn: dataService.getAllSubtasksForUser,
  });
};

export const useAddSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { taskID: number; data: SubtaskSchema }>({
    mutationFn: ({ taskID, data }) => dataService.addSubtask(taskID, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Subtasks are related to tasks
    },
  });
};

export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { taskID: number; id: number; data: SubtaskSchema }>({
    mutationFn: ({ taskID, id, data }) => dataService.updateSubtask(taskID, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { taskID: number; id: number }>({
    mutationFn: ({ taskID, id }) => dataService.deleteSubtask(taskID, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
