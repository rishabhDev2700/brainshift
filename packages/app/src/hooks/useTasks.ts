import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { TaskSchema } from '@/types';

export const useTasks = () => {
  return useQuery<TaskSchema[], Error>({
    queryKey: ['tasks'],
    queryFn: dataService.getTasks,
  });
};

export const useTaskById = (id: number) => {
  return useQuery<TaskSchema, Error>({
    queryKey: ['tasks', id],
    queryFn: () => dataService.getTaskById(id),
    enabled: !!id,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, TaskSchema>({
    mutationFn: dataService.addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; data: TaskSchema }>({
    mutationFn: ({ id, data }) => dataService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (id) => dataService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
