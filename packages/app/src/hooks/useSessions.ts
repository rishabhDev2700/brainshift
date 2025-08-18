import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { SessionSchema } from '@/types';

export const useSessions = () => {
  return useQuery<SessionSchema[], Error>({
    queryKey: ['sessions'],
    queryFn: dataService.getSessions,
    select: (sessions) => {
      // Sort sessions by startTime in descending order (latest first)
      return [...sessions].sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });
    },
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
  return useMutation<SessionSchema, Error, SessionSchema, { previousSessions: SessionSchema[] | undefined }>({
    mutationFn: dataService.addSession,
    onMutate: async (newSession) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] });
      const previousSessions = queryClient.getQueryData<SessionSchema[]>(['sessions']);
      queryClient.setQueryData<SessionSchema[]>(['sessions'], (old) => {
        const tempId = Date.now(); // Generate a temporary ID
        return old ? [{ ...newSession, id: tempId }, ...old] : [{ ...newSession, id: tempId }];
      });
      return { previousSessions };
    },
    onError: (_err, _newSession, context) => {
      queryClient.setQueryData(['sessions'], context?.previousSessions);
    },
    onSettled: () => {
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
  return useMutation<any, Error, number, { previousSessions: SessionSchema[] | undefined }>({
    mutationFn: (id) => dataService.cancelSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] });
      const previousSessions = queryClient.getQueryData<SessionSchema[]>(['sessions']);
      queryClient.setQueryData<SessionSchema[]>(['sessions'], (old) =>
        old?.map((session) =>
          session.id === id ? { ...session, isCancelled: true } : session
        )
      );
      return { previousSessions };
    },
    onError: (_err, _newSession, context) => {
      queryClient.setQueryData(['sessions'], context?.previousSessions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; completed: boolean }, { previousSessions: SessionSchema[] | undefined }>({
    mutationFn: ({ id, completed }) => dataService.completeSession(id, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] });
      const previousSessions = queryClient.getQueryData<SessionSchema[]>(['sessions']);
      queryClient.setQueryData<SessionSchema[]>(['sessions'], (old) =>
        old?.map((session) =>
          session.id === id ? { ...session, completed: completed } : session
        )
      );
      return { previousSessions };
    },
    onError: (_err, _newSession, context) => {
      queryClient.setQueryData(['sessions'], context?.previousSessions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};