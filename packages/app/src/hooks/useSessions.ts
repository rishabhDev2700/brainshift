import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { SessionSchema } from '@/types';

export const useSessions = () => {
  return useQuery<SessionSchema[], Error>({
    queryKey: ['sessions'],
    queryFn: dataService.getSessions,
  });
};

export const useSessionById = (id: number) => {
  return useQuery<SessionSchema, Error>({
    queryKey: ['sessions', id],
    queryFn: () => dataService.getSessionById(id),
  });
};

export const useAddSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, SessionSchema>({
    mutationFn: dataService.addSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; data: Partial<SessionSchema> }>({
    mutationFn: ({ id, data }) => dataService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (id) => dataService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCancelSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (id) => dataService.cancelSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; completed: boolean }>({
    mutationFn: ({ id, completed }) => dataService.completeSession(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
